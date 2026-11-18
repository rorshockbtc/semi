'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { MotionValue } from 'framer-motion';
import { useAmbientMotion } from '@/context/AmbientMotionContext';

/**
 * Sunlit Prism Shader (Three.js custom GLSL plane).
 *
 * Renders West Nashville late-afternoon golden window beams, warm plaster sandstone warmth,
 * and delicate optical prism rainbow dispersion echoing the refraction on Semi's studio wall.
 * Pauses offscreen via IntersectionObserver, renders a single luminous frame when motion
 * is paused or reduced, and falls back gracefully to CSS gradients if WebGL is unavailable.
 */

const VERTEX_SHADER = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  varying vec2 vUv;

  uniform float uTime;
  uniform float uProgress;
  uniform vec2 uPointer;
  uniform vec2 uResolution;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + 9.4;
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 p = vec2(uv.x * aspect, uv.y);

    vec3 sandstone = vec3(0.9098, 0.8863, 0.8353); // #E8E2D5
    vec3 linen     = vec3(0.9529, 0.9373, 0.9137); // #F3EFE9
    vec3 honey     = vec3(0.9686, 0.8431, 0.6902); // #F7D7B0
    vec3 prismPink = vec3(0.9804, 0.6431, 0.7882); // Soft Sovereign Pink dispersion
    vec3 prismIris = vec3(0.7882, 0.7255, 0.9098); // #C9B9E8
    vec3 prismSky  = vec3(0.6627, 0.8275, 0.9176); // #A9D3EA

    float t = uTime * 0.035;
    vec2 ptr = vec2(uPointer.x * aspect, uPointer.y);
    float ptrInfluence = exp(-3.2 * distance(p, ptr));

    // Soft afternoon clouds / sunlit plaster motion
    float warp = fbm(p * 1.45 + vec2(t, -t * 0.6) + ptrInfluence * 0.35);
    vec3 col = mix(sandstone, linen, smoothstep(0.15, 0.9, uv.y + (warp - 0.5) * 0.28));

    // Slanted window sunbeams falling across the right & center-top
    float beamCoord = uv.x * 0.85 - uv.y * 0.65 + (warp - 0.5) * 0.18 - uProgress * 0.12;
    float beam1 = exp(-pow((beamCoord - 0.16) * 4.5, 2.0));
    float beam2 = exp(-pow((beamCoord - 0.44) * 5.2, 2.0)) * 0.65;
    col = mix(col, honey, clamp((beam1 + beam2) * 0.46 + ptrInfluence * 0.14, 0.0, 0.65));

    // Delicate optical prism rainbow dispersion near the upper right / pointer halo
    float prismAxis = (uv.x * 0.72 + uv.y * 0.55) - (1.02 + sin(t * 1.4) * 0.03 + ptrInfluence * 0.04);
    float prismEnv = exp(-pow(prismAxis * 9.0, 2.0)) * smoothstep(0.28, 0.82, uv.x);
    vec3 dispersion = mix(prismSky, prismIris, smoothstep(-0.08, 0.0, prismAxis));
    dispersion = mix(dispersion, prismPink, smoothstep(0.0, 0.09, prismAxis));
    col = mix(col, dispersion, clamp(prismEnv * 0.42, 0.0, 0.45));

    // Gentle analog film paper tooth
    float grain = noise(uv * uResolution * 0.45);
    col *= 0.985 + 0.015 * grain;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function SunlitPrismCanvas({
  progress,
  className = '',
}: {
  progress?: number | MotionValue<number>;
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(typeof progress === 'number' ? progress : progress ? progress.get() : 0);
  const [failed, setFailed] = useState(false);
  const { motionActive } = useAmbientMotion();
  const motionRef = useRef(motionActive);

  useEffect(() => {
    motionRef.current = motionActive;
  }, [motionActive]);

  useEffect(() => {
    if (progress === undefined) return;
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
    if (!host) return;
    let disposed = false;
    let cleanup = () => {};

    (async () => {
      try {
        const THREE = await import('three');
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: false,
          antialias: false,
          powerPreference: 'low-power',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
        renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;';
        host.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

        const uniforms = {
          uTime: { value: 2.4 },
          uProgress: { value: progressRef.current },
          uPointer: { value: new THREE.Vector2(0.72, 0.62) },
          uResolution: { value: new THREE.Vector2(host.clientWidth || 1, host.clientHeight || 1) },
        };

        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX_SHADER,
          fragmentShader: FRAGMENT_SHADER,
          uniforms,
        });
        scene.add(new THREE.Mesh(geometry, material));

        const resize = () => {
          const w = Math.max(host.clientWidth, 1);
          const h = Math.max(host.clientHeight, 1);
          renderer.setSize(w, h, false);
          uniforms.uResolution.value.set(w, h);
        };
        resize();

        const ro = new ResizeObserver(resize);
        ro.observe(host);

        const targetPointer = new THREE.Vector2(0.72, 0.62);
        const onPointerMove = (e: PointerEvent) => {
          if (!motionRef.current) return;
          const r = host.getBoundingClientRect();
          if (r.width === 0 || r.height === 0) return;
          targetPointer.set(
            (e.clientX - r.left) / r.width,
            1 - (e.clientY - r.top) / r.height
          );
        };
        window.addEventListener('pointermove', onPointerMove, { passive: true });

        let visible = true;
        const io = new IntersectionObserver(
          ([entry]) => {
            visible = Boolean(entry?.isIntersecting);
          },
          { threshold: 0.01 }
        );
        io.observe(host);

        let raf = 0;
        let last = performance.now();
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick);
          const dt = Math.min((now - last) / 1000, 0.1);
          last = now;

          if (!visible) return;

          uniforms.uProgress.value += (progressRef.current - uniforms.uProgress.value) * 0.08;
          if (motionRef.current) {
            uniforms.uTime.value += dt;
            uniforms.uPointer.value.lerp(targetPointer, 0.045);
          }
          renderer.render(scene, camera);
        };

        renderer.render(scene, camera);
        raf = requestAnimationFrame(tick);

        cleanup = () => {
          cancelAnimationFrame(raf);
          ro.disconnect();
          io.disconnect();
          window.removeEventListener('pointermove', onPointerMove);
          geometry.dispose();
          material.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        setFailed(true);
      }
    })();

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{
        background:
          'radial-gradient(62% 58% at 76% 24%, rgba(244, 215, 180, 0.58), transparent 72%), radial-gradient(46% 42% at 82% 48%, rgba(247, 185, 201, 0.34), transparent 70%), linear-gradient(180deg, #EDE7DB 0%, #E8E2D5 100%)',
      }}
    >
      {failed && (
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(65% 60% at 75% 28%, rgba(244, 215, 180, 0.65), transparent 72%), radial-gradient(45% 40% at 85% 44%, rgba(201, 185, 232, 0.3), transparent 70%)',
          }}
        />
      )}
    </div>
  );
}
