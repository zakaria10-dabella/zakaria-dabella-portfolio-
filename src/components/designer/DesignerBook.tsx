'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { WORKS, type Work } from './works';
import './designer.css';

/**
 * Interactive 3D book lying on a dark wooden desk.
 *   faces: 0 cover · 1 contents · 2…(2+n-1) works · then closing pages · last = back cover
 *   leaf j  = front face 2j (right page) + back face 2j+1 (left page)
 *   open    = number of leaves that have been flipped to the left side (0 = closed)
 */
const STRIPS = 10;
const FLIP_MS = 1150;

type Face =
  | { kind: 'cover' }
  | { kind: 'contents' }
  | { kind: 'work'; work: Work; index: number }
  | { kind: 'thanks' }
  | { kind: 'logo' }
  | { kind: 'back' };

function buildFaces(): Face[] {
  const faces: Face[] = [{ kind: 'cover' }, { kind: 'contents' }];
  WORKS.forEach((work, index) => faces.push({ kind: 'work', work, index }));
  faces.push({ kind: 'thanks' }, { kind: 'logo' });
  if (faces.length % 2 === 0) faces.push({ kind: 'logo' }); // keep leaves paired
  faces.push({ kind: 'back' });
  return faces;
}

const FACES = buildFaces();
const LEAVES = FACES.length / 2;

const pad = (n: number) => String(n).padStart(2, '0');

/* ───────────────────────── Page faces ───────────────────────── */

