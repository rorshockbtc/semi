'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Muted decorative ambient film loop that:
 * - Lazy-plays via IntersectionObserver so 9 song loops on `/songs` don't saturate mobile bandwidth at once.
 * - Immediately pauses when off-screen, when the user pauses ambient motion, or under `prefers-reduced-motion`.
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
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { rootMargin: '280px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !src) return;
    if (motionActive && inView) {
      const promise = el.play();
      if (promise) {
        promise.catch(() => {
          // Ignore autoplay rejections in headless or strict browser contexts
        });
      }
    } else {
      el.pause();
    }
  }, [motionActive, inView, src]);

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
      preload="metadata"
      muted
      loop
      playsInline
      aria-hidden="true"
      className={className}
    />
  );
}
