'use client';

import React, { useEffect, useRef } from 'react';
import { useAmbientMotion } from '@/context/AmbientMotionContext';
import { smoothstep } from '@/art/autumn-palette';
import { isLowEndDevice } from '@/art/device-tier';

interface Rgb {
  r: number;
  g: number;
  b: number;
}

const COSMOS_PALETTE: Rgb[] = [
  { r: 28, g: 58, b: 124 }, // Prussian deep space
  { r: 196, g: 92, b: 24 }, // Accretion disk amber-sienna
  { r: 168, g: 34, b: 84 }, // Gravitational redshift sumac
  { r: 78, g: 48, b: 140 }, // Cherenkov violet
  { r: 30, g: 94, b: 116 }, // Interstellar teal-slate
];

interface RealPhysicsEquation {
  formula: string;
  label: string;
}

const REAL_PHYSICS_EQUATIONS: RealPhysicsEquation[] = [
  { formula: 'dτ = dt √(1 − 2GM / rc²)', label: 'SCHWARZSCHILD TIME DILATION' },
  { formula: 'Rμν − ½Rgμν + Λgμν = (8πG/c⁴)Tμν', label: 'EINSTEIN FIELD EQUATIONS' },
  { formula: '1 + z = (1 − rₛ / r)⁻¹/²', label: 'GRAVITATIONAL REDSHIFT' },
  { formula: 'γ = (1 − v²/c²)⁻¹/²   [0.99c ⇒ 7.09]', label: 'LORENTZ FACTOR' },
  { formula: 'ds² = −(1−rₛ/r)c²dt² + (1−rₛ/r)⁻¹dr² + r²dΩ²', label: 'SCHWARZSCHILD METRIC' },
  { formula: 'rₛ = 2GM / c²', label: 'EVENT HORIZON RADIUS' },
  { formula: 'r_ph = 3GM / c² = 1.5 rₛ', label: 'PHOTON SPHERE ORBIT' },
  { formula: 'r_ISCO = 6GM / c² = 3 rₛ', label: 'INNERMOST STABLE ORBIT' },
  { formula: 'Δg = (2GM / r³) Δr', label: 'TIDAL GRAVITY GRADIENT' },
  { formula: 'f_obs = f_emit √((1 − β)/(1 + β))', label: 'RELATIVISTIC DOPPLER SHIFT' },
  { formula: 'w(r) = 2 √(rₛ(r − rₛ))', label: 'FLAMM’S PARABOLOID' },
  { formula: 'Δφ = 6πGM / [a(1 − e²)c²]', label: 'PERIAPSIS PRECESSION' },
];

type DiagramKind =
  | 'black-hole-lens'
  | 'gravity-funnel'
  | 'light-cone'
  | 'rosette-orbit'
  | 'spiral-galaxy'
  | 'gw-quadrupole';

const DIAGRAM_KINDS: DiagramKind[] = [
  'black-hole-lens',
  'gravity-funnel',
  'light-cone',
  'rosette-orbit',
  'spiral-galaxy',
  'gw-quadrupole',
];

interface NebulaWash {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  rotSpeed: number;
  baseRadius: number;
  maxSpread: number;
  aspect: number;
  color: Rgb;
  bornAt: number;
  lifeMs: number;
  lobes: number[];
  peakAlpha: number;
}

interface PhysicsVignette {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  lifeMs: number;
  kind: 'equation' | 'diagram';
  equation?: RealPhysicsEquation;
  diagram?: DiagramKind;
  scale: number;
  rotation: number;
  color: Rgb;
  peakAlpha: number;
}

interface StarParticle {
  x: number;
  y: number;
  z: number;
  speed: number;
  warm: number; // 0 = cool blue-shifted, 1 = warm redshifted
  phase: number;
}

