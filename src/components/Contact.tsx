'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView, useMotionValue, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ArrowUpRight, X } from 'lucide-react';
import { ContactCanvas } from './ContactCanvas';

gsap.registerPlugin(ScrollTrigger, SplitText);

const EASE = [0.22, 1, 0.36, 1] as const;
const EMAIL = 'zakariaadabella@gmail.com';
const PHONE_DISPLAY = '+212 705 805 992';
const WHATSAPP_URL =
  'https://wa.me/212705805992?text=Hi%20Zakaria%2C%20I%20saw%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project.';
const EMAIL_URL =
  'mailto:zakariaadabella@gmail.com?subject=Project%20Inquiry%20from%20Portfolio&body=Hi%20Zakaria%2C%0A%0AI%20saw%20your%20portfolio%20and%20I%20would%20like%20to%20discuss%20a%20project.%0A%0AProject%20details%3A%0ABudget%3A%0ATimeline%3A';

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/zakaria10-dabella',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/zakaria-dabella',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'Behance',
    href: 'https://www.behance.net/zkrdbl',
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        <text x="12" y="16" fontSize="10" textAnchor="middle" fontFamily="Satoshi, system-ui, sans-serif" fontWeight="700">B</text>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: EMAIL_URL,
    svg: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.741l7.73-8.835L1.254 2.25H8.08l4.258 5.63 5.906-5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
];

/* ── Magnetic CTA button ──────────────────────────────────────────────────── */
function MagneticCTA({
  label,
  onClick,
  variant = 'outline',
}: {
  label: string;
  onClick: () => void;
  variant?: 'outline' | 'solid';
}) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 280, damping: 26 });
  const y = useSpring(rawY, { stiffness: 280, damping: 26 });

  const solid = variant === 'solid';

  return (
    <motion.button
      data-cursor="hire"
      style={{ x, y }}
      onClick={onClick}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        rawX.set((e.clientX - r.left - r.width / 2) * 0.3);
        rawY.set((e.clientY - r.top - r.height / 2) * 0.3);
      }}
      onMouseLeave={() => { rawX.set(0); rawY.set(0); }}
      className={
        solid
          ? 'group inline-flex items-center gap-3 bg-white text-black px-8 py-4 hover:bg-white/85 transition-colors duration-300'
          : 'group inline-flex items-center gap-3 border border-white/20 px-8 py-4 text-white/60 hover:text-white hover:border-white/50 transition-colors duration-300'
      }
      whileHover={!solid ? { backgroundColor: 'rgba(255,255,255,0.04)' } : undefined}
    >
      <span
        className="text-[0.65rem] tracking-[0.22em] uppercase font-medium"
        style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
      >
        {label}
      </span>
      <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
    </motion.button>
  );
}

