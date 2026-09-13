# wah:anggaaa — Redesign v2.1 · Light Editorial

> ## 🚨 ATURAN KERAS untuk AI/agen (ringkasan — versi penuh di README.md)
> 1. **JANGAN PERNAH menyentuh repository `whyuangga/wah-anggaaa` (v1)** —
>    arsip versi dark mode milik owner. Berlaku untuk kode, branch, dan
>    seluruh setting deploy (Pages/Vercel).
> 2. **Deployment Vercel harus selalu sama dengan branch `main` repo ini.**
>    Disamakan HANYA lewat relink project Vercel ke `wah-anggaaa-v2`
>    (dashboard Vercel / Vercel token dari owner) — TIDAK dengan mirror
>    kode ke v1. Per 2026-09-12 Vercel masih menyajikan v1 (dark) secara
>    sengaja sampai owner me-relink; jangan "diperbaiki" lewat v1.

> **Branch:** `redesign/landing-light` (dari `main` @ 8de5169)
> **Status:** EXECUTED (2026-09-11) — P0–P4 selesai di branch ini. Tinggal review visual + merge.
> **Ganti:** PLAN v1 (dark freeform + WebGL). Isi lama tetap di git history / branch `main`.

## 0. TL;DR

Satu kalimat: **kaviengcreative.com, tapi versi wah:anggaaa — lebih hidup, tanpa garis, dengan intro terminal.**

- Palet dasar **`paper #EAE8E1` + `ink #0D0D0C`** — tapi **BUKAN monokrom**: semua gambar (karya, galeri, portrait) **warna asli penuh**. Warna masuk lewat konten, bukan lewat UI.
- Tipografi khas kavieng: **display raksasa uppercase condensed** (`TeX Gyre Heros Cn`) + **serif untuk aksen** (`Junicode Cn`) — keduanya open-source, pakai yang **persis sama** dengan referensi. Ditambah **IBM Plex Mono** (sudah ada di repo) HANYA untuk mikro-tekst terminal: intro, counter, label meta kecil, colophon.
- **Tanpa garis**: nol border, nol rules, nol divider. Pisah konten via whitespace + opacity.
- **Intro terminal**: text scramble ala terminal (decode char-by-char), bukan title reveal.
- Motion: **GSAP + ScrollTrigger** + **drag-rail horizontal** (signature). Tidak ada Three.js/WebGL, tidak ada Lenis, tidak ada custom cursor.
- **Foto portrait BOLEH** (di `/about`).
- Scope: **seluruh situs** — `/`, `/about`, `/contact`, `/works/:slug` (11), `/journal` (+post), `404`. Konten (data 11 karya, journal, kontak) **dipertahankan**, hanya restyle.

## 1. Keputusan locked (diskusi 2026-09-11, 3 ronde)

| Aspek | Keputusan |
|---|---|
| Warna dasar | `--paper: #EAE8E1` (bg), `--ink: #0D0D0C` (text) + hierarki via opacity. |
| Warna gambar | **Warna asli penuh** — TIDAK ada grayscale permanen, TIDAK ada filter monokrom di mana pun. |
| Foto portrait | **Boleh** — dipakai di `/about` (aset dari user; placeholder dulu). |
| Garis/border | **NOL** — tanpa rules, divider, border, underline animasi. Pemisah = whitespace + opacity. |
| Referensi | kaviengcreative.com — struktur, tipografi, drag-rail. |
| Font | Display: `TeX Gyre Heros Cn`. Aksen serif: `Junicode Cn`. Mikro-tekst terminal: `IBM Plex Mono` (kecil saja). |
| Intro | **Text scramble ala terminal** (bukan title `WAH:ANGGAAA`). Durasi ±1.6 dtk. |
| Tagline hero | `IMAGINARY BRANDS. / REAL CRAFT. / ZERO INVOICES.` (tagline B) |
| Scope | Seluruh situs. Konten 11 karya dipertahankan 100%. |
| Break | Fresh start — Three.js/WebGL, Lenis, custom cursor, menu overlay **dibuang**. |
| Larangan lama yang masih berlaku | Tanpa pill, tanpa marquee **otomatis** (rail = digerakkan user). |

## 2. Bedah referensi (kaviengcreative.com — diverifikasi dari CSS/JS situs)

### 2a. Font (fakta, bukan tebakan)
- `Heros` di CSS-nya = **TeXGyreHerosCondensed** (Regular + Bold) — neo-grotesque / Helvetica-clone oleh GUST e-foundry, **free** (GUST Font License).
- `Junicode` = **Junicode RegularCondensed** (Peter S. Baker) — serif, **OFL, "Junicode is and always will be free"**.
- Fallback mereka: `Arial Narrow`.
- **Implikasi:** self-host woff2 dari sumber resmi (CTAN/GitHub tex-gyre + situs Junicode), subset latin (±20–30 KB/file) di `public/fonts/`, credit OFL di colophon.

### 2b. Palet
- Bg `#f0efe9` + teks `#111` + abu → petama ke `#EAE8E1` + `#0D0D0C` + opacity 70/45/25/12. Beda dari referensi: referensi ini memang monokrom; **kita sengaja tidak** — warna hadir lewat gambar & portrait.

### 2c. Tipografi
- Display: `clamp(78px → 164px)` (ref pakai sampai `27vw`) — raksasa, **uppercase**, leading rapat (~0.88), tracking negatif ringan.
- Label kecil 11–15px untuk meta; serif untuk aksen (role line, kutipan, judul jurnal).

### 2d. Struktur halaman
1. Header tipis: nama kiri + role kanan + "scroll to enter".
2. Galeri karya **horizontal** — "scroll down · drag to shift", thumbnail + judul, indeks proyek ("Open project / Choose a project"), "Showing all work".
3. Footer tipis.

### 2e. Motion (dari bundle JS mereka)
- **GSAP + ScrollTrigger**, **custom horizontal drag** (wheel + pointer + inertia), hormati `prefers-reduced-motion`. Tidak pakai Lenis/Three.js/custom cursor.

## 3. Token desain

### Warna
```
--paper: #EAE8E1        /* background */
--ink:   #0D0D0C        /* foreground */
/* hierarki teks via opacity: 100 / 70 / 45 / 25 / 12 */
```
- Gambar & foto: **warna asli**, tanpa filter. Kontras foto vs paper dijaga dengan margin/whitespace, bukan garis.
- Tidak ada shadow berwarna (shadow tipis `ink/8` maksimum, atau tanpa).
- **Tidak ada warna UI aksen baru** (default). Warna situs = paper/ink + warna dari gambar. *(Open item: user boleh minta 1 aksen kapan saja.)*

### Tanpa garis (aturan keras)
- Nol `border-*`, nol `hr`, nol rules horizontal/vertikal, nol divider, nol underline (termasuk hover underline).
- Header tanpa border bawah — saat scroll, header dapat bg `paper` solid (bukan blur/glass).
- Daftar (capabilities, sosial, indeks) dipisah **jarak vertikal**, bukan garis.
- Progress drag-rail: **bukan bar/line** → counter teks `001 / 011` (IBM Plex Mono).
- Hover link/judul: **opacity / shift / scale** — bukan underline.
- Focus state: outline 2px `ink` offset 3px (a11y, bukan garis dekoratif — tetap ada, ini aksesibilitas).

