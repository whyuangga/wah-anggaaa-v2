import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Footer from '../components/Footer';
import Seo from '../components/Seo';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { CONTACT } from '../data/works';

const EASE = [0.22, 1, 0.36, 1] as const;

const GEN_A = ['Lex', 'Vel', 'Mor', 'Sol', 'Nov', 'Aer', 'Ony', 'Lum', 'Kas', 'Zen', 'Bru', 'Fal', 'Ond', 'Pra', 'Ves', 'Kir', 'Hal', 'Rou', 'Sel', 'Tan', 'Dra', 'Mir', 'Fen', 'Gal', 'Yor', 'Bel', 'Cor', 'Del', 'Esk', 'Fra', 'Gre', 'Hes', 'Jol', 'Kru', 'Lor', 'Mel', 'Ner', 'Osk', 'Pel', 'Quin'];
const GEN_B = ['avia', 'oria', 'enne', 'essa', 'ova', 'elle', 'issa', 'una', 'ique', 'ora', 'isia', 'ara', 'onne', 'ille', 'usia', 'erre', 'anda', 'ilia', 'ossa', 'urra', 'aria', 'elia', 'inoa', 'ozia', 'ulia', 'emma', 'iva', 'odia', 'amara', 'elora', 'isolde', 'ovia', 'umbra', 'axia', 'evara', 'olia', 'indra', 'orca', 'yuki', 'ozma'];
const GEN_SUF = ['', '', '', '®', ' co.', ' supply', ' club', ' studio', '™', ' & co.', ' lab', ' goods', ' works', ' society'];
const GEN_CAT = ['parfum fiktif', 'kopi imajiner', 'jam khayalan', 'galeri hantu', 'hotel mimpi', 'roti khayal', 'sneakers astral', 'teh gaib', 'bengkel angkasa', 'toko rindu', 'sirkus mini', 'studio hujan', 'cokelat mimpi', 'mie khayal', 'sepatu awan', 'payung badai', 'radio rindu', 'perpustakaan hantu', 'biro jodoh alien', 'jamu modern', 'soto terbang', 'barbershop kilat', 'florist malam', 'planetarium keliling'];

function racik() {
  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
  return { name: pick(GEN_A) + pick(GEN_B) + pick(GEN_SUF), cat: pick(GEN_CAT) };
}

function BrandGenerator() {
  const [brand, setBrand] = useState(racik);
  const [copied, setCopied] = useState(false);
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const again = () => {
    setBrand(racik());
    setCopied(false);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${brand.name} — ${brand.cat}`);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard tak tersedia — abaikan */
    }
  };

  return (
    <div className="mt-16 md:mt-24 pt-10">
      <p className="lbl text-ink/60">
        [ brand khayalan hari ini ]
      </p>
      <p className="mt-4 text-[15px] text-ink/60 max-w-[42ch] leading-relaxed">
        Belum punya brand fiktif sendiri? Pencet tombolnya — gratis, tanpa syarat,
        tanpa masa depan.
      </p>
      <div className="mt-8 min-h-[7rem] md:min-h-[9rem]">
        <AnimatePresence mode="wait">
          <motion.div
            key={brand.name}
            initial={reduced ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduced ? undefined : { opacity: 0, y: -18 }}
            transition={{ duration: 0.45, ease: [...EASE] }}
          >
            <p className="font-display font-bold uppercase tracking-[-0.01em] leading-[0.95] text-[clamp(2.2rem,7vw,4.5rem)]">
              {brand.name}
            </p>
            <p className="mt-3 lbl text-ink/45">— {brand.cat}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-6 flex items-center gap-6 lbl">
        <button onClick={again} className="text-ink/70 hover:text-ink transition-colors cursor-pointer">
          [ racik lagi ]
        </button>
        <button onClick={copy} className="text-ink/50 hover:text-ink transition-colors cursor-pointer">
          {copied ? '[ tersalin ✓ ]' : '[ salin ]'}
        </button>
      </div>
    </div>
  );
}

export default function Contact() {
  const time = useJakartaTime();

  return (
    <>
      <Seo title="kontak" path="/contact" />
      <section className="px-5 md:px-10 pt-32 md:pt-44 min-h-[80svh]">
        <p className="lbl text-ink/60">[ contact ]</p>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6, ease: [...EASE] }}
          className="mt-8 font-display font-bold uppercase tracking-[-0.015em] leading-[0.84] text-[clamp(3.6rem,16vw,15rem)]"
        >
          say hi<span className="text-ink/30">.</span>
        </motion.h1>

        <motion.a
          href={`mailto:${CONTACT.email}`}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [...EASE] }}
          className="group inline-block mt-10 md:mt-14 md:ml-[24vw] font-display font-medium tracking-tight text-[clamp(1.4rem,4vw,3rem)] hover:opacity-60 transition-opacity"
        >
          {CONTACT.email}
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"> ↗</span>
        </motion.a>

        {/* sosial — flip warna saat hover, tanpa garis */}
        <div className="mt-16 md:mt-24">
          {CONTACT.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group grid grid-cols-[1fr_auto] items-center gap-4 py-5 px-1 md:px-3 -mx-1 md:-mx-3 transition-colors duration-300 hover:bg-ink hover:text-paper"
            >
              <span className="font-display font-medium uppercase tracking-tight text-2xl md:text-4xl">
                {s.label}
              </span>
              <span className="lbl opacity-40 group-hover:opacity-70 transition-opacity">
                ↗
              </span>
            </a>
          ))}
        </div>

        <BrandGenerator />

        <div className="mt-12 flex flex-col md:flex-row justify-between gap-3 lbl text-ink/50">
          <p>iseng-iseng welcome — no brief, no deadline, no drama</p>
          <p>
            based in jakarta (utc+7) — {time} wib <span className="text-ink/30">[ just for fun ]</span>
          </p>
        </div>
      </section>

      <Footer />
    </>
  );
}
