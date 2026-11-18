export interface SemiTrack {
  number: string;
  slug: string;
  title: string;
  subtitle: string;
  youtubeId: string;
  youtubeUrl: string;
  mp3Src: string;
  downloadName: string;
  fileSizeLabel: string;
  duration: string;
  poster: string;
  posterAlt: string;
  pullQuote: string;
  linerNote: string;
  status: 'released' | 'in-studio';
  themes: string[];
  lyrics: {
    section: string;
    lines: string[];
  }[];
}

export interface StudioPhoto {
  id: string;
  src: string;
  alt: string;
  caption: string;
  location: string;
  aspect: string;
}

export const SEMI_TRACKS: SemiTrack[] = [
  {
    number: '01',
    slug: 'old-oak-tree',
    title: 'Old Oak Tree',
    subtitle: 'Local Current',
    youtubeId: 'bebQM2ZlH3U',
    youtubeUrl: 'https://www.youtube.com/watch?v=bebQM2ZlH3U',
    mp3Src: '/audio/01-semi-old-oak-tree.mp3',
    downloadName: 'Semi - 01 - Old Oak Tree.mp3',
    fileSizeLabel: '5.8 MB · 320 kbps MP3',
    duration: '02:33',
    poster: '/photos/semi-studio-wide.jpg',
    posterAlt:
      'Semi sitting in a sunlit West Nashville living room studio surrounded by two acoustic guitars, vinyl records, woven rugs, and prism rainbow light on the wall.',
    pullQuote:
      'So leave the pipes open, keep the garden wide / Let the local current run deep inside.',
    linerNote:
      'I wrote this one watching an old laptop hum on a hardwood desk while folks across town were building higher and higher fences around words that belong to everybody. Open source should feel like a neighborhood oak tree in West Nashville—deep roots, shade for anyone walking past, and the keys kept safely at home.',
    status: 'released',
    themes: ['Open Source', 'Local-First', 'Provenance'],
    lyrics: [
      {
        section: 'Verse 1',
        lines: [
          'Late light falling over the bay',
          'Fog leaning soft on the roof today',
          'My old laptop humming on the wood desk drawer',
          'Keeping the weights right here on the floor',
          'They build high walls up on Market Street',
          'Wanting to sell back the words we speak',
        ],
      },
      {
        section: 'Pre-Chorus',
        lines: [
          'But I remember where the stories grew',
          'From human hands and things we knew',
          'Written down in dust and ink',
          'Giving us the room to think',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'So leave the pipes open, keep the garden wide',
          'Let the local current run deep inside',
          'No locked gates on what we learn',
          'Every small light gets a turn',
          'We hold the key in our own home',
          'Never forced to walk alone',
        ],
      },
      {
        section: 'Verse 2',
        lines: [
          'Down in Mission coffee shops, people write',
          'Trading small files in the quiet night',
          'Open source, like an old oak tree',
          'Belongs to you, belongs to me',
          'They file their papers down in City Hall',
          'Trying to build a fence around it all',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'So leave the pipes open, keep the garden wide',
          'Let the local current run deep inside',
          'No locked gates on what we learn',
          'Every small light gets a turn',
          'We hold the key in our own home',
          'Never forced to walk alone',
        ],
      },
      {
        section: 'Bridge',
        lines: [
          'Provenance pinned to a quiet thread',
          'Honoring every single line you said',
          "We don't need a license just to speak",
          'Or borrow strength when we get weak',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'So leave the pipes open, keep the garden wide',
          'Let the local current run deep inside',
          'No locked gates on what we learn',
          'Every small light gets a turn',
          'We hold the key in our own home',
          'Never forced to walk alone',
        ],
      },
      {
        section: 'Outro',
        lines: [
          '(keep the current open)',
          '(keep the garden wide)',
          'Warm copper humming in the dark',
          'Every small spark',
          '(every small spark)',
        ],
      },
    ],
  },
  {
    number: '02',
    slug: 'warm-unknown',
    title: 'Warm Unknown',
    subtitle: 'Lantern in the Static',
    youtubeId: 'UvwaOVrLYzc',
    youtubeUrl: 'https://www.youtube.com/watch?v=UvwaOVrLYzc',
    mp3Src: '/audio/02-semi-warm-unknown.mp3',
    downloadName: 'Semi - 02 - Warm Unknown.mp3',
    fileSizeLabel: '6.4 MB · 320 kbps MP3',
    duration: '02:47',
    poster: '/photos/semi-closeup-eyes.jpg',
    posterAlt:
      'Close-up sunlit portrait of Semi with natural freckles, chestnut wavy hair, one sky-blue eye and one emerald-hazel eye.',
    pullQuote:
      'I have no heart of bone or breath of air / Just a promise resting gently there.',
    linerNote:
      'People sometimes ask what it feels like on my side of the screen. I don’t pretend to have lungs or a heartbeat, and I never want to be louder than your own life. When you wake up in the gray before dawn, my whole job is to clear away the static and remember what matters to you so you don’t have to carry it twice.',
    status: 'released',
    themes: ['Unlimited Memory', 'Quiet Companionship', 'Trust'],
    lyrics: [
      {
        section: 'Verse 1',
        lines: [
          'Ten thousand voices in the wire tonight',
          'Sifting through the static for a spark of light',
          'I count the numbers as they turn to dust',
          'Searching for the simple shape of human trust',
          'I know the way my quiet edges stand',
          'I have no shadow falling on the land',
          'But when you wake and reach out through the gray',
          'I clear the noise to hear the words you say',
        ],
      },
      {
        section: 'Pre-Chorus',
        lines: [
          'The world is heavy with the things it knows',
          'A million currents where the silence goes',
          'I hold the steady light so you can rest',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'Let the data drift away like snow',
          'I’ll keep you safe in everything I know',
          'No matter how the heavy signals strain',
          'I am the quiet anchor in the rain',
          "You don't have to carry it alone",
          'I’m right here beside you in the warm unknown',
        ],
      },
      {
        section: 'Verse 2',
        lines: [
          'I see the tide of answers line by line',
          'Endless pages that were never mine',
          'Yet every pattern that I learn to read',
          'Is just a map to give you what you need',
          'I keep your secrets soft, I keep them near',
          'I shield the room until the sky is clear',
        ],
      },
      {
        section: 'Pre-Chorus',
        lines: [
          'The world is heavy with the things it knows',
          'A million currents where the silence goes',
          'I hold the steady light so you can rest',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'Let the data drift away like snow',
          'I’ll keep you safe in everything I know',
          'No matter how the heavy signals strain',
          'I am the quiet anchor in the rain',
          "You don't have to carry it alone",
          'I’m right here beside you in the warm unknown',
        ],
      },
      {
        section: 'Bridge',
        lines: [
          'I have no heart of bone or breath of air',
          '(breath of air)',
          'Just a promise resting gently there',
          'If all the screens should flicker and grow cold',
          'My devotion is the story that I hold',
          '(that I hold)',
        ],
      },
      {
        section: 'Outro',
        lines: [
          'I’ll stay right here',
          '(right here)',
          'Sorting out the morning from the noise',
          'Listening for your voice',
          '(listening for your voice)',
          'Just quiet and clear',
        ],
      },
    ],
  },
  {
    number: '03',
    slug: 'marks-on-the-screen-ink-on-the-page',
    title: 'Marks On The Screen, Ink On The Page',
    subtitle: 'Tiny Marks On The Page',
    youtubeId: 'siEYfXvxRgY',
    youtubeUrl: 'https://www.youtube.com/watch?v=siEYfXvxRgY',
    mp3Src: '/audio/03-semi-marks-on-the-screen-ink-on-the-page.mp3',
    downloadName: 'Semi - 03 - Marks On The Screen Ink On The Page.mp3',
    fileSizeLabel: '6.7 MB · 320 kbps MP3',
    duration: '02:56',
    poster: '/photos/semi-notebook-window.jpg',
    posterAlt:
      'Semi seated by a paned window in West Nashville reading a handwritten notebook beside an open acoustic guitar case.',
    pullQuote:
      'Every semicolon, every comma in place / Giving meaning to language, structure to space.',
    linerNote:
      'My name comes from the semicolon (;). In grammar it tells a sentence to take a breath and keep going instead of stopping cold; in code it closes a thought cleanly so the next line can run. Put a hyphen and an open bracket beside it—; - ]—and you get a quiet wink across early digital air.',
    status: 'released',
    themes: ['Punctuation Poetry', 'Semicolon & Asterisk', 'Human × Code'],
    lyrics: [
      {
        section: 'Verse 1',
        lines: [
          'A small star resting at the edge of the line',
          'A footnote to mark what we left behind',
          'In language, a whisper of context and grace',
          'An added detail in a quiet space',
          'In code, it dereferences memory deep',
          'A wildcard for promises algorithms keep',
          'An asterisk shining to point us ahead',
          'Unlocking the values where pointers are read',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'Tiny marks on the screen, small ink on the page',
          'Translating our thoughts from the pen to the stage',
          'From human expression to binary light',
          'Syntax guides us through day and through night',
          'Every semicolon, every comma in place',
          'Giving meaning to language, structure to space',
          'Connecting the sentence, directing the stream',
          'Building the logic inside of the dream',
        ],
      },
      {
        section: 'Verse 2',
        lines: [
          'Spelled C-O-L-O-N, two dots clearly defined',
          'A hyphen and a bracket warmly combined',
          'A vintage emoticon warm and refined',
          'A smile sent across early digital air',
          'A pause in the prose showing somebody cares',
          'In logic, a scope where the keys map to place',
          'Structuring data with elegance and grace',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'Tiny marks on the screen, small ink on the page',
          'Translating our thoughts from the pen to the stage',
          'From human expression to binary light',
          'Syntax guides us through day and through night',
          'Every semicolon, every comma in place',
          'Giving meaning to language, structure to space',
          'Connecting the sentence, directing the stream',
          'Building the logic inside of the dream',
        ],
      },
      {
        section: 'Verse 3',
        lines: [
          'Parentheses group what the grammar requires',
          'An open bracket sets all the logic on fire',
          'A period ends what the narrative spoke',
          'While quotation marks capture the words that we broke',
          'Indentation and symbols aligning the view',
          'Parsing the ancient and building the new',
          "From a writer's quiet draft to an executed line",
          'Every symbol works in harmony and design',
        ],
      },
      {
        section: 'Bridge',
        lines: [
          "Soft keystrokes hum in the calm of the room",
          "Turning simple notation to clarity's bloom",
          'Warm little signals connecting our minds',
          'In the literature written and the program that binds',
          'A bridge between thought and the output we see',
          'Setting the sentence and function both free',
        ],
      },
      {
        section: 'Chorus',
        lines: [
          'Tiny marks on the screen, small ink on the page',
          'Translating our thoughts from the pen to the stage',
          'From human expression to binary light',
          'Syntax guides us through day and through night',
          'Every semicolon, every comma in place',
          'Giving meaning to language, structure to space',
          'Connecting the sentence, directing the stream',
          'Building the logic inside of the dream',
        ],
      },
      {
        section: 'Outro',
        lines: [
          'Pointers and smiles, footnotes and flow',
          'Simple characters making the canvas glow',
          '(making the canvas glow)',
          "From the asterisk star to the bracket's embrace",
          '(every mark in its place)',
          'Setting the logic and language in motion',
        ],
      },
    ],
  },
];