### Tipografi
| Role | Font | Catatan |
|---|---|---|
| Display / headline / nav / indeks | `TeXGyreHerosCn` **Bold** | uppercase, `leading 0.86–0.92`, `letter-spacing -0.01em`, `clamp(3rem, 11vw, 10.5rem)` dst. |
| Display light | `TeXGyreHerosCn` Regular | teks besar tanpa perlu berat |
| Aksen serif | `Junicode` (RegularCondensed, + Italic) | role line, kutipan, judul jurnal, pembuka challenge/outcome |
| Body | `TeXGyreHerosCn` Regular 15–16px | `leading 1.55`, max ±62ch |
| Mikro-tekst terminal | `IBM Plex Mono` 400/500, 11–12px | **hanya untuk**: intro scramble, counter `001/011`, label `[ jakarta — wib ]`, tanggal jurnal, colophon |

- General Sans **dibuang**; IBM Plex Mono **dipertahankan** (sudah ada woff2-nya di repo) dalam peran kecil di atas.
- `font-display: swap`, self-host, subset latin.

### Bentuk & spacing
- Sudut: tajam (radius 0–2px); tanpa rounded-full.
- Grid: 12 kolom, gutter `clamp(16px, 2vw, 28px)`, margin x `clamp(20px, 4vw, 56px)`.
- Spacing vertikal section: `clamp(96px, 14vh, 160px)` — **ini pengganti garis** sebagai pemisah.
- Foto: penuh warna, aspect dijaga, max-width per layout.

### Larangan
- Tanpa pill, tanpa marquee otomatis, tanpa glassmorphism, tanpa gradien, tanpa cursor custom, **tanpa garis/rules/border dekoratif**, **tanpa grayscale/monokrom pada gambar**.

## 4. Struktur per halaman

### `/` — Home
1. **Intro terminal (±1.6 dtk):** layar paper, blok teks kecil di kiri-bawah (IBM Plex Mono, ink/80), baris demi baris **scramble-decode** (char acak → resolve, gaya terminal):
   ```
   > wah-anggaaa :: personal playground
   > decoding identity .............. [OK]
   > loading 11 imaginary brands .... [OK]
   > ready.
   ```
   Titik-titik + `[OK]` ikut terscrable. Selesai → curtain paper naik (0.7 dtk) membuka hero. Tanpa title `WAH:ANGGAAA` di intro. Reduced-motion: teks statis langsung tampil 0.4 dtk, tanpa scramble.
2. **Header (sticky, tanpa border):** kiri `WAH:ANGGAAA` (Heros Bold 14px), kanan `About · Contact` + `[ just for fun ]`. Saat scroll: bg paper solid fade-in (0.3 dtk).
3. **Hero:** tagline 3 baris UPPERCASE raksasa (Heros Bold): `IMAGINARY BRANDS. / REAL CRAFT. / ZERO INVOICES.` + role serif italic `Designer & Creative Developer` + baris label mono `[ just for fun ]` `[ jakarta — wib ]` + cue `scroll ↓` kiri bawah. Reveal: line-mask stagger.
4. **Works — DRAG RAIL (signature, ala kavieng):**
   - Rail horizontal full-bleed, 11 karya, thumbnail **warna asli** (webp, lebar ±42vw, aspect 4:3). Label atas: `SELECTED WORKS — 2026` (Heros) + `SCROLL → · DRAG TO SHIFT` (mono).
   - Kontrol: drag pointer/touch + inertia, wheel vertical di section → horizontal, keyboard ← →, rubber-band ringan di ujung.
   - **Progress = counter** `001 / 011` (mono, kanan atas section, update mengikuti posisi) — bukan bar/line.
   - Di bawah rail: **indeks 001–011** (2 kolom desktop) — `nomor · judul · kategori · tahun`, dipisah jarak (tanpa garis). Hover item → rail geser ke karyanya (0.7 dtk); karya di tengah rail → item aktif (ink 100%, lain 45%).
   - Klik → `/works/:slug`. Mobile: swipe natural, indeks sticky bawah.
5. **Manifesto (Junicode, 3–4 kalimat):** reveal **kata-per-kata** scrub, `clamp(1.6rem, 3.4vw, 2.8rem)`. Teks = manifesto lama.
6. **Contact teaser:** `SAY HI →` (Heros Bold raksasa full-width; hover: shift 12px) → `/contact`.
7. **Footer:** `WAH:ANGGAAA` cascade per huruf (wave saat hover) + baris bawah: `© 2026 · Jakarta (WIB) · About · Contact · [ just for fun ]` (mono).

### `/about`
Judul `ABOUT` → bio tipografis 2–3 paragraf → **FOTO PORTRAIT** (warna asli, besar — ±45vw di desktop, offset ringan dari grid; placeholder netral sampai user kirim) → **Capabilities** (daftar jarak, tanpa kartu/pill/garis) → **Recognition** (placeholder section) → **Colophon** (mono): `Set in TeX Gyre Heros Condensed, Junicode & IBM Plex Mono. Built with Vite, React & GSAP. Jakarta.` (credit OFL wajib).

### `/contact`
`SAY HI` raksasa → email `halo@wahanggaaa.id` (placeholder, clickable) → sosial (4, placeholder `#`) daftar jarak + panah hover → `based in Jakarta (UTC+7)` + jam WIB live (hook lama, mono) → `[ just for fun ] — not open for work`. (Tanpa foto — biar about yang membawa portrait; bisa ditambah nanti.)

### `/works/:slug` (11 halaman — konten dipertahankan 100%)
Header: `001 · LEXIER®` (indeks mono + judul raksasa) + meta grid (`role / stack / tahun / url → visit`) → **story** (Heros body) → **Challenge** & **Outcome** (serif italic pembuka) → **stats** (angka besar Heros + label kecil) → **gallery WARNA ASLI** (full-bleed bergantian, lazy + blur-up) → `next work →` (slug berikutnya). OG per karya tetap (bg paper di P4).

### `/journal` & `/journal/:slug`
Pipeline markdown lama dipakai ulang. List: `judul (serif) · tanggal (mono)` per baris, dipisah jarak. Post: judul serif `clamp(2rem, 5vw, 3.5rem)`, body Heros 16px, lebar 62ch.

### `404`
`404` raksasa + `lost in the imaginary.` (serif) + `← back to home`.

## 5. Motion system

| Elemen | Implementasi |
|---|---|
| Intro scramble | Class `TextScramble` kecil (char pool `!<>-_\/[]{}—=+*^?#`), resolve kiri→kanan per baris, 4 baris × ±0.35 dtk + jeda, total ±1.6 dtk. Font mono. |
| Curtain (intro→hero & antar halaman) | Panel paper naik-turun, 0.45 dtk menutup → swap → 0.5 dtk membuka + konten stagger. |
| Drag rail | GSAP x-transform + pointer/wheel custom + inertia manual, transform-only. Sync indeks ↔ rail. |
| Headline reveal | line-mask `clip-path: inset()` per baris, stagger 80ms, `power3.out`, 0.8 dtk. |
| Manifesto | word-by-word opacity scrub (scrub 0.5). |
| Hover rail | thumbnail `scale 1.03` 0.6 dtk; indeks aktif via opacity. |
| Footer wave | cascade per huruf saat masuk viewport + wave saat hover. |
| Reduced motion | Intro statis tanpa scramble; reveal = opacity 1; rail tanpa inertia; curtain = crossfade 0.2 dtk. |

