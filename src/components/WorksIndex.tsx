import { useEffect, useRef, useState, type MouseEvent as RMouseEvent } from 'react';
import { WORKS } from '../data/works';
import { useGo } from '../lib/transition';

/**
 * THE INDEX — signature baru v2.2:
 * daftar tipografis raksasa full-width (11 karya). Hover baris → judul
 * menyala + FLOTING PREVIEW (thumbnail warna asli) mengikuti kursor
 * dengan lerp + rotasi mengikuti kecepatan. Klik baris → case study.
 * Mobile: baris ringkas (indeks + judul + tahun), tanpa floating preview.
 */
export default function WorksIndex() {
  const go = useGo();
  const [hover, setHover] = useState<number | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0, active: false });
  const pos = useRef({ x: 0, y: 0, init: false });
  const rot = useRef(0);

  const fine =
    typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* floating preview: lerp ke posisi kursor + rotasi dari kecepatan */
  useEffect(() => {
    if (!fine) return;
    let raf = 0;
    let lastX = 0;
    let lastT = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const m = mouse.current;
      if (!m.active) return;
      if (!pos.current.init) {
        pos.current.x = m.x;
        pos.current.y = m.y;
        pos.current.init = true;
        lastX = m.x;
        lastT = performance.now();
        return;
      }
      if (!reduced) {
        const now = performance.now();
        const dt = Math.max(1, now - lastT);
        const v = (m.x - lastX) / dt;
        const targetRot = Math.max(-9, Math.min(9, v * 5));
        rot.current += (targetRot - rot.current) * 0.12;
        lastX = m.x;
        lastT = now;
        pos.current.x += (m.x - pos.current.x) * 0.14;
        pos.current.y += (m.y - pos.current.y) * 0.14;
      } else {
        pos.current.x = m.x;
        pos.current.y = m.y;
      }
      const el = previewRef.current;
      if (el) {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        let x = pos.current.x + 32;
        let y = pos.current.y - h - 28;
        if (x + w > window.innerWidth - 20) x = pos.current.x - w - 32;
        if (y < 12) y = pos.current.y + 40;
        el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot.current}deg)`;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fine, reduced]);

  const onMove = (e: RMouseEvent) => {
    mouse.current.x = e.clientX;
    mouse.current.y = e.clientY;
    mouse.current.active = true;
  };
  const onLeave = () => {
    mouse.current.active = false;
  };

  const active = hover !== null ? WORKS[hover] : null;

  return (
    <section
      className="relative pt-28 md:pt-44"
      onMouseMove={fine ? onMove : undefined}
      onMouseLeave={fine ? onLeave : undefined}
    >
      <div className="px-5 md:px-10 flex items-end justify-between mb-8 md:mb-14">
        <h2 className="font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(2.6rem,7vw,6.5rem)]">
          Selected
          <br />
          Works
        </h2>
        <p aria-live="polite" className="lbl text-ink/50 pb-1 whitespace-nowrap">
          {active ? (
            <>
              {active.index} <span className="text-ink/30">/ 011</span>
            </>
          ) : (
            '011 — showing all work'
          )}
        </p>
      </div>

      <ul>
        {WORKS.map((w, i) => {
          const on = hover === i;
          return (
            <li key={w.index}>
              <button
                onClick={() => go(`/works/${w.slug}`)}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                aria-label={`${w.title} — ${w.category}, buka case study`}
                className="group w-full text-left px-5 md:px-10 py-3.5 md:py-4 grid grid-cols-[2.6rem_1fr_auto] md:grid-cols-[3.5rem_1fr_auto_4.5rem] items-baseline gap-3 md:gap-6 cursor-pointer"
              >
                <span className={`lbl transition-colors duration-300 ${on ? 'text-ink' : 'text-ink/40'}`}>
                  {w.index}
                </span>
                <span
                  className={`font-display font-bold uppercase tracking-[-0.01em] leading-[0.95] text-[clamp(1.9rem,6.5vw,5.8rem)] transition-all duration-300 ease-out ${
                    on ? 'text-ink translate-x-2 md:translate-x-3' : 'text-ink/50 group-hover:text-ink/90'
                  }`}
                >
                  {w.title}
                </span>
                <span className="hidden md:inline font-serif italic text-[clamp(1rem,1.9vw,1.5rem)] text-ink/55 whitespace-nowrap">
                  {w.category}
                </span>
                <span className={`lbl text-right transition-all duration-300 ${on ? 'text-ink opacity-100' : 'text-ink/40 opacity-70'}`}>
                  {w.year}
                  <span className={`inline-block transition-all duration-300 ${on ? 'translate-x-0.5 opacity-100' : 'opacity-0'}`}>
                    {' '}↗
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="px-5 md:px-10 mt-10 lbl text-ink/35">
        hover = preview · klik = case study
      </p>

      {/* floating preview (desktop) */}
      {fine && (
        <div
          ref={previewRef}
          aria-hidden
          className={`fixed top-0 left-0 z-40 pointer-events-none w-[280px] md:w-[380px] transition-opacity duration-300 ${
            active ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ willChange: 'transform' }}
        >
          <div className="overflow-hidden aspect-[4/3] bg-ink/[0.05]">
            {active && (
              <img
                key={active.index}
                src={active.thumb}
                alt=""
                loading="eager"
                decoding="async"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      )}
    </section>
  );
}
