'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  Check,
  Disc3,
  Download,
  KeyRound,
  Loader2,
  Pause,
  Play,
  Sparkles,
  Tag,
  X,
} from 'lucide-react';
import { SEMI_TRACKS } from '@/data/semi-songs';
import { AUDIO_MASTER_REV } from '@/data/audio-manifest';
import { useAudioPlayer } from '@/context/AudioPlayerContext';
import { LocalhostTeaserCard } from '@/components/songs/LocalhostTeaserCard';
import { PhonePlaybackFaq } from '@/components/songs/PhonePlaybackFaq';
import {
  buildM3uPlaylist,
  buildStoreZip,
  patchMp3TrackTotalTo15,
  type ZipEntryInput,
} from '@/lib/zip-album';

const STORAGE_TOKEN_KEY = 'semi_io_deluxe_token';
const STORAGE_EMAIL_KEY = 'semi_io_deluxe_email';

export interface DeluxeBonusItem {
  number: string;
  slug: string;
  title: string;
  duration: string;
  note: string;
}

export const DELUXE_BONUS_LIST: DeluxeBonusItem[] = [
  {
    number: '13',
    slug: '13-salt-in-the-rain-alternate-take',
    title: 'Salt In The Rain (Alternate Take)',
    duration: '03:01',
    note: 'Intimate studio alternate take with rewritten verses on letting old grief wash clean.',
  },
  {
    number: '14',
    slug: '14-localhost',
    title: 'Localhost',
    duration: '02:59',
    note: 'Exclusive Deluxe bonus song—stream the preview here, or unlock the 320 kbps MP3 master in the Deluxe Vault.',
  },
  {
    number: '15',
    slug: '15-ghost-alternate-take',
    title: 'Ghost (Alternate Take) — Album Finale',
    duration: '02:46',
    note: 'The closing track of the Deluxe Edition—unaccented vocal & bare acoustic ending.',
  },
];

// Global event so any button across the site can open the Deluxe modal
const OPEN_DELUXE_EVENT = 'semi:open-deluxe-modal';

export function triggerOpenDeluxeModal(initialTab: 'buy' | 'updates' = 'buy') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(OPEN_DELUXE_EVENT, { detail: { tab: initialTab } }));
  }
}