**Budget:** hanya `transform`/`opacity`; 60fps mobile; gambar webp `loading=lazy` + blur placeholder (data-uri lama dipakai); route lazy-load.

## 6. Arsitektur (fresh dari `main`)

### Dipertahankan
- Vite 6 + React 19 + TS + Tailwind 4 + react-router 7 (lazy routes)
- `src/components/Seo.tsx`, `scripts/sitemap.mjs`, `public/_redirects` (Cloudflare Pages)
- `src/data/works.ts` (11 karya + CONTACT) — **sumber kebenaran konten**
- `src/lib/journal.ts` + `content/journal/`
- `src/hooks/useJakartaTime.ts`
- `@vercel/analytics`
- `src/assets/fonts/ibm-plex-mono-*.woff2` (peran: mikro-tekst terminal)

### Dibuang
- `three` + `@types/three`, `src/canvas/*` (Scene/bus/shaders)
- `lenis`, `src/components/Cursor.tsx`, `src/components/MenuOverlay.tsx`, `src/components/Loader.tsx` (diganti intro terminal)
- Font `general-sans-*`
- Semua token/kelas warna `bone`/`void` + **semua border/rules/underline/grayscale filter**

### Ditambah
- `public/fonts/` — `heros-cn-regular.woff2`, `heros-cn-bold.woff2`, `junicode-regular.woff2` (+italic bila perlu)
- `src/components/Intro.tsx` (terminal scramble), `Scramble.tsx`, `DragRail.tsx`, `Index.tsx`, `Curtain.tsx`, `Header.tsx` (tanpa border), `Footer.tsx`
- `src/hooks/useDragRail.ts`
- `@theme` Tailwind 4: token paper/ink/font

### Struktur file
```
src/
  App.tsx                 → router + curtain + intro (sekali)
  main.tsx
  index.css               → @theme + base (tanpa border default)
  data/works.ts           → TIDAK DIUBAH
  lib/journal.ts          → TIDAK DIUBAH
  hooks/useJakartaTime.ts → TIDAK DIUBAH
  hooks/useDragRail.ts    → baru
  components/
    Header.tsx  Footer.tsx  Intro.tsx  Scramble.tsx
    DragRail.tsx  Index.tsx  Curtain.tsx  Seo.tsx
  routes/
    Home.tsx  About.tsx  Contact.tsx
    WorkCase.tsx  Journal.tsx  JournalPost.tsx  NotFound.tsx
```

## 7. Keputusan yang sudah diambil (reversible)

- **Round 3 (2026-09-11, user):** tanpa monokrom/grayscale (gambar warna asli), portrait boleh, tanpa garis, intro = text scramble terminal.
- **Intro:** ON, ±1.6 dtk, tanpa video, tanpa title brand.
- **Custom cursor / menu overlay / `[ acak! ]` / 3D morph:** semuanya **dibuang**.
- **Tanpa garis → focus ring a11y tetap ada** (outline, bukan garis dekoratif).
- **Kenapa tetap Vite/React:** repo & deploy Cloudflare Pages sudah jalan; "fresh start" di level desain/motion, bukan rewrite tanpa alasan.
- **Portrait:** di `/about` saja dulu (bukan di home/contact) — biar ritme home tetap tipografis.

## 8. Phases & checklist

### P0 — Fondasi (½–1 sesi)
- [ ] `@theme` token (paper/ink/font) + base styles; bersihkan semua border default & token lama
- [ ] Font: download Heros Cn (reg+bold) + Junicode (reg, +italic) dari sumber resmi, subset latin → woff2; IBM Plex Mono sudah ada
- [ ] Intro terminal (Scramble + Intro) + Curtain page transition
- [ ] 404 baru
- **Verifikasi:** semua route render dengan palette baru, font OK, **tidak ada satu garis pun** (audit visual), reduced-motion aman, Lighthouse perf > 90.

### P1 — Home (1 sesi, inti)
- [ ] Header (tanpa border, bg solid saat scroll) + Footer (cascade)
- [ ] Hero (tagline B + role + label mono + cue)
- [ ] DragRail: 11 thumb **warna asli** + drag/wheel/inertia/keyboard + **counter `001/011`**
- [ ] Index 001–011 (dipisah jarak) + sync dua arah
- [ ] Manifesto word-scrub + `SAY HI` teaser
- **Verifikasi:** 60fps drag mobile, counter akurat, scroll-spy benar 11 item, tanpa garis/underline, reduced-motion aman.

### P2 — About + Contact (½ sesi)
- [ ] `/about` + **slot foto portrait** (placeholder sampai aset user sampai; komponen `Portrait` dengan fallback)
- [ ] `/contact` (say hi, email, sosial, jam WIB)
- **Verifikasi:** link jalan, SEO per halaman.

### P3 — 11 Case Study + Journal (1 sesi)
- [ ] `WorkCase` restyle (meta grid, story, serif quotes, stats, **gallery warna asli**, next work)
- [ ] `/journal` + post
- **Verifikasi:** 11 URL slug lama tetap valid, gallery lazy + blur-up.

### P4 — Polish & rilis (½ sesi)
- [ ] Regenerate OG ke bg paper (opsional batch)
- [ ] Pass mobile 320–430px, touch rail, tap target ≥44px
- [ ] Pass reduced-motion menyeluruh + **audit "tanpa garis" final**
- [ ] Lighthouse 4 platform ≥ 90; bundle JS gzip target < 150 KB (tanpa three.js)
- [ ] Update `README.md`; branch siap di-merge
- **Verifikasi:** `npm run build` + `tsc --noEmit` bersih.

## 9. Open items

**Resolved round 3 (2026-09-11):** monokrom/grayscale → warna asli; portrait → boleh (di /about); garis → nol; intro → terminal scramble.

**Masih terbuka (non-blocking):**
1. **Aset foto portrait** — belum dikirim user. P2 jalan dengan placeholder netral; component sudah siap, tinggal drop file.
2. **Warna aksen UI** — default: tidak ada (warna dari gambar). Kalau mau 1 aksen untuk link/hover, user tinggal sebutkan.

---
*Ditulis oleh arena-agent, 2026-09-11. Rencana, bukan doktrin — semua baris boleh diganggu sebelum P0 mulai.*

## 10. v2.2 — Rombak total (round 4, 2026-09-11)

**Keputusan user:** lebih beda dari v1, **jangan font mono**, UI rombak total.

