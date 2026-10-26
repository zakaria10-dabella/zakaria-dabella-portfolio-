'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { SmoothScroll } from '@/lib/SmoothScroll';
import { PageLoader } from '@/components/PageLoader';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { About } from '@/components/About';
import { Projects } from '@/components/Projects';
import { Services } from '@/components/Services';
import { Experience } from '@/components/Experience';
import { Credentials } from '@/components/Credentials';
import { CurrentlyBuilding } from '@/components/CurrentlyBuilding';
import { Process } from '@/components/Process';
import { FAQ } from '@/components/FAQ';
import { Stack } from '@/components/Stack';
import { Contact } from '@/components/Contact';
import { CustomCursor } from '@/components/CustomCursor';
import { ModeGate, ModeToggle, type Mode } from '@/components/ModeGate';
import { DesignerBook } from '@/components/designer/DesignerBook';

function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const fn = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-11 h-11 bg-black text-white flex items-center justify-center hover:bg-black/75 transition-colors duration-200"
          aria-label="Back to top"
        >
          <ArrowUp size={14} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

function DeveloperSite() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <PageLoader onDone={() => setLoaded(true)} />}
      <SmoothScroll>
        <Navbar />
        <main>

          <Hero />
          <About />
          <Projects />
          <CurrentlyBuilding />
          <Stack />
          <Services />
          <Process />
          <Experience />
          <Credentials />
          <FAQ />
          <Contact />
        </main>
        <BackToTop />
      </SmoothScroll>
    </>
  );
}

export default function Home() {
  // null = first screen (the switch). Nothing heavy loads until a mode is picked.
  const [mode, setMode] = useState<Mode | null>(null);

  return (
    <>
      {/* Static indexing helper for crawlers & search bots */}
      <article className="sr-only">
        <h1>Zakaria Dabella — Full-Stack Developer • IT Support Technician • Graphic &amp; UI/UX Designer</h1>
        <p>
          Zakaria Dabella is a versatile Technology &amp; Design Professional combining full-stack web development, IT infrastructure support, and visual UI/UX design, based in Casablanca, Morocco. Highly skilled in building responsive web applications with modern frameworks, diagnosing enterprise systems and networks, and crafting high-impact brand identities.
        </p>
        <h2>Core Skills &amp; Expertise</h2>
        <p>Full-Stack Development: HTML5, CSS3, JavaScript, PHP, Laravel, React.js, Next.js, Java, MySQL, REST APIs, Git, GitHub. Graphic Design &amp; UI/UX: Adobe Photoshop, Illustrator, Adobe XD, Figma, Visual Branding, Logo Design, Prototyping, Wireframing. IT Support &amp; Infrastructure: Windows 10/11 Administration, Hardware &amp; Software Troubleshooting, Network Diagnostics, Help Desk Support, Office 365.</p>
      </article>

      <CustomCursor />
      {mode === null && <ModeGate onPick={setMode} />}
      {mode === 'developer' && <DeveloperSite />}
      {mode === 'designer' && <DesignerBook onBack={() => setMode(null)} />}

      {mode && (
        <div className="fixed left-4 bottom-4 z-[9999]">
          <ModeToggle value={mode} onChange={setMode} compact idPrefix="float" />
        </div>
      )}
    </>
  );
}