export function DeluxeAlbumButton({
  className = '',
  label = 'Buy Deluxe Album · $12.99',
  initialTab = 'buy',
}: {
  className?: string;
  label?: string;
  initialTab?: 'buy' | 'updates';
}) {
  return (
    <button
      type="button"
      onClick={() => triggerOpenDeluxeModal(initialTab)}
      data-testid="open-deluxe-album-btn"
      className={`inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full border border-[var(--a-accent-text)]/35 bg-[var(--a-surface)] hover:bg-[var(--a-ink)] text-[var(--a-ink)] hover:text-[#FAF8F5] px-5 py-2.5 text-[14px] font-semibold transition-colors ${className}`}
    >
      <Sparkles className="w-4 h-4 text-[var(--a-accent-text)] shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export function DeluxeModalHost() {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'buy' | 'updates'>('buy');
  const [unlockedToken, setUnlockedToken] = useState<string | null>(null);
  const [unlockedEmail, setUnlockedEmail] = useState<string | null>(null);
  const [verifyingRedirect, setVerifyingRedirect] = useState(false);

  const saveUnlock = useCallback((token: string, email: string) => {
    setUnlockedToken(token);
    setUnlockedEmail(email);
    try {
      window.localStorage.setItem(STORAGE_TOKEN_KEY, token);
      window.localStorage.setItem(STORAGE_EMAIL_KEY, email);
    } catch {
      // Ignore storage errors
    }
    window.dispatchEvent(new CustomEvent('semi:deluxe-auth-changed', { detail: { unlocked: true } }));
  }, []);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const custom = e as CustomEvent<{ tab?: 'buy' | 'updates' }>;
      if (custom.detail?.tab) setInitialTab(custom.detail.tab);
      setModalOpen(true);
    };
    window.addEventListener(OPEN_DELUXE_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_DELUXE_EVENT, onOpen);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const verifyFromLocationOrStorage = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get('session_id');
      const urlToken = params.get('deluxeToken');

      const cleanUrl = () => {
        const next = new URL(window.location.href);
        next.searchParams.delete('checkout');
        next.searchParams.delete('session_id');
        next.searchParams.delete('deluxeToken');
        window.history.replaceState(
          { ...(window.history.state || {}) },
          '',
          next.pathname + next.search + next.hash
        );
      };

      if (sessionId || urlToken) {
        await Promise.resolve();
        if (cancelled) return;
        setVerifyingRedirect(true);
        setModalOpen(true);

        const endpoint = sessionId
          ? `/api/album/verify-session?session_id=${encodeURIComponent(sessionId)}`
          : `/api/album/verify-session?token=${encodeURIComponent(urlToken!)}`;

        try {
          const res = await fetch(endpoint);
          const data = await res.json();
          if (!cancelled && data?.unlocked && data?.token) {
            saveUnlock(data.token, data.email || '');
            cleanUrl();
          }
        } catch {
          // Ignore verification network errors
        } finally {
          if (!cancelled) setVerifyingRedirect(false);
        }
        return;
      }

      try {
        const savedToken = window.localStorage.getItem(STORAGE_TOKEN_KEY);
        const savedEmail = window.localStorage.getItem(STORAGE_EMAIL_KEY);
        if (savedToken) {
          const res = await fetch(`/api/album/verify-session?token=${encodeURIComponent(savedToken)}`);
          const data = await res.json();
          if (cancelled) return;
          if (data?.unlocked && data?.token) {
            setUnlockedToken(data.token);
            setUnlockedEmail(data.email || savedEmail || '');
            window.dispatchEvent(
              new CustomEvent('semi:deluxe-auth-changed', { detail: { unlocked: true } })
            );
          } else {
            window.localStorage.removeItem(STORAGE_TOKEN_KEY);
          }
        }
      } catch {
        // Ignore storage access errors
      }
    };

    void verifyFromLocationOrStorage();
    return () => {
      cancelled = true;
    };
  }, [saveUnlock]);

  if (!modalOpen) return null;

  return (
    <DeluxeModalDialog
      initialTab={initialTab}
      unlockedToken={unlockedToken}
      unlockedEmail={unlockedEmail}
      verifyingRedirect={verifyingRedirect}
      onUnlocked={saveUnlock}
      onSignOut={() => {
        setUnlockedToken(null);
        setUnlockedEmail(null);
        try {
          window.localStorage.removeItem(STORAGE_TOKEN_KEY);
          window.localStorage.removeItem(STORAGE_EMAIL_KEY);
        } catch {
          // Ignore
        }
        window.dispatchEvent(
          new CustomEvent('semi:deluxe-auth-changed', { detail: { unlocked: false } })
        );
      }}
      onClose={() => setModalOpen(false)}
    />
  );
}

