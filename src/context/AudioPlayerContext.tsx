'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SEMI_TRACKS } from '@/data/semi-songs';
import { PERSIST_ALBUM_META, PERSIST_TRACKS } from '@/data/persist-songs';
import { AUDIO_MASTER_REV } from '@/data/audio-manifest';

export interface DockTrack {
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  duration: string;
  mp3Src: string;
  href: string;
  album: 'I/O' | 'Persist';
  artworkSrc: string;
  downloadName?: string;
}

interface AudioPlayerContextValue {
  currentTrack: DockTrack;
  queueAlbum: 'io' | 'persist';
  hasStarted: boolean;
  isPlaying: boolean;
  playAllActive: boolean;
  audioError: string | null;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (slugOrIndex: string | number) => void;
  playAll: () => void;
  playPersistTrack: (slug: string, token: string) => void;
  playPersistAll: (token: string) => void;
  selectTrack: (slugOrIndex: string | number) => void;
  togglePlay: () => void;
  pauseAudio: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  setVolume: (level: number) => void;
  toggleMute: () => void;
  dismissDock: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

const IO_QUEUE: DockTrack[] = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src)).map((t) => ({
  number: t.number,
  slug: t.slug,
  title: t.title,
  subtitle: t.subtitle,
  duration: t.duration,
  mp3Src: withMasterRev(t.mp3Src!),
  href: `/songs/${t.slug}`,
  album: 'I/O',
  artworkSrc: '/photos/io-album-cover.jpg',
  downloadName: t.downloadName,
}));

function buildPersistQueue(token: string): DockTrack[] {
  return PERSIST_TRACKS.map((t) => ({
    number: t.number,
    slug: t.slug,
    title: t.title,
    subtitle: `Persist · ${t.zoneLabel}`,
    duration: t.duration,
    mp3Src: `/api/persist/audio/${t.slug}?token=${encodeURIComponent(token)}`,
    href: `/persist/${t.slug}`,
    album: 'Persist',
    artworkSrc: PERSIST_ALBUM_META.coverSrc,
    // Strictly stream-only: never attach downloadName for Persist
  }));
}

const VOLUME_STORAGE_KEY = 'semi_player_volume';
const DEFAULT_VOLUME = 0.85;

function withMasterRev(src: string): string {
  const param = `v=${AUDIO_MASTER_REV}`;
  return src.includes('?') ? `${src}&${param}` : `${src}?${param}`;
}

