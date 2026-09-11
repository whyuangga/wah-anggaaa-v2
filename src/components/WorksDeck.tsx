import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { WORKS } from '../data/works';
import { useGo } from '../lib/transition';

gsap.registerPlugin(ScrollTrigger);

const N = WORKS.length;

/**
 * WORKS DECK — carousel ala HUYMI:
 * - section 100svh di-PIN; scroll vertikal → geser horizontal (GSAP scrub)
 * - tiap slide: foto karya FULL-BLEED (warna asli) + teks mix-blend-difference
 *   (putih → auto-invert, terbaca di foto terang maupun gelap)
 * - judul SERIF RAKSASA di bawah tengah; prev/next di pojok; counter raksasa
 * - navigasi: scroll, tombol prev/next, keyboard ← → (saat pinned)
 * - reduced motion: fallback horizontal scroll-snap (tanpa pin)
 */
export default function WorksDeck() {
  const go = useGo();
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const stRef = useRef<ScrollTrigger | null>(null);
  const activeRef = useRef(0);

  const reduced =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // useLayoutEffect (bukan useEffect): cleanup-nya harus jalan SEBELUM React
  // menghapus DOM saat pindah halaman — ScrollTrigger pin mem-wrap section
  // dengan pin-spacer; kalau di-kill belakangan, React gagal removeChild.
  useLayoutEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    const section = sectionRef.current;
    if (!track || !section) return;

    const goToIndex = (i: number) => {
      const st = stRef.current;
      if (!st) return;
      const p = Math.min(1, Math.max(0, i / (N - 1)));
      window.scrollTo({ top: st.start + (st.end - st.start) * p, behavior: 'smooth' });
    };

    const tween = gsap.to(track, {
      x: () => `-${(N - 1) * window.innerWidth}px`,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${(N - 1) * window.innerWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const i = Math.min(N - 1, Math.max(0, Math.round(self.progress * (N - 1))));
          activeRef.current = i;
        },
      },
    });
    stRef.current = tween.scrollTrigger as ScrollTrigger;

    const onKey = (e: KeyboardEvent) => {
      const st = stRef.current;
      if (!st || !st.isActive) return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goToIndex(activeRef.current + 1);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goToIndex(activeRef.current - 1);
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      tween.scrollTrigger?.kill();
      tween.kill();
      stRef.current = null;
    };
  }, [reduced]);

  return (
    <section ref={sectionRef} className="relative" aria-label="Selected works — carousel">
      <div
        className={`h-svh overflow-hidden ${
          reduced ? 'overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]' : ''
        }`}
      >
        <div
          ref={trackRef}
          className={`flex h-full ${reduced ? 'snap-x snap-mandatory' : 'will-change-transform'}`}
        >
          {WORKS.map((wk, i) => {
            const prevWk = WORKS[(i - 1 + N) % N];
            const nextWk = WORKS[(i + 1) % N];
            return (
            <article
              key={wk.index}
              className="relative h-full w-screen shrink-0 snap-start overflow-hidden bg-ink/20"
            >
              {/* foto full-bleed, warna asli */}
              <span
                aria-hidden
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${wk.blur})` }}
              />
              <img
                src={wk.thumb}
                alt={wk.title}
                loading={i < 2 ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={(e) => {
                  e.currentTarget.style.opacity = '1';
                }}
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700"
              />
              {/* dim flat (bukan gradient) → teks difference tetap netral-ink di foto terang */}
              <span aria-hidden className="absolute inset-0 bg-ink/[0.3]" />

              {/* teks di atas foto: putih + difference → auto-invert */}
              <div className="absolute inset-0 mix-blend-difference text-white">
                {/* top kiri: meta */}
                <div className="absolute left-5 top-[4.4rem] max-w-[60vw] md:left-10 md:top-[5.4rem]">
                  <p className="lbl text-white/70">case {wk.index} — {wk.year}</p>
                  <p className="mt-2 text-[13px] font-medium tracking-tight text-white/90 md:text-[14px]">
                    {wk.role} · {wk.stack.join(' / ')}
                  </p>
                  <a
                    href={wk.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="lbl mt-3 inline-block text-white/80 transition-opacity hover:text-white"
                  >
                    live website →
                  </a>
                </div>

                {/* top kanan */}
                <div className="absolute right-5 top-[4.4rem] hidden text-right sm:block md:right-10 md:top-[5.4rem]">
                  <p className="lbl text-white/70">[ just for fun ]</p>
                  <p className="lbl mt-1 text-white/50">working from jakarta</p>
                </div>

                {/* ticks progress (tengah atas) */}
                <div className="absolute left-1/2 top-[4.9rem] flex -translate-x-1/2 items-center gap-1.5 md:top-[5.8rem]">
                  {WORKS.map((_, k) => (
                    <span
                      key={k}
                      className={`w-[3px] transition-all duration-300 ${
                        k === i ? 'h-4 bg-white' : 'h-2 bg-white/35'
                      }`}
                    />
                  ))}
                </div>

                {/* counter raksasa (kiri bawah) */}
                <div className="absolute bottom-4 left-5 md:bottom-8 md:left-10">
                  <p className="leading-none">
                    <span className="font-display text-[clamp(2.6rem,6.5vw,5.5rem)] font-bold">
                      {wk.index}
                    </span>
                    <span className="lbl align-top text-white/60"> / {String(N).padStart(3, '0')}</span>
                  </p>
                  <p className="lbl mt-2 hidden text-white/50 md:block">scroll →</p>
                </div>

                {/* prev / next (pojok kiri-kanan atas counter) */}
                <button
                  onClick={() => {
                    const st = stRef.current;
                    if (!st) return;
                    const idx = (i - 1 + N) % N;
                    window.scrollTo({
                      top: st.start + (st.end - st.start) * (idx / (N - 1)),
                      behavior: 'smooth',
                    });
                  }}
                  className="group absolute left-5 bottom-[8.5rem] hidden cursor-pointer text-left lbl text-white/60 lg:block md:left-10 md:bottom-[9.5rem]"
                  aria-label={`Karya sebelumnya: ${prevWk.title}`}
                >
                  <span className="block text-white/50 transition-colors group-hover:text-white/90">← prev</span>
                  <span className="mt-1 block text-[13px] font-medium tracking-tight text-white/90">
                    {prevWk.title}
                  </span>
                </button>
                <button
                  onClick={() => {
                    const st = stRef.current;
                    if (!st) return;
                    const idx = (i + 1) % N;
                    window.scrollTo({
                      top: st.start + (st.end - st.start) * (idx / (N - 1)),
                      behavior: 'smooth',
                    });
                  }}
                  className="group absolute right-5 bottom-[8.5rem] hidden cursor-pointer text-right lbl text-white/60 lg:block md:right-10 md:bottom-[9.5rem]"
                  aria-label={`Karya berikutnya: ${nextWk.title}`}
                >
                  <span className="block text-white/50 transition-colors group-hover:text-white/90">next →</span>
                  <span className="mt-1 block text-[13px] font-medium tracking-tight text-white/90">
                    {nextWk.title}
                  </span>
                </button>

                {/* judul serif raksasa (tengah bawah) */}
                <div className="absolute inset-x-0 bottom-20 flex justify-center px-5 md:bottom-8">
                  <div className="max-w-full text-center">
                    <button
                      onClick={() => go(`/works/${wk.slug}`)}
                      className="font-serif text-[clamp(1.9rem,7.5vw,7rem)] leading-[0.95] transition-opacity hover:opacity-70 cursor-pointer"
                      aria-label={`${wk.title} — buka case study`}
                    >
                      {wk.title}
                    </button>
                    <p className="lbl mt-2 text-white/70 md:mt-3">
                      {wk.category} — {wk.year}
                    </p>
                    <button
                      onClick={() => go(`/works/${wk.slug}`)}
                      className="lbl mt-3 hidden cursor-pointer text-white/80 transition-opacity hover:text-white md:inline-block"
                    >
                      view case study →
                    </button>
                  </div>
                </div>
              </div>
            </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
