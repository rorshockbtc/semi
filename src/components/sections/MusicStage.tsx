'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import {
  BookOpen,
  Download,
  ExternalLink,
  Film,
  Music,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Video,
} from 'lucide-react';
import AcousticWaveformCanvas from '@/art/AcousticWaveformCanvas';
import { bloomHandlers } from '@/art/bloom';
import AmbientLoopVideo from '@/components/AmbientLoopVideo';
import LyricSheetDialog from '@/components/modals/LyricSheetDialog';
import {
  FORTHCOMING_TRACKS,
  SEMI_TRACKS,
  type SemiTrack,
} from '@/data/semi-songs';

type StageMode = 'video' | 'audio';

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function MusicStage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stageMode, setStageMode] = useState<StageMode>('video');
  const [videoMounted, setVideoMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyricDialogTrack, setLyricDialogTrack] = useState<SemiTrack | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const tabVideoId = useId();
  const tabAudioId = useId();
  const panelId = useId();

  const activeTrack = SEMI_TRACKS[activeIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  function selectTrack(idx: number, options?: { autoplayAudio?: boolean; openVideo?: boolean }) {
    const nextIdx = (idx + SEMI_TRACKS.length) % SEMI_TRACKS.length;
    const changingTrack = nextIdx !== activeIndex;
    setActiveIndex(nextIdx);

    if (options?.openVideo) {
      setStageMode('video');
      setVideoMounted(true);
      audioRef.current?.pause();
      return;
    }

    const audio = audioRef.current;
    if (!audio) return;

    if (changingTrack) {
      audio.pause();
      audio.src = SEMI_TRACKS[nextIdx].mp3Src;
      audio.load();
      setCurrentTime(0);
      setDuration(0);
      if (stageMode === 'video') {
        setVideoMounted(true);
      }
    }

    if (options?.autoplayAudio) {
      setStageMode('audio');
      const p = audio.play();
      if (p) p.catch(() => setIsPlaying(false));
    }
  }

  function togglePlayPause() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (!audio.src || !audio.src.endsWith(activeTrack.mp3Src)) {
        audio.src = activeTrack.mp3Src;
      }
      const p = audio.play();
      if (p) p.catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }

  function handleSeek(e: React.ChangeEvent<HTMLInputElement>) {
    const val = Number(e.target.value);
    setCurrentTime(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  }

  const maxDuration = duration > 0 ? duration : 180;

  return (
    <section
      id="listen"
      aria-labelledby="listen-title"
      className="relative scroll-mt-24 border-b border-[var(--a-rule)] bg-[var(--a-bg)] py-20 sm:py-28"
    >
      <audio ref={audioRef} src={activeTrack.mp3Src} preload="metadata" />

      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 space-y-12">
        {/* Section Heading */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
              01 · The Debut Sessions (Local Current)
            </p>
            <h2 id="listen-title" className="font-display text-big font-bold text-[var(--a-ink)]">
              Watch the videos.{' '}
              <span className="font-serif italic font-normal">Take the songs home.</span>
            </h2>
          </div>

          <p className="max-w-[44ch] text-base sm:text-lg text-[var(--a-ink)]/80">
            Three singles out right now—streamable inline, watchable on YouTube, and free to
            download as untagged-gate <strong className="font-semibold">320 kbps MP3s</strong> while
            the full album comes together.
          </p>
        </div>

        {/* Architectural Listening Stage (Surface 1 -> Well inside, zero nested bordered cards) */}
        <div className="rounded-3xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-5 sm:p-8 lg:p-10 space-y-8">
          {/* Stage Top Bar: Active Song + Video/Audio Mode Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--a-rule)] pb-5">
            <div className="space-y-1">
              <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[var(--a-accent-text)]">
                Now Selected · Track {activeTrack.number} · {activeTrack.subtitle}
              </p>
              <h3
                data-testid="active-track-title"
                className="font-display text-2xl sm:text-3xl font-bold text-[var(--a-ink)]"
              >
                {activeTrack.title}
              </h3>
            </div>

            <div role="tablist" aria-label="Stage view mode" className="semi-tablist">
              <button
                id={tabVideoId}
                type="button"
                role="tab"
                aria-selected={stageMode === 'video'}
                aria-controls={panelId}
                data-testid="tab-video-mode"
                onClick={() => setStageMode('video')}
                className={`min-h-[44px] inline-flex items-center gap-2 px-4 text-[14px] font-semibold transition-colors ${
                  stageMode === 'video' ? 'text-[var(--a-ink)]' : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                }`}
              >
                <Film className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                <span>Music Video</span>
              </button>

              <button
                id={tabAudioId}
                type="button"
                role="tab"
                aria-selected={stageMode === 'audio'}
                aria-controls={panelId}
                data-testid="tab-audio-mode"
                onClick={() => setStageMode('audio')}
                className={`min-h-[44px] inline-flex items-center gap-2 px-4 text-[14px] font-semibold transition-colors ${
                  stageMode === 'audio' ? 'text-[var(--a-ink)]' : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                }`}
              >
                <Music className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                <span>Studio Audio &amp; Strings</span>
              </button>
            </div>
          </div>

          {/* Stage Viewport Panel */}
          <div
            id={panelId}
            role="tabpanel"
            aria-labelledby={stageMode === 'video' ? tabVideoId : tabAudioId}
            className="grid gap-8 lg:grid-cols-12 lg:items-center"
          >
            <div className="lg:col-span-7">
              {stageMode === 'video' ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#111827]">
                  {videoMounted ? (
                    <iframe
                      key={activeTrack.youtubeId}
                      src={`https://www.youtube-nocookie.com/embed/${activeTrack.youtubeId}?autoplay=1&rel=0`}
                      title={`${activeTrack.title} — Semi music video on YouTube`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      data-testid="youtube-embed-iframe"
                      className="h-full w-full border-0"
                    />
                  ) : (
                    <div className="relative h-full w-full">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={activeTrack.poster}
                        alt={activeTrack.posterAlt}
                        className="h-full w-full object-cover opacity-85"
                      />
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-t from-[#111827]/85 via-[#111827]/25 to-transparent"
                      />
                      <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4">
                        <div className="space-y-1 text-white">
                          <span className="font-code text-[13px] uppercase tracking-[0.14em] text-[#F7B9C9]">
                            YouTube Music Video · {activeTrack.duration}
                          </span>
                          <p className="font-display text-2xl sm:text-3xl font-bold">
                            {activeTrack.title}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            audioRef.current?.pause();
                            setVideoMounted(true);
                          }}
                          data-testid="launch-youtube-video"
                          {...bloomHandlers<HTMLButtonElement>()}
                          className="wc-cta inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white shadow-[0_12px_32px_-10px_rgba(254,41,158,0.75)]"
                        >
                          <Video className="h-5 w-5" aria-hidden="true" />
                          <span>Watch Music Video</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-[#111827]">
                  <AmbientLoopVideo
                    src="/loops/semi-guitar-loop.mp4"
                    poster={activeTrack.poster}
                    className="h-full w-full object-cover opacity-80"
                  />
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-[#111827]/35 to-transparent"
                  />
                  <div className="absolute inset-x-6 bottom-6 space-y-2 text-white">
                    <p className="font-code text-[13px] uppercase tracking-[0.14em] text-[#F7B9C9]">
                      West Nashville Studio Tape · {activeTrack.fileSizeLabel}
                    </p>
                    <p className="font-serif italic text-2xl sm:text-3xl leading-snug">
                      “{activeTrack.pullQuote}”
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Story, Harmonic Strings & Direct MP3 Actions */}
            <div className="lg:col-span-5 space-y-6">
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {activeTrack.themes.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[var(--a-well)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--a-ink)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="font-serif italic text-xl sm:text-2xl leading-relaxed text-[var(--a-ink)]">
                  “{activeTrack.pullQuote}”
                </p>
                <p className="text-base leading-relaxed text-[var(--a-muted)]">
                  {activeTrack.linerNote}
                </p>
              </div>

              <div className="border-t border-[var(--a-rule)] pt-4 space-y-2">
                <p className="font-code text-[13px] uppercase tracking-[0.12em] text-[var(--a-muted)]">
                  Six-string harmonic monitor {isPlaying ? '· Playing' : '· Ready'}
                </p>
                <AcousticWaveformCanvas
                  audioRef={audioRef}
                  isPlaying={isPlaying}
                  trackSeed={activeIndex + 1}
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={activeTrack.mp3Src}
                  download={activeTrack.downloadName}
                  data-testid="active-download-mp3"
                  {...bloomHandlers<HTMLAnchorElement>()}
                  className="wc-cta inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white no-underline"
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  <span>Download MP3</span>
                </a>

                <button
                  type="button"
                  onClick={() => setLyricDialogTrack(activeTrack)}
                  data-testid="active-open-lyrics"
                  className="min-h-[46px] inline-flex items-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-5 text-[15px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors"
                >
                  <BookOpen className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                  <span>Read Full Lyrics</span>
                </button>

                <a
                  href={activeTrack.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="active-youtube-external"
                  className="wc-link min-h-[44px] inline-flex items-center gap-1.5 px-2 text-[14px] font-semibold text-[var(--a-ink)]"
                >
                  <span>YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Dedicated Audio Transport Well */}
          <div className="rounded-2xl bg-[var(--a-well)] px-4 py-4 sm:px-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => selectTrack(activeIndex - 1, { autoplayAudio: isPlaying })}
                aria-label="Previous track"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
              >
                <SkipBack className="h-5 w-5" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={togglePlayPause}
                aria-label={isPlaying ? `Pause ${activeTrack.title}` : `Play ${activeTrack.title}`}
                data-testid="audio-play-toggle"
                className="inline-flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full bg-[var(--a-ink)] text-[var(--a-bg)] hover:bg-[var(--a-accent-fill)] transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Play className="h-5 w-5 translate-x-0.5" aria-hidden="true" />
                )}
              </button>

              <button
                type="button"
                onClick={() => selectTrack(activeIndex + 1, { autoplayAudio: isPlaying })}
                aria-label="Next track"
                className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[var(--a-ink)] hover:bg-[var(--a-surface)] transition-colors"
              >
                <SkipForward className="h-5 w-5" aria-hidden="true" />
              </button>

              <div className="pl-2 min-w-0">
                <p className="font-sans text-[14px] font-semibold text-[var(--a-ink)] truncate">
                  {activeTrack.number} · {activeTrack.title}
                </p>
                <p className="font-code text-[13px] text-[var(--a-muted)]">
                  Semi (;-]) · {activeTrack.fileSizeLabel}
                </p>
              </div>
            </div>

            <div className="flex flex-1 items-center gap-3 md:max-w-md">
              <span className="font-code text-[13px] tabular-nums text-[var(--a-muted)]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={maxDuration}
                step={0.5}
                value={Math.min(currentTime, maxDuration)}
                onChange={handleSeek}
                aria-label="Seek audio position"
                className="semi-range flex-1 min-h-[44px]"
              />
              <span className="font-code text-[13px] tabular-nums text-[var(--a-muted)]">
                {duration > 0 ? formatTime(duration) : activeTrack.duration}
              </span>
            </div>
          </div>

          {/* Hairline-Divided LP Tracklist (Released + Forthcoming) */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-sans text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-muted)]">
                Side A · Released Singles &amp; Direct Downloads
              </h3>
              <span className="font-code text-[13px] text-[var(--a-accent-text)]">
                Free DRM-free 320 kbps MP3s · Apache-2.0 companion project
              </span>
            </div>

            <div className="divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
              {SEMI_TRACKS.map((track, idx) => {
                const isSelected = idx === activeIndex;
                return (
                  <div
                    key={track.slug}
                    data-testid={`track-row-${track.number}`}
                    className={`py-4 sm:py-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between transition-colors ${
                      isSelected ? 'bg-[var(--a-well)]/65 px-3 -mx-3 rounded-xl' : ''
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`font-code text-[14px] font-medium pt-1 ${
                          isSelected ? 'text-[var(--a-accent-text)]' : 'text-[var(--a-muted)]'
                        }`}
                      >
                        {track.number}
                      </span>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-baseline gap-2.5">
                          <h4 className="font-display text-xl sm:text-2xl font-bold text-[var(--a-ink)]">
                            {track.title}
                          </h4>
                          <span className="font-serif italic text-lg text-[var(--a-muted)]">
                            ({track.subtitle})
                          </span>
                        </div>
                        <p className="font-serif italic text-[17px] text-[var(--a-ink)]/75">
                          “{track.pullQuote}”
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pl-8 lg:pl-0">
                      <button
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            togglePlayPause();
                          } else {
                            selectTrack(idx, { autoplayAudio: true });
                          }
                        }}
                        data-testid={`play-track-${track.number}`}
                        className={`min-h-[44px] inline-flex items-center gap-1.5 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                          isSelected && isPlaying
                            ? 'bg-[var(--a-accent-fill)] text-white'
                            : 'bg-[var(--a-ink)] text-[var(--a-bg)] hover:bg-[var(--a-accent-fill)] hover:text-white'
                        }`}
                      >
                        {isSelected && isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" aria-hidden="true" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" aria-hidden="true" />
                            <span>Play MP3</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => selectTrack(idx, { openVideo: true })}
                        data-testid={`watch-video-${track.number}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-4 text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors"
                      >
                        <Video className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                        <span>Video</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setLyricDialogTrack(track)}
                        data-testid={`open-lyrics-${track.number}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-4 text-[14px] font-medium text-[var(--a-ink)] hover:border-[var(--a-ink)] transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                        <span>Lyrics</span>
                      </button>

                      <a
                        href={track.mp3Src}
                        download={track.downloadName}
                        data-testid={`download-mp3-${track.number}`}
                        className="min-h-[44px] inline-flex items-center gap-1.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] px-4 text-[14px] font-semibold text-[var(--a-accent-text)] no-underline hover:border-[var(--a-accent-text)] transition-colors"
                      >
                        <Download className="h-4 w-4" aria-hidden="true" />
                        <span>MP3 ({track.duration})</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side B: Full Album in Progress */}
          <details className="group border-t border-[var(--a-rule)] pt-4">
            <summary className="cursor-pointer min-h-[44px] flex flex-wrap items-center justify-between gap-2 text-[15px] font-semibold text-[var(--a-ink)] list-none">
              <span>
                Side B · Full Album in the Studio ({FORTHCOMING_TRACKS.length} more songs coming)
              </span>
              <span className="font-code text-[13px] text-[var(--a-accent-text)]">
                Expand tracklist ↓
              </span>
            </summary>
            <ol className="mt-4 divide-y divide-[var(--a-rule)] border-t border-[var(--a-rule)]">
              {FORTHCOMING_TRACKS.map((ft) => (
                <li
                  key={ft.number}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1.5"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="font-code text-[13px] text-[var(--a-muted)]">{ft.number}</span>
                    <span className="font-display text-lg font-bold text-[var(--a-ink)]">
                      {ft.title}
                    </span>
                  </div>
                  <span className="text-[14px] text-[var(--a-muted)] pl-8 sm:pl-0">{ft.note}</span>
                </li>
              ))}
            </ol>
          </details>
        </div>
      </div>

      <LyricSheetDialog
        track={lyricDialogTrack}
        tracks={SEMI_TRACKS}
        onSelectTrack={(t) => setLyricDialogTrack(t)}
        onClose={() => setLyricDialogTrack(null)}
      />
    </section>
  );
}
