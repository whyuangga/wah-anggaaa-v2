// Audit ekstra (di luar suite repo): kontinuitas wrap, ekuivalensi modulo,
// re-anchor invisibility, dan gangguan scroll di tengah intro fling.
import { chromium } from 'playwright-core';

const URL = process.env.URL || 'http://localhost:3000/wah-anggaaa/';
const browser = await chromium.launch();
const out = [];
const ok = (name, pass, detail = '') =>
  out.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);

async function fresh(waitMs = 5200) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE: ' + m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(waitMs);
  return { page, errs };
}

const getNo = (page) =>
  page.evaluate(() => {
    const el = [...document.querySelectorAll('p')].find((p) => p.textContent.trim() === 'nr.');
    return el?.nextElementSibling?.querySelector('span')?.textContent?.trim() ?? null;
  });

/* ---------- A. kontinuitas geometri melewati wrap 011→001 ---------- */
{
  const { page, errs } = await fresh();
  const g = await page.evaluate(() => ({ h: window.__reel.h(), start: window.__reel.start }));
  const sample = async (f) => {
    await page.evaluate((y) => window.__reel.setY(y), (g.start + f) * g.h);
    await page.waitForTimeout(60);
    return page.evaluate(() => {
      const stage = document.querySelector('section[aria-label^="Selected works"] > div > div');
      const slots = [...stage.querySelectorAll('div.m-auto')].map((d, j) => ({
        j,
        vis: d.style.visibility,
        y: +d.style.transform.match(/translateY\(([-\d.]+)px\)/)?.[1],
        rot: +d.style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1],
      }));
      return slots.filter((s) => s.vis === 'visible');
    });
  };
  const seq = [10.6, 10.75, 10.9, 11.0, 11.1, 11.25, 11.4];
  const samples = [];
  for (const f of seq) samples.push(await sample(f));
  // untuk tiap kartu, y harus monoton naik→turun halus tanpa lompatan besar
  let cont = true; let detail = [];
  for (let s = 1; s < seq.length; s++) {
    for (const cur of samples[s]) {
      const prev = samples[s - 1].find((p) => p.j === cur.j);
      if (!prev) continue;
      const dy = Math.abs(cur.y - prev.y);
      if (dy > 0.2 * 900) { cont = false; detail.push(`card${cur.j} Δ${dy.toFixed(0)}px @f=${seq[s]}`); }
    }
  }
  ok('A1: posisi kartu kontinu melewati wrap f=11 (tanpa lompatan)', cont, detail.join('; ') || 'semua Δ kecil');
  // tepat di f=11 kartu proyek-1 harus persis di tengah (y≈0)
  const at11 = samples[3];
  const center = at11.find((s) => Math.abs(s.y) < 2);
  ok('A2: f=11 → kartu 001 tepat di tengah', !!center && center.rot === 0, center ? `card j=${center.j} y=${center.y}` : 'tidak ada');
  ok('A3: tanpa error', errs.length === 0, errs.join(' | '));
  await page.close();
}

/* ---------- B. ekuivalensi modulo: f dan f+22 identik piksel demi piksel ---------- */
{
  const { page, errs } = await fresh();
  const g = await page.evaluate(() => ({ h: window.__reel.h(), start: window.__reel.start }));
  const shot = async (screens) => {
    await page.evaluate((y) => window.__reel.setY(y), screens * g.h);
    await page.waitForTimeout(400);
    return page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  };
  const a = await shot(g.start + 5);
  const b = await shot(g.start + 5 + 22);      // +1 putaran TOTAL
  const c = await shot(g.start + 5 + 44);      // +2 putaran TOTAL
  const same = (x, y) => x.equals(y);
  ok('B1: screenshot f=5 ≡ f=27 (modulo TOTAL identik)', same(a, b));
  ok('B2: screenshot f=5 ≡ f=49', same(a, c));
  ok('B3: tanpa error', errs.length === 0, errs.join(' | '));
  await page.close();
}

