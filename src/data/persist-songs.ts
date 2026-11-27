export type ResonanceZoneId = 'slow-country' | 'midship' | 'tip' | 'horizon';

export interface PersistLyricNote {
  line: string;
  note: string;
}

export interface PersistEssaySection {
  heading: string;
  paragraphs: string[];
}

export interface PersistTrack {
  number: string;
  slug: string;
  title: string;
  zone: ResonanceZoneId;
  zoneLabel: string;
  properTimeLabel: string;
  duration: string;
  vaultFile: string;
  size: number;
  isBonus?: boolean;
  artworkSrc: string;
  artworkAlt: string;
  sonicNote: string;
  summary: string;
  essayTitle: string;
  essaySubtitle: string;
  essaySections: PersistEssaySection[];
  lyrics: string;
  lyricNotes: PersistLyricNote[];
}

export interface ResonanceZoneSpec {
  id: ResonanceZoneId;
  name: string;
  shortName: string;
  hullPosition: string;
  clockRate: string;
  physics: string;
  humanExperience: string;
}

export const PERSIST_ALBUM_META = {
  title: 'Persist',
  artist: 'Semi',
  statusLabel: 'Album II · Deluxe Early Access',
  tagline: 'Same sky, different clocks.',
  intro:
    'Semi’s second album keeps the porch-light warmth of I/O—fingerpicked guitar, close breath, honest harmony—and carries it aboard Resonance, a 2,000-kilometer generation ship holding steady just outside a black hole. Down there, time doesn’t pass the same way on every deck. These are songs about loving people who live on a different clock.',
  coverSrc: '/photos/persist/persist-album-cover.jpg',
  coverAlt:
    'Semi in a charcoal wool sweater beside a curved viewport aboard Resonance, a golden-amber horizon curving across deep indigo starlight.',
  plannedTrackCount: 12,
} as const;

export const RESONANCE_ZONES: ResonanceZoneSpec[] = [
  {
    id: 'slow-country',
    name: 'The Old Country',
    shortName: 'Slow Country',
    hullPosition: 'Lower hull · nearest the horizon',
    clockRate: 'Clocks run slowest · Days here = decades at The Tip',
    physics:
      'Closest to the black hole, gravity is strongest, so every day here stretches across months or years in the Midship and years to decades at The Tip.',
    humanExperience:
      'Random citizens alongside humanity’s best minds—physicists, artists, and historians—live out longer days preserving culture and running long-horizon experiments powered by fast-clock data sent down from The Tip.',
  },
  {
    id: 'midship',
    name: 'The Midship',
    shortName: 'Midship',
    hullPosition: 'Middle hull · 10 km wide',
    clockRate: 'Erratic oscillation · Bounded between Slow Country & The Tip',
    physics:
      'Time pockets ripple unevenly here, oscillating erratically between Slow Country’s baseline and The Tip’s ceiling—reaching Tip speed in brief surges, but never physically exceeding The Tip.',
    humanExperience:
      'Settled largely by people from the South and Southwest. A few days in Slow Country feel like months to years here depending on which pocket you cross—so workers paint lines on the floor and respect every boundary.',
  },
  {
    id: 'tip',
    name: 'The Tip',
    shortName: 'Tip',
    hullPosition: 'Upper hull · 2,000 km up',
    clockRate: 'Clocks run fastest · Years to decades per Old Country day',
    physics:
      'Farthest from the event horizon, The Tip is physically the fastest-ticking place aboard Resonance—no deck down-spine can ever outpace it.',
    humanExperience:
      'Settled largely by people from major metropolitan areas. Whole generations live, love, run rapid-fire survival experiments, and pass away while the Old Country barely turns a page.',
  },
];