function WorkPage({
  work,
  index,
  side,
  onExpand,
}: {
  work: Work;
  index: number;
  side: 'left' | 'right';
  onExpand: (w: Work) => void;
}) {
  const ratio = work.w / work.h;
  const wide = ratio > 1.3;
  return (
    <div className={`pg pg-work ${side} ${wide ? 'wide' : ''}`} style={{ '--tint': work.tint } as React.CSSProperties}>
      <div className="pg-media" style={{ aspectRatio: `${work.w} / ${work.h}` }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/designer/${work.id}.webp`} alt={work.title} draggable={false} className="pg-img" />
        <button
          type="button"
          className="pg-expand"
          data-cursor="view"
          aria-label={`View ${work.title} larger`}
          onClick={(e) => {
            e.stopPropagation();
            onExpand(work);
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
          </svg>
        </button>
      </div>
      <div className="pg-text">
        <span className="pg-num">{pad(index + 1)}</span>
        <h3>{work.title}</h3>
        <p>{work.category}</p>
        <span className="pg-rule" />
        <small>Zakaria Dabella</small>
      </div>
    </div>
  );
}

function ContentsPage() {
  const half = Math.ceil(WORKS.length / 2);
  const cols = [WORKS.slice(0, half), WORKS.slice(half)];
  return (
    <div className="pg pg-white pg-contents">
      <div className="pg-kicker">Zakaria Dabella · Selected work</div>
      <h2>Contents</h2>
      <div className="ct-cols">
        {cols.map((c, ci) => (
          <ol key={ci} start={ci * half + 1}>
            {c.map((w, i) => (
              <li key={w.id}>
                <b>{pad(ci * half + i + 1)}</b>
                <span>{w.title.split(' — ')[0]}</span>
              </li>
            ))}
          </ol>
        ))}
      </div>
    </div>
  );
}

function CoverPage() {
  return (
    <div className="pg pg-cover">
      <div className="cv-brand">
        <Image src="/zakaria-mark.png" alt="Zakaria Dabella logo" width={400} height={603} className="cv-mark" priority />
        <span>Zakaria Dabella</span>
      </div>
      <em>Graphic Design · 2026</em>
    </div>
  );
}

function ThanksPage() {
  return (
    <div className="pg pg-thanks">
      <div className="pg-kicker">Let&apos;s make something</div>
      <h2>
        Have a brand
        <br />
        that needs a
        <br />
        <i>louder voice?</i>
      </h2>
      <a href="mailto:zakariaadabella@gmail.com" onClick={(e) => e.stopPropagation()}>
        zakariaadabella@gmail.com
      </a>
    </div>
  );
}

function LogoPage() {
  return (
    <div className="pg pg-white pg-logo">
      <Image src="/zakaria-mark.png" alt="" width={400} height={603} className="lg-mark" />
      <span>Zakaria Dabella</span>
      <small>Graphic Designer · Casablanca</small>
    </div>
  );
}

function FaceContent({
  face,
  side,
  onExpand,
}: {
  face: Face;
  side: 'left' | 'right';
  onExpand: (w: Work) => void;
}) {
  switch (face.kind) {
    case 'cover':
      return <CoverPage />;
    case 'contents':
      return <ContentsPage />;
    case 'work':
      return <WorkPage work={face.work} index={face.index} side={side} onExpand={onExpand} />;
    case 'thanks':
      return <ThanksPage />;
    case 'logo':
      return <LogoPage />;
    default:
      return <div className="pg pg-back" />;
  }
}

/* ───────────────────────── Leaf (one sheet of paper) ───────────────────────── */

function Face({
  index,
  side,
  onExpand,
}: {
  index: number;
  side: 'left' | 'right';
  onExpand: (w: Work) => void;
}) {
  return (
    <>
      <FaceContent face={FACES[index]} side={side} onExpand={onExpand} />
      <span className={`spine-shade ${side}`} />
      <span className="flip-shade" />
    </>
  );
}

/** While moving, the leaf is cut into strips that bend one after another so the paper curls. */
function Strips({
  j,
  k,
  dir,
  onExpand,
}: {
  j: number;
  k: number;
  dir: 'fwd' | 'back';
  onExpand: (w: Work) => void;
}) {
  const style = {
    left: k === 0 ? 0 : `calc(var(--pw) / ${STRIPS})`,
    width: `calc(var(--pw) / ${STRIPS})`,
    animationName: dir === 'fwd' ? 'curl-fwd' : 'curl-back',
  } as React.CSSProperties;
  return (
    <div className="strip" style={style}>
      <div className="clip front">
        <div className="clip-in" style={{ transform: `translateX(calc(var(--pw) / ${STRIPS} * ${-k}))` }}>
          <Face index={2 * j} side="right" onExpand={onExpand} />
        </div>
      </div>
      <div className="clip back">
        <div className="clip-in" style={{ transform: `translateX(calc(var(--pw) / ${STRIPS} * ${-(STRIPS - 1 - k)}))` }}>
          <Face index={2 * j + 1} side="left" onExpand={onExpand} />
        </div>
      </div>
      {k < STRIPS - 1 && <Strips j={j} k={k + 1} dir={dir} onExpand={onExpand} />}
    </div>
  );
}

function Leaf({
  j,
  open,
  moving,
  dir,
  closingStagger,
  onFront,
  onBack,
  onExpand,
}: {
  j: number;
  open: number;
  moving: boolean;
  dir: 'fwd' | 'back';
  closingStagger: boolean;
  onFront: () => void;
  onBack: () => void;
  onExpand: (w: Work) => void;
}) {
  const flipped = j < open;
  const tz = flipped ? j * 1.1 + 0.6 : (LEAVES - j) * 1.1 + 0.6;
  const delay = closingStagger ? `${(LEAVES - 1 - j) * 55}ms` : '0ms';
  return (
    <div
      className={`leaf ${flipped ? 'is-flipped' : ''} ${moving ? 'is-moving' : ''}`}
      style={
        {
          '--tz': `${tz}px`,
          '--ry': flipped ? -180 : 0,
          '--d': delay,
          transitionDelay: delay,
          zIndex: flipped ? j : LEAVES - j,
        } as React.CSSProperties
      }
    >
      <div className="peek">
      {moving ? (
        <Strips j={j} k={0} dir={dir} onExpand={onExpand} />
      ) : (
        <>
          <div
            className="face front"
            data-cursor={j === 0 ? 'open' : 'flip'}
            onClick={onFront}
            role="button"
            tabIndex={flipped ? -1 : j === open ? 0 : -1}
            aria-label={j === 0 ? 'Open the book' : 'Turn the page'}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onFront()}
          >
            <Face index={2 * j} side="right" onExpand={onExpand} />
          </div>
          <div className="face back" data-cursor="flip" onClick={onBack} aria-hidden={!flipped}>
            <Face index={2 * j + 1} side="left" onExpand={onExpand} />
          </div>
        </>
      )}
      </div>
    </div>
  );
}

/* ───────────────────────── Desk props (top-down, drawn in SVG) ───────────────────────── */

function Coffee() {
  return (
    <svg className="prop coffee" viewBox="0 0 200 200" aria-hidden>
      <defs>
        <radialGradient id="sauc" cx="45%" cy="40%" r="65%">
          <stop offset="0" stopColor="#f4f4f2" />
          <stop offset="0.7" stopColor="#d9d9d6" />
          <stop offset="1" stopColor="#9d9d9a" />
        </radialGradient>
        <radialGradient id="cupr" cx="45%" cy="40%" r="60%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9c9c6" />
        </radialGradient>
        <radialGradient id="cof" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#8a5a38" />
          <stop offset="0.7" stopColor="#5b3520" />
          <stop offset="1" stopColor="#2f1a0e" />
        </radialGradient>
      </defs>
      <ellipse cx="100" cy="112" rx="92" ry="88" fill="rgba(0,0,0,0.55)" filter="blur(6px)" />
      <circle cx="100" cy="100" r="92" fill="url(#sauc)" />
      <circle cx="100" cy="100" r="74" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="2" />
      <path d="M150 150 L186 168" stroke="#bdbdba" strokeWidth="7" strokeLinecap="round" />
      <circle cx="96" cy="96" r="56" fill="url(#cupr)" />
      <circle cx="96" cy="96" r="46" fill="url(#cof)" />
      <path
        d="M96 122 C70 104 70 84 80 80 C88 77 94 82 96 88 C98 82 104 77 112 80 C122 84 122 104 96 122 Z"
        fill="#f1dcc4"
        opacity="0.92"
      />
      <path d="M96 118 C78 104 80 92 86 90" stroke="#b78a63" strokeWidth="2.2" fill="none" opacity="0.6" />
      <circle cx="96" cy="96" r="56" fill="none" stroke="rgba(255,255,255,0.8)" strokeWidth="1.5" />
    </svg>
  );
}

function Coin() {
  return (
    <svg className="prop coin" viewBox="0 0 120 120" aria-hidden>
      <defs>
        <radialGradient id="tin" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#c9d7dc" />
          <stop offset="0.6" stopColor="#7e949b" />
          <stop offset="1" stopColor="#3c4d53" />
        </radialGradient>
      </defs>
      <ellipse cx="60" cy="68" rx="50" ry="46" fill="rgba(0,0,0,0.6)" filter="blur(5px)" />
      <circle cx="60" cy="60" r="50" fill="url(#tin)" />
      <circle cx="60" cy="60" r="42" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      {Array.from({ length: 8 }).map((_, i) => (
        <ellipse
          key={i}
          cx="60"
          cy="38"
          rx="7"
          ry="17"
          fill="rgba(40,70,80,0.55)"
          stroke="rgba(255,255,255,0.35)"
          strokeWidth="1"
          transform={`rotate(${i * 45} 60 60)`}
        />
      ))}
      <circle cx="60" cy="60" r="9" fill="#d7e3e6" />
    </svg>
  );
}

function Pen() {
  return (
    <svg className="prop pen" viewBox="0 0 220 24" aria-hidden>
      <defs>
        <linearGradient id="penb" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b6e73" />
          <stop offset="0.35" stopColor="#d0d3d8" />
          <stop offset="1" stopColor="#25272a" />
        </linearGradient>
      </defs>
      <rect x="6" y="14" width="210" height="8" rx="4" fill="rgba(0,0,0,0.6)" filter="blur(3px)" />
      <rect x="6" y="6" width="190" height="9" rx="4.5" fill="url(#penb)" />
      <path d="M196 6 L216 10.5 L196 15 Z" fill="#cfcfcf" />
      <path d="M212 9.5 L216 10.5 L212 11.5 Z" fill="#222" />
    </svg>
  );
}

function Card() {
  return (
    <svg className="prop card" viewBox="0 0 120 120" aria-hidden>
      <path d="M12 16 L20 8 L84 8 L84 14 L26 22 L28 96 L110 96 L110 104 L20 104 L12 96 Z" fill="rgba(0,0,0,0.6)" filter="blur(4px)" transform="translate(4 6)" />
      <path d="M12 16 L20 8 L84 8 L84 14 L26 22 L28 96 L110 96 L110 104 L20 104 L12 96 Z" fill="#f2f2f0" />
      <path d="M26 22 L84 14 L84 20 L34 28 L36 90 L104 90 L104 96 L28 96 Z" fill="#dededb" />
    </svg>
  );
}

/* ───────────────────────── Scene ───────────────────────── */

export function DesignerBook({ onBack }: { onBack?: () => void }) {
  const [open, setOpen] = useState(0);
  const [movers, setMovers] = useState<Record<number, 'fwd' | 'back'>>({});
  const [stagger, setStagger] = useState(false);
  const [lightbox, setLightbox] = useState<Work | null>(null);
  const timers = useRef<Record<number, number>>({});
  const stageRef = useRef<HTMLDivElement>(null);
  const lightboxRef = useRef<Work | null>(null);
  const maxOpen = LEAVES - 1; // the last leaf's back is the back cover

  const go = useCallback(
    (to: number) => {
      const target = Math.max(0, Math.min(maxOpen, to));
      if (target === open) return;
      const dir: 'fwd' | 'back' = target > open ? 'fwd' : 'back';
      const lo = Math.min(open, target);
      const hi = Math.max(open, target);
      const next: Record<number, 'fwd' | 'back'> = {};
      for (let j = lo; j < hi; j++) next[j] = dir;
      setStagger(target === 0 && open > 1);
      setMovers((m) => ({ ...m, ...next }));
      Object.keys(next).forEach((k) => {
        const j = Number(k);
        window.clearTimeout(timers.current[j]);
        timers.current[j] = window.setTimeout(
          () =>
            setMovers((m) => {
              const c = { ...m };
              delete c[j];
              return c;
            }),
          FLIP_MS + (target === 0 && open > 1 ? LEAVES * 55 : 0) + 80,
        );
      });
      setOpen(target);
    },
    [open, maxOpen],
  );

  useEffect(() => {
    const t = timers.current;
    return () => Object.values(t).forEach((id) => window.clearTimeout(id));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (lightbox) return;
      if (e.key === 'ArrowRight') go(open === maxOpen ? 0 : open + 1);
      if (e.key === 'ArrowLeft') go(open - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go, open, lightbox, maxOpen]);

  useEffect(() => {
    WORKS.forEach((w) => {
      const im = new window.Image();
      im.src = `/designer/${w.id}.webp`;
    });
  }, []);

  // ── Scroll / swipe turns the pages and nudges the whole desk ──────────────
  const openRef = useRef(0);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  const goRef = useRef(go);
  useEffect(() => {
    goRef.current = go;
  }, [go]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    let acc = 0;
    let lockUntil = 0;
    let drift = 0;
    let raf = 0;

    const loop = () => {
      drift *= 0.9;
      if (Math.abs(drift) < 0.002) drift = 0;
      el.style.setProperty('--drift', drift.toFixed(3));
      raf = drift === 0 ? 0 : requestAnimationFrame(loop);
    };
    const nudge = (amount: number) => {
      drift = Math.max(-1, Math.min(1, drift + amount));
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const step = (dir: number) => {
      const now = performance.now();
      if (now < lockUntil) return;
      const cur = openRef.current;
      if ((dir > 0 && cur >= maxOpen) || (dir < 0 && cur <= 0)) return;
      lockUntil = now + 560;
      acc = 0;
      goRef.current(cur + dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (lightboxRef.current) return;
      e.preventDefault();
      const dy = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
      nudge(Math.max(-0.35, Math.min(0.35, dy / 260)));
      acc += dy;
      if (Math.abs(acc) > 70) step(acc > 0 ? 1 : -1);
    };

    let startY = 0;
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (lightboxRef.current) return;
      const dy = startY - e.touches[0].clientY;
      const dx = startX - e.touches[0].clientX;
      const d = Math.abs(dy) > Math.abs(dx) ? dy : dx;
      nudge(Math.max(-0.3, Math.min(0.3, d / 400)));
      if (Math.abs(d) > 46) {
        step(d > 0 ? 1 : -1);
        startY = e.touches[0].clientY;
        startX = e.touches[0].clientX;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    return () => {
      el.removeEventListener('wheel', onWheel);
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      cancelAnimationFrame(raf);
    };
  }, [maxOpen]);

  // gentle camera parallax following the pointer
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const move = (e: PointerEvent) => {
      const x = e.clientX / window.innerWidth - 0.5;
      const y = e.clientY / window.innerHeight - 0.5;
      el.style.setProperty('--px', x.toFixed(3));
      el.style.setProperty('--py', y.toFixed(3));
    };
    window.addEventListener('pointermove', move, { passive: true });
    return () => window.removeEventListener('pointermove', move);
  }, []);

  const leaves = useMemo(() => Array.from({ length: LEAVES }, (_, j) => j), []);

  useEffect(() => {
    lightboxRef.current = lightbox;
  }, [lightbox]);

  const lastSpread = open === maxOpen;

  return (
    <div ref={stageRef} data-theme="dark" className={`dz-stage ${open > 0 ? 'is-open' : 'is-closed'}`}>
      <header className="dz-top">
        <button type="button" className="dz-brand" onClick={onBack} aria-label="Zakaria Dabella — back to start">
          <Image src="/zakaria-mark.png" alt="" width={400} height={603} />
          <span>Zakaria Dabella</span>
        </button>
        <a className="dz-touch" href="mailto:zakariaadabella@gmail.com">
          Get in Touch
        </a>
      </header>

      <div className="dz-copy" aria-hidden={open > 0}>
        <h1>
          Interactive Portfolio
          <br />
          that you can explore
        </h1>
        <p>Click on pages to view works, hover to see how they act in motion</p>
      </div>

      <div className="dz-scene">
        <div className="dz-desk">
          <div className="dz-wood" />
          <div className="dz-light" />

          <div className="prop-slot s-coin">
            <Coin />
          </div>
          <div className="prop-slot s-pen">
            <Pen />
          </div>
          <div className="prop-slot s-coffee">
            <Coffee />
          </div>
          <div className="prop-slot s-card">
            <Card />
          </div>

          <div className={`dz-bookpos ${open > 0 ? 'open' : ''}`}>
            <div className="dz-bookshadow" />
            <div className="dz-wall right" style={{ height: `${(LEAVES - open) * 1.1 + 2}px` }} />
            <div className="dz-wall left" style={{ height: `${open * 1.1 + 2}px` }} />
            <div className="dz-book">
              {leaves.map((j) => (
                <Leaf
                  key={j}
                  j={j}
                  open={open}
                  moving={j in movers}
                  dir={movers[j] ?? 'fwd'}
                  closingStagger={stagger}
                  onFront={() => (j === maxOpen ? go(0) : go(j + 1))}
                  onBack={() => go(j)}
                  onExpand={setLightbox}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="dz-hud" aria-live="polite">
        {open === 0 ? (
          <button type="button" className="dz-start" onClick={() => go(1)}>
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <rect x="7" y="2.5" width="10" height="17" rx="5" />
              <path d="M12 7v3" className="dz-wheel" />
              <path d="M9 22l3 0" opacity="0" />
            </svg>
            Scroll or click to open
          </button>
        ) : (
          <>
            <button type="button" className="dz-nav" onClick={() => go(open - 1)} aria-label="Previous spread">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M15 5l-7 7 7 7" />
              </svg>
            </button>
            <div className="dz-progress" role="progressbar" aria-valuemin={1} aria-valuemax={maxOpen} aria-valuenow={open}>
              <span className="dz-count">
                {pad(open)} <i>/ {pad(maxOpen)}</i>
              </span>
              <span className="dz-bar">
                <span style={{ transform: `scaleX(${open / maxOpen})` }} />
              </span>
            </div>
            <button
              type="button"
              className="dz-nav"
              onClick={() => (lastSpread ? go(0) : go(open + 1))}
              aria-label={lastSpread ? 'Close the book' : 'Forward one spread'}
            >
              {lastSpread ? (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </>
        )}
      </div>

      {lightbox && (
        <div className="dz-lightbox" onClick={() => setLightbox(null)} role="dialog" aria-modal="true" aria-label={lightbox.title}>
          <div onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/designer/${lightbox.id}.webp`} alt={lightbox.title} />
            <p>
              <b>{lightbox.title}</b> · {lightbox.category}
            </p>
            <button type="button" onClick={() => setLightbox(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DesignerBook;
