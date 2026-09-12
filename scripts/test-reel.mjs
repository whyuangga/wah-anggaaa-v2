import { mkdirSync } from 'node:fs';
import { chromium } from 'playwright-core';

const URL = process.env.URL || 'http://localhost:3000/wah-anggaaa/';
const SHOTS = process.env.SHOTS || '.shots';
mkdirSync(SHOTS, { recursive: true });
const H = 900, W = 1440, N = 11, TOTAL = 22;
const MOBILE_H = 740, MOBILE_W = 390;

const browser = await chromium.launch();
const out = [];
const ok = (name, pass, detail = '') =>
  out.push(`${pass ? 'PASS' : 'FAIL'}  ${name}${detail ? '  — ' + detail : ''}`);

async function fresh(reducedMotion, waitMs = 5200) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, reducedMotion });
  const errs = [];
  page.on('pageerror', (e) => errs.push('PAGEERROR: ' + e.message));
  page.on('console', (m) => m.type() === 'error' && errs.push('CONSOLE: ' + m.text()));
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(waitMs); // intro scramble+curtain + fling selesai
  return { page, errs };
}

/* ================= DESKTOP (post-fling) ================= */
const { page, errs } = await fresh('no-preference');
const geo = await page.evaluate(() => {
  const r = window.__reel;
  if (!r) throw new Error('__reel hook tidak ada (dev mode?)');
  return { top: 0, h: r.h(), start: r.start, screens: r.screens };
});
const Y = (f) => (geo.start + f) * geo.h; // scrollTop container, bukan window
const scrollToF = async (f, settleMs = 140) => {
  await page.evaluate((y) => window.__reel.setY(y), Y(f));
  await page.waitForTimeout(settleMs);
};
const winScroll = () => page.evaluate(() => window.scrollY);
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
    const listInner = stage.querySelector('div[class*="max-w-\\[320px\\]"] > div') ||
      [...stage.querySelectorAll('div')].find((d) => d.className.includes('overflow-hidden') && d.children.length === 1 && d.querySelector(':scope > div').children.length === 33)?.firstElementChild;
    const btns = [...stage.querySelectorAll('button[aria-label*="proyek"]')];
    const abRect = btns[11 + (parseInt(activeNo, 10) - 1)]?.getBoundingClientRect();
    const hitAt = (y) => document.elementFromPoint(W - 110, y)?.closest?.('button[aria-label*="proyek"]')?.getAttribute('aria-label') ?? null;
    const caseStudyGone = ![...stage.querySelectorAll('*')].some((p) => p.children.length === 0 && /case study/i.test(p.textContent));
    return {
      activeNo, totalNo, slots,
      listTf: listInner?.style.transform ?? '',
      nBtns: btns.length,
      activeBtnCenter: abRect ? abRect.top + abRect.height / 2 : null,
      activeBtnH: abRect ? abRect.height : null,
      hitTop: hitAt(90), hitBottom: hitAt(H - 40),
      caseStudyGone,
    };
  }, { W, H });
const rot = (tf) => +(tf.match(/rotate\(([-\d.]+)deg\)/)?.[1] ?? NaN);

// ---- 0. baris case study / live website hilang ----
{
  const s0 = await state();
  ok('baris "case study → / live website ↗" dihapus', s0.caseStudyGone);
}

// ---- 1. reel geometri ----
await scrollToF(0);
let s = await state();
ok('awal: angka aktif = "1" (tanpa zero-pad)', s.activeNo === '1' && s.totalNo === '/ 11', `${s.activeNo} ${s.totalNo}`);
ok('011 ngintip atas, 002 di bawah', s.slots[10].vis === 'visible' && s.slots[10].cy < 30 && s.slots[1].vis === 'visible' && s.slots[1].cy > H - 30);
ok('tengah 0°, tetangga ±5,5°', rot(s.slots[0].tf) === 0 && Math.abs(rot(s.slots[10].tf) - 5.5) < 0.02);

// ---- 2. list desktop ----
ok('list 4 lipatan (44 item), ITEM=84', s.nBtns === 44 && s.activeBtnH === 84, `${s.nBtns} item, h=${s.activeBtnH}`);
ok('item aktif ter-center di 450', Math.abs(s.activeBtnCenter - H / 2) < 2, String(s.activeBtnCenter));
ok('list terisi atas & bawah', s.hitTop !== null && s.hitBottom !== null);