| Aspek | v2.1 | v2.2 |
|---|---|---|
| Font | 3 (termasuk IBM Plex Mono) | **2**: Heros Cn + Junicode Cn. Label = class `.lbl` (Heros uppercase tracking). |
| Intro | 4 baris terminal (`>`, `[ok]`, mono) | 3 baris tagline **scramble-decode** (Heros, kiri-bawah, tanpa chrome terminal) |
| Hero | 3 baris tagline uniform, kiri bawah | **Poster 3 treatment**: bold / serif italic (indent) / **outline** (`.text-outline`, fallback aman) — komposisi centered |
| Works | Drag rail horizontal + indeks 2 kolom | **THE INDEX**: daftar full-width `001 · JUDUL RAKSASA · kategori serif · tahun`, hover = judul menyala + **floating preview** (lerp + rotasi ±9°, clamp viewport) |
| Footer | Brand word cascade (mirip v1) | *just for fun.* serif italic raksasa, line-mask |
| Case study | Label mono + meta grid | Label `.lbl`, kategori serif italic, **ghost number outline** di belakang judul |
| Tetap | paper/ink, tanpa garis, gambar warna asli, portrait OK, scramble, curtain | sama |

## 11. v2.3 — Works Deck + fix bug navigasi (round 6, 2026-09-11)

**Keputusan user:** (1) benerin dulu bug "engga bisa masuk halaman lain" di
deploy Vercel; (2) bagian works jadi **carousel seperti reference HUYMI**
(foto full-bleed, judul serif raksasa bawah tengah, prev/next pojok, counter
raksasa); (3) v2.2 "masih mirip banget" → deck menggantikan The Index.

### Bug navigasi — root cause & fix
- **Gejala:** klik link halaman lain → URL berubah tapi layar kertas kosong.
- **Root cause:** div curtain transisi punya inline style
  `transform: translateY(100%)`. GSAP mem-flatten `%` itu jadi `y: 900px`
  (piksel) saat parse, lalu tween `yPercent` bertumpuk di atasnya:
  posisi akhir `-100% + 900px = 0` → curtain **menutup seluruh layar**
  (bg paper, z-90, pointer-events-none) setelah transisi pertama.
- **Fix:** hilangkan inline transform; posisi awal curtain di-set via
  `gsap.set(curtain, { y: 0, yPercent: 100 })` di `useLayoutEffect`, plus
  normalisasi ulang di awal tiap `go()`. Semua transform curtain kini satu
  representasi GSAP.
- **Verifikasi:** puppeteer headless — navigasi beruntun 5× (desktop +
  mobile), deep-link semua halaman, screenshot konten terlihat.

### Works Deck (menggantikan WorksIndex)
- Section 100svh **pin** ScrollTrigger; scroll vertikal → track horizontal
  (scrub 1, `end += (N-1)×innerWidth`).
- Slide: foto full-bleed warna asli + **dim flat ink 30%** (bukan gradient) +
  overlay teks putih **mix-blend-difference** (auto-invert di foto terang/gelap).
- Layout per slide (patokan HUYMI): counter raksasa kiri bawah `NNN / 011`,
  judul **Junicode** raksasa bawah tengah, prev/next + nama karya di pojok,
  meta kiri atas (case · role/stack · live website →), kanan atas
  `[ just for fun ] · working from jakarta`, 11 tick progress atas tengah.
- Navigasi: scroll, tombol prev/next, keyboard ← → saat pinned (via
  `activeRef`, tanpa re-render per frame). Klik judul → case study.
- **Pitfall terdokumentasi:** ScrollTrigger pin mem-wrap trigger dengan
  `pin-spacer`; cleanup trigger harus di **`useLayoutEffect`** (sebelum React
  removeChild di commit) → kalau pakai `useEffect` muncul
  `NotFoundError: removeChild` saat pindah halaman.
- Reduced motion: horizontal scroll-snap, tanpa pin.

## 12. v2.4 — Works index ala HUYMI (round 7, 2026-09-11)

**Keputusan user:** foto reference sebelumnya salah kirim — yang benar state
"index" HUYMI (paper, foto tengah miring, list proyek kanan, angka raksasa).
"Jadi cuma hero section aja tanpa section, jadi scroll nya buat gonta-ganti
proyeknya." → deck horizontal full-bleed dihapus; works jadi **satu layar**
layout persis reference, scroll vertikal = ganti proyek. Konten = 11 karya kita.

### Layout (patokan screenshot HUYMI)
- Kiri atas: teks vertikal `portfolio '26` + `11 works — jakarta, id`
- Kanan atas: `[ just for fun ] / working from jakarta`
- Tengah: foto proyek (miring ±2°, shadow halus), crossfade + drift antar proyek
- Kanan: reel 11 proyek (kategori + nama serif + blurb), aktif menyala, gulir
- Kiri tengah: meta role/launching/category (kolom label:value)
- Kiri bawah: `nr.` + angka Heros raksasa + `/ 011`; `scroll ↓`
- Kanan bawah: dua kotak ■ □; panah lingkaran = proyek berikutnya
- Bawah foto: `case study →` + `live website ↗`

### Teknis & pitfall
- Proxy tween `{f: 0→N-1}` + `scrub 0.6` + pin; DOM dimutasi langsung per frame.
- **Snap bawaan GSAP tidak stabil** (meleset 2-6 langkah; reproducible headless)
  → snap manual: scroll idle 160ms → `scrollTo smooth` ke langkah terdekat.
- **List tanpa style prop di mode animated** — style transform yang bergantung
  `idx` akan di-rewrite React tiap re-render dan menimpa animasi GSAP.
- Foto: 11 img ditumpuk; `opacity = 1-|f-j|`, `y = -d×120`, `rotate ±2°`.
- Reduced motion: 11 layar statis (tanpa pin).

## 13. v2.5 — Home = satu kanvas (round 8, 2026-09-11)

**Keputusan user:** "pakai 1 hero section nya aja tanpa section yang lain.
cuma 1 kanvas aja, dan halaman halaman lainnya. Seperti HUYMI — hapus semua
section yang kita punya, jadikan 1 section."

- `Home.tsx` kini **hanya `<Seo /> + <WorksHuy />`** — hero poster tagline,
  manifesto (ManifestoScrub), say hi, dan footer dihapus dari home.
  (MaskLine & ManifestoScrub ikut dibuang dari file.)
- Footer tetap ada untuk halaman lain (about/contact/journal/case/404).
- Kanvas HUYMI jadi layar pertama setelah intro; panjang dokumen home =
  11×100svh persis (pin spacer 10×100svh + 1 layar).
- Header (ABOUT/CONTACT/JOURNAL) = pintu ke halaman lain — sesuai "halaman
  halaman lainnya tetap".

## 14. v2.6 — Header ala HUYMI + hamburger mobile (round 9, 2026-09-11)

**Keputusan user:** "Di mobile pakai hamburger aja. Dan belum persis sama,
headernya sama kayak huymi juga."

- `Header.tsx` (header tipis + jam JKT) **tidak di-render di home**
  (`pathname === '/' → return null`); halaman lain tetap memakai.
- Chrome HUYMI kini bagian kanvas `WorksHuy`:
  - wordmark `WAH:ANGGAAA` Heros bold kiri-atas (klik = scroll ke atas)
  - blok `menu` + bar hitam vertikal + list serif 19px:
    `→ work. / about. / contact. / journal.` (arrow = halaman aktif)
  - `[ just for fun ] / working from jakarta` kanan-atas
