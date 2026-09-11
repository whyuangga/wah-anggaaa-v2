# WAH:ANGGAAA — Portfolio

Portfolio satu halaman (+ About, Contact, 11 case study, Jurnal) bertema **terang,
tipografis, dan editorial**. Isinya 11 karya fiktif: "taman bermain satu orang":
brand khayalan yang digarap serius. Identitas visual v2.3: paper `#EAE8E1` +
ink `#0D0D0C`, **2 font saja** — display condensed raksasa (Heros Cn) + serif aksen
(Junicode Cn) — **tanpa garis di mana pun**, gambar berwarna penuh. **Home =
satu kanvas ala HUYMI**: foto proyek di tengah (miring kecil), list semua
proyek di kanan (aktif menyala), meta kiri, angka `NR. 001 / 011` raksasa —
**scroll vertikal bergeser antar proyek** (foto crossfade + drift, list
bergulir, snap ke tiap proyek). Halaman lainnya (about/contact/journal/case
study) tetap utuh, diakses via header. Intro: tagline scramble-decode. Dibangun sebagai static SPA yang jalan identik di GitHub Pages
maupun Vercel dari codebase yang sama.

> Status: iseng-iseng, just for fun. Bukan situs open-for-work.

**Live demo**

| Platform     | URL                                              |
| ------------ | ------------------------------------------------ |
| Vercel       | `https://wah-anggaaa.vercel.app`                 |
| GitHub Pages | `https://whyuangga.github.io/wah-anggaaa/`       |

---

## Daftar Isi

