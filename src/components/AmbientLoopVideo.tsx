'use client';

import React, { useEffect, useRef } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Muted decorative ambient film loop that immediately pauses when the user
 * pauses ambient motion or has `prefers-reduced-motion` active.
 */
export default function AmbientLoopVideo({
  src,
  poster,
  className = '',
}: {
  src: string;
  poster: string;
  className?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { motionActive } = useAmbientMotion();

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (motionActive) {
      const promise = el.play();
      if (promise) {
        promise.catch(() => {
          // Ignore autoplay rejections in headless or strict browser contexts
        });
      }
    } else {
      el.pause();
    }
  }, [motionActive]);

  if (!src) {
    return (
      /* eslint-disable-next-line @next/next/no-img-element */
      <img src={poster} alt="" aria-hidden="true" className={className} />
    );
  }

  return (
    <video
      ref={videoRef}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      autoPlay={motionActive}
      aria-hidden="true"
      className={className}
    />
  );
}
