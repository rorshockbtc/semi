import { test, expect } from '@playwright/test';

test.describe('Semi (;-]) Jobs-To-Be-Done Interactive Suite', () => {
  test('JTBD 1: Motion accessibility pause/play button halts continuous motion cleanly without aria-pressed', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const toggle = page.getByTestId('motion-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Pause motion');
    await expect(toggle).not.toHaveAttribute('aria-pressed');

    const track = page.locator('.semi-marquee-track');
    await expect(track).toHaveAttribute('data-motion', 'active');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Play motion');
    await expect(track).toHaveAttribute('data-motion', 'paused');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Pause motion');
    await expect(track).toHaveAttribute('data-motion', 'active');
  });

  test('JTBD 2: Track switching, Studio Audio mode, and YouTube Video Theatre across all 3 singles', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const activeTitle = page.getByTestId('active-track-title');
    await expect(activeTitle).toHaveText('Old Oak Tree');

    // Switch to Track 02 Video
    await page.getByTestId('watch-video-02').click();
    await expect(activeTitle).toHaveText('Warm Unknown');
    await expect(page.getByTestId('youtube-embed-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/UvwaOVrLYzc/
    );

    // Switch to Track 03 Video
    await page.getByTestId('watch-video-03').click();
    await expect(activeTitle).toHaveText('Marks On The Screen, Ink On The Page');
    await expect(page.getByTestId('youtube-embed-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/siEYfXvxRgY/
    );

    // Switch back to Track 01 Video
    await page.getByTestId('watch-video-01').click();
    await expect(activeTitle).toHaveText('Old Oak Tree');
    await expect(page.getByTestId('youtube-embed-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/bebQM2ZlH3U/
    );

    // Switch to Studio Audio & Strings tab
    await page.getByTestId('tab-audio-mode').click();
    await expect(page.getByTestId('tab-audio-mode')).toHaveAttribute('aria-selected', 'true');
  });

  test('JTBD 3: Direct 320 kbps MP3 downloads return valid MPEG audio > 1 MB for all 3 singles', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    for (const num of ['01', '02', '03']) {
      const link = page.getByTestId(`download-mp3-${num}`);
      await expect(link).toHaveAttribute('download', /\.mp3$/);
      const href = await link.getAttribute('href');
      expect(href).toBeTruthy();

      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type'] || '').toContain('audio/mpeg');
      const buf = await res.body();
      expect(buf.length).toBeGreaterThan(1_000_000);
    }
  });

  test('JTBD 4: Top-layer <dialog closedby="any"> Lyric Sheet & Photo Lightbox geometry and dismissal', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByTestId('open-lyrics-01').click();
    const lyricDialog = page.getByTestId('lyric-sheet-dialog');
    await expect(lyricDialog).toBeVisible();
    await expect(lyricDialog).toContainText('So leave the pipes open, keep the garden wide');

    // Allow the 220ms @starting-style entry transition to settle before testing hover stability
    await page.waitForTimeout(300);
    const box1 = await lyricDialog.boundingBox();
    expect(box1).not.toBeNull();
    if (box1) {
      expect(box1.width).toBeGreaterThanOrEqual(320);
      expect(box1.height).toBeGreaterThanOrEqual(300);

      // Verify zero bounding-box jitter when moving cursor over modal
      await page.mouse.move(box1.x + box1.width / 2, box1.y + 40);
      await page.waitForTimeout(150);
      const box2 = await lyricDialog.boundingBox();
      expect(box2).toEqual(box1);
    }

    await page.getByTestId('close-lyric-dialog').click();
    await expect(lyricDialog).not.toBeVisible();

    // Verify Photo Lightbox modal opens and light-dismisses cleanly with Escape
    await page.getByTestId('gallery-photo-studio-wide').click();
    const photoDialog = page.getByTestId('photo-lightbox-dialog');
    await expect(photoDialog).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(photoDialog).not.toBeVisible();
  });

  test('JTBD 5: Interactive Ask Semi, internal link crawler, and goBack() CSS integrity', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    await page.getByTestId('semi-chip-1').click();
    const reply = page.getByTestId('semi-chat-reply');
    await expect(reply).toBeVisible();
    await expect(reply).toContainText(/amnesia|unlimited|memory/i);

    // Crawl all internal route links
    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href^="/"]'))
        .map((a) => a.getAttribute('href'))
        .filter((h): h is string => Boolean(h && !h.startsWith('/#')))
    );

    const uniqueHrefs = Array.from(new Set(hrefs));
    expect(uniqueHrefs).toContain('/colophon');
    for (const pathHref of uniqueHrefs) {
      const resp = await page.request.get(pathHref);
      expect(resp.status()).toBeLessThan(400);
    }

    // Navigate to /colophon and verify back navigation preserves Warm Sandstone styling
    await page.locator('footer a[href="/colophon"]').click();
    await expect(page).toHaveURL(/\/colophon$/);
    await page.goBack({ waitUntil: 'networkidle' });
    await expect(page).toHaveURL(/\/$/);

    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgColor).toBe('rgb(232, 226, 213)'); // #E8E2D5 Warm Sandstone
  });
});
