# WAH:ANGGAAA — Portfolio

> ## 🚨 ATURAN KERAS untuk AI/agen yang bekerja di repo ini
> **WAJIB dibaca sebelum melakukan apa pun. Melanggar aturan ini = mengulang insiden 12 Sep 2026 yang membuat owner sangat keberatan.**
>
> 1. **JANGAN PERNAH menyentuh repository `whyuangga/wah-anggaaa` (v1).**
>    Tidak boleh push/commit/mirror kode, membuat/menghapus branch, mengubah
>    setting GitHub Pages atau Vercel, maupun operasi apa pun di repo itu.
>    Repo v1 adalah arsip **versi dark mode** milik owner.
> 2. **Deployment Vercel (`https://wah-anggaaa.vercel.app`) harus selalu sama
>    versinya dengan branch `main` repository ini (`wah-anggaaa-v2`).**
>    - ✅ Cara BENAR: owner menghubungkan project Vercel ke `wah-anggaaa-v2`
>      via dashboard Vercel (Settings → Git → Connected Repository), atau
>      deploy memakai Vercel token yang diberikan owner secara eksplisit.
>    - ❌ Cara DILARANG: menyalin/memirror kode ke repo v1 supaya Vercel
>      "menjadi sama" — itu sama dengan menyentuh v1 (pelanggaran aturan 1).
>    - Status per 2026-09-12: project Vercel repo ini adalah
>      `wah-anggaaa-v2.vercel.app` (auto-deploy dari `main` — inilah yang
>      harus selalu setara main). Adapun `wah-anggaaa.vercel.app` terhubung
>      ke repo v1 dan menyajikan v1 (dark) **secara sengaja** sampai owner
>      me-relink. JANGAN "memperbaiki" ketidaksesuaian ini lewat repo v1.
> 3. **Deployment resmi v2**: `https://whyuangga.github.io/wah-anggaaa-v2/`
>    (branch `gh-pages`, build base `/wah-anggaaa-v2/`). Untuk otomasi
>    (push main → Pages deploy), salin `scripts/deploy-pages.workflow.yml`
>    ke `.github/workflows/` — butuh token berscope `workflow`.
> 4. **Verifikasi kesetaraan deploy**: `VERCEL=1 npm run build`, lalu bandingkan
>    sha256 `dist/assets/index-*.js` dengan yang disajikan live.

Portfolio satu halaman (+ About, Contact, 11 case study, Jurnal) bertema **terang,
tipografis, dan editorial**. Isinya 11 karya fiktif: "taman bermain satu orang":
brand khayalan yang digarap serius. Identitas visual v2.3: paper `#EAE8E1` +
ink `#0D0D0C`, **2 font saja** — display condensed raksasa (Heros Cn) + serif aksen
(Junicode Cn) — **tanpa garis di mana pun**, gambar berwarna penuh. **Home =
satu kanvas ala HUYMI**: kartu reel portrait 5:6 di tengah (aktif tegak 0°,
tetangga ngintip miring ±5,5°), list judul semua proyek di kanan (aktif
menyala), meta kiri, angka `NR. 1 / 11` raksasa — **scroll vertikal
menggeser reel secara LOOPING tanpa ujung** (011 → 001 → 002 mulus dua
arah, list & foto satu sumbu, snap ke tiap proyek). Halaman lainnya (about/contact/journal/case
study) tetap utuh, diakses via header. Intro: tagline scramble-decode, disusul
**reel fling** ala huyml.co (berputar cepat ±1,8 dtk → mengendap di proyek 1). Dibangun sebagai static SPA yang jalan identik di GitHub Pages
maupun Vercel dari codebase yang sama.

> Status: iseng-iseng, just for fun. Bukan situs open-for-work.

**Live demo**

| Platform     | URL                                              |
| ------------ | ------------------------------------------------ |
| Vercel (v2)  | `https://wah-anggaaa-v2.vercel.app`              |
| GitHub Pages | `https://whyuangga.github.io/wah-anggaaa-v2/`    |

