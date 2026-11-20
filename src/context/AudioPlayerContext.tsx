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

interface AudioPlayerContextValue {
  currentTrack: SemiTrack;
  isAlternateActive: boolean;
  hasStarted: boolean;
  isPlaying: boolean;
  playAllActive: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playTrack: (slugOrIndex: string | number) => void;
  playAlternateTake: (slugOrIndex: string | number) => void;
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

const PLAYABLE_TRACKS = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src));
const VOLUME_STORAGE_KEY = 'semi_player_volume';
const DEFAULT_VOLUME = 0.85;

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAlternateActive, setIsAlternateActive] = useState(false);
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

  const baseTrack = PLAYABLE_TRACKS[activeIndex] ?? PLAYABLE_TRACKS[0];
  const currentTrack: SemiTrack =
    isAlternateActive && baseTrack.alternateTake
      ? {
          ...baseTrack,
          number: baseTrack.alternateTake.numberLabel,
          title: baseTrack.alternateTake.title,
          subtitle: baseTrack.alternateTake.subtitle,
          mp3Src: baseTrack.alternateTake.mp3Src,
          downloadName: baseTrack.alternateTake.downloadName,
          fileSizeLabel: baseTrack.alternateTake.fileSizeLabel,
          duration: baseTrack.alternateTake.duration,
        }
      : baseTrack;

  useEffect(() => {
    const el = new Audio(PLAYABLE_TRACKS[0].mp3Src!);
    el.preload = 'metadata';
    el.volume = volumeRef.current;
    el.muted = isMutedRef.current;
    audioRef.current = el;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => setDuration(el.duration || 0);
    const onEnded = () => {
      if (playAllRef.current && activeIndexRef.current < PLAYABLE_TRACKS.length - 1) {
        const nextIdx = activeIndexRef.current + 1;
        activeIndexRef.current = nextIdx;
        setIsAlternateActive(false);
        setActiveIndex(nextIdx);
        setCurrentTime(0);
        setDuration(0);
        el.src = PLAYABLE_TRACKS[nextIdx].mp3Src!;
        el.load();
        const p = el.play();
        if (p) p.catch(() => setIsPlaying(false));
        return;
      }
      setPlayAllActive(false);
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('ended', onEnded);
    el.addEventListener('play', onPlay);
    el.addEventListener('pause', onPause);

    return () => {
      el.pause();
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('ended', onEnded);
      el.removeEventListener('play', onPlay);
      el.removeEventListener('pause', onPause);
    };
  }, []);

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
      if (idx !== activeIndex || isAlternateActive) {
        el.pause();
        el.src = PLAYABLE_TRACKS[idx].mp3Src!;
        el.load();
        setCurrentTime(0);
        setDuration(0);
        setIsAlternateActive(false);
        setActiveIndex(idx);
      }
    },
    [activeIndex, isAlternateActive, resolveIndex]
  );

  const playTrack = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIndex(slugOrIndex);
      const el = audioRef.current;
      setHasStarted(true);
      setPlayAllActive(false);
      if (!el) return;

      if (idx !== activeIndex || isAlternateActive) {
        el.pause();
        el.src = PLAYABLE_TRACKS[idx].mp3Src!;
        el.load();
        setCurrentTime(0);
        setDuration(0);
        setIsAlternateActive(false);
        setActiveIndex(idx);
        const p = el.play();
        if (p) p.catch(() => setIsPlaying(false));
      } else if (el.paused) {
        const p = el.play();
        if (p) p.catch(() => setIsPlaying(false));
      } else {
        el.pause();
      }
    },
    [activeIndex, isAlternateActive, resolveIndex]
  );

  const playAlternateTake = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIndex(slugOrIndex);
      const target = PLAYABLE_TRACKS[idx];
      const el = audioRef.current;
      if (!el || !target?.alternateTake) return;

      setHasStarted(true);
      setPlayAllActive(false);

      if (idx !== activeIndex || !isAlternateActive) {
        el.pause();
        el.src = target.alternateTake.mp3Src;
        el.load();
        setCurrentTime(0);
        setDuration(0);
        setIsAlternateActive(true);
        setActiveIndex(idx);
        const p = el.play();
        if (p) p.catch(() => setIsPlaying(false));
      } else if (el.paused) {
        const p = el.play();
        if (p) p.catch(() => setIsPlaying(false));
      } else {
        el.pause();
      }
    },
    [activeIndex, isAlternateActive, resolveIndex]
  );

  const playAll = useCallback(() => {
    const el = audioRef.current;
    setHasStarted(true);
    if (!el) return;

    if (playAllActive && !el.paused) {
      el.pause();
      return;
    }

    setPlayAllActive(true);
    if (playAllActive && el.paused && !isAlternateActive) {
      const p = el.play();
      if (p) p.catch(() => setIsPlaying(false));
      return;
    }

    if (activeIndex !== 0 || isAlternateActive) {
      el.pause();
      el.src = PLAYABLE_TRACKS[0].mp3Src!;
      el.load();
      setCurrentTime(0);
      setDuration(0);
      setIsAlternateActive(false);
      setActiveIndex(0);
    } else if (el.ended) {
      el.currentTime = 0;
      setCurrentTime(0);
    }

    const p = el.play();
    if (p) p.catch(() => setIsPlaying(false));
  }, [activeIndex, isAlternateActive, playAllActive]);

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    setHasStarted(true);
    if (!el) return;
    if (el.paused) {
      const p = el.play();
      if (p) p.catch(() => setIsPlaying(false));
    } else {
      el.pause();
    }
  }, []);

  const pauseAudio = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const nextTrack = useCallback(() => {
    const nextIdx = (activeIndex + 1) % PLAYABLE_TRACKS.length;
    const el = audioRef.current;
    const wasPlaying = isPlaying;
    setIsAlternateActive(false);
    setActiveIndex(nextIdx);
    setHasStarted(true);
    if (!el) return;
    el.pause();
    el.src = PLAYABLE_TRACKS[nextIdx].mp3Src!;
    el.load();
    setCurrentTime(0);
    setDuration(0);
    if (wasPlaying) {
      const p = el.play();
      if (p) p.catch(() => setIsPlaying(false));
    }
  }, [activeIndex, isPlaying]);

  const prevTrack = useCallback(() => {
    const prevIdx = (activeIndex - 1 + PLAYABLE_TRACKS.length) % PLAYABLE_TRACKS.length;
    const el = audioRef.current;
    const wasPlaying = isPlaying;
    setIsAlternateActive(false);
    setActiveIndex(prevIdx);
    setHasStarted(true);
    if (!el) return;
    el.pause();
    el.src = PLAYABLE_TRACKS[prevIdx].mp3Src!;
    el.load();
    setCurrentTime(0);
    setDuration(0);
    if (wasPlaying) {
      const p = el.play();
      if (p) p.catch(() => setIsPlaying(false));
    }
  }, [activeIndex, isPlaying]);

  const seek = useCallback((seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return;
    setCurrentTime(seconds);
    const el = audioRef.current;
    if (el) {
      try {
        el.currentTime = seconds;
      } catch (err) {
        console.warn('[AudioPlayer] Seek failed:', err);
      }
    }
  }, []);

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
        isAlternateActive,
        hasStarted,
        isPlaying,
        playAllActive,
        currentTime,
        duration,
        volume,
        isMuted,
        playTrack,
        playAlternateTake,
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
