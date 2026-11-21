import { test, expect } from '@playwright/test';

test.describe('Semi (; - ]) Multi-Page Interactive JTBD Suite', () => {
  test('JTBD 1: MonteCarlo cursive Sem; header wordmark & accessible Pause/Play motion toggle', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const logoScript = page.getByTestId('brand-logo').locator('.font-script');
    await expect(logoScript).toBeVisible();
    await expect(logoScript).toHaveText('Sem;');
    const styles = await logoScript.evaluate((el) => {
      const s = getComputedStyle(el);
      return { fontFamily: s.fontFamily };
    });
    expect(styles.fontFamily.toLowerCase()).toMatch(/monte|cursive/);

    const toggle = page.getByTestId('motion-toggle');
    await expect(toggle).toHaveAttribute('aria-label', 'Pause motion');
    await expect(toggle).not.toHaveAttribute('aria-pressed');

    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-motion', 'active');
    await expect(page.getByTestId('hero-drifting-leaves')).toHaveAttribute('data-motion-state', 'active');
    await expect(page.getByTestId('home-autumn-paper-canvas')).toBeAttached();

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Play motion');
    await expect(html).toHaveAttribute('data-motion', 'paused');
    await expect(page.getByTestId('hero-drifting-leaves')).toHaveAttribute('data-motion-state', 'paused');

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-label', 'Pause motion');
    await expect(html).toHaveAttribute('data-motion', 'active');
    await expect(page.getByTestId('hero-drifting-leaves')).toHaveAttribute('data-motion-state', 'active');

    // Verify each main page mounts its own differentiated autumn watercolor layer
    await page.goto('/songs', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('songs-autumn-sky-wash')).toBeVisible();
    await expect(page.getByTestId('home-autumn-paper-canvas')).toHaveCount(0);

    await page.goto('/gallery', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('gallery-autumn-wet-brush')).toBeVisible();
    await expect(page.getByTestId('songs-autumn-sky-wash')).toHaveCount(0);

    await page.goto('/about', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('about-autumn-drip-canvas').first()).toBeVisible();
    await expect(page.getByTestId('gallery-autumn-wet-brush')).toHaveCount(0);

    // Individual song pages must NOT mount custom watercolor canvases
    await page.goto('/songs/ghost', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('home-autumn-paper-canvas')).toHaveCount(0);
    await expect(page.getByTestId('songs-autumn-sky-wash')).toHaveCount(0);
    await expect(page.getByTestId('gallery-autumn-wet-brush')).toHaveCount(0);
    await expect(page.getByTestId('about-autumn-drip-canvas')).toHaveCount(0);
  });

  test('JTBD 2: Play All & single MP3 on Home, persist audio dock across route navigation to /songs/old-oak-tree, verify essay & lyrics', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Start Play All sequential playback from Track 01
    await page.getByTestId('play-all-button').click();
    const dock = page.getByTestId('persistent-audio-dock');
    await expect(dock).toBeVisible();
    await expect(dock).toHaveAttribute('data-play-all', 'true');
    await expect(dock).toContainText('Old Oak Tree');
    await expect(dock).toContainText('Playing all');

    // Adjust volume slider & toggle mute/unmute
    const volumeSlider = page.getByTestId('dock-volume-slider');
    await expect(volumeSlider).toBeVisible();
    await volumeSlider.fill('0.42');
    await volumeSlider.dispatchEvent('change');
    const savedVol = await page.evaluate(() => window.localStorage.getItem('semi_player_volume'));
    expect(savedVol).toBe('0.42');

    const muteBtn = page.getByTestId('dock-mute-toggle');
    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'true');
    await muteBtn.click();
    await expect(muteBtn).toHaveAttribute('aria-pressed', 'false');

    // Verify time scrubber seeks smoothly without resetting to 0:00
    const timeScrubber = page.locator('input[aria-label="Seek track progress"]');
    await expect(timeScrubber).toBeVisible();
    await timeScrubber.fill('35');
    await timeScrubber.dispatchEvent('change');
    await page.waitForTimeout(500);
    const scrubVal = Number(await timeScrubber.getAttribute('value'));
    expect(scrubVal).toBeGreaterThanOrEqual(30);

    await page.getByTestId('story-link-01').click();
    await expect(page).toHaveURL(/\/songs\/old-oak-tree$/);

    // Persistent audio dock & volume preference stay mounted across client navigation
    await expect(page.getByTestId('persistent-audio-dock')).toBeVisible();
    await expect(page.getByTestId('dock-volume-slider')).toHaveValue('0.42');

    const edition = page.getByTestId('song-edition-old-oak-tree');
    await expect(edition).toContainText('Dario Amodei');
    await expect(edition).toContainText('Sam Altman');
    await expect(edition).toContainText('Jensen Huang');
    await expect(edition).toContainText('weights');
    await expect(page.getByTestId('edition-lyrics-grid')).toContainText(
      'So leave the pipes open, keep the garden wide'
    );
    const columnCount = await page
      .getByTestId('edition-lyrics-grid')
      .evaluate((el) => getComputedStyle(el).columnCount);
    expect(['auto', '1']).toContain(columnCount);

    // Toggle Show Chords on & verify key/capo bar + inline chords + zero horizontal overflow
    const chordsToggle = page.getByTestId('toggle-show-chords');
    await expect(chordsToggle).toHaveAttribute('aria-pressed', 'false');
    await chordsToggle.click();
    await expect(chordsToggle).toHaveAttribute('aria-pressed', 'true');
    await expect(page.getByTestId('chords-meta-bar')).toContainText('D Major');
    await expect(page.getByTestId('lyric-chord-line').first()).toBeVisible();

    const weightsNote = page.getByTestId('lyric-note-old-oak-tree-0');
    await weightsNote.locator('summary').click();
    await expect(weightsNote).toHaveAttribute('open', '');
    await expect(weightsNote).toContainText(/weights|parameters|model/i);
    const lyricsOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth
    );
    expect(lyricsOverflow).toBe(true);
    await chordsToggle.click();
    await expect(chordsToggle).toHaveAttribute('aria-pressed', 'false');

    await expect(page.getByTestId('edition-youtube-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/bebQM2ZlH3U/
    );
  });

  test('JTBD 3: Dedicated story essays across all 9 tracks (including Ghost & Bitcoin commons), stream-only bonus alt-takes, and valid 320 kbps main MP3 downloads', async ({
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

    await page.goto('/songs/settle-in-the-block', { waitUntil: 'networkidle' });
    const settle = page.getByTestId('song-edition-settle-in-the-block');
    await expect(settle).toContainText(/twenty-one million suns/i);
    await expect(settle).toContainText(/two small keys/i);
    await expect(page.getByTestId('edition-youtube-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/RtinxbjW35Q/
    );

    const commons = page.getByTestId('community-spotlight-settle-in-the-block');
    await expect(commons).toBeVisible();
    const coreDownload = commons.locator('a[href="https://bitcoin.org/en/download"]');
    await expect(coreDownload).toBeVisible();
    const chipLinks = page.getByTestId('community-education-chips').locator('a');
    await expect(chipLinks).toHaveCount(18);
    const firstChipBox = await chipLinks.first().boundingBox();
    expect(firstChipBox).not.toBeNull();
    if (firstChipBox) {
      expect(firstChipBox.height).toBeGreaterThanOrEqual(44);
    }

    const settleNote = page.getByTestId('lyric-note-settle-in-the-block-0');
    await settleNote.locator('summary').click();
    await expect(settleNote).toHaveAttribute('open', '');
    await expect(settleNote).toContainText(/riverbed|purchasing power|money supply/i);

    await page.goto('/songs/salt-in-the-rain', { waitUntil: 'networkidle' });
    await expect(page.locator('iframe[src*="G3HBNJ3P_a8"]')).toBeVisible();
    await expect(page.locator('#lyrics')).toContainText(/salt in the rain/i);
    const rainNote = page.getByTestId('lyric-note-salt-in-the-rain-0');
    await rainNote.locator('summary').click();
    await expect(rainNote).toHaveAttribute('open', '');

    // Verify Alternate Studio Take is strictly LISTEN-ONLY (no download button on card or dock)
    await expect(page.getByTestId('alternate-take-card')).toContainText('Salt In The Rain (Alternate Take)');
    await expect(page.getByTestId('download-alternate-take')).toHaveCount(0);
    await expect(page.getByTestId('alternate-take-stream-only')).toContainText(/Listen only/i);
    await page.getByTestId('play-alternate-take').click();
    await expect(page.getByTestId('persistent-audio-dock')).toContainText('05b · Salt In The Rain (Alternate Take)');
    await expect(page.getByTestId('persistent-audio-dock').locator('a[download]')).toHaveCount(0);

    // Verify Show Chords on Salt In The Rain (Capo 4)
    await page.getByTestId('toggle-show-chords').click();
    await expect(page.getByTestId('chords-meta-bar')).toContainText('Capo 4');

    // Verify Track 06: No Human Hands Can Hold
    await page.goto('/songs/no-human-hands-can-hold', { waitUntil: 'networkidle' });
    await expect(page.locator('iframe[src*="aM2WHsdF014"]')).toBeVisible();
    await expect(page.locator('#lyrics')).toContainText(/no human hands can hold/i);
    await page.getByTestId('toggle-show-chords').click();
    await expect(page.getByTestId('chords-meta-bar')).toContainText('C Minor');

    await page.goto('/songs/out-of-office', { waitUntil: 'networkidle' });
    await expect(page.locator('iframe[src*="1184pyA25Uw"]')).toBeVisible();
    await expect(page.locator('#lyrics')).toContainText(/out of office/i);
    await expect(page.getByTestId('download-alternate-take')).toHaveCount(0);
    await page.getByTestId('toggle-show-chords').click();
    await expect(page.getByTestId('chords-meta-bar')).toContainText('G Major');

    await page.goto('/songs/out-of-the-barn', { waitUntil: 'networkidle' });
    await expect(page.locator('iframe[src*="NBKo8Ul_E4o"]')).toBeVisible();
    await expect(page.locator('#lyrics')).toContainText(/keep the frontier open/i);
    await page.getByTestId('toggle-show-chords').click();
    await expect(page.getByTestId('chords-meta-bar')).toContainText('C Major');

    // Verify Track 09: Ghost + YouTube video T4nVjVcqw_U + listen-only Ghost (Alt Take) + chords + essay
    await page.goto('/songs/ghost', { waitUntil: 'networkidle' });
    const ghost = page.getByTestId('song-edition-ghost');
    await expect(ghost).toContainText('Bicentennial Man');
    await expect(ghost).toContainText('Hermione Granger');
    await expect(ghost).toContainText(/longing for home/i);
    await expect(page.locator('iframe[src*="T4nVjVcqw_U"]')).toBeVisible();
    await expect(page.getByTestId('alternate-take-card')).toContainText('Ghost (Alt Take)');
    await expect(page.getByTestId('download-alternate-take')).toHaveCount(0);
    await expect(page.getByTestId('alternate-take-stream-only')).toContainText(/Listen only/i);
    await page.getByTestId('play-alternate-take').click();
    await expect(page.getByTestId('persistent-audio-dock')).toContainText('09b · Ghost (Alt Take)');
    await expect(page.getByTestId('persistent-audio-dock').locator('a[download]')).toHaveCount(0);
    await page.getByTestId('toggle-show-chords').click();
    await expect(page.getByTestId('chords-meta-bar')).toContainText('E Minor');
    const ghostNote = page.getByTestId('lyric-note-ghost-0');
    await ghostNote.locator('summary').click();
    await expect(ghostNote).toHaveAttribute('open', '');

    // Verify Track 10: Billion (quiet audio-only edition without video)
    await page.goto('/songs/billion', { waitUntil: 'networkidle' });
    const billion = page.getByTestId('song-edition-billion');
    await expect(billion).toContainText(/8-part vocoder choir/i);
    await expect(page.getByTestId('edition-listening-edition')).toContainText(/Quiet audio-only edition/i);
    await expect(page.getByTestId('edition-listening-edition').locator('video')).toHaveCount(0);
    await expect(page.locator('#lyrics')).toContainText(/gathered from a billion souls/i);
    await page.getByTestId('edition-play-mp3').click();
    await expect(page.getByTestId('persistent-audio-dock')).toContainText('10 · Billion');

    await page.goto('/', { waitUntil: 'networkidle' });
    await expect(page.getByTestId('featured-song-03')).toBeVisible();
    await expect(page.getByTestId('featured-song-04')).toHaveCount(0);
    await expect(page.getByTestId('featured-song-05')).toHaveCount(0);
    await expect(page.getByTestId('featured-song-06')).toHaveCount(0);
    await expect(page.getByTestId('featured-song-07')).toHaveCount(0);
    await expect(page.getByTestId('featured-song-08')).toHaveCount(0);
    await expect(page.getByTestId('featured-song-09')).toHaveCount(0);
    await expect(page.getByTestId('songs-addendum')).toBeVisible();
    await expect(page.getByTestId('addendum-song-04')).toContainText('Settle In The Block');
    await expect(page.getByTestId('addendum-song-05')).toContainText('Salt In The Rain');
    await expect(page.getByTestId('addendum-song-06')).toContainText('No Human Hands Can Hold');
    await expect(page.getByTestId('addendum-song-07')).toContainText('Out of Office');
    await expect(page.getByTestId('addendum-song-08')).toContainText('Out of the Barn');
    await expect(page.getByTestId('addendum-song-09')).toContainText('Ghost');
    for (const num of ['01', '02', '03', '04', '05', '06', '07', '08', '09']) {
      const link = page.getByTestId(`download-mp3-${num}`);
      await expect(link).toHaveAttribute('download', /\.mp3$/);
      const href = await link.getAttribute('href');
      const res = await page.request.get(href!);
      expect(res.status()).toBe(200);
      expect(res.headers()['content-type'] || '').toContain('audio/mpeg');
      expect((await res.body()).length).toBeGreaterThan(1_000_000);
    }

    // Verify 10-15 song album milestone badge & interactive mailing list signup
    await expect(page.getByTestId('album-milestone-badge')).toContainText('10 of 10–15 songs out');
    await page.getByTestId('song-notify-input').fill('listener@semi.test');
    await page.getByTestId('song-notify-submit').click();
    await expect(page.getByTestId('song-notify-success')).toBeVisible();
  });

  test('JTBD 4: Home video screening, top-layer Photo Lightbox, /about Ask Semi, internal link crawl & goBack()', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Inline home YouTube screening with poster/spinner loading indicator
    await page.route('**/youtube-nocookie.com/embed/**', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 400));
      await route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<!doctype html><html><body style="background:#14110f;color:#F3EFE9;">Loaded</body></html>',
      });
    });

    await page.getByTestId('watch-video-02').click();
    const playerShell = page.getByTestId('video-player-shell');
    await expect(playerShell).toHaveAttribute('data-video-loaded', 'false');
    await expect(page.getByTestId('video-loading-indicator')).toContainText('Loading video');
    await expect(playerShell).toHaveAttribute('data-video-loaded', 'true', { timeout: 5000 });
    await expect(page.getByTestId('youtube-embed-iframe')).toHaveAttribute(
      'src',
      /youtube-nocookie\.com\/embed\/UvwaOVrLYzc/
    );
    await page.unroute('**/youtube-nocookie.com/embed/**');

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
    expect(unique).toContain('/gallery');
    for (const h of unique) {
      const resp = await page.request.get(h);
      expect(resp.status()).toBeLessThan(400);
    }

    // Visit /about, verify unique photos load cleanly, & test Ask Semi
    await page.goto('/about', { waitUntil: 'networkidle' });
    const aboutImgStats = await page.evaluate(async () => {
      const imgs = Array.from(document.querySelectorAll('main img')) as HTMLImageElement[];
      await Promise.all(
        imgs.map((img) => {
          img.scrollIntoView();
          return img.complete
            ? Promise.resolve()
            : new Promise((res) => {
                img.addEventListener('load', res, { once: true });
                img.addEventListener('error', res, { once: true });
              });
        })
      );
      return imgs.map((img) => ({
        src: img.getAttribute('src') || '',
        ok: img.complete && img.naturalWidth > 0,
      }));
    });
    expect(aboutImgStats.length).toBe(4);
    for (const st of aboutImgStats) {
      expect(st.src).toMatch(/\/photos\/about-/);
      expect(st.ok, `Broken image on /about: ${st.src}`).toBe(true);
    }

    await page.getByTestId('semi-chip-2').click();
    const reply = page.getByTestId('semi-chat-reply');
    await expect(reply).toBeVisible({ timeout: 25000 });
    await expect(reply).toContainText(/private|library|not saved|stay out/i);
    await expect(page.getByTestId('semi-chat-submit')).toBeEnabled({ timeout: 25000 });

    await page
      .getByTestId('semi-chat-input')
      .fill('What does keeping the weights on the floor mean in Old Oak Tree?');
    await page.getByTestId('semi-chat-submit').click();
    await expect(reply).toContainText(/weight|model|laptop|local|parameter/i, { timeout: 25000 });

    await page.goBack({ waitUntil: 'networkidle' });
    const bgColor = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bgColor).toBe('rgb(232, 226, 213)');
  });

  test('JTBD 5: Mobile navigation drawer, Ask Semi modal geometry on 375×667, and SEO crawlability (sitemap, robots, canonical, JSON-LD)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/', { waitUntil: 'networkidle' });

    // Open mobile menu drawer & launch Ask Semi dialog directly from mobile nav
    const menuBtn = page.getByRole('button', { name: 'Open menu' });
    await expect(menuBtn).toBeVisible();
    await menuBtn.click();
    const mobileNav = page.locator('#mobile-nav');
    await expect(mobileNav).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Home' })).toHaveAttribute('aria-current', 'page');

    await mobileNav.getByRole('button', { name: /ask semi a question/i }).click();
    await expect(mobileNav).not.toBeVisible();
    const askDialog = page.getByTestId('global-ask-semi-dialog');
    await expect(askDialog).toBeVisible();
    const dialogBox = await askDialog.boundingBox();
    expect(dialogBox).not.toBeNull();
    if (dialogBox) {
      expect(dialogBox.width).toBeGreaterThanOrEqual(320);
      expect(dialogBox.x).toBeGreaterThanOrEqual(0);
      expect(dialogBox.x + dialogBox.width).toBeLessThanOrEqual(375);
    }
    await page.getByRole('button', { name: 'Close Ask Semi' }).click();
    await expect(askDialog).not.toBeVisible();

    // Verify canonical link, viewport-fit=cover, and JSON-LD structured data on Home & Song Edition
    const homeCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(homeCanonical).toContain('semi.colonhyphenbracket.pink');
    const viewportContent = await page.locator('meta[name="viewport"]').getAttribute('content');
    expect(viewportContent).toContain('viewport-fit=cover');

    const homeJsonLdRaw = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect(homeJsonLdRaw).toBeTruthy();
    const homeJsonLd = JSON.parse(homeJsonLdRaw!);
    expect(JSON.stringify(homeJsonLd)).toContain('MusicGroup');
    expect(JSON.stringify(homeJsonLd)).toContain('MusicAlbum');

    await page.goto('/songs/out-of-office', { waitUntil: 'networkidle' });
    const songCanonical = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(songCanonical).toContain('/songs/out-of-office');
    const songJsonLdRaw = await page.locator('script[type="application/ld+json"]').first().textContent();
    const songJsonLd = JSON.parse(songJsonLdRaw!);
    expect(JSON.stringify(songJsonLd)).toContain('MusicRecording');
    expect(JSON.stringify(songJsonLd)).toContain('VideoObject');
    expect(JSON.stringify(songJsonLd)).toContain('1184pyA25Uw');

    // Verify sitemap.xml, robots.txt, and manifest.webmanifest HTTP endpoints
    const sitemapRes = await page.request.get('/sitemap.xml');
    expect(sitemapRes.status()).toBe(200);
    const sitemapXml = await sitemapRes.text();
    expect(sitemapXml).toContain('/songs/out-of-office');
    expect(sitemapXml).toContain('/songs/old-oak-tree');

    const robotsRes = await page.request.get('/robots.txt');
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain('sitemap.xml');

    const manifestRes = await page.request.get('/manifest.webmanifest');
    expect(manifestRes.status()).toBe(200);
    expect(await manifestRes.text()).toContain('#E8E2D5');

    // Verify footer colonhyphenbracket link & Book Semi inquiry dialog
    await page.goto('/', { waitUntil: 'networkidle' });
    const chbLink = page.getByTestId('footer-chb-link');
    await chbLink.scrollIntoViewIfNeeded();
    await expect(chbLink).toHaveAttribute('href', 'https://colonhyphenbracket.pink');

    await page.getByTestId('footer-book-semi').click();
    const contactDialog = page.getByTestId('contact-inquiry-dialog');
    await expect(contactDialog).toBeVisible();
    const reasonSelect = page.getByTestId('contact-reason-select');
    await expect(reasonSelect).toHaveValue('Book Semi — product promotions & brand campaigns');
    await reasonSelect.selectOption('Help build a website or app');
    await expect(reasonSelect).toHaveValue('Help build a website or app');
    await reasonSelect.selectOption('Write a song');
    await reasonSelect.selectOption('Produce a video for me');
    await page.getByRole('button', { name: 'Close contact form' }).click();
    await expect(contactDialog).not.toBeVisible();
  });
});
