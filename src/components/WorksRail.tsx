import { useCallback, useEffect, useRef, useState, type KeyboardEvent as RKeyboardEvent, type PointerEvent as RPointerEvent } from 'react';
import { WORKS } from '../data/works';
import { useGo } from '../lib/transition';

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/**
 * DRAG RAIL — signature motion ala kaviengcreative:
 * - 11 thumbnail warna asli dalam rel horizontal full-bleed
 * - drag pointer/touch + inertia, wheel vertical → horizontal, keyboard ← →
 * - counter `001 / 011` (bukan bar/line — aturan tanpa garis)
 * - indeks 001–011 di bawah, sinkron dua arah (hover indeks → rail geser)
 */
export default function WorksRail() {
  const go = useGo();
  const sectionRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const xRef = useRef(0); // posisi aktual (px, ke kiri)
  const targetRef = useRef(0); // posisi tujuan
  const velRef = useRef(0); // velocity fling (px/frame)
  const dragRef = useRef<{ pointerId: number; startX: number; startTarget: number } | null>(null);
  const activeIdxRef = useRef(0);
  const [activeIdx, setActiveIdx] = useState(0);
  const [grabbing, setGrabbing] = useState(false);

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** jarak antar sel (diukur dari DOM, responsive). */
  const stride = useCallback((): number => {
    const cells = cellRefs.current;
    if (cells[1] && cells[0]) return cells[1].offsetLeft - cells[0].offsetLeft;
    const el = viewportRef.current;
    if (el) return el.clientWidth * 0.6; // fallback sebelum layout
    return 400;
  }, []);

  const maxScroll = useCallback((): number => {
    const el = viewportRef.current;
    const track = trackRef.current;
    if (!el || !track) return 0;
    return Math.max(0, track.scrollWidth - el.clientWidth);
  }, []);

  /* ---------- loop utama: lerp + inertia + rubber band + counter ---------- */
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const track = trackRef.current;
      const el = viewportRef.current;
      if (!track || !el) return;
      const max = maxScroll();

      if (!dragRef.current) {
        // inertia meluncur
        targetRef.current += velRef.current;
        if (!reduced) {
          velRef.current *= 0.92;
          if (Math.abs(velRef.current) < 0.4) velRef.current = 0;
        } else {
          velRef.current = 0;
        }
        // rubber band ringan di ujung
        if (targetRef.current < 0) targetRef.current = Math.max(-48, targetRef.current * 0.8);
        if (targetRef.current > max) targetRef.current = max + Math.min(48, (targetRef.current - max) * 0.35);
        targetRef.current = clamp(targetRef.current, 0, max);
      }

      const cur = xRef.current;
      const next = reduced
        ? targetRef.current
        : cur + (targetRef.current - cur) * 0.085;
      if (Math.abs(next - cur) > 0.15) {
        xRef.current = next;
        track.style.transform = `translate3d(${-next}px,0,0)`;
        const s = stride();
        if (s > 0) {
          const idx = clamp(Math.round(next / s), 0, WORKS.length - 1);
          if (idx !== activeIdxRef.current) {
            activeIdxRef.current = idx;
            setActiveIdx(idx);
          }
        }
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, maxScroll, stride]);

  /* ---------- wheel: vertical → horizontal (hanya saat rail terlihat) ---------- */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const max = maxScroll();
      const atStart = xRef.current <= 1 && e.deltaY < 0;
      const atEnd = xRef.current >= max - 1 && e.deltaY > 0;
      if (atStart || atEnd) return; // biarkan halaman scroll normal
      e.preventDefault();
      velRef.current = 0;
      targetRef.current = clamp(targetRef.current + e.deltaY * 0.9, 0, max);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [maxScroll]);

  /* ---------- pointer: drag + fling ---------- */
  const onPointerDown = (e: RPointerEvent) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    dragRef.current = { pointerId: e.pointerId, startX: e.clientX, startTarget: targetRef.current };
    velRef.current = 0;
    setGrabbing(true);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: RPointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    targetRef.current = clamp(d.startTarget - dx, -48, maxScroll() + 48);
    xRef.current = targetRef.current; // langsung tangani saat drag
    const track = trackRef.current;
    if (track) track.style.transform = `translate3d(${-xRef.current}px,0,0)`;
  };

  const lastVelRef = useRef({ x: 0, t: 0 });
  const onPointerUp = (e: RPointerEvent) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    dragRef.current = null;
    setGrabbing(false);
    const now = performance.now();
    const lt = lastVelRef.current;
    if (now - lt.t < 80) {
      const v = ((lt.x - e.clientX) / Math.max(1, now - lt.t)) * 16.7;
      if (!reduced) velRef.current = clamp(v, -60, 60);
    }
    lastVelRef.current = { x: e.clientX, t: now };
  };

  const onPointerMoveVel = (e: RPointerEvent) => {
    const now = performance.now();
    const lt = lastVelRef.current;
    if (now - lt.t > 16) lastVelRef.current = { x: e.clientX, t: now };
  };

  /* ---------- keyboard ---------- */
  const onKeyDown = (e: RKeyboardEvent) => {
    const s = stride();
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      velRef.current = 0;
      targetRef.current = clamp(targetRef.current + s, 0, maxScroll());
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      velRef.current = 0;
      targetRef.current = clamp(targetRef.current - s, 0, maxScroll());
    }
  };

  /* ---------- indeks → rail ---------- */
  const jumpTo = (i: number) => {
    velRef.current = 0;
    targetRef.current = clamp(i * stride(), 0, maxScroll());
  };

  const open = (i: number) => go(`/works/${WORKS[i].slug}`);

  return (
    <section ref={sectionRef} className="relative pt-28 md:pt-40 overflow-hidden">
      <div className="px-5 md:px-10 flex items-end justify-between mb-8 md:mb-12">
        <h2 className="font-display font-bold uppercase tracking-[-0.015em] leading-[0.88] text-[clamp(2.6rem,7vw,6.5rem)]">
          Selected
          <br />
          Works
        </h2>
        <div className="text-right pb-1">
          <p aria-live="polite" className="font-mono text-[13px] tracking-[0.14em]">
            {String(activeIdx + 1).padStart(3, '0')} <span className="text-ink/35">/ 011</span>
          </p>
          <p className="mt-2 hidden md:block font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40">
            scroll → · drag to shift
          </p>
        </div>
      </div>

      {/* viewport rail */}
      <div
        ref={viewportRef}
        className={`overflow-hidden select-none ${grabbing ? 'cursor-grabbing' : 'cursor-grab'}`}
        style={{ touchAction: 'pan-y' }}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => {
          onPointerMove(e);
          onPointerMoveVel(e);
        }}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div ref={trackRef} className="flex gap-5 md:gap-8 pr-5 md:pr-[max(20px,calc(4vw-40px))] will-change-transform">
          {WORKS.map((w, i) => (
            <button
              key={w.index}
              ref={(el) => {
                cellRefs.current[i] = el;
              }}
              onClick={() => {
                if (Math.abs(xRef.current - clamp(i * stride(), 0, maxScroll())) < 4) open(i);
                else jumpTo(i);
              }}
              aria-label={`${w.title} — ${w.category}`}
              className="group shrink-0 text-left"
              style={{ width: 'clamp(250px, 42vw, 560px)' }}
            >
              <span className="relative block overflow-hidden aspect-[4/3] bg-ink/[0.045]">
                <span
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center scale-105"
                  style={{ backgroundImage: `url(${w.blur})` }}
                />
                <img
                  src={w.thumb}
                  alt={w.title}
                  loading={i < 2 ? 'eager' : 'lazy'}
                  decoding="async"
                  onLoad={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  className={`relative w-full h-full object-cover opacity-0 transition-[opacity,transform] duration-700 ease-out group-hover:scale-[1.04] ${
                    activeIdx === i ? '' : ''
                  }`}
                />
                <span className="absolute top-2.5 left-2.5 font-mono text-[10px] tracking-[0.14em] text-ink/70">
                  {w.index}
                </span>
              </span>
              <span className="flex items-baseline justify-between gap-3 mt-3">
                <span
                  className={`font-display font-medium tracking-tight text-[15px] md:text-[17px] leading-tight transition-opacity duration-300 ${
                    activeIdx === i ? 'opacity-100' : 'opacity-45 group-hover:opacity-80'
                  }`}
                >
                  {w.title}
                </span>
                <span className="hidden sm:block font-mono text-[9px] uppercase tracking-[0.16em] text-ink/35 text-right">
                  {w.category}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* indeks 001–011 — dipisah jarak, tanpa garis */}
      <div className="px-5 md:px-10 mt-12 md:mt-20">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink/40 mb-6">
          [ 011 — Showing all work ]
        </p>
        <div className="grid sm:grid-cols-2 gap-x-10 md:gap-x-16 gap-y-2 max-w-5xl">
          {WORKS.map((w, i) => {
            const on = activeIdx === i;
            return (
              <button
                key={w.index}
                onMouseEnter={() => jumpTo(i)}
                onFocus={() => jumpTo(i)}
                onClick={() => open(i)}
                aria-pressed={on}
                className={`group flex items-baseline gap-3 py-1.5 text-left transition-all duration-300 cursor-pointer ${
                  on ? 'opacity-100 translate-x-1.5' : 'opacity-45 hover:opacity-80'
                }`}
              >
                <span className={`font-mono text-[10px] tracking-[0.12em] ${on ? 'text-ink' : 'text-ink/50'}`}>
                  {w.index}
                </span>
                <span className="font-display font-medium tracking-tight text-[15px] md:text-[16px] leading-snug">
                  {w.title}
                </span>
                <span className="ml-auto hidden md:block font-mono text-[9px] uppercase tracking-[0.16em] text-ink/40">
                  {w.category} · {w.year}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-ink/35 md:hidden">
          tap judul = buka · swipe gambar = geser
        </p>
      </div>

      {/* fokus keyboard */}
      <div className="sr-only" tabIndex={0} onKeyDown={onKeyDown} aria-label="Galeri karya — gunakan panah kiri/kanan" />
    </section>
  );
}