// ---- 3. wrap & loop (regresi v2.8, dengan format angka baru) ----
await scrollToF(10);
s = await state();
ok('f=10 → aktif 11', s.activeNo === '11', s.activeNo);
await scrollToF(11);
s = await state();
ok('f=11 → aktif 1 LAGI (wrap mulus)', s.activeNo === '1', s.activeNo);
await scrollToF(12);
s = await state();
ok('f=12 → 2 (lanjut, no rewind)', s.activeNo === '2', s.activeNo);
await scrollToF(11); await page.waitForTimeout(1100);
await page.keyboard.press('ArrowUp');
await page.waitForTimeout(1500);
s = await state();
ok('ArrowUp dari 1 (wrap) → 11 (loop belakang)', s.activeNo === '11', s.activeNo);

// ---- 4. snap & jump ----
await scrollToF(4.37, 40);
await page.waitForTimeout(1100);
s = await state();
ok('snap f=4.37 → 5', s.activeNo === '5', s.activeNo);
await scrollToF(12); await page.waitForTimeout(1100);
await page.evaluate((n) => {
  document.querySelectorAll('button[aria-label*="proyek"]')[2 * n + 10].click();
}, N);
await page.waitForTimeout(1800);
s = await state();
ok('klik 11 dari 2 → jalur terdekat', s.activeNo === '11', s.activeNo);
const yAfter = await page.evaluate(() => window.__reel.y());
ok('lompat = mundur 2 langkah (bukan maju 9)', Math.abs(yAfter - Y(10)) < 30, `y=${yAfter.toFixed(0)} vs ${Y(10)}`);
ok('window TIDAK pernah scroll (model proxy)', (await winScroll()) === 0);

// ---- 4b. klik kartu tengah → case study ----
await scrollToF(0, 40);
await page.waitForTimeout(1100);
await page.click('button[aria-label^="buka case study"]'); // kartu aktif
await page.waitForTimeout(2600); // curtain transisi
const casePath = await page.evaluate(() => location.pathname);
ok('klik kartu tengah → /works/lexier', casePath.includes('/works/lexier'), casePath);
await page.waitForSelector('h1', { timeout: 8000 });
const caseLayout = await page.evaluate(() => {
  const sec = document.querySelector('section');
  const img = sec.querySelector('img');
  const h1 = sec.querySelector('h1');
  const back = [...sec.querySelectorAll('a,button')].some((b) => b.textContent.includes('semua karya'));
  return {
    photoTop: img?.getBoundingClientRect().top,
    titleTop: h1?.getBoundingClientRect().top,
    back,
    // fokus-blur: hero wrapper punya animasi filter (gsap/motion set inline)
    heroFilter: getComputedStyle(img.parentElement).filter || '(none)',
  };
});
ok('case: foto di ATAS, judul+deskripsi di bawah', caseLayout.photoTop < caseLayout.titleTop, `img y=${caseLayout.photoTop?.toFixed(0)} < h1 y=${caseLayout.titleTop?.toFixed(0)}`);
ok('case: link balik "← semua karya" ada', caseLayout.back === true);
await page.screenshot({ path: SHOTS + '/10-case-focus.png' });
await page.goBack({ waitUntil: 'networkidle' }).catch(() => {});
await page.waitForSelector('section[aria-label^="Selected works"]', { timeout: 20000 });
await page.waitForTimeout(2600); // fling ulang di home → tunggu settle penuh

// ---- 4c. desktop: wheel-UP di 001 → buffer menyerap, proyek mundur ----
await scrollToF(0);
await page.waitForTimeout(1100);
await page.mouse.move(640, 400);
await page.mouse.wheel(0, -900);
await page.waitForTimeout(500);
s = await state();
ok('wheel-up di 001 → 011 (tidak mentok di pucuk)', s.activeNo === '11', s.activeNo);

