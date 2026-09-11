import { chromium } from 'playwright-core';

const URL = process.env.URL || 'http://localhost:3000/wah-anggaaa/';
const SHOTS = process.env.SHOTS || '.shots';
import { mkdirSync } from 'node:fs';
mkdirSync(SHOTS, { recursive: true });
const H = 900, W = 1440, N = 11, TOTAL = 22, ITEM = 84;

const browser = await chromium.launch();
const out = [];
const ok = (name, pass, detail = '') =>
  out.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);

async function fresh(reducedMotion) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, reducedMotion });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE: ' + m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3300); // intro scramble + curtain
  return { page, errs };
}

/* ================= MODE ANIMASI ================= */
const { page, errs } = await fresh('no-preference');

const geo = await page.evaluate(() => {
  const sec = document.querySelector('section[aria-label^="Selected works"]');
  const stage = sec.querySelector(':scope > div');
  const r = sec.getBoundingClientRect();
  return { top: window.scrollY + r.top, h: stage.clientHeight };
});
const Y = (f) => geo.top + f * geo.h;

const scrollToF = async (f, settleMs = 90) => {
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), Y(f));
  await page.waitForTimeout(settleMs);
};

const state = () =>
  page.evaluate(({ W, H }) => {
    const sec = document.querySelector('section[aria-label^="Selected works"]');
    const stage = sec.querySelector(':scope > div');
    const nrEl = [...stage.querySelectorAll('p')]
      .find((p) => p.className.includes('lbl') && p.textContent.trim().startsWith('nr.'))
      ?.nextElementSibling;
    const activeNo = nrEl?.querySelector('span')?.textContent?.trim();
    const totalNo = nrEl?.querySelectorAll('span')[1]?.textContent?.trim();
    const slots = [...stage.querySelectorAll('div.m-auto')].map((d) => {
      const r = d.getBoundingClientRect();
      return { vis: d.style.visibility, tf: d.style.transform, cy: r.top + r.height / 2 };
    });
    const listInner = stage.querySelector('div[class*="max-w-\\[320px\\]"] > div');
    const btns = [...stage.querySelectorAll('button[aria-label*="proyek"]')];
    const activeBtn = btns[11 + (parseInt(activeNo, 10) - 1)];
    const abRect = activeBtn?.getBoundingClientRect();
    const hitAt = (y) => {
      const el = document.elementFromPoint(W - 110, y);
      return el?.closest?.('button[aria-label*="proyek"]')?.getAttribute('aria-label') ?? null;
    };
    return {
      activeNo, totalNo, slots, listTf: listInner?.style.transform ?? '',
      nBtns: btns.length, activeBtnTop: abRect ? abRect.top + abRect.height / 2 : null,
      hitTop: hitAt(90), hitBottom: hitAt(H - 40),
    };
  }, { W, H });

const rot = (tf) => +(tf.match(/rotate\(([-\d.]+)deg\)/)?.[1] ?? NaN);
const tyv = (tf) => +(tf.match(/translateY\(([-\d.]+)px\)/)?.[1] ?? NaN);

// ---- 1. reel geometri di f=0 ----
await scrollToF(0);
let s = await state();
ok('awal: nomor aktif = 001 (bukan substring)', s.activeNo === '001' && s.totalNo === '/ 011', `${s.activeNo} ${s.totalNo}`);
ok('011 ngintip di atas, 002 di bawah', s.slots[10].vis === 'visible' && s.slots[10].cy < 30 && s.slots[1].vis === 'visible' && s.slots[1].cy > H - 30, `${s.slots[10].cy.toFixed(0)}/${s.slots[1].cy.toFixed(0)}`);
ok('kartu tengah tegak 0°, tetangga ±5,5°', rot(s.slots[0].tf) === 0 && Math.abs(rot(s.slots[10].tf) - 5.5) < 0.02 && Math.abs(rot(s.slots[1].tf) + 5.5) < 0.02);
const geoOK = s.slots[0];
// aspek + spacing via bounding rect penuh
const rect0 = await page.evaluate(() => {
  const d = document.querySelector('section[aria-label^="Selected works"] div.m-auto');
  const r = d.getBoundingClientRect();
  return { w: r.width, h: r.height };
});
ok('aspek kartu portrait 5:6', Math.abs(rect0.w / rect0.h - 5 / 6) < 0.02, (rect0.w / rect0.h).toFixed(3));
ok('spacing antar kartu = 0,55×h', Math.abs(s.slots[1].cy - H / 2 - 0.55 * geo.h) < 2, `${(s.slots[1].cy - H / 2).toFixed(0)}px`);

