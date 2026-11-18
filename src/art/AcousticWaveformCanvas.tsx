'use client';

import React, { useEffect, useRef } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Six-string acoustic harmonic canvas synced to the shared <audio> element.
 * Uses Web Audio API AnalyserNode when available and falls back gracefully
 * to resonant standing-wave string oscillation while audio plays.
 */
export default function AcousticWaveformCanvas({
  audioRef,
  isPlaying,
  trackSeed = 1,
  className = '',
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  isPlaying: boolean;
  trackSeed?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const connectedElRef = useRef<HTMLAudioElement | null>(null);
  const dataArrayRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const { motionActive } = useAmbientMotion();

  const stateRef = useRef({ isPlaying, motionActive, trackSeed });
  useEffect(() => {
    stateRef.current = { isPlaying, motionActive, trackSeed };
  }, [isPlaying, motionActive, trackSeed]);

  useEffect(() => {
    if (!isPlaying) return;
    const audioEl = audioRef.current;
    if (!audioEl || connectedElRef.current === audioEl) return;

    try {
      const AudioContextCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextCtor) return;

      const ctx = audioCtxRef.current || new AudioContextCtor();
      audioCtxRef.current = ctx;
      if (ctx.state === 'suspended') {
        void ctx.resume();
      }
      const source = ctx.createMediaElementSource(audioEl);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64;
      analyser.smoothingTimeConstant = 0.84;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      dataArrayRef.current = new Uint8Array(new ArrayBuffer(analyser.frequencyBinCount));
      connectedElRef.current = audioEl;
    } catch {
      // Fallback to graceful synthesized string motion if browser blocks Web Audio binding
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let phase = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(canvas.clientWidth, 1);
      const h = Math.max(canvas.clientHeight, 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const STRINGS = 6;

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const { isPlaying: playing, motionActive: active, trackSeed: seed } = stateRef.current;
      let spectrum: Uint8Array<ArrayBuffer> | null = null;

      if (playing && analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        spectrum = dataArrayRef.current;
      }

      if (playing && active) {
        phase += 0.085;
      }

      for (let s = 0; s < STRINGS; s++) {
        const yBase = ((s + 1) / (STRINGS + 1)) * h;
        const binEnergy = spectrum ? (spectrum[Math.min(s * 3 + 2, spectrum.length - 1)] || 0) / 255 : 0;
        const energy = !active
          ? 0
          : playing
            ? Math.max(0.28, binEnergy) * (1 - s * 0.06)
            : 0.04;

        ctx.beginPath();
        const steps = 48;
        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const x = u * w;
          const envelope = Math.sin(u * Math.PI);
          const harmonic =
            Math.sin(u * Math.PI * (1 + (s % 3)) + phase * (1 + s * 0.24) + seed) * 0.65 +
            Math.cos(u * Math.PI * 2 + phase * 1.7 - s) * 0.35;
          const y = yBase + harmonic * envelope * energy * 12;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }

        ctx.strokeStyle =
          s === 1 || s === 4
            ? playing
              ? 'rgba(254, 41, 158, 0.72)'
              : 'rgba(163, 40, 92, 0.28)'
            : playing
              ? 'rgba(17, 24, 39, 0.42)'
              : 'rgba(17, 24, 39, 0.16)';
        ctx.lineWidth = s === 1 || s === 4 ? 1.8 : 1.15;
        ctx.stroke();
      }

      if (playing && active) {
        raf = requestAnimationFrame(draw);
      }
    };

    draw();
    if (isPlaying && motionActive) {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [isPlaying, motionActive, trackSeed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`block w-full h-24 select-none ${className}`}
    />
  );
}
