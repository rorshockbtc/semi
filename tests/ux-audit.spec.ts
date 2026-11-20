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
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-home-v3.png') });

    await page.evaluate(() => {
      const el = document.getElementById('story');
      if (el) window.scrollTo({ top: el.offsetTop - 20, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-home-story-v4.png') });

    await page.evaluate(() => {
      const el = document.querySelector('[data-testid="songs-addendum"]');
      if (el) el.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
    });
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-home-addendum-v6.png') });

    // 2. Song Story Pages & Interactive Single-Column Lyric Notes
    await auditRouteErgonomics(page, '/songs/old-oak-tree');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-oak-tree-v3.png') });

    const desktopNote = page.getByTestId('lyric-note-old-oak-tree-0');
    await desktopNote.scrollIntoViewIfNeeded();
    await desktopNote.locator('summary').click();
    await page.evaluate(() => {
      const el = document.getElementById('lyrics');
      if (el) window.scrollTo({ top: el.offsetTop + 90, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(450);
    const desktopLyricsOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(desktopLyricsOverflow, 'Overflow on /songs/old-oak-tree after opening lyric note').toBe(true);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-lyrics-callout-v4.png') });

    await auditRouteErgonomics(page, '/songs/warm-unknown');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-warm-unknown-v3.png') });

    await auditRouteErgonomics(page, '/songs/marks-on-the-screen-ink-on-the-page');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-marks-ink-v3.png') });

    await auditRouteErgonomics(page, '/songs/settle-in-the-block');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-settle-hero-v5.png') });
    await page.evaluate(() => {
      const el = document.getElementById('commons');
      if (el) window.scrollTo({ top: el.offsetTop - 40, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-settle-commons-v5.png') });
    await page.evaluate(() => {
      const el = document.getElementById('lyrics');
      if (el) window.scrollTo({ top: el.offsetTop + 80, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(450);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-settle-lyrics-v6.png') });

    // 3. Songs Index, Salt In The Rain (Alternate Take + Show Chords + Volume Dock), About & Gallery
    await auditRouteErgonomics(page, '/songs');
    await page.getByTestId('song-notify-card').scrollIntoViewIfNeeded();
    await page.getByTestId('play-track-01').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-song-notify-v7.png') });

    await auditRouteErgonomics(page, '/songs/salt-in-the-rain');
    await page.getByTestId('alternate-take-card').scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-salt-alternate-take-v7.png') });
    await page.getByTestId('toggle-show-chords').scrollIntoViewIfNeeded();
    await page.getByTestId('toggle-show-chords').click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-salt-show-chords-v7.png') });

    await auditRouteErgonomics(page, '/songs/no-human-hands-can-hold');

    await auditRouteErgonomics(page, '/about');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-about-top-v4.png') });
    await page.evaluate(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find((h) =>
        (h.textContent || '').includes('No limit, with Pipes')
      );
      if (heading) {
        const li = heading.closest('li');
        li?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'center' });
      }
    });
    await page.waitForTimeout(800);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-about-memory-v4.png') });

    await auditRouteErgonomics(page, '/gallery');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'desktop-gallery-v4.png') });

    expect(errors).toEqual([]);
  });

  test('Mobile 390×844: header non-overlap, zero overflow across /, /songs/old-oak-tree, /songs/settle-in-the-block, /songs/salt-in-the-rain, and /about', async ({
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

    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-home-v3.png') });

    // Mobile audio dock geometry stability & non-overlap with GlobalAskSemi
    await page.getByTestId('play-all-button').click();
    const mobileDock = page.getByTestId('persistent-audio-dock');
    await expect(mobileDock).toBeVisible();
    const box1 = await mobileDock.boundingBox();
    await page.getByTestId('dock-next-mobile').click();
    await page.getByTestId('dock-next-mobile').click();
    await page.waitForTimeout(150);
    const box3 = await mobileDock.boundingBox();
    const askBox = await page.getByTestId('global-ask-semi-trigger').boundingBox();
    expect(box1).not.toBeNull();
    expect(box3).not.toBeNull();
    expect(askBox).not.toBeNull();
    if (box1 && box3 && askBox) {
      expect(Math.abs(box1.height - box3.height)).toBeLessThanOrEqual(2);
      expect(Math.abs(box1.y - box3.y)).toBeLessThanOrEqual(2);
      expect(askBox.y + askBox.height).toBeLessThan(box3.y);
    }
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-dock-stable-v7.png') });

    await auditRouteErgonomics(page, '/songs/old-oak-tree');
    const mobileNote = page.getByTestId('lyric-note-old-oak-tree-0');
    await mobileNote.scrollIntoViewIfNeeded();
    await mobileNote.locator('summary').click();
    await page.waitForTimeout(400);
    const mobileLyricsOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(mobileLyricsOverflow, 'Mobile overflow on /songs/old-oak-tree after opening lyric note').toBe(
      true
    );
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-song-lyrics-v4.png') });

    await auditRouteErgonomics(page, '/songs/salt-in-the-rain');
    await page.getByTestId('toggle-show-chords').scrollIntoViewIfNeeded();
    await page.getByTestId('toggle-show-chords').click();
    await page.waitForTimeout(300);
    const mobileChordsOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(mobileChordsOverflow, 'Mobile overflow on /songs/salt-in-the-rain with Show Chords on').toBe(
      true
    );
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-salt-chords-v7.png') });

    await auditRouteErgonomics(page, '/songs/settle-in-the-block');
    await page.evaluate(() => {
      const el = document.getElementById('commons');
      if (el) window.scrollTo({ top: el.offsetTop - 30, behavior: 'instant' as ScrollBehavior });
    });
    await page.waitForTimeout(400);
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, 'mobile-song-settle-commons-v5.png') });

    await auditRouteErgonomics(page, '/about');

    expect(errors).toEqual([]);
  });
});