// ---- 5. dua arah tanpa batas + error ----
await scrollToF(TOTAL);
s = await state();
ok('f=22 → 1 lagi', s.activeNo === '1', s.activeNo);
const yMaxCheck = await page.evaluate(() => ({ y: window.__reel.y(), screens: window.__reel.screens, h: window.__reel.h() }));
ok('posisi jauh dari tepi container (buffer, bukan recenter)', yMaxCheck.y < (yMaxCheck.screens - 5) * yMaxCheck.h, `y=${(yMaxCheck.y / yMaxCheck.h).toFixed(1)} dari ${yMaxCheck.screens} layar`);
// wheel-down menembus batas virtual 22 → lanjut muter, tanpa clamp
await page.mouse.wheel(0, 900);
await page.waitForTimeout(500);
s = await state();
ok('wheel-down menembus loop (lanjut muter)', s.activeNo === '2', s.activeNo);
// 10× wheel penuh nonstop → angka berputar terus, tidak pernah nyangkut
const seen = [];
for (let i = 0; i < 10; i++) {
  await page.mouse.wheel(0, 950);
  await page.waitForTimeout(340);
  seen.push((await state()).activeNo);
}
ok('10× wheel nonstop → tidak ada yang mentok (semua berganti)', new Set(seen).size >= 8, seen.join(','));
// ArrowDown pun lanjut
await page.keyboard.press('ArrowDown');
await page.waitForTimeout(1600);
const sEnd = await state();
ok('ArrowDown → lanjut (bukan stuck)', !['', null].includes(sEnd.activeNo), sEnd.activeNo);
ok('desktop: tanpa error', errs.length === 0, errs.join(' | '));

// screenshot
await scrollToF(11, 60); await page.waitForTimeout(400);
await page.screenshot({ path: SHOTS + '/07-desktop-wrap.png' });
await page.close();

/* ================= INTRO FLING ================= */
{
  const p = await browser.newPage({ viewport: { width: W, height: H } });
  await p.goto(URL, { waitUntil: 'domcontentloaded' });
  // tunggu kanvas ter-mount (intro selesai) → sampling rapat saat fling
  await p.waitForFunction(() => document.querySelector('section[aria-label^="Selected works"]'), null, { timeout: 15000 });
  const seq = [];
  for (let i = 0; i < 24; i++) {
    await p.waitForTimeout(100);
    const n = await p.evaluate(() => {
      const st = document.querySelector('section[aria-label^="Selected works"]');
      if (!st) return null;
      const el = [...st.querySelectorAll('p')].find((p) => p.className.includes('lbl') && p.textContent.trim().startsWith('nr.'));
      return el?.nextElementSibling?.querySelector('span')?.textContent?.trim() ?? null;
    });
    if (n) seq.push(n);
  }
  await p.waitForTimeout(3000);
  const final = await p.evaluate(() => {
    const el = [...document.querySelectorAll('p')].find((p) => p.className.includes('lbl') && p.textContent.trim().startsWith('nr.'));
    return el?.nextElementSibling?.querySelector('span')?.textContent?.trim();
  });
  const unique = new Set(seq);
  ok('intro fling: reel berputar cepat saat load (≥4 proyek berbeda terlihat)', unique.size >= 4, [...unique].join(','));
  ok('intro fling: mengendap di proyek 1', final === '1', final);
  await p.screenshot({ path: SHOTS + '/08-settled.png' });
  await p.close();
}

