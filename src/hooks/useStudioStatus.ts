import { useEffect, useState } from 'react';

function statusFor(h: number): string {
  if (h >= 5 && h < 8) return 'baru bangun, kopi dulu';
  if (h >= 8 && h < 11) return 'pura-pura sibuk';
  if (h >= 11 && h < 14) return 'prioritas: makan siang';
  if (h >= 14 && h < 17) return 'ngerjain yang beneran';
  if (h >= 17 && h < 19) return 'terjebak macet / mager';
  if (h >= 19 && h < 23) return 'mode iseng: on';
  if (h >= 23 || h < 2) return 'masih ngoprek';
  return 'harusnya tidur';
}

function jakartaHour(): number {
  return Number(
    new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      hour12: false,
      timeZone: 'Asia/Jakarta',
    }).format(new Date()),
  );
}

/** Status studio kocak mengikuti jam Jakarta (dicek tiap 30 detik). */
export function useStudioStatus(): string {
  const [s, setS] = useState(() => statusFor(jakartaHour()));
  useEffect(() => {
    const id = setInterval(() => setS(statusFor(jakartaHour())), 30000);
    return () => clearInterval(id);
  }, []);
  return s;
}
