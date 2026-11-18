'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MotionProvider } from 'accent-ui/motion';
import { AmbientMotionProvider } from '@/context/AmbientMotionContext';

/**
 * Client shell wrapping Accént's MotionProvider (`LazyMotion` + reduced motion)
 * and Semi's explicit ambient motion pause/play controller.
 */
export default function AccentClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [pathname]);

  return (
    <MotionProvider>
      <AmbientMotionProvider>{children}</AmbientMotionProvider>
    </MotionProvider>
  );
}
