'use client';

import React, { createContext, useContext, useEffect, useSyncExternalStore } from 'react';
import { MotionConfig, useReducedMotion } from 'framer-motion';
import { useMotionPreference } from 'accent-ui/motion';

interface AmbientMotionContextValue {
  motionActive: boolean;
  pausedByUser: boolean;
  osReduced: boolean;
  togglePause: () => void;
}

const AmbientMotionContext = createContext<AmbientMotionContextValue>({
  motionActive: true,
  pausedByUser: false,
  osReduced: false,
  togglePause: () => {},
});

const STORAGE_KEY = 'semi:ambient-motion-paused';
const CHANGE_EVENT = 'semi:ambient-motion-change';

type UserMotionPref = 'paused' | 'active' | null;

function subscribePauseStore(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getUserPrefSnapshot(): UserMotionPref {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (raw === 'true' || raw === 'paused') return 'paused';
    if (raw === 'active') return 'active';
    return null;
  } catch {
    return null;
  }
}

export function AmbientMotionProvider({ children }: { children: React.ReactNode }) {
  const accentMotion = useMotionPreference();
  const framerReduced = useReducedMotion();
  const userPref = useSyncExternalStore(subscribePauseStore, getUserPrefSnapshot, () => null);

  const osReduced = Boolean(framerReduced || accentMotion.isReduced);
  const motionActive =
    userPref === 'active' ? true : userPref === 'paused' ? false : !osReduced;
  const pausedByUser = userPref === 'paused';

  useEffect(() => {
    document.documentElement.dataset.motion = motionActive ? 'active' : 'paused';
  }, [motionActive]);

  const togglePause = () => {
    const nextActive = !motionActive;
    try {
      sessionStorage.setItem(STORAGE_KEY, nextActive ? 'active' : 'paused');
    } catch {
      // Ignore storage errors in restricted environments
    }
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <AmbientMotionContext.Provider
      value={{
        motionActive,
        pausedByUser,
        osReduced,
        togglePause,
      }}
    >
      <MotionConfig reducedMotion={motionActive ? 'never' : 'always'}>
        {children}
      </MotionConfig>
    </AmbientMotionContext.Provider>
  );
}

export function useAmbientMotion() {
  return useContext(AmbientMotionContext);
}