function parseDurationFallback(label: string): number {
  const parts = label.split(':').map((p) => Number(p));
  if (parts.length === 2 && Number.isFinite(parts[0]) && Number.isFinite(parts[1])) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingSeekRef = useRef<number | null>(null);
  const lastSeekAtRef = useRef<number>(0);

  const [queue, setQueue] = useState<DockTrack[]>(IO_QUEUE);
  const [queueAlbum, setQueueAlbum] = useState<'io' | 'persist'>('io');
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAllActive, setPlayAllActive] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === 'undefined') return DEFAULT_VOLUME;
    try {
      const saved = window.localStorage.getItem(VOLUME_STORAGE_KEY);
      if (saved !== null) {
        const parsed = Number(saved);
        if (Number.isFinite(parsed) && parsed >= 0 && parsed <= 1) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage access errors
    }
    return DEFAULT_VOLUME;
  });
  const [isMuted, setIsMuted] = useState(false);

  const queueRef = useRef<DockTrack[]>(queue);
  const activeIndexRef = useRef(activeIndex);
  const playAllRef = useRef(playAllActive);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

  useEffect(() => {
    queueRef.current = queue;
  }, [queue]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    playAllRef.current = playAllActive;
  }, [playAllActive]);

  useEffect(() => {
    volumeRef.current = volume;
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    isMutedRef.current = isMuted;
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const currentTrack: DockTrack = queue[activeIndex] ?? queue[0] ?? IO_QUEUE[0];

  const syncMediaSession = useCallback((track: DockTrack) => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'Semi (; - ])',
        album: track.album,
        artwork: [{ src: track.artworkSrc, sizes: '1400x1400', type: 'image/jpeg' }],
      });
    } catch {
      // Ignore unsupported MediaMetadata environments
    }
  }, []);

  useEffect(() => {
    const el = new Audio();
    el.preload = 'metadata';
    el.setAttribute('playsinline', 'true');
    el.setAttribute('webkit-playsinline', 'true');
    el.src = IO_QUEUE[0].mp3Src;
    el.volume = volumeRef.current;
    el.muted = isMutedRef.current;
    audioRef.current = el;

    const onTimeUpdate = () => {
      if (Date.now() - lastSeekAtRef.current < 180) return;
      setCurrentTime(el.currentTime);
    };

    const onDurationUpdate = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
        if (typeof navigator !== 'undefined' && 'mediaSession' in navigator && 'setPositionState' in navigator.mediaSession) {
          try {
            navigator.mediaSession.setPositionState({
              duration: el.duration,
              playbackRate: el.playbackRate || 1,
              position: Math.min(el.currentTime || 0, el.duration),
            });
          } catch {
            // Ignore unsupported position state
          }
        }
      }
      if (pendingSeekRef.current !== null && el.readyState >= 1) {
        const target = pendingSeekRef.current;
        pendingSeekRef.current = null;
        try {
          el.currentTime = target;
          setCurrentTime(target);
        } catch {
          // Ignore seek errors before buffer ready
        }
      }
    };

    const onEnded = () => {
      const q = queueRef.current;
      if (playAllRef.current && activeIndexRef.current < q.length - 1) {
        const nextIdx = activeIndexRef.current + 1;
        activeIndexRef.current = nextIdx;
        const next = q[nextIdx];
        setActiveIndex(nextIdx);
        setCurrentTime(0);
        setDuration(parseDurationFallback(next.duration));
        el.preload = 'auto';
        el.src = next.mp3Src;
        el.load();
        syncMediaSession(next);

        const p = el.play();
        if (p) {
          p.catch(() => {
            const onCanPlay = () => {
              el.removeEventListener('canplay', onCanPlay);
              el.play().catch(() => setIsPlaying(false));
            };
            el.addEventListener('canplay', onCanPlay, { once: true });
          });
        }
        return;
      }
      setPlayAllActive(false);
      setIsPlaying(false);
      setCurrentTime(0);
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'paused';
        } catch {
          // ignore
        }
      }
    };

    const onPlay = () => {
      setAudioError(null);
      setIsPlaying(true);
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'playing';
        } catch {
          // ignore
        }
      }
    };
    const onPause = () => {
      setIsPlaying(false);
      if (typeof navigator !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'paused';
        } catch {
          // ignore
        }
      }
    };
    const onError = () => {
      setIsPlaying(false);
      setAudioError('Could not load this track. Check your connection or re-unlock your pass.');
    };

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('loadedmetadata', onDurationUpdate);
    el.addEventListener('durationchange', onDurationUpdate);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);
    el.addEventListener('error', onError);

    return () => {
      el.pause();
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('loadedmetadata', onDurationUpdate);
      el.removeEventListener('durationchange', onDurationUpdate);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('error', onError);
    };
  }, [syncMediaSession]);

  const startFromQueue = useCallback(
    (nextQueue: DockTrack[], album: 'io' | 'persist', idx: number) => {
      const el = audioRef.current;
      const sameQueue = queueRef.current === nextQueue || (album === queueAlbum && album === 'io');
      queueRef.current = nextQueue;
      setQueue(nextQueue);
      setQueueAlbum(album);
      setHasStarted(true);
      setPlayAllActive(true);
      playAllRef.current = true;
      if (!el) return;

      el.preload = 'auto';
      const target = nextQueue[idx] ?? nextQueue[0];
      const resolvedSrc =
        typeof window !== 'undefined'
          ? new URL(target.mp3Src, window.location.origin).href
          : target.mp3Src;

      if (!sameQueue || idx !== activeIndexRef.current || el.src !== resolvedSrc) {
        pendingSeekRef.current = null;
        activeIndexRef.current = idx;
        setActiveIndex(idx);
        setCurrentTime(0);
        setDuration(parseDurationFallback(target.duration));
        el.src = target.mp3Src;
        syncMediaSession(target);
        const p = el.play();
        if (p) {
          p.catch((err) => {
            if (err?.name !== 'AbortError') setIsPlaying(false);
          });
        }
      } else if (el.paused) {
        syncMediaSession(target);
        const p = el.play();
        if (p) {
          p.catch((err) => {
            if (err?.name !== 'AbortError') setIsPlaying(false);
          });
        }
      } else {
        el.pause();
      }
    },
    [queueAlbum, syncMediaSession]
  );

  const resolveIoIndex = useCallback((slugOrIndex: string | number): number => {
    if (typeof slugOrIndex === 'number') {
      return (slugOrIndex + IO_QUEUE.length) % IO_QUEUE.length;
    }
    const found = IO_QUEUE.findIndex((t) => t.slug === slugOrIndex || t.number === slugOrIndex);
    return found >= 0 ? found : 0;
  }, []);

  const selectTrack = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIoIndex(slugOrIndex);
      const el = audioRef.current;
      queueRef.current = IO_QUEUE;
      setQueue(IO_QUEUE);
      setQueueAlbum('io');
      if (!el) return;
      if (idx !== activeIndexRef.current || queueAlbum !== 'io') {
        const target = IO_QUEUE[idx];
        el.pause();
        pendingSeekRef.current = null;
        el.src = target.mp3Src;
        el.load();
        activeIndexRef.current = idx;
        setCurrentTime(0);
        setDuration(parseDurationFallback(target.duration));
        setActiveIndex(idx);
        syncMediaSession(target);
      }
    },
    [queueAlbum, resolveIoIndex, syncMediaSession]
  );

  const playTrack = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIoIndex(slugOrIndex);
      startFromQueue(IO_QUEUE, 'io', idx);
    },
    [resolveIoIndex, startFromQueue]
  );

  const playAll = useCallback(() => {
    const el = audioRef.current;
    if (queueAlbum === 'io' && playAllRef.current && el && !el.paused) {
      el.pause();
      return;
    }
    startFromQueue(IO_QUEUE, 'io', 0);
  }, [queueAlbum, startFromQueue]);

  const playPersistTrack = useCallback(
    (slug: string, token: string) => {
      const persistQueue = buildPersistQueue(token);
      const idx = Math.max(0, persistQueue.findIndex((t) => t.slug === slug));
      const el = audioRef.current;
      if (
        queueAlbum === 'persist' &&
        activeIndexRef.current === idx &&
        el &&
        el.src.includes(`/api/persist/audio/${slug}`)
      ) {
        if (el.paused) {
          el.play().catch((err) => {
            if (err?.name !== 'AbortError') setIsPlaying(false);
          });
        } else {
          el.pause();
        }
        return;
      }
      startFromQueue(persistQueue, 'persist', idx);
    },
    [queueAlbum, startFromQueue]
  );

  const playPersistAll = useCallback(
    (token: string) => {
      const el = audioRef.current;
      if (queueAlbum === 'persist' && el && !el.paused) {
        el.pause();
        return;
      }
      const persistQueue = buildPersistQueue(token);
      const idx = queueAlbum === 'persist' ? activeIndexRef.current : 0;
      startFromQueue(persistQueue, 'persist', idx);
    },
    [queueAlbum, startFromQueue]
  );

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    setHasStarted(true);
    if (!el) return;
    el.preload = 'auto';
    if (el.paused) {
      const q = queueRef.current;
      syncMediaSession(q[activeIndexRef.current] ?? q[0]);
      const p = el.play();
      if (p) {
        p.catch((err) => {
          if (err?.name !== 'AbortError') setIsPlaying(false);
        });
      }
    } else {
      el.pause();
    }
  }, [syncMediaSession]);

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const nextTrack = useCallback(() => {
    const q = queueRef.current;
    const nextIdx = (activeIndexRef.current + 1) % q.length;
    const el = audioRef.current;
    const wasPlaying = isPlaying;
    const target = q[nextIdx];
    activeIndexRef.current = nextIdx;
    setActiveIndex(nextIdx);
    setHasStarted(true);
    if (!el) return;
    el.preload = 'auto';
    pendingSeekRef.current = null;
    setCurrentTime(0);
    setDuration(parseDurationFallback(target.duration));
    el.src = target.mp3Src;
    syncMediaSession(target);
    if (wasPlaying) {
      const p = el.play();
      if (p) {
        p.catch((err) => {
          if (err?.name !== 'AbortError') setIsPlaying(false);
        });
      }
    } else {
      el.load();
    }
  }, [isPlaying, syncMediaSession]);

  const prevTrack = useCallback(() => {
    const q = queueRef.current;
    const prevIdx = (activeIndexRef.current - 1 + q.length) % q.length;
    const el = audioRef.current;
    const wasPlaying = isPlaying;
    const target = q[prevIdx];
    activeIndexRef.current = prevIdx;
    setActiveIndex(prevIdx);
    setHasStarted(true);
    if (!el) return;
    el.preload = 'auto';
    pendingSeekRef.current = null;
    setCurrentTime(0);
    setDuration(parseDurationFallback(target.duration));
    el.src = target.mp3Src;
    syncMediaSession(target);
    if (wasPlaying) {
      const p = el.play();
      if (p) {
        p.catch((err) => {
          if (err?.name !== 'AbortError') setIsPlaying(false);
        });
      }
    } else {
      el.load();
    }
  }, [isPlaying, syncMediaSession]);

  const seek = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return;
    const el = audioRef.current;
    const q = queueRef.current;
    const maxDur =
      el && Number.isFinite(el.duration) && el.duration > 0
        ? el.duration
        : parseDurationFallback((q[activeIndexRef.current] ?? q[0]).duration) || 300;
    const clamped = Math.max(0, Math.min(seconds, maxDur));

    lastSeekAtRef.current = Date.now();
    setCurrentTime(clamped);

    if (!el) return;
    el.preload = 'auto';

    if (el.readyState >= 1) {
      pendingSeekRef.current = null;
      try {
        el.currentTime = clamped;
      } catch (err) {
        console.warn('[AudioPlayer] Seek failed:', err);
      }
    } else {
      pendingSeekRef.current = clamped;
      el.load();
    }
  }, []);

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.setActionHandler('play', () => togglePlay());
      navigator.mediaSession.setActionHandler('pause', () => pauseAudio());
      navigator.mediaSession.setActionHandler('previoustrack', () => prevTrack());
      navigator.mediaSession.setActionHandler('nexttrack', () => nextTrack());
      navigator.mediaSession.setActionHandler('seekto', (details) => {
        if (typeof details.seekTime === 'number') {
          seek(details.seekTime);
        }
      });
    } catch {
      // Ignore unsupported MediaSession action handlers
    }
  }, [togglePlay, pauseAudio, prevTrack, nextTrack, seek]);

  const setVolume = useCallback((level: number) => {
    const clamped = Math.max(0, Math.min(1, Number.isFinite(level) ? level : DEFAULT_VOLUME));
    setVolumeState(clamped);
    if (clamped > 0 && isMutedRef.current) {
      setIsMuted(false);
    }
    try {
      window.localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
    } catch {
      // Ignore storage access errors
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const dismissDock = useCallback(() => {
    audioRef.current?.pause();
    setPlayAllActive(false);
    setHasStarted(false);
  }, []);

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        queueAlbum,
        hasStarted,
        isPlaying,
        playAllActive,
        audioError,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        playAll,
        playPersistTrack,
        playPersistAll,
        selectTrack,
        togglePlay,
        pauseAudio,
        nextTrack,
        prevTrack,
        seek,
        setVolume,
        toggleMute,
        dismissDock,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('useAudioPlayer must be used within AudioPlayerProvider');
  }
  return ctx;
}