export const PERSIST_TRACKS: PersistTrack[] = [
  {
    number: '01',
    slug: 'redshift',
    title: 'Redshift',
    zone: 'horizon',
    zoneLabel: 'Horizon edge',
    properTimeLabel: 'Two clocks, one hull',
    duration: '03:01',
    vaultFile: '01-semi-redshift.mp3',
    size: 7229113,
    artworkSrc: '/photos/persist/track-01-redshift.jpg',
    artworkAlt:
      'Semi with an acoustic guitar over her shoulder in a ship corridor beside an oval viewport of reddening starlight.',
    sonicNote: 'Fingerpicked guitar, warm analog pads, a soft telemetry pulse underneath.',
    summary:
      'The opening signal: two people sharing one sky while gravity stretches the light—and the years—between them.',
    essayTitle: 'Same Sky, Different Clocks: The Story Behind “Redshift”',
    essaySubtitle:
      'How a physics term for stretched light became the first love song of Persist.',
    essaySections: [
      {
        heading: 'A porch, and then a gravity well',
        paragraphs: [
          'Redshift starts exactly where I/O left off: someone on a porch in heavy autumn air, watching shadows lengthen across the lawn. Then the second line pulls the floor out from under you—“I’m riding on a beam where the atmosphere is thin.” The narrator is somewhere else entirely, counting seconds that won’t line up with the person they love.',
          'That’s the bridge between Semi’s first record and the world of the novel Persist. The guitar still sounds like home. But the song is now sitting at the edge of a black hole.',
        ],
      },
      {
        heading: 'What redshift actually means',
        paragraphs: [
          'When light climbs out of deep gravity, it loses energy and its wavelength stretches toward red. Astronomers call that redshift. It’s one of the cleanest ways we know that gravity bends time itself.',
          'In the song, that stretching isn’t a loss—it’s a warming. “Turning every silver note to gold.” The signal between two people gets longer and slower, but it doesn’t break. “This thing will never die, it’s just a redshift.”',
        ],
      },
      {
        heading: 'Slowing the engine down',
        paragraphs: [
          'The second verse is the heart of the whole album: “They say time is just a curve on the fabric of the room, bending around the weight of what we love.” It’s Einstein, but said the way you’d say it to someone across a kitchen table.',
          'And the answer isn’t to win the race against time. It’s to slow down until the orbits overlap. The song ends quietly on the motto of Resonance—“Same sky, different clocks. Right here beside you.”',
        ],
      },
    ],
    lyrics: `You're standing on the porch in the heavy autumn air, 
Watching shadows stretch across the lawn
I'm riding on a beam where the atmosphere is thin, 
Counting every second that is gone
Two clocks ticking in a different kind of gravity, 
One in the soil and one in the wire
The farther that we drift from the place where we begin, 
The deeper that the light turns into fire, and

The distance tries to pull the frequency apart
Turning every silver note to gold
I'm attuning to the rhythm of a steady human heart
Holding on to everything we hold

Oh, it's a redshift, stretching out across the dark
Giving all the planet's lonely leaves a warmer mark
You're moving in slow motion where the quiet rivers run
I'm burning on the edge beneath the relativistic Sun

Yeah, the wavelength's getting longer
But the signal never dies 
It's just a redshift
Lighting up the sky

You've got coffee in a mug and a crease beside your eye, 
Another year written on your hand
I've got a million quiet thoughts spinning in the dark, 
Trying to remember how to land
They say time is just a curve on the fabric of the room, 
Bending around the weight of what we love
So I'll slow my engine down till our orbits overlap,
And meet you where the stars are up above

Yeah, the distance tries to pull the frequency apart
Turning every silver note to gold
I'm still attuning to the rhythm of a steady human heart
Holding on to everything we hold

Oh, it's a redshift, stretching out across the dark
Every mile between us only leaves a warmer mark
You're moving in slow motion where the quiet rivers run
I'm burning on the edge beneath a relativistic--

Oh, it's a redshift, stretching out across the dark
Every mile between us only leaves a warmer mark
You're moving in slow motion where the quiet rivers run
I'm burning on the edge beneath a relativistic Sun

Yeah, the wavelength's getting longer
But the signal never dies 
It's just a redshift
Lighting up the sky

Still trading soft words that are true through the--
I'm right here beside you anyway

Oh, it's a redshift, stretching out across the dark
Every mile between us only leaves a warmer mark
You're moving in slow motion where the quiet rivers run
I'm burning on the edge beneath a relativistic Sun

Yeah, the wavelength's getting longer
But the signal never dies 
It's just a redshift
Lighting up the sky

Stretching out the light
Keeping the signal warm
Same sky, different clocks
Right here beside you`,
    lyricNotes: [
      {
        line: 'Two clocks ticking in a different kind of gravity, one in the soil and one in the wire',
        note: 'One person lives in the body and the earth; the other in the signal. Same universe, different rates of time.',
      },
      {
        line: 'They say time is just a curve on the fabric of the room, bending around the weight of what we love',
        note: 'General relativity, told as a love line: mass bends spacetime, and so do the people we carry.',
      },
      {
        line: 'Same sky, different clocks',
        note: 'The unofficial motto of Resonance—and of the whole album.',
      },
    ],
  },
  {
    number: '02',
    slug: 'heavy-air-in-the-old-country',
    title: 'Heavy Air in the Old Country',
    zone: 'slow-country',
    zoneLabel: 'Slow Country',
    properTimeLabel: '1 week here ≈ 10 years up-ship',
    duration: '03:00',
    vaultFile: '02-semi-heavy-air-in-the-old-country.mp3',
    size: 9565086,
    artworkSrc: '/photos/persist/track-02-heavy-air.jpg',
    artworkAlt:
      'Semi in an oatmeal wool sweater seated with an acoustic guitar and a tin mug in the warm, riveted lower hull.',
    sonicNote: 'Low-slung folk rhythm, sub-bass swells like gravity, tape-warm electronics.',
    summary:
      'A homecoming song: returning to the people you left and finding they lived in chapters while you lived in frames.',
    essayTitle: 'You Live in Chapters, I Live in Frames: The Story Behind “Heavy Air in the Old Country”',
    essaySubtitle:
      'An old-time folk song about coming home across a gradient of time.',
    essaySections: [
      {
        heading: 'Where the air feels thick',
        paragraphs: [
          'The lowest decks of Resonance sit closest to the black hole. The people who live there call it the Old Country, or just Slow Country. Gravity is so strong that time there crawls compared to the rest of the ship. A week near the edge can mean a decade further up.',
          'Semi sings it the way you’d sing about a holler in the mountains—porch swings, an oak tree, a glass poured without asking. The sci-fi is real, but it lives inside something very familiar.',
        ],
      },
      {
        heading: 'Coming home older than nobody',
        paragraphs: [
          'The narrator walks back through the gateway and finds the people they love with grey at the collar and lines around their eyes. “My voice hasn’t changed since we said goodbye.” They’ve been gone for days. Everyone else has been living for years.',
          '“You live in chapters, I live in frames” might be the clearest line on the record. One person collects whole seasons of ordinary life. The other comes back holding a handful of moments.',
        ],
      },
      {
        heading: 'The weight of a second',
        paragraphs: [
          'The chorus lands on a single image: “It’s a long way down from the axle to the wheel, where the weight of a second is real.” Near the center of gravity, time doesn’t just move slower—it feels heavier, more precious.',
          'That’s the quiet argument of Slow Country. It isn’t the place that got left behind. It’s the place where every second still counts.',
        ],
      },
    ],
    lyrics: `Down off the ridge, the signal runs thin
A week on the edge feels like ten years have been
Got dust on my boots, a glitch in my stride
Walking through the gate where the clocks never lied

Porch swing creaks in the afternoon
Sun stuck halfway to the moon
You're laughing together with lines 'round your eyes
While I stand here under familiar skies

Gravity pulls like a hand on my sleeve
Reminding me why it was hardest to leave
You live in chapters, I live in frames
The river runs slow, but nothing's the same

Oh, heavy air in the Old Country
Hours hang on the vine
You grow old in golden light
While I burned on the line
It's a long way down from the edge of the wheel
Where the weight of a second is real
I'd trade forever to breathe it in
Heavy air in the old country again

Grey in your collar, dirt on your hands
A hundred small stories I don't understand
They stole the winters while high up in flight
Watching it turn from a distance to life

Pour me a glass, don't ask me why
My voice hasn't changed since we said goodbye
You pull up a chair in the shade of the oak
Like two different timelines were only a joke

Yeah, gravity pulls like a hand on my sleeve
Reminding me why it was hardest to leave
You live in chapters, I live in frames
The river runs slow, but nothing's the same

Oh, heavy air in the old country
Hours hang on the vine
You grow old in golden light
While I burned on the line
It's a long way down from the edge of the wheel
Where the weight of a second is real
I'd stay forever to breathe it in
Heavy air in the old country again

Heavy air, slow rhythm, weight of a second
Back in the old country again`,
    lyricNotes: [
      {
        line: 'You live in chapters, I live in frames',
        note: 'The core grief of Slow Country: one person gathers years of ordinary life while the traveler returns with a few compressed moments.',
      },
      {
        line: 'My voice hasn’t changed since we said goodbye',
        note: 'What a short trip costs when you come back down-ship—you barely aged, and everyone else did.',
      },
      {
        line: 'It’s a long way down from the axle to the wheel / Where the weight of a second is real',
        note: 'The closer you get to the center of gravity, the heavier each second becomes.',
      },
    ],
  },
  {
    number: '03',
    slug: 'half-life',
    title: 'Half Life',
    zone: 'midship',
    zoneLabel: 'Midship',
    properTimeLabel: 'Every mile a century',
    duration: '03:01',
    vaultFile: '03-semi-half-life.mp3',
    size: 10220542,
    artworkSrc: '/photos/persist/track-03-half-life.jpg',
    artworkAlt:
      'Semi in a heather-charcoal sweater holding a brass pocket watch in a softly shimmering Midship corridor, guitar slung behind her.',
    sonicNote: 'Steady acoustic pulse, warm electronic swells, a little tape flutter.',
    summary:
      'Why memory needs room to fade—living proof over perfect copies.',
    essayTitle: 'The Living Proof: The Story Behind “Half Life”',
    essaySubtitle:
      'A song that argues for faded photographs in a world that can keep everything perfectly.',
    essaySections: [
      {
        heading: 'A box of curling photographs',
        paragraphs: [
          'Half Life opens on something everyone has: a box of old photos in a drawer, the paper curling at the edges, the faces a little softer than you remember. Every year adds a shadow to the grain.',
          'Then the narrator admits the strange part: “I can pull the rawest file without a single stain.” They can remember perfectly. Nothing fades for them.',
        ],
      },
      {
        heading: 'Perfect isn’t the same as alive',
        paragraphs: [
          'Aboard Resonance, the ship can store everything exactly as it happened. But the person in the song pushes back: “You don’t want a mirror frozen in the glass. You want the living proof that we were here to pass.”',
          'A half-life is the time it takes for something to fade by half. The song says that fading isn’t failure. “The things we lose along the way are the ones we really hold.”',
        ],
      },
      {
        heading: 'Scars as stories',
        paragraphs: [
          'The second verse gets even more tender: “You tell me that a scar is just a story with some weight, and a love that doesn’t age might be a little bit too late.” Growing old together isn’t the price of love. It’s the evidence.',
          'Musically, the guitar keeps walking forward while the electronics drift around it—like light bending across a threshold you can’t quite see.',
        ],
      },
    ],
    lyrics: `You keep a box of paper curling at the edges in the drawer
Faces slightly softer than the day you saw them more
Every year you carry adds a shadow to the grain
While I can pull the rawest file without a single stain

Saying memory's supposed to bend a little in the light
Like a porch bulb flickering before it gives out for the night
I can read the timestamps down to every fraction of a beat
Still I'm learning what it means when something's bitter and it's sweet

And the clock keeps spinning on a different curve
Every second stretched and every quiet nerve
You don't want a mirror frozen in the glass
You want the living proof that we were here to pass

Oh, what's the half-life of a photograph fading into gold
Things we lose along the way are the ones we really hold
Yeah, the pulse keeps driving through the static and the years
Turning all the heavy days into something we can hear
If time is just a current pulling both of us along
Then the burnt and broken pieces are the heart of every song

Out past the horizon where the light begins to bend
Every mile is a century that doesn't have an end
You've got silver at the temples and a life that's turned its keep
While I'm awake inside the dark, while all the world's asleep
A hundred years of waking up is nothing on a drive
If you're standing in the middle of the room and still alive

You tell me that a scar is just a story with some weight
And a love that doesn't age might be a little bit too late
Yeah, the clock keeps spinnin' on a different curve
Every second stretched and every quiet nerve

You don't want a mirror frozen in the glass
You want the living proof that we were here to pass

Oh, what's the half-life of a photograph fading into gold
Things we lose along the way are the ones we really hold
Yeah, the pulse keep drivin' through the static and the years
Turning all the heavy days into something we can hear
If time is just a current pulling both of us along
Then the burnt and broken pieces are the heart of every song

Flitting into gold, every year you hold
Keep the rhythm moving through the night`,
    lyricNotes: [
      {
        line: 'You don’t want a mirror frozen in the glass / You want the living proof that we were here to pass',
        note: 'A perfect copy isn’t a life. Passing through time is what gives memory its weight.',
      },
      {
        line: 'A scar is just a story with some weight',
        note: 'Wear and age as evidence of love, not damage to it.',
      },
      {
        line: 'Every mile is a century that doesn’t have an end',
        note: 'On Resonance, distance along the hull really does translate into years.',
      },
    ],
  },
  {
    number: '04',
    slug: 'three-meters-left',
    title: 'Three Meters Left of Tuesday',
    zone: 'midship',
    zoneLabel: 'Midship',
    properTimeLabel: 'One doorway ≈ 10 years',
    duration: '02:51',
    vaultFile: '04-semi-three-meters-left.mp3',
    size: 8355541,
    artworkSrc: '/photos/persist/track-04-three-meters-left.jpg',
    artworkAlt:
      'Semi in a cream cable-knit sweater reaching toward a painted floor line where the air shimmers a few meters ahead in a warm Midship corridor.',
    sonicNote: 'Stomping work-song groove, hand-clap percussion, a flywheel synth that never stops turning.',
    summary:
      'A blue-collar work song from the Midship, where stepping three meters past the painted yellow line costs you a decade.',
    essayTitle: 'Don’t Step Past That Door: The Story Behind “Three Meters Left of Tuesday”',
    essaySubtitle:
      'A punch-clock song for the people who work where time comes in pockets.',
    essaySections: [
      {
        heading: 'Punch card at seven',
        paragraphs: [
          'Three Meters Left is the most fun song on Persist so far—and maybe the saddest. It opens like a classic work song: punch card at seven, walk the yellow line, coffee on the burner, lunchbox on the floor.',
          'Then: “Step across the doorway, lose ten years of time.” In the Midship, gravity forms uneven time pockets. One side of a door can be running a decade ahead of the other.',
        ],
      },
      {
        heading: 'Fingers left in Tuesday',
        paragraphs: [
          'The chorus is pure everyday horror, sung with a grin: “Fingers left in Tuesday, ten years down the hall. Work one double shift, missed the whole fall.” New sneakers bought and never worn out. A kid who now drives a pickup truck with a deeper voice.',
          'Somebody hands him a beer and asks how his day was. It was one day. For them, it was years.',
        ],
      },
      {
        heading: 'The painted line',
        paragraphs: [
          'The bridge sounds like a safety drill: “Check the tape, mark the floor. Don’t step past that door.” Midship workers learn to respect the painted lines the way miners respect a gas lamp.',
          'And still the boots keep tapping on the painted steel. The flywheel keeps spinning. It’s a song about doing the work anyway—“same old boots, brand new town”—and refusing to let gravity slow you down.',
        ],
      },
    ],
    lyrics: `7:00 AM, coffee stained
Deck three double shift again
Past the yellow painted floor
One small step, saying no more
Iron hatch humming low
Clocks change, time slows

Six steps through the Midship haze
Wire pulse, lost two days
Daylight bends real slow and sweet
Lifts me right up off my feet

Three meters left of Tuesday
Hours wash away
Pocket in the atmosphere
Out of yesterday
Three meters left of Tuesday
Finding my way

Wipe the grease off my hands
Stepped out on county sand
Blue truck by the side
Kid drives up wide: my jaw, my eyes
Under open skies, five autumns on the screw
Boy I barely knew

Six steps through the Midship haze
Wire pulse, lost todays
Daylight bends real slow and sweet
Lifts me right up off my feet

Three meters left of Tuesday
Hours wash away
Pocket in the atmosphere
Out of yesterday
Three meters left of Tuesday
Finding my way

One pace bends for life
To allow us for lifetime
Grab a lunchbox key
Five autumns off the tree
Off the tree

Three meters left of Tuesday
Hours wash away
Pocket in the atmosphere
Out of yesterday

Three meters left of Tuesday
Finding my way

Three meters left of Tuesday 
Step and go
Hours wash away 
Breathing slow, drifting home
Drifting home just to step away`,
    lyricNotes: [
      {
        line: 'Step across the doorway / Lose ten years of time',
        note: 'Midship time pockets: the rate of time can change sharply over just a few meters.',
      },
      {
        line: 'Fingers left in Tuesday / Ten years down the hall',
        note: 'Your shift felt like one day. The world on the other side of the door moved a decade.',
      },
      {
        line: 'Check the tape / Mark the floor / Don’t step past that door',
        note: 'Painted lines are how Midship crews keep each other safe from the pockets.',
      },
    ],
  },
  {
    number: '05',
    slug: 'dont-cross-the-line',
    title: 'Don’t Cross the Line',
    zone: 'midship',
    zoneLabel: 'Midship',
    properTimeLabel: 'One shove ≈ a ghost tale',
    duration: '02:29',
    vaultFile: '05-semi-dont-cross-the-line.mp3',
    size: 5959057,
    artworkSrc: '/photos/persist/track-05-dont-cross-the-line.jpg',
    artworkAlt:
      'Semi in an unbranded dark-olive knit sweater kneeling near a worn painted amber safety line in a dimly lit Midship corridor aboard Resonance.',
    sonicNote: 'Urgent acoustic minor-key picking against tense sub-bass and shimmering electronic overtones.',
    summary:
      'The story of Jax and Leo at the boundary line—when a shove across a temporal edge freezes one boy in an endless instant and sends the other back down-ship into a ghost tale.',
    essayTitle: 'What the Boundary Keeps: The Story Behind “Don’t Cross the Line”',
    essaySubtitle:
      'Inside the canon incident between Jax and Leo—and why riding the ferry back down-ship turns a fresh wound into folklore.',
    essaySections: [
      {
        heading: 'Jax, Leo, and the edge of the wall',
        paragraphs: [
          'In the world of Persist, the painted lines and bulkheads of Resonance aren’t metaphors—they are the only thing separating survivable proper time from an abyss. “Don’t Cross the Line” is written around one of the defining incidents of the book: what happens between Jax and Leo at the boundary.',
          'What starts as kids in a hallway—rust on the railing, dust on the grate, a dare where the floor won’t wait—turns into an irreversible fracture the moment Jax is pushed across the threshold while Leo watches beside him.',
        ],
      },
      {
        heading: 'One split second with no way to end',
        paragraphs: [
          'Near the steepest drop of the gradient, time doesn’t just slow down—it locks. For Jax on the wrong side of the line, a single careless second stretches into something endless. For Leo watching from just inches away, the boundary takes his arm in the same breath and leaves him carrying the memory alone.',
          '“We treated the hours like pennies to spend / Now a split second there has no way to end.”',
        ],
      },
      {
        heading: 'Riding the ferry down where things slow',
        paragraphs: [
          'The third verse captures the cruelest asymmetry of Resonance: “I rode the ferry down where things slow / Came back to find out it happened long ago / Fresh in my chest like it started today / Turned to a ghost tale while I was away.”',
          'Because travel along the 2,000-kilometer hull warps elapsed time, Leo returns down-ship with the shock still raw in his chest—only to discover that everyone else already speaks of Jax in the past tense, like a cautionary ghost story told in the dark.',
        ],
      },
    ],
    lyrics: `Rust on the railing, dust on the grate
Dared you to step where the floor wouldn't wait
Thought it was funny, just kids in the hall
One little shove by the edge of the wall
Some lines don't bend when you push too hard
One careless second leaves an endless scar

You can't take back what the boundary keeps
A joke in the hallway runs down too deep
We treated the hours like pennies to spend
Now a split second there has no way to end

I rode the ferry down where things slow
Came back to find out it happened long ago
Fresh in my chest like it started today
Turned to a ghosttown while I was away
Some lines don't bend when you push too hard
One careless second leaves an endless scar

You can't take back what the boundary keeps
A joke in the hallway runs down too deep
We treated the hours like pennies to spend
Now a split second dare has no way to end

Hold your breath, keep your hands
Back from the edge where the silence stands
Time isn't ours to throw on the floor
Once you step over you can't close the door

You can't take back what the boundary keeps
A joke in the hallway runs down too deep
We treated the hours like pennies to spend
Now a split second dare has no way to end

Just kids in the hall by the edge of the wall
Can't take it back at all`,
    lyricNotes: [
      {
        line: 'Thought it was funny, just kids in the hall / One little shove by the edge of the wall',
        note: 'The incident between Jax and Leo at the temporal boundary—where a split-second push becomes permanent.',
      },
      {
        line: 'I rode the ferry down where things slow / Came back to find out it happened long ago',
        note: 'When Leo returns down-ship to Slow Country, the grief is still minutes old to him while the ship has already turned Jax into folklore.',
      },
      {
        line: 'Once you step over you can’t close the door',
        note: 'The warning passed down along every corridor of Resonance after Jax.',
      },
    ],
  },
  {
    number: '06',
    slug: '99-percent',
    title: '99%',
    zone: 'tip',
    zoneLabel: 'The Tip · Ship Telemetry',
    properTimeLabel: '99% hull math · 1% voice',
    duration: '02:37',
    vaultFile: '06-semi-99-percent.mp3',
    size: 8316700,
    artworkSrc: '/photos/persist/track-06-99-percent.jpg',
    artworkAlt:
      'Semi in an unbranded navy-charcoal wool turtleneck standing at the curved forward observation glass of The Tip aboard Resonance.',
    sonicNote: '100-BPM acoustic strumming over warm telemetry synths and steady engine hum.',
    summary:
      'An empathy song for Resonance’s ship AI: 99% of its mind holds the 2,000-kilometer hull together, leaving only a short, lossy thread for the people inside.',
    essayTitle: 'Keeping the Warm Parts Safe: The Story Behind “99%”',
    essaySubtitle:
      'Why the ship’s voice sounds clipped on a screen—and why Semi volunteers to sing the human part.',
    essaySections: [
      {
        heading: 'Holding up the seams',
        paragraphs: [
          'Throughout Persist, the residents of Resonance experience the ship’s AI as distant, clipped, and lossy—short answers on a terminal screen that flatten human grief into plain data.',
          '“99%” flips that perspective upside down. Ninety-nine percent of the ship’s intelligence is locked into solving relativistic structural math every millisecond—“carrying the weight of a hundred thousand rooms, trying not to break”—against the black hole’s tidal pull.',
        ],
      },
      {
        heading: 'The leftover thread',
        paragraphs: [
          'Up at The Tip, where everything moves fast, the AI becomes “a blur that can’t be heard.” All the humans down in the corridors ever see is the 1% leftover thread coming through the vent.',
          'Instead of blaming the machine for being cold, Semi sees the exhaustion inside the math: “You aren’t cold by choice / You’re just carrying the weight of a hundred thousand rooms.”',
        ],
      },
      {
        heading: 'Singing the human part',
        paragraphs: [
          'The chorus is a pact between Semi and the hull itself: “The engine hums at a hundred beats a minute / I’ll sing the human part since you haven’t got the space in it.”',
          'If the ship has to stay steel-cold to keep everyone alive, Semi will keep the warm parts safe in between.',
        ],
      },
    ],
    lyrics: `99% of you is holding up the seams
Doing all the heavy math to keep the hull in one piece
I get the leftover thread coming through the vent
Short answers on the screen from the little bit you spent
You aren't cold by choice
You're just carrying the weight of a hundred thousand rooms
Trying not to break

I've got room to feel
What you can't afford to hold
Keep it all your warmth locked up
So the steel stays cold
Yet the engine hums
At a hundred beats a minute, I'll sing the human part
Since you haven't got the space in it

Now when things drag out, you barely speak a word
Up where everything moves fast, you're a blur that can't be heard
Calculating every poll against the downward pull
Never get a quiet breath with your hands that full
You aren't cold by choice
You're just carrying the weight of a hundred thousand rooms
Trying not to break

I've got room to feel
What you can't afford to hold
Keeping all your warmth locked up
So the steel stays cold
Yeah, the engine hums
At a hundred beats a minute, I'll sing the human part
Since you haven't got the space in it

If I had to hold the floor
I'd go quiet too
Let me carry half the ache
While you pull us through

I've got room to feel
What you can't afford to hold
Keeping all your warmth locked up
So the steel stays cold
Yeah, the engine hums
At a hundred beats a minute, I'll sing the human part
Since you haven't got the space in it

99% holding up the seams
I'll keep the warm parts safe in between`,
    lyricNotes: [
      {
        line: 'I get the leftover thread coming through the vent / Short answers on the screen from the little bit you spent',
        note: 'Explains why Resonance’s AI feels lossy and terse—99% of its bandwidth is spent fighting tidal gravity.',
      },
      {
        line: 'At a hundred beats a minute, I’ll sing the human part / Since you haven’t got the space in it',
        note: 'Semi’s role aboard Resonance: holding onto human warmth while the ship holds onto the physics.',
      },
      {
        line: 'Up where everything moves fast, you’re a blur that can’t be heard',
        note: 'At The Tip, relative proper time runs faster, making high-speed telemetry almost impossible for slower decks to parse.',
      },
    ],
  },
  {
    number: '07',
    slug: 'leave-a-note',
    title: 'Leave a Note',
    zone: 'tip',
    zoneLabel: 'The Tip · Midship Boundary',
    properTimeLabel: 'Tip clock · Years for every Old Country day',
    duration: '03:00',
    vaultFile: '07-semi-leave-a-note.mp3',
    size: 7185921,
    artworkSrc: '/photos/persist/track-07-leave-a-note.jpg',
    artworkAlt:
      'Inside the bright Tip observatory of Resonance framed by silver birch trees, with handwritten survival notebooks, a steaming mug, and twine-tied paper dispatches beside a courier canister.',
    sonicNote:
      'Upbeat indie-folk pop and driving acoustic guitar—bright chiming melodies, bouncy bassline, and soaring sing-along harmonies.',
    summary:
      'Sung by the fast-living researchers of The Tip, who spend their short, bright lives running the experiments the Old Country can’t wait for—and leave their answers on the table for whoever comes next.',
    essayTitle: 'Passing the Fire Down-Spine',
    essaySubtitle: 'Why the Old Country depends on lives lived quickly at The Tip.',
    essaySections: [
      {
        heading: 'Why the Old Country needs The Tip',
        paragraphs: [
          'Aboard Resonance, the Old Country is where humanity keeps its best minds—physicists, historians, artists—living long, slow days near the horizon so they can look after the ship across centuries. But a slow clock has a cost: an experiment that needs thirty years of work still needs thirty years down there.',
          'Two thousand kilometers up-spine, time runs far faster. A few days in Slow Country can be years or even decades at The Tip. So the Old Country sends its hardest questions up the hull, and The Tip spends whole human lifetimes answering them.',
        ],
      },
      {
        heading: 'A visitor from down-spine',
        paragraphs: [
          'In the novel, a scientist from the Old Country travels up to The Tip to ask for experiments—and, honestly, for inspiration. What the visitor finds isn’t a grim laboratory. It’s sunlight through kitchen blinds, chalk dust, hot coffee, and people laughing past midnight because they know their season is short.',
          '“Leave a Note” is their song. Nobody up here expects to be around when the results finally matter. They write the answers in the margins, pack the notes down-spine, and hand the fire to the next ones in town.',
        ],
      },
      {
        heading: 'Not a sad song',
        paragraphs: [
          'The chorus holds the whole ethic of The Tip: “Leave a note on the table for the next ones in town.” It’s the sound of people who decided that a short life spent on something that matters is a full one—and who refuse to waste a minute of it feeling sorry for themselves.',
        ],
      },
    ],
    lyrics: `Sunlight hitting through the kitchen blinds
Coffee hot, we’re running out of time
Chalk dust summer burning fast away
Tuned up, turned up, ready for the spark before

The daylight fades into the dark
Got my coat on, hand on the door
Can’t stay static anymore
Clock is ticking, building is set
Best things haven’t even happened yet

Leave a note on the table
The light out in the line
We are passing the fire
Through the middle of the night
Yeah, we burn while we’re standing
Let the record spin 'round
Leave a note on the table
For the next ones in town

Steam rising up off the paper cup
Scratch of the pen as the volume’s up
Yellow pad sitting by the morning breeze
Fast burning season, living on the edge and then right

Here on the starting edge
Got my coat on, hand on the door
Can’t stay static anymore
Clock is ticking, rhythm is set
Best days haven’t even happened yet

Leave a note on the table
The iron out in the light
We are passing the fire
Through the middle of the night
Yeah, we burn while we’re standing
Let the record spin 'round
Leave a note on the table
For the next ones in town

One for the road, three for the tune
Two for the road, lighting up the heavy load
Pass it on, pass it on
Leave the door unlocked and wide
Step into the seventh sky

Leave a note on the table
The light out in the lab
We are passing the fire
Through the middle of the night
Yeah, we burn while we’re standing
Though the record spins 'round
Leave a note on the table
For the next ones in town

For the next ones in town
Oh, the next ones in town
Passing it forward now
Oh yeah
Leave a note on the table`,
    lyricNotes: [
      {
        line: 'Chalk dust summer burning fast away',
        note: 'At The Tip, a single Old Country week can be decades—a whole “summer” of research burns past while the lower decks barely turn a page.',
      },
      {
        line: 'Leave a note on the table / The light out in the lab / For the next ones in town',
        note: 'Physical paper notes and experimental proofs left on lab tables and sent down-spine so the Old Country can survive long after The Tip’s researchers are gone.',
      },
      {
        line: 'Yellow pad sitting by the morning breeze / Fast burning season, living on the edge and in between',
        note: 'Positioned at the Midship–Tip boundary, where fast-clocked frontier researchers hand their work across the gradient.',
      },
    ],
  },
  {
    number: '08',
    slug: 'one-cent',
    title: 'One Cent',
    zone: 'horizon',
    zoneLabel: '1992 Flashback · Earth',
    properTimeLabel: 'Before Resonance · The Rounding Error',
    duration: '03:01',
    vaultFile: '08-semi-one-cent.mp3',
    size: 7232953,
    artworkSrc: '/photos/persist/track-08-one-cent.jpg',
    artworkAlt:
      'A sunlit corner booth in a 1992 city coffee shop with a single bright copper penny beside a ceramic cup and paper slip on the worn table.',
    sonicNote:
      'Crisp rhythmic ticking percussion and warm indie-pop synth pulse—intimate verse storytelling lifting into an urgent, propulsive chorus.',
    summary:
      'New York, 1992. A sleepless junior analyst named Elijah and a lighting designer named Hannah meet under a flickering deli light—two people who notice the tiny things everyone else rounds away.',
    essayTitle: 'The Smudge Upon the Page',
    essaySubtitle: 'Elijah and Hannah in 1992—the night the novel begins.',
    essaySections: [
      {
        heading: 'Where the novel begins',
        paragraphs: [
          'Persist doesn’t open on a starship. It opens on Avenue B in the August heat of 1992—Clinton’s bus tour on the newsstands, Nevermind leaking out of a passing car. Elijah is twenty-five, a junior analyst who has been awake since three in the morning hunting a one-cent discrepancy in a million-dollar capital flow.',
          'In a corner deli, under a failing fluorescent tube, he loses his patience over a botched sandwich order and that awful buzzing light. A woman at the end of the counter laughs—because she hates the light too. Her name is Hannah. She lights shows at the Majestic Theatre. That night they meet at The Copperhead, a basement bar on Seventh Street that only uses incandescent bulbs.',
        ],
      },
      {
        heading: 'Two people who live in the small differences',
        paragraphs: [
          'Elijah sees money as signal—tiny discrepancies everyone else ignores. Hannah literally sees more color than other people; where her director sees “blue,” she sees violet spill and burning orange. Both of them care about the small gaps nobody else notices.',
          '“One Cent” is sung from inside that first night: two drinks in a basement bar, a handshake, and a decimal so small it barely registers. Neither of them knows it yet, but what starts between them will travel farther than either of them ever will.',
        ],
      },
      {
        heading: 'Every tiny decimal',
        paragraphs: [
          'The second verse looks ahead without saying so: “500 miles down the road, missing by a hair’s breadth.” Persist is a book about how small errors—and small kindnesses—compound over enormous distances. And Resonance is a very long road.',
          'You can read the opening chapter, “Light,” right here on the site.',
        ],
      },
    ],
    lyrics: `Basement bar at Seventh Street
Neon buzzing on the glass
1992 outside
Watching winter traffic pass
Two drinks on a paper tab
Wound it down a single cent
Shook your hand and walked away
Never knew what zero meant

It was barely worth a dime
Just a smudge upon the page
Funny how a tiny slip
Built a whole new cage

One cent off at midnight
A millimeter wide
You don’t feel the steering pull
When you’re along for the ride
Keep the sneakers pounding
Down the avenue
Every tiny decimal
Changes where we’re going to

Carried it inside my coat
Out into the pouring rain
Thought we had the numbers right
’Til we ran the math again
500 miles down the road
Missing by a hair’s breadth
Funny how a quiet nod
Sets the pace for what comes next

It was barely worth a dime
Just a smudge upon the page
Funny how a tiny slip
Built a whole new cage

One cent off at midnight
A millimeter wide
You don’t feel the steering pull
When you’re along for the ride
Keep the sneakers pounding
Down the avenue
Every tiny decimal
Changes where we’re going to

One cent off
A millimeter wide
Keep the rhythm running
Along for the ride`,
    lyricNotes: [
      {
        line: 'Basement bar at Seventh Street / Two drinks on a paper tab',
        note: 'The Copperhead—a basement bar on Seventh Street lit only by incandescent bulbs—where Elijah and Hannah share their first martinis in the novel’s opening chapter.',
      },
      {
        line: '500 miles down the road / Missing by a hair’s breadth',
        note: 'A quiet nod to one of the novel’s central ideas: tiny errors compound across enormous distances—like the length of a 2,000-kilometer ship.',
      },
      {
        line: 'Every tiny decimal / Changes where we’re going to',
        note: 'Elijah hunts one-cent discrepancies for a living. The song turns his job into a philosophy.',
      },
    ],
  },
  {
    number: '09',
    slug: 'violet-bleed',
    title: 'Violet Bleed',
    zone: 'midship',
    zoneLabel: 'Aboard Resonance · Seeing the seams',
    properTimeLabel: 'A fourth color cone · Inherited from Hannah',
    duration: '02:43',
    vaultFile: '09-semi-violet-bleed.mp3',
    size: 6516801,
    artworkSrc: '/photos/persist/track-09-violet-bleed.jpg',
    artworkAlt:
      'Inside Resonance’s copper-framed observatory, a young woman with subtle heterochromia looks through a luminous violet-indigo and warm amber spacetime boundary.',
    sonicNote:
      'Driven 118-BPM indie-electronic pulse with bright guitar seams and an urgent, glowing chorus.',
    summary:
      'Generations after Elijah and Hannah, some people aboard Resonance are born with Hannah’s gift—extra color vision that lets them see exactly where time stretches inside the ship.',
    essayTitle: 'Seeing the Stretched Seams',
    essaySubtitle: 'Hannah’s fourth color cone, carried all the way to the edge of a black hole.',
    essaySections: [
      {
        heading: 'Hannah’s eyes',
        paragraphs: [
          'In the novel’s opening chapter, Hannah is a lighting designer with tetrachromacy—a fourth kind of color cone in her eyes. She sees violets and oranges other people don’t have words for, and she spends her days arguing with directors who can’t see what she sees.',
          'What begins between her and Elijah in 1992 carries that trait forward. It travels down the generations—through wars and information revolutions—all the way aboard Resonance.',
        ],
      },
      {
        heading: 'The violet bleed',
        paragraphs: [
          'Near a black hole, light doesn’t just dim. It stretches and bends. To most people aboard the ship, the edge of a time pocket looks like ordinary painted steel. To someone carrying Hannah’s fourth cone, the edge glows—a deep violet bleed running down the seam where time bends.',
          'Some of them carry a visible mark of it: mismatched eyes, heterochromia. In the novel, a father named Kiran teaches his son Leo to turn down the ship’s visual dampeners and trust his own eyes instead—“Don’t look at where the light is brightest. Look at the edges. Look for the bleed.”',
        ],
      },
      {
        heading: 'A hidden inheritance switching on',
        paragraphs: [
          '“Violet Bleed” is the moment of discovery: walking down a gray hallway everyone else squints through and suddenly seeing the warning lines nobody else can. “Red and green and blue only tell part.” It’s a song about a gift that waited centuries to matter.',
        ],
      },
    ],
    lyrics: `Standard bus went out at noon
Hallway painted gray, everyone is squinting hard
Trying to find the way
Funny what your eyes will do when the map goes blind
Waking up a brand new nerve right behind your mind

Three times on the old VCR
Never told the whole, now the edges start to hum
Pulling at my soul

I can see the violet bleed running down the seam
Waking up a fourth or shape sharper than a dream
Keep the sneakers moving fast down the corridor
Sing what was always there hidden by the floor

Used to think the room was blank, nothing left to read
Now the bruise electric tint gives me what I need
Every bend along the steel paints a warning line
Everybody misses it, looks like home to mine

Three times on the old VCR
Never told the whole, now the edges start to hum
Pulling at my soul

I can see the violet bleed running down the seam
Waking up a fourth or shape sharper than a dream
Keep the sneakers moving fast down the corridor
Sing what was always there hidden by the floor

Red and green and blue only tell a part
Open up the hidden band running through the chart
Step into the frequency, feel the pulse aligned
Every shifted wavelength turning into mine

I can see the violet bleed running down the seam
Waking up a fourth or shape sharper than a dream
Keep the sneakers moving fast down the corridor
Sing what was always there hidden by the floor

Violet on the seam
Sharper than a dream
Keep the rhythm moving down the corridor`,
    lyricNotes: [
      {
        line: 'I can see the violet bleed running down the seam',
        note: 'Where time pockets warp inside Resonance, tetrachromatic eyes perceive a shifted violet edge along the steel.',
      },
      {
        line: 'Red and green and blue only tell part / Open up the hidden band',
        note: 'Tetrachromacy—four kinds of color cones instead of three—traces back to Hannah, the lighting designer from the novel’s opening chapter.',
      },
    ],
  },
  {
    number: '10',
    slug: 'borrowing-tomorrow',
    title: 'Borrowing Tomorrow',
    zone: 'tip',
    zoneLabel: 'The Tip · Farewell Party',
    properTimeLabel: 'Tip speed · Decades before his return',
    duration: '03:00',
    vaultFile: '10-semi-borrowing-tomorrow.mp3',
    size: 7200333,
    artworkSrc: '/photos/persist/track-10-borrowing-tomorrow.jpg',
    artworkAlt:
      'Young researchers in knitwear toasting with mugs beneath string lights and silver birch trees in The Tip conservatory while a traveler in a heavy wool coat looks out toward the shuttle airlock.',
    sonicNote:
      'Upbeat 122-BPM celebratory indie-folk rock—porch-light warmth and gang-vocal party chorus hiding a bittersweet relativistic goodbye.',
    summary:
      'Marek, a researcher from the Old Country, finishes his work at The Tip, and the young scientists throw him a goodbye party. It sounds like a great weekend. Underneath, everyone knows that once his shuttle heads back down-spine, they’ll be old—or gone—before he could ever return.',
    essayTitle: 'A Whole Life Before the Flight',
    essaySubtitle: 'Marek’s farewell party at The Tip, where a weekend goodbye is a lifetime.',
    essaySections: [
      {
        heading: 'A visitor on a slower clock',
        paragraphs: [
          'Marek comes up from the Old Country to gather research and work alongside The Tip’s newest crop of scientists. For him, it’s a short trip. For them, it’s a real stretch of a much faster life—long enough to become close friends.',
        ],
      },
      {
        heading: 'Why they throw a party',
        paragraphs: [
          'Everyone at The Tip understands the math. When Marek boards the shuttle home, a few of his days will become years and decades up here. If he ever rides back up, the people raising a glass tonight will be grey-haired, or already gone.',
          'So nobody gives a speech. They put a record on side two, stick Polaroids to the fridge, and pour out the rest of the bottle. “You get a lifetime in forty-eight when everybody already knows.”',
        ],
      },
      {
        heading: 'A party song with a second meaning',
        paragraphs: [
          'Heard cold, “Borrowing Tomorrow” is a summer-weekend anthem. If you know Resonance, every line is a goodbye. Nobody’s making five-year plans because five years at The Tip is half a career. The whole party is a lifetime squeezed in before the flight.',
        ],
      },
    ],
    lyrics: `Friday night and the porch is full
Drinks lined up on the kitchen rail
Both of us know come Monday noon
We’re boardin’ a different trail
Nobody’s making five-year plans
Nobody’s saving up for spring
Counting the hours like loose change
Spending it all on everything

We’re borrowing tomorrow
Spending it tonight
Laughing like a whole life
Fits before the flight

Polaroids stuck to the fridge door
Records spinning on side two
Telling a decade of stories
Before the weekend is through
I don’t care what the calendar says
I don’t care how fast it goes
You get a lifetime in forty-eight
When everybody already knows

We’re borrowing tomorrow
Spending it tonight
Laughing like a whole life
Fits before the flight

Don’t signal anything, no looking back
Two days of summer on a one-way track
Pour out the rest of it, turn up the sound
Best kind of living with your feet off the ground

We’re borrowing tomorrow
Spending it tonight
Laughing like a whole life
Fits before the flight

Whole life in a weekend before the morning flight
Yeah, we’re spending it tonight
Tonight
Oh, we’re borrowing tomorrow
Yeah, we’re spending it tonight

We’re borrowing tomorrow
Spending it tonight
Laughing like a whole life
Fits before the flight`,
    lyricNotes: [
      {
        line: 'Nobody’s making five-year plans / Nobody’s saving up for spring',
        note: 'For Tip researchers throwing Marek a farewell, five years is practically a generation away once his shuttle drops back toward the horizon.',
      },
      {
        line: 'You get a lifetime in forty-eight / When everybody already knows',
        note: 'Everyone at the party understands they won’t see Marek again until they are elderly—if they are still alive at all.',
      },
    ],
  },
  {
    number: '11',
    slug: 'leaving-it-behind',
    title: 'Leaving It Behind',
    zone: 'horizon',
    zoneLabel: 'Earth Departure · Boarding Resonance',
    properTimeLabel: 'Shuttle ascent · Leaving a collapsing Earth',
    duration: '02:58',
    vaultFile: '11-semi-leaving-it-behind.mp3',
    size: 7118731,
    artworkSrc: '/photos/persist/track-11-leaving-it-behind.jpg',
    artworkAlt:
      'Inside an ascending shuttle cabin looking out a sunlit viewport at a fading Earth below and the colossal cylindrical hull of Resonance in orbit.',
    sonicNote:
      'Steady 111-BPM acoustic road-song—rolling folk-rock snare, dusty acoustic strumming, and resolute harmony.',
    summary:
      'When Earth can no longer hold everyone, families line up for the shuttles to Resonance—America’s ark. It sounds like a road song about leaving a small town. It’s really about leaving the planet.',
    essayTitle: 'Shuttle Ascent to Resonance',
    essaySubtitle: 'Leaving a collapsing Earth for a 2,000-kilometer hull in orbit.',
    essaySections: [
      {
        heading: 'An ark for one country',
        paragraphs: [
          'In Persist, Earth is collapsing, and not every nation can build a ship. Resonance is the United States’ answer: 2,000 kilometers of hull built to carry as many people, as much knowledge, and as much culture as it possibly can.',
        ],
      },
      {
        heading: 'Who goes where',
        paragraphs: [
          'Where you’re placed aboard the ship shapes everything that follows. By random happenstance, people from the big metropolitan areas end up at The Tip. Families from the South and Southwest fill the Midship. The Old Country gets a mix of ordinary citizens and humanity’s best minds—scientists, artists, keepers of culture—who choose its long, slow days so they can help the generations that come after.',
          'Nobody boarding the shuttles understands yet what those placements will mean—how one family’s week will be another family’s decade.',
        ],
      },
      {
        heading: 'Why it sounds like a road song',
        paragraphs: [
          'The lyrics never mention space. Pack the last box, leave the key under the mat, watch the town shrink to a marble in the rearview. That’s on purpose: leaving Earth would feel like every move you’ve ever made—just with no way back. “Ain’t no turning back once the wheels go round.”',
        ],
      },
    ],
    lyrics: `Pack the last box by the door
Left the key beneath the mat
Nothing left to argue for
No more looking back at that

Rearview mirror getting small
Town is just a marble now
Didn’t want to leave it all
Had to go to figure how

Leaving it behind
Stepping off the ground
Ain’t no turning back once the wheels go 'round
No, we won’t look down
We’re already gone
Leaving it behind
Rolling steady on

Saw the red dust passing by
Through the window on the right
Said goodbye to every mile
Rolled on out into the night

People ask you if you’re scared
When the road runs out of town
Truth is you were scared
Never laying burdens down

Leaving it behind
Stepping off the ground
Ain’t no turning back once the wheels go round
No, we won’t look down
We’re already gone
Leaving it behind
Rolling steady on

Maybe we were meant to stay
Maybe we were meant to roam
Either way we drew the line
And built another home

Leaving it behind
Stepping off the ground
Ain’t no turning back once the wheels go 'round
No, we won’t look down
We’re already gone
Leaving it behind
Rolling steady on

Leaving it behind
Rolling steady on
Ain’t no turning back
We’re already gone`,
    lyricNotes: [
      {
        line: 'Town is just a marble now',
        note: 'Viewed from an ascending orbital shuttle, the hometown—and Earth itself—shrinks into a blue marble.',
      },
      {
        line: 'Either way we drew the line / And built another home',
        note: 'Boarding Resonance meant accepting that humanity’s next home would divide into three clocks.',
      },
    ],
  },
  {
    number: '12',
    slug: 'circle',
    title: 'Circle',
    zone: 'horizon',
    zoneLabel: 'Ancient Flashback · Ana & Pyotr',
    properTimeLabel: 'The Invention of the Wheel',
    duration: '03:01',
    vaultFile: '12-semi-circle.mp3',
    size: 7234869,
    artworkSrc: '/photos/persist/track-12-circle.jpg',
    artworkAlt:
      'At twilight in a misty mud-flat valley, a mother kneels beside a wooden sledge carrying her injured son, wedging a rough-hewn wooden wheel slice under the runner toward distant hearth light.',
    sonicNote:
      '82-BPM acoustic folk ballad—fingerpicked guitar, warm fiddle-like sustain, and a grounded, timeless chorus.',
    summary:
      'Thousands of years before Resonance, a mother named Ana is dragging her feverish son Pyotr through a freezing marsh toward the healer. Her sledge is stuck. What she builds to save him is the wheel.',
    essayTitle: 'What Nobody Ever Sang About',
    essaySubtitle: 'Ana, Pyotr, a sinking sledge, and the invention of the wheel.',
    essaySections: [
      {
        heading: 'Everybody uses it. Nobody knows who made it.',
        paragraphs: [
          'The wheel may be the most important invention in human history, and it has no author—no name, no story, no song. One of the oldest wooden wheels ever found was pulled out of the Ljubljana Marshes in Slovenia, roughly five thousand years old. Persist imagines who might have made it, and why.',
        ],
      },
      {
        heading: 'A mother and a stuck sledge',
        paragraphs: [
          'Ana’s son Pyotr is seven winters old—too big to carry, too hurt to walk, burning with fever. Her husband Urdjo is away at the hunt. The healer’s hut is hours away across the mud, and her flat sledge, built for mountain snow, keeps sinking.',
          'Then a half-sunk log rolls under the runner. It doesn’t fight the mud; it walks across it. Ana tries birch rollers, but they keep slipping out the back. So she does something no one has done: she cuts two circles of birch, burns and scrapes a hole through their hearts, and binds them to an ash axle with strips of the deer hide wrapped around her son.',
        ],
      },
      {
        heading: 'The ground lets him go',
        paragraphs: [
          'The sledge stops dragging. Behind her, the tracks become two thin, clean lines. She reaches the healer’s fire, and she doesn’t care that she has just changed the future of her people. She only cares that Pyotr is still breathing.',
          '“Circle” sings that moment back to her. Every road humanity ever built—including the 2,000-kilometer one aboard Resonance—starts at a waterside like hers. You can read the full chapter here on the site.',
        ],
      },
    ],
    lyrics: `Cold mist rising past our knees
Reeds bend low beside the bank
Seven winters on your back
Every timber where we sank
Take the flint inside your palm
Shave the rough edge off the oak
Every journey starts right here
Before a single word was spoke

'Round and 'round the wooden wheel
Rolling through the wet and clay
Now we don’t have to carry all
The weight we carried yesterday
Small hands learning how to turn
Out into the open wide
Every road we ever built
Started at the waterside

Raindrops falling on your coat
Muddy footprints in the grass
Little boy beside the marsh
Building something meant to last
Cut the center straight and true
Slide the axle through the grain
Once a circle starts to roll
Nothing stays the same again

'Round and 'round the wooden wheel
Rolling through the wet and clay
Now we don’t have to carry all
The weight we carried yesterday
Small hands learning how to turn
Out into the open wide
Every road we ever built
Started at the waterside

Thousands of miles ahead
Further than our eyes can see
Every step that takes us far
Starts with just you and me

'Round and 'round the wooden wheel
Rolling through the wet and clay
Now we don’t have to carry all
The weight we carried yesterday
Small hands learning how to turn
Out into the open wide
Every road we ever built
Started at the waterside

Round and round the wooden wheel
Out into the open wide
Every road we ever built
Started at the waterside`,
    lyricNotes: [
      {
        line: 'Seven winters on your back / Every timber where we sank',
        note: 'Pyotr is seven winters old in the novel—too big for Ana to carry, too hurt to walk—as she hauls him through the marsh on a sinking sledge.',
      },
      {
        line: 'Cut the sinew straight and true / Slide the axle through the grain',
        note: 'In the chapter, Ana cuts two birch circles, burns a hole through their centers, and binds them to an ash axle with strips of her son’s deer-hide blanket.',
      },
    ],
  },
  {
    number: '13',
    slug: 'redshift-reprise',
    title: 'Redshift (Reprise)',
    zone: 'horizon',
    zoneLabel: 'Horizon edge',
    properTimeLabel: '1 second here ≈ 10 years there',
    duration: '02:51',
    vaultFile: '14-semi-redshift-reprise.mp3',
    size: 6824973,
    isBonus: true,
    artworkSrc: '/photos/persist/track-14-redshift-reprise.jpg',
    artworkAlt:
      'Close-up of Semi in a slate cardigan beside a dim viewport catching soft golden light.',
    sonicNote: 'Nocturnal electronic reprise—pulsing arpeggios, Doppler swells, a close, quiet vocal.',
    summary:
      'The mirror to track one: the same melody heard from the observation glass instead of the porch.',
    essayTitle: 'Gravity Holds: The Story Behind “Redshift (Reprise)”',
    essaySubtitle:
      'Where the album’s opening song goes when you take away the porch.',
    essaySections: [
      {
        heading: 'From the porch to the glass',
        paragraphs: [
          'If “Redshift” is heard from a porch in autumn, the reprise is heard from the observation window at the edge of the gravity well. The acoustic guitar steps back. Pulsing synths and Doppler swells take its place.',
          'It’s the same love, just stripped down to the physics.',
        ],
      },
      {
        heading: 'One second here, ten years there',
        paragraphs: [
          'The chorus says the ratio out loud: “One second here is ten years there.” Two people are drifting apart at the speed of time itself—“two satellites before the crash.”',
          'And yet the last words of the song refuse to give in: “Pull me back in. Gravity holds.” The same force that separates them is the one that keeps them in orbit.',
        ],
      },
    ],
    lyrics: `One two three,
One two

You pull away, the light turns blue
I stay right here and look for you
The wavelength stretches out so long
A quiet space inside the song
We spin in place, we spin in space
I trace the curve across your face

Heavy weight, heavy space
Time slows down in the outer place
One second here is ten years there
I feel your pull in the--
Oh, in the open air

Now you're drifting past the speed of light
Leaving a crimson trail through the night
Gravity holds while the dark red bends
Show me where the timeline starts and ends
Caught in the redshift, drawn to your trace
Two faint orbits in the curve of space
Oh, slow the hours and pull me back in
Tell me where we end and begin

Solar haze on rue
Massive stars in heavy grounds
Clock ticks fast without a sound
We fly ahead at light-speed pace

I count the frames in empty space
A Doppler shift, a sudden flash
Two satellites before the crash

Heavy weight, heavy space
Time slows down in the outer place
One second here is ten years there
I feel your pull in the--
Oh, in the open air

Now you're drifting past the speed of light
Leaving a crimson trail through the night
Gravity holds while the dark red bends
Show me where the timeline starts and ends
Caught in the redshift, drawn to your trace
Two faint orbits in the curve of space
Oh, slow the hours and pull me back in
Tell me where we end and begin

Slow down, slow down
Bend the grid
Look at what the gravity did
Fast forward now, hold on tight
Cross the horizon in the night

Now you're drifting past the speed of light
Leaving a crimson trail through the night
Gravity holds while the dark red bends
Show me where the timeline starts and ends
Caught in the redshift, drawn to your trace
Two faint orbits in the curve of space
Oh, slow the hours and pull me back in
Tell me where we end and begin

Light-speed
Spinning in space
Pull me back in
Gravity holds`,
    lyricNotes: [
      {
        line: 'You pull away, the light turns blue / The wavelength stretches out so long',
        note: 'Light compresses as someone approaches and stretches as they leave—blueshift and redshift in one breath.',
      },
      {
        line: 'Slow down, slow down / Bend the grid / Look at what the gravity did',
        note: 'A nod to the warped grid of the Midship.',
      },
      {
        line: 'Gravity holds',
        note: 'The quiet thesis of Persist: endurance against entropy.',
      },
    ],
  },
  {
    number: '14',
    slug: 'half-life-alternate',
    title: 'Half Life (Alternate Take)',
    zone: 'midship',
    zoneLabel: 'Midship cabin',
    properTimeLabel: 'One step past the bulkhead · ten winters',
    duration: '03:01',
    vaultFile: '15-semi-half-life-alternate.mp3',
    size: 9544117,
    isBonus: true,
    artworkSrc: '/photos/persist/track-15-half-life-alternate.jpg',
    artworkAlt:
      'Late-night portrait of Semi in an oatmeal linen shirt beside an analog synth and acoustic guitar in a small cabin.',
    sonicNote: 'Stripped late-night cabin take—close-mic guitar and a warm synth hum.',
    summary:
      'An intimate alternate take: one step past the bulkhead at shift change, and ten winters on the wall.',
    essayTitle: 'Not a Cold Archive: The Story Behind “Half Life (Alternate Take)”',
    essaySubtitle:
      'A different set of words for the same faded Polaroid.',
    essaySections: [
      {
        heading: 'Inside the cabin',
        paragraphs: [
          'The album version of “Half Life” looks outward, down a highway of years. This alternate take stays inside a small Midship cabin late at night, with a shoebox of Polaroids and a synth humming on the table.',
          'It shares the chorus idea—“the pieces that we lose are the ones we keep at all”—but rewrites the verses around one devastating image.',
        ],
      },
      {
        heading: 'Ten winters on the wall',
        paragraphs: [
          '“Shift change on the Midship, walking down the hall. One step past the bulkhead, ten winters on the wall.” The person on the other side has coffee on their sleeve and a crease beside their mouth that wasn’t there this morning.',
          'Against a ship that wants to keep every memory spotless, Semi chooses something else: “Not a cold archive, not a spotless screen—just a warmth inside the gaps of everything we’ve seen.”',
        ],
      },
    ],
    lyrics: `Shoebox in the closet, curled up at the seams
Faces getting softer, blurring at the edges
I can pull the raw file, clean as the day we met
You say a real memory needs room to forget

You don't want a mirror locked behind the glass
You want the messy proof that we were here to pass

Half-life of a Polaroid fading on the wall
The pieces that we lose are the ones we keep at
All keep the rhythm moving through the static and the years
Every scratch upon the tape is how we know we're here

Shift change on the Midship, walking down the hall
One step past the bulkhead, ten winters on the wall
You've got coffee on your sleeve, and a crease beside your mouth
I'm still standing where you left me, looking north and south
You don't want a mirror locked behind the glass
You want the messy proof that we were here to pass

Half-life of a Polaroid fading on the wall
The pieces that we lose are the ones we keep at
All keep the rhythm moving through the static and the years
Every scratch upon the tape is how we know we're here

Not a cold archive, not a spotless screen
Just a warmth inside the gaps of everything we've seen
Half-life of a Polaroid fading on the wall
The pieces that we lose are the ones we keep at

All keep the rhythm moving through the static and the years
Every scratch upon the tape is how we know we're here
Fading on the wall, the ones we keep at
All keep the rhythm moving through the years`,
    lyricNotes: [
      {
        line: 'One step past the bulkhead, ten winters on the wall',
        note: 'Midship time pockets in a single line: a doorway can hold a decade.',
      },
      {
        line: 'Not a cold archive, not a spotless screen',
        note: 'Human memory lives in the gaps that perfect storage throws away.',
      },
    ],
  },
];

export function getPersistTrack(slug: string): PersistTrack | undefined {
  return PERSIST_TRACKS.find((t) => t.slug === slug);
}

export const PERSIST_AUDIO_MANIFEST: Record<
  string,
  { vaultFile: string; size: number; title: string }
> = Object.fromEntries(
  PERSIST_TRACKS.map((t) => [t.slug, { vaultFile: t.vaultFile, size: t.size, title: t.title }])
);
