# WAH:ANGGAAA — Portfolio

Portfolio satu halaman (+ About, Contact, 11 case study, Jurnal) bertema **terang,
tipografis, dan editorial** — referensi kaviengcreative.com. Isinya 11 karya fiktif:
"taman bermain satu orang": brand khayalan yang digarap serius. Identitas visual:
paper `#EAE8E1` + ink `#0D0D0C`, display condensed raksasa + serif aksen, **tanpa
garis di mana pun**, gambar berwarna penuh, dan signature motion **drag-rail
horizontal**. Intro: text scramble ala terminal. Dibangun sebagai static SPA yang
jalan identik di GitHub Pages maupun Vercel dari codebase yang sama.

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

Layar paper + 4 baris teks **scramble-decode** ala terminal (IBM Plex Mono,
kiri-bawah):

```
> wah-anggaaa :: personal playground
> decoding identity ............ [ok]
> loading 11 imaginary brands .. [ok]
> ready.
```

±1,7 dtk, lalu tirai naik 0,75 dtk membuka hero. Reduced-motion: statis + cepat.

### `/` — Home

1. **Hero** — tagline raksasa 3 baris uppercase (`IMAGINARY BRANDS. / REAL CRAFT. /
   ZERO INVOICES.`) dengan reveal line-mask, role serif italic
   `Designer & Creative Developer`, label `[ just for fun ]` `[ jakarta — wib ]`,
   CTA `say hi ↗` + `[ about ]`.
2. **Selected Works — DRAG RAIL (signature)** — 11 thumbnail warna asli dalam rel
   horizontal full-bleed: drag pointer/touch + inertia, wheel vertical → horizontal,
   keyboard ← →, rubber-band di ujung. Counter `001 / 011` mengikuti posisi (bukan
   bar — aturan tanpa garis). Di bawahnya **indeks 001–011** sinkron dua arah: hover
   indeks → rail geser; rail di tengah → indeks aktif. Klik = buka case study.
3. **Manifesto** — kalimat besar serif italic, opacity **kata-per-kata mengikuti
   scroll** (scrub rAF, mutasi DOM langsung).
4. **Say Hi** — link raksasa full-width, hover shift → `/contact`.
5. **Footer** — `WAH:ANGGAAA` cascade per huruf + wave saat hover, jam WIB live,
   status studio kocak.

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
| Font                 | Self-hosted woff2: **TeXGyreHerosCondensed** (GUST e-foundry) + **Junicode** (Peter S. Baker, OFL) + **IBM Plex Mono** |
| Deploy               | GitHub Pages + Vercel (root) — satu codebase                           |

> Three.js, Lenis, custom cursor, dan menu overlay sudah **dibuang** di redesign v2 —
> motion sekarang 100% transform/opacity di DOM.

---

## Animasi Front-End (Detail)

Semua animasi memakai properti murah-GPU (**transform & opacity saja**), dengan
fallback `prefers-reduced-motion` di setiap bagian.

### 1. Drag rail (`src/components/WorksRail.tsx`)

Mesin custom ringan (tanpa library drag):

- Loop rAF tunggal: `lerp` posisi → `target` (faktor 0.085) + **inertia**
  (velocity dari fling, decay 0.92/frame) + **rubber-band** 48px di ujung.
- Sumber input: pointer drag (pointer capture, `touch-action: pan-y` agar scroll
  vertikal native tetap jalan di mobile), wheel (di-intercept hanya saat rail
  terlihat & tidak di ujung — `preventDefault`), keyboard ← →.
- Sinkron dua arah dengan indeks: hover/focus item indeks → `target = i × stride`
  (rail meluncur ke sana); posisi rail → indeks aktif (dihitung dari stride yang
  diukur dari DOM, jadi responsif).
- Mutasi `style.transform` + state React hanya untuk indeks aktif/counter → 60fps.

### 2. Intro scramble (`src/components/Intro.tsx`)

- Char pool `!<>-_/[]{}—=+*^?#`, resolve kiri→kanan per baris (4 baris, staggered,
  ±1,7 dtk total), `textContent` langsung (tanpa re-render), cursor block blink.
- Selesai → tirai `yPercent: 100 → -100` (0,75 dtk, power2.inOut) → konten mount.
- Reduced motion: teks statis 0,9 dtk, tirai 0,25 dtk.

### 3. Transisi halaman — curtain paper (`src/lib/transition.tsx`)

`TLink` → timeline GSAP: panel paper naik menutup (0,5 dtk) → `navigate()` →
panel turun membuka + konten baru fade-in (0,55 dtk). Back/forward: fade kalem.
Guard `busyRef` anti navigasi ganda. Reduced motion: crossfade 0,12 dtk.

### 4. Reveal & scrub

- **Line-mask** hero/footer: `clip` via overflow-hidden + `y: 112% → 0`, stagger.
- **Manifesto scrub**: loop rAF mengukur `getBoundingClientRect` **live tiap frame**
  (kebal perubahan tinggi viewport oleh toolbar mobile) → opacity per kata
  (0,12 → 1), mutasi `style` langsung.
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
- **3 font, 3 peran** (self-hosted woff2, subset latin):
  - `Heros Cn` (TeXGyreHerosCondensed) — display, headline, nav, body
  - `Junicode Cn` — aksen serif (role, quote, judul jurnal, challenge/outcome)
  - `IBM Plex Mono` — mikro-tekst terminal (intro, counter, label meta, colophon)
- **Larangan permanen**: pill, marquee otomatis, glassmorphism, gradien, cursor
  custom, grayscale/monokrom pada gambar, garis dekoratif.
- Sudut tajam (radius ≤2px), grid 12 kolom, unit `clamp()`.

Referensi pola (inspirasi, bukan tiruan): **kaviengcreative** (struktur, tipografi,
drag-rail), Inspirux (drift), Onoera (ritme intro).

---

## Struktur Proyek

```
├── PLAN.md                  → spesifikasi redesign v2.1 (acuan kerja)
├── public/
│   ├── _redirects           → (cadangan redirect SPA)
│   ├── og.jpg               → preview share 1200×630 (paper + ink)
│   ├── images/works/        → 11 hero + 29 galeri webp + 12 og jpg
│   └── robots.txt + sitemap.xml → SEO (sitemap dibuat saat prebuild)
└── src/
    ├── main.tsx             → entry
    ├── App.tsx              → shell: Intro gate + Header + Routes + TransitionProvider
    ├── index.css            → @font-face, token @theme (paper/ink/font), base, .md-body
    ├── components/
    │   ├── Intro.tsx        → intro terminal scramble + tirai
    │   ├── Header.tsx       → header tipis (tanpa border; bg paper saat scroll)
    │   ├── Footer.tsx       → footer raksasa cascade + wave + jam + status studio
    │   ├── WorksRail.tsx    → drag rail + indeks 001–011 (signature)
    │   └── Seo.tsx          → title/desc/OG kanonis + JSON-LD per route
    ├── routes/
    │   ├── Home.tsx         → hero + drag rail + manifesto + say hi
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
    └── assets/fonts/        → 6 file woff2 self-hosted
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
Font: TeX Gyre Heros (GUST e-foundry, GUST Font License) · Junicode (Peter S. Baker, SIL OFL 1.1) · IBM Plex Mono (IBM, OFL).
