import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORKS } from '../data/works';
import { useGo } from '../lib/transition';

gsap.registerPlugin(ScrollTrigger);

const N = WORKS.length;
const ITEM = 84; // tinggi item list (px) — harus sama dengan h-[84px] di markup

/** tilt foto per proyek (rotasi kecil ala HUYMI) */
const tilt = (j: number) => (j % 2 === 0 ? -2.2 : 1.8);

/**
 * WORKS — satu layar ala HUYMI (index state):
 * paper, foto proyek di tengah (miring kecil), list semua proyek di kanan
 * (yang aktif menyala), meta kiri tengah, angka NR. raksasa kiri bawah,
 * SCROLL + dua kotak kanan bawah, panah lingkaran = proyek berikutnya.
 *
 * Scroll VERTIKAL bergeser antar proyek: section di-pin (ScrollTrigger),
 * progress 0→1 memetakan indeks 0→10; foto crossfade + drift, list
 * bergulir, angka/meta mengikuti. Snap ke tiap proyek. Keyboard ↑↓←→ jalan
 * saat pinned. Reduced motion: 11 layar statis berurutan (tanpa pin).
 */
export default function WorksHuy() {
  const go = useGo();
  const sectionRef = useRef<HTMLElement>(null);
  const imgRefs = useRef<(HTMLImageElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const fRef = useRef(0);
  const idxRef = useRef(0);
  const [idx, setIdx] = useState(0);
  const hRef = useRef(900);

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const jump = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const p = Math.min(1, Math.max(0, i / (N - 1)));
    window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    hRef.current = stage.clientHeight || window.innerHeight;

    const apply = (f: number) => {
      const h = hRef.current;
      // foto: crossfade + drift vertikal + scale halus
      imgRefs.current.forEach((img, j) => {
        if (!img) return;
        const d = f - j;
        const o = Math.max(0, 1 - Math.abs(d));
        img.style.opacity = o.toFixed(3);
        img.style.visibility = o <= 0.002 ? 'hidden' : 'visible';
        img.style.transform = `translateY(${(-d * 120).toFixed(1)}px) rotate(${tilt(
          j,
        )}deg) scale(${(1 - Math.min(0.08, Math.abs(d) * 0.08)).toFixed(3)})`;
      });
      // list: item aktif selalu di tengah
      if (listRef.current) {
        listRef.current.style.transform = `translateY(${(h / 2 - (f + 0.5) * ITEM).toFixed(
          1,
        )}px)`;
      }
      const i = Math.min(N - 1, Math.max(0, Math.round(f)));
      if (i !== idxRef.current) {
        idxRef.current = i;
        setIdx(i);
      }
    };

    const proxy = { f: 0 };
    const tween = gsap.to(proxy, {
      f: N - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(N - 1) * hRef.current}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // NB: ScrollTrigger `snap` bawaan tidak stabil di setup ini (meleset
        // beberapa langkah) → snap manual via listener scroll-idle di bawah.
        onUpdate: (self) => {
          fRef.current = self.progress * (N - 1);
          apply(fRef.current);
        },
      },
    });
    stRef.current = tween.scrollTrigger as ScrollTrigger;
    apply(0);

    const onKey = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (!st || !st.isActive) return;
      const step = 1 / (N - 1);
      const cur = Math.round(st.progress / step) * step;
      let target: number | null = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown')
        target = Math.min(1, cur + step);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp')
        target = Math.max(0, cur - step);
      if (target === null) return;
      e.preventDefault();
      window.scrollTo({ top: st.start + (st.end - st.start) * target, behavior: 'smooth' });
    };
    const onResize = () => {
      hRef.current = stage.clientHeight || window.innerHeight;
      apply(fRef.current);
      ScrollTrigger.refresh();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    // snap manual: scroll berhenti ±160ms → geser halus ke langkah terdekat
    let idleTimer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        const st = stRef.current;
        if (!st || !st.isActive) return;
        const step = 1 / (N - 1);
        const nearest = Math.min(1, Math.max(0, Math.round(st.progress / step) * step));
        if (Math.abs(nearest - st.progress) > 0.002) {
          window.scrollTo({
            top: st.start + (st.end - st.start) * nearest,
            behavior: 'smooth',
          });
        }
      }, 160);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      window.clearTimeout(idleTimer);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScroll);
      tween.scrollTrigger?.kill();
      tween.kill();
      stRef.current = null;
    };
  }, [reduced]);

  /* ---------- layout satu layar (dipakai mode normal & reduced) ---------- */
  const renderStage = (i: number, animated: boolean) => {
    const wk = WORKS[i];
    return (
      <div className={`relative h-svh overflow-hidden ${animated ? '' : ''}`}>
        {/* kiri atas: teks vertikal */}
        <div className="absolute left-4 top-20 hidden flex-col items-center gap-3 sm:flex md:left-7 md:top-24">
          <span className="lbl text-ink/60" style={{ writingMode: 'vertical-rl' }}>
            portfolio '26
          </span>
          <span className="lbl text-ink/35" style={{ writingMode: 'vertical-rl' }}>
            {N} works — jakarta, id
          </span>
        </div>

        {/* kanan atas */}
        <div className="absolute right-4 top-20 text-right md:right-10 md:top-24">
          <p className="lbl text-ink">[ just for fun ]</p>
          <p className="lbl mt-0.5 text-ink/45">working from jakarta</p>
        </div>

        {/* foto tengah (crossfade stack) */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 w-[min(80vw,470px)] -translate-x-1/2 -translate-y-1/2">
          <div className="relative aspect-video shadow-[0_24px_60px_-28px_rgba(13,13,12,0.4)]">
            {WORKS.map((im, j) => (
              <span key={j} aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${im.blur})` }} />
            ))}
            {WORKS.map((im, j) => (
              <img
                key={im.index}
                ref={
                  animated
                    ? (el) => {
                        imgRefs.current[j] = el;
                      }
                    : undefined
                }
                src={im.thumb}
                alt={im.title}
                loading={j < 3 ? 'eager' : 'lazy'}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
                style={
                  animated
                    ? {
                        opacity: j === 0 ? 1 : 0,
                        visibility: j === 0 ? 'visible' : 'hidden',
                        transform: `rotate(${tilt(0)}deg)`,
                      }
                    : {
                        opacity: j === i ? 1 : 0,
                        visibility: j === i ? 'visible' : 'hidden',
                        transform: `rotate(${tilt(j)}deg)`,
                      }
                }
              />
            ))}
          </div>
        </div>

        {/* link di bawah foto */}
        <div className="absolute left-1/2 top-[calc(50%+132px)] flex -translate-x-1/2 items-center gap-5 md:top-[calc(50%+158px)]">
          <button
            onClick={() => go(`/works/${wk.slug}`)}
            className="lbl cursor-pointer whitespace-nowrap text-ink transition-opacity hover:opacity-60"
          >
            case study →
          </button>
          <a
            href={wk.url}
            target="_blank"
            rel="noopener noreferrer"
            className="lbl whitespace-nowrap text-ink/50 transition-opacity hover:text-ink hover:opacity-100"
          >
            live website ↗
          </a>
        </div>

        {/* list proyek di kanan (reel) */}
        <div className="absolute top-0 right-4 hidden h-full w-[46vw] max-w-[320px] overflow-hidden sm:block md:right-10">
          <div
            ref={animated ? listRef : undefined}
            className="absolute inset-x-0 top-0"
            // mode animated: transform sepenuhnya milik GSAP (jangan style prop
            // yang ikut re-render → bakal menimpa animasi di tengah scrub)
            style={
              animated ? undefined : { transform: `translateY(${(hRef.current / 2 - (i + 0.5) * ITEM).toFixed(0)}px)` }
            }
          >
            {WORKS.map((im, j) => (
              <button
                key={im.index}
                onClick={() => jump(j)}
                className={`block h-[84px] w-full cursor-pointer overflow-hidden text-left ${
                  j === i ? 'opacity-100' : 'opacity-100'
                }`}
                aria-label={`${im.title} — proyek ${im.index}`}
              >
                <p className={`lbl ${j === i ? 'text-ink' : 'text-ink/35'}`}>{im.category}</p>
                <p
                  className={`mt-0.5 font-serif text-[clamp(1.15rem,2.1vw,1.55rem)] leading-tight ${
                    j === i ? 'text-ink' : 'text-ink/40'
                  }`}
                >
                  {im.title}
                </p>
                <p className={`mt-1 text-[10px] leading-[1.3] ${j === i ? 'text-ink/70' : 'text-ink/30'}`}>
                  {im.blurb}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* meta kiri tengah */}
        <div className="absolute top-[42%] left-4 hidden space-y-1.5 md:left-10 md:block">
          {(
            [
              ['role', wk.role],
              ['launching', wk.year],
              ['category', wk.category],
            ] as const
          ).map(([k, v]) => (
            <p key={k} className="lbl flex gap-5">
              <span className="w-20 text-ink/45">{k}</span>
              <span className="text-ink">{v}</span>
            </p>
          ))}
        </div>

        {/* angka NR. raksasa */}
        <div className="absolute bottom-8 left-4 md:bottom-10 md:left-10">
          <p className="lbl mb-1 text-ink/50">nr.</p>
          <p className="flex items-start leading-none">
            <span className="font-display text-[clamp(4.5rem,10vw,8.5rem)] font-bold tracking-[-0.02em]">
              {wk.index}
            </span>
            <span className="mt-3 lbl text-ink/50">/ {String(N).padStart(3, '0')}</span>
          </p>
        </div>

        {/* scroll hint + dua kotak */}
        <p className="absolute bottom-2 left-4 hidden lbl text-ink/40 md:left-10 md:block">scroll ↓</p>
        <div className="absolute right-4 bottom-9 flex items-center gap-1.5 md:right-10">
          <span className="h-2.5 w-2.5 bg-ink" />
          <span className="h-2.5 w-2.5 bg-ink/25" />
        </div>

        {/* panah lingkaran = proyek berikutnya */}
        <button
          onClick={() => jump(Math.min(N - 1, i + 1))}
          aria-label="Proyek berikutnya"
          className="absolute right-4 bottom-24 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full border border-ink/50 text-ink/80 transition-colors hover:bg-ink hover:text-paper md:left-[67%] md:right-auto md:top-[54%] md:bottom-auto md:h-14 md:w-14"
        >
          <span aria-hidden className="text-lg">→</span>
        </button>
      </div>
    );
  };

  /* ---------- reduced motion: 11 layar statis ---------- */
  if (reduced) {
    return (
      <section ref={sectionRef} aria-label="Selected works">
        {WORKS.map((_, j) => (
          <div key={j}>{renderStage(j, false)}</div>
        ))}
      </section>
    );
  }

  /* ---------- mode normal: satu layar, scroll = gonta-ganti proyek ---------- */
  return (
    <section ref={sectionRef} className="relative" aria-label="Selected works — scroll untuk ganti proyek">
      <div ref={stageRef}>{renderStage(idx, true)}</div>
    </section>
  );
}
