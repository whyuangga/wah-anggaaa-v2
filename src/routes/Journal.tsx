import { motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';
import { POSTS, formatDate } from '../lib/journal';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Journal() {
  return (
    <>
      <Seo
        title="jurnal"
        path="/journal"
        description="Jurnal wahanggaaa — catatan proses, eksperimen gagal, dan opini sok tahu. Tanpa jadwal terbit."
      />
      <section className="px-5 md:px-10 pt-32 md:pt-44">
        <p className="lbl text-ink/60">
          [ jurnal — {String(POSTS.length).padStart(3, '0')} tulisan ]
        </p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="mt-8 font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(2.8rem,10vw,9rem)]"
        >
          jurnal<span className="text-ink/30">.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.3, ease: [...EASE] }}
          className="mt-6 max-w-md text-[15px] leading-relaxed text-ink/60"
        >
          Catatan proses, eksperimen gagal, dan opini sok tahu. Tanpa jadwal terbit —
          terbit kalau keisengannya menyala.
        </motion.p>

        <div className="mt-14 md:mt-20">
          {POSTS.map((p, i) => (
            <motion.div
              key={p.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.06, ease: [...EASE] }}
            >
              <TLink
                to={`/journal/${p.slug}`}
                className="group menu-item grid md:grid-cols-12 gap-2 md:gap-6 py-8"
              >
                <span className="md:col-span-1 lbl text-ink/40">
                  {String(POSTS.length - i).padStart(3, '0')}
                </span>
                {/* hover: judul geser + panah slide-in (pola .menu-arrow home) */}
                <span className="md:col-span-6 font-serif font-bold text-[clamp(1.4rem,3.4vw,2.4rem)] leading-tight transition-[opacity,translate] duration-300 group-hover:opacity-60 group-hover:translate-x-1.5">
                  {p.title}
                  <span aria-hidden className="menu-arrow ml-2 inline-block w-5 text-left">
                    →
                  </span>
                </span>
                <span className="md:col-span-3 text-[14px] leading-relaxed text-ink/70">{p.desc}</span>
                <span className="md:col-span-2 md:text-right lbl text-ink/40">
                  {formatDate(p.date)}
                </span>
              </TLink>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer giant={false} />
    </>
  );
}
