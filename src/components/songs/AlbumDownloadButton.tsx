'use client';

import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { SEMI_TRACKS } from '@/data/semi-songs';
import { buildStoreZip, type ZipEntryInput } from '@/lib/zip-album';

interface AlbumDownloadButtonProps {
  className?: string;
}

export function AlbumDownloadButton({ className = '' }: AlbumDownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const tracks = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src));

  const handleDownloadAlbum = async () => {
    if (status === 'downloading') return;
    setStatus('downloading');
    const total = tracks.length + 1; // 12 main tracks + cover art
    setProgress({ current: 0, total });

    try {
      const entries: ZipEntryInput[] = [];

      // Include album cover art
      const coverRes = await fetch('/photos/io-album-cover.jpg');
      if (coverRes.ok) {
        const coverBuf = new Uint8Array(await coverRes.arrayBuffer());
        entries.push({
          name: 'Semi - IO (Album Cover).jpg',
          data: coverBuf,
        });
      }
      setProgress({ current: 1, total });

      // Fetch each of the 12 main tracks (alternate takes are reserved for the future supporter edition)
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const res = await fetch(`${track.mp3Src!}?v=fade1`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${track.title}`);
        }
        const buf = new Uint8Array(await res.arrayBuffer());
        const filename = track.downloadName || `Semi - ${track.number} - ${track.title}.mp3`;
        entries.push({
          name: `Semi - IO/${filename}`,
          data: buf,
        });
        setProgress({ current: i + 2, total });
      }

      const zipBlob = buildStoreZip(entries);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Semi - IO (Full Album).zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10_000);

      setStatus('done');
      setTimeout(() => setStatus('idle'), 4000);
    } catch (err) {
      console.error('[AlbumDownloadButton] Failed:', err);
      setStatus('error');
      setTimeout(() => setStatus('idle'), 4000);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDownloadAlbum}
      disabled={status === 'downloading'}
      data-testid="download-full-album-btn"
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-ink/20 bg-white/80 hover:bg-white text-ink px-5 py-2.5 text-[14px] font-medium transition-colors min-h-[44px] disabled:opacity-70 ${className}`}
    >
      {status === 'downloading' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-semi-pink" aria-hidden="true" />
          <span>
            Packing album ({progress.current}/{progress.total})…
          </span>
        </>
      ) : status === 'done' ? (
        <>
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>Album ZIP Ready</span>
        </>
      ) : status === 'error' ? (
        <>
          <Download className="w-4 h-4 text-semi-pink" aria-hidden="true" />
          <span>Retry Album ZIP</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-semi-pink" aria-hidden="true" />
          <span>Download Full Album (12 MP3s · ZIP)</span>
        </>
      )}
    </button>
  );
}
