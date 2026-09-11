import Seo from '../components/Seo';
import WorksHuy from '../components/WorksHuy';

/**
 * HOME = SATU KANVAS (ala HUYMI).
 * Tidak ada section lain: hero tagline, manifesto, say hi, dan footer
 * semua dihapus dari home. Kanvas = WorksHuy (pinned, scroll = ganti
 * proyek). Halaman lainnya (about/contact/journal/case) tetap utuh —
 * diakses lewat header.
 */
export default function Home() {
  return (
    <>
      <Seo />
      <WorksHuy />
    </>
  );
}
