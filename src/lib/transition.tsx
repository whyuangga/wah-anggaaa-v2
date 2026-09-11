import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

type GoFn = (to: string) => void;
const GoContext = createContext<GoFn>(() => {});
export const useGo = () => useContext(GoContext);

/** status aktif nav: case study ikut index, postingan ikut journal. */
export function isActivePath(to: string, pathname: string): boolean {
  if (pathname === to) return true;
  if (to === '/' && pathname.startsWith('/works/')) return true;
  if (to === '/journal' && pathname.startsWith('/journal/')) return true;
  return false;
}

/**
 * Transisi halaman = curtain paper: panel naik menutup → swap route →
 * panel turun membuka + konten fade-in. Reduced motion: crossfade cepat.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const busyRef = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);

  // Posisi awal curtain (di bawah layar) harus di-set via GSAP — BUKAN inline
  // style. Inline `translateY(100%)` akan di-flatten GSAP jadi `y: 900px` dan
  // bertumpuk dengan tween yPercent → curtain mentok di posisi "menutup layar"
  // setelah transisi pertama (halaman jadi kertas kosong).
  useLayoutEffect(() => {
    gsap.set(curtainRef.current, { y: 0, yPercent: 100 });
  }, []);

  const go = useCallback<GoFn>(
    (to: string) => {
      if (busyRef.current) return;
      if (to === location.pathname) {
        window.scrollTo(0, 0);
        return;
      }
      busyRef.current = true;
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const el = contentRef.current;
      const curtain = curtainRef.current;

      const finish = () => {
        busyRef.current = false;
        if (el) gsap.set(el, { clearProps: 'opacity,transform' });
      };

      if (reduced || !curtain) {
        const tl = gsap.timeline({ onComplete: finish });
        if (el) tl.to(el, { opacity: 0, duration: 0.12 }, 0);
        tl.add(() => {
          navigate(to);
          window.scrollTo(0, 0);
          requestAnimationFrame(() => ScrollTrigger.refresh());
        });
        if (el) tl.to(el, { opacity: 1, duration: 0.2 }, '+=0.02');
        return;
      }

      // normalisasi transform curtain sebelum timeline (anti-sisa tween)
      gsap.set(curtain, { y: 0, yPercent: 100 });
      const tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(curtain, { yPercent: 100 }, { yPercent: 0, duration: 0.5, ease: 'power2.inOut' }, 0);
      tl.to(el, { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0);
      tl.add(() => {
        navigate(to);
        window.scrollTo(0, 0);
        requestAnimationFrame(() => ScrollTrigger.refresh());
      }, 0.5);
      tl.fromTo(el, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.55, ease: 'power2.out' }, '+=0.04');
      tl.to(curtain, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '<+0.1');
    },
    [location.pathname, navigate],
  );

  // back/forward browser: fade kalem
  useEffect(() => {
    if (busyRef.current) return;
    const el = contentRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el) return;
    if (reduced) {
      gsap.fromTo(el, { opacity: 0.4 }, { opacity: 1, duration: 0.25, onComplete: () => gsap.set(el, { clearProps: 'opacity' }) });
    } else {
      gsap.fromTo(el, { opacity: 0.25 }, { opacity: 1, duration: 0.5, ease: 'power2.out', onComplete: () => gsap.set(el, { clearProps: 'opacity,transform' }) });
    }
  }, [location.pathname]);

  return (
    <GoContext.Provider value={go}>
      <div ref={contentRef} className="relative">
        {children}
      </div>
      <div
        ref={curtainRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[90] bg-paper will-change-transform"
      />
    </GoContext.Provider>
  );
}

type TLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  ariaLabel?: string;
};

/** Link internal yang lewat transisi curtain (tetap <a> untuk semantik). */
export function TLink({ to, children, className, ariaLabel }: TLinkProps) {
  const go = useGo();
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    go(to);
  };
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return (
    <a href={`${base}${to}`} onClick={onClick} className={className} aria-label={ariaLabel}>
      {children}
    </a>
  );
}