/**
 * Full-page galactic & relativistic physics scroll + cursor engine for `/persist`.
 *
 * Mounted fixed across the entire viewport (`fixed inset-0 z-[2] mix-blend-multiply`):
 * - Continuous curved spacetime geodesic grid that lenses around the cursor and shifts with scroll.
 * - Parallax starfield & Doppler streaks that stretch with scroll velocity.
 * - Galactic nebula washes + real General/Special Relativity equations + astronomical diagrams
 *   (Gargantua black hole lensing, Flamm's paraboloid funnel, tilting light cones, precessing
 *   rosette orbits, spiral galaxies, and gravitational-wave quadrupoles) unfurling down the whole page as you scroll.
 */
export default function PersistCosmosWash() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { motionActive: active } = useAmbientMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const lowEnd = isLowEndDevice();
    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let lastTime = performance.now();
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollAccum = 0;
    let artifactCounter = 0;
    let equationIdx = 0;
    let diagramIdx = 0;
    let paletteIdx = 0;
    let lastPointer: { x: number; y: number; time: number } | null = null;
    const pointer = { x: -9999, y: -9999, active: false };

    const washes: NebulaWash[] = [];
    const vignettes: PhysicsVignette[] = [];
    const stars: StarParticle[] = [];

    const nextColor = (): Rgb => {
      const c = COSMOS_PALETTE[paletteIdx % COSMOS_PALETTE.length];
      paletteIdx++;
      return c;
    };

    const seedStars = () => {
      stars.length = 0;
      const count = width < 640 ? 55 : 105;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          z: 0.4 + Math.random() * 0.95,
          speed: 0.14 + Math.random() * 0.42,
          warm: Math.random(),
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    const resize = () => {
      dpr = lowEnd ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, window.innerWidth);
      height = Math.max(1, window.innerHeight);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seedStars();
    };

    resize();

    const spawnNebula = (
      x: number,
      y: number,
      dx: number,
      dy: number,
      now: number,
      opts?: { radiusScale?: number; alpha?: number; lifeMs?: number; color?: Rgb }
    ) => {
      const isMobile = width < 640;
      const scale = (isMobile ? 0.78 : 1) * (opts?.radiusScale ?? 1);
      const lobes: number[] = [];
      for (let i = 0; i < 10; i++) {
        lobes.push(0.76 + Math.random() * 0.48);
      }
      washes.push({
        x,
        y,
        vx: dx * 0.02 + (Math.random() - 0.5) * 0.22,
        vy: dy * 0.02 + (Math.random() - 0.5) * 0.22,
        angle: Math.atan2(dy, dx) + (Math.random() - 0.5) * 0.6,
        rotSpeed: (Math.random() - 0.5) * 0.003,
        baseRadius: (48 + Math.random() * 30) * scale,
        maxSpread: 1.85 + Math.random() * 0.45,
        aspect: 1.45 + Math.random() * 0.55,
        color: opts?.color ?? nextColor(),
        bornAt: now,
        lifeMs: opts?.lifeMs ?? 11500 + Math.random() * 3500,
        lobes,
        peakAlpha: opts?.alpha ?? 0.24,
      });
      if (washes.length > (isMobile ? 18 : 34)) {
        washes.shift();
      }
    };

    const spawnVignette = (
      x: number,
      y: number,
      now: number,
      forceKind?: 'equation' | 'diagram',
      lifeMs = 13500
    ) => {
      const isMobile = width < 640;
      const kind = forceKind ?? (artifactCounter % 2 === 0 ? 'diagram' : 'equation');
      artifactCounter++;

      const color = nextColor();
      if (kind === 'equation') {
        const eq = REAL_PHYSICS_EQUATIONS[equationIdx % REAL_PHYSICS_EQUATIONS.length];
        equationIdx++;
        vignettes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.14,
          vy: -0.08 + (Math.random() - 0.5) * 0.08,
          bornAt: now,
          lifeMs,
          kind: 'equation',
          equation: eq,
          scale: isMobile ? 0.88 : 1,
          rotation: (Math.random() - 0.5) * 0.05,
          color,
          peakAlpha: 0.48,
        });
      } else {
        const diag = DIAGRAM_KINDS[diagramIdx % DIAGRAM_KINDS.length];
        diagramIdx++;
        vignettes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.12,
          vy: -0.06 + (Math.random() - 0.5) * 0.08,
          bornAt: now,
          lifeMs,
          kind: 'diagram',
          diagram: diag,
          scale: isMobile ? 0.84 : 1.08,
          rotation: (Math.random() - 0.5) * 0.24,
          color,
          peakAlpha: 0.52,
        });
      }

      if (vignettes.length > (isMobile ? 8 : 14)) {
        vignettes.shift();
      }
    };

    // Seed initial galactic washes + real physics vignettes across the viewport immediately
    const seedNow = performance.now();
    const initialSeeds = [
      { rx: 0.14, ry: 0.2, kind: 'diagram' as const },
      { rx: 0.82, ry: 0.22, kind: 'equation' as const },
      { rx: 0.76, ry: 0.58, kind: 'diagram' as const },
      { rx: 0.18, ry: 0.72, kind: 'equation' as const },
      { rx: 0.52, ry: 0.86, kind: 'diagram' as const },
    ];
    initialSeeds.forEach((pt, i) => {
      const c = nextColor();
      spawnNebula(width * pt.rx, height * pt.ry, 10, 3, seedNow - 800 + i * 70, {
        radiusScale: 1.45,
        alpha: 0.26,
        lifeMs: 18000,
        color: c,
      });
      spawnVignette(width * pt.rx, height * pt.ry, seedNow - 600 + i * 80, pt.kind, 18000);
    });

    const drawNebula = (b: NebulaWash, now: number): boolean => {
      const age = now - b.bornAt;
      if (age >= b.lifeMs) return false;
      if (age < 0) return true;

      const t = age / b.lifeMs;
      const spread = 1 - Math.pow(1 - Math.min(1, age / 1400), 2.2) + t * 0.3;
      const swell = t > 0.55 ? 1 + smoothstep(0.55, 1, t) * 0.22 : 1;
      const radius = b.baseRadius * (1 + (b.maxSpread - 1) * spread) * swell;

      const fadeIn = Math.min(1, age / 320);
      const fadeOut = t > 0.55 ? Math.pow(1 - (t - 0.55) / 0.45, 1.5) : 1;
      const alpha = b.peakAlpha * fadeIn * fadeOut;
      if (alpha <= 0.003) return false;

      const frames = age / 16.67;
      const cx = b.x + b.vx * frames * 0.45;
      const cy = b.y + b.vy * frames * 0.45;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(b.angle + b.rotSpeed * frames);
      ctx.scale(b.aspect * (1 - t * 0.14), 1 + t * 0.12);

      const { r, g, b: blue } = b.color;
      const grad = ctx.createRadialGradient(0, 0, radius * 0.06, 0, 0, radius);
      grad.addColorStop(0, `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.62).toFixed(4)})`);
      grad.addColorStop(0.58, `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.95).toFixed(4)})`);
      grad.addColorStop(0.84, `rgba(${r}, ${g}, ${blue}, ${(alpha * 0.46).toFixed(4)})`);
      grad.addColorStop(1, `rgba(${r}, ${g}, ${blue}, 0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      const n = b.lobes.length;
      const pts: Array<{ x: number; y: number }> = [];
      for (let i = 0; i < n; i++) {
        const theta = (i / n) * Math.PI * 2;
        const wobble = b.lobes[i] + Math.sin(t * 2.6 + i * 1.5) * 0.07;
        const rr = radius * wobble;
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

    const drawAstronomicalDiagram = (kind: DiagramKind, alpha: number, color: Rgb, now: number) => {
      const strokeMain = `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha.toFixed(3)})`;
      const strokeSoft = `rgba(${color.r}, ${color.g}, ${color.b}, ${(alpha * 0.5).toFixed(3)})`;
      const fillSoft = `rgba(${color.r}, ${color.g}, ${color.b}, ${(alpha * 0.14).toFixed(3)})`;
      const phase = now * 0.0012;

      if (kind === 'black-hole-lens') {
        // Gargantua relativistic black hole silhouette + lensed photon halo + beamed accretion disk
        ctx.strokeStyle = strokeSoft;
        ctx.lineWidth = 1.2;
        // Upper & lower gravitationally lensed Einstein arcs
        ctx.beginPath();
        ctx.arc(0, 0, 44, Math.PI * 1.08, Math.PI * 1.92);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, 40, Math.PI * 0.12, Math.PI * 0.88);
        ctx.stroke();

        // Tilted accretion disk (Doppler-beamed thicker on left approaching side)
        ctx.save();
        ctx.rotate(-0.18);
        ctx.beginPath();
        ctx.ellipse(0, 0, 74, 15, 0, 0, Math.PI * 2);
        ctx.strokeStyle = strokeMain;
        ctx.lineWidth = 2.2;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, 58, 11, 0, 0, Math.PI * 2);
        ctx.strokeStyle = strokeSoft;
        ctx.lineWidth = 1.1;
        ctx.stroke();
        ctx.restore();

        // Event horizon shadow + photon sphere ring (1.5 r_s)
        ctx.beginPath();
        ctx.arc(0, 0, 22, 0, Math.PI * 2);
        ctx.fillStyle = fillSoft;
        ctx.fill();
        ctx.strokeStyle = strokeMain;
        ctx.lineWidth = 1.8;
        ctx.stroke();

        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = strokeMain;
        ctx.fillText('rₛ · PHOTON RING 1.5rₛ', -66, 64);
      } else if (kind === 'gravity-funnel') {
        // Flamm's Paraboloid 3D spacetime curvature funnel w(r) = 2√(r_s(r - r_s))
        const rings = [
          { rx: 68, ry: 18, y: -26 },
          { rx: 48, ry: 13, y: -8 },
          { rx: 30, ry: 8.5, y: 12 },
          { rx: 16, ry: 5, y: 32 },
          { rx: 8, ry: 2.8, y: 48 },
        ];
        ctx.lineWidth = 1.3;
        rings.forEach((rg, idx) => {
          ctx.beginPath();
          ctx.ellipse(0, rg.y, rg.rx, rg.ry, 0, 0, Math.PI * 2);
          ctx.strokeStyle = idx === 0 || idx === rings.length - 1 ? strokeMain : strokeSoft;
          ctx.stroke();
        });
        // Throat walls (parabolic meridians)
        for (const side of [-1, -0.45, 0.45, 1]) {
          ctx.beginPath();
          ctx.moveTo(side * 68, -26);
          ctx.quadraticCurveTo(side * 24, 4, side * 8, 48);
          ctx.strokeStyle = Math.abs(side) === 1 ? strokeMain : strokeSoft;
          ctx.stroke();
        }
        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = strokeMain;
        ctx.fillText('GRAVITY WELL · g₀₀(r)', -64, 68);
      } else if (kind === 'light-cone') {
        // Future & past null light cones (ds² = 0) with tilting worldline
        ctx.save();
        ctx.rotate(-0.22);
        // Future cone
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-34, -52);
        ctx.lineTo(34, -52);
        ctx.closePath();
        ctx.fillStyle = fillSoft;
        ctx.fill();
        ctx.strokeStyle = strokeMain;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, -52, 34, 8, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Past cone
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-26, 40);
        ctx.lineTo(26, 40);
        ctx.strokeStyle = strokeSoft;
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 40, 26, 6, 0, 0, Math.PI * 2);
        ctx.stroke();

        // Time axis ct
        ctx.setLineDash([4, 3]);
        ctx.beginPath();
        ctx.moveTo(0, 48);
        ctx.lineTo(0, -64);
        ctx.strokeStyle = strokeMain;
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();

        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = strokeMain;
        ctx.fillText('LIGHT CONE · ds² = 0', -62, 64);
      } else if (kind === 'rosette-orbit') {
        // Schwarzschild periapsis precession rosette orbit
        ctx.beginPath();
        const steps = 150;
        for (let i = 0; i <= steps; i++) {
          const theta = (i / steps) * Math.PI * 6;
          const r = 36 + 24 * Math.cos(2.333 * theta + phase * 0.5);
          const px = Math.cos(theta) * r;
          const py = Math.sin(theta) * r * 0.78;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.strokeStyle = strokeMain;
        ctx.lineWidth = 1.4;
        ctx.stroke();

        // Central mass
        ctx.beginPath();
        ctx.arc(0, 0, 6, 0, Math.PI * 2);
        ctx.fillStyle = strokeMain;
        ctx.fill();

        // Orbiting body
        const orbTheta = (phase * 1.4) % (Math.PI * 6);
        const orbR = 36 + 24 * Math.cos(2.333 * orbTheta + phase * 0.5);
        ctx.beginPath();
        ctx.arc(Math.cos(orbTheta) * orbR, Math.sin(orbTheta) * orbR * 0.78, 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 34, 84, ${Math.min(1, alpha * 1.3).toFixed(3)})`;
        ctx.fill();

        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = strokeMain;
        ctx.fillText('PRECESSING GEODESIC', -64, 62);
      } else if (kind === 'spiral-galaxy') {
        // Logarithmic two-arm spiral galaxy
        ctx.save();
        ctx.rotate(phase * 0.18);
        for (const armOffset of [0, Math.PI]) {
          ctx.beginPath();
          for (let i = 0; i <= 54; i++) {
            const th = (i / 54) * Math.PI * 2.5;
            const rr = 5 * Math.exp(0.32 * th);
            const gx = Math.cos(th + armOffset) * rr;
            const gy = Math.sin(th + armOffset) * rr * 0.65;
            if (i === 0) ctx.moveTo(gx, gy);
            else ctx.lineTo(gx, gy);
          }
          ctx.strokeStyle = strokeMain;
          ctx.lineWidth = 1.6;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, 8, 0, Math.PI * 2);
        ctx.fillStyle = fillSoft;
        ctx.fill();
        ctx.strokeStyle = strokeMain;
        ctx.stroke();
        ctx.restore();

        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = strokeMain;
        ctx.fillText('GALACTIC SPIRAL · r = ae^(bθ)', -78, 62);
      } else {
        // Gravitational-wave quadrupole ripples (h+, hx)
        for (let k = 1; k <= 4; k++) {
          const baseR = 14 * k + ((phase * 14) % 14);
          const stretch = Math.sin(phase * 2 + k) * 5;
          ctx.beginPath();
          ctx.ellipse(0, 0, baseR + stretch, Math.max(6, baseR - stretch), 0, 0, Math.PI * 2);
          ctx.strokeStyle = k <= 2 ? strokeMain : strokeSoft;
          ctx.lineWidth = k === 1 ? 1.6 : 1.1;
          ctx.stroke();
        }
        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = strokeMain;
        ctx.fillText('METRIC STRAIN · h₊ / h×', -68, 72);
      }
    };

    const drawVignette = (v: PhysicsVignette, now: number): boolean => {
      const age = now - v.bornAt;
      if (age >= v.lifeMs) return false;
      if (age < 0) return true;

      const t = age / v.lifeMs;
      const fadeIn = Math.min(1, age / 420);
      const fadeOut = t > 0.62 ? Math.pow(1 - (t - 0.62) / 0.38, 1.45) : 1;
      const alpha = v.peakAlpha * fadeIn * fadeOut;
      if (alpha <= 0.005) return false;

      const frames = age / 16.67;
      const cx = v.x + v.vx * frames * 0.5;
      const cy = v.y + v.vy * frames * 0.5;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(v.rotation);
      ctx.scale(v.scale, v.scale);

      if (v.kind === 'equation' && v.equation) {
        const { r, g, b } = v.color;
        ctx.textAlign = 'center';
        ctx.font = '600 16px Georgia, "Times New Roman", serif';
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${Math.min(0.75, alpha * 1.25).toFixed(3)})`;
        ctx.fillText(v.equation.formula, 0, 0);

        ctx.font = '600 13px ui-monospace, SFMono-Regular, Menlo, monospace';
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.82).toFixed(3)})`;
        ctx.fillText(v.equation.label, 0, 20);

        // Subtle astrometric crosshair tick marks flanking the equation
        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${(alpha * 0.45).toFixed(3)})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-70, -14);
        ctx.lineTo(-78, -14);
        ctx.lineTo(-78, -6);
        ctx.moveTo(70, 28);
        ctx.lineTo(78, 28);
        ctx.lineTo(78, 20);
        ctx.stroke();
        ctx.textAlign = 'start';
      } else if (v.kind === 'diagram' && v.diagram) {
        drawAstronomicalDiagram(v.diagram, alpha, v.color, now);
      }

      ctx.restore();
      return true;
    };

    const drawFrame = (now: number) => {
      if (document.hidden) {
        rafId = requestAnimationFrame(drawFrame);
        return;
      }

      const dt = Math.min(48, now - lastTime);
      lastTime = now;
      scrollVelocity *= 0.9;

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'multiply';

      // 1. Curved Spacetime Geodesic Grid (warps around cursor + scrolls in parallax)
      const gridStep = width < 640 ? 78 : 104;
      const scrollOffset = (window.scrollY * 0.28) % gridStep;
      ctx.lineWidth = 0.9;
      ctx.strokeStyle = 'rgba(36, 62, 114, 0.13)';

      for (let gy = -scrollOffset; gy <= height + gridStep; gy += gridStep) {
        ctx.beginPath();
        for (let gx = 0; gx <= width; gx += 32) {
          let wy = gy;
          if (pointer.active) {
            const dx = gx - pointer.x;
            const dy = gy - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 260) {
              const pull = Math.pow(1 - dist / 260, 2) * 30;
              wy += (dy / (dist + 18)) * pull;
            }
          }
          if (gx === 0) ctx.moveTo(gx, wy);
          else ctx.lineTo(gx, wy);
        }
        ctx.stroke();
      }

      for (let gx = 0; gx <= width; gx += gridStep) {
        ctx.beginPath();
        for (let gy = 0; gy <= height; gy += 32) {
          let wx = gx;
          if (pointer.active) {
            const dx = gx - pointer.x;
            const dy = gy - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < 260) {
              const pull = Math.pow(1 - dist / 260, 2) * 30;
              wx += (dx / (dist + 18)) * pull;
            }
          }
          if (gy === 0) ctx.moveTo(wx, gy);
          else ctx.lineTo(wx, gy);
        }
        ctx.stroke();
      }

      // 2. Galactic Watercolor Nebula Washes
      for (let i = washes.length - 1; i >= 0; i--) {
        if (!drawNebula(washes[i], now)) {
          washes.splice(i, 1);
        }
      }

      // 3. Parallax Starfield & Doppler Streaks (stretch when scrolling!)
      const streakBoost = Math.min(28, Math.abs(scrollVelocity) * 0.55);
      for (const s of stars) {
        if (active) {
          s.x += s.speed * s.z * (dt / 16) * 0.7;
          if (s.x > width + 24) s.x = -24;
        }
        const sy = ((s.y - window.scrollY * 0.18 * s.z) % height + height) % height;
        const twinkle = 0.28 + 0.34 * (0.5 + 0.5 * Math.sin(now * 0.0018 + s.phase));
        const rCol = Math.round(28 + s.warm * (186 - 28));
        const gCol = Math.round(58 + s.warm * (68 - 58));
        const bCol = Math.round(132 + s.warm * (48 - 132));

        if (streakBoost > 1.5 || s.warm < 0.42) {
          const len = (4 + (1 - s.warm) * 10) * s.z;
          ctx.beginPath();
          ctx.moveTo(s.x - len, sy - scrollVelocity * 0.14 * s.z);
          ctx.lineTo(s.x, sy + scrollVelocity * 0.14 * s.z);
          ctx.strokeStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${twinkle.toFixed(3)})`;
          ctx.lineWidth = 1.35 * s.z;
          ctx.stroke();
        } else {
          ctx.beginPath();
          ctx.arc(s.x, sy, 1.55 * s.z, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rCol}, ${gCol}, ${bCol}, ${twinkle.toFixed(3)})`;
          ctx.fill();
        }
      }

      // 4. Real Physics Equations & Astronomical Blueprint Vignettes
      for (let i = vignettes.length - 1; i >= 0; i--) {
        if (!drawVignette(vignettes[i], now)) {
          vignettes.splice(i, 1);
        }
      }

      // 5. Cursor Black-Hole Gravitational Lens Ring
      if (pointer.active) {
        ctx.beginPath();
        ctx.arc(pointer.x, pointer.y, 26 + Math.sin(now * 0.004) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(168, 34, 84, 0.22)';
        ctx.lineWidth = 1.25;
        ctx.stroke();
      }

      if (active) {
        rafId = requestAnimationFrame(drawFrame);
      }
    };

    if (!active) {
      drawFrame(seedNow);
      return () => {
        window.removeEventListener('resize', resize);
      };
    }

    rafId = requestAnimationFrame(drawFrame);

    // Scroll handler: anchors existing nebulas & physics vignettes to the page AND spawns new ones down the page!
    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY;
      lastScrollY = currentY;
      scrollVelocity = Math.max(-60, Math.min(60, dy));
      scrollAccum += Math.abs(dy);

      for (const w of washes) {
        w.y -= dy * 0.52;
      }
      for (const v of vignettes) {
        v.y -= dy * 0.68;
      }

      if (scrollAccum < 58) return;
      scrollAccum = 0;

      const now = performance.now();
      const sideLeft = artifactCounter % 2 === 0;
      const spawnX = sideLeft
        ? width * (0.1 + Math.random() * 0.22)
        : width * (0.68 + Math.random() * 0.22);
      const spawnY =
        dy >= 0
          ? height * (0.68 + (Math.random() - 0.5) * 0.22)
          : height * (0.3 + (Math.random() - 0.5) * 0.22);

      const c = nextColor();
      spawnNebula(spawnX, spawnY, (Math.random() - 0.5) * 18, -dy * 0.12, now, {
        radiusScale: 1.5,
        alpha: 0.28,
        color: c,
      });
      spawnVignette(spawnX, spawnY, now);
    };

    const onPointerMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;

      if (e.target instanceof Element && e.target.closest('button, a, input, dialog')) {
        lastPointer = null;
        return;
      }
      const now = performance.now();
      if (!lastPointer) {
        lastPointer = { x: e.clientX, y: e.clientY, time: now };
        return;
      }
      const dx = e.clientX - lastPointer.x;
      const dy = e.clientY - lastPointer.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 26) return;

      lastPointer = { x: e.clientX, y: e.clientY, time: now };
      spawnNebula(e.clientX, e.clientY, dx, dy, now, {
        radiusScale: 1.05 + Math.min(dist / 90, 0.55),
        alpha: 0.22,
      });
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.target instanceof Element && e.target.closest('button, a, input, dialog')) return;
      const now = performance.now();
      spawnNebula(e.clientX, e.clientY, 8, -4, now, {
        radiusScale: 1.4,
        alpha: 0.3,
      });
      spawnVignette(e.clientX, e.clientY, now);
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
    };
  }, [active]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-testid="persist-cosmos-wash"
      className="pointer-events-none fixed inset-0 z-[2] block h-full w-full mix-blend-multiply"
    />
  );
}