/* ================= MOBILE ================= */
{
  const m = await browser.newPage({ viewport: { width: MOBILE_W, height: MOBILE_H } });
  const em = [];
  m.on('pageerror', (e) => em.push(String(e)));
  await m.goto(URL, { waitUntil: 'networkidle' });
  await m.waitForTimeout(5200);
  const mg = await m.evaluate(() => {
    const r = window.__reel;
    return { top: 0, h: r.h(), start: r.start, vw: innerWidth, docW: document.documentElement.scrollWidth };
  });
  await m.evaluate((y) => window.__reel.setY(y), mg.start * mg.h);
  await m.waitForTimeout(400);
  const mstate = await m.evaluate(({ W }) => {
    const st = document.querySelector('section[aria-label^="Selected works"] > div > div');
    const card = st.querySelector('div.m-auto').getBoundingClientRect();
    const btn = st.querySelector('button[aria-label*="proyek"]')?.getBoundingClientRect();
    const btns = [...st.querySelectorAll('button[aria-label*="proyek"]')];
    const ab = btns[11]?.getBoundingClientRect();
    const nrEl = [...st.querySelectorAll('p')].find((p) => p.textContent.trim() === 'nr.');
    const activeNo = nrEl?.nextElementSibling?.querySelector('span')?.textContent?.trim();
    const hit = document.elementFromPoint(W - 60, 370)?.closest?.('button[aria-label*="proyek"]')?.getAttribute('aria-label') ?? null;
    return {
      cardRight: card.right, cardW: card.width, listLeft: btn?.left ?? null, listH: btn?.height ?? null,
      listVisible: btns.length === 44 && ab ? Math.abs(ab.top + ab.height / 2 - 370) < 2 : false,
      activeNo, hit,
      overlaps: btn ? card.right > btn.left + 1 : false,
    };
  }, { W: MOBILE_W });
  ok('mobile: list judul tampil (44 item, ITEM=60)', mstate.listVisible && mstate.listH === 60, `h=${mstate.listH}`);
  ok('mobile: kartu reel tidak menutupi list', !mstate.overlaps, `cardRight=${mstate.cardRight?.toFixed(0)} listLeft=${mstate.listLeft?.toFixed(0)}`);
  ok('mobile: kartu kecil (≤48vw)', mstate.cardW <= MOBILE_W * 0.48 + 2, `${mstate.cardW.toFixed(0)}px`);
  ok('mobile: angka = "1" tanpa zero-pad', mstate.activeNo === '1', mstate.activeNo);
  ok('mobile: hit-test list = button proyek', mstate.hit !== null, mstate.hit);
  await m.evaluate((y) => window.__reel.setY(y), (mg.start + 11) * mg.h);
  await m.waitForTimeout(400);
  const wrapNo = await m.evaluate(() => {
    const st = document.querySelector('section[aria-label^="Selected works"] > div > div');
    const nrEl = [...st.querySelectorAll('p')].find((p) => p.textContent.trim() === 'nr.');
    return nrEl?.nextElementSibling?.querySelector('span')?.textContent?.trim();
  });
  ok('mobile: wrap tetap jalan (f=11 → 1)', wrapNo === '1', wrapNo);
  ok('mobile: tanpa overflow horizontal', mg.docW <= mg.vw + 1, `doc=${mg.docW}`);
  await m.evaluate((y) => window.__reel.setY(y), (mg.start + 3) * mg.h);
  await m.waitForTimeout(500);
  await m.screenshot({ path: SHOTS + '/09-mobile-labels.png' });
  ok('mobile: tanpa error', em.length === 0, em.join(' | '));
  await m.close();
}

/* ================= ABOUT (tanpa portrait) + HAMBURGER SEMUA HALAMAN ================= */
{
  const a = await browser.newPage({ viewport: { width: MOBILE_W, height: MOBILE_H } });
  await a.goto(URL + 'about/', { waitUntil: 'networkidle' });
  await a.waitForTimeout(3400);
  const aboutState = await a.evaluate(() => ({
    portrait: !!document.querySelector('img[alt*="Portrait" i]') || !!document.body.textContent.includes('portrait — soon'),
    burger: !!document.querySelector('button[aria-label="buka menu"]'),
  }));
  ok('about: foto portrait hilang', !aboutState.portrait);
  ok('about (mobile): hamburger ada', aboutState.burger === true);
  if (aboutState.burger) {
    await a.click('button[aria-label="buka menu"]');
    await a.waitForTimeout(250);
    const overlay = await a.evaluate(() => ({
      hasWork: [...document.querySelectorAll('button')].some((b) => b.textContent.trim().includes('work.')),
      hasClose: !!document.querySelector('button[aria-label="tutup menu"]'),
    }));
    ok('about (mobile): overlay menu identik home (work/about/contact/journal + tutup)', overlay.hasWork && overlay.hasClose);
    await a.screenshot({ path: SHOTS + '/11-mobile-menu-about.png' });
  }
  await a.close();
}

