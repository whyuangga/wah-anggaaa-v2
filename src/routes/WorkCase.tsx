import { motion } from 'motion/react';
import { useParams } from 'react-router-dom';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';
import { WORKS } from '../data/works';
import NotFound from './NotFound';

const EASE = [0.22, 1, 0.36, 1] as const;

function Meta({ children }: { children: ReactNode }) {
  return <p className="lbl text-ink/60">{children}</p>;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, filter: 'blur(14px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [...EASE] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** satu gambar galeri dengan blur placeholder — warna asli, tanpa filter. */
function Figure({ src, blur, alt, n }: { src: string; blur: string; alt: string; n: number }) {
  return (
    <Reveal>
      <figure className="relative overflow-hidden bg-ink/[0.045]">
        <span
          aria-hidden
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${blur})` }}
        />
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={(e) => {
            e.currentTarget.style.opacity = '1';
            e.currentTarget.style.filter = 'blur(0px)';
          }}
          className="relative w-full object-cover opacity-0 blur-[8px] transition-[opacity,filter] duration-700"
        />
      </figure>
      <p className="mt-3 lbl text-[10px] text-ink/35">[ fig. {String(n).padStart(2, '0')} ]</p>
    </Reveal>
  );
}

export default function WorkCase() {
  const { slug } = useParams();
  const idx = WORKS.findIndex((w) => w.slug === slug);
  if (idx === -1) return <NotFound />;
  const w = WORKS[idx];
  const prev = WORKS[(idx - 1 + WORKS.length) % WORKS.length];
  const next = WORKS[(idx + 1) % WORKS.length];
  const og = w.thumb.replace(/\.webp$/, '-og.jpg');

  return (
    <>
      <Seo
        title={`${w.title} — studi kasus`}
        description={w.blurb}
        image={og}
        type="article"
        path={`/works/${w.slug}`}
      />
      <section className="px-5 md:px-10 pt-28 md:pt-36 pb-20 md:pb-28">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Meta>[ case — {Number(w.index)} / {WORKS.length} ]</Meta>
          <TLink to="/" className="lbl cursor-pointer text-ink/45 transition-opacity hover:text-ink">
            [ ← semua karya ]
          </TLink>
        </div>

        {/* foto HERO di paling atas — FOKUS BLUR: blur→tajam + settle (ala
            kartu home yang tadi diklik "membuka fokus" ke casenya) */}
        <motion.div
          initial={{ opacity: 0, y: 28, scale: 1.05, filter: 'blur(26px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1.15, ease: [...EASE] }}
          className="relative overflow-hidden bg-ink/[0.045]"
        >
          <span
            aria-hidden
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${w.blur})` }}
          />
          <img
            src={w.thumb}
            alt={w.title}
            onLoad={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
            className="relative w-full max-h-[68vh] object-cover opacity-0 transition-opacity duration-700"
          />
        </motion.div>

        <div className="relative mt-10 md:mt-16">
          <span
            aria-hidden
            className="text-outline pointer-events-none select-none absolute -top-4 md:-top-12 right-0 font-display font-bold leading-none text-[clamp(5rem,17vw,13rem)] opacity-[0.14]"
          >
            {w.index}
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.25, ease: [...EASE] }}
            className="relative mt-0 font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(2.8rem,10vw,9rem)]"
          >
            {w.title}
          </motion.h1>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.45, ease: [...EASE] }}
          className="mt-5 font-serif italic text-[clamp(1.1rem,2.4vw,1.7rem)] text-ink/70"
        >
          {w.category} — {w.year} — {w.role}
        </motion.p>

        {/* ringkasan */}
        <div className="grid md:grid-cols-12 gap-10 mt-14 md:mt-20">
          <div className="md:col-span-4">
            <Reveal>
              <Meta>[ ringkasan ]</Meta>
              <dl className="mt-6 space-y-3 lbl">
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/40">klien</dt>
                  <dd>fiktif belaka</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/40">tahun</dt>
                  <dd>{w.year}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/40">peran</dt>
                  <dd>{w.role}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-ink/40">stack</dt>
                  <dd className="text-right">{w.stack.join(' / ')}</dd>
                </div>
              </dl>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="font-display font-medium text-[clamp(1.3rem,2.6vw,1.9rem)] leading-snug tracking-tight text-ink/85">
                {w.blurb}
              </p>
            </Reveal>
          </div>
        </div>

        {/* tantangan */}
        <div className="mt-16 md:mt-28 pt-4">
          <Reveal>
            <Meta>[ 01 — tantangan ]</Meta>
            <p className="mt-6 max-w-3xl font-serif italic leading-[1.25] text-[clamp(1.4rem,3.2vw,2.4rem)] text-ink">
              {w.challenge}
            </p>
          </Reveal>
        </div>

        {/* proses + galeri selingan */}
        <div className="mt-16 md:mt-28 pt-4">
          <Reveal>
            <Meta>[ 02 — proses ]</Meta>
          </Reveal>
          <div className="mt-8 space-y-14 md:space-y-20">
            {w.story.map((p, i) => (
              <Fragment key={i}>
                <div className="grid md:grid-cols-12 gap-6">
                  <p className="md:col-span-3 md:col-start-1 lbl text-ink/60">
                    [ langkah {String(i + 1).padStart(2, '0')} ]
                  </p>
                  <Reveal delay={0.05} className="md:col-span-6">
                    <p className="text-[16px] md:text-[17px] leading-relaxed text-ink/80 max-w-xl">{p}</p>
                  </Reveal>
                </div>
                {w.gallery[i] && (
                  <Figure
                    src={w.gallery[i].src}
                    blur={w.gallery[i].blur}
                    alt={`${w.title} — gambar ${i + 1}`}
                    n={i + 1}
                  />
                )}
              </Fragment>
            ))}
            {/* sisa galeri di luar langkah proses */}
            {w.gallery.slice(w.story.length).map((g, j) => (
              <Fragment key={j}>
                <Figure
                  src={g.src}
                  blur={g.blur}
                  alt={`${w.title} — gambar ${w.story.length + j + 1}`}
                  n={w.story.length + j + 1}
                />
              </Fragment>
            ))}
          </div>
        </div>

        {/* hasil */}
        <div className="mt-16 md:mt-28 pt-4">
          <Reveal>
            <Meta>[ 03 — hasil ]</Meta>
            <p className="mt-6 max-w-3xl font-serif italic leading-[1.25] text-[clamp(1.4rem,3.2vw,2.4rem)] text-ink">
              {w.outcome}
            </p>
          </Reveal>
        </div>

        {/* statistik ngarang */}
        <div className="mt-16 md:mt-28 pt-4">
          <Reveal>
            <Meta>[ angka penting (katanya) ]</Meta>
            <div className="mt-8 grid grid-cols-3 gap-6">
              {w.stats.map(([label, value]) => (
                <div key={label}>
                  <p className="font-display font-bold tracking-tight text-[clamp(1.6rem,4.5vw,3rem)]">{value}</p>
                  <p className="mt-2 lbl text-[10px] md:text-[11px] text-ink/45">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* visit */}
        <div className="mt-12 md:mt-16">
          <Reveal>
            <a
              href={w.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group font-display font-medium text-lg tracking-tight hover:opacity-70 transition-opacity"
            >
              visit live site{' '}
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
            </a>
          </Reveal>
        </div>

        {/* prev / next */}
        <div className="mt-20 md:mt-28 pt-4 grid grid-cols-2 gap-6">
          <TLink to={`/works/${prev.slug}`} className="group block">
            <span className="lbl text-ink/45">[ ← prev ]</span>
            <span className="block mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(1.4rem,4vw,2.6rem)] text-ink/60 group-hover:text-ink transition-colors">
              {prev.title}
            </span>
          </TLink>
          <TLink to={`/works/${next.slug}`} className="group block text-right">
            <span className="lbl text-ink/45">[ next → ]</span>
            <span className="block mt-3 font-display font-bold uppercase tracking-tight leading-[0.95] text-[clamp(1.4rem,4vw,2.6rem)] text-ink/60 group-hover:text-ink transition-colors">
              {next.title}
            </span>
          </TLink>
        </div>
      </section>

      <Footer giant={false} />
    </>
  );
}
