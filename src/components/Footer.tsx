import { useMemo } from 'react';
import { motion } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { useStudioStatus } from '../hooks/useStudioStatus';
import { TLink } from '../lib/transition';

const EASE = [0.22, 1, 0.36, 1] as const;

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
          <span className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span
              initial={reduced ? { y: 0 } : { y: '112%' }}
              whileInView={{ y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.1, ease: [...EASE] }}
              className="block font-serif italic leading-[0.95] text-[clamp(3rem,12vw,12rem)] whitespace-nowrap will-change-transform group-hover:opacity-70 transition-opacity"
            >
              just for fun<span className="text-ink/30">.</span>
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