/* ================= MOBILE TOUCH — swipe sejati (CDP), model proxy ================= */
{
  const ctx = await browser.newContext({ viewport: { width: MOBILE_W, height: MOBILE_H }, hasTouch: true });
  const tpage = await ctx.newPage();
  const terrs = [];
  tpage.on('pageerror', (e) => terrs.push(String(e)));
  await tpage.goto(URL, { waitUntil: 'networkidle' });
  await tpage.waitForTimeout(5200);
  const tg = await tpage.evaluate(() => ({ h: window.__reel.h(), start: window.__reel.start, screens: window.__reel.screens, winScrollY: window.scrollY }));
  ok('touch: window tidak dipakai untuk scroll (proxy container)', tg.winScrollY === 0);
  const TY = (f) => (tg.start + f) * tg.h;
  const cdp = await ctx.newCDPSession(tpage);
  const swipe = async (fromY, toY, steps = 10, x = 195) => {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: fromY }] });
    for (let i = 1; i <= steps; i++) {
      await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: fromY + ((toY - fromY) * i) / steps }] });
      await new Promise((r) => setTimeout(r, 18));
    }
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    await new Promise((r) => setTimeout(r, 700));
  };
  const getY = () => tpage.evaluate(() => window.__reel.y());
  const getNo = () =>
    tpage.evaluate(() => {
      const el = [...document.querySelectorAll('p')].find((p) => p.textContent.trim() === 'nr.');
      return el?.nextElementSibling?.querySelector('span')?.textContent?.trim() ?? null;
    });

  // (a) menembus batas virtual f=22: swipe panjang dari dekat 22 → wrap ke 001
  await tpage.evaluate((y) => window.__reel.setY(y), TY(21));
  await tpage.waitForTimeout(250);
  await swipe(650, -350); // jari naik ±1000px = >1 layar
  ok('touch: swipe menembus batas virtual → wrap mulus', (await getNo()) === '1', String(await getNo()));
  ok('touch: scrollTop lanjut (tidak clamp di tepi)', (await getY()) > TY(21) + 500, String(await getY()));

  // (b) 10 swipe panjang nonstop ke bawah: tidak pernah mentok di mana pun
  const ys = [];
  for (let i = 0; i < 10; i++) { await swipe(650, -350); ys.push(await getY()); }
  const strictlyMoving = ys.every((y, k) => k === 0 || y > ys[k - 1] + 300);
  ok('touch: 10× swipe nonstop → selalu bergerak (0× mentok)', strictlyMoving, `Δ=${(ys[9] - ys[0]).toFixed(0)}px`);
  const withinBuffer = ys.every((y) => y > 0 && y < tg.screens * tg.h - tg.h);
  ok('touch: semua posisi masih di tengah buffer', withinBuffer);

  // (c) swipe-down (mundur) dari 001: menembus ke 011 — dua arah
  await tpage.evaluate((y) => window.__reel.setY(y), TY(0));
  await tpage.waitForTimeout(250);
  await swipe(300, 600); // jari turun 300px = 0,4 layar (< ½) → snap BALIK ke 001
  ok('touch: swipe-down <½ layar → snap balik 001 (bukan nyangkut)', (await getNo()) === '1' && Math.abs((await getY()) - TY(0)) < 4, String(await getY()));
  await swipe(120, 920); // 800px = 1,08 layar → mundur persis 1 → 011
  ok('touch: swipe-down ≥1 layar dari 001 → 011', (await getNo()) === '11', String(await getNo()));
  await tpage.screenshot({ path: SHOTS + '/12-mobile-touch.png' });
  ok('touch: tanpa page error', terrs.length === 0, terrs.join(' | '));
  await ctx.close();
}

/* ================= REDUCED MOTION ================= */
{
  const { page: p2, errs: e2 } = await fresh('reduce', 3600);
  const n = await p2.evaluate(() => document.querySelectorAll('section[aria-label="Selected works"] .m-auto').length);
  const stages = await p2.evaluate(() => document.querySelectorAll('section[aria-label="Selected works"] > div').length);
  ok('reduced: 11 layar statis tanpa pin, TANPA fling', stages === 11 && n === 121, `stages=${stages}`);
  ok('reduced: tanpa error', e2.length === 0, e2.join(' | '));
  await p2.close();
}

console.log(out.join('\n'));
const fails = out.filter((l) => l.startsWith('FAIL')).length;
console.log(`\n${out.length - fails}/${out.length} PASS`);
await browser.close();
process.exit(fails ? 1 : 0);
