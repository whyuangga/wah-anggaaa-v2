import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const POOL = '!<>-_\\/[]{}—=+*^?#________';

type LineSpec = { text: string; delay: number; duration: number };

const LINES: LineSpec[] = [
  { text: 'imaginary brands', delay: 150, duration: 620 },
  { text: 'real craft', delay: 520, duration: 520 },
  { text: 'zero invoices', delay: 880, duration: 620 },
];

const TOTAL = 1850;

/**
 * Intro: tagline ter-decode char-by-char (scramble) di kiri-bawah,
 * lalu tirai naik membuka konten. Reduced motion: statis, cepat.
 */
export default function Intro({ onFinish }: { onFinish: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // mesin scramble per baris
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: number[] = [];
    const rafs: number[] = [];
    LINES.forEach((l, i) => {
      const el = lineRefs.current[i];
      if (!el) return;
      if (reduced) {
        el.textContent = l.text;
        return;
      }
      let start: number | null = null;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min(1, (t - start) / l.duration);
        const solved = Math.floor(p * l.text.length);
        let out = '';
        for (let k = 0; k < l.text.length; k++) {
          if (k < solved || l.text[k] === ' ') out += l.text[k];
          else out += POOL[(Math.random() * POOL.length) | 0];
        }
        el.textContent = out;
        if (p < 1) rafs.push(requestAnimationFrame(step));
        else el.textContent = l.text;
      };
      timers.push(window.setTimeout(() => rafs.push(requestAnimationFrame(step)), l.delay));
    });
    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      rafs.forEach((r) => cancelAnimationFrame(r));
    };
  }, []);

  useEffect(() => {
    if (doneRef.current) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const id = window.setTimeout(
      () => {
        doneRef.current = true;
        setExiting(true);
        const el = ref.current;
        if (!el) return onFinish();
        gsap.to(el, {
          yPercent: -100,
          duration: reduced ? 0.25 : 0.75,
          ease: 'power2.inOut',
          onComplete: onFinish,
        });
      },
      reduced ? 950 : TOTAL,
    );
    return () => window.clearTimeout(id);
  }, [onFinish]);

  return (
    <div
      ref={ref}
      className="fixed inset-0 z-[100] bg-paper flex items-end"
      style={{ willChange: 'transform' }}
      aria-hidden
    >
      <div className="px-5 md:px-10 pb-10 md:pb-14 space-y-1">
        {LINES.map((l, i) => (
          <div key={l.text} className="overflow-hidden">
            <span
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              className="block font-display font-medium tracking-[-0.01em] leading-[1.15] text-[clamp(1.5rem,4.5vw,3.2rem)] text-ink/85"
            >
              {''}
            </span>
          </div>
        ))}
        {!exiting && (
          <span className="mt-4 inline-block w-[0.5em] h-[0.75em] bg-ink/80 animate-pulse" />
        )}
      </div>
    </div>
  );
}