// ---- 2. list kanan ----
ok('list = 3 lipatan (33 item)', s.nBtns === 3 * N, s.nBtns);
ok('item aktif ter-center di 450 (perilaku v2.7)', Math.abs(s.activeBtnTop - H / 2) < 2, String(s.activeBtnTop));
ok('list terisi di atas & bawah (looping)', s.hitTop !== null && s.hitBottom !== null, `${s.hitTop} / ${s.hitBottom}`);
const aboveLbl = await page.evaluate((n) => {
  const btns = [...document.querySelectorAll('button[aria-label*="proyek"]')];
  return btns[n - 1]?.getAttribute('aria-label');
}, N);
ok('tepat di atas item aktif = 011 (wrap terlihat)', /011/.test(aboveLbl ?? ''), aboveLbl);

// ---- 3. mid-transition ----
await scrollToF(0.5);
s = await state();
ok('f=0.5: rotasi simetris +2,75/−2,75 & posisi atas/bawah', Math.abs(rot(s.slots[0].tf) - 2.75) < 0.05 && Math.abs(rot(s.slots[1].tf) + 2.75) < 0.05 && s.slots[0].cy < H / 2 && s.slots[1].cy > H / 2, `${rot(s.slots[0].tf)}/${rot(s.slots[1].tf)}`);

// ---- 4. wrap forward: f=10..12 = 011 → 001 → 002 ----
await scrollToF(10);
s = await state();
ok('f=10 → aktif 011', s.activeNo === '011', s.activeNo);
await scrollToF(11);
s = await state();
ok('f=11 → aktif 001 LAGI (wrap mulus, no rewind)', s.activeNo === '001', s.activeNo);
ok('f=11: 001 di tengah, 011 ngintip atas, 002 ngintip bawah', Math.abs(s.slots[0].cy - H / 2) < 2 && s.slots[10].vis === 'visible' && Math.abs(s.slots[10].cy - (H / 2 - 0.55 * geo.h)) < 2 && s.slots[1].vis === 'visible' && Math.abs(s.slots[1].cy - (H / 2 + 0.55 * geo.h)) < 2,
  `001cy=${s.slots[0].cy.toFixed(0)} 011cy=${s.slots[10].cy.toFixed(0)} 002cy=${s.slots[1].cy.toFixed(0)}`);
await scrollToF(11.5);
s = await state();
ok('f=11.5 (001→002): rotasi simetris lagi', Math.abs(rot(s.slots[0].tf) - 2.75) < 0.05 && Math.abs(rot(s.slots[1].tf) + 2.75) < 0.05, `${rot(s.slots[0].tf)}/${rot(s.slots[1].tf)}`);
await scrollToF(12);
s = await state();
ok('f=12 → aktif 002 (lanjut, bukan rewind)', s.activeNo === '002', s.activeNo);

// ---- 5. wrap backward: dari 001 (f=11) ArrowUp → 011 ----
await scrollToF(11); await page.waitForTimeout(1100);
s = await state();
ok('sebelum ArrowUp: 001 aktif (wrap point)', s.activeNo === '001', s.activeNo);
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(1500);
s = await state();
ok('ArrowUp dari 001 (putaran-2) → 011 (LOOP BELAKANG)', s.activeNo === '011', s.activeNo);

// ---- 6. snap idle ----
await scrollToF(4.37, 40);
await page.waitForTimeout(1100);
s = await state();
ok('snap otomatis (f=4.37 → step4 = 005)', s.activeNo === '005', s.activeNo);

// ---- 7. klik list = putaran terdekat ----
await scrollToF(12); await page.waitForTimeout(1100); // 002
await page.evaluate((n) => {
  const btns = [...document.querySelectorAll('button[aria-label*="proyek"]')];
  btns[2 * n + 10].click(); // 011 di lipatan-3
}, N);
await page.waitForTimeout(1800);
s = await state();
ok('klik 011 dari 002 → lompat terdekat', s.activeNo === '011', s.activeNo);
const yAfter = await page.evaluate(() => window.scrollY);
ok('jarak lompat = jalur TERDEKAT (002→011 mundur 2 langkah, bukan maju 9)', Math.abs(yAfter - Y(10)) < 30, `y=${(yAfter - geo.top).toFixed(0)} vs target ${(10 * geo.h).toFixed(0)}`);

