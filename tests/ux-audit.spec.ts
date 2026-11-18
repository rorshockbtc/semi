import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve(import.meta.dirname, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

test.describe('UX & Visual Ergonomics Audit (Desktop 1440×900 & Mobile 390×844)', () => {
  test('Desktop 1440×900: zero overflow, >=13px floor, zero console errors, capture plates', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // Wait briefly for initial RiseLines animation to settle
    await page.waitForTimeout(800);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(overflow).toBe(true);

    const smallTextCount = await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('body *'));
      let bad = 0;
      for (const el of els) {
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;
        const hasOwnText = Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent || '').trim().length > 0
        );
        if (!hasOwnText) continue;
        const size = parseFloat(style.fontSize);
        if (size < 13) bad++;
      }
      return bad;
    });
    expect(smallTextCount).toBe(0);

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-home.png'),
      fullPage: false,
    });

    await page.evaluate(() => {
      const el = document.getElementById('listen');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-listen.png'),
      fullPage: false,
    });

    await page.evaluate(() => {
      const el = document.getElementById('memory');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-story-memory.png'),
      fullPage: false,
    });

    await page.evaluate(() => {
      const el = document.getElementById('gallery');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(600);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-gallery.png'),
      fullPage: false,
    });

    await page.evaluate(() => {
      window.scrollTo({ top: document.body.scrollHeight - window.innerHeight, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(400);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-closing.png'),
      fullPage: false,
    });

    await page.goto('/colophon', { waitUntil: 'networkidle' });
    const colophonOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(colophonOverflow).toBe(true);
    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'desktop-colophon.png'),
      fullPage: false,
    });

    expect(errors).toEqual([]);
  });

  test('Mobile 390×844: header non-overlap, zero horizontal overflow, touch targets >= 44px', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(overflow).toBe(true);

    const logoBox = await page.getByTestId('brand-logo').boundingBox();
    const ctaBox = await page.getByTestId('header-listen-cta').boundingBox();
    expect(logoBox).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    if (logoBox && ctaBox) {
      expect(logoBox.x + logoBox.width).toBeLessThan(ctaBox.x);
      expect(logoBox.height).toBeGreaterThanOrEqual(44);
      expect(ctaBox.height).toBeGreaterThanOrEqual(44);
    }

    await page.screenshot({
      path: path.join(SCREENSHOT_DIR, 'mobile-home.png'),
      fullPage: false,
    });

    expect(errors).toEqual([]);
  });
});
