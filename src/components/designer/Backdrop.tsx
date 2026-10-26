'use client';

import { useEffect, useRef } from 'react';

/**
 * Living studio backdrop: drifting coloured light, out-of-focus bokeh and floating dust.
 * The glow takes its colour from the artwork currently open in the book.
 */

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.replace('#', ''), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Lift the very dark page tint into a vivid light colour. */
function vivid(hex: string): [number, number, number] {
  const [r, g, b] = hexToRgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return hslToRgb(h, 0.78, 0.52);
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

const shift = (rgb: [number, number, number], deg: number): [number, number, number] => {
  const [r, g, b] = rgb.map((v) => v / 255);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return hslToRgb((h + deg + 360) % 360, 0.8, 0.5);
};

export function Backdrop({ tint, kick }: { tint: string; kick: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const target = useRef<[number, number, number]>(vivid('#3a2a66'));
  const kickRef = useRef(0);
  const pointer = useRef({ x: 0.5, y: 0.4 });

  useEffect(() => {
    target.current = vivid(tint);
  }, [tint]);

  useEffect(() => {
    kickRef.current = 1;
  }, [kick]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0;
    let h = 0;
    let raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const onMove = (e: PointerEvent) => {
      pointer.current = { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight };
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const dust = Array.from({ length: 90 }, () => ({
      x: Math.random(),
      y: Math.random(),
      z: rnd(0.2, 1),
      r: rnd(0.6, 1.8),
      ph: rnd(0, 6.28),
      sp: rnd(0.4, 1.2),
    }));
    const bokeh = Array.from({ length: 14 }, () => ({
      x: Math.random(),
      y: rnd(0.05, 0.7),
      r: rnd(26, 86),
      a: rnd(0.04, 0.1),
      vx: rnd(-0.004, 0.004),
      ph: rnd(0, 6.28),
      hue: Math.random() < 0.5 ? 0 : 1,
    }));

    const cur: [number, number, number] = [...target.current];
    let last = performance.now();
    let t = 0;
    let frameN = 0;

    const frame = (now: number) => {
      const dt = Math.min(48, now - last);
      last = now;
      kickRef.current *= 0.94;
      const speed = 1 + kickRef.current * 3.2;
      t += dt * speed;

      // ease colour toward the artwork tint
      for (let i = 0; i < 3; i++) cur[i] += (target.current[i] - cur[i]) * 0.035;
      const c1 = cur;
      frameN++;
      if (frameN % 2 === 0)
        canvas.parentElement?.style.setProperty('--glow', `${cur[0] | 0},${cur[1] | 0},${cur[2] | 0}`);
      const c2 = shift([Math.round(cur[0]), Math.round(cur[1]), Math.round(cur[2])], 48);
      const warm: [number, number, number] = [255, 176, 96];

      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = '#060405';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      const px = pointer.current.x;
      const py = pointer.current.y;
      const R = Math.max(w, h);
      const blobs = [
        { c: c1, x: 0.5 + 0.34 * Math.sin(t * 0.00021) + (px - 0.5) * 0.12, y: 0.26 + 0.14 * Math.cos(t * 0.00017) + (py - 0.5) * 0.08, r: 0.56, a: 0.34 },
        { c: c2, x: 0.18 + 0.26 * Math.cos(t * 0.00013 + 1.2), y: 0.34 + 0.2 * Math.sin(t * 0.00019 + 0.4), r: 0.5, a: 0.26 },
        { c: c1, x: 0.86 + 0.18 * Math.sin(t * 0.00016 + 2.4), y: 0.2 + 0.18 * Math.cos(t * 0.00011), r: 0.46, a: 0.22 },
        { c: warm, x: 0.5 + 0.1 * Math.sin(t * 0.0001), y: 0.72 + 0.04 * Math.cos(t * 0.00014), r: 0.5, a: 0.2 },
      ];
      for (const b of blobs) {
        const x = b.x * w;
        const y = b.y * h;
        const g = ctx.createRadialGradient(x, y, 0, x, y, b.r * R);
        g.addColorStop(0, `rgba(${b.c[0] | 0},${b.c[1] | 0},${b.c[2] | 0},${b.a})`);
        g.addColorStop(0.55, `rgba(${b.c[0] | 0},${b.c[1] | 0},${b.c[2] | 0},${b.a * 0.28})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // bokeh discs
      for (const b of bokeh) {
        b.x += b.vx * dt * 0.001 * speed;
        if (b.x < -0.1) b.x = 1.1;
        if (b.x > 1.1) b.x = -0.1;
        const x = b.x * w + Math.sin(t * 0.0003 + b.ph) * 14;
        const y = b.y * h + Math.cos(t * 0.00025 + b.ph) * 10;
        const c = b.hue ? c2 : c1;
        const pulse = 0.75 + 0.25 * Math.sin(t * 0.0007 + b.ph);
        const g = ctx.createRadialGradient(x, y, b.r * 0.6, x, y, b.r);
        g.addColorStop(0, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${b.a * 0.55 * pulse})`);
        g.addColorStop(0.92, `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${b.a * pulse})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, b.r, 0, 6.283);
        ctx.fill();
      }

      // floating dust caught in the lamp light
      for (const d of dust) {
        d.y -= (0.012 + 0.03 * d.z) * dt * 0.001 * speed;
        d.x += Math.sin(t * 0.0004 * d.sp + d.ph) * 0.00012 * speed;
        if (d.y < -0.02) {
          d.y = 1.02;
          d.x = Math.random();
        }
        const x = (d.x + (px - 0.5) * 0.03 * d.z) * w;
        const y = d.y * h;
        const near = 1 - Math.min(1, Math.abs(d.x - 0.5) * 1.6);
        const tw = 0.5 + 0.5 * Math.sin(t * 0.002 * d.sp + d.ph);
        ctx.fillStyle = `rgba(255,236,208,${(0.1 + 0.55 * near * tw) * d.z})`;
        ctx.beginPath();
        ctx.arc(x, y, d.r * d.z, 0, 6.283);
        ctx.fill();
      }

      if (!reduce) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVis = () => {
      if (document.hidden) cancelAnimationFrame(raf);
      else if (!reduce) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return <canvas ref={ref} className="dz-backdrop" aria-hidden />;
}

export default Backdrop;