> ⚠️ `https://wah-anggaaa.vercel.app` adalah situs **v1 (mode gelap)** yang
> di-deploy dari repo TERPISAH `whyuangga/wah-anggaaa` — bukan dari repo ini.
> Repo v1 tidak boleh dimodifikasi dari proyek ini.

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

±1,9 dtk, lalu tirai naik 0,75 dtk membuka hero — disusul **reel fling**:
kartu + list judul + angka berputar cepat 2 putaran (power4.out, 1,8 dtk)
lalu mengendap di proyek 1. Reduced-motion: statis + cepat, tanpa fling.

### `/` — Home (SATU KANVAS)

Home sengaja **satu kanvas saja** (ala HUYMI) — tidak ada hero tagline,
manifesto, say hi, atau footer di home. Kanvas = Works index + **chrome
header ala HUYMI**:

- **foto proyek: REEL VERTIKAL LOOPING ala HUYMI** — kartu portrait 5:6,
  aktif di tengah tegak 0°, sebelumnya ngintip di atas & berikutnya di
  bawah (miring ±5,5°, melurus saat masuk tengah), jarak antar kartu
  0,55×tinggi stage; bergerak bersama scroll (bukan crossfade tumpuk)
- **looping tanpa ujung SESUNGGUHNYA — via SCROLL-PROXY (teknik ocular)**:
  window tidak pernah di-scroll; di dalamnya ada container `overflow-y`
  tak terlihat berisi 24 putaran layar (528 × 100svh), stage `sticky`, dan
  render = `scrollTop/h − START` dimodulo — …010 → 011 → 001 → 002 mulus
  dua arah di MOUSE, TRACKPAD, TOUCH, dan KEYBOARD. Tidak ada satu pun
  preventDefault/recenter/touchend-hack: wheel & sentuhan menggerakkan
  container secara NATIVE (momentum ikut native), tepi buffer ±6 putaran
  tidak terjangkau → mustahil mentok; scroll-idle 160ms snap ke layar
  terdekat. Scrollbar disembunyikan (`.reel-scroll`)
- **re-anchor senyap (v2.13)**: tiap scroll idle, indeks layar di luar pita
  tengah digeser diam-diam 1–2 putaran penuh KE DALAM pita — frame identik,
  user sedang berhenti, jadi tidak ada gesture yang dipotong. Dengan buffer
  24 putaran (528 layar) + re-anchor, tepi container secara fisik tidak bisa
  dijangkau dari arah mana pun (mobile & desktop, dua-duanya)
- `overscroll-behavior-y: none` di html: pull-to-refresh tidak mencuri

- **klik kartu aktif → case study** (overlay button di slot tengah;
  `pointer-events-auto` wajib karena container reel `pointer-events-none`)
- **v2.17 — klik kartu MENGINTIP → spotlight**: kartu tetangga yang diklik
  berputar jadi fokus menggantikan kartu tengah (jump jalur terdekat);
  kartu tengah tetap = case study. Slot `visibility:hidden` otomatis tidak
  menerima klik.
- **list semua proyek** di kanan (kategori kecil + nama serif + blurb) —
  item aktif menyala, yang lain memudar; list dirender 4 lipatan sehingga
  ikut **looping mulus** dan tidak pernah bolong (termasuk saat
  auto-recenter di batas); klik item = lompat lewat putaran terdekat
