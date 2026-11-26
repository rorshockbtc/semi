export interface PersistChordSheet {
  key: string;
  capo: string;
  tuning: string;
  strumming: string;
  progression: string[];
}

export const PERSIST_CHORD_SHEETS: Record<string, PersistChordSheet> = {
  redshift: {
    key: 'G Major',
    capo: 'No capo (open voicings)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Fingerpicked acoustic + synth pad · p i m a – D U D U',
    progression: [
      'G                         D/F#',
      'Em7                       Cadd9',
      'G                         D',
      'Cadd9         D           G',
    ],
  },
  'heavy-air-in-the-old-country': {
    key: 'D Major (Drop D feel)',
    capo: 'Capo 2 (play C shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Heavy porch folk strum · D – D U – U D U',
    progression: [
      'C                         G/B',
      'Am7                       Fmaj7',
      'C                         G',
      'Fmaj7         G           C',
    ],
  },
  'half-life': {
    key: 'A Minor / C Major',
    capo: 'No capo',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Steady acoustic pulse · D – D U – D U',
    progression: [
      'Am7                       Fmaj7',
      'C                         G',
      'Dm7                       Am7',
      'Fmaj7         G           C',
    ],
  },
  'three-meters-left': {
    key: 'E Minor',
    capo: 'Capo 2 (play Dm shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Driving Midship work-song groove · D – x U – D U',
    progression: [
      'Dm                        C',
      'Bb                        A7',
      'Dm                        Gm7',
      'Bb            A7          Dm',
    ],
  },
  'dont-cross-the-line': {
    key: 'B Minor (play Am shapes)',
    capo: 'Capo 2',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Tense Midship acoustic pick + sub-bass pulse · D – D U – U D U',
    progression: [
      'Am                        Fmaj7',
      'C                         G',
      'Dm7                       Am',
      'Fmaj7         G           Am',
    ],
  },
  '99-percent': {
    key: 'D Major',
    capo: 'No capo',
    tuning: 'Standard (E A D G B E)',
    strumming: '100-BPM acoustic + warm synth pulse · D – D U – D U',
    progression: [
      'Bm7                       Gmaj7',
      'D                         A/C#',
      'Em7                       Bm7',
      'Gmaj7         A           D',
    ],
  },
  'leave-a-note': {
    key: 'D Major',
    capo: 'No capo',
    tuning: 'Standard (E A D G B E)',
    strumming: '142-BPM driving indie-pop strum · D – D U – U D U',
    progression: [
      'Verse:   D   G   Bm   A',
      'Chorus:  G   A   D    Bm',
      '         G   A   D',
      'Bridge:  G   Bm  A    D',
    ],
  },
  'redshift-reprise': {
    key: 'E Minor / G Major',
    capo: 'Capo 3 (play Em shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Slow arpeggio & nocturnal synth swell · whole-note ring',
    progression: [
      'Em7                       Cadd9',
      'G                         D/F#',
      'Em7                       Cmaj7',
      'Am7           D           Em7',
    ],
  },
  'half-life-alternate': {
    key: 'C Major',
    capo: 'Capo 4 (play G shapes)',
    tuning: 'Standard (E A D G B E)',
    strumming: 'Quiet cabin fingerpick · thumb-brush',
    progression: [
      'G                         Em7',
      'Cadd9                     D',
      'Am7                       Em7',
      'Cadd9         D           G',
    ],
  },
};

export function getPersistChordForLine(slug: string, lineIndex: number): string | null {
  const sheet = PERSIST_CHORD_SHEETS[slug];
  if (!sheet || sheet.progression.length === 0) return null;
  return sheet.progression[lineIndex % sheet.progression.length] ?? null;
}
