import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { isActivePath, useGo } from '../lib/transition';

const LINKS = [
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
  { to: '/journal', label: 'journal' },
];

/** Header tipis: brand kiri, link + jam kanan. TANPA border —
    hanya bg paper solid yang fade-in saat scroll. */
export default function Header() {
  const time = useJakartaTime(false);
  const pathname = useLocation().pathname;
  const go = useGo();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Home = satu kanvas HUYMI — header-nya sudah jadi bagian kanvas
  // (wordmark + blok MENU ala HUYMI di WorksHuy). Jangan render di sini.
  if (pathname === '/') return null;

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? 'bg-paper' : 'bg-transparent'
      }`}
    >
      <nav aria-label="Navigasi utama" className="flex items-center justify-between px-5 md:px-10 py-5">
        <button
          onClick={() => go('/')}
          aria-label="wah:anggaaa — ke halaman index"
          className="font-display font-bold uppercase tracking-[0.05em] text-[13px] leading-none cursor-pointer hover:opacity-70 transition-opacity"
        >
          WAH:ANGGAAA
        </button>

        <div className="flex items-center gap-3 md:gap-7">
          {LINKS.map((l) => {
            const active = isActivePath(l.to, pathname);
            return (
              <button
                key={l.to}
                onClick={() => go(l.to)}
                aria-current={active ? 'page' : undefined}
                className={`lbl text-[10px] md:text-[11px] transition-opacity cursor-pointer ${
                  active ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                }`}
              >
                {l.label}
              </button>
            );
          })}
          <p className="hidden md:block lbl uppercase opacity-50">
            jkt — {time}
          </p>
        </div>
      </nav>
    </motion.header>
  );
}
