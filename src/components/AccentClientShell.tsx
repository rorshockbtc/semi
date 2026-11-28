'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { MotionProvider } from 'accent-ui/motion';
import { AmbientMotionProvider } from '@/context/AmbientMotionContext';
import { AudioPlayerProvider } from '@/context/AudioPlayerContext';
import PersistentAudioDock from '@/components/site/PersistentAudioDock';
import GlobalAskSemi from '@/components/site/GlobalAskSemi';
import SiteTranslator from '@/components/site/SiteTranslator';
import { DeluxeModalHost } from '@/components/songs/DeluxeAlbumModal';

/**
 * Client shell wrapping Accént's MotionProvider, Semi's ambient pause/play controller,
 * and the site-wide persistent audio player so songs keep playing across page navigation.
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
      <AmbientMotionProvider>
        <AudioPlayerProvider>
          {children}
          <SiteTranslator />
          <DeluxeModalHost />
          <GlobalAskSemi />
          <PersistentAudioDock />
        </AudioPlayerProvider>
      </AmbientMotionProvider>
    </MotionProvider>
  );
}