- **meta** kiri tengah (role / launching / category, kolom label:value)
- **angka raksasa** kiri bawah: `nr.` + `1`…`11` (Heros bold, tanpa zero-pad) + `/ 11`
- kanan atas: `[ just for fun ] / working from jakarta`
- kiri bawah: `scroll ↓`; kanan bawah: dua kotak ■ □
- **chrome home (v2.19→v2.20)**: wordmark = **logo monogram**
  (`public/images/logo-wa.png`, tinta solid di atas kertas, hover opacity
  saja; v2.19 sempat pakai terminal prompt `> wah:anggaaa` sebelum asset
  logo tersedia). Teks vertikal kiri lama (`portfolio '26` dll) **dihapus**
  (v2.19). Blok `menu` + list serif **tanpa bar hitam vertikal** (bar
  dihapus v2.20), `[ just for fun ] / working from jakarta` kanan-atas.
  **Panah "→" di menu = efek hover** (slide-in, CSS `.menu-arrow`) — bukan
  permanen. Header tipis versi lama (jam JKT) tidak di-render di home —
  halaman lain tetap memakainya (selalu transparan sejak v2.18).
  **Mobile (v2.22): hamburger di KIRI**, chrome home bersih tanpa logo
  (percobaan logo kanan-atas v2.21 ditarik — kurang cocok). Logo monogram
  pindah ke **overlay menu**: teks `WAH:ANGGAAA` di baris atas overlay
  diganti asset logo (semua halaman, karena `MenuOverlay` shared) →
  overlay penuh (link serif raksasa, `×` tutup, info studio di bawah).
  (Tombol panah lingkaran lama sudah dihapus — navigasi = scroll/list/keyboard.)
- **v2.17**: klik kartu MENGINTIP → spotlight jadi fokus menggantikan tengah.
- **panah lingkaran** = proyek berikutnya; klik list = lompat proyek;
  keyboard ↑↓←→ saat pinned
- mobile: kartu reel diperkecil (28svh) & container di-right-pad 38vw, list
  judul **tetap tampil** di kanan (ITEM 60px, tanpa blurb; angka & wrap utuh)
- **scroll vertikal = gonta-ganti proyek**: section di-pin (ScrollTrigger,
  `scrub 0.6`, proxy object), **snap manual** saat scroll idle ±160ms.
  Reduced motion: 11 layar statis berurutan, tanpa pin.
- Halaman lain (about/contact/journal/case) tetap ada — via header.

### `/about`

Judul raksasa dua baris masuk dari sisi berlawanan, bio
tipografis, capabilities, recognition (drift konvergen ala Inspirux), colophon
+ kredit font. *(Foto portrait dihapus dari halaman — v2.10.)*

### `/contact`

`SAY HI` raksasa + email placeholder `halo@wahanggaaa.id` + sosial placeholder `#`
(hover flip ink/paper) + **generator brand khayalan** (`[ racik lagi ]`, `[ salin ]`)
+ jam WIB live + `[ just for fun ]`.

### `/works/:slug` (11 halaman)

Case study per karya — **foto hero di paling atas** dengan **efek fokus
blur** (blur→tajam + settle saat masuk; galeri ikut blur-up), lalu judul
raksasa + deskripsi di bawahnya, meta grid (klien/tahun/peran/stack),
tantangan & hasil (serif italic), proses + galeri **warna asli** (lazy),
stats ngarang, visit live site, prev/next, `← semua karya` di kanan-atas.

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
  `end: +=2N×viewHeight` — dua putaran penuh, `scrub: 0.6`); `onUpdate`
  mengubah gaya DOM langsung; state React hanya untuk angka/meta/list aktif
  saat indeks tampil (`round(f) mod N`) berganti. Di luar rentang pin lepas
  natural — tanpa jebakan scroll.
- **Reel looping (jarak-modulo)**: posisi tiap kartu = `d = ((j−f+N/2) mod
  N) − N/2` (jarak signed TERDEKAT) → `translateY(d×0.55h)` +
  `rotate(−5.5°×clamp(d,−1,1))` — kartu tengah tegak 0°, tetangga ngintip
  miring dan melurus saat masuk; `visibility |d|≤1.6`; `zIndex` aktif di
  atas tetangga (chrome diberi `z-10` agar angka NR tak tertutup).
- **List reel**: 4 lipatan WORKS; item aktif selalu di tengah
  (`translateY = h/2 − clip − (f+N+0.5)×ITEM`) — tidak pernah bolong saat
  wrap; **transform list milik GSAP** — tanpa style prop React (re-render
  bakal menimpa animasi di tengah scrub); style awal slot HARUS deterministik
  (f0=0), bukan ikut `idx`.
- **Snap manual**: scroll idle ±160ms → `scrollTo smooth` ke langkah
  terdekat (1/2N). (ScrollTrigger `snap` bawaan di-kill: meleset beberapa
  langkah di setup ini.)
