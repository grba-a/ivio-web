import { chromium, webkit } from '@playwright/test';
import sharp from 'sharp';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:4200';
const OUT = 'verify';
mkdirSync(OUT, { recursive: true });

const VIEWPORTS = [
  { name: '390', width: 390, height: 844 },
  { name: '430', width: 430, height: 932 },
  { name: '768', width: 768, height: 1024 },
  { name: '1280', width: 1280, height: 800 },
  { name: '1600', width: 1600, height: 900 },
];
const ANCHORS = ['airport', 'oldtown', 'boat', 'sea', 'sunset', 'ivio', 'messages', 'shape'];

const fails = [];
const warns = [];
const fail = (m) => { fails.push(m); console.log(`  FAIL  ${m}`); };
const warn = (m) => { warns.push(m); console.log(`  warn  ${m}`); };
const pass = (m) => console.log(`  ok    ${m}`);

const srgb = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * srgb(r) + 0.7152 * srgb(g) + 0.0722 * srgb(b);
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
const hexLum = (hex) => {
  const n = parseInt(hex.replace('#', ''), 16);
  return lum((n >> 16) & 255, (n >> 8) & 255, n & 255);
};

/**
 * Contrast measured on the pixels genuinely covered by glyphs.
 *
 * Screenshotting the element's box and taking its darkest/brightest pixel is
 * wrong: most of a headline box is empty space between and around the letters,
 * so the number describes the photograph, not the legibility. Instead: shoot
 * the region twice, once with the text visible and once hidden, diff them to
 * build a glyph mask, then judge only the masked pixels.
 */
async function contrastOverPhoto(page, selector, textHex, label) {
  const el = page.locator(selector).first();
  if (!(await el.count())) return warn(`${label}: selector not found`);
  const box = await el.boundingBox();
  if (!box || box.width < 2 || box.height < 2) return warn(`${label}: no box`);
  const clip = {
    x: Math.max(0, Math.round(box.x)),
    y: Math.max(0, Math.round(box.y)),
    width: Math.round(box.width),
    height: Math.round(box.height),
  };

  const withText = await page.screenshot({ clip });
  await el.evaluate((n) => (n.style.visibility = 'hidden'));
  const without = await page.screenshot({ clip });
  await el.evaluate((n) => (n.style.visibility = ''));

  const a = await sharp(withText).raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(without).raw().toBuffer({ resolveWithObject: true });
  const ch = a.info.channels;
  const tl = hexLum(textHex);

  const ratios = [];
  for (let i = 0; i < a.data.length; i += ch) {
    const diff =
      Math.abs(a.data[i] - b.data[i]) +
      Math.abs(a.data[i + 1] - b.data[i + 1]) +
      Math.abs(a.data[i + 2] - b.data[i + 2]);
    if (diff < 150) continue; // antialiased edges and empty space are not glyphs
    ratios.push(ratio(tl, lum(b.data[i], b.data[i + 1], b.data[i + 2])));
  }

  if (ratios.length < 40) return warn(`${label}: only ${ratios.length} glyph pixels found`);
  ratios.sort((x, y) => x - y);
  const worst = ratios[0];
  const p2 = ratios[Math.floor(ratios.length * 0.02)];
  const msg = `${label}: ${p2.toFixed(2)}:1 at p2 over ${ratios.length} glyph px (worst ${worst.toFixed(2)})`;
  if (p2 < 3) fail(msg);
  else if (p2 < 4.5) warn(`${msg} - large text only`);
  else pass(msg);
}

