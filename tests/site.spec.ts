import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import { PDFDocument, PDFName, PDFDict, PDFString, PDFHexString } from 'pdf-lib';
import { contact } from '../src/data/profile';

const base = process.env.BASE_PATH || '/';
const key = 'valentinnsh.language';

for (const [locale, expected] of [['ru-RU', 'ru'], ['en-GB', 'en'], ['fr-FR', 'en']]) {
  test(`root negotiates ${locale} without storing a guessed preference`, async ({ browser, baseURL }) => {
    const context = await browser.newContext({ locale, baseURL });
    const page = await context.newPage();
    await page.goto('./?source=profile#work');
    await expect(page).toHaveURL(new RegExp(`${base}${expected}/\\?source=profile#work$`));
    expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBeNull();
    await context.close();
  });
}

test('manual choice persists, explicit URLs win, and section links survive switching', async ({ page }) => {
  await page.goto('en/#work');
  await page.locator('.locale-switcher a[data-language="ru"]').click();
  await expect(page).toHaveURL(new RegExp(`${base}ru/#work$`));
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe('ru');
  await page.goto('en/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate((key) => localStorage.getItem(key), key)).toBe('ru');
  await page.goto('./');
  await expect(page).toHaveURL(new RegExp(`${base}ru/$`));
  await page.locator('.locale-switcher a[data-language="en"]').click();
  await expect(page).toHaveURL(new RegExp(`${base}en/$`));
  await page.goBack();
  await expect(page).toHaveURL(new RegExp(`${base}ru/$`));
});

test('invalid storage falls back to the first supported browser language', async ({ page }) => {
  await page.addInitScript((key) => {
    localStorage.setItem(key, 'not-a-locale');
    Object.defineProperty(navigator, 'languages', { value: ['de-DE', 'ru-RU', 'en-US'] });
  }, key);
  await page.goto('./');
  await expect(page).toHaveURL(new RegExp(`${base}ru/$`));
});

test('blocked browser storage preserves negotiation and manual navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.addInitScript(() => {
    Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage blocked'); } });
    Object.defineProperty(navigator, 'languages', { value: ['ru-RU'] });
  });
  await page.goto('./');
  await expect(page).toHaveURL(new RegExp(`${base}ru/$`));
  await page.locator('.locale-switcher a[data-language="en"]').click();
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(errors).toEqual([]);
});

test('complete content and language links work without JavaScript', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, baseURL });
  const page = await context.newPage();
  await page.goto('./');
  await page.getByRole('link', { name: 'Русский' }).click();
  await expect(page.locator('h1')).toHaveText('Валентин Шишкин');
  await expect(page.locator('#kafka')).toContainText('В течение нескольких месяцев после изменений');
  await page.locator('.locale-switcher a[data-language="en"]').click();
  await expect(page.locator('h1')).toHaveText('Valentine Shishkin');
  await expect(page.locator('#kafka')).toContainText('No related overload alerts occurred for several months after the changes.');
  await expect(page.locator('#contact a[href^="mailto:"]')).toBeVisible();
  await context.close();
});

test('pdf and rtf downloads are available and match current language', async ({ page }) => {
  await page.goto('en/');
  const enPdf = page.locator('a[download][href$="Valentine-Shishkin-CV-EN.pdf"]');
  const enRtf = page.locator('a[download][href$="Valentine-Shishkin-CV-EN.rtf"]');
  await expect(enPdf).toBeVisible();
  await expect(enRtf).toBeVisible();

  await page.goto('ru/');
  const ruPdf = page.locator('a[download][href$="Valentine-Shishkin-CV-RU.pdf"]');
  const ruRtf = page.locator('a[download][href$="Valentine-Shishkin-CV-RU.rtf"]');
  await expect(ruPdf).toBeVisible();
  await expect(ruRtf).toBeVisible();
});

