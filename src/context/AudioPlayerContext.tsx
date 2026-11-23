'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { SEMI_TRACKS, type SemiTrack } from '@/data/semi-songs';
import { AUDIO_MASTER_REV } from '@/data/audio-manifest';

interface AudioPlayerContextValue {
  currentTrack: SemiTrack;
  hasStarted: boolean;
  isPlaying: boolean;
  playAllActive: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (slugOrIndex: string | number) => void;
  playAll: () => void;
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

// Site player strictly features the 12-track commercial album I/O (no bonus/alternate takes)
const PLAYABLE_TRACKS = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src));
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

  const [activeIndex, setActiveIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAllActive, setPlayAllActive] = useState(false);
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
      // Ignore storage access errors in private browsing
    }
    return DEFAULT_VOLUME;
  });
  const [isMuted, setIsMuted] = useState(false);

  const activeIndexRef = useRef(activeIndex);
  const playAllRef = useRef(playAllActive);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);

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

  const currentTrack: SemiTrack = PLAYABLE_TRACKS[activeIndex] ?? PLAYABLE_TRACKS[0];

  const syncMediaSession = useCallback((track: SemiTrack) => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return;
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: 'Semi (; - ])',
        album: 'I/O',
        artwork: [
          { src: '/photos/io-album-cover.jpg', sizes: '1400x1400', type: 'image/jpeg' },
        ],
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
    el.src = withMasterRev(PLAYABLE_TRACKS[0].mp3Src!);
    el.volume = volumeRef.current;
    el.muted = isMutedRef.current;
    audioRef.current = el;

    const onTimeUpdate = () => {
      // Avoid stale timeupdate overwriting an active user seek within 180ms
      if (Date.now() - lastSeekAtRef.current < 180) return;
      setCurrentTime(el.currentTime);
    };

    const onDurationUpdate = () => {
      if (Number.isFinite(el.duration) && el.duration > 0) {
        setDuration(el.duration);
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
      if (playAllRef.current && activeIndexRef.current < PLAYABLE_TRACKS.length - 1) {
        const nextIdx = activeIndexRef.current + 1;
        activeIndexRef.current = nextIdx;
        const next = PLAYABLE_TRACKS[nextIdx];
        setActiveIndex(nextIdx);
        setCurrentTime(0);
        setDuration(parseDurationFallback(next.duration));
        el.preload = 'auto';
        el.src = withMasterRev(next.mp3Src!);
        el.load();
        syncMediaSession(next);

        const tryPlay = () => {
          const p = el.play();
          if (p) {
            p.catch(() => {
              // On iOS Safari, play() right after src swap can reject before canplay; retry once buffered
              const onCanPlay = () => {
                el.removeEventListener('canplay', onCanPlay);
                el.play().catch(() => setIsPlaying(false));
              };
              el.addEventListener('canplay', onCanPlay, { once: true });
            });
          }
        };
        tryPlay();
        return;
      }
      setPlayAllActive(false);
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onError = () => {
      setIsPlaying(false);
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

  const resolveIndex = useCallback((slugOrIndex: string | number): number => {
    if (typeof slugOrIndex === 'number') {
      return (slugOrIndex + PLAYABLE_TRACKS.length) % PLAYABLE_TRACKS.length;
    }
    const found = PLAYABLE_TRACKS.findIndex((t) => t.slug === slugOrIndex || t.number === slugOrIndex);
    return found >= 0 ? found : 0;
  }, []);

  const selectTrack = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIndex(slugOrIndex);
      const el = audioRef.current;
      if (!el) return;
      if (idx !== activeIndexRef.current) {
        const target = PLAYABLE_TRACKS[idx];
        el.pause();
        pendingSeekRef.current = null;
        el.src = withMasterRev(target.mp3Src!);
        el.load();
        activeIndexRef.current = idx;
        setCurrentTime(0);
        setDuration(parseDurationFallback(target.duration));
        setActiveIndex(idx);
        syncMediaSession(target);
      }
    },
    [resolveIndex, syncMediaSession]
  );

  const playTrack = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIndex(slugOrIndex);
      const el = audioRef.current;
      setHasStarted(true);
      setPlayAllActive(false);
      if (!el) return;

      el.preload = 'auto';
      const target = PLAYABLE_TRACKS[idx];

      if (idx !== activeIndexRef.current) {
        pendingSeekRef.current = null;
        activeIndexRef.current = idx;
        setActiveIndex(idx);
        setCurrentTime(0);
        setDuration(parseDurationFallback(target.duration));
        el.src = withMasterRev(target.mp3Src!);
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
    [resolveIndex, syncMediaSession]
  );

  const playAll = useCallback(() => {
    const el = audioRef.current;
    setHasStarted(true);
    if (!el) return;

    if (playAllRef.current && !el.paused) {
      el.pause();
      return;
    }

    el.preload = 'auto';
    setPlayAllActive(true);
    playAllRef.current = true;

    if (el.paused && activeIndexRef.current === 0 && currentTime > 0 && !el.ended) {
      syncMediaSession(PLAYABLE_TRACKS[0]);
      const p = el.play();
      if (p) p.catch((err) => { if (err?.name !== 'AbortError') setIsPlaying(false); });
      return;
    }

    const first = PLAYABLE_TRACKS[0];
    if (activeIndexRef.current !== 0) {
      pendingSeekRef.current = null;
      activeIndexRef.current = 0;
      setActiveIndex(0);
      setCurrentTime(0);
      setDuration(parseDurationFallback(first.duration));
      el.src = withMasterRev(first.mp3Src!);
    } else if (el.ended) {
      el.currentTime = 0;
      setCurrentTime(0);
    }

    syncMediaSession(first);
    const p = el.play();
    if (p) {
      p.catch((err) => {
        if (err?.name !== 'AbortError') setIsPlaying(false);
      });
    }
  }, [currentTime, syncMediaSession]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    setHasStarted(true);
    if (!el) return;
    el.preload = 'auto';
    if (el.paused) {
      syncMediaSession(PLAYABLE_TRACKS[activeIndexRef.current] ?? PLAYABLE_TRACKS[0]);
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
    const nextIdx = (activeIndexRef.current + 1) % PLAYABLE_TRACKS.length;
    const el = audioRef.current;
    const wasPlaying = isPlaying;
    const target = PLAYABLE_TRACKS[nextIdx];
    activeIndexRef.current = nextIdx;
    setActiveIndex(nextIdx);
    setHasStarted(true);
    if (!el) return;
    el.preload = 'auto';
    pendingSeekRef.current = null;
    setCurrentTime(0);
    setDuration(parseDurationFallback(target.duration));
    el.src = withMasterRev(target.mp3Src!);
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
    const prevIdx = (activeIndexRef.current - 1 + PLAYABLE_TRACKS.length) % PLAYABLE_TRACKS.length;
    const el = audioRef.current;
    const wasPlaying = isPlaying;
    const target = PLAYABLE_TRACKS[prevIdx];
    activeIndexRef.current = prevIdx;
    setActiveIndex(prevIdx);
    setHasStarted(true);
    if (!el) return;
    el.preload = 'auto';
    pendingSeekRef.current = null;
    setCurrentTime(0);
    setDuration(parseDurationFallback(target.duration));
    el.src = withMasterRev(target.mp3Src!);
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
    const maxDur =
      el && Number.isFinite(el.duration) && el.duration > 0
        ? el.duration
        : parseDurationFallback((PLAYABLE_TRACKS[activeIndexRef.current] ?? PLAYABLE_TRACKS[0]).duration) || 300;
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

  // Wire OS Lock Screen / Control Center MediaSession controls for iPhone & Android
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
        hasStarted,
        isPlaying,
        playAllActive,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        playAll,
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
