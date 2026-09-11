import { useEffect, useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import WorksHuy from '../components/WorksHuy';
import { TLink } from '../lib/transition';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Baris dengan reveal line-mask. */
function MaskLine({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <span className="block overflow-hidden pb-[0.08em] -mb-[0.08em]">
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

/* manifesto: opacity kata-per-kata mengikuti scroll (scrub) */
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
      className="font-serif italic leading-[1.18] text-[clamp(1.8rem,4.2vw,3.3rem)] max-w-[24ch] text-ink"
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
      {/* ============ HERO — poster 3 treatment ============ */}
      <section className="relative min-h-svh flex flex-col justify-center overflow-hidden px-5 md:px-10 pt-28 pb-10">
        <div className="flex justify-between w-full mb-10 md:mb-16">
          <p className="lbl text-ink/50">[ portfolio — vol.01 ]</p>
          <p className="lbl text-ink/50 hidden sm:block">11 works — '26</p>
        </div>

        <h1>
          <MaskLine>
            <span className="font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(3rem,11vw,11rem)]">
              Imaginary Brands.
            </span>
          </MaskLine>
          <MaskLine delay={0.12}>
            <span className="font-serif italic leading-[1.04] text-[clamp(2.4rem,8.6vw,8.6rem)] text-ink md:ml-[10vw]">
              Real Craft.
            </span>
          </MaskLine>
          <MaskLine delay={0.24}>
            <span className="text-outline font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(3rem,11vw,11rem)]">
              Zero Invoices.
            </span>
          </MaskLine>
        </h1>

        <div className="grid md:grid-cols-12 gap-6 items-end mt-12 md:mt-16">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.7, ease: [...EASE] }}
            className="md:col-span-5 font-serif italic text-[clamp(1.15rem,2.4vw,1.7rem)] text-ink/75"
          >
            Designer &amp; Creative Developer — taman bermain satu orang, dibangun di jam-jam
            curian: tanpa klien, tanpa brief, cuma obsesi.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 0.85, ease: [...EASE] }}
            className="md:col-span-4 flex items-center gap-8"
          >
            <TLink
              to="/contact"
              className="group font-display font-medium text-lg tracking-tight hover:opacity-70 transition-opacity"
            >
              say hi <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </TLink>
            <TLink to="/about" className="lbl text-ink/50 hover:text-ink transition-colors">
              [ about ]
            </TLink>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.3, delay: 1.0, ease: [...EASE] }}
            className="md:col-span-3 md:text-right space-y-1"
          >
            <p className="lbl text-ink/50">[ just for fun ] · [ jakarta — wib ]</p>
            <p className="lbl text-ink/40">scroll ↓</p>
          </motion.div>
        </div>
      </section>

      {/* ============ SELECTED WORKS — index ala HUYMI (scroll = ganti proyek) ============ */}
      <WorksHuy />

      {/* ============ MANIFESTO ============ */}
      <section className="px-5 md:px-10 pt-32 md:pt-48 pb-8">
        <p className="lbl text-ink/50 mb-8">[ manifesto ]</p>
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