// ---- 8. ujung ----
await scrollToF(TOTAL);
s = await state();
ok('f=22 → 001 lagi (2 putaran penuh)', s.activeNo === '001', s.activeNo);
ok('list di ujung tetap terisi penuh (translateY −2436)', /^translateY\(-2436(\.\d)?px\)$/.test(s.listTf), s.listTf);
const afterEnd = await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' }) ?? window.scrollY);
await page.waitForTimeout(350);
const yEnd = await page.evaluate(() => window.scrollY);
ok('tidak ada jebakan: scroll lanjut melepas pin', yEnd >= Y(TOTAL) - 2, String(yEnd));

// ---- 9. screenshot bukti ----
await scrollToF(0, 60); await page.waitForTimeout(450);
await page.screenshot({ path: SHOTS + '/01-start.png' });
await scrollToF(11, 60); await page.waitForTimeout(450);
await page.screenshot({ path: SHOTS + '/02-wrap-001.png' });
await scrollToF(10.5, 60);
await page.screenshot({ path: SHOTS + '/03-transition.png' });
await scrollToF(3, 60); await page.waitForTimeout(450);
await page.screenshot({ path: SHOTS + '/04-item004.png' });
ok('tanpa console/page error (mode animasi)', errs.length === 0, errs.join(' | '));
await page.close();

/* ================= MODE REDUCED MOTION ================= */
{
  const { page: p2, errs: e2 } = await fresh('reduce');
  const n = await p2.evaluate(() => document.querySelectorAll('section[aria-label="Selected works"] .m-auto').length);
  const stages = await p2.evaluate(() => document.querySelectorAll('section[aria-label="Selected works"] > div').length);
  ok('reduced: 11 layar statis tanpa pin', stages === 11 && n === 121, `stages=${stages} slots=${n}`);
  ok('reduced: tanpa error', e2.length === 0, e2.join(' | '));
  await p2.close();
}

/* ================= MODE MOBILE ================= */
{
  const m = await browser.newPage({ viewport: { width: 390, height: 740 } });
  const em = [];
  m.on('pageerror', (e) => em.push(String(e)));
  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.waitForTimeout(3300);
  const mg = await m.evaluate(() => {
    const sec = document.querySelector('section[aria-label^="Selected works"]');
    const stage = sec.querySelector(':scope > div');
    const r = sec.getBoundingClientRect();
    const mid = stage.querySelector('div.m-auto').getBoundingClientRect();
    return { top: window.scrollY + r.top, h: stage.clientHeight, cardW: mid.width, vw: innerWidth, docW: document.documentElement.scrollWidth };
  });
  await m.evaluate((y) => window.scrollTo({ top: y, behavior: 'auto' }), mg.top + 11 * mg.h);
  await m.waitForTimeout(400);
  const mNo = await m.evaluate(() => [...document.querySelectorAll('span')].map(s => s.textContent).find(t => /^0\d\d$/.test(t)));
  ok('mobile: wrap juga jalan di 390px (011→001)', mNo === '001', mNo);
  ok('mobile: tanpa overflow horizontal', mg.docW <= mg.vw + 1, `doc=${mg.docW} vw=${mg.vw}`);
  const nrClear = await m.evaluate(() => {
    const el = document.elementFromPoint(60, innerHeight - 60);
    return !(el?.closest?.('div.m-auto')); // angka NR harus di ATAS kartu reel
  });
  ok('mobile: kartu tetangga tidak menutupi angka NR (z-order chrome)', nrClear);
  await m.screenshot({ path: SHOTS + '/05-mobile-wrap.png' });
  ok('mobile: tanpa error', em.length === 0, em.join(' | '));
  await m.close();
}

console.log(out.join('\n'));
const fails = out.filter((l) => l.startsWith('FAIL')).length;
console.log(`\n${out.length - fails}/${out.length} PASS`);
await browser.close();
process.exit(fails ? 1 : 0);