- [Fitur per Halaman](#fitur-per-halaman)
- [Tech Stack](#tech-stack)
- [Animasi Front-End (Detail)](#animasi-front-end-detail)
- [Sistem Desain](#sistem-desain)
- [Struktur Proyek](#struktur-proyek)
- [Menjalankan Lokal](#menjalankan-lokal)
- [Build & Deploy](#build--deploy)
- [Kustomisasi Cepat](#kustomisasi-cepat)

---

## Fitur per Halaman

### Intro (setiap refresh)

Layar paper + 3 baris tagline **ter-decode char-by-char** (scramble, Heros,
kiri-bawah):

```
imaginary brands
real craft
zero invoices
```

±1,9 dtk, lalu tirai naik 0,75 dtk membuka hero. Reduced-motion: statis + cepat.

### `/` — Home (SATU KANVAS)

Home sengaja **satu kanvas saja** (ala HUYMI) — tidak ada hero tagline,
manifesto, say hi, atau footer di home. Kanvas = Works index:

- **foto proyek** di tengah, miring ±2°, **crossfade + drift vertikal**
  antar proyek (warna asli penuh)
- **list semua proyek** di kanan (kategori kecil + nama serif + blurb) —
  item aktif menyala, yang lain memudar; list **bergulir** mengikuti scroll
- **meta** kiri tengah (role / launching / category, kolom label:value)
- **angka raksasa** kiri bawah: `nr.` + `001` (Heros bold) + `/ 011`
- kiri atas: teks vertikal `portfolio '26` + `11 works — jakarta, id`
- kanan atas: `[ just for fun ] / working from jakarta`
- kiri bawah: `scroll ↓`; kanan bawah: dua kotak ■ □
- **panah lingkaran** = proyek berikutnya; klik list = lompat proyek;
  keyboard ↑↓←→ saat pinned
- di bawah foto: `case study →` (buka case) + `live website ↗`
- **scroll vertikal = gonta-ganti proyek**: section di-pin (ScrollTrigger,
  `scrub 0.6`, proxy object), **snap manual** saat scroll idle ±160ms.
  Reduced motion: 11 layar statis berurutan, tanpa pin.
- Halaman lain (about/contact/journal/case) tetap ada — via header.

### `/about`

Judul raksasa dua baris masuk dari sisi berlawanan, **foto portrait** (warna asli;
slot `public/images/about-portrait.webp` — placeholder sampai diisi), bio
tipografis, capabilities, recognition (drift konvergen ala Inspirux), colophon
+ kredit font.

### `/contact`

`SAY HI` raksasa + email placeholder `halo@wahanggaaa.id` + sosial placeholder `#`
(hover flip ink/paper) + **generator brand khayalan** (`[ racik lagi ]`, `[ salin ]`)
+ jam WIB live + `[ just for fun ]`.

### `/works/:slug` (11 halaman)

Case study per karya: meta grid (klien/tahun/peran/stack), blurb, tantangan & hasil
(serif italic), proses + galeri **warna asli** (lazy + blur-up), stats ngarang,
visit live site, prev/next.

### `/journal` & `/journal/:slug`

Jurnal markdown (`content/journal/`) — daftar + postingan. Tambah file `.md` dengan
frontmatter = langsung terbit.

### 404

`nyasar.` + `lost in the imaginary.` + link balik.

---

## Tech Stack

| Lapisan              | Teknologi                                                              |
| -------------------- | ---------------------------------------------------------------------- |
| Framework UI         | **React 19** + **TypeScript ~5.8**                                     |
| Build tool           | **Vite 6** (`@vitejs/plugin-react`)                                    |
| Styling              | **Tailwind CSS v4** (via `@tailwindcss/vite`, token di `@theme`)       |
| Routing              | **React Router DOM v7** (basename adaptif mengikuti `BASE_URL`)        |
| Animasi scroll/keyframe | **GSAP 3.15** + **ScrollTrigger**                                   |
| Animasi komponen     | **Motion 12** (`motion/react`: AnimatePresence, whileInView)           |
| SEO / analytics      | **`@vercel/analytics`** + komponen `Seo.tsx` (OG kanonis + JSON-LD)    |
| Font                 | Self-hosted woff2, **2 saja**: **TeXGyreHerosCondensed** (GUST e-foundry) + **Junicode** (Peter S. Baker, OFL) |
| Deploy               | GitHub Pages + Vercel (root) — satu codebase                           |

> Three.js, Lenis, custom cursor, dan menu overlay sudah **dibuang** di redesign v2 —
> motion sekarang 100% transform/opacity di DOM.

---

## Animasi Front-End (Detail)

Semua animasi memakai properti murah-GPU (**transform & opacity saja**), dengan
fallback `prefers-reduced-motion` di setiap bagian.

### 1. Works — index ala HUYMI (`src/components/WorksHuy.tsx`)

- Section 100svh di-**pin** ScrollTrigger (`start: top top`,
  `end: +=(N-1)×viewHeight`, `scrub: 0.6`); tween target = **proxy object**
  `{ f: 0 → N-1 }` — `onUpdate` mengubah gaya DOM langsung (transform
  crossfade foto, translateY list, state React hanya untuk angka/meta/list
  aktif saat `round(f)` berganti).
- **Foto**: 11 `<img>` ditumpuk di tengah; per frame `opacity = 1-|f-j|`,
  `y = -d×120px`, `rotate ±2°` (tilt bergantian), scale halus → crossfade +
  drift ala HUYMI.
- **List reel**: item aktif selalu di tengah (`translateY = h/2 - (f+0.5)×ITEM`);
  **transform list milik GSAP** — tanpa style prop React (re-render React
  bakal menimpa animasi di tengah scrub).
- **Snap manual**: scroll idle ±160ms → `scrollTo smooth` ke langkah terdekat.
  (ScrollTrigger `snap` bawaan di-kill: meleset beberapa langkah di setup ini.)
- Tombol panah, klik list, keyboard = `scrollTo` ke posisi pin per indeks.
- Setup/cleanup di **`useLayoutEffect`** (ScrollTrigger pin mem-wrap section
  dengan `pin-spacer`; kill lewat effect pasif → React gagal `removeChild`).
- Reduced motion: 11 layar statis berurutan (tanpa pin/tween).

### 2. Intro scramble (`src/components/Intro.tsx`)

- Char pool `!<>-_/[]{}—=+*^?#`, resolve kiri→kanan per baris (3 baris, staggered,
  ±1,9 dtk total), `textContent` langsung (tanpa re-render).
- Selesai → tirai `yPercent: 100 → -100` (0,75 dtk, power2.inOut) → konten mount.
- Reduced motion: teks statis 0,95 dtk, tirai 0,25 dtk.

### 3. Transisi halaman — curtain paper (`src/lib/transition.tsx`)

`TLink` → timeline GSAP: panel paper naik menutup (0,5 dtk) → `navigate()` →
panel turun membuka + konten baru fade-in (0,55 dtk). Back/forward: fade kalem.
Guard `busyRef` anti navigasi ganda. Reduced motion: crossfade 0,12 dtk.

### 4. Reveal & scrub

- **Line-mask** (footer, case study): `clip` via overflow-hidden + `y: 112% → 0`,
  stagger.
- **Crossfade works** (home): 11 foto ditumpuk, per frame `opacity = 1-|f-j|`
  + drift `y = -d×120px` + tilt ±2° — mutasi `style` langsung, tanpa re-render
  per frame (state React hanya berganti saat `round(f)` ganti).
- **Drift About** (ala Inspirux): dua baris konvergen `x: ±30% → 0` dengan GSAP
  `matchMedia` + ScrollTrigger scrub.
- **Footer cascade**: huruf naik per huruf saat masuk viewport + wave yoyo saat hover.
- Easing tunggal: `[0.22, 1, 0.36, 1]`.

---

## Sistem Desain

- **2 warna UI**: `--color-paper: #EAE8E1` (bg) dan `--color-ink: #0D0D0C` (teks).
  Hierarki hanya lewat opacity (100/70/45/25/12). **Warna situs hidup dari
  kontennya** — semua gambar karya & portrait warna asli penuh (tanpa grayscale).
- **Tanpa garis (aturan keras)**: nol border/rules/divider/underline — pemisah
  adalah whitespace. Satu-satunya outline: focus ring aksesibilitas.
- **2 font, 2 peran** (self-hosted woff2, subset latin) — **tanpa font mono**:
  - `Heros Cn` (TeXGyreHerosCondensed) — display, headline, nav, body, label kecil (class `.lbl`: uppercase + tracking)
  - `Junicode Cn` — aksen serif (role, quote, kategori, judul jurnal, challenge/outcome, footer)
- **Larangan permanen**: pill, marquee otomatis, glassmorphism, gradien, cursor
  custom, grayscale/monokrom pada gambar, garis dekoratif.
- Sudut tajam (radius ≤2px), grid 12 kolom, unit `clamp()`.

Referensi pola (inspirasi, bukan tiruan): **kaviengcreative** (struktur, tipografi,
drag-rail), Inspirux (drift), Onoera (ritme intro).

---

## Struktur Proyek

```
├── PLAN.md                  → spesifikasi redesign v2.x (acuan kerja)
├── public/
│   ├── _redirects           → (cadangan redirect SPA)
│   ├── og.jpg               → preview share 1200×630 (paper + ink)
│   ├── images/works/        → 11 hero + 29 galeri webp + 12 og jpg
│   └── robots.txt + sitemap.xml → SEO (sitemap dibuat saat prebuild)
└── src/
    ├── main.tsx             → entry
    ├── App.tsx              → shell: Intro gate + Header + Routes + TransitionProvider
    ├── index.css            → @font-face, token @theme (paper/ink/font), base, .lbl, .text-outline, .md-body
    ├── components/
    │   ├── Intro.tsx        → intro terminal scramble + tirai
    │   ├── Header.tsx       → header tipis (tanpa border; bg paper saat scroll)
    │   ├── Footer.tsx       → footer raksasa cascade + wave + jam + status studio
    │   ├── WorksHuy.tsx     → works index ala HUYMI: satu layar, scroll = ganti proyek
    │   └── Seo.tsx          → title/desc/OG kanonis + JSON-LD per route
    ├── routes/
    │   ├── Home.tsx         → SATU KANVAS: hanya <WorksHuy /> (ala HUYMI)
    │   ├── About.tsx        → portrait + bio + capabilities + recognition + colophon
    │   ├── Contact.tsx      → say hi + email + sosial + generator brand
    │   ├── WorkCase.tsx     → case study per karya (/works/:slug)
    │   ├── Journal.tsx      → daftar tulisan
    │   ├── JournalPost.tsx  → isi tulisan
    │   └── NotFound.tsx     → 404 ("nyasar.")
    ├── data/works.ts        → 11 karya: meta + thumb/galeri/blur + story + challenge/outcome + stats
    ├── lib/journal.ts       → loader + parser markdown jurnal
    ├── hooks/
    │   ├── useJakartaTime.ts   → jam WIB live per detik
    │   └── useStudioStatus.ts  → status kocak mengikuti jam Jakarta
    ├── lib/transition.tsx   → TLink + curtain timeline (GSAP)
    └── assets/fonts/        → 4 file woff2 self-hosted (2 family × 2 weight)
```

Tulisan jurnal: `content/journal/*.md` (frontmatter: title/date/desc/tags).

---

## Menjalankan Lokal

```bash
npm install
npm run dev      # http://localhost:3000/wah-anggaaa/ (dev menghormati base)
npm run lint     # tsc --noEmit
npm run build    # vite build + salin dist/index.html → dist/404.html (fallback SPA)
```

> Dev server me-redirect `/` → `/wah-anggaaa/` karena `base` Vite — itu normal.

---

## Build & Deploy

Satu codebase, dua target — dibedakan otomatis oleh `vite.config.ts`:

| Target | `base` | Router basename | Fallback SPA |
| ------ | ------ | --------------- | ------------ |
| GitHub Pages | `/wah-anggaaa/` | otomatis via `BASE_URL` | `dist/404.html` (salinan index) |
| Vercel (`VERCEL=1`) | `/` | otomatis via `BASE_URL` | `vercel.json` rewrites |

- **GitHub Pages**: workflow `.github/workflows/deploy.yml` (build → artifact →
  deploy). Perlu Pages source = "GitHub Actions".
- **Vercel**: import repo → deploy.

---

## Kustomisasi Cepat

| Mau ganti…      | File |
| --------------- | ---- |
| Daftar karya    | `src/data/works.ts` |
| Email & sosial  | `src/data/works.ts` → `CONTACT` |
| Tagline hero    | `src/routes/Home.tsx` → `<h1>` |
| Teks manifesto  | `src/routes/Home.tsx` → `ManifestoScrub text=` |
| Foto portrait   | letakkan `public/images/about-portrait.webp` (4:5) |
| Baris intro     | `src/components/Intro.tsx` → `LINES` |
| Tulisan jurnal  | tambah `content/journal/slug.md` |
| Domain SEO      | `src/components/Seo.tsx` (`SITE_URL`) + `scripts/sitemap.mjs` (`SITE`) |
| Warna / font    | `src/index.css` (`@theme`) |
| Copy about      | `src/routes/About.tsx` |

---

Dibuat iseng-iseng dengan React + GSAP. © 2026 WAH:ANGGAAA.
Font: TeX Gyre Heros (GUST e-foundry, GUST Font License) · Junicode (Peter S. Baker, SIL OFL 1.1).
