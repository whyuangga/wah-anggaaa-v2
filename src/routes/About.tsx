import { useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">{children}</p>;
}

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [...EASE] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * Foto portrait: pakai public/images/about-portrait.webp kalau ada,
    kalau belum → placeholder kalem (tanpa garis).
 */
function Portrait() {
  const [ok, setOk] = useState(true);
  const src = `${import.meta.env.BASE_URL}images/about-portrait.webp`;
  if (ok) {
    return (
      <img
        src={src}
        onError={() => setOk(false)}
        alt="Portrait Angga"
        loading="lazy"
        decoding="async"
        className="w-full aspect-[4/5] object-cover"
      />
    );
  }
  return (
    <div className="w-full aspect-[4/5] bg-ink/[0.045] flex items-center justify-center">
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/30">[ portrait — soon ]</p>
    </div>
  );
}

/** Dua baris konvergen dari sisi berlawanan mengikuti scroll (ala Inspirux). */
function DriftLines({
  lineA,
  lineB,
  className = '',
}: {
  lineA: ReactNode;
  lineB: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const aRef = useRef<HTMLSpanElement>(null);
  const bRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!ref.current || !aRef.current || !bRef.current) return;
    const mm = gsap.matchMedia();
    const drift = (amt: string) => {
      gsap
        .timeline({
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'top 30%',
            scrub: 1,
          },
        })
        .fromTo(aRef.current, { x: `-${amt}` }, { x: '0%', ease: 'none' }, 0)
        .fromTo(bRef.current, { x: amt }, { x: '0%', ease: 'none' }, 0);
    };
    mm.add('(min-width: 768px)', () => drift('30%'));
    mm.add('(max-width: 767px)', () => drift('10%'));
    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div ref={ref} className="whitespace-nowrap">
      <span ref={aRef} className={`block will-change-transform ${className}`}>
        {lineA}
      </span>
      <span ref={bRef} className={`block will-change-transform ${className}`}>
        {lineB}
      </span>
    </div>
  );
}

const CAPABILITIES: [string, string[]][] = [
  ['Design', ['Art Direction', 'Landing Pages', 'Typography', 'Design Systems']],
  ['Develop', ['React', 'GSAP', 'Tailwind', 'Three.js / WebGL']],
];

export default function About() {
  const reduced = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  return (
    <>
      <Seo title="tentang" path="/about" />
      <section className="px-5 md:px-10 pt-32 md:pt-44 overflow-x-clip">
        <Meta>[ about ]</Meta>

        <h1 className="mt-8 font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(3rem,11vw,10rem)]">
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, x: '-12%' }}
            animate={{ opacity: 1, x: '0%' }}
            transition={{ duration: 1.6, ease: [...EASE] }}
          >
            halo, aku
          </motion.span>
          <motion.span
            className="block"
            initial={reduced ? false : { opacity: 0, x: '12%' }}
            animate={{ opacity: 1, x: '0%' }}
            transition={{ duration: 1.6, delay: 0.12, ease: [...EASE] }}
          >
            wah<span className="text-ink/30">.</span>
          </motion.span>
        </h1>

        <div className="grid md:grid-cols-12 gap-10 mt-12 md:mt-20 items-start">
          {/* portrait — offset dari grid */}
          <Reveal delay={0.15} className="md:col-span-5 md:col-start-1 mt-0 md:mt-24">
            <Portrait />
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35">
              [ fig. 01 — the one-man studio ]
            </p>
          </Reveal>

          <div className="md:col-span-5 md:col-start-7 space-y-6 text-[16px] leading-relaxed text-ink/80">
            <Reveal>
              <p>
                <span className="text-ink">wah:anggaaa adalah taman bermain satu orang</span>{' '}
                milik Angga — designer &amp; creative developer dari Jakarta.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p>
                Siang mengerjakan yang beneran, malam merawat yang iseng-iseng:
                brand fiktif, tipografi rusak, dan landing page yang tidak diminta
                siapa pun. Sebelas dunia kecil sejauh ini — dan masih nambah.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink/45">
                [ no client work here — just for fun ]
              </p>
            </Reveal>
          </div>
        </div>

        {/* capabilities — dipisah jarak, tanpa garis/kartu */}
        <div className="grid sm:grid-cols-2 gap-x-10 gap-y-12 mt-20 md:mt-28 max-w-3xl">
          {CAPABILITIES.map(([group, items], gi) => (
            <div key={group}>
              <Reveal delay={gi * 0.1}>
                <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">{group}</p>
                <ul className="mt-5 space-y-1.5">
                  {items.map((item) => (
                    <li key={item} className="font-display font-medium tracking-tight text-[19px] leading-snug text-ink">
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>

        {/* recognition */}
        <div className="mt-20 md:mt-28 md:ml-[38vw]">
          <Meta>[ recognition ]</Meta>
          <div className="mt-6">
            <DriftLines
              lineA="Belum ada —"
              lineB="iseng-iseng dulu."
              className="font-display font-medium tracking-tight text-[clamp(1.5rem,3.5vw,2.5rem)] text-ink/80"
            />
          </div>
        </div>

        {/* colophon */}
        <div className="mt-20 md:mt-28 max-w-2xl">
          <Reveal>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink/45">colophon</p>
            <ul className="mt-5 space-y-1.5 font-mono text-[13px] leading-relaxed text-ink">
              <li>type — tex gyre heros condensed + junicode + ibm plex mono</li>
              <li>color — #eae8e1 + #0d0d0c</li>
              <li>built — react + gsap + vite</li>
              <li>
                credit — tex gyre (GUST e-foundry, GUST Font License) · junicode (Peter S. Baker, SIL OFL 1.1)
              </li>
            </ul>
          </Reveal>
        </div>

        <div className="mt-16 md:mt-24">
          <Reveal>
            <TLink
              to="/contact"
              className="group font-display font-medium text-lg tracking-tight hover:opacity-70 transition-opacity"
            >
              say hi <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </TLink>
          </Reveal>
        </div>
      </section>

      <Footer giant={false} />
    </>
  );
}