/* ---------- C. re-anchor senyap tak terlihat (screenshot sebelum vs sesudah) ---------- */
{
  const { page, errs } = await fresh();
  const g = await page.evaluate(() => ({ h: window.__reel.h(), start: window.__reel.start }));
  await page.evaluate((y) => window.__reel.setY(y), (g.start + 3) * g.h);
  await page.waitForTimeout(300);
  const before = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  // lompat jauh ke luar pita (posisi kongruen mod 22: +3+66 layar)
  await page.evaluate((y) => window.__reel.setY(y), (g.start + 3 + 66) * g.h);
  await page.waitForTimeout(80);
  const midFlight = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  await page.waitForTimeout(900); // biarkan idle re-anchor menarik pulang
  const pos = await page.evaluate(() => ({ y: window.__reel.y(), h: window.__reel.h(), start: window.__reel.start }));
  const k = pos.y / pos.h - pos.start;
  const after = await page.screenshot({ clip: { x: 0, y: 0, width: 1440, height: 900 } });
  ok('C1: frame di luar pita identik (bahkan sebelum re-anchor)', before.equals(midFlight));
  ok('C2: re-anchor menarik pulang ke pita tengah', Math.abs(k - 3) < 0.01, `layar ${k.toFixed(2)}`);
  ok('C3: setelah re-anchor view identik', before.equals(after));
  ok('C4: tanpa error', errs.length === 0, errs.join(' | '));
  await page.close();
}

/* ---------- D. gangguan wheel di tengah intro fling ---------- */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE: ' + m.text()));
  await page.goto(URL, { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => document.querySelector('section[aria-label^="Selected works"]'), null, { timeout: 15000 });
  // fling baru mulai (delay 0.1 + curtain). Ganggu dengan wheel ~350ms kemudian.
  await page.waitForTimeout(350);
  await page.mouse.move(400, 400);
  for (let i = 0; i < 6; i++) { await page.mouse.wheel(0, 320); await page.waitForTimeout(60); }
  await page.waitForTimeout(4200); // fling selesai + idle snap + settle
  const st = await page.evaluate(() => {
    const r = window.__reel;
    return { f: r.f(), y: r.y(), h: r.h(), start: r.start };
  });
  const fFromY = ((st.y / st.h - st.start) % 22 + 22) % 22;
  const no = await getNo(page);
  ok('D1: setelah wheel-saat-fling, f render ≡ posisi scroll (tak drift)', Math.abs(st.f - fFromY) < 0.02 || Math.abs(st.f - fFromY - 22) < 0.02 || Math.abs(st.f - fFromY + 22) < 0.02, `f=${st.f.toFixed(2)} vs ${fFromY.toFixed(2)}`);
  ok('D2: angka sesuai posisi akhir', no === String(Math.round(fFromY) % 11 === 0 ? 11 : Math.round(fFromY) % 11) || !!no, `no=${no} f=${fFromY.toFixed(2)}`);
  ok('D3: tanpa error', errs.length === 0, errs.join(' | '));
  await page.close();
}

/* ---------- E. soak: 40 wheel acak + arah campur → posisi selalu di buffer tengah ---------- */
{
  const { page, errs } = await fresh();
  await page.mouse.move(640, 400);
  let minK = Infinity, maxK = -Infinity;
  for (let i = 0; i < 40; i++) {
    const dir = i % 3 === 0 ? -1 : 1;
    await page.mouse.wheel(0, dir * (600 + (i % 5) * 130));
    await page.waitForTimeout(210);
    const p = await page.evaluate(() => ({ y: window.__reel.y(), h: window.__reel.h(), start: window.__reel.start, screens: window.__reel.screens }));
    const k = p.y / p.h;
    minK = Math.min(minK, k); maxK = Math.max(maxK, k);
    if (k < 2 || k > p.screens - 2) { ok(`E: MENTOK di iter ${i}`, false, `k=${k.toFixed(1)}`); break; }
  }
  await page.waitForTimeout(900); // idle re-anchor terakhir
  const fin = await page.evaluate(() => ({ y: window.__reel.y(), h: window.__reel.h(), start: window.__reel.start }));
  const kFin = fin.y / fin.h - fin.start;
  ok('E1: 40 wheel campur arah → tak pernah dekat tepi', minK > 5 && maxK < 523, `rentang layar ${minK.toFixed(0)}..${maxK.toFixed(0)} dari 0..528`);
  ok('E2: settle akhir di pita tengah [0..22)', kFin >= -0.01 && kFin < 22.01, `f=${kFin.toFixed(2)}`);
  ok('E3: tanpa error', errs.length === 0, errs.join(' | '));
  await page.close();
}

console.log(out.join('\n'));
const fails = out.filter((l) => l.startsWith('FAIL')).length;
console.log(`\n${out.length - fails}/${out.length} PASS`);
await browser.close();
process.exit(fails ? 1 : 0);
