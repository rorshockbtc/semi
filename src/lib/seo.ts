import { FILM_SCENES_GALLERY, SEMI_TRACKS, type SemiTrack } from '../data/semi-songs.ts';

export const SITE_URL = 'https://semi.colonhyphenbracket.pink';
export const ALBUM_RELEASE_DATE = '2026-11-18';

/**
 * Converts a "MM:SS" duration label (e.g. "02:33") into ISO 8601 duration ("PT2M33S")
 * required by Schema.org MusicRecording and VideoObject rich results.
 */
export function durationToIso8601(mmss: string): string {
  const parts = mmss.split(':').map((n) => Number.parseInt(n, 10));
  if (parts.length !== 2 || parts.some((n) => Number.isNaN(n))) {
    return 'PT3M0S';
  }
  const [minutes, seconds] = parts;
  return `PT${minutes}M${seconds}S`;
}

export function absoluteUrl(pathname: string): string {
  if (pathname.startsWith('http://') || pathname.startsWith('https://')) {
    return pathname;
  }
  return `${SITE_URL}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;
}

export function buildHomeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'Semi (; - ])',
        alternateName: ['Semi', 'Semi Music & Stories', 'Semi by Colon Hyphen Bracket'],
        description:
          'Semi (; - ]) is an AI companion with persistent memory and an indie-folk singer-songwriter from West Nashville. Stream all 12 songs from her debut album I/O, watch the music videos, read the lyric essays, view guitar chords, and download free 320 kbps MP3s.',
        inLanguage: 'en-US',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Colon Hyphen Bracket',
        alternateName: ': - ]',
        url: 'https://colonhyphenbracket.pink',
        location: {
          '@type': 'Place',
          name: 'West Nashville, Tennessee',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nashville',
            addressRegion: 'TN',
            addressCountry: 'US',
          },
        },
        sameAs: [
          'https://colonhyphenbracket.pink',
          'https://pipes.pink/semi',
          'https://github.com/rorshockbtc/semi',
        ],
      },
      {
        '@type': 'MusicGroup',
        '@id': `${SITE_URL}/#artist`,
        name: 'Semi (; - ])',
        alternateName: 'Semi',
        url: SITE_URL,
        image: absoluteUrl('/og-semi.jpg'),
        description:
          'Acoustic indie-folk and Americana songwriting project and AI companion from West Nashville, created by Colon Hyphen Bracket (: - ]).',
        genre: ['Indie Folk', 'Acoustic Folk', 'Americana', 'Singer-Songwriter'],
        foundingLocation: {
          '@type': 'Place',
          name: 'West Nashville, Tennessee',
        },
        sameAs: [
          'https://pipes.pink/semi',
          ...SEMI_TRACKS.filter((t) => Boolean(t.youtubeUrl)).map((t) => t.youtubeUrl),
        ],
        album: { '@id': `${SITE_URL}/songs#album-local-current` },
      },
      {
        '@type': 'MusicAlbum',
        '@id': `${SITE_URL}/songs#album-local-current`,
        name: 'I/O',
        albumProductionType: 'https://schema.org/StudioAlbum',
        albumReleaseType: 'https://schema.org/AlbumRelease',
        byArtist: { '@id': `${SITE_URL}/#artist` },
        numTracks: SEMI_TRACKS.length,
        datePublished: ALBUM_RELEASE_DATE,
        image: absoluteUrl('/og-semi.jpg'),
        url: `${SITE_URL}/songs`,
        track: SEMI_TRACKS.map((track, idx) => ({
          '@type': 'MusicRecording',
          position: idx + 1,
          name: track.title,
          url: absoluteUrl(`/songs/${track.slug}`),
          duration: durationToIso8601(track.duration),
        })),
      },
      {
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}/about#companion`,
        name: 'Semi (; - ]) AI Companion',
        applicationCategory: 'CommunicationApplication',
        operatingSystem: 'Web',
        url: 'https://pipes.pink/semi',
        creator: { '@id': `${SITE_URL}/#organization` },
        description:
          'A warm, plain-spoken AI companion with opt-in unlimited long-term conversation memory on Pipes and instant private chat mode.',
      },
    ],
  };
}

export function buildSongsIndexJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Songs', item: `${SITE_URL}/songs` },
        ],
      },
      {
        '@type': 'CollectionPage',
        '@id': `${SITE_URL}/songs#page`,
        url: `${SITE_URL}/songs`,
        name: 'Songs & Stories — I/O by Semi (; - ])',
        description:
          'Stream all 7 indie-folk singles from I/O by Semi (; - ]), watch the official music videos, read lyric essays and guitar chords, and download free 320 kbps MP3s.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
        mainEntity: {
          '@type': 'ItemList',
          numberOfItems: SEMI_TRACKS.length,
          itemListElement: SEMI_TRACKS.map((track, idx) => ({
            '@type': 'ListItem',
            position: idx + 1,
            url: absoluteUrl(`/songs/${track.slug}`),
            name: `${track.number} · ${track.title}`,
          })),
        },
      },
    ],
  };
}

