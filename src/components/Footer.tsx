import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { motion } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { useStudioStatus } from '../hooks/useStudioStatus';
import { TLink } from '../lib/transition';

const EASE = [0.22, 1, 0.36, 1] as const;
const WORD = 'WAH:ANGGAAA'.split('');

/** Footer: kata raksasa cascade per huruf + wave saat hover.
    TANPA garis — pemisah hanya jarak. */
export default function Footer({ giant = true }: { giant?: boolean }) {
  const time = useJakartaTime();
  const status = useStudioStatus();
  const wordRef = useRef<HTMLSpanElement>(null);
  const shownRef = useRef(false);
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  // gelombang hover: huruf-huruf melompat berurutan (desktop).
  const wave = () => {
    if (reduced || !shownRef.current) return;
    const el = wordRef.current;
    if (!el) return;
    gsap.fromTo(
      el.querySelectorAll('.f-letter'),
      { y: '0%' },
      {
        y: '-14%',
        duration: 0.28,
        ease: 'power2.out',
        stagger: { each: 0.04, yoyo: true, repeat: 1 },
        overwrite: 'auto',
      },
    );
  };

  return (
    <footer className={`relative px-5 md:px-10 pb-6 ${giant ? 'pt-20 md:pt-28' : 'pt-10 md:pt-14'}`}>
      {giant && (
        <TLink to="/" ariaLabel="Kembali ke index">
          <motion.span
            ref={wordRef}
            onMouseEnter={wave}
            initial={reduced ? false : 'hidden'}
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            onViewportEnter={() => {
              // cascade ±1,4 dtk → wave diizinkan setelahnya
              window.setTimeout(() => {
                shownRef.current = true;
              }, 1600);
            }}
            variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.1 } } }}
            className="block font-display font-bold uppercase tracking-[-0.015em] leading-[0.85] text-[clamp(3rem,12.5vw,13rem)] whitespace-nowrap hover:opacity-80 transition-opacity"
          >
            {WORD.map((ch, i) => (
              <span
                key={`${ch}-${i}`}
                aria-hidden
                className="inline-block overflow-hidden align-bottom pb-[0.06em] -mb-[0.06em]"
              >
                <motion.span
                  variants={{
                    hidden: { y: '110%' },
                    show: { y: '0%', transition: { duration: 0.9, ease: [...EASE] } },
                  }}
                  className="f-letter inline-block will-change-transform"
                >
                  {ch}
                </motion.span>
              </span>
            ))}
          </motion.span>
        </TLink>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 md:pt-12 font-mono text-[11px] uppercase tracking-[0.14em] text-ink/50">
        <p>© 2026</p>
        <div className="flex items-center gap-6">
          <TLink to="/about" className="hover:text-ink transition-colors">about</TLink>
          <TLink to="/contact" className="hover:text-ink transition-colors">contact</TLink>
          <TLink to="/journal" className="hover:text-ink transition-colors">journal</TLink>
        </div>
        <p>
          jakarta — {time} <span className="text-ink/30">[ just for fun ]</span>
        </p>
        <p className="hidden lg:block">
          studio: <span className="text-ink/80">[ {status} ]</span>
        </p>
      </div>
    </footer>
  );
}
