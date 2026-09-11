import { motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { TLink } from '../lib/transition';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function NotFound() {
  return (
    <>
      <Seo title="404" noindex path="/404" />
      <section className="px-5 md:px-10 pt-32 md:pt-44 min-h-[72vh]">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [...EASE] }}
          className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60"
        >
          [ 404 ]
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.15, ease: [...EASE] }}
          className="mt-8 font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(3.5rem,14vw,12rem)]"
        >
          nyasar<span className="text-ink/30">.</span>
        </motion.h1>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.3, delay: 0.4, ease: [...EASE] }}
          className="mt-10 md:ml-[36vw]"
        >
          <p className="font-serif italic text-[clamp(1.1rem,2.4vw,1.5rem)] text-ink/70">
            lost in the imaginary.
          </p>
          <p className="mt-4 text-[15px] leading-relaxed text-ink/70 max-w-[34ch]">
            Halaman yang kamu cari nggak ada — mungkin belum dibuat, atau sudah
            dihapus karena keisengan.
          </p>
          <TLink
            to="/"
            className="group inline-block mt-8 font-display font-medium text-lg tracking-tight hover:opacity-70 transition-opacity"
          >
            ← balik ke index
          </TLink>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}