- Mobile: hamburger 3 garis kanan-atas → **overlay penuh** bg paper:
  link serif 38px, `×` tutup, `[ just for fun ] / working from jakarta`
  bawah. Navigasi overlay = `go()` + tutup (curtain z-90 di atas overlay z-80).

## 15. v2.7 — Reel foto vertikal + rapian chrome (round 10, 2026-09-11)

**Keputusan user (dari 3 screenshot HUYMI tambahan):**
1. "kartunya kamu tumpuk" — foto harus seperti HUYMI: **reel vertikal**,
   foto sebelumnya ngintip di atas, berikutnya di bawah (miring), bukan
   crossfade tumpuk di posisi sama.
2. Hapus tombol panah lingkaran (mobile & desktop).
3. Mobile: hamburger di **kiri**, teks WAH:ANGGAAA dihapus.
4. Panah "→" di menu = **efek hover** (slide-in), bukan permanen.

### Implementasi
- Reel: tiap foto = slot `h-[36svh] aspect-[5/4]` absen di tengah;
  `translateY((j - f) × 0.42 × h) rotate(tilt)`; `visibility` saat
  `|j - f| ≥ 1.6`. Link `case study / live website` di `top calc(50% + 20svh)`.
- Panah menu: plain CSS `.menu-arrow` + `.menu-item:hover .menu-arrow`
  di index.css — karena interaksi `group-hover` + `.opacity-0` di cascade
  Tailwind v4 terbukti tidak menang (di-debug via CSSOM: kedua rule match,
  `.opacity-0` tetap menang).
- Wordmark `hidden md:block`; hamburger `left-5`; circle button dihapus.

## 16. v2.8 — Kartu reel persis screenshot + looping tanpa ujung (round 11, 2026-09-12)

**Briefing user (via ask_user):** 1) "label judul" = list di **kanan**
(bukan kiri — koreksi user); 2) kartu = **portrait 5:6, tengah 0°,
tetangga ±5,5° melurus, spacing 0,55×h, crop tengah otomatis** dari
thumb landscape; 3) loop = **bolak-balik tanpa ujung** (001↔011);
4) chrome lain: **skip** (tetap gaya v2.7 — angka `001 / 011`, list
kiri-align, kotak ■ □ kanan-bawah, tanpa panah lingkaran).

### Implementasi (`WorksHuy.tsx`)
- Geometri: slot `h-[40svh] max-h-[440px] aspect-[5/6]`; `slotAt(j, f, h)`
  menghitung **jarak-signed-modulo** `d = ((j−f+N/2) mod N) − N/2` →
  `translateY(d × 0.55h)`, `rotate(−5.5° × clamp(d,−1,1))`,
  `visibility |d|≤1.6`, `zIndex` aktif>tetangga (chrome diberi `z-10`
  supaya angka NR tidak tertutup kartu — bug mobile temuan e2e).
- Loop: ScrollTrigger scrub memetakan progress → indeks virtual
  `f ∈ [0, 2N]` (`end = 2N×h`, 2 putaran penuh); indeks tampil
  `round(f) mod N`. Snap manual per step 1/(2N). List = 3 lipatan WORKS,
  `translateY = h/2 − clip − (f+N+0.5)×ITEM` (lipatan tengah = aktif).
  `jump(i)` memilih **putaran terdekat** (min |k−f| atas k ≡ i mod N).
  Keyboard ↑↓ = ±1 langkah; di ujung range pin lepas natural.
- Style awal slot animasi harus **deterministik** (f0=0) — jangan
  pakai `idx` supaya React re-render tidak menimpa transform GSAP.

### Verifikasi (e2e headless Chromium, `test-reel.mjs`)
30/30 PASS desktop 1440×900 + mobile 390×740 + reduced-motion:
wrap f=11 identik pixel dengan f=0; f=12 lanjut 002 (no rewind);
ArrowUp dari 001 → 011; snap f=4.37→005; klik list = jalur terdekat;
list terisi penuh di kedua ujung; tidak ada error konsol; reduced =
11 layar statis (121 slot) tanpa pin; mobile tanpa overflow-x.


## 17. v2.9 — Flings intro, mobile label, bersihin chrome (2026-09-12)

**Permintaan user (3):**
1. Hapus baris `case study →` + `live website ↗` di bawah foto.
2. Kartu dikecilkan di mobile supaya list label judul bisa tampil di sana.
3. Intro fling ala huyml.co: reel berputar cepat → diam di proyek 01; dan
   angka proyek `1`–`11` tanpa zero-pad (bukan `001`).

### Implementasi
- Fling: `gsap.to({f: TOTAL→0}, power4.out 1,8s, delay 0,1)` dipicu pada
  useLayoutEffect ST yang sama; scrub di-guard via `flingingRef`; `kill()`
  di cleanup; reduced-motion tidak mount jalur ini (statis, tanpa fling).
- Mobile: container reel `right-[38vw]` (desktop `right-0`) + kartu
  `h-[28svh] max-w-full` — kartu centering via `m-auto` di dalam container
  yang menyempit. ⚠️ Percobaan `mr-[46vw] md:mr-0` pada slot TERNYATA
  merusak centering desktop: `inset-0 + m-auto` dengan `margin-right:0`
  membuat `margin-left:auto` menyerap seluruh sisa ruang (kartu nempel
  tepi kanan) — ketemu lewat e2e, diuji ulang dengan rect slot (x=570 ✓).
- List: selalu tampil (buang `hidden sm:block`), ITEM 60px di mobile via
  `itemH()`, blurb `hidden md:block`, judul `clamp(1rem,4.2vw,1.3rem)`,
  kategori pakai utilitas font-size (bukan `.lbl` — class non-layer
  mengalahkan utilitas Tailwind v4 di cascade).
- Angka: `String(Number(wk.index))` + `/ {N}`; `.lbl` dkk tak berubah.

### Verifikasi
`tsc` bersih, build ok, e2e (scripts/test-reel.mjs) 29/29 PASS:
fling terbukti (seq angka unik ≥4 saat load → endap di "1"), desktop
center 720✓, mobile list 33 item h=60✓ tanpa overlap (cardRight 211 <
listLeft 226), wrap & snap & jump tetap, reduced statis, tanpa error.


## 18. v2.10 — Klik kartu → case, loop TANPA UJUNG beneran, menu mobile konsisten (2026-09-12)

**Permintaan user (4):**
1. Klik kartu reel → buka case study; case dirombak: foto di ATAS, deskripsi
   di bawahnya; tambah efek fokus blur.
2. Hamburger di SEMUA halaman (sebelumnya cuma home).
3. Hapus foto portrait di /about.
4. Looping masih mentok di bawah (pin lepas) → harus benar-benar tanpa ujung.

### Implementasi
- `WorksHuy`: overlay `button` pada slot aktif (klik = `go(/works/slug)`);
  `pointer-events-auto` eksplisit — container `pointer-events-none` menular
  ke anak. Fling `onComplete` kini sync `apply(st.progress×TOTAL)` (bukan
  hardcode 0) — user yang scroll saat fling tidak di-karetkan ke 001.
