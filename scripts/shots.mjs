import { chromium } from '@playwright/test';
const BASE = 'http://localhost:4200';
const b = await chromium.launch();
for (const [name, w, h] of [['mobile', 390, 844], ['desktop', 1440, 900]]) {
  const c = await b.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 2 });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  // smooth scrolling is still animating when the shot fires, which drags the
  // fixed header into the middle of a full-page capture.
  await p.addStyleTag({ content: 'html{scroll-behavior:auto !important}' });
  // Walk the page so every lazy image and reveal has fired before capture.
  await p.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight * 0.8) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 220));
    }
    window.scrollTo(0, 0);
  });
  await p.waitForTimeout(1400);
  await p.screenshot({ path: `verify/${name}-full.png`, fullPage: true });
  console.log(`verify/${name}-full.png`);
  await c.close();
}
await b.close();