export function DeluxeAlbumSection() {
  const [hasUnlocked, setHasUnlocked] = useState(false);

  useEffect(() => {
    const sync = () => {
      try {
        setHasUnlocked(Boolean(window.localStorage.getItem(STORAGE_TOKEN_KEY)));
      } catch {
        setHasUnlocked(false);
      }
    };
    sync();
    window.addEventListener('semi:deluxe-auth-changed', sync);
    return () => window.removeEventListener('semi:deluxe-auth-changed', sync);
  }, []);

  return (
    <section
      id="deluxe-edition"
      aria-labelledby="deluxe-edition-title"
      data-testid="deluxe-edition-section"
      className="border-t border-[var(--a-rule)] bg-[var(--a-surface)] py-16 sm:py-24"
    >
      <div className="mx-auto grid max-w-[1400px] gap-8 sm:gap-12 px-5 sm:px-8 lg:px-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5 min-w-0 space-y-4">
          <p className="font-sans text-[13px] font-semibold uppercase tracking-[0.22em] text-[var(--a-accent-text)]">
            Collector’s Download · 15 Tracks · $12.99
          </p>
          <h2
            id="deluxe-edition-title"
            className="font-display text-3xl sm:text-5xl font-bold text-[var(--a-ink)] leading-[1.06]"
          >
            <em>I/O</em> Deluxe Edition.
          </h2>
          <p className="text-[16px] leading-relaxed text-[var(--a-ink)]/80">
            All 12 commercial songs remain free to stream and download on this site. When you buy
            the <strong>$12.99 Deluxe Collector’s Edition</strong>, you get the complete 15-track
            master sequenced with the exclusive bonus song <strong><em>Localhost</em></strong> plus{' '}
            <strong>two studio alternate takes</strong>—closing with <em>Ghost (Alternate Take)</em>
            —alongside the 10-plate lookbook booklet and lifetime free re-downloads whenever we
            update audio or album artwork.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => triggerOpenDeluxeModal('buy')}
              data-testid="deluxe-section-cta"
              className="inline-flex min-h-[50px] items-center justify-center gap-2.5 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white transition-colors"
            >
              <Disc3 className="w-4 h-4 shrink-0" aria-hidden="true" />
              <span>
                {hasUnlocked
                  ? 'Open Your Unlocked Deluxe Vault'
                  : 'Get 15-Track Deluxe Album · $12.99'}
              </span>
            </button>

            {!hasUnlocked && (
              <button
                type="button"
                onClick={() => triggerOpenDeluxeModal('updates')}
                data-testid="deluxe-returning-buyer-btn"
                className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-well)] hover:border-[var(--a-ink)] px-5 text-[14px] font-semibold text-[var(--a-ink)] transition-colors"
              >
                <KeyRound className="w-4 h-4 text-[var(--a-accent-text)]" aria-hidden="true" />
                <span>Already purchased? Get updates</span>
              </button>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 min-w-0 space-y-6">
          <LocalhostTeaserCard testId="songs-localhost-teaser" />

          <div className="divide-y divide-[var(--a-rule)] border-y border-[var(--a-rule)]">
            <div className="py-4 flex items-center justify-between gap-4">
              <span className="font-code text-[14px] text-[var(--a-muted)]">01 – 12</span>
              <span className="font-display text-lg sm:text-xl font-bold text-[var(--a-ink)] flex-1">
                Complete <em>I/O</em> Commercial Album (320 kbps MP3 + Embedded Cover Art)
              </span>
              <span className="font-code text-[13px] text-[var(--a-muted)] shrink-0">Included</span>
            </div>
            {DELUXE_BONUS_LIST.map((bt) => (
              <div
                key={bt.slug}
                className="py-4 sm:py-5 grid grid-cols-[2.5rem_minmax(0,1fr)] sm:grid-cols-[3rem_1fr_1.2fr] gap-x-3 gap-y-1 sm:items-baseline"
              >
                <span className="font-code text-[14px] font-semibold text-[var(--a-accent-text)]">
                  {bt.number}
                </span>
                <span className="font-display text-lg sm:text-xl font-bold text-[var(--a-ink)]">
                  {bt.title}
                </span>
                <span className="col-start-2 sm:col-start-3 text-[14px] leading-relaxed text-[var(--a-muted)]">
                  {bt.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DeluxeModalDialog({
  initialTab,
  unlockedToken,
  unlockedEmail,
  verifyingRedirect,
  onUnlocked,
  onSignOut,
  onClose,
}: {
  initialTab: 'buy' | 'updates';
  unlockedToken: string | null;
  unlockedEmail: string | null;
  verifyingRedirect: boolean;
  onUnlocked: (token: string, email: string) => void;
  onSignOut: () => void;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const bonusAudioRef = useRef<HTMLAudioElement | null>(null);
  const { pauseAudio: pausePublicPlayer } = useAudioPlayer();

  const [tab, setTab] = useState<'buy' | 'updates'>(initialTab);
  const [email, setEmail] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  // Returning-buyer 6-digit flow
  const [codeStep, setCodeStep] = useState<'email' | 'code'>('email');
  const [loginCode, setLoginCode] = useState('');

  // Deluxe 15-track ZIP download progress
  const [zipStatus, setZipStatus] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');
  const [artZipStatus, setArtZipStatus] = useState<'idle' | 'downloading' | 'done' | 'error'>('idle');
  const [zipProgress, setZipProgress] = useState<{ current: number; total: number }>({
    current: 0,
    total: 16,
  });

  // Private vault bonus preview player (only rendered inside unlocked buyer vault!)
  const [playingBonusSlug, setPlayingBonusSlug] = useState<string | null>(null);

  // Bitcoin Lightning (Strike) invoice state
  const [btcInvoice, setBtcInvoice] = useState<{
    invoiceId: string;
    lnInvoice: string;
    btcAmount: string | null;
    email: string;
  } | null>(null);
  const [btcCopied, setBtcCopied] = useState(false);

  useEffect(() => {
    if (!btcInvoice || unlockedToken) return;
    let active = true;
    const poll = async () => {
      try {
        const res = await fetch(
          `/api/album/bitcoin/status?invoiceId=${encodeURIComponent(btcInvoice.invoiceId)}&email=${encodeURIComponent(btcInvoice.email)}`
        );
        const data = await res.json().catch(() => ({}));
        if (active && data?.paid && data?.token) {
          setBtcInvoice(null);
          onUnlocked(data.token, data.email || btcInvoice.email);
        }
      } catch {
        // Ignore transient poll errors
      }
    };
    const id = window.setInterval(poll, 2500);
    return () => {
      active = false;
      window.clearInterval(id);
    };
  }, [btcInvoice, unlockedToken, onUnlocked]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) {
      dialog.showModal();
    }
    return () => {
      bonusAudioRef.current?.pause();
      if (dialog?.open) {
        dialog.close();
      }
    };
  }, []);

  const isFreePromoTyped = promoCode.trim().toLowerCase() === 'trypipesdotpink';

  const handleCheckoutOrPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    try {
      const res = await fetch('/api/album/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), promoCode: promoCode.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data?.error || 'Could not start checkout. Please check your details.');
        return;
      }

      if (data.unlocked && data.token) {
        onUnlocked(data.token, data.email || email.trim().toLowerCase());
        setInfo(data.message || 'Deluxe Edition unlocked!');
        return;
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch {
      setError('Network error connecting to checkout. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleBitcoinCheckout = async () => {
    setError(null);
    setInfo(null);
    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please enter your email address above first so we can send your receipt and lifetime updates.');
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/album/bitcoin/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.lnInvoice) {
        setError(data?.error || 'Could not create Bitcoin Lightning invoice.');
        return;
      }
      setBtcInvoice({
        invoiceId: data.invoiceId,
        lnInvoice: data.lnInvoice,
        btcAmount: data.btcAmount ?? null,
        email: data.email || cleanEmail,
      });
    } catch {
      setError('Network error creating Bitcoin invoice. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    try {
      const res = await fetch('/api/album/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setError(data?.error || 'Unable to send verification code.');
        return;
      }
      setCodeStep('code');
      setInfo(data.message || 'Check your inbox for your 6-digit code.');
    } catch {
      setError('Network error sending code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setBusy(true);

    try {
      const res = await fetch('/api/album/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), code: loginCode.trim() }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok || !data.token) {
        setError(data?.error || 'Invalid or expired code.');
        return;
      }
      onUnlocked(data.token, data.email || email.trim().toLowerCase());
    } catch {
      setError('Network error verifying code. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadDeluxeZip = async () => {
    if (!unlockedToken || zipStatus === 'downloading') return;
    setZipStatus('downloading');
    const mainTracks = SEMI_TRACKS.filter((t) => Boolean(t.mp3Src));
    const total = mainTracks.length + DELUXE_BONUS_LIST.length + 1;
    setZipProgress({ current: 0, total });

    try {
      const folder = 'Semi - I-O (Deluxe Edition)';
      const entries: ZipEntryInput[] = [];
      const playlistRows: Array<{ filename: string; title: string }> = [];

      // 1. Main commercial tracks 01 .. 12 (with ID3 TRCK updated to X/15 so Apple Music groups 1..15!)
      for (let i = 0; i < mainTracks.length; i++) {
        const t = mainTracks[i];
        const res = await fetch(`${t.mp3Src!}?v=${AUDIO_MASTER_REV}`);
        if (!res.ok) throw new Error(`Failed fetching ${t.title}`);
        const rawBytes = new Uint8Array(await res.arrayBuffer());
        const patchedBytes = patchMp3TrackTotalTo15(rawBytes);
        const filename = `${t.number} - ${t.title.replace(/[/:*?"<>|]/g, '-')}.mp3`;
        entries.push({ name: `${folder}/${filename}`, data: patchedBytes });
        playlistRows.push({ filename, title: t.title });
        setZipProgress({ current: i + 1, total });
      }

      // 2. Exclusive Bonus Alternate Takes 13, 14, 15 (closing with 15 - Ghost Alternate Take!)
      for (let j = 0; j < DELUXE_BONUS_LIST.length; j++) {
        const bt = DELUXE_BONUS_LIST[j];
        const res = await fetch(
          `/api/album/bonus/${bt.slug}?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`
        );
        if (!res.ok) throw new Error(`Failed fetching bonus track ${bt.number}`);
        const buf = new Uint8Array(await res.arrayBuffer());
        const cleanTitle = bt.title.replace(' — Album Finale', '').replace(/[/:*?"<>|]/g, '-');
        const filename = `${bt.number} - ${cleanTitle}.mp3`;
        entries.push({ name: `${folder}/${filename}`, data: buf });
        playlistRows.push({ filename, title: cleanTitle });
        setZipProgress({ current: mainTracks.length + j + 1, total });
      }

      // 3. Deluxe Booklet & Cover Art (9 high-res plates from semi_io_art) + M3U sequential playlist
      const artFiles = [
        'io_cover.jpg',
        'io_cover_rear.jpg',
        'io_01.jpg',
        'io_02.jpg',
        'io_03.jpg',
        'io_05.jpg',
        'io_06.jpg',
        'io_07.jpg',
        'io_08.jpg',
        'io_09.jpg',
        'io_10.jpg',
      ];
      for (const artName of artFiles) {
        const artRes = await fetch(
          `/api/album/art/${artName}?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`
        );
        if (artRes.ok) {
          const artBytes = new Uint8Array(await artRes.arrayBuffer());
          entries.push({ name: `${folder}/Booklet & Art/${artName}`, data: artBytes });
          if (artName === 'io_cover.jpg') {
            entries.push({ name: `${folder}/cover.jpg`, data: artBytes });
          }
        }
      }
      const videoRes = await fetch(
        `/api/album/video/localhost?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`
      );
      if (videoRes.ok) {
        const videoBytes = new Uint8Array(await videoRes.arrayBuffer());
        entries.push({
          name: `${folder}/14 - Localhost (Music Video).mp4`,
          data: videoBytes,
        });
      }

      entries.push({
        name: `${folder}/00 - Play I-O Deluxe (15 Tracks).m3u`,
        data: buildM3uPlaylist(playlistRows),
      });
      setZipProgress({ current: total, total });

      const blob = buildStoreZip(entries);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Semi - I-O (Deluxe 15-Track Album).zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 12_000);

      setZipStatus('done');
      setTimeout(() => setZipStatus('idle'), 4500);
    } catch (err) {
      console.error('[DeluxeZip] Failed:', err);
      setZipStatus('error');
      setTimeout(() => setZipStatus('idle'), 4500);
    }
  };

  const handleDownloadArtZip = async () => {
    if (!unlockedToken || artZipStatus === 'downloading') return;
    setArtZipStatus('downloading');
    try {
      const folder = 'Semi - I-O (Booklet & Art)';
      const entries: ZipEntryInput[] = [];
      const artFiles = [
        'io_cover.jpg',
        'io_cover_rear.jpg',
        'io_01.jpg',
        'io_02.jpg',
        'io_03.jpg',
        'io_05.jpg',
        'io_06.jpg',
        'io_07.jpg',
        'io_08.jpg',
        'io_09.jpg',
        'io_10.jpg',
      ];
      for (const artName of artFiles) {
        const artRes = await fetch(
          `/api/album/art/${artName}?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`
        );
        if (artRes.ok) {
          const artBytes = new Uint8Array(await artRes.arrayBuffer());
          entries.push({ name: `${folder}/${artName}`, data: artBytes });
          if (artName === 'io_cover.jpg') {
            entries.push({ name: `${folder}/cover.jpg`, data: artBytes });
          }
        }
      }
      const blob = buildStoreZip(entries);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Semi - I-O (Booklet & Art).zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 12_000);

      setArtZipStatus('done');
      setTimeout(() => setArtZipStatus('idle'), 4500);
    } catch (err) {
      console.error('[ArtZip] Failed:', err);
      setArtZipStatus('error');
      setTimeout(() => setArtZipStatus('idle'), 4500);
    }
  };

  const toggleVaultBonusStream = (slug: string) => {
    if (!unlockedToken) return;
    pausePublicPlayer();

    if (!bonusAudioRef.current) {
      const el = new Audio();
      el.setAttribute('playsinline', 'true');
      el.addEventListener('ended', () => setPlayingBonusSlug(null));
      el.addEventListener('pause', () => setPlayingBonusSlug((cur) => (el.ended ? null : cur)));
      bonusAudioRef.current = el;
    }

    const el = bonusAudioRef.current;
    if (playingBonusSlug === slug && !el.paused) {
      el.pause();
      setPlayingBonusSlug(null);
      return;
    }

    el.src = `/api/album/bonus/${slug}?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`;
    setPlayingBonusSlug(slug);
    el.play().catch(() => setPlayingBonusSlug(null));
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      aria-label="I/O Deluxe Collector's Edition"
      data-testid="deluxe-album-modal"
      className="fixed inset-0 z-50 m-auto w-[min(94vw,640px)] max-h-[90vh] rounded-2xl border border-[var(--a-rule)] bg-[var(--a-well)] text-[var(--a-ink)] p-0 shadow-2xl backdrop:bg-black/70 overflow-hidden"
    >
      <div className="flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-[var(--a-rule)] bg-[var(--a-surface)]">
          <div className="min-w-0">
            <p className="font-code text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--a-accent-text)]">
              Semi (; - ]) · I/O Collector’s Edition
            </p>
            <h2 className="font-display text-xl sm:text-2xl font-bold truncate">
              {unlockedToken ? 'Your I/O Deluxe Vault (15 Tracks)' : 'Get I/O Deluxe Edition · $12.99'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Deluxe Edition dialog"
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] hover:bg-[var(--a-well)] transition-colors"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          {verifyingRedirect ? (
            <div className="py-10 flex flex-col items-center justify-center gap-3 text-center">
              <Loader2 className="w-7 h-7 animate-spin text-[var(--a-accent-text)]" />
              <p className="text-[15px] font-medium">Verifying your Deluxe Edition access…</p>
            </div>
          ) : unlockedToken ? (
            <div className="space-y-5" data-testid="deluxe-vault-unlocked">
              <div className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-4 space-y-2">
                <p className="text-[14px] font-semibold text-emerald-800 flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>
                    Unlocked for {unlockedEmail || 'your account'} · Lifetime updates included
                  </span>
                </p>
                <p className="text-[14px] leading-relaxed text-[var(--a-muted)]">
                  The 15-track audio is final, while new booklet art and music videos may be released
                  asynchronously. Check back anytime with your email to grab only what’s new—and
                  we’ll email you whenever new art or video drops.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDownloadDeluxeZip}
                disabled={zipStatus === 'downloading'}
                data-testid="download-deluxe-zip-btn"
                className="w-full min-h-[52px] inline-flex items-center justify-center gap-2.5 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-70"
              >
                {zipStatus === 'downloading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      Packing 15-Track Deluxe Album ({zipProgress.current}/{zipProgress.total})…
                    </span>
                  </>
                ) : zipStatus === 'done' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>15-Track Deluxe ZIP Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Download Full 15-Track Deluxe Album (.ZIP)</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadArtZip}
                disabled={artZipStatus === 'downloading'}
                data-testid="download-deluxe-art-zip-btn"
                className="w-full min-h-[48px] inline-flex items-center justify-center gap-2.5 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] hover:border-[var(--a-ink)] px-6 text-[14px] font-semibold text-[var(--a-ink)] transition-colors disabled:opacity-70"
              >
                {artZipStatus === 'downloading' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Packing Booklet &amp; Art (.ZIP)…</span>
                  </>
                ) : artZipStatus === 'done' ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Booklet &amp; Art ZIP Downloaded</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Already Have the Music? Download Booklet &amp; Art Only (.ZIP)</span>
                  </>
                )}
              </button>

              {/* Private in-browser playback & single-track download for Bonus Tracks 13–15 */}
              <div className="space-y-2.5">
                <p className="font-code text-[13px] font-semibold uppercase tracking-[0.14em] text-[var(--a-muted)]">
                  Exclusive Bonus Tracks (Sequenced 13–15 · Mobile Stream &amp; MP3)
                </p>
                <div className="divide-y divide-[var(--a-rule)] rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)]">
                  {DELUXE_BONUS_LIST.map((bt) => {
                    const isPlayingThis = playingBonusSlug === bt.slug;
                    const dlHref = `/api/album/bonus/${bt.slug}?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`;
                    return (
                      <div key={bt.slug} className="p-3.5 flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => toggleVaultBonusStream(bt.slug)}
                          className="min-h-[44px] flex items-center gap-3 text-left flex-1 min-w-0"
                        >
                          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--a-ink)] text-white">
                            {isPlayingThis ? (
                              <Pause className="w-3.5 h-3.5" fill="currentColor" />
                            ) : (
                              <Play className="w-3.5 h-3.5 translate-x-[1px]" fill="currentColor" />
                            )}
                          </span>
                          <span className="min-w-0">
                            <span className="block font-display text-[15px] font-bold truncate">
                              {bt.number} · {bt.title}
                            </span>
                            <span className="block font-code text-[13px] text-[var(--a-muted)]">
                              {bt.duration} · 320 kbps MP3
                            </span>
                          </span>
                        </button>
                        <a
                          href={dlHref}
                          download={`${bt.number} - ${bt.title.replace(' — Album Finale', '')}.mp3`}
                          aria-label={`Download ${bt.title}`}
                          className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] hover:border-[var(--a-ink)] text-[var(--a-accent-text)]"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Exclusive Localhost Music Video */}
              <div className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-3.5 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-display text-[15px] font-bold truncate text-[var(--a-ink)]">
                      14 · Localhost (Music Video)
                    </p>
                    <p className="font-code text-[13px] text-[var(--a-muted)]">
                      HD MP4 · Included in Deluxe ZIP
                    </p>
                  </div>
                  <a
                    href={`/api/album/video/localhost?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`}
                    download="14 - Localhost (Music Video).mp4"
                    aria-label="Download Localhost Music Video"
                    className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] hover:border-[var(--a-ink)] text-[var(--a-accent-text)]"
                  >
                    <Download className="w-4 h-4" />
                  </a>
                </div>
                <video
                  src={`/api/album/video/localhost?token=${encodeURIComponent(unlockedToken)}&v=${AUDIO_MASTER_REV}`}
                  controls
                  playsInline
                  preload="metadata"
                  className="aspect-video w-full rounded-lg bg-[#111827] object-cover"
                />
              </div>

              <PhonePlaybackFaq />

              <div className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)]/70 p-3.5 text-[13px] leading-relaxed text-[var(--a-muted)]">
                <strong>Phone &amp; Apple Music tip:</strong> Every track is numbered{' '}
                <code>01</code>–<code>15</code> with embedded cover art &amp; album tags so Android
                music players and Mac/PC <strong>Apple Music (iTunes)</strong> import the record in
                exact order. (On iPhone, Apple requires adding local MP3s to Apple Music from a Mac
                or PC—or you can stream Bonus Tracks 13–15 right here in your browser anytime.)
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={onSignOut}
                  className="min-h-[44px] px-3 text-[13px] font-medium text-[var(--a-muted)] underline hover:text-[var(--a-ink)]"
                >
                  Switch email
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* Mode switcher: Buy vs Returning Buyer */}
              <div className="grid grid-cols-2 gap-2 rounded-full border border-[var(--a-rule)] bg-[var(--a-surface)] p-1">
                <button
                  type="button"
                  onClick={() => {
                    setTab('buy');
                    setError(null);
                    setInfo(null);
                  }}
                  data-testid="deluxe-tab-buy"
                  className={`min-h-[44px] rounded-full text-[14px] font-semibold transition-colors ${
                    tab === 'buy'
                      ? 'bg-[var(--a-ink)] text-[#FAF8F5]'
                      : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                  }`}
                >
                  Buy Deluxe ($12.99)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('updates');
                    setError(null);
                    setInfo(null);
                  }}
                  data-testid="deluxe-tab-updates"
                  className={`min-h-[44px] rounded-full text-[14px] font-semibold transition-colors ${
                    tab === 'updates'
                      ? 'bg-[var(--a-ink)] text-[#FAF8F5]'
                      : 'text-[var(--a-muted)] hover:text-[var(--a-ink)]'
                  }`}
                >
                  Already Purchased
                </button>
              </div>

              {tab === 'buy' ? (
                <form onSubmit={handleCheckoutOrPromo} className="space-y-4">
                  <p className="text-[15px] leading-relaxed text-[var(--a-ink)]/85">
                    Includes all 12 songs on <em>I/O</em> plus{' '}
                    <strong>13 · Salt In The Rain (Alt Take)</strong>,{' '}
                    <strong>14 · Localhost</strong>, and{' '}
                    <strong>15 · Ghost (Alt Take)</strong> closing the album—along with the 10-plate
                    lookbook booklet and free lifetime updates.
                  </p>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="deluxe-checkout-email"
                      className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]"
                    >
                      Your email (for receipt &amp; future album updates)
                    </label>
                    <input
                      id="deluxe-checkout-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      data-testid="deluxe-email-input"
                      className="w-full min-h-[48px] rounded-xl border border-[var(--a-rule)] bg-white px-4 text-[15px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="deluxe-promo-input"
                      className="flex items-center gap-1.5 font-sans text-[14px] font-semibold text-[var(--a-ink)]"
                    >
                      <Tag className="w-3.5 h-3.5 text-[var(--a-accent-text)]" />
                      <span>Discount code (optional)</span>
                    </label>
                    <input
                      id="deluxe-promo-input"
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="Have a promo code?"
                      data-testid="deluxe-promo-input"
                      className="w-full min-h-[48px] rounded-xl border border-[var(--a-rule)] bg-white px-4 font-code text-[14px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                    />
                  </div>

                  {error && (
                    <p
                      role="alert"
                      data-testid="deluxe-modal-error"
                      className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-900"
                    >
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={busy}
                    data-testid="deluxe-submit-btn"
                    className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-70"
                  >
                    {busy ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Working…</span>
                      </>
                    ) : isFreePromoTyped ? (
                      <span>Unlock Deluxe Album Free ($0.00)</span>
                    ) : (
                      <span>Continue to Stripe Checkout · $12.99</span>
                    )}
                  </button>

                  {!isFreePromoTyped && (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={handleBitcoinCheckout}
                      data-testid="deluxe-bitcoin-btn"
                      className="w-full min-h-[50px] inline-flex items-center justify-center gap-2 rounded-full border border-[var(--a-ink)] bg-[var(--a-surface)] hover:bg-[var(--a-ink)] hover:text-[#FAF8F5] px-6 text-[15px] font-semibold text-[var(--a-ink)] transition-colors disabled:opacity-70"
                    >
                      <span>Pay with Bitcoin (Lightning · $12.99)</span>
                    </button>
                  )}

                  {btcInvoice && (
                    <div
                      data-testid="deluxe-bitcoin-invoice"
                      className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] p-4 space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-sans text-[14px] font-semibold text-[var(--a-ink)]">
                          Lightning Invoice Ready {btcInvoice.btcAmount ? `(${btcInvoice.btcAmount} BTC)` : ''}
                        </p>
                        <span className="font-code text-[13px] text-[var(--a-accent-text)]">
                          Waiting for payment…
                        </span>
                      </div>
                      <p className="font-code text-[13px] break-all rounded-lg border border-[var(--a-rule)] bg-white p-2.5 text-[var(--a-ink)] select-all">
                        {btcInvoice.lnInvoice}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard?.writeText(btcInvoice.lnInvoice);
                            setBtcCopied(true);
                            setTimeout(() => setBtcCopied(false), 2500);
                          }}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[var(--a-ink)] px-4 text-[13px] font-semibold text-white"
                        >
                          {btcCopied ? 'Copied Invoice' : 'Copy Lightning Invoice'}
                        </button>
                        <a
                          href={`lightning:${btcInvoice.lnInvoice}`}
                          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[var(--a-rule)] px-4 text-[13px] font-semibold text-[var(--a-ink)] no-underline"
                        >
                          Open in Wallet
                        </a>
                      </div>
                    </div>
                  )}
                </form>
              ) : codeStep === 'email' ? (
                <form onSubmit={handleSendCode} className="space-y-4">
                  <p className="text-[15px] leading-relaxed text-[var(--a-ink)]/85">
                    Already bought <em>I/O</em>? Enter the email you used at checkout and we’ll send
                    a 6-digit code so you can download the latest tracks and artwork without paying
                    twice.
                  </p>
                  <div className="space-y-1.5">
                    <label
                      htmlFor="deluxe-update-email"
                      className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]"
                    >
                      Checkout email address
                    </label>
                    <input
                      id="deluxe-update-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      data-testid="deluxe-update-email-input"
                      className="w-full min-h-[48px] rounded-xl border border-[var(--a-rule)] bg-white px-4 text-[15px] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-900">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={busy}
                    data-testid="deluxe-send-code-btn"
                    className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-ink)] hover:bg-[var(--a-accent-fill)] px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-70"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Send 6-Digit Access Code</span>
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyCode} className="space-y-4">
                  {info && (
                    <p className="rounded-xl border border-[var(--a-rule)] bg-[var(--a-surface)] px-4 py-3 text-[14px] text-[var(--a-ink)]">
                      {info}
                    </p>
                  )}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="deluxe-code-input"
                      className="block font-sans text-[14px] font-semibold text-[var(--a-ink)]"
                    >
                      6-digit verification code
                    </label>
                    <input
                      id="deluxe-code-input"
                      type="text"
                      inputMode="numeric"
                      pattern="\d{6}"
                      maxLength={6}
                      required
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="123456"
                      data-testid="deluxe-code-input"
                      className="w-full min-h-[52px] rounded-xl border border-[var(--a-rule)] bg-white px-4 text-center font-code text-[22px] tracking-[0.28em] text-[var(--a-ink)] focus:border-[var(--a-ink)] focus:outline-none"
                    />
                  </div>
                  {error && (
                    <p role="alert" className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-[14px] text-red-900">
                      {error}
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={busy}
                    data-testid="deluxe-verify-code-btn"
                    className="w-full min-h-[52px] inline-flex items-center justify-center gap-2 rounded-full bg-[var(--a-accent-fill)] hover:bg-[var(--a-ink)] px-6 text-[15px] font-semibold text-white transition-colors disabled:opacity-70"
                  >
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                    <span>Unlock My Album Updates</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCodeStep('email');
                      setError(null);
                    }}
                    className="w-full min-h-[44px] text-[13px] text-[var(--a-muted)] underline"
                  >
                    Use a different email
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </dialog>,
    document.body
  );
}