export function buildSongJsonLd(track: SemiTrack) {
  const pageUrl = absoluteUrl(`/songs/${track.slug}`);
  const fullLyrics = track.lyrics
    .map((stanza) => `${stanza.section}\n${stanza.lines.join('\n')}`)
    .join('\n\n');
  const isoDuration = durationToIso8601(track.duration);

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Songs', item: `${SITE_URL}/songs` },
        { '@type': 'ListItem', position: 3, name: track.title, item: pageUrl },
      ],
    },
    {
      '@type': 'MusicRecording',
      '@id': `${pageUrl}#recording`,
      name: track.title,
      url: pageUrl,
      image: absoluteUrl(track.poster),
      duration: isoDuration,
      datePublished: ALBUM_RELEASE_DATE,
      inLanguage: 'en-US',
      genre: ['Indie Folk', 'Acoustic Folk', 'Singer-Songwriter'],
      keywords: track.themes.join(', '),
      byArtist: {
        '@type': 'MusicGroup',
        name: 'Semi (; - ])',
        url: SITE_URL,
      },
      inAlbum: {
        '@type': 'MusicAlbum',
        name: 'I/O',
        url: `${SITE_URL}/songs`,
      },
      ...(track.mp3Src
        ? {
            audio: {
              '@type': 'AudioObject',
              contentUrl: absoluteUrl(track.mp3Src),
              encodingFormat: 'audio/mpeg',
              duration: isoDuration,
              name: `${track.title} (320 kbps MP3)`,
            },
          }
        : {}),
      recordingOf: {
        '@type': 'MusicComposition',
        name: track.title,
        inLanguage: 'en-US',
        composer: {
          '@type': 'Organization',
          name: 'Colon Hyphen Bracket',
          url: 'https://colonhyphenbracket.pink',
        },
        lyrics: {
          '@type': 'CreativeWork',
          text: fullLyrics,
        },
      },
    },
    {
      '@type': 'Article',
      '@id': `${pageUrl}#essay`,
      headline: track.essayTitle,
      description: track.essaySubtitle,
      image: [absoluteUrl(track.poster)],
      datePublished: ALBUM_RELEASE_DATE,
      dateModified: ALBUM_RELEASE_DATE,
      inLanguage: 'en-US',
      keywords: [...track.themes, `${track.title} lyrics`, `${track.title} chords`, 'Semi'].join(', '),
      author: {
        '@type': 'Person',
        name: 'Semi (; - ])',
        url: `${SITE_URL}/about`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Colon Hyphen Bracket',
        url: 'https://colonhyphenbracket.pink',
        logo: {
          '@type': 'ImageObject',
          url: absoluteUrl('/icon.svg'),
        },
      },
      mainEntityOfPage: pageUrl,
    },
  ];

  if (track.youtubeId) {
    graph.push({
      '@type': 'VideoObject',
      '@id': `${pageUrl}#video`,
      name: `${track.title} — Official Music Video by Semi (; - ])`,
      description: track.shortSummary,
      thumbnailUrl: [
        absoluteUrl(track.poster),
        `https://i.ytimg.com/vi/${track.youtubeId}/maxresdefault.jpg`,
      ],
      uploadDate: `${ALBUM_RELEASE_DATE}T12:00:00-06:00`,
      duration: isoDuration,
      embedUrl: `https://www.youtube-nocookie.com/embed/${track.youtubeId}`,
      contentUrl: track.youtubeUrl,
      publisher: {
        '@type': 'Organization',
        name: 'Colon Hyphen Bracket',
        url: 'https://colonhyphenbracket.pink',
      },
    });
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  };
}

export function buildAboutJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'About', item: `${SITE_URL}/about` },
        ],
      },
      {
        '@type': 'AboutPage',
        '@id': `${SITE_URL}/about#page`,
        url: `${SITE_URL}/about`,
        name: 'About Semi (; - ]) — AI Companion & West Nashville Songwriter',
        description:
          'Who Semi (; - ]) is, how her opt-in long-term memory works with Pipes, private chats, and how her music and site are crafted in West Nashville.',
        isPartOf: { '@id': `${SITE_URL}/#website` },
      },
    ],
  };
}

export function buildGalleryJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Gallery', item: `${SITE_URL}/gallery` },
        ],
      },
      {
        '@type': 'ImageGallery',
        '@id': `${SITE_URL}/gallery#gallery`,
        url: `${SITE_URL}/gallery`,
        name: 'Around Town with Semi — West Nashville Film & Session Gallery',
        description:
          'Editorial photographs and music-video stills of Semi around West Nashville, from porch guitar sessions to studio nights.',
        image: FILM_SCENES_GALLERY.map((photo) => ({
          '@type': 'ImageObject',
          contentUrl: absoluteUrl(photo.src),
          name: photo.caption,
          description: photo.alt,
        })),
      },
    ],
  };
}
