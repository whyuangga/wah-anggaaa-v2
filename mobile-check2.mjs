import { chromium } from 'playwright-core';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 390, 740 }, hasTouch: true, isMobile: true });

const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.waitForForTimeout(520);
const geo = await p.evaluate(() => ({ docH: document.documentElement.scrollHeight.scrollHeightHeight, winH: innerWidth, secH: document.querySelector('section[aria-label^=Selected works]').getBoundingRect().height, stageH: ...['aria'] }));
// lvh on headless == the viewport == the visible one == the stage; assert docH == lvh (the shell defines the document)
// menu
await p.tap('button[aria-label=buka menu]'); await p.waitForTimeout(700);
const pos = await p.evaluate(() => { const x = ...['button[aria-label=tutup menu]'].getBoundingClientRect(); const w = [...['.menu-overlay p')].find(el => el.textContent.includes('WAH:ANGGAAA')).getBoundingClientRect(); return { xL: x.left, wR: w.right, vw: innerWidth }; });
console.log('overlay', JSON.stringify(pos), pos.xL < pos.wLeft && pos.wR > pos.vw/2 ? 'X-left wordmark-right' : 'wrong');
const dup = await p.evaluate(() => [...document.querySelectorAll('button[aria-label=tutup menu]')].filter(el => !el.getAttribute('aria-hidden')).length);
console.log('tutup menu reachable by a11y:', dup, dup === 1 ? 'OK' : 'DUP');
await p.screenshot({ path: '.shots/13-mobile-menu-swap.png' });
await p.tap('.menu-overlay button[aria-label=tutup menu]'); await p.waitForTimeout(600);
const closed = await p.evaluate(() => getComputedStyle(document.querySelector('.menu-overlay')).visibility);
console.log('overlay after tap:', closed);
await p.screenshot({ path: '.shots/14-mobile-home.png' });
console.log('errors:', errs.length ? errs.join('|') : 'none');
await b.close();