test('served PDF downloads are one page with working contact and project links', async ({ request }) => {
  for (const lang of ['EN', 'RU']) {
    const response = await request.get(`Valentine-Shishkin-CV-${lang}.pdf`);
    expect(response.ok()).toBe(true);
    const pdf = await PDFDocument.load(await response.body());
    expect(pdf.getPageCount()).toBe(1);
    const annotations = pdf.getPage(0).node.Annots();
    const urls = (annotations?.asArray() || []).flatMap((ref) => {
      const annotation = pdf.context.lookup(ref, PDFDict);
      const action = annotation.lookupMaybe(PDFName.of('A'), PDFDict);
      const uri = action?.lookup(PDFName.of('URI'));
      return uri instanceof PDFString || uri instanceof PDFHexString ? [uri.decodeText()] : [];
    });
    expect(urls).toEqual(expect.arrayContaining([
      `mailto:${contact.email}`, contact.telegram, contact.github,
      `${contact.website}/${lang.toLowerCase()}/`, 'https://github.com/valentinnsh/SkyHelperV2',
    ]));
  }
});

for (const lang of ['en', 'ru']) {
  for (const width of [320, 375, 768, 1440]) {
    test(`${lang} layout at ${width}px`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width, height: 900 });
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('response', (response) => {
        if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
      });
      await page.goto(`${lang}/`);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator('html')).toHaveAttribute('lang', lang);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      await expect(page.locator('#identity')).toBeVisible();
      await expect(page.locator('h1')).toHaveCount(1);
      if (width === 375 || width === 1440) {
        const accessibility = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])
          .analyze();
        expect(accessibility.violations).toEqual([]);
        await page.screenshot({ path: testInfo.outputPath(`${lang}-${width}.png`), fullPage: true });
        await page.screenshot({ path: testInfo.outputPath(`${lang}-${width}-viewport.png`) });
      }
      expect(errors).toEqual([]);
    });
  }
}

test('keyboard navigation, anchors, contacts, and metadata', async ({ page }) => {
  await page.goto('en/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')!));
  for (const href of hrefs) await expect(page.locator(href)).toHaveCount(1);
  await expect(page.locator('#contact a[href="mailto:valentinnsh@gmail.com"]')).toHaveCount(1);
  await expect(page.locator('#contact a[href="https://t.me/valentinnsh"]')).toHaveCount(1);
  await expect(page.locator('#contact a[href="https://github.com/valentinnsh"]')).toHaveCount(1);
  await expect(page).toHaveTitle('Valentine Shishkin — Fullstack Software Engineer');
  if (process.env.SITE_URL) {
    const origin = process.env.SITE_URL.replace(/\/$/, '');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${base}en/`);
    await expect(page.locator('link[hreflang="ru"]')).toHaveAttribute('href', `${origin}${base}ru/`);
    await expect(page.locator('link[hreflang="x-default"]')).toHaveAttribute('href', `${origin}${base}`);
  } else {
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
  }
});

test('expanded text and reduced motion remain usable', async ({ page }) => {
  await page.setViewportSize({ width: 640, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('ru/');
  await page.addStyleTag({ content: 'html { font-size: 200%; }' });
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await expect(page.locator('#contact')).toBeVisible();
  expect(await page.locator('.contact-primary-btn').evaluate((element) => getComputedStyle(element).transitionDuration)).toBe('0s');
});

test('missing routes return a useful 404 rather than the homepage', async ({ request }) => {
  const response = await request.get('missing-page/');
  expect(response.status()).toBe(404);
  expect(await response.text()).toContain('Page not found');
});

test('publish artifact contains only site assets and stays small', async () => {
  const files: string[] = [];
  async function walk(dir: string) {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else files.push(path);
    }
  }
  await walk('dist');
  const allowedPath = /^dist\/(?:(?:en|ru)\/index\.html|(?:index|404)\.html|favicon\.svg|font-license\.txt|CNAME|Valentine-Shishkin-CV-(?:EN|RU)\.(?:pdf|rtf)|_astro\/[^/]+\.(?:css|js|woff2))$/;
  expect(files.filter((path) => !allowedPath.test(path))).toEqual([]);
  const sizes = await Promise.all(files.map(async (path) => ({ path, size: (await stat(path)).size })));
  expect(sizes.filter((file) => !file.path.endsWith('.pdf')).reduce((sum, file) => sum + file.size, 0)).toBeLessThan(400_000);
  expect(sizes.reduce((sum, file) => sum + file.size, 0)).toBeLessThan(2_500_000);
  expect(sizes.filter((file) => file.path.endsWith('.js')).reduce((sum, file) => sum + file.size, 0)).toBeLessThan(50_000);
});