async function run(engine, name) {
  console.log(`\n=== ${name} ===`);
  const browser = await engine.launch();

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const errors = [];
    const bad = [];
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text().slice(0, 160)));
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
    page.on('response', (r) => r.status() >= 400 && bad.push(`${r.status()} ${r.url()}`));

    console.log(`\n-- ${name} @ ${vp.width}px`);
    await page.goto(BASE, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    // No horizontal overflow at any width.
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    overflow > 1 ? fail(`horizontal overflow of ${overflow}px`) : pass('no horizontal scroll');

    // Anchors must clear the sticky day bar.
    const barH = await page.evaluate(() => document.querySelector('header')?.getBoundingClientRect().height ?? 0);
    for (const id of ANCHORS) {
      await page.evaluate((i) => document.getElementById(i)?.scrollIntoView({ block: 'start', behavior: 'auto' }), id);
      await page.waitForTimeout(220);
      const top = await page.evaluate((i) => {
        const s = document.getElementById(i);
        const h = s?.querySelector('h2, h1');
        return h ? h.getBoundingClientRect().top : null;
      }, id);
      if (top === null) { warn(`#${id}: no heading found`); continue; }
      if (top < barH) fail(`#${id}: heading sits ${Math.round(barH - top)}px under the day bar`);
    }
    pass('day bar / heading collision check done');

    // Full-page capture at the two widths that matter most for review.
    if (vp.name === '390' || vp.name === '1280') {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(300);
      await page.screenshot({ path: `${OUT}/${name}-${vp.name}-full.png`, fullPage: true });
    }

    // Contrast of hero type against the photograph itself.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(350);
    // Measure each colour against only the pixels it actually sits on. Testing
    // the whole H1 box against the accent colour reports the two white lines as
    // failures and hides whatever the accent word is really doing.
    await contrastOverPhoto(page, '#top h1', '#fdfaf4', `${vp.name} H1 white lines`);
    await contrastOverPhoto(page, '#top h1 span', '#f4c294', `${vp.name} H1 accent word`);
    await contrastOverPhoto(page, '#top p.measure', '#dfe9e6', `${vp.name} hero sub`);

    // The video must actually decode, in this engine.
    await page.evaluate(() => document.getElementById('sea')?.scrollIntoView({ block: 'center' }));
    await page.waitForTimeout(1800);
    const vid = await page.evaluate(() => {
      const v = document.querySelector('#sea video');
      return v ? { rs: v.readyState, w: v.videoWidth, paused: v.paused } : null;
    });
    if (!vid) warn('no video element in #sea');
    else if (vid.rs < 2 || vid.w === 0) fail(`video did not decode (readyState ${vid.rs}, width ${vid.w})`);
    else pass(`video decoded ${vid.w}px, readyState ${vid.rs}`);

    if (errors.length) errors.forEach((e) => fail(`console: ${e}`));
    else pass('no console errors');
    if (bad.length) bad.forEach((b) => fail(`request: ${b}`));
    else pass('no failed requests');

    await ctx.close();
  }

  // Reduced motion: nothing may stay hidden.
  const rm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const rmp = await rm.newPage();
  await rmp.goto(BASE, { waitUntil: 'networkidle' });
  await rmp.waitForTimeout(600);
  const hidden = await rmp.evaluate(() =>
    [...document.querySelectorAll('[data-reveal]')].filter((n) => getComputedStyle(n).opacity !== '1').length
  );
  hidden ? fail(`reduced motion: ${hidden} elements stuck at opacity < 1`) : pass('reduced motion: everything visible');
  await rm.close();

  // No JavaScript at all: the page must still be a page.
  const nj = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const njp = await nj.newPage();
  await njp.goto(BASE, { waitUntil: 'load' });
  await njp.waitForTimeout(900);
  const text = (await njp.locator('body').innerText()).length;
  const imgs = await njp.locator('img').count();
  text > 2500 ? pass(`no-JS: ${text} characters of copy still rendered`) : fail(`no-JS: only ${text} characters rendered`);
  imgs > 4 ? pass(`no-JS: ${imgs} images present`) : fail(`no-JS: only ${imgs} images`);
  await njp.screenshot({ path: `${OUT}/${name}-nojs.png`, fullPage: true });
  await nj.close();

  await browser.close();
}

await run(chromium, 'chromium');
await run(webkit, 'webkit');

console.log(`\n${'='.repeat(58)}`);
console.log(`FAIL ${fails.length}   warn ${warns.length}`);
writeFileSync(`${OUT}/report.json`, JSON.stringify({ fails, warns }, null, 2));
process.exit(fails.length ? 1 : 0);
