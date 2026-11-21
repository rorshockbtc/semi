export interface TrackChordSheet {
  key: string;
  capo: string;
  tuning: string;
  strumming: string;
  /**
   * Keyed by normalized section type ('verse', 'pre-chorus', 'chorus', 'bridge', 'outro').
   * Each entry provides chord lines corresponding to line index (wraps cleanly if a stanza has extra tag lines).
   */
  sections: Record<string, string[]>;
}

export const SEMI_CHORD_SHEETS: Record<string, TrackChordSheet> = {
  'old-oak-tree': {
    key: 'D Major',
    capo: 'No capo (open shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Warm porch fingerpicking · D – D U – U D U',
    sections: {
      verse: [
        'D                         Gadd9',
        'Bm7                       A',
        'D/F#                      G',
        'Em7                       Asus4   A',
        'Bm7                       G',
        'D                         A       D',
      ],
      'pre-chorus': [
        'Em7                       D/F#',
        'G                         A',
        'Em7                       Bm7',
        'G                         Asus4   A',
      ],
      chorus: [
        'D                         G',
        'Bm7                       A',
        'D/F#                      G',
        'Em7                       A',
        'Bm7                       G',
        'Em7           A           D',
      ],
      bridge: [
        'Bm7                       F#m7',
        'G                         D',
        'Em7                       Bm7',
        'G                         Asus4   A',
      ],
      outro: [
        'D                         G',
        'Bm7                       A',
        'G             A           D',
      ],
    },
  },

  'warm-unknown': {
    key: 'F# Minor (play Em shapes)',
    capo: 'Capo 2',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Gentle thumb-brush waltz · D – D U – D U',
    sections: {
      verse: [
        'Em                        Cadd9',
        'G                         D/F#',
        'Em                        Cadd9',
        'Am7                       B7',
        'Em                        Cadd9',
        'G                         D/F#',
        'Am7                       Em',
        'Cadd9         D           Em',
      ],
      'pre-chorus': [
        'Am7                       Em',
        'Cadd9                     G       D/F#',
        'Am7                       B7',
      ],
      chorus: [
        'Cadd9                     G',
        'D                         Em',
        'Cadd9                     G',
        'Am7                       D',
        'Cadd9                     Em      D/F#',
        'Am7           D           Em',
      ],
      bridge: [
        'Am7                       Em',
        'Cadd9                     G',
        'Am7                       Em',
        'Cadd9                     D',
        'Am7                       G/B',
        'Cadd9                     B7',
      ],
      outro: [
        'Cadd9                     G',
        'Am7                       Em',
        'Cadd9         D           Em',
      ],
    },
  },

  'marks-on-the-screen-ink-on-the-page': {
    key: 'A Major / F# Minor (play G / Em shapes)',
    capo: 'Capo 2',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Crisp acoustic pulse · D – D U – U D U',
    sections: {
      verse: [
        'G                         D/F#',
        'Em7                       Cadd9',
        'G                         D',
        'Am7                       Cadd9',
        'Em7                       Bm7',
        'Cadd9                     G',
        'Am7                       D',
        'Cadd9         D           G',
      ],
      chorus: [
        'G                         Cadd9',
        'Em7                       D',
        'G/B                       Cadd9',
        'Am7                       D',
        'Em7                       Cadd9',
        'G                         D/F#',
        'Am7                       Cadd9',
        'D                         G',
      ],
      bridge: [
        'Em7                       Cadd9',
        'G                         D',
        'Em7                       Bm7',
        'Cadd9                     Am7',
        'G/B                       Cadd9',
        'Am7                       D',
      ],
      outro: [
        'G                         Cadd9',
        'Em7                       D',
        'Cadd9         D           G',
      ],
    },
  },

  'settle-in-the-block': {
    key: 'G Minor (play Em shapes)',
    capo: 'Capo 3',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Steady nocturnal Travis pick · Bass – D U – Bass – D U',
    sections: {
      verse: [
        'Em                        Cadd9',
        'G                         D/F#',
        'Em                        Am7',
        'Cadd9                     D',
        'Em                        Cadd9',
        'G                         D/F#',
        'Am7                       Cadd9',
        'D                         Em',
      ],
      'pre-chorus': [
        'Am7                       Em',
        'Cadd9                     G',
        'Am7                       Cadd9',
        'B7                        B7',
      ],
      chorus: [
        'Cadd9                     G',
        'D                         Em',
        'Cadd9                     G       D/F#',
        'Am7                       D',
        'Cadd9         D           Em',
      ],
      bridge: [
        'Am7                       Em',
        'Cadd9                     G',
        'Am7                       Cadd9',
        'D                         B7',
      ],
      outro: [
        'Cadd9                     G',
        'Am7                       Em',
        'Cadd9         D           Em',
      ],
    },
  },

  'salt-in-the-rain': {
    key: 'E Major / C# Minor (play C / Am shapes)',
    capo: 'Capo 4',
    tuning: 'Standard (E A D G B E) · Mandolin chop optional',
    strumming: 'Upbeat sunlit folk-strum · D – D U – U D U (backbeat clap on 2 & 4)',
    sections: {
      verse: [
        'Am                        F',
        'C                         G',
        'Am                        F',
        'Dm7                       G',
        'Am                        F',
        'C             G           C',
      ],
      'pre-chorus': [
        'F                         C',
        'G                         Am',
        'F                         C',
        'Dm7                       G',
      ],
      chorus: [
        'C                         G',
        'Am                        F',
        'C                         G',
        'Dm7           G           C',
        'F             G           Am',
        'F             G           C',
      ],
      bridge: [
        'Dm7                       Am',
        'F                         C',
        'Dm7                       Am',
        'F                         G',
        'F                         G',
        'Gsus4                     G',
      ],
      outro: [
        'F                         C',
        'Dm7                       G',
        'F             G           C',
      ],
    },
  },

  'no-human-hands-can-hold': {
    key: 'C Minor (play Am shapes)',
    capo: 'Capo 3',
    tuning: 'Standard (E A D G B E) · Subtle ambient lap steel',
    strumming: 'Unhurried thumb-brush · D – D – D U (let chords ring)',
    sections: {
      verse: [
        'Am                        Fmaj7',
        'C                         G',
        'Am                        Fmaj7',
        'Dm7                       E7',
      ],
      'pre-chorus': [
        'Fmaj7                     C',
        'G                         Am',
        'Fmaj7                     C',
        'Dm7                       G',
      ],
      chorus: [
        'C                         G',
        'Am                        Fmaj7',
        'C                         G',
        'Fmaj7         G           C',
      ],
      outro: [
        'Fmaj7                     C',
        'G                         Am',
        'Fmaj7                     C',
        'Dm7           G           C',
        'Fmaj7         G           C',
      ],
    },
  },
  'out-of-office': {
    key: 'G Major',
    capo: 'Standard (No Capo)',
    tuning: 'Standard (E A D G B E)',
    strumming: '118 BPM · Brisk Folk Strum · ↓  ↓↑  ↑↓↑',
    sections: {
      verse: [
        'G                         Em',
        'C                         D',
        'G                         Em',
        'C                         D',
        'G                         Em',
        'C                         D',
        'G                         Em',
        'C                         D',
      ],
      'pre-chorus': [
        'C                         D',
        'Em                        G',
        'C                         D',
        'C                         D',
      ],
      chorus: [
        'G                         D',
        'Em                        C',
        'G                         D',
        'C           D             G',
      ],
      bridge: [
        'Em                        C',
        'G                         D',
        'Em                        C',
        'Am          C             D',
      ],
      outro: [
        'G                         Em',
        'C           D             G',
        'G',
      ],
    },
  },
  'out-of-the-barn': {
    key: 'C Major',
    capo: 'Standard (No Capo)',
    tuning: 'Standard (E A D G B E)',
    strumming: '122 BPM · Driving Folk-Rock Strum · ↓  ↓↑  ↑↓↑',
    sections: {
      verse: [
        'C                         Am',
        'F                         G',
        'C                         Am',
        'F                         G',
        'C                         Am',
        'F                         G',
        'C                         Am',
        'F                         G',
        'Dm7                       F',
        'G',
      ],
      chorus: [
        'C                         Am',
        'F                         G',
        'C                         Am',
        'F                         G',
        'Am                        F',
        'C                         G',
        'F                         G',
        'C',
      ],
      outro: [
        'C           F             G     C',
      ],
    },
  },
  ghost: {
    key: 'E Minor → G Major (Modal Suspension Lift)',
    capo: 'No capo (open modal voicings)',
    tuning: 'Standard (E A D G B E)',
    strumming: '82 BPM · Sparse fingerpicking + sustained solo cello counterpoint',
    sections: {
      verse: [
        'Em9                       Cmaj7#11',
        'Am9                       B7sus4   B7',
        'Em9                       Cmaj7#11',
        'Am7                       Dadd4/F#',
        'Em9                       Cmaj7',
        'Am9                       Bm7',
        'Cmaj7                     Am9',
        'B7sus4                    Em',
      ],
      'pre-chorus': [
        'Cmaj7                     D6',
        'Bm7                       Em9',
      ],
      chorus: [
        'G                         D/F#',
        'Em7                       Cmaj9',
        'G                         D/F#',
        'Am7                       D',
        'Em7                       Bm7     Cmaj7',
        'Am7           D           G',
      ],
      bridge: [
        'Am9                       Em7',
        'Cmaj7                     G',
        'Am9                       Bm7',
        'Cmaj7                     Dsus4   D',
      ],
      outro: [
        'G                         Cmaj7',
        'G/B                       Cadd9',
        'Em7                       D6',
        'Cmaj7                     G/B',
        'Am7                       Dsus4   D',
        'Cadd9         D           G',
      ],
    },
  },
};

export function getChordForStanzaLine(
  slug: string,
  sectionLabel: string,
  lineIndex: number,
  lineText: string
): string | null {
  const sheet = SEMI_CHORD_SHEETS[slug];
  if (!sheet) return null;
  // Skip parenthetical backing-vocal ad-lib lines so chords stay uncluttered
  const trimmed = lineText.trim();
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) return null;

  const lower = sectionLabel.toLowerCase();
  const key = lower.includes('pre-chorus')
    ? 'pre-chorus'
    : lower.includes('chorus')
      ? 'chorus'
      : lower.includes('bridge')
        ? 'bridge'
        : lower.includes('outro')
          ? 'outro'
          : 'verse';

  const lines = sheet.sections[key] ?? sheet.sections.verse;
  if (!lines || lines.length === 0) return null;
  return lines[lineIndex % lines.length] ?? null;
}
