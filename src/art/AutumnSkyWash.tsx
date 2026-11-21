'use client';

import React, { useEffect, useRef, useState } from 'react';
import { type MotionValue, useReducedMotion } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Living wet-in-wet autumn watercolor sky wash for `/songs` (Zero-dependency WebGL1).
 *
 * Adapted from Asterisk's `WatercolorSky` without Three.js (0 KB bundle overhead):
 * - Domain-warped FBM creates soft wet-in-wet bleeding between autumn washes.
 * - Pigment pools slightly darker along wash boundaries ("wet edge" of real watercolor).
 * - Cold-press paper grain & granulation multiplied onto Warm Sandstone (#E8E2D5).
 * - Pointer/touch gently ripples the wash; `progress` warms the horizon.
 * - Renders a single still frame when motion is paused or `prefers-reduced-motion` is active.
 */

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform vec2 uResolution;
  uniform vec3 uTop;
  uniform vec3 uMid;
  uniform vec3 uLow;
  uniform vec3 uGlow;
  uniform vec3 uLinen;
  uniform vec3 uPaper;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    mat2 r = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = r * p * 2.03 + 11.7;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);

    vec2 ptr = vec2(uPointer.x * aspect, uPointer.y);
    float push = exp(-3.4 * distance(p, ptr));

    float t = uTime * 0.022;
    vec2 q = vec2(fbm(p * 1.55 + vec2(0.0, t)), fbm(p * 1.55 + vec2(5.2, -t)));
    vec2 r = vec2(fbm(p * 2.1 + 2.8 * q + vec2(1.7, 9.2) + t),
                  fbm(p * 2.1 + 2.8 * q + vec2(8.3, 2.8) - t));
    float warp = fbm(p * 1.35 + 2.3 * r + push * 0.9);

    float h = uv.y + (warp - 0.5) * 0.34 - push * 0.07;
    float warmth = smoothstep(0.0, 1.0, uProgress);
    vec3 col = mix(uLow, uMid, smoothstep(0.08, 0.52, h));
    col = mix(col, uTop, smoothstep(0.48, 0.96, h));

    // Crisp white linen sunlight veil near upper left + sumac/pink glow near horizon
    float linenLift = exp(-pow(distance(uv, vec2(0.22, 0.68)) * 2.2, 2.0)) * 0.42;
    col = mix(col, uLinen, clamp(linenLift * (0.6 + 0.4 * warp), 0.0, 0.45));

    float glow = exp(-pow((uv.y - (0.16 + 0.16 * warmth)) * 4.0, 2.0)) * (0.38 + 0.42 * warmth);
    col = mix(col, uGlow, clamp(glow * (0.55 + 0.45 * warp) + push * 0.24, 0.0, 0.78));

    // Wet-edge pigment pooling along wash boundaries
    float bands = fract(h * 3.1 + warp * 0.78);
    float edge = smoothstep(0.0, 0.036, bands) * (1.0 - smoothstep(0.036, 0.095, bands));
    col *= 1.0 - edge * 0.075;

    // Glaze onto Warm Sandstone (#E8E2D5) paper so text stays effortlessly legible
    float coverage = smoothstep(0.06, 0.94, warp * 0.68 + (1.0 - uv.y) * 0.38 + 0.16);
    col = mix(uPaper, col, 0.46 + 0.32 * coverage);

    // Cold-press grain + granulation
    float grain = noise(uv * uResolution * 0.52);
    float gran = noise(p * 56.0 + warp * 3.8);
    col *= 0.976 + 0.024 * grain;
    col *= 0.986 + 0.014 * gran;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function hexToRgbNorm(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export interface AutumnSkyPalette {
  top: string;
  mid: string;
  low: string;
  glow: string;
  linen: string;
  paper: string;
}

export const CUMBERLAND_AUTUMN_PALETTE: AutumnSkyPalette = {
  top: '#C77A4A',   // Warm Russet Sienna
  mid: '#E08E45',   // Persimmon Ochre
  low: '#E8B86B',   // October Goldenrod
  glow: '#D9487D',  // Sumac Rose (bridges to CHB #FE299E)
  linen: '#FAF8F5', // Crisp White Linen
  paper: '#E8E2D5', // Warm Sandstone
};

export default function AutumnSkyWash({
  progress = 0,
  palette = CUMBERLAND_AUTUMN_PALETTE,
  className = '',
}: {
  progress?: number | MotionValue<number>;
  palette?: AutumnSkyPalette;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(typeof progress === 'number' ? progress : progress.get());
  const [webglFailed, setWebglFailed] = useState(false);
  const reduce = useReducedMotion();
  const { motionActive } = useAmbientMotion();
  const shouldAnimate = !reduce && motionActive;

  useEffect(() => {
    if (typeof progress === 'number') {
      progressRef.current = progress;
      return;
    }
    progressRef.current = progress.get();
    return progress.on('change', (v) => {
      progressRef.current = v;
    });
  }, [progress]);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    if (!host || !canvas) return;

    const gl = canvas.getContext('webgl', {
      antialias: false,
      alpha: false,
      depth: false,
      stencil: false,
      powerPreference: 'low-power',
    });

    if (!gl) {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    const program = gl.createProgram();
    if (!vs || !fs || !program) {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const aPos = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'uTime');
    const uProgress = gl.getUniformLocation(program, 'uProgress');
    const uPointer = gl.getUniformLocation(program, 'uPointer');
    const uResolution = gl.getUniformLocation(program, 'uResolution');
    const uTop = gl.getUniformLocation(program, 'uTop');
    const uMid = gl.getUniformLocation(program, 'uMid');
    const uLow = gl.getUniformLocation(program, 'uLow');
    const uGlow = gl.getUniformLocation(program, 'uGlow');
    const uLinen = gl.getUniformLocation(program, 'uLinen');
    const uPaper = gl.getUniformLocation(program, 'uPaper');

    gl.uniform3fv(uTop, hexToRgbNorm(palette.top));
    gl.uniform3fv(uMid, hexToRgbNorm(palette.mid));
    gl.uniform3fv(uLow, hexToRgbNorm(palette.low));
    gl.uniform3fv(uGlow, hexToRgbNorm(palette.glow));
    gl.uniform3fv(uLinen, hexToRgbNorm(palette.linen));
    gl.uniform3fv(uPaper, hexToRgbNorm(palette.paper));

    let ptrX = 0.72;
    let ptrY = 0.34;
    let targetX = 0.72;
    let targetY = 0.34;
    let smoothProg = progressRef.current;

    const renderFrame = (timeSec: number) => {
      gl.uniform1f(uTime, timeSec);
      gl.uniform1f(uProgress, smoothProg);
      gl.uniform2f(uPointer, ptrX, ptrY);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    const resize = () => {
      const w = Math.max(1, Math.floor(host.clientWidth));
      const h = Math.max(1, Math.floor(host.clientHeight));
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
      gl.uniform2f(uResolution, w, h);
      if (!shouldAnimate) {
        renderFrame(14.0);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(host);

    const onPointer = (e: PointerEvent) => {
      const rect = host.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      if (e.clientY > rect.bottom + 80 || e.clientY < rect.top - 80) return;
      targetX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      targetY = Math.max(0, Math.min(1, 1 - (e.clientY - rect.top) / rect.height));
    };

    if (shouldAnimate) {
      window.addEventListener('pointermove', onPointer, { passive: true });
      window.addEventListener('pointerdown', onPointer, { passive: true });
    }

    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(host);

    let rafId = 0;
    const startMs = performance.now();

    if (!shouldAnimate) {
      renderFrame(14.0);
    } else {
      const loop = () => {
        rafId = requestAnimationFrame(loop);
        if (!visible || document.hidden) return;
        ptrX += (targetX - ptrX) * 0.045;
        ptrY += (targetY - ptrY) * 0.045;
        smoothProg += (progressRef.current - smoothProg) * 0.08;
        renderFrame((performance.now() - startMs) / 1000);
      };
      loop();
    }

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [palette, shouldAnimate]);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      data-testid="songs-autumn-sky-wash"
      className={`pointer-events-none relative h-full w-full overflow-hidden ${className}`}
    >
      {webglFailed ? (
        <div
          className="h-full w-full wc-paper-grain"
          style={{
            background:
              'radial-gradient(ellipse 68% 65% at 22% 32%, rgba(250,248,245,0.68), transparent 70%), radial-gradient(ellipse 75% 60% at 78% 72%, rgba(217,72,125,0.28), transparent 68%), linear-gradient(180deg, #D59B6A 0%, #E3B878 52%, #E8E2D5 100%)',
          }}
        />
      ) : (
        <canvas ref={canvasRef} className="block h-full w-full" />
      )}
    </div>
  );
}
