import { useLocation } from 'react-router-dom';
import { isActivePath, useGo } from '../lib/transition';

const LINKS = [
  { to: '/', label: 'work.' },
  { to: '/about', label: 'about.' },
  { to: '/contact', label: 'contact.' },
  { to: '/journal', label: 'journal.' },
];

/**
 * Menu overlay layar penuh (mobile) — IDENTIK di semua halaman, termasuk
 * kanvas home. `work.` di home = kembali ke layar pertama reel; di halaman
 * lain = transisi curtain ke '/'. SELALU ter-mount (visibility CSS) supaya
 * buka-TUTUP bisa dianimasikan: fade root + baris masuk stagger.
 */
export default function MenuOverlay({
  open,
  onClose,
  onHomeTop,
}: {
  open: boolean;
  onClose: () => void;
  onHomeTop?: () => void;
}) {
  const go = useGo();
  const { pathname } = useLocation();

  const nav = (to: string) => {
    onClose();
    if (to === '/' && pathname === '/') {
      (onHomeTop ?? (() => window.scrollTo({ top: 0, behavior: 'smooth' })))();
      return;
    }
    go(to);
  };

  return (
    <div
      className="menu-overlay fixed inset-0 z-[80] bg-paper"
      role="dialog"
      aria-label="Menu"
      aria-hidden={!open}
      data-open={open}
    >
      <div className="menu-row flex items-center justify-between px-6 pt-6" style={{ transitionDelay: open ? '40ms' : '0ms' }}>
        <button
          onClick={onClose}
          aria-label="tutup menu"
          className="cursor-pointer text-[28px] leading-none transition-transform duration-300 hover:rotate-90"
        >
          ×
        </button>
        <p className="font-display text-[15px] font-bold uppercase tracking-[0.05em]">WAH:ANGGAAA</p>
      </div>
      {/* panah "→" = efek HOVER (slide-in), sama seperti menu desktop */}
      <nav className="mt-16 flex flex-col gap-4 px-6 font-serif text-[38px] leading-tight">
        {LINKS.map((m, i) => {
          const active = isActivePath(m.to, pathname);
          return (
            <button
              key={m.to}
              onClick={() => nav(m.to)}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${90 + i * 60}ms` : '0ms' }}
              className={`menu-row menu-item flex cursor-pointer items-center text-left transition-colors ${
                active ? 'text-ink' : 'text-ink/70 hover:text-ink'
              }`}
            >
              <span aria-hidden className="menu-arrow mr-2 inline-block w-7 text-left">
                →
              </span>
              {m.label}
            </button>
          );
        })}
      </nav>
      <div
        className="menu-row absolute right-6 bottom-8 left-6 flex justify-between"
        style={{ transitionDelay: open ? '360ms' : '0ms' }}
      >
        <p className="lbl text-ink/50">[ just for fun ]</p>
        <p className="lbl text-ink/50">working from jakarta</p>
      </div>
    </div>
  );
}
