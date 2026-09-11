import {
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORKS } from '../data/works';
import { useGo } from '../lib/transition';
import MenuOverlay from './MenuOverlay';

gsap.registerPlugin(ScrollTrigger);

const N = WORKS.length;
/** tinggi item list (px) — HARUS sama dengan class `h-[60px] md:h-[84px]` di markup */
const itemH = () =>
  typeof window !== 'undefined' && window.innerWidth < 768 ? 60 : 84;

/* ---------- geometri reel (diukur dari screenshot HUYMI) ---------- */
const LOOPS = 2; // gulungan penuh 0→…→N per putaran (bolak-balik tanpa ujung)
const TOTAL = LOOPS * N; // langkah virtual 0..TOTAL; indeks tampil = round(f) mod N
const SPACING = 0.55; // jarak antar kartu = 0,55 × tinggi stage (screenshot ±0,55vh)
const MAXTILT = 5.5; // derajat kemiringan kartu tetangga (tengah = 0°, melurus saat masuk)
const PEEK = 1.6; // kartu tampil selama |jarak| ≤ PEEK

/** modulo positif */
const mod = (x: number, m: number) => ((x % m) + m) % m;
const wrap = (x: number) => mod(x, N);

/** jarak-signed terdekat kartu j dari posisi virtual f (memutar/looping) */
const dist = (j: number, f: number) => wrap(j - f + N / 2) - N / 2;

/** transform + visibilitas satu kartu reel di posisi f — deterministik per (j, h) */
function slotAt(j: number, f: number, h: number) {
  const d = dist(j, f);
  const rot = -MAXTILT * Math.max(-1, Math.min(1, d));
  return {
    visibility: (Math.abs(d) <= PEEK ? 'visible' : 'hidden') as CSSProperties['visibility'],
    transform: `translateY(${(d * SPACING * h).toFixed(1)}px) rotate(${rot.toFixed(2)}deg)`,
    zIndex: 3 - Math.min(2, Math.round(Math.abs(d))),
  };
}

/**
 * WORKS — satu layar ala HUYMI (index state, LOOPING):
 * paper, foto proyek portrait di tengah (tegak 0°, tetangga ngintip miring
 * ±5,5° dan melurus saat masuk tengah), list semua proyek di kanan, meta
 * kiri tengah, angka NR. raksasa kiri bawah, SCROLL + dua kotak kanan bawah.
 *
 * Scroll VERTIKAL = reel carousel TANPA UJUNG: pemetaan scroll ke indeks
 * virtual 0→(LOOPS×N), semuanya dihitung dengan jarak-modulo — jadi
 * …010 → 011 → 001 → 002 mulus dua arah, list kanan pun tidak pernah
 * bolong di ujung (dirender 3 lipatan). Snap manual ke tiap proyek;
 * keyboard ↑↓←→ saat pinned; klik list = lompat jalur terdekat.
 * INTRO FLING (ala huyml.co): saat mount, reel berputar cepat 2 putaran
 * lalu mengendap di proyek 1 (scrub scroll di-guard selama fling).
 * Mobile: kartu reel diperkecil & digeser kiri, list judul TETAP tampil.
 * Reduced motion: 11 layar statis berurutan (tanpa pin, tanpa loop, tanpa fling).
 */