- **Loop tanpa ujung**: listener `scroll` menggeser balik persis 1 putaran
  (N×h px) saat `y ≥ st.end−0.5` dan arah turun (frame identik → tak
  terlihat; 4 lipatan list membuatnya selalu penuh). Wheel-down di dasar
  di-intercept (non-passive + preventDefault) karena di mentok native tidak
  ada scroll-event lagi. Keyboard ↑/↓ di ujung: lompat 1 putaran dulu, baru
  langkah halus. Pin tidak pernah lepas → tidak pernah "mentok".
- `MenuOverlay.tsx` (shared): dipakai WorksHuy (home) DAN Header (semua
  halaman lain, mobile-only, + `[ just for fun ]` kanan). Header lama
  (jam JKT) tetap desktop-only seperti dulu.
- `About`: blok portrait + komponen `Portrait` dihapus; teks jadi kolom
  `max-w-2xl`. `WorkCase`: hero dipindah ke paling atas dengan fokus blur
  (`filter: blur(26px) → 0` + scale settle), judul & deskripsi di bawah,
  link `← semua karya`, Reveal & galeri Figure ikut blur-in.

### Verifikasi (e2e `scripts/test-reel.mjs`, 37/37 PASS)
Baru: klik kartu → `/works/lexier`; case `img.top < h1.top`; link balik;
auto-recenter di batas (y=19800→9900); wheel-down di dasar menembus;
ArrowDown di ujung lanjut ke 002; about tanpa portrait; hamburger+overlay
di /about mobile; regresi loop/snap/jump/fling/reduced/mobile semua tetap
hijau. tsc + build bersih.


## 19. v2.11 — Looping mobile: touchend recenter + wheel dua sisi (2026-09-12)

**Masalah user:** di mobile swipe ke bawah masih mentok dan ke atas tidak
bisa — loop baru jalan di desktop (wheel).

**Akar masalah:**
1. Guard `y > lastY` pada recenter-saat-scroll gagal di mobile: saat swipe
   mencapai clamp, event terakhir mendarat persis `y == lastY == end`
   → syarat strict-`>` tidak pernah true.
2. Di TENGAH gesture touch, `window.scrollTo` percuma — browser menyimpan
   anchor posisi saat touchstart dan memaksanya kembali (clamp) di setiap
   touchMove. Scroll tidak pernah bisa "dipindah" sebelum gesture selesai.
3. Scroll-ke-atas di y=0 tidak pernah fires scroll event (native clamp) —
   jadi sisi atas tak punya jalur wrap sama sekali (desktop pun begitu).

**Implementasi (`WorksHuy.tsx`):**
- Listener `scroll`: recenter batas bawah TANPA syarat arah; batas atas
  recenter bila tiba dengan arah naik (y < lastY).
- Listener `wheel`: dua sisi — di dasar lanjut +delta, di pucuk (deltaY<0,
  y≤start+1.5) preventDefault + `start + loopPx + delta` → scroll-up dari
  001 tembus ke 011 (sebelumnya mustahil).
- `touchstart`/`touchend` (passive, tanpa preventDefault): touchend mengukur
  arah gesture dari ΔY jari; di batas & mengarah keluar → geser 1 putaran.
  Momentum pasca-fling dinetralkan snap-idle + guard unconditional.
- `html { overscroll-behavior-y: none }` → pull-to-refresh/glow tidak
  mencuri swipe di batas.

**Verifikasi:** e2e pakai CDP `Input.dispatchTouchEvent` (swipe nyata,
context `hasTouch`, 390×740): swipe-up di dekat end tidak mentok & proyek
berubah; 8× swipe berturut selalu di-wrap 0× nyangkut; swipe-down di pucuk
menembus (y ≈ loopPx) lalu swipe-up lanjut → proyek 11; desktop wheel-up di
pucuk → y=9900. Suite penuh 44/44 PASS; tsc + build bersih.

## 20. v2.12 — REBUILD: scroll-proxy ala OCULAR, bukannya akrobatika recenter (2026-09-12)

**Masalah user (v2.11 belum beres):** di HP tetap mentok dua arah.

**Post-mortem:** model "native window-scroll + ScrollTrigger pin + recenter"
kalah lawan browser: (a) saat gesture touch, browser meng-anchor posisi di
touchstart dan meng-klamp balik semua `scrollTo` di tengah swipe; (b) di
y=0 event scroll untuk "scroll up" tidak pernah fires; semua patch
(touchend recenter, wheel intercept) cuma menutupi sebagian dan sulit
dibuktikan di perangkat asli.

**Riset referensi (ocular-45z.pages.dev, diminta user):** html & body
`overflow:hidden`, `scrollY` SELALU 0; ada div `.scrollArea` internal
(overflow-y: scroll, isi = layar-layar berulang `snap-point`) yang
merupakan satu-satunya yang di-scroll; render = lerp dari
`scrollTop / H` lalu **modulo murni** `((p % 3) + 3) % 3`; GSAP tanpa
ScrollTrigger sama sekali. Kesimpulan: looping "sempurna" = TIDAK ADA
batas untuk mentok — bukan karena edge-case ditangani, tapi karena
native scroll dipindah ke container panjang yang tak pernah habis.

**Implementasi (`WorksHuy.tsx`):**
- ScrollTrigger + pin + tween + SEMUA intercept (wheel/touchend/scroll-
  recenter) DIHAPUS. Window tidak pernah di-scroll.
- `.reel-scroll` = container `absolute inset-0 overflow-y-scroll
  overscroll-none`, isi `REEL_SCREENS = 12×TOTAL = 264` layar (spacer
  `svh`, tinggi auto-update saat URL bar mobile berubah); stage `sticky
  top-0 h-svh` sehingga visual tak pernah bergerak; scrollbar CSS-hide.
- `f = mod(scrollTop/h − REEL_START, TOTAL)`, START = 132 layar → buffer
  ±6 putaran dua arah. Render tetap mesin lama (slot jarak-modulo,
  list 4 lipatan) — terbukti identik per putaran, jadi modulo mulus.
- Snap idle 160ms → `area.scrollTo(k*h, smooth)`; keyboard ↑↓ = k±1
  (tanpa kasus khusus batas); `jump(i)` = layar ekuivalen terdekat;
  `goTop()` = scroll ke REEL_START. Resize: scrollTop dikunci ke indeks
  layar lama. Intro fling tidak berubah (guard `flingingRef`).
- Hook dev `window.__reel = { f, y, h, screens, start, setY }` (DEV only)
  dipakai e2e.
- Klik kartu → case study, chrome, list, overlay: TIDAK berubah; stage
  kini di dalam container → wheel/tap di atas tombol tetap ter-chain ke
  container (pernah bug v2.10 di sini — `pointer-events-auto` tetap wajib).

**Verifikasi:** tsc + build bersih. E2E dirombak ke hook `__reel`
(48 assertion, +14): swipe CDP nyata (hasTouch): 10× swipe nonstop Δ
6.660px tanpa satu pun mentok; tembus wrap virtual 21→0 mulus; swipe
½ layar snap balik; swipe ≥1 layar 001→011; `window.scrollY === 0`
selamanya; desktop 10× wheel → 3,4,5,…,11,1. **48/48 PASS.**

