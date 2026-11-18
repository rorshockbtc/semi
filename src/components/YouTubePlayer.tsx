'use client';

import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';

interface YouTubePlayerProps {
  youtubeId: string;
  title: string;
  posterSrc: string;
  autoplay?: boolean;
  iframeTestId: string;
}

/**
 * YouTube embed with a blurred poster still and frosted spinner overlay while
 * the external player frame loads, avoiding a blank black rectangle.
 */
export default function YouTubePlayer({
  youtubeId,
  title,
  posterSrc,
  autoplay = false,
  iframeTestId,
}: YouTubePlayerProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      data-testid="video-player-shell"
      data-video-loaded={loaded ? 'true' : 'false'}
      className="relative aspect-video w-full overflow-hidden bg-[#14110f]"
    >
      <div
        aria-hidden={loaded}
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-400 ${
          loaded ? 'opacity-0' : 'opacity-100'
        }`}
      >
        <div
          aria-hidden="true"
          style={{ '--video-poster': `url("${posterSrc}")` } as React.CSSProperties}
          className="video-poster-backdrop absolute inset-0 scale-[1.03] opacity-45 blur-[3px]"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/35" />
        <div
          role="status"
          aria-live="polite"
          data-testid="video-loading-indicator"
          className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-3 px-4 text-center"
        >
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-[#14110f]/75 shadow-lg backdrop-blur-md">
            <Loader2
              className="h-6 w-6 animate-spin text-[#FE299E] motion-reduce:animate-none"
              aria-hidden="true"
            />
          </span>
          <span className="font-sans text-[14px] font-medium tracking-wide text-[#F3EFE9]">
            Loading video…
          </span>
        </div>
      </div>

      <iframe
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}?${autoplay ? 'autoplay=1&' : ''}rel=0`}
        title={`${title} — music video`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; compute-pressure; web-share"
        allowFullScreen
        onLoad={() => setLoaded(true)}
        data-testid={iframeTestId}
        className={`relative z-10 h-full w-full border-0 transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}