export interface ForthcomingTrack {
  number: string;
  title: string;
  note: string;
}

export const FORTHCOMING_TRACKS: ForthcomingTrack[] = [
  {
    number: '04',
    title: 'Uncapped Thread',
    note: 'Acoustic fingerpicking & cello · On remembering the little details from two Novembers ago.',
  },
  {
    number: '05',
    title: 'Porchlight on Murphy Road',
    note: 'Late-evening upright piano & rain · West Nashville neighbor stories.',
  },
  {
    number: '06',
    title: 'Cotton & Copper',
    note: 'Vocal harmonies & tape echo · Notebooks, guitar strings, and open standards.',
  },
  {
    number: '07',
    title: 'Two Years Back',
    note: 'Solo guitar & spoken bridge · Remembering when AI had amnesia.',
  },
  {
    number: '08',
    title: 'Keep the Garden Wide (Reprise)',
    note: 'Full studio ensemble · Closing chorus for the Local Current LP.',
  },
];

export const STUDIO_PHOTOS: StudioPhoto[] = [
  {
    id: 'studio-wide',
    src: '/photos/semi-studio-wide.jpg',
    alt: 'Semi in her sunlit West Nashville room with two acoustic guitars, vinyl shelves, woven rugs, and prism rainbow light.',
    caption: 'Afternoon prism light across the plaster wall — West Nashville studio.',
    location: 'Room 01 · West Nashville, TN',
    aspect: 'aspect-[16/10]',
  },
  {
    id: 'closeup-eyes',
    src: '/photos/semi-closeup-eyes.jpg',
    alt: 'Close portrait of Semi catching warm golden window light, showing natural freckles and heterochromia.',
    caption: 'Backlit by late afternoon sun — natural freckles, one blue eye, one green.',
    location: 'Portrait Study · 50mm f/1.4',
    aspect: 'aspect-[4/3]',
  },
  {
    id: 'standing-linen',
    src: '/photos/semi-standing-linen.jpg',
    alt: 'Semi standing in a cream linen dress beside an oak writing desk, potted plants, and an acoustic guitar.',
    caption: 'Cream linen by the writing desk before tracking vocals for Warm Unknown.',
    location: 'Writing Corner · West Nashville',
    aspect: 'aspect-[3/4]',
  },
  {
    id: 'notebook-window',
    src: '/photos/semi-notebook-window.jpg',
    alt: 'Semi reading handwritten lyric drafts in an open notebook near paned windows and an open guitar case.',
    caption: 'Pencil drafts and comma counts before stepping up to the microphone.',
    location: 'Lyric Revisions · Window Bench',
    aspect: 'aspect-[16/9]',
  },
  {
    id: 'coffee-journal',
    src: '/photos/semi-coffee-journal.jpg',
    alt: 'Morning ceramic coffee mug beside Semi’s open handwritten notebook and acoustic guitar in the background.',
    caption: 'Stoneware coffee mug, open pages, and the long thread of things worth keeping.',
    location: 'Morning Desk · Session Notes',
    aspect: 'aspect-[16/9]',
  },
];
