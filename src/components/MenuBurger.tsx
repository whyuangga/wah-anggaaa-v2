interface Props {
  open: boolean;
  onToggle: () => void;
  className?: string;
}

/**
 * Tombol hamburger (mobile) — tiga garis yang BERANI MASUK jadi ✕ saat
 * menu terbuka: garis atas/bawah berputar ±45°, tengah memudar. Dipakai
 * Header (semua halaman) dan chrome home (WorksHuy).
 */
export default function MenuBurger({ open, onToggle, className = '' }: Props) {
  return (
    <button
      onClick={onToggle}
      data-open={open}
      aria-label={open ? 'tutup menu' : 'buka menu'}
      aria-expanded={open}
      className={`flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] ${className}`}
    >
      <span className="burger-line h-[2px] w-6 bg-ink" />
      <span className="burger-line h-[2px] w-6 bg-ink" />
      <span className="burger-line h-[2px] w-6 bg-ink" />
    </button>
  );
}
