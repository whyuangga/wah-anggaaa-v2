import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useJakartaTime } from '../hooks/useJakartaTime';
import { isActivePath, useGo } from '../lib/transition';
import MenuOverlay from './MenuOverlay';
import MenuBurger from './MenuBurger';

const LINKS = [
  { to: '/about', label: 'about' },
  { to: '/contact', label: 'contact' },
  { to: '/journal', label: 'journal' },
];

/**
 * Header tipis: desktop = brand kiri, link + jam kanan (TANPA border —
 * hanya bg paper solid yang fade-in saat scroll). Mobile = HAMBURGER di
 * kiri + overlay layar penuh (MenuOverlay) — konsisten dengan kanvas home.
 */
export default function Header() {
  const time = useJakartaTime(false);
  const pathname = useLocation().pathname;
  const go = useGo();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Home = satu kanvas HUYMI — chrome-nya sudah jadi bagian kanvas
  // (wordmark + MENU desktop + hamburger sendiri di WorksHuy).
  if (pathname === '/') return null;

  return (
    <>
      <motion.header
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? 'bg-paper' : 'bg-transparent'
        }`}
      >
        <nav aria-label="Navigasi utama" className="flex items-center justify-between px-5 md:px-10 py-5">
          {/* mobile: hamburger kiri (ala home) */}
          <MenuBurger
            open={menu}
            onToggle={() => setMenu((o) => !o)}
            className="-ml-2 md:hidden"
          />

          <button
            onClick={() => go('/')}
            aria-label="wah:anggaaa — ke halaman index"
            className="hidden font-display font-bold uppercase tracking-[0.05em] text-[13px] leading-none cursor-pointer hover:opacity-70 transition-opacity md:block"
          >
            WAH:ANGGAAA
          </button>

          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => {
              const active = isActivePath(l.to, pathname);
              return (
                <button
                  key={l.to}
                  onClick={() => go(l.to)}
                  aria-current={active ? 'page' : undefined}
                  className={`lbl transition-opacity cursor-pointer ${
                    active ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                  }`}
                >
                  {l.label}
                </button>
              );
            })}
            <p className="lbl uppercase opacity-50">
              jkt — {time}
            </p>
          </div>
          {/* mobile: jam kecil di kanan biar tidak kosong melompong */}
          <p className="lbl text-[10px] uppercase opacity-50 md:hidden">
            [ just for fun ]
          </p>
        </nav>
      </motion.header>

      <MenuOverlay open={menu} onClose={() => setMenu(false)} />
    </>
  );
}
