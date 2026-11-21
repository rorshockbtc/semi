'use client';

import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import {
  AUTUMN_PIGMENTS,
  type Rgb,
  lerpRgb,
  scheduleSoftEvaporate,
  smoothstep,
} from '@/art/autumn-palette';

type DropKind = 'ochre' | 'sienna' | 'sumac' | 'linen';

const DROP_KINDS: DropKind[] = ['ochre', 'sienna', 'sumac', 'linen'];

interface BloomDrop {
  x: number;
  y: number;
  baseRadius: number;
  maxRadius: number;
  kind: DropKind;
  bornAt: number;
  lifeMs: number;
  evaporateAt?: number;
  lobes: number[];
  peakAlpha: number;
  rotation: number;
}

interface GravityDrip {
  x: number;
  headX: number;
  headY: number;
  traveled: number;
  targetLength: number;
  baseWidth: number;
  seed: number;
  kind: DropKind;
  bornAt: number;
  lifeMs: number;
  evaporateAt?: number;
  trail: Array<{ x: number; y: number }>;
  poolSpawned: boolean;
}

function pigmentFor(kind: DropKind): { core: Rgb; ring: Rgb; blend: GlobalCompositeOperation } {
  if (kind === 'ochre') {
    return {
      core: AUTUMN_PIGMENTS.goldenrodOchre,
      ring: AUTUMN_PIGMENTS.burntSienna,
      blend: 'multiply',
    };
  }
  if (kind === 'sienna') {
    return {
      core: AUTUMN_PIGMENTS.burntSienna,
      ring: AUTUMN_PIGMENTS.copperRusset,
      blend: 'multiply',
    };
  }
  if (kind === 'sumac') {
    return {
      core: AUTUMN_PIGMENTS.sumacCrimson,
      ring: lerpRgb(AUTUMN_PIGMENTS.sumacCrimson, AUTUMN_PIGMENTS.sovereignPink, 0.35),
      blend: 'multiply',
    };
  }
  return {
    core: AUTUMN_PIGMENTS.crispLinen,
    ring: AUTUMN_PIGMENTS.goldenrodOchre,
    blend: 'screen',
  };
}

/**
 * Autumn watercolor drop & slender gravity-drip canvas for `/about`.
 * Adapted from Asterisk's `WatercolorDripCanvas` for Semi's notebook & colophon story:
 * - Drops of goldenrod ochre, burnt sienna, sumac crimson, and crisp white linen water
 *   bloom softly and occasionally run downward in delicate capillary trails.
 * - Honors `useAmbientMotion` ("Pause motion") and `prefers-reduced-motion`, and sleeps when off-screen.
 */
