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
  hasStarted: boolean;
  isPlaying: boolean;
  playAllActive: boolean;
  currentTime: number;
  duration: number;
  playTrack: (slugOrIndex: string | number) => void;
  playAll: () => void;
  selectTrack: (slugOrIndex: string | number) => void;
  togglePlay: () => void;
  pauseAudio: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  seek: (seconds: number) => void;
  dismissDock: () => void;
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null);

const PLAYABLE_TRACKS = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src));

export function AudioPlayerProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAllActive, setPlayAllActive] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const activeIndexRef = useRef(activeIndex);
  const playAllRef = useRef(playAllActive);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    playAllRef.current = playAllActive;
  }, [playAllActive]);

  const currentTrack = PLAYABLE_TRACKS[activeIndex] ?? PLAYABLE_TRACKS[0];

  useEffect(() => {
    const el = new Audio(PLAYABLE_TRACKS[0].mp3Src!);
    el.preload = 'metadata';
    audioRef.current = el;

    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => setDuration(el.duration || 0);
    const onEnded = () => {
      if (playAllRef.current && activeIndexRef.current < PLAYABLE_TRACKS.length - 1) {
        const nextIdx = activeIndexRef.current + 1;
        activeIndexRef.current = nextIdx;
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
      if (idx !== activeIndex) {
        el.pause();
        el.src = PLAYABLE_TRACKS[idx].mp3Src!;
        el.load();
        setCurrentTime(0);
        setDuration(0);
        setActiveIndex(idx);
      }
    },
    [activeIndex, resolveIndex]
  );

  const playTrack = useCallback(
    (slugOrIndex: string | number) => {
      const idx = resolveIndex(slugOrIndex);
      const el = audioRef.current;
      setHasStarted(true);
      setPlayAllActive(false);
      if (!el) return;

      if (idx !== activeIndex) {
        el.pause();
        el.src = PLAYABLE_TRACKS[idx].mp3Src!;
        el.load();
        setCurrentTime(0);
        setDuration(0);
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
    [activeIndex, resolveIndex]
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
    if (playAllActive && el.paused) {
      const p = el.play();
      if (p) p.catch(() => setIsPlaying(false));
      return;
    }

    if (activeIndex !== 0) {
      el.pause();
      el.src = PLAYABLE_TRACKS[0].mp3Src!;
      el.load();
      setCurrentTime(0);
      setDuration(0);
      setActiveIndex(0);
    } else if (el.ended) {
      el.currentTime = 0;
      setCurrentTime(0);
    }

    const p = el.play();
    if (p) p.catch(() => setIsPlaying(false));
  }, [activeIndex, playAllActive]);

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
    setCurrentTime(seconds);
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
    }
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
        playTrack,
        playAll,
        selectTrack,
        togglePlay,
        pauseAudio,
        nextTrack,
        prevTrack,
        seek,
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
