import { test, expect } from '@playwright/test';

test.describe('Semi (; - ]) Multi-Page Interactive JTBD Suite', () => {
  test('JTBD 1: Corporate Bricolage Grotesque #FE299E mark & accessible Pause/Play motion toggle', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const logoMark = page.getByTestId('brand-logo').locator('.font-mark');
    await expect(logoMark).toBeVisible();
    const styles = await logoMark.evaluate((el) => {
      const s = getComputedStyle(el);
      return { color: s.color, fontFamily: s.fontFamily };
    });
    expect(styles.color).toBe('rgb(254, 41, 158)');
    expect(styles.fontFamily.toLowerCase()).toContain('bricolage');

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

  test('JTBD 2: Play MP3 on Home, persist audio dock across route navigation to /songs/old-oak-tree, verify essay & lyrics', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Start playing Track 01 and navigate into its dedicated Story & Lyrics page
    await page.getByTestId('play-track-01').click();
    const dock = page.getByTestId('persistent-audio-dock');
    await expect(dock).toBeVisible();
    await expect(dock).toContainText('Old Oak Tree');

    await page.getByTestId('story-link-01').click();
    await expect(page).toHaveURL(/\/songs\/old-oak-tree$/);

    // Persistent audio dock stays mounted across client navigation
    await expect(page.getByTestId('persistent-audio-dock')).toBeVisible();

    const edition = page.getByTestId('song-edition-old-oak-tree');
    await expect(edition).toContainText('Dario Amodei');
    await expect(edition).toContainText('Sam Altman');
    await expect(edition).toContainText('Jensen Huang');
    await expect(edition).toContainText('weights');
    await expect(page.getByTestId('edition-lyrics-grid')).toContainText(
      'So leave the pipes open, keep the garden wide'
    );
    await expect(page.getByTestId('edition-youtube-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/bebQM2ZlH3U/
    );
  });

  test('JTBD 3: Dedicated story essays for Warm Unknown & Marks On The Screen + valid 320 kbps MP3 downloads', async ({
    page,
  }) => {
    await page.goto('/songs/warm-unknown', { waitUntil: 'networkidle' });
    const warm = page.getByTestId('song-edition-warm-unknown');
    await expect(warm).toContainText('retrieval-augmented generation');
    await expect(warm).toContainText('Substack');
    await expect(warm).toContainText('Latin America, Asia, Africa');
    await expect(page.getByTestId('edition-youtube-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/UvwaOVrLYzc/
    );

    await page.goto('/songs/marks-on-the-screen-ink-on-the-page', { waitUntil: 'networkidle' });
    const marks = page.getByTestId('song-edition-marks-on-the-screen-ink-on-the-page');
    await expect(marks).toContainText('Colon Hyphen Bracket');
    await expect(marks).toContainText(/dropped bracket/i);
    await expect(page.getByTestId('edition-youtube-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/siEYfXvxRgY/
    );

    await page.goto('/', { waitUntil: 'networkidle' });
    for (const num of ['01', '02', '03']) {
      const link = page.getByTestId(`download-mp3-${num}`);
      await expect(link).toHaveAttribute('download', /\.mp3$/);
      const href = await link.getAttribute('href');
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type'] || '').toContain('audio/mpeg');
      expect((await res.body()).length).toBeGreaterThan(1_000_000);
    }
  });

  test('JTBD 4: Home video screening, top-layer Photo Lightbox, /about Ask Semi, internal link crawl & goBack()', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Inline home YouTube screening
    await page.getByTestId('watch-video-02').click();
    await expect(page.getByTestId('youtube-embed-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/UvwaOVrLYzc/
    );

    // Top-layer Photo Lightbox
    await page.getByTestId('gallery-photo-meadow-spin').click();
    const photoDialog = page.getByTestId('photo-lightbox-dialog');
    await expect(photoDialog).toBeVisible();
    await page.waitForTimeout(260);
    await page.keyboard.press('Escape');
    await expect(photoDialog).not.toBeVisible();

    // Crawl all internal links
    const hrefs = await page.evaluate(() =>
      Array.from(document.querySelectorAll('a[href^="/"]'))
        .map((a) => a.getAttribute('href'))
        .filter((h): h is string => Boolean(h && !h.startsWith('/#')))
    );
    const unique = Array.from(new Set(hrefs));
    expect(unique).toContain('/songs/old-oak-tree');
    expect(unique).toContain('/about');
    expect(unique).toContain('/colophon');
    for (const h of unique) {
      const resp = await page.request.get(h);
      expect(resp.status()).toBeLessThan(400);
    }

    // Visit /about & test Ask Semi
    await page.goto('/about', { waitUntil: 'networkidle' });
    await page.getByTestId('semi-chip-2').click();
    const reply = page.getByTestId('semi-chat-reply');
    await expect(reply).toBeVisible();
    await expect(reply).toContainText(/RAG|Pipes|Substack/i);

    await page.goBack({ waitUntil: 'networkidle' });
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgColor).toBe('rgb(232, 226, 213)');
  });
});