export default function AutumnDripCanvas({
  containerRef,
}: {
  containerRef: React.RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const active = !reduce && motionActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!active) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let visible = true;
    let kindIdx = 0;
    let lastSpawnAt = 0;
    const drops: BloomDrop[] = [];
    const drips: GravityDrip[] = [];

    const resize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(container);

    const nextKind = (): DropKind => {
      const k = DROP_KINDS[kindIdx % DROP_KINDS.length];
      kindIdx += 1;
      return k;
    };

    const spawnBloom = (x: number, y: number, now: number, kind?: DropKind, scale = 1) => {
      const isMobile = width < 640;
      const mScale = (isMobile ? 0.78 : 1) * scale;
      const chosen = kind ?? nextKind();
      const baseRadius = (14 + Math.random() * 12) * mScale;
      const lobes: number[] = [];
      for (let i = 0; i < 10; i++) {
        lobes.push(0.8 + Math.random() * 0.4);
      }

      drops.push({
        x,
        y,
        baseRadius,
        maxRadius: baseRadius * (2.1 + Math.random() * 0.65),
        kind: chosen,
        bornAt: now,
        lifeMs: 9500 + Math.random() * 2500,
        lobes,
        peakAlpha: chosen === 'linen' ? 0.28 : 0.12 + Math.random() * 0.04,
        rotation: Math.random() * Math.PI * 2,
      });

      scheduleSoftEvaporate(drops, isMobile ? 28 : 64, now);
    };

    const spawnDrip = (x: number, y: number, now: number, kind: DropKind) => {
      const isMobile = width < 640;
      drips.push({
        x,
        headX: x,
        headY: y,
        traveled: 0,
        targetLength: (isMobile ? 65 : 95) + Math.random() * (isMobile ? 55 : 95),
        baseWidth: isMobile ? 2.4 : 3.1,
        seed: Math.random() * 100,
        kind,
        bornAt: now,
        lifeMs: 10000 + Math.random() * 2000,
        trail: [{ x, y }],
        poolSpawned: false,
      });
      scheduleSoftEvaporate(drips, isMobile ? 10 : 22, now);
    };

    const drawBloom = (drop: BloomDrop, now: number): boolean => {
      const age = now - drop.bornAt;
      if (age >= drop.lifeMs) return false;
      if (age < 0) return true;

      let evapT = 0;
      if (drop.evaporateAt !== undefined) {
        evapT = Math.min(1, Math.max(0, (now - drop.evaporateAt) / 2800));
        if (evapT >= 1) return false;
      }

      const t = age / drop.lifeMs;
      const spread = 1 - Math.pow(1 - Math.min(1, age / 1500), 2.3);
      const radius =
        (drop.baseRadius + (drop.maxRadius - drop.baseRadius) * spread) *
        (1 + 0.25 * smoothstep(0, 1, evapT));

      const fadeIn = Math.min(1, age / 260);
      const fadeOut = t > 0.56 ? Math.pow(1 - (t - 0.56) / 0.44, 1.55) : 1;
      const evapFade = drop.evaporateAt !== undefined ? Math.pow(1 - evapT, 1.7) : 1;
      const alpha = drop.peakAlpha * fadeIn * fadeOut * evapFade;
      if (alpha <= 0.003) return drop.evaporateAt === undefined;

      const { core, ring, blend } = pigmentFor(drop.kind);
      ctx.save();
      ctx.globalCompositeOperation = blend;
      ctx.translate(drop.x, drop.y);
      ctx.rotate(drop.rotation + t * 0.12);

      const grad = ctx.createRadialGradient(0, 0, radius * 0.1, 0, 0, radius);
      grad.addColorStop(0, `rgba(${core.r}, ${core.g}, ${core.b}, ${(alpha * 0.68).toFixed(4)})`);
      grad.addColorStop(0.64, `rgba(${ring.r}, ${ring.g}, ${ring.b}, ${(alpha * 0.96).toFixed(4)})`);
      grad.addColorStop(0.88, `rgba(${ring.r}, ${ring.g}, ${ring.b}, ${(alpha * 0.45).toFixed(4)})`);
      grad.addColorStop(1, `rgba(${ring.r}, ${ring.g}, ${ring.b}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      const n = drop.lobes.length;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI * 2;
        const rr = radius * (drop.lobes[i] + Math.sin(t * 2.6 + i * 1.5) * 0.06);
        pts.push({ x: Math.cos(theta) * rr, y: Math.sin(theta) * rr });
      }
      for (let i = 0; i < n; i++) {
        const curr = pts[i];
        const next = pts[(i + 1) % n];
        const midX = (curr.x + next.x) * 0.5;
        const midY = (curr.y + next.y) * 0.5;
        if (i === 0) {
          const prev = pts[n - 1];
          ctx.moveTo((prev.x + curr.x) * 0.5, (prev.y + curr.y) * 0.5);
        }
        ctx.quadraticCurveTo(curr.x, curr.y, midX, midY);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return true;
    };

    const drawDrip = (drip: GravityDrip, now: number): boolean => {
      const age = now - drip.bornAt;
      if (age >= drip.lifeMs) return false;
      if (age < 0) return true;

      let evapT = 0;
      if (drip.evaporateAt !== undefined) {
        evapT = Math.min(1, Math.max(0, (now - drip.evaporateAt) / 2600));
        if (evapT >= 1) return false;
      }

      if (drip.traveled < drip.targetLength && drip.headY < height - 16) {
        const speed = 0.85 + (1 - drip.traveled / drip.targetLength) * 1.35;
        const meander = Math.sin(drip.traveled * 0.08 + drip.seed) * 0.45;
        drip.headX += meander;
        drip.headY += speed;
        drip.traveled += speed;
        const last = drip.trail[drip.trail.length - 1];
        if (Math.hypot(drip.headX - last.x, drip.headY - last.y) >= 3) {
          drip.trail.push({ x: drip.headX, y: drip.headY });
        }
      } else if (!drip.poolSpawned) {
        drip.poolSpawned = true;
        spawnBloom(drip.headX, drip.headY, now, drip.kind, 0.72);
      }

      const t = age / drip.lifeMs;
      const fadeOut = t > 0.58 ? Math.pow(1 - (t - 0.58) / 0.42, 1.6) : 1;
      const evapFade = drip.evaporateAt !== undefined ? Math.pow(1 - evapT, 1.7) : 1;
      const alpha = (drip.kind === 'linen' ? 0.34 : 0.18) * fadeOut * evapFade;
      if (alpha <= 0.003 || drip.trail.length < 2) return drip.evaporateAt === undefined;

      const { ring, blend } = pigmentFor(drip.kind);
      ctx.save();
      ctx.globalCompositeOperation = blend;
      ctx.strokeStyle = `rgba(${ring.r}, ${ring.g}, ${ring.b}, ${alpha.toFixed(4)})`;
      ctx.lineWidth = drip.baseWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(drip.trail[0].x, drip.trail[0].y);
      for (let i = 1; i < drip.trail.length; i++) {
        ctx.lineTo(drip.trail[i].x, drip.trail[i].y);
      }
      ctx.stroke();

      // Tiny bead at the leading tip of the wet drip
      const tip = drip.trail[drip.trail.length - 1];
      ctx.fillStyle = `rgba(${ring.r}, ${ring.g}, ${ring.b}, ${Math.min(0.45, alpha * 1.45).toFixed(4)})`;
      ctx.beginPath();
      ctx.arc(tip.x, tip.y, drip.baseWidth * 1.15, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      return true;
    };

    const startLoop = () => {
      if (rafId) return;
      const tick = (now: number) => {
        if (!visible || document.hidden) {
          rafId = 0;
          return;
        }
        ctx.clearRect(0, 0, width, height);
        for (let i = drops.length - 1; i >= 0; i--) {
          if (!drawBloom(drops[i], now)) drops.splice(i, 1);
        }
        for (let i = drips.length - 1; i >= 0; i--) {
          if (!drawDrip(drips[i], now)) drips.splice(i, 1);
        }
        if (drops.length > 0 || drips.length > 0) {
          rafId = requestAnimationFrame(tick);
        } else {
          rafId = 0;
        }
      };
      rafId = requestAnimationFrame(tick);
    };

    // Seed 3 delicate margin drops + 2 slender ink/autumn drips on arrival
    const seedNow = performance.now();
    const seedPoints = [
      { x: width * 0.86, y: Math.min(120, height * 0.18), drip: true },
      { x: width * 0.12, y: Math.min(200, height * 0.32), drip: false },
      { x: width * 0.74, y: Math.min(260, height * 0.44), drip: true },
    ];
    seedPoints.forEach((sp, idx) => {
      const k = nextKind();
      spawnBloom(sp.x, sp.y, seedNow + idx * 180, k, 1.1);
      if (sp.drip) {
        spawnDrip(sp.x, sp.y, seedNow + idx * 180 + 220, k);
      }
    });
    startLoop();

    const toLocal = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (x < 0 || x > rect.width || y < 0 || y > rect.height) return null;
      return { x, y };
    };

    const onPointerMove = (e: PointerEvent) => {
      const now = performance.now();
      if (now - lastSpawnAt < 180) return;
      if (e.target instanceof Element && e.target.closest('button, a, input, textarea, figure')) {
        return;
      }
      const pt = toLocal(e);
      if (!pt) return;
      lastSpawnAt = now;
      const k = nextKind();
      spawnBloom(pt.x, pt.y, now, k, 0.92);
      if (Math.random() < 0.38) {
        spawnDrip(pt.x, pt.y, now + 120, k);
      }
      startLoop();
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, input, textarea, figure')) {
        return;
      }
      const pt = toLocal(e);
      if (!pt) return;
      const now = performance.now();
      const k = nextKind();
      spawnBloom(pt.x, pt.y, now, k, 1.2);
      spawnDrip(pt.x, pt.y, now + 90, k);
      startLoop();
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active, containerRef]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="about-autumn-drip-canvas"
      className="pointer-events-none absolute inset-0 z-0 block h-full w-full"
    />
  );
}