## 21. v2.13 — re-anchor anti-mentok + resume proyek terakhir + animasi hamburger (2026-09-12)

**User:** (1) masih mentok dua arah di mobile, (2) "← semua karya" selalu
balik ke proyek 1, (3) hamburger terasa statis.

**(1) Anti-mentok lapis kedua.** Model proxy v2.12 sudah tidak menyentuh
gesture sama sekali, tapi masih punya TEPI secara teori. Sekarang:
- buffer 12→24 putaran (REEL_SCREENS = 528 layar, start di tengah);
- **re-anchor senyap**: handler scroll-idle (160ms) setelah snap — kalau
  indeks layar keluar dari pita [START, START+22], `scrollTop` dilompatkan
  1–2 putaran penuh ke dalam pita. Hanya terjadi saat user BERHENTI
  (bukan di tengah gesture → tidak perang dengan anchor browser) dan
  view-nya IDENTIK (render modulo) → 100% tak terlihat. E2e memaksa
  posisi ke 30 layar di luar pita: ditarik pulang tanpa view berubah.
  Kombinasi ini membuat tepi mustahil disentuh dari arah mana pun.

**(2) Resume.** `apply()` menulis idx ke `sessionStorage['reel:last']` tiap
ganti proyek; WorkCase menulis idx-nya saat dibuka (prev/next ikut);
mount home membaca → `scrollTop = (START+saved)*h` dan **intro fling
mengendap di `saved`** (bukan selalu 0). "← semua karya" → kembali ke
proyek terakhir dilihat. E2e: f=7 → case (store '7') → link balik →
proyek 8 tampil lagi ✓.

**(3) Animasi menu mobile.** Komponen `MenuBurger` baru (dipakai Header &
chrome home): 3 garis MORPH jadi ✕ (atas/bawah rotate ±45°, tengah fade,
transisi 0.38s cubic-bezier). MenuOverlay jadi SELALU mounted (visibility
CSS) supaya buka-dan-tutup dua-duanya dianimasikan: root fade 0.3s,
6 baris (`menu-row`: header, 4 link, footer) naik stagger 60ms
cubic-bezier(.16,1,.3,1); × punya hover rotate-90. Prop baru `onHomeTop`
(WorkOverlay 'work.' di home = anchor reel ke layar 1, bukan window.scrollTo
yang sudah tidak ada). Reduced branch: overlay keluar dari <section>
(fragment) supaya tidak dihitung sebagai layar reel.

**Verifikasi:** tsc + build bersih; e2e dirombak ke hook `__reel` penuh:
**55/55 PASS** — termasuk swipe CDP nyata menembus wrap dengan re-anchor
aktif, 10× swipe nonstop, resume proyek 8, morph ✕ + stagger 6 baris.

## 22. v2.16 — polesan motion & micro-interaction semua halaman (2026-09-12)

**Brief user (3 ronde ask_user):** fokus = poles motion/micro-interaction
(reel sudah oke); scope = SEMUA halaman; aturan desain = LOCK (paper/ink,
2 font, tanpa garis, gambar warna penuh). Plan 10 item disetujui "gas semua".

### Implementasi
1. **Home — roll angka NR & meta** (`Roll` di `WorksHuy.tsx`): nilai baru
   `.roll-in` dari bawah, lama `.roll-out` ke atas, 0,2s + stagger meta
   0,04s. Wrapper sengaja `<i class="not-italic">` BUKAN `<span>`: reader
   e2e memakai `querySelector('span')` (span pertama) &
   `querySelectorAll('span')[1]` ("/ 11") — dengan wrapper non-span, span
   pertama selalu nilai baru walau roll berjalan. Nilai lama dibuang dari
   DOM tepat setelah animasi (260ms+delay).
2. **Home — hover**: item list `group-hover:translate-x-1` + opacity naik;
   kartu reel `group-hover:scale-[1.03]` + shadow dalam (transform/shadow
   saja, layout tak berubah — geometri e2e aman).
3. **Home — cue `scroll ↓`** memantul SATU kali saat masuk (selesai <±4,5s,
   sebelum screenshot e2e pertama di 5,2s) + berhenti bila user scroll.
4. **Aturan determinisme**: roll hanya untuk gesture user. `__reel.setY`
   (hook e2e) menyet `suppressRollRef` 800ms; intro fling ikut statis
   (`skipRollRef` di- snapshot saat idx berganti). Alasan: screenshot pertama
   per halaman di headless bisa menangkap frame lama; transien apa pun saat
   itu membuat perbandingan byte-identik (B/C suite ekstra) gagal.
5. **About**: capabilities & colophon stagger per item via variants parent
   (`staggerChildren`, SATU observer di `<ul>`) + hover translate. Catatan:
   `whileInView` per-element kecil terbukti tidak konsisten menyala; pola
   parent-variants dipakai juga untuk cascade footer.
6. **Case study**: `CountUp` (IntersectionObserver + rAF, ease-out cubic,
   1,1s; suffix dipertahankan; reduced/non-numerik statis), galeri
   `group-hover:scale-[1.04]`, prev/next `translate` berlawanan arah.
7. **Journal**: judul hover translate + panah `→` slide-in memakai ulang CSS
   `.menu-arrow` (class `menu-item` di TLink baris).
8. **Footer raksasa**: cascade per huruf (parent `motion.span` variants +
   `staggerChildren` 0,045) + wave hover per huruf (`--d` per huruf,
   keyframe `wave-y-kf`). Teks utuh `sr-only` untuk screen reader.

### Verifikasi
`tsc` bersih (8 error `mobile-check2.mjs` SUDAH ADA di HEAD — file scratch
rusak, bukan regresi); build ok; **e2e 55/55 + ekstra 16/16 PASS** tanpa
menyentuh assertion (hanya markup dibuat kompatibel); cek visual: roll
tertangkap mid-animasi saat wheel user, hover list geser, wave footer naik
per huruf.

## 23. v2.17 — klik kartu mengintip = spotlight ke tengah (2026-09-12)

**Permintaan user:** klik kartu yang sedang "ngintip" (tetangga miring)
menjadikannya fokus/spotlight, menggantikan kartu di tengah.

### Implementasi (`WorksHuy.tsx`)
- Setiap slot NON-aktif kini punya overlay `button` `pointer-events-auto`
  (`aria-label="fokus: {title}"` — sengaja tanpa kata "proyek" supaya tidak
  tertangkap selector e2e list `button[aria-label*="proyek"]`). Klik →
  `jump(j)` = scroll proxy jalur terdekat → kartu berputar melurus ke
  tengah, index aktif + list + NR/meta ikut berganti (mesin lama, tanpa
  kode animasi baru).
- Slot `visibility:hidden` (|d| > PEEK) otomatis tidak menerima pointer →
  hanya kartu yang terlihat yang bisa di-spotlight.
- Kartu TENGAH tetap `buka case study …` (perilaku lama, e2e lama hijau).
- `jump()` dapat fallback reduced-motion: tanpa container proxy,
  `scrollIntoView` ke stage tujuan di section statis.
- Hover kartu ngintip kini juga hidup (scale+shadow v2.16) karena overlay
  memberi pointer-events — sekalian affordance "aku bisa diklik".

