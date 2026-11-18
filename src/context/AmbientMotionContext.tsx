'use client';

import React, { createContext, useContext, useSyncExternalStore } from 'react';
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

function subscribePauseStore(callback: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getPausedSnapshot(): boolean {
  try {
    return sessionStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function AmbientMotionProvider({ children }: { children: React.ReactNode }) {
  const accentMotion = useMotionPreference();
  const framerReduced = useReducedMotion();
  const pausedByUser = useSyncExternalStore(subscribePauseStore, getPausedSnapshot, () => false);

  const osReduced = Boolean(framerReduced || accentMotion.isReduced);
  const motionActive = !osReduced && !pausedByUser;

  const togglePause = () => {
    const next = !getPausedSnapshot();
    try {
      sessionStorage.setItem(STORAGE_KEY, next ? 'true' : 'false');
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
      <MotionConfig reducedMotion={pausedByUser ? 'always' : 'user'}>
        {children}
      </MotionConfig>
    </AmbientMotionContext.Provider>
  );
}

export function useAmbientMotion() {
  return useContext(AmbientMotionContext);
}
