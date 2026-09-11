import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const POOL = '!<>-_\\/[]{}—=+*^?#________';

const LINES: LineSpec[] = [
  { text: '> wah-anggaaa :: personal playground', delay: 200, duration: 550 },
  { text: '> decoding identity ............ [ok]', delay: 620, duration: 550 },
  { text: '> loading 11 imaginary brands .. [ok]', delay: 1040, duration: 550 },
  { text: '> ready.', delay: 1460, duration: 380 },
];

const TOTAL = 2100;

type LineSpec = { text: string; delay: number; duration: number };

/** Satu baris teks yang ter-decode char-by-char (efek terminal). */
function ScrambleLine({ text, delay, duration }: LineSpec) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.textContent = text;
      return;
    }
    let raf = 0;
    let start: number | null = null;
    const step = (t: number) => {
      if (start === null) start = t;
      const p = Math.min(1, (t - start) / duration);
      const solved = Math.floor(p * text.length);
      let out = '';
      for (let i = 0; i < text.length; i++) {
        if (i < solved || text[i] === ' ') out += text[i];
        else out += POOL[(Math.random() * POOL.length) | 0];
      }
      el.textContent = out;
      if (p < 1) raf = requestAnimationFrame(step);
      else el.textContent = text;
    };
    const id = window.setTimeout(() => {
      raf = requestAnimationFrame(step);
    }, delay);
    return () => {
      window.clearTimeout(id);
      cancelAnimationFrame(raf);
    };
  }, [text, delay, duration]);

  return (
    <span className="block whitespace-pre">
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden>
        {''}
      </span>
    </span>
  );
}

/**
 * Intro terminal: layar paper + 4 baris teks scramble di kiri-bawah,
 * lalu tirai naik membuka konten. Reduced motion: statis, cepat.
 */
export default function Intro({ onFinish }: { onFinish: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  // kunci scroll selama intro
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
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
        if (reduced) {
          gsap.to(el, { yPercent: -100, duration: 0.25, ease: 'power2.inOut', onComplete: onFinish });
          return;
        }
        gsap.to(el, { yPercent: -100, duration: 0.75, ease: 'power2.inOut', onComplete: onFinish });
      },
      reduced ? 900 : TOTAL,
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
      <div className="px-5 md:px-10 pb-8 md:pb-12 font-mono text-[12px] leading-[1.9] tracking-[0.04em] text-ink/85">
        {LINES.map((l) => (
          <span key={l.text} className="block">
            <ScrambleLine text={l.text} delay={l.delay} duration={l.duration} />
          </span>
        ))}
        {!exiting && (
          <span className="inline-block w-[0.55em] h-[1.05em] bg-ink/80 align-text-bottom animate-pulse" />
        )}
      </div>
    </div>
  );
}
