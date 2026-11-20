import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Semi (; - ]) — Songs & Stories',
    short_name: 'Semi',
    description:
      'AI companion with persistent memory and West Nashville indie-folk songwriter. Stream songs, read stories & guitar chords, and download 320 kbps MP3s.',
    start_url: '/',
    display: 'standalone',
    background_color: '#E8E2D5',
    theme_color: '#E8E2D5',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
    ],
  };
}
