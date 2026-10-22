import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
});
const errors = [];
const page = await browser.newPage();
page.on('pageerror', error => errors.push(error.message));
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
await mkdir('/tmp/grown-ish-qa', { recursive: true });
try {
  await page.goto(process.env.BASE_URL || 'http://localhost:8091', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  assert.equal(await page.locator('h1').count(), 1);
  assert.equal(await page.locator('.workshop-card').count(), 3);
  await page.getByRole('button', { name: 'Descubre los 8 talleres' }).click();
  assert.equal(await page.locator('.workshop-card').count(), 8);
  await page.getByRole('button', { name: 'Ver menos talleres' }).click();
  assert.equal(await page.locator('.workshop-card').count(), 3);
  const faq = page.getByRole('button', { name: '¿Puedo tomar un solo taller?' });
  await faq.click();
  assert.equal(await faq.getAttribute('aria-expanded'), 'true');
  assert.equal(await page.locator('#faq-3').isVisible(), true);
  await faq.click();
  assert.equal(await page.locator('#faq-3').isVisible(), false);
  await page.getByRole('button', { name: '¿Tengo que saber algo antes de empezar?' }).click();
  const anchors = await page.locator('a[href^="#"]').evaluateAll(nodes => nodes.map(node => node.getAttribute('href')));
  for (const href of anchors) assert.equal(await page.locator(href).count(), 1, `Destino ${href}`);
  for (const width of [1440, 1024, 768, 600, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(250);
    const layout = await page.evaluate(() => ({ width: innerWidth, content: document.documentElement.scrollWidth }));
    if (layout.content > layout.width) console.log(await page.locator('body *').evaluateAll(nodes => nodes.filter(n => n.getBoundingClientRect().right > innerWidth + 1).map(n => ({ tag: n.tagName, class: n.getAttribute('class'), right: n.getBoundingClientRect().right }))));
    assert.ok(layout.content <= layout.width, `Desbordamiento a ${width}px: ${layout.content}`);
    await page.screenshot({ path: `/tmp/grown-ish-qa/${width}.png`, fullPage: true });
  }
  await page.setViewportSize({ width: 390, height: 844 });
  const menu = page.getByRole('button', { name: 'Abrir menú' });
  await menu.click();
  assert.equal(await page.getByRole('button', { name: 'Cerrar menú' }).getAttribute('aria-expanded'), 'true');
  await page.getByRole('navigation').getByRole('link', { name: 'Los talleres' }).click();
  assert.equal(await page.getByRole('button', { name: 'Abrir menú' }).getAttribute('aria-expanded'), 'false');
  assert.deepEqual(errors, []);
  console.log('OK: talleres, FAQ, anclas, menú móvil, 6 tamaños de pantalla y recursos sin errores.');
  console.log('Capturas: /tmp/grown-ish-qa');
} finally {
  await browser.close();
}
