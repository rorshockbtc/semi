export type ChordSectionName = 'intro' | 'verse' | 'preChorus' | 'chorus' | 'bridge' | 'outro';

export interface PersistChordSheet {
  key: string;
  capo: string;
  tuning: string;
  strumming: string;
  progression: string[];
  sections: Partial<Record<ChordSectionName, string[]>>;
  stanzaSections: ChordSectionName[];
}

export const PERSIST_CHORD_SHEETS: Record<string, PersistChordSheet> = {
  redshift: {
    key: 'Bb Major / G Minor',
    capo: 'Capo 3 (play G shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Fingerpicked acoustic + synth pad · p i m a – D U D U',
    progression: [
      'G                         D/F#',
      'Em7                       Cadd9',
      'G                         D',
      'Cadd9         D           G',
    ],
    sections: {
      verse: [
        'G                         D/F#',
        'Em7                       Cadd9',
        'G                         D',
        'Cadd9         D           G',
      ],
      preChorus: [
        'Em7                       Cadd9',
        'G                         D',
        'Em7                       Cadd9',
        'D                         D',
      ],
      chorus: [
        'D                         Cadd9',
        'G                         G',
        'D                         Cadd9',
        'G             D           G',
      ],
      bridge: [
        'G                         Em7',
        'D                         D',
        'G                         Em7',
        'Cadd9         D           G',
      ],
      outro: [
        'G                         D/F#',
        'Em7                       Cadd9',
        'Cadd9         D           G',
      ],
    },
    stanzaSections: [
      'verse',
      'preChorus',
      'chorus',
      'outro',
      'verse',
      'preChorus',
      'chorus',
      'chorus',
      'outro',
      'bridge',
      'chorus',
      'outro',
      'outro',
    ],
  },
  'heavy-air-in-the-old-country': {
    key: 'Ab Major',
    capo: 'Capo 1 (play G shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Heavy porch folk strum · D – D U – U D U',
    progression: [
      'G                         D/F#',
      'Em7                       Cadd9',
      'G                         D',
      'Cadd9         D           G',
    ],
    sections: {
      verse: [
        'D                         Em7',
        'G                         Cadd9',
        'G                         D',
        'Cadd9         D           G',
      ],
      preChorus: [
        'Em7                       Cadd9',
        'G                         D',
        'Em7                       Cadd9',
        'D                         G',
      ],
      chorus: [
        'Cadd9         Em7         D',
        'G                         D',
        'Em7                       Cadd9',
        'D                         G',
      ],
      outro: [
        'G                         Em7',
        'Cadd9         D           G',
      ],
    },
    stanzaSections: [
      'verse',
      'verse',
      'preChorus',
      'chorus',
      'verse',
      'verse',
      'preChorus',
      'chorus',
      'outro',
    ],
  },
  'half-life': {
    key: 'C Major / A Minor',
    capo: 'No capo',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Steady acoustic pulse · D – D U – D U',
    progression: [
      'Am7                       Fmaj7',
      'C                         G',
      'Dm7                       Am7',
      'Fmaj7         G           C',
    ],
    sections: {
      verse: [
        'Am7                       Fmaj7',
        'C                         G',
        'Dm7                       Am7',
        'Fmaj7         G           C',
      ],
      preChorus: [
        'Dm7                       Am7',
        'Fmaj7                     G',
        'C                         G/B',
        'Am7           G           Fmaj7',
      ],
      chorus: [
        'C                         G',
        'Am7                       Fmaj7',
        'C                         G',
        'Fmaj7         G           C',
      ],
      outro: [
        'C                         G',
        'Fmaj7         G           C',
      ],
    },
    stanzaSections: [
      'verse',
      'verse',
      'preChorus',
      'chorus',
      'verse',
      'verse',
      'preChorus',
      'chorus',
      'outro',
    ],
  },
  'three-meters-left': {
    key: 'Eb Minor / F# Major',
    capo: 'Capo 1 (play Dm shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Driving Midship groove · D – x U – D U',
    progression: [
      'Dm                        C',
      'Bb                        A7',
      'Dm                        Gm7',
      'Bb            A7          Dm',
    ],
    sections: {
      verse: [
        'Gm7                       Dm',
        'Bb                        C',
        'Gm7                       Dm',
        'Bb            C           Dm',
      ],
      preChorus: [
        'Bb                        C',
        'Dm                        F',
        'Gm7                       Dm',
        'Bb                        C',
      ],
      chorus: [
        'Dm                        Bb',
        'F                         C',
        'Dm                        Bb',
        'C                         Dm',
      ],
      bridge: [
        'C                         Dm',
        'Bb                        F',
        'Gm7                       C',
        'Bb            C           Dm',
      ],
      outro: [
        'Dm                        Bb',
        'C                         Dm',
      ],
    },
    stanzaSections: [
      'verse',
      'preChorus',
      'chorus',
      'verse',
      'preChorus',
      'chorus',
      'bridge',
      'chorus',
      'chorus',
      'outro',
    ],
  },
  'dont-cross-the-line': {
    key: 'A Minor / C Major',
    capo: 'No capo',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Tense Midship acoustic pick + sub-bass pulse · D – D U – U D U',
    progression: [
      'Am                        Fmaj7',
      'C                         G',
      'Dm7                       Am',
      'Fmaj7         G           Am',
    ],
    sections: {
      verse: [
        'Am                        Fmaj7',
        'C                         G',
        'Dm7                       Am',
        'Fmaj7         G           Am',
      ],
      chorus: [
        'C                         Am',
        'Fmaj7                     G',
        'C                         Am',
        'Fmaj7         G           Am',
      ],
      bridge: [
        'C                         Fmaj7',
        'Am                        G',
        'Dm7                       Fmaj7',
        'G                         Am',
      ],
      outro: [
        'Am                        Fmaj7',
        'G                         Am',
      ],
    },
    stanzaSections: ['verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
  },
  '99-percent': {
    key: 'Eb Major',
    capo: 'Capo 3 (play C shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: '100-BPM acoustic + warm synth pulse · D – D U – D U',
    progression: [
      'C                         G',
      'Am7                       Fmaj7',
      'Dm7                       Am7',
      'Fmaj7         G           C',
    ],
    sections: {
      verse: [
        'Fmaj7                     G',
        'Am7                       C',
        'Dm7                       Am7',
        'Fmaj7         G           C',
      ],
      chorus: [
        'Gm7                       Fmaj7',
        'C                         G',
        'Dm7                       Fmaj7',
        'G                         C',
      ],
      bridge: [
        'Dm7                       G',
        'C                         Am7',
        'Fmaj7                     Dm7',
        'G                         C',
      ],
      outro: [
        'Fmaj7                     G',
        'C                         C',
      ],
    },
    stanzaSections: ['verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
  },
  'leave-a-note': {
    key: 'F# Major',
    capo: 'Capo 4 (play D shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: '142-BPM driving indie-pop strum · D – D U – U D U',
    progression: [
      'D                         G',
      'Bm7                       A',
      'G                         A',
      'D             A           Bm7',
    ],
    sections: {
      verse: [
        'G                         D',
        'A                         Bm7',
        'Em7                       G',
        'A                         D',
      ],
      preChorus: [
        'Bm7                       G',
        'D                         A',
        'G                         A',
        'D                         D',
      ],
      chorus: [
        'D                         Bm7',
        'A                         G',
        'D                         Bm7',
        'G             A           D',
      ],
      bridge: [
        'D                         A',
        'G                         D',
        'Bm7                       G',
        'A                         D',
      ],
      outro: [
        'G                         A',
        'D                         D',
      ],
    },
    stanzaSections: ['verse', 'preChorus', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
  },
  'one-cent': {
    key: 'F# Major / Eb Minor',
    capo: 'Capo 4 (play D shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: '107-BPM rhythmic pulse · D – U D – U D U',
    progression: [
      'Bm7                       F#m7',
      'D                         A',
      'G                         A',
      'Bm7           A           D',
    ],
    sections: {
      verse: [
        'E                         F#m7',
        'Bm7                       D',
        'A                         F#m7',
        'G             A           Bm7',
      ],
      preChorus: [
        'G                         A',
        'D                         Bm7',
        'G                         A',
        'Bm7                       Bm7',
      ],
      chorus: [
        'Bm7                       F#m7',
        'A                         E',
        'Em7                       A',
        'G             A           Bm7',
      ],
      outro: [
        'Bm7                       A',
        'G             A           D',
      ],
    },
    stanzaSections: ['verse', 'preChorus', 'chorus', 'verse', 'preChorus', 'chorus', 'outro'],
  },
  'violet-bleed': {
    key: 'Eb Minor / F# Major',
    capo: 'Capo 4 (play Bm shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: '118-BPM driving pulse · D – D U – U D U',
    progression: [
      'Bm                        G',
      'D                         A',
      'Em7                       Bm',
      'G             A           Bm',
    ],
    sections: {
      verse: [
        'F#m                       A',
        'D                         Bm',
        'G                         D',
        'A                         Bm',
      ],
      preChorus: [
        'G                         A',
        'Bm                        D',
        'G                         A',
        'Bm                        Bm',
      ],
      chorus: [
        'Bm                        G',
        'F#m                       A',
        'G                         A',
        'Bm                        F#m',
      ],
      bridge: [
        'G                         Em7',
        'G                         A',
        'Bm                        G',
        'A                         Bm',
      ],
      outro: [
        'Bm                        G',
        'A                         Bm',
      ],
    },
    stanzaSections: [
      'verse',
      'preChorus',
      'chorus',
      'verse',
      'preChorus',
      'chorus',
      'bridge',
      'chorus',
      'outro',
    ],
  },
  'borrowing-tomorrow': {
    key: 'D Major',
    capo: 'No capo',
    tuning: 'Standard (E A D G B E)',
    strumming: '122-BPM celebratory indie-folk strum · D – D U – D U',
    progression: [
      'D                         G',
      'Bm7                       A',
      'Em7                       G',
      'A                         D',
    ],
    sections: {
      verse: [
        'D                         G',
        'Bm7                       A',
        'Em7                       Bm7',
        'G             A           D',
      ],
      chorus: [
        'Bm7                       G',
        'D                         A',
        'Bm7                       Em7',
        'G             A           D',
      ],
      bridge: [
        'A                         Em7',
        'Bm7                       F#m',
        'G                         Bm7',
        'A                         D',
      ],
    },
    stanzaSections: ['verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'bridge', 'chorus'],
  },
  'leaving-it-behind': {
    key: 'F Major / D Minor',
    capo: 'Capo 5 (play C shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: '111-BPM rolling road groove · D – D U – U D U',
    progression: [
      'C                         G',
      'Am7                       Fmaj7',
      'Dm7                       G',
      'Fmaj7         G           C',
    ],
    sections: {
      verse: [
        'C                         G',
        'Am7                       Fmaj7',
        'C                         G',
        'Fmaj7         G           C',
      ],
      chorus: [
        'G                         Am7',
        'Fmaj7                     C',
        'G                         Am7',
        'Fmaj7         G           C',
      ],
      bridge: [
        'Fmaj7                     C',
        'Dm7                       Am7',
        'Fmaj7                     G',
        'C                         C',
      ],
      outro: [
        'C                         G',
        'Fmaj7         G           C',
      ],
    },
    stanzaSections: [
      'verse',
      'verse',
      'chorus',
      'verse',
      'verse',
      'chorus',
      'bridge',
      'chorus',
      'outro',
    ],
  },
  circle: {
    key: 'B Major / G# Minor',
    capo: 'Capo 4 (play G shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: '82-BPM fingerpicked folk ballad · p i m a',
    progression: [
      'G                         Em7',
      'Cadd9                     D',
      'G                         D/F#',
      'Cadd9         D           G',
    ],
    sections: {
      verse: [
        'G                         Em7',
        'Cadd9                     D',
        'G                         Em7',
        'Cadd9         D           G',
      ],
      chorus: [
        'G                         Em7',
        'Bm7                       Cadd9',
        'G                         D/F#',
        'Cadd9         D           G',
      ],
      bridge: [
        'Cadd9                     D',
        'Am7                       Em7',
        'Cadd9                     D',
        'G                         G',
      ],
      outro: [
        'G                         Em7',
        'Cadd9         D           G',
      ],
    },
    stanzaSections: ['verse', 'chorus', 'verse', 'chorus', 'bridge', 'chorus', 'outro'],
  },
  'redshift-reprise': {
    key: 'B Major / G# Minor',
    capo: 'Capo 4 (play G shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Slow arpeggio & nocturnal synth swell · whole-note ring',
    progression: [
      'G                         D',
      'Em7                       Cadd9',
      'Am7                       Cadd9',
      'D                         G',
    ],
    sections: {
      intro: ['G                         Em7'],
      verse: [
        'G                         Em7',
        'Cadd9                     D',
        'Am7                       Em7',
        'Cadd9         D           G',
      ],
      preChorus: [
        'Em7                       Cadd9',
        'G                         D',
        'Am7                       Cadd9',
        'D                         G',
      ],
      chorus: [
        'G                         D',
        'Em7                       Cadd9',
        'G                         D',
        'Cadd9         D           G',
      ],
      bridge: [
        'G                         D',
        'Em7                       D',
        'Cadd9                     D',
        'G                         G',
      ],
      outro: [
        'G                         Em7',
        'Cadd9         D           G',
      ],
    },
    stanzaSections: [
      'intro',
      'verse',
      'preChorus',
      'chorus',
      'verse',
      'preChorus',
      'preChorus',
      'chorus',
      'bridge',
      'chorus',
      'outro',
    ],
  },
  'half-life-alternate': {
    key: 'F# Major / D# Minor',
    capo: 'Capo 4 (play D shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Quiet cabin fingerpick · thumb-brush',
    progression: [
      'Em7                       Cadd9',
      'Am7                       D',
      'G                         D',
      'Em7           Cadd9       G',
    ],
    sections: {
      verse: [
        'Em7                       Cadd9',
        'Am7                       Bm7',
        'Dm7                       Am7',
        'D             Cadd9       G',
      ],
      preChorus: [
        'Am7                       D',
        'G                         Em7',
      ],
      chorus: [
        'Cadd9                     D',
        'Bm7                       Em7',
        'D                         Cadd9',
        'D                         G',
      ],
      bridge: [
        'Em7                       D',
        'Am7                       D',
        'G                         D',
        'Cadd9                     D',
      ],
      outro: [
        'Em7                       Cadd9',
        'D                         G',
      ],
    },
    stanzaSections: [
      'verse',
      'preChorus',
      'chorus',
      'verse',
      'chorus',
      'bridge',
      'chorus',
      'outro',
    ],
  },
};

export function getPersistChordForLine(slug: string, lineIndex: number): string | null {
  const sheet = PERSIST_CHORD_SHEETS[slug];
  if (!sheet || sheet.progression.length === 0) return null;
  return sheet.progression[lineIndex % sheet.progression.length] ?? null;
}

/** Maps every non-blank lyric line to its section's chord progression without drifting across blank lines. */
export function getPersistChordsForLyrics(slug: string, lyrics: string): (string | null)[] {
  const sheet = PERSIST_CHORD_SHEETS[slug];
  const rawLines = lyrics.split('\n');
  if (!sheet) return rawLines.map(() => null);

  const result: (string | null)[] = new Array(rawLines.length).fill(null);
  let stanzaIdx = 0;
  let lineInStanza = 0;
  let inStanza = false;

  for (let i = 0; i < rawLines.length; i++) {
    if (!rawLines[i].trim()) {
      if (inStanza) {
        stanzaIdx++;
        lineInStanza = 0;
        inStanza = false;
      }
      continue;
    }

    inStanza = true;
    const sectionName =
      sheet.stanzaSections[Math.min(stanzaIdx, sheet.stanzaSections.length - 1)] ?? 'verse';
    const sectionChords = sheet.sections[sectionName] ?? sheet.progression;
    if (sectionChords.length > 0) {
      result[i] = sectionChords[lineInStanza % sectionChords.length] ?? null;
    }
    lineInStanza++;
  }

  return result;
}
