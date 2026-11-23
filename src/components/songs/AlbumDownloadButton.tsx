'use client';

import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { SEMI_TRACKS } from '@/data/semi-songs';
import { AUDIO_MASTER_REV } from '@/data/audio-manifest';
import { buildM3uPlaylist, buildStoreZip, type ZipEntryInput } from '@/lib/zip-album';

interface AlbumDownloadButtonProps {
  className?: string;
  label?: string;
}

export function AlbumDownloadButton({
  className = '',
  label = 'Free 12-Track Album (ZIP)',
}: AlbumDownloadButtonProps) {
  const [status, setStatus] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');
  const [progress, setProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 0,
  });

  const tracks = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src));

  const handleDownloadAlbum = async () => {
    if (status === 'downloading') return;
    setStatus('downloading');
    const total = tracks.length + 1;
    setProgress({ current: 0, total });

    try {
      const folder = 'Semi - I-O';
      const entries: ZipEntryInput[] = [];
      const playlistRows: Array<{ filename: string; title: string }> = [];

      // Fetch each of the 12 commercial tracks in exact numbered order (01 .. 12)
      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        const res = await fetch(`${track.mp3Src!}?v=${AUDIO_MASTER_REV}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${track.title}`);
        }
        const buf = new Uint8Array(await res.arrayBuffer());
        const filename = `${track.number} - ${track.title.replace(/[/:*?"<>|]/g, '-')}.mp3`;
        entries.push({
          name: `${folder}/${filename}`,
          data: buf,
        });
        playlistRows.push({ filename, title: track.title });
        setProgress({ current: i + 1, total });
      }

      // Include standard cover.jpg and M3U playlist for Apple Music / iTunes / Android players
      const coverRes = await fetch('/photos/io-album-cover.jpg');
      if (coverRes.ok) {
        const coverBuf = new Uint8Array(await coverRes.arrayBuffer());
        entries.push({
          name: `${folder}/cover.jpg`,
          data: coverBuf,
        });
      }
      entries.push({
        name: `${folder}/00 - Play I-O in Order.m3u`,
        data: buildM3uPlaylist(playlistRows),
      });
      setProgress({ current: total, total });

      const zipBlob = buildStoreZip(entries);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Semi - I-O (12-Track Album).zip';
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
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-[var(--a-ink)]/20 bg-[var(--a-well)] hover:bg-white text-[var(--a-ink)] px-5 py-2.5 text-[14px] font-semibold transition-colors min-h-[48px] disabled:opacity-70 ${className}`}
    >
      {status === 'downloading' ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-[var(--a-accent-text)]" aria-hidden="true" />
          <span>
            Packing ({progress.current}/{progress.total})…
          </span>
        </>
      ) : status === 'done' ? (
        <>
          <Check className="w-4 h-4 text-emerald-700" aria-hidden="true" />
          <span>12-Track ZIP Ready</span>
        </>
      ) : status === 'error' ? (
        <>
          <Download className="w-4 h-4 text-[var(--a-accent-text)]" aria-hidden="true" />
          <span>Retry 12-Track ZIP</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4 text-[var(--a-accent-text)]" aria-hidden="true" />
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
