import { useEffect, useRef, useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import WorksRail from '../components/WorksRail';
import { TLink } from '../lib/transition';

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`font-mono text-[11px] uppercase tracking-[0.18em] text-ink ${className}`}>{children}</p>
  );
}

/** Baris raksasa dengan reveal line-mask. */
function MaskLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <span className="block overflow-hidden pb-[0.06em] -mb-[0.06em]">
      <motion.span
        className="block will-change-transform"
        initial={reduced ? { y: 0 } : { y: '112%' }}
        animate={{ y: 0 }}
        transition={{ duration: 1.1, delay, ease: [...EASE] }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ---------- manifesto: opacity kata-per-kata mengikuti scroll (scrub) ---------- */
function ManifestoScrub({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(' ');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const spans = Array.from(el.querySelectorAll('[data-w]')) as HTMLElement[];
    let raf = 0;
    let last = -1;
    const update = () => {
      raf = requestAnimationFrame(update);
      const vh = window.innerHeight;
      if (!vh) return;
      const top = el.getBoundingClientRect().top;
      const progress = Math.min(1, Math.max(0, (vh * 0.9 - top) / (vh * 0.3)));
      const q = Math.round(progress * 500);
      if (q === last) return;
      last = q;
      const p = progress * spans.length;
      for (let i = 0; i < spans.length; i++) {
        spans[i].style.opacity = String(Math.min(1, Math.max(0.12, p - i)));
      }
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [text]);

  return (
    <p
      ref={ref}
      className="font-serif italic leading-[1.18] text-[clamp(1.7rem,4vw,3.1rem)] max-w-[24ch] text-ink"
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} data-w style={{ opacity: 0.12 }} className="inline-block mr-[0.27em]">
          {w}
        </span>
      ))}
    </p>
  );
}

export default function Home() {
  return (
    <>
      <Seo />
      {/* ============ HERO ============ */}
      <section className="relative min-h-svh flex flex-col justify-end overflow-hidden px-5 md:px-10 pt-28 pb-8">
        <Meta className="absolute top-[4.5rem] md:top-[5.5rem] left-5 md:left-10 text-ink/60">
          [ portfolio — vol.01 ]
        </Meta>
        <Meta className="absolute top-[4.5rem] md:top-[5.5rem] right-5 md:right-10 text-right hidden sm:block text-ink/60">
          11 works — '26
        </Meta>

        <h1 className="font-display font-bold uppercase tracking-[-0.015em] leading-[0.86] text-[clamp(3.2rem,12.5vw,13rem)]">
          <MaskLine>Imaginary Brands.</MaskLine>
          <MaskLine delay={0.12}>Real Craft.</MaskLine>
          <MaskLine delay={0.24}>Zero Invoices.</MaskLine>
        </h1>

        {/* role — serif italic */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.55, ease: [...EASE] }}
          className="mt-6 md:mt-8 ml-1 md:ml-[24vw] font-serif italic text-[clamp(1.25rem,3vw,2.1rem)] text-ink/70"
        >
          Designer &amp; Creative Developer
        </motion.p>

        <div className="grid md:grid-cols-12 gap-6 items-end mt-10 md:mt-14">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.7, ease: [...EASE] }}
            className="md:col-span-4 text-[15px] leading-relaxed text-ink/70 max-w-[34ch]"
          >
            Taman bermain satu orang milik Angga — dibangun di jam-jam curian:
            tanpa klien, tanpa brief, cuma obsesi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.85, ease: [...EASE] }}
            className="md:col-span-5 flex items-center gap-8"
          >
            <TLink
              to="/contact"
              className="group font-display font-medium text-lg tracking-tight hover:opacity-70 transition-opacity"
            >
              say hi <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </TLink>
            <TLink to="/about" className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/50 hover:text-ink transition-colors">
              [ about ]
            </TLink>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, delay: 1.0, ease: [...EASE] }}
            className="md:col-span-3 md:text-right space-y-2"
          >
            <Meta className="text-ink/50">[ just for fun ] · [ jakarta — wib ]</Meta>
            <Meta className="text-ink/40">scroll ↓</Meta>
          </motion.div>
        </div>
      </section>

      {/* ============ SELECTED WORKS — DRAG RAIL + INDEKS ============ */}
      <WorksRail />

      {/* ============ MANIFESTO ============ */}
      <section className="px-5 md:px-10 pt-32 md:pt-48 pb-8">
        <Meta className="mb-8 text-ink/50">[ manifesto ]</Meta>
        <ManifestoScrub text="Iseng-iseng yang diniatkan. Satu halaman, satu dunia kecil — fiktif tapi digarap sampai selesai." />
        <div className="mt-10 md:ml-[40vw]">
          <TLink
            to="/about"
            className="group font-display font-medium text-lg tracking-tight hover:opacity-70 transition-opacity"
          >
            more about me <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </TLink>
        </div>
      </section>

      {/* ============ SAY HI ============ */}
      <section className="px-5 md:px-10 pt-24 md:pt-36 pb-2">
        <TLink
          to="/contact"
          className="group block font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(3rem,14vw,13rem)] transition-transform duration-500 ease-out group-hover:translate-x-3"
        >
          Say Hi <span className="inline-block text-[0.55em] align-baseline">↗</span>
        </TLink>
      </section>

      <Footer />
    </>
  );
}
