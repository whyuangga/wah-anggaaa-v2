# wah:anggaaa — Redesign v2.1 · Light Editorial

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