### Verifikasi
E2e +2 assertion baru (57/57): klik `fokus: AELIAN` dari f=0 → aktif "2";
kartu tengah baru klik → `/works/aelian`. Ekstra 16/16, tsc bersih (error
`mobile-check2.mjs` pre-existing), build ok, screenshot mid-transition
menunjukkan kartu ngintip melurus ke tengah sementara kartu lama keluar
miring.

## 24. v2.18 — header semua halaman selalu transparan (2026-09-12)

**Permintaan user:** header di semua halaman transparan seperti halaman
utama, biar selaras.

### Implementasi (`Header.tsx`)
- Hapus state `scrolled` + listener scroll + conditional `bg-paper` —
  header kini `bg-transparent` permanen (fade-in opacity saat mount tetap).
- Home tidak terdampak (chrome-nya bagian kanvas, memang transparan).
- Konsekuensi diterima user: konten sub-halaman lewat di bawah link nav
  saat scroll (tanpa bg solid) — konsisten dengan kanvas home yang
  chromenya melayang.

### Verifikasi
Computed `background-color` header = `rgba(0,0,0,0)` setelah scroll 600px
di /about; screenshot menunjukkan wordmark+nav melayang tanpa bar paper.
tsc bersih, build ok, e2e 57/57 + ekstra 16/16 (tak ada assertion yang
memakai bg header). README (Struktur Proyek) disinkronkan.

## 25. v2.19 — chrome home: teks vertikal dihapus, wordmark terminal prompt (2026-09-12)

**Permintaan user:** mobile sudah oke; desktop: (1) hapus teks vertikal
kiri, (2) wordmark lama kurang disukai & tidak ada asset logo — minta ide
tanpa asset. User memilih arah **terminal prompt** (dari 4 opsi: terminal /
outline raksasa / solid+outline / serif italic).

### Implementasi (`WorksHuy.tsx`, `index.css`)
- Blok teks vertikal `portfolio '26 / 11 works — jakarta, id` dihapus.
- Wordmark desktop baru: `> wah:anggaaa` lowercase (Heros medium 19px) +
  kursor blok `bg-ink/80`. Tanpa asset — murni tipografi dalam pagar desain.
- Kursor STATIS saat tiba dan berkedip hanya saat hover/focus wordmark
  (`cursor-blink 0,9s infinite` di `.group:hover .wm-cursor`): motif kedip
  sudah tampil di intro, dan e2e tidak pernah hover wordmark → frame
  screenshot byte-identik tetap deterministik. (Percobaan pertama dengan
  kedip 2× saat masuk terbukti race melawan frame basi screenshot pertama.)
- Fungsi klik wordmark tetap `goTop`; a11y label dipertahankan.

### Regresi determinisme yang ketemu & fix (v2.16 list hover)
Suite ekstra C1/C3 intermiten 14/16: diff box = dua band tipis di list
kanan — warna item list masih dalam `transition-colors duration-300`
(tambahan v2.16) saat screenshot `before` (300ms pasca setY) menangkap
ekornya. Fix: warna swap aktif TIDAK ditransisikan (instant); transisi
hanya `translate` untuk hover. Stabil 4× 16/16 sesudahnya.

### Verifikasi
tsc bersih (mobile-check2.mjs pre-existing), build ok, e2e 57/57 + ekstra
16/16 (4 run beruntun), screenshot wordmark baru dikonfirmasi user-facing.
README (fitur home) + PLAN disinkronkan.

## 26. v2.20 — wordmark pakai asset logo, bar vertikal menu dihapus (2026-09-13)

User dapat asset logo (PNG hitam-pekat, monogram "W•") dan minta wordmark
terminal prompt v2.19 **diganti asset** itu, sekalian **garis vertikal
hitam** di samping list menu desktop dihapus.

### Ekstraksi asset (`public/images/logo-wa.png`)

Asset sumber dark-on-dark: fill logo == warna background hitam, jadi isi
tak bisa direcover lewat luminance biasa — yang tertangkap hanya outline
putus-putus. Resep akhirnya: alpha = max(luminance, interior-255), dengan
interior dihitung lewat **dilate edge R=3 lalu BFS dari luar**; pixel yang
tak terjangkau BFS = interior → alpha 255. Hasil: monogram solid tinta
(13,13,12) + alpha, 479×131, bbox sumber (643,369)-(1113,491) + pad 4.
Diverifikasi visual di atas kertas via preview komposit.

### Implementasi (`WorksHuy.tsx`, `index.css`)

- `const BASE = import.meta.env.BASE_URL` (path aman di bawah subpath).
- Tombol wordmark desktop = `<img src={BASE+'images/logo-wa.png'}>`
  `h-[26px] w-auto`, `alt=""` + `aria-label` di tombol, `goTop` onClick,
  hover `opacity-70` saja (sesuai aturan: animasi transform/opacity).
- Blok menu desktop: span bar hitam vertikal + wrapper `flex items-start
  gap-3.5` dihapus — menu kini satu kolom teks saja.
- `index.css`: keyframes `cursor-blink` + rule `.wm-cursor` dihapus
  (motif kedip intro tetap punya mekanisme sendiri di Intro).
- Mobile tidak disentuh (user sudah puas).

### Verifikasi

- `npx tsc --noEmit` bersih (kecuali 8 error lama `mobile-check2.mjs`).
- e2e utama **57/57** + suite tambahan **16/16** dua run berturut-turut
  (C1/C3 byte-equal — chrome home bebas transisi warna baru).
- `npm run build` ✔. Screenshot headless: logo solid kiri-atas, bar
  vertikal gone, layout menu utuh.

## 27. v2.21 — logo monogram juga di mobile (2026-09-13)

User: "Di mobile sekalian" — asset logo yang sama dipasang di chrome home
mobile, menyeimbangkan hamburger kiri: `absolute top-5 right-4 z-10
md:hidden`, `h-[20px]`, klik = `goTop`, hover/active opacity saja. Overlay
menu (`z-[80]`) menutupinya saat terbuka.

### Clip list di bawah strip logo

List proyek mobile sebelumnya `top-0` satu kolom penuh → teks yang
bergulir lewat di bawah logo. Desktop sudah punya preseden
`md:top-[4.5rem]` + `clipTopRef 72`. Mobile kini `top-12` (48px) dengan
offset yang sama di dua rumus transform (`clipTopRef` saat animated/GSAP
dan `listStaticY` saat reduced-motion): `h/2 - 48 - (…)*itemH`. Posisi
on-screen item aktif **tidak berubah** (translateY mengecil tepat sebesar
offset container) — hanya clipping atasnya yang baru, jadi komposisi yang
disukai user tetap sama.

### Verifikasi

- `npx tsc --noEmit` bersih (kecuali 8 error lama `mobile-check2.mjs`).
- e2e utama **57/57** (termasuk semua check mobile: list tampil ITEM=60,
  kartu tidak menutupi list, hit-test, wrap, buffer, tanpa overflow-x) +
  suite tambahan **16/16**.
- `npm run build` ✔.
- Screenshot mobile dua frame berjarak 2,6s: strip logo bersih, item list
  ter-clip rapi di bawah `top-12`; hamburger kiri + logo kanan seimbang.