export default function WorksHuy() {
  const go = useGo();
  const sectionRef = useRef<HTMLElement>(null);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const listRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const fRef = useRef(0); // indeks virtual saat ini (0..TOTAL)
  const idxRef = useRef(0);
  const flingingRef = useRef(false); // intro fling aktif → scrub scroll dibiarkan
  const [idx, setIdx] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const hRef = useRef(900);
  const clipTopRef = useRef(0); // tinggi "clipping" atas reel list (hindari chrome)

  const goTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /** lompat ke proyek i lewat PUTARAN TERDEKAT (tidak pernah rewind jauh) */
  const jump = (i: number) => {
    const st = stRef.current;
    if (!st) return;
    const v = fRef.current;
    const cands: number[] = [];
    for (let c = i; c <= TOTAL; c += N) cands.push(c);
    const k = cands.reduce((a, b) => (Math.abs(b - v) < Math.abs(a - v) ? b : a), i);
    window.scrollTo({ top: st.start + (st.end - st.start) * (k / TOTAL), behavior: 'smooth' });
  };

  useLayoutEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const measure = () => {
      hRef.current = stage.clientHeight || window.innerHeight;
      clipTopRef.current = window.innerWidth >= 768 ? 72 : 0; // md:top-[4.5rem]
    };
    measure();

    const apply = (f: number) => {
      const h = hRef.current;
      const spacing = h * SPACING;
      // foto: reel looping — kartu di posisi JARAK TERDEKAT (modulo N)
      slotRefs.current.forEach((slot, j) => {
        if (!slot) return;
        const t = slotAt(j, f, h);
        slot.style.visibility = t.visibility;
        slot.style.transform = t.transform;
        slot.style.zIndex = String(t.zIndex);
      });
      // list: 4 lipatan WORKS; item aktif (lipatan tengah) selalu di tengah
      if (listRef.current) {
        listRef.current.style.transform = `translateY(${(
          h / 2 -
          clipTopRef.current -
          (f + N + 0.5) * itemH()
        ).toFixed(1)}px)`;
      }
      const i = wrap(Math.round(f));
      if (i !== idxRef.current) {
        idxRef.current = i;
        setIdx(i);
      }
    };

    const proxy = { f: 0 };
    const tween = gsap.to(proxy, {
      f: TOTAL,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${TOTAL * hRef.current}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        // NB: ScrollTrigger `snap` bawaan tidak stabil di setup ini (meleset
        // beberapa langkah) → snap manual via listener scroll-idle di bawah.
        onUpdate: (self) => {
          if (flingingRef.current) return; // fling intro pegang kendali
          fRef.current = self.progress * TOTAL;
          apply(fRef.current);
        },
      },
    });
    stRef.current = tween.scrollTrigger as ScrollTrigger;
    apply(0);

    // INTRO FLING ala HUYMI: begitu konten muncul, reel berputar cepat
    // (2 putaran penuh menyapu semua proyek) lalu mengendap di proyek 001.
    // List & angka ikut berputar karena satu sumbu `apply(f)`.
    const flingObj = { f: TOTAL };
    flingingRef.current = true;
    fRef.current = TOTAL;
    const fling = gsap.to(flingObj, {
      f: 0,
      duration: 1.8,
      delay: 0.1,
      ease: 'power4.out',
      onUpdate: () => apply(flingObj.f),
      onComplete: () => {
        flingingRef.current = false;
        // sinkronkan dengan posisi scroll SESUNGGUHNYA (bukan hardcode 0) —
        // kalau user scroll saat fling, view lanjut dari posisi itu, mulus
        const st = stRef.current;
        apply(st ? st.progress * TOTAL : 0);
      },
    });

    const onKey = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (!st || !st.isActive) return;
      const down = e.key === 'ArrowRight' || e.key === 'ArrowDown';
      const up = e.key === 'ArrowLeft' || e.key === 'ArrowUp';
      if (!down && !up) return;
      e.preventDefault();
      const yFor = (v: number) => st.start + (st.end - st.start) * (v / TOTAL);
      let fv = fRef.current;
      // di ujung range: pindah DULU satu putaran (frame identik — tak terlihat)
      // lalu langkah halus normal; keyboard pun ikut loop tanpa rewind
      if (down && fv >= TOTAL - 0.5) {
        window.scrollTo(0, yFor(fv - N));
        fv -= N;
      } else if (up && fv <= 0.5) {
        window.scrollTo(0, yFor(fv + N));
        fv += N;
      }
      const nv = Math.min(TOTAL, Math.max(0, Math.round(fv) + (down ? 1 : -1)));
      window.scrollTo({ top: yFor(nv), behavior: 'smooth' });
    };
    const onResize = () => {
      measure();
      apply(fRef.current);
      ScrollTrigger.refresh();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);

    // LOOP TANPA UJUNG, dua arah (desktop + mobile):
    // Render di f dan f±N IDENTIK (semua posisi berbasis modulo; list
    // 4 lipatan) → tiap kali menempel batas, posisi digeser persis SATU
    // putaran penuh; pemindahan tak bisa terlihat. Tiga jalur recenter:
    //  a) `scroll` — dasar: unconditional (mobile clamp membuat y == lastY,
    //     guard "arah" versi lama tidak pernah true → itu bug mentok);
    //     puncak: saat tiba dengan scroll MENURUN → maju satu putaran
    //     (scroll-up di y=0 tak mungkin fire event, jadi pakai jalur b/c).
    //  b) `wheel` — di batas, preventDefault + posisi = (batas −/+ loopPx)
    //     + delta ter-clamp; ini yang bikin trackpad/mouse tidak nyangkut,
    //     dan membuat scroll-ATAS dari 001 tembus ke 011.
    //  c) `touchend` — gesture touch tidak bisa di-recenter di tengah
    //     (anchor browser meng-klamp balik), jadi begitu jari angkat:
    //     kalau posisi di batas DAN arah gesek mau keluar → geser 1 putaran.
    // Momentum/fling pasca-touchend ikut di-normalize listener snap idle.
    let lastY = window.scrollY;
    const edge = () => {
      const st = stRef.current;
      if (!st || flingingRef.current) return null;
      return { st, loopPx: (st.end - st.start) / LOOPS };
    };
    const onScrollWrap = () => {
      const e = edge();
      const y = window.scrollY;
      if (e) {
        if (y >= e.st.end - 0.5) {
          window.scrollTo(0, y - e.loopPx);
        } else if (y <= e.st.start + 0.5 && y < lastY) {
          window.scrollTo(0, y + e.loopPx);
        }
      }
      lastY = y;
    };
    window.addEventListener('scroll', onScrollWrap, { passive: true });

    const onWheel = (e: WheelEvent) => {
      const ed = edge();
      if (!ed || !ed.st.isActive) return;
      const d = Math.max(-hRef.current * 0.8, Math.min(e.deltaY, hRef.current * 0.8));
      if (!d) return;
      const y = window.scrollY;
      if (d > 0 && y >= ed.st.end - 1.5) {
        e.preventDefault();
        window.scrollTo(0, ed.st.end - ed.loopPx + d);
      } else if (d < 0 && y <= ed.st.start + 1.5) {
        e.preventDefault();
        window.scrollTo(0, ed.st.start + ed.loopPx + d);
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    let touchAnchor: { y: number } | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) touchAnchor = { y: e.touches[0].clientY };
    };
    const onTouchEnd = (e: TouchEvent) => {
      const ed = edge();
      const a = touchAnchor;
      touchAnchor = null;
      if (!ed || !a) return;
      const endY = e.changedTouches[0]?.clientY ?? a.y;
      const dy = a.y - endY; // >0: jari naik = lanjut ke bawah; <0: sebaliknya
      const y = window.scrollY;
      if (y >= ed.st.end - 1.5 && dy > 0) {
        window.scrollTo(0, y - ed.loopPx);
      } else if (y <= ed.st.start + 1.5 && dy < 0) {
        window.scrollTo(0, y + ed.loopPx);
      }
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    // snap manual: scroll berhenti ±160ms → geser halus ke langkah terdekat
    let idleTimer: number | undefined;
    const onScroll = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(() => {
        const st = stRef.current;
        if (!st || !st.isActive) return;
        const step = 1 / TOTAL;
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
      window.removeEventListener('scroll', onScrollWrap);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      tween.scrollTrigger?.kill();
      tween.kill();
      fling.kill();
      flingingRef.current = false;
      stRef.current = null;
    };
  }, [reduced]);

  /* ---------- layout satu layar (dipakai mode normal & reduced) ---------- */
  const renderStage = (i: number, animated: boolean) => {
    const wk = WORKS[i];
    const hNow = typeof window !== 'undefined' ? window.innerHeight : 900;
    // animated: style awal HARUS konstan antar render (jangan pakai `i` —
    // GSAP yang pegang kendali sesudahnya; string berubah = React menimpa
    // transform di tengah scrub). f0 = 0 untuk semua render animated.
    const f0 = animated ? 0 : i;
    // list mode statis: titik tengah lipatan ke-2
    const listStaticY = (
      hRef.current / 2 -
      (typeof window !== 'undefined' && window.innerWidth >= 768 ? 72 : 0) -
      (i + N + 0.5) * itemH()
    ).toFixed(0);
    return (
      <div className="relative h-svh overflow-hidden">
        {/* kiri atas: teks vertikal */}
        <div className="absolute left-4 top-20 hidden flex-col items-center gap-3 sm:flex md:left-7 md:top-24">
          <span className="lbl text-ink/60" style={{ writingMode: 'vertical-rl' }}>
            portfolio '26
          </span>
          <span className="lbl text-ink/35" style={{ writingMode: 'vertical-rl' }}>
            {N} works — jakarta, id
          </span>
        </div>

        {/* chrome HUYMI — wordmark kiri-atas */}
        <button
          onClick={goTop}
          aria-label="wah:anggaaa — ke atas"
          className="absolute top-6 left-7 z-10 hidden cursor-pointer font-display text-[22px] font-bold uppercase tracking-[0.05em] transition-opacity hover:opacity-70 md:block"
        >
          WAH:ANGGAAA
        </button>

        {/* chrome HUYMI — blok MENU (desktop) */}
        <div className="absolute top-5 left-[8.6rem] z-10 hidden md:top-6 md:left-[12.5rem] md:block">
          <div className="flex items-start gap-3.5">
            <span aria-hidden className="mt-2 block h-11 w-[3px] bg-ink" />
            <div>
              <p className="lbl mb-2.5 text-ink/55">menu</p>
              {/* panah "→" = efek HOVER (slide-in), bukan permanen */}
              <nav className="flex flex-col items-start gap-0.5 font-serif text-[19px] leading-[1.15]">
                {[
                  { label: 'work.', act: () => goTop() },
                  { label: 'about.', act: () => go('/about') },
                  { label: 'contact.', act: () => go('/contact') },
                  { label: 'journal.', act: () => go('/journal') },
                ].map((m) => (
                  <button
                    key={m.label}
                    onClick={m.act}
                    className="menu-item flex cursor-pointer items-center text-ink/55 transition-colors hover:text-ink"
                  >
                    <span aria-hidden className="menu-arrow mr-1.5 inline-block w-4 text-left">
                      →
                    </span>
                    {m.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* chrome HUYMI — hamburger (mobile, di KIRI) */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="buka menu"
          className="absolute top-5 left-5 z-20 flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] md:hidden"
        >
          <span className="h-[2px] w-6 bg-ink" />
          <span className="h-[2px] w-6 bg-ink" />
          <span className="h-[2px] w-6 bg-ink" />
        </button>

        {/* kanan atas (desktop) */}
        <div className="absolute top-7 right-4 hidden text-right md:top-8 md:right-7 md:block">
          <p className="lbl text-ink">[ just for fun ]</p>
          <p className="lbl mt-0.5 text-ink/45">working from jakarta</p>
        </div>

        {/* foto: REEL VERTIKAL LOOPING ala HUYMI — kartu portrait 5:6, aktif
            di tengah tegak 0°, tetangga ngintip miring ±5,5° (melurus saat
            masuk tengah), jarak antar kartu 0,55×tinggi stage; 011 → 001 mulus.
            Mobile: kartu kecil & geser kiri (mr-[38vw]) agar list judul muat */}
        <div className="pointer-events-none absolute inset-y-0 left-0 right-[38vw] md:right-0">
          {WORKS.map((im, j) => {
            const t = slotAt(j, f0, hNow);
            return (
              <div
                key={im.index}
                ref={
                  animated
                    ? (el) => {
                        slotRefs.current[j] = el;
                      }
                    : undefined
                }
                className="absolute inset-0 m-auto h-[28svh] max-w-full aspect-[5/6] md:h-[40svh] md:max-h-[440px] md:max-w-[80vw]"
                style={t}
              >
                {/* kartu AKTIF bisa diklik → case study.
                    pointer-events-auto WAJIB — container reel memakai
                    pointer-events-none dan propertinya ter-inherit */}
                {j === i && (
                  <button
                    onClick={() => go(`/works/${im.slug}`)}
                    aria-label={`buka case study ${im.title}`}
                    className="pointer-events-auto absolute inset-0 z-10 cursor-pointer"
                  />
                )}
                <span
                  aria-hidden
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${im.blur})` }}
                />
                <img
                  src={im.thumb}
                  alt={im.title}
                  loading={j < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover shadow-[0_24px_60px_-28px_rgba(13,13,12,0.4)]"
                />
              </div>
            );
          })}
        </div>

        {/* list proyek di kanan (reel LOOPING) — 4 lipatan WORKS agar item
            tidak pernah bolong saat wrap; atasnya di-clip di bawah chrome
            agar item yang bergulir tidak menabrak teks kanan-atas.
            Mobile: tampil penuh (kartu sudah digeser ke kiri). */}
        <div className="absolute top-0 right-2 bottom-0 z-10 w-[40vw] overflow-hidden md:top-[4.5rem] md:right-10 md:w-[46vw] md:max-w-[320px]">
          <div
            ref={animated ? listRef : undefined}
            className="absolute inset-x-0 top-0"
            // mode animated: transform sepenuhnya milik GSAP (jangan style prop
            // yang ikut re-render → bakal menimpa animasi di tengah scrub)
            style={animated ? undefined : { transform: `translateY(${listStaticY}px)` }}
          >
            {[0, 1, 2, 3].map((copy) =>
              WORKS.map((im, jj) => {
                const j = copy * N + jj;
                const active = jj === i;
                return (
                  <button
                    key={`${copy}-${im.index}`}
                    onClick={() => jump(jj)}
                    className="block h-[60px] w-full cursor-pointer overflow-hidden text-left md:h-[84px]"
                    aria-label={`${im.title} — proyek ${im.index}`}
                  >
                    <p
                      className={`font-display text-[9px] font-normal uppercase leading-[1.6] tracking-[0.16em] md:text-[11px] ${
                        active ? 'text-ink' : 'text-ink/35'
                      }`}
                    >
                      {im.category}
                    </p>
                    <p
                      className={`mt-0.5 font-serif text-[clamp(1rem,4.2vw,1.3rem)] leading-tight md:text-[clamp(1.15rem,2.1vw,1.55rem)] ${
                        active ? 'text-ink' : 'text-ink/40'
                      }`}
                    >
                      {im.title}
                    </p>
                    <p
                      className={`mt-1 hidden text-[10px] leading-[1.3] md:block ${
                        active ? 'text-ink/70' : 'text-ink/30'
                      }`}
                    >
                      {im.blurb}
                    </p>
                  </button>
                );
              }),
            )}
          </div>
        </div>

        {/* meta kiri tengah */}
        <div className="absolute top-[42%] left-4 z-10 hidden space-y-1.5 md:left-10 md:block">
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
        <div className="absolute bottom-8 left-4 z-10 md:bottom-10 md:left-10">
          <p className="lbl mb-1 text-ink/50">nr.</p>
          <p className="flex items-start leading-none">
            <span className="font-display text-[clamp(4.5rem,10vw,8.5rem)] font-bold tracking-[-0.02em]">
              {String(Number(wk.index))}
            </span>
            <span className="mt-3 lbl text-ink/50">/ {N}</span>
          </p>
        </div>

        {/* scroll hint + dua kotak */}
        <p className="absolute bottom-2 left-4 z-10 hidden lbl text-ink/40 md:left-10 md:block">scroll ↓</p>
        <div className="absolute right-4 bottom-9 z-10 flex items-center gap-1.5 md:right-10">
          <span className="h-2.5 w-2.5 bg-ink" />
          <span className="h-2.5 w-2.5 bg-ink/25" />
        </div>

      </div>
    );
  };

  /* ---------- overlay menu (mobile) — komponen shared MenuOverlay ---------- */
  const menuOverlay = (<MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />);
/* ---------- reduced motion: 11 layar statis ---------- */
  if (reduced) {
    return (
      <section ref={sectionRef} aria-label="Selected works">
        {WORKS.map((_, j) => (
          <div key={j}>{renderStage(j, false)}</div>
        ))}
        {menuOverlay}
      </section>
    );
  }

  /* ---------- mode normal: satu layar, scroll = gonta-ganti proyek ---------- */
  return (
    <section ref={sectionRef} className="relative" aria-label="Selected works — scroll untuk ganti proyek (tanpa ujung)">
      <div ref={stageRef}>{renderStage(idx, true)}</div>
      {menuOverlay}
    </section>
  );
}