- Klik list / keyboard = `scrollTo` ke **putaran terdekat** (`min |k−f|`
  untuk `k ≡ i (mod N)`) — tidak pernah rewind jauh.
- **Intro fling** (post-curtain): tween GSAP `f: 2N → 0` (`power4.out`,
  1,8 dtk, delay 0,1) menggerakkan `apply(f)` yang sama — scrub ScrollTrigger
  di-guard (`flingingRef`) selama fling; begitu selesai, posisi scroll (=0)
  identik dengan hasil fling → transisi tanpa lompatan.
- **Tinggi item list responsif**: `itemH()` = 60px (<768px) / 84px (md) —
  HARUS sinkron dengan class `h-[60px] md:h-[84px]` di markup.
- **Auto-recenter tanpa ujung**: listener `scroll` non-invasif menggeser
  `window.scrollY` mundur tepat N langkah saat menyentuh `st.end` (frame
  identik karena semua posisi modulo), plus listener `wheel` (non-passive)
  yang preventDefault + reposition di dasar → wheel-down terus mengalir
  tanpa pernah mentok; keyboard ↑/↓ di ujung juga melompat satu putaran
  dulu sebelum langkah halus. Pin TIDAK pernah lepas.
- Baris `case study → / live website ↗` dihapus (v2.9); akses case =
  **klik kartu aktif** di home (overlay `pointer-events-auto`).
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
- **Reel home**: mutasi `style` langsung per frame (translateY/rotate
  jarak-modulo ala loop) — tanpa re-render; state React hanya berganti saat
  indeks tampil `round(f) mod N` ganti.
- **Drift About** (ala Inspirux): dua baris konvergen `x: ±30% → 0` dengan GSAP
  `matchMedia` + ScrollTrigger scrub.
- **Footer cascade**: huruf naik per huruf saat masuk viewport + wave yoyo saat hover.
- Easing tunggal: `[0.22, 1, 0.36, 1]`.

### 5. Polesan micro-interaction (v2.16)

- **Home**: angka NR + meta kiri **roll vertikal** 0,2s saat ganti proyek
  (nilai lama `.roll-out` ke atas, baru `.roll-in` dari bawah); item list
  hover translate-x + terang; kartu aktif hover scale 1,03 + shadow dalam;
  cue `scroll ↓` memantul sekali saat masuk lalu statis. Roll hanya untuk
  gesture user — lompatan programatik (hook e2e `__reel.setY`, intro fling)
  dirender statis supaya screenshot byte-identik e2e tetap deterministik.
- **About**: capabilities & colophon stagger per item (satu observer di list,
  `staggerChildren`) + hover translate item.
- **Case study**: statistik **count-up** saat masuk viewport (suffix `%`/`+`
  tetap; non-numerik/reduced = statis), galeri hover scale, prev/next translate.
- **Journal**: hover baris → judul translate + panah `→` slide-in (pola
  `.menu-arrow`).
- **Footer raksasa**: cascade per huruf (`staggerChildren`) + wave per huruf
  saat hover (delay per huruf via `--d`).
- Semua poin di atas fallback `prefers-reduced-motion` = statis.

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
    │   ├── Header.tsx       → header tipis SELALU transparan (v2.18; tanpa border)
    │   ├── Footer.tsx       → footer raksasa cascade + wave + jam + status studio
    │   ├── WorksHuy.tsx     → works index ala HUYMI: satu layar, scroll = ganti proyek
    │   ├── MenuOverlay.tsx  → menu overlay mobile IDENTIK di semua halaman
    │   └── Seo.tsx          → title/desc/OG kanonis + JSON-LD per route
    ├── routes/
    │   ├── Home.tsx         → SATU KANVAS: hanya <WorksHuy /> (ala HUYMI)
    │   ├── About.tsx        → bio + capabilities + recognition + colophon (tanpa portrait)
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
| GitHub Pages | `/wah-anggaaa-v2/` | `PAGES_DEPLOY` via workflow `deploy-pages` | `dist/404.html` (salinan index) |
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
