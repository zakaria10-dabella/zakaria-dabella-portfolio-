'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export type Mode = 'developer' | 'designer';

const OPTIONS: { id: Mode; label: string; hint: string }[] = [
  { id: 'developer', label: 'Developer', hint: 'Full-stack projects, code and interfaces' },
  { id: 'designer', label: 'Graphic Designer', hint: 'An interactive book of design work' },
];

const EASE = [0.22, 1, 0.36, 1] as const;

/** Sliding two-way switch. `compact` is the small pill used inside each mode. */
export function ModeToggle({
  value,
  onChange,
  compact = false,
  idPrefix = 'toggle',
}: {
  value: Mode | null;
  onChange: (m: Mode) => void;
  compact?: boolean;
  idPrefix?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Choose portfolio mode"
      className="relative inline-flex items-center rounded-full"
      style={{
        padding: compact ? 3 : 6,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.14)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
      }}
    >
      {OPTIONS.map((o) => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o.id)}
            className="relative z-10 rounded-full cursor-pointer whitespace-nowrap"
            style={{
              fontFamily: 'Satoshi, system-ui, sans-serif',
              fontWeight: 600,
              letterSpacing: compact ? '0.04em' : '-0.01em',
              fontSize: compact ? '0.7rem' : 'clamp(0.95rem, 1.6vw, 1.25rem)',
              padding: compact ? '0.45rem 0.9rem' : 'clamp(0.85rem,1.6vw,1.2rem) clamp(1.3rem,3.2vw,2.6rem)',
              color: active ? '#0a0a0a' : 'rgba(255,255,255,0.7)',
              transition: 'color 0.35s ease',
            }}
          >
            {active && (
              <motion.span
                layoutId={`${idPrefix}-thumb`}
                className="absolute inset-0 rounded-full -z-10"
                style={{ background: '#fff', boxShadow: '0 6px 24px rgba(255,255,255,0.18)' }}
                transition={{ type: 'spring', stiffness: 420, damping: 36 }}
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

/** Full-screen first screen: pick Developer or Graphic Designer before anything loads. */
export function ModeGate({ onPick }: { onPick: (m: Mode) => void }) {
  const [selected, setSelected] = useState<Mode | null>(null);
  const [hint, setHint] = useState<Mode | null>(null);

  const choose = (m: Mode) => {
    if (selected) return;
    setSelected(m);
    window.setTimeout(() => onPick(m), 650);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') choose('developer');
      if (e.key === 'ArrowRight') choose('designer');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const shown = selected ?? hint;

  return (
    <motion.div
      data-theme="dark"
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center text-center"
      style={{ background: '#050505', color: '#fff', padding: '0 6vw' }}
      initial={{ opacity: 1 }}
      animate={{ opacity: selected ? 0 : 1 }}
      transition={{ duration: 0.55, delay: selected ? 0.12 : 0, ease: EASE }}
    >
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 42%, rgba(255,255,255,0.07), transparent 70%), radial-gradient(40% 30% at 50% 100%, rgba(255,255,255,0.05), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="relative flex flex-col items-center"
      >
        <Image src="/zakaria-mark.png" alt="Zakaria Dabella logo" width={56} height={64} priority style={{ height: 'auto', width: 44, marginBottom: 28 }} />
        <p
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontSize: '0.68rem',
            letterSpacing: '0.34em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
            marginBottom: 22,
          }}
        >
          Zakaria Dabella · Portfolio
        </p>
        <h1
          style={{
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontWeight: 900,
            letterSpacing: '-0.045em',
            lineHeight: 0.95,
            fontSize: 'clamp(2.4rem, 7vw, 5.6rem)',
            marginBottom: 'clamp(2rem, 5vh, 3.2rem)',
          }}
        >
          Who would you
          <br />
          like to meet?
        </h1>

        <div data-cursor="open" onMouseLeave={() => setHint(null)} onMouseOver={(e) => {
          const t = (e.target as HTMLElement).closest('button[role="radio"]');
          if (t) setHint(t.textContent === 'Developer' ? 'developer' : 'designer');
        }}>
          <ModeToggle value={selected} onChange={choose} idPrefix="gate" />
        </div>

        <p
          style={{
            height: 22,
            marginTop: 26,
            fontFamily: 'Satoshi, system-ui, sans-serif',
            fontSize: '0.85rem',
            color: 'rgba(255,255,255,0.5)',
            transition: 'opacity 0.3s',
            opacity: shown ? 1 : 0.55,
          }}
        >
          {shown ? OPTIONS.find((o) => o.id === shown)!.hint : 'Pick a side — you can switch any time.'}
        </p>
      </motion.div>
    </motion.div>
  );
}
