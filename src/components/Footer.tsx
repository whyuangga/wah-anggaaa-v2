import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { Variants } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { useStudioStatus } from '../hooks/useStudioStatus';
import { TLink } from '../lib/transition';

const EASE = [0.22, 1, 0.36, 1] as const;

/* cascade per huruf: SATU observer di baris (parent), huruf anak menerima
   stagger via variants — pola yang sama dengan line-mask footer lama. */
const LINE_VARIANTS: Variants = {
  hide: {},
  show: { transition: { staggerChildren: 0.045 } },
};
const CHAR_VARIANTS: Variants = {
  hide: { y: '112%' },
  show: { y: '0%', transition: { duration: 0.9, ease: [...EASE] } },
};

/** Footer v2.2: serif italic raksasa "just for fun." (ganti brand word v1). */
export default function Footer({ giant = true }: { giant?: boolean }) {
  const time = useJakartaTime();
  const status = useStudioStatus();
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  return (
    <footer className={`relative px-5 md:px-10 pb-6 ${giant ? 'pt-20 md:pt-28' : 'pt-10 md:pt-14'}`}>
      {giant && (
        <TLink to="/" ariaLabel="Kembali ke index">
          {/* v2.16: cascade per huruf saat masuk viewport + wave saat hover
              (delay per huruf via --d); teks utuh tetap ada untuk SR */}
          <span className="wave block overflow-hidden pb-[0.1em] -mb-[0.1em] transition-opacity group-hover:opacity-70">
            <span className="sr-only">just for fun.</span>
            <motion.span
              aria-hidden
              variants={LINE_VARIANTS}
              initial={reduced ? 'show' : 'hide'}
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="block font-serif italic leading-[0.95] text-[clamp(3rem,12vw,12rem)] whitespace-nowrap"
            >
              {'just for fun.'.split('').map((ch, i) => (
                <motion.span
                  key={i}
                  variants={CHAR_VARIANTS}
                  className={`wave-ch inline-block will-change-transform ${
                    ch === '.' ? 'text-ink/30' : ''
                  }`}
                  style={{ '--d': `${i * 45}ms` } as CSSProperties}
                >
                  {ch === ' ' ? '\u00A0' : ch}
                </motion.span>
              ))}
            </motion.span>
          </span>
        </TLink>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-8 md:pt-12 lbl text-ink/50">
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
