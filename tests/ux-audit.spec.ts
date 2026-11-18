import { test, expect, type Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

const SCREENSHOT_DIR = path.resolve(import.meta.dirname, 'screenshots');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function auditRouteErgonomics(page: Page, route: string) {
  await page.goto(route, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth <= window.innerWidth
  );
  expect(overflow, `Horizontal overflow on ${route}`).toBe(true);

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
  expect(smallTextCount, `Sub-13px visible text detected on ${route}`).toBe(0);
}

test.describe('UX & Visual Ergonomics Audit (Multi-Page Desktop 1440×900 & Mobile 390×844)', () => {
  test('Desktop 1440×900: all 7 routes pass ergonomics, zero image duplication on /, capture v2 plates', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Home (Hero + Sparkles + Video Montage + Songs + Corporate Mark + Film Scenes)
    await auditRouteErgonomics(page, '/');
    const homeImgSrcs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('img')).map((img) => img.getAttribute('src'))
    );
    expect(new Set(homeImgSrcs).size).toBe(homeImgSrcs.length);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-home-v2.png') });

    await page.evaluate(() => {
      const el = document.getElementById('songs');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-songs-home-v2.png') });

    await page.evaluate(() => {
      const el = document.getElementById('scenes');
      if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(550);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-gallery-v2.png') });

    // 2. Song Story Pages
    await auditRouteErgonomics(page, '/songs/old-oak-tree');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-oak-tree.png') });

    await auditRouteErgonomics(page, '/songs/warm-unknown');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-warm-unknown.png') });

    await auditRouteErgonomics(page, '/songs/marks-on-the-screen-ink-on-the-page');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-marks-ink.png') });

    // 3. Songs Index, About & Colophon
    await auditRouteErgonomics(page, '/songs');
    await auditRouteErgonomics(page, '/about');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-about-v2.png') });
    await auditRouteErgonomics(page, '/colophon');

    expect(errors).toEqual([]);
  });

  test('Mobile 390×844: header non-overlap, zero overflow across / and /songs/old-oak-tree', async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await auditRouteErgonomics(page, '/');

    const logoBox = await page.getByTestId('brand-logo').boundingBox();
    const ctaBox = await page.getByTestId('header-listen-cta').boundingBox();
    expect(logoBox).not.toBeNull();
    expect(ctaBox).not.toBeNull();
    if (logoBox && ctaBox) {
      expect(logoBox.x + logoBox.width).toBeLessThan(ctaBox.x);
      expect(logoBox.height).toBeGreaterThanOrEqual(44);
      expect(ctaBox.height).toBeGreaterThanOrEqual(44);
    }

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-home-v2.png') });

    await auditRouteErgonomics(page, '/songs/old-oak-tree');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-song-oak-tree.png') });
    await auditRouteErgonomics(page, '/about');

    expect(errors).toEqual([]);
  });
});