/* ── Contact modal ────────────────────────────────────────────────────────── */
function ContactModal({ intent, onClose }: { intent: 'message' | 'call'; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      {/* Panel */}
      <motion.div
        data-theme="dark"
        className="relative w-full sm:max-w-xl bg-[#0d0d0d] border border-white/10 overflow-hidden"
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        {/* Corner accents */}
        <div className="absolute top-0 right-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-px h-12 bg-white/20" />
          <div className="absolute top-0 right-0 w-12 h-px bg-white/20" />
        </div>
        <div className="absolute bottom-0 left-0 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-px h-12 bg-white/10" />
          <div className="absolute bottom-0 left-0 w-12 h-px bg-white/10" />
        </div>

        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <span
                className="text-[0.55rem] tracking-[0.28em] uppercase text-white/25 font-medium block mb-2"
                style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              >
                {intent === 'call' ? 'Book a Call' : 'Get in Touch'}
              </span>
              <h2
                className="font-black text-white tracking-[-0.035em] leading-tight"
                style={{
                  fontFamily: 'Satoshi, system-ui, sans-serif',
                  fontWeight: 900,
                  fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
                }}
              >
                Choose how to{' '}
                <span
                  style={{
                    fontFamily: 'var(--font-instrument), Georgia, serif',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    color: 'rgba(255,255,255,0.32)',
                  }}
                >
                  contact me
                </span>
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 border border-white/12 flex items-center justify-center text-white/30 hover:text-white hover:border-white/35 transition-colors duration-200 shrink-0 mt-1"
            >
              <X size={14} />
            </button>
          </div>

          <p
            className="text-white/35 leading-relaxed mb-6"
            style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
          >
            Pick WhatsApp for a fast reply, or email if you want to send project details.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group border border-white/12 bg-white text-black px-5 py-4 hover:bg-white/88 transition-colors duration-200"
            >
              <span className="block text-[0.58rem] tracking-[0.2em] uppercase text-black/45 font-semibold mb-2" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                WhatsApp
              </span>
              <span className="flex items-center justify-between gap-4 text-sm font-semibold" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                {PHONE_DISPLAY}
                <ArrowUpRight size={14} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>

            <a
              href={EMAIL_URL}
              onClick={onClose}
              className="group border border-white/12 px-5 py-4 text-white/70 hover:text-white hover:border-white/35 hover:bg-white/[0.04] transition-colors duration-200"
            >
              <span className="block text-[0.58rem] tracking-[0.2em] uppercase text-white/28 font-semibold mb-2" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                Email
              </span>
              <span className="flex items-center justify-between gap-4 text-sm font-semibold break-all" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                {EMAIL}
                <ArrowUpRight size={14} className="shrink-0 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </a>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main section ─────────────────────────────────────────────────────────── */
export function Contact() {
  const sectionRef   = useRef<HTMLElement>(null);
  const emailRef     = useRef<HTMLAnchorElement>(null);
  const wordmarkRef  = useRef<HTMLSpanElement>(null);
  const sectionInView = useInView(sectionRef, { once: true, margin: '-12%' });
  const [modal, setModal] = useState<null | 'message' | 'call'>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setModal(detail === 'call' ? 'call' : 'message');
    };
    window.addEventListener('open-contact-modal', handler);
    return () => window.removeEventListener('open-contact-modal', handler);
  }, []);

  /* ── Footer wordmark animation ── */
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;

    let glitchTimer: ReturnType<typeof setTimeout> | undefined;

    const ctx = gsap.context(() => {
      const split = new SplitText(el, { type: 'chars' });
      const chars = split.chars as HTMLElement[];

      /*
       * The span's text color is already rgba(255,255,255,0.032).
       * Animating GSAP `opacity` would compound with that color alpha
       * and make the text invisible. Instead, we set an explicit `color`
       * on each char and animate THAT — leaving CSS opacity untouched.
       */
      gsap.set(chars, {
        color: 'rgba(255,255,255,0)',
        y: -40,
        skewX: () => (Math.random() - 0.5) * 10,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top bottom', // fire as soon as any part enters viewport
          toggleActions: 'play none none none',
        },
      });

      /* 1 — fly in with a bright flash */
      tl.to(chars, {
        color: 'rgba(255,255,255,0.18)',
        y: 0,
        skewX: 0,
        duration: 1.6,
        stagger: { amount: 0.55, from: 'random' },
        ease: 'expo.out',
      });

      /* 2 — settle to the original ghost opacity */
      tl.to(chars, {
        color: 'rgba(255,255,255,0.032)',
        duration: 2,
        stagger: { amount: 0.4 },
        ease: 'power2.inOut',
      }, '-=0.7');

      /* 3 — continuous idle float (y only — never touches color) */
      chars.forEach((char, i) => {
        gsap.to(char, {
          y: `${2 + Math.sin(i * 0.9) * 3}px`,
          duration: 3.5 + i * 0.2,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: i * 0.09,
        });
      });

      /* 4 — periodic glitch on a random character (color-based, not opacity) */
      const scheduleGlitch = (delay = 4200) => {
        glitchTimer = setTimeout(() => {
          if (!chars.length) return;
          const i = Math.floor(Math.random() * chars.length);
          gsap.timeline()
            .to(chars[i], { color: 'rgba(255,255,255,0.28)', x: 3, skewX: 7, duration: 0.055 })
            .to(chars[i], { color: 'rgba(255,255,255,0.01)', x: -2, skewX: -5, duration: 0.055 })
            .to(chars[i], { color: 'rgba(255,255,255,0.032)', x: 0, skewX: 0, duration: 0.1 });
          scheduleGlitch(1500 + Math.random() * 3000);
        }, delay);
      };
      scheduleGlitch();
    }, el);

    return () => {
      clearTimeout(glitchTimer);
      ctx.revert();
    };
  }, []);

  /* ── Email SplitText animation ── */
  useEffect(() => {
    if (!sectionRef.current || !emailRef.current) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(emailRef.current!, { type: 'chars' });
      gsap.fromTo(
        split.chars,
        { y: 48, opacity: 0 },
        {
          y: 0, opacity: 1,
          duration: 1.1,
          stagger: 0.022,
          ease: 'power4.out',
          scrollTrigger: { trigger: emailRef.current, start: 'top 80%' },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        id="contact"
        data-theme="dark"
        className="w-full bg-[#0A0A0A] border-t border-white/6 relative overflow-hidden"
      >
        {/* Constellation background */}
        <div className="absolute inset-0 pointer-events-none z-0" aria-hidden>
          <ContactCanvas />
        </div>

        <div className="relative z-10 max-w-360 mx-auto px-[clamp(1.25rem,5vw,5rem)] pt-[clamp(5rem,10vw,11rem)] pb-0">

          {/* Section label */}
          <div className="flex items-center gap-4 mb-[clamp(3rem,6vw,8rem)]">
            <motion.span
              className="text-[0.6rem] tracking-[0.22em] uppercase text-white/20 font-medium shrink-0"
              style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              initial={{ opacity: 0, x: -16 }}
              animate={sectionInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: EASE }}
            >
              08 / Contact
            </motion.span>
            <motion.div
              className="flex-1 h-px bg-white/10"
              initial={{ scaleX: 0, transformOrigin: 'left' }}
              animate={sectionInView ? { scaleX: 1 } : {}}
              transition={{ duration: 1.4, delay: 0.15, ease: EASE }}
            />
          </div>

          {/* Giant email CTA */}
          <div className="mb-[clamp(3rem,6vw,8rem)]">
            <motion.p
              className="text-white/30 mb-5"
              style={{
                fontFamily: 'var(--font-instrument), Georgia, serif',
                fontStyle: 'italic',
                fontSize: 'clamp(1rem, 2vw, 1.6rem)',
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
            >
              Have a project in mind?
            </motion.p>

            <div className="overflow-hidden mb-8">
              <a
                ref={emailRef}
                href={EMAIL_URL}
                className="block font-black text-white tracking-[-0.04em] leading-[0.88] hover:text-white/45 transition-colors duration-300 will-change-transform"
                style={{
                  fontFamily: 'Satoshi, system-ui, sans-serif',
                  fontWeight: 800,
                  fontSize: 'clamp(1.8rem, 5.5vw, 7rem)',
                  wordBreak: 'break-all',
                }}
              >
                {EMAIL}
              </a>
            </div>

            <motion.div
              className="flex flex-wrap items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={sectionInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5, ease: EASE }}
            >
              <MagneticCTA label="Book a Call" variant="solid" onClick={() => setModal('call')} />
              <MagneticCTA label="Send a Message" onClick={() => setModal('message')} />
              <a
                href={EMAIL_URL}
                className="text-[0.62rem] tracking-[0.18em] uppercase text-white/28 hover:text-white/60 transition-colors duration-200 font-medium"
                style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              >
                or email directly
              </a>
            </motion.div>
          </div>

          {/* Info strip */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-0 border-t border-white/8 mb-0"
            initial={{ opacity: 0 }}
            animate={sectionInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.55, ease: EASE }}
          >
            {[
              { label: 'Location', value: 'Casablanca, Morocco · Remote Available' },
              { label: 'Phone', value: PHONE_DISPLAY },
              { label: 'Status', value: 'Available for projects', pulse: true },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`py-8 pr-8 ${i > 0 ? 'sm:border-l sm:border-white/8 sm:pl-8 sm:pr-0' : ''}`}
              >
                <p
                  className="text-[0.55rem] tracking-[0.22em] uppercase text-white/22 font-medium mb-2"
                  style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
                >
                  {item.label}
                </p>
                <div className="flex items-center gap-2">
                  {item.pulse && <span className="w-1.5 h-1.5 rounded-full bg-white/60 animate-pulse shrink-0" />}
                  <p
                    className="text-white/55 font-medium"
                    style={{
                      fontFamily: 'Satoshi, system-ui, sans-serif',
                      fontSize: 'clamp(0.85rem, 1.3vw, 1rem)',
                    }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Footer ──────────────────────────────────────────────────────── */}
        <footer className="border-t border-white/6 mt-0 relative z-10 overflow-hidden">

          {/* Big background wordmark */}
          <div
            aria-hidden
            className="absolute bottom-0 left-0 right-0 pointer-events-none select-none flex justify-center items-end"
          >
            <span
              ref={wordmarkRef}
              style={{
                fontFamily: 'Satoshi, system-ui, sans-serif',
                fontWeight: 900,
                fontSize: 'clamp(4.5rem, 18vw, 22rem)',
                letterSpacing: '-0.02em',
                color: 'rgba(255,255,255,0.032)',
                lineHeight: 0.82,
                whiteSpace: 'nowrap',
                userSelect: 'none',
              }}
            >
              ZAKARIA
            </span>
          </div>

          <div className="relative z-10 max-w-360 mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(3rem,5vw,5rem)]">

            {/* Top row: logo + socials */}
            <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8 mb-10 sm:mb-12">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={sectionInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.6, ease: EASE }}
              >
                <span className="text-white/45 font-black tracking-[-0.03em] text-2xl" style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}>
                  ZD
                </span>
              </motion.div>

              {/* Socials */}
              <motion.div
                className="flex items-center justify-center gap-3"
                initial={{ opacity: 0 }}
                animate={sectionInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.7, ease: EASE }}
              >
                {SOCIALS.map(({ label, href, svg }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 border border-white/12 flex items-center justify-center text-white/25 hover:text-white hover:border-white/35 transition-all duration-200"
                  >
                    {svg}
                  </a>
                ))}
              </motion.div>
            </div>

            {/* Middle: nav links */}
            <motion.div
              className="grid grid-cols-3 sm:flex sm:flex-wrap gap-y-4 sm:gap-x-8 sm:gap-y-3 mb-10 sm:mb-12"
              initial={{ opacity: 0 }}
              animate={sectionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
            >
              {[
                { label: 'About', href: '#about' },
                { label: 'Projects', href: '#work' },
                { label: 'Services', href: '#services' },
                { label: 'Process', href: '#process' },
                { label: 'Experience', href: '#experience' },
                { label: 'Credentials', href: '#credentials' },
                { label: 'Contact', href: '#contact' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  className="text-[0.58rem] tracking-[0.2em] uppercase text-white/22 hover:text-white/60 transition-colors duration-200 font-medium text-center sm:text-left"
                  style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
                >
                  {label}
                </a>
              ))}
            </motion.div>

            {/* Bottom bar */}
            <motion.div
              className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 border-t border-white/6 pt-8"
              initial={{ opacity: 0 }}
              animate={sectionInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.85, ease: EASE }}
            >
              <p
                className="text-[0.55rem] tracking-[0.16em] uppercase text-white/18 font-medium text-center sm:text-left"
                style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              >
                © 2026 Zakaria Dabella · Casablanca, Morocco
              </p>
              <p
                className="text-[0.55rem] tracking-[0.14em] uppercase text-white/12 text-center sm:text-right"
                style={{ fontFamily: 'Satoshi, system-ui, sans-serif' }}
              >
                Full-Stack Development · IT Support · Graphic &amp; UI/UX Design
              </p>
            </motion.div>
          </div>  {/* end z-10 wrapper */}
        </footer>
      </section>

      {/* Modal portal */}
      <AnimatePresence>
        {modal && <ContactModal intent={modal} onClose={() => setModal(null)} />}
      </AnimatePresence>
    </>
  );
}
