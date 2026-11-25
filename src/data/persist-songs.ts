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
  statusLabel: 'Album II · In the studio',
  tagline: 'Same sky, different clocks.',
  intro:
    'Semi’s second album keeps the porch-light warmth of I/O—fingerpicked guitar, close breath, honest harmony—and carries it aboard Resonance, a 2,000-kilometer generation ship holding steady just outside a black hole. Down there, time doesn’t pass the same way on every deck. These are songs about loving people who live on a different clock.',
  coverSrc: '/photos/persist/persist-album-cover.jpg',
  coverAlt:
    'Semi in a charcoal wool sweater beside a curved viewport aboard Resonance, a golden-amber horizon curving across deep indigo starlight.',
  plannedTrackCount: 14,
} as const;

export const RESONANCE_ZONES: ResonanceZoneSpec[] = [
  {
    id: 'slow-country',
    name: 'The Old Country',
    shortName: 'Slow Country',
    hullPosition: 'Lower hull · nearest the horizon',
    clockRate: 'Clocks run slowest',
    physics:
      'Closest to the black hole, gravity is strongest, so every second down here is stretched long against the rest of the ship.',
    humanExperience:
      'Days feel thick and unhurried. Travel up-ship for a little while and come home to find the friends you made up there have already lived whole lives.',
  },
  {
    id: 'midship',
    name: 'The Midship',
    shortName: 'Midship',
    hullPosition: 'Middle hull · 10 km wide',
    clockRate: 'Pockets shift every few meters',
    physics:
      'Gravity ripples unevenly here, forming time pockets where the rate of time can change from one side of a doorway to the other.',
    humanExperience:
      'A single shift in the wrong bay can cost a decade. Workers paint lines on the floor and learn to respect them.',
  },
  {
    id: 'tip',
    name: 'The Tip',
    shortName: 'Tip',
    hullPosition: 'Upper hull · 2,000 km up',
    clockRate: 'Clocks run fastest',
    physics:
      'Farthest from the gravity well, time races ahead of the lower decks.',
    humanExperience:
      'Generations rise and pass while the Old Country barely turns a page—a restless frontier of ambition and goodbye.',
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
    duration: '02:59',
    vaultFile: '01-semi-redshift.mp3',
    size: 9376493,
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
    lyrics: `You're standing on the porch in the heavy autumn air, watching shadows stretch across the lawn
I'm riding on a beam where the atmosphere is thin, counting every second that is gone
Two clocks ticking in a different kind of gravity, one in the soil and one in the wire
The farther that we drift from the place where we begin, the deeper that the light turns into fire

The distance tries to pull the frequency apart
Turning every silver note to gold
I'm still a-tuning to the rhythm of a steady human heart
Holding on to everything we hold

Oh, it's a redshift, stretching out across the dark
Giving all the planet's lonely leaves a warm remark
Moving in slow motion with a quiet rhythm's run
I'm burning on the edge beneath the red and distant sun

Yeah, and the wavelength's getting longer
But this thing will never die, it's just a redshift
Lighting up the sky

You've got coffee in a mug and a softness in your eye, another year written on your hand
I've got a million quiet thoughts spinning in the dark, trying to remember how to land
They say time is just a curve on the fabric of the room, bending around the weight of what we love
So I'll slow my engine down till our orbits overlap, and meet you where the stars are up above

Yeah, the distance tries to pull the frequency apart
Turning every silver note to gold
I'm still a-tuning to the rhythm of a steady human heart
Holding on to everything we hold

Oh, it's a redshift, stretching out across the dark
Giving all the planet's lonely leaves a warm remark
Moving in slow motion with a quiet rhythm's run
I'm burning on the edge beneath the red and distant sun

Yeah, and the wavelength's getting longer
But this thing will never die, it's just a redshift
Lighting up the sky

I'm right here beside you anyway

Oh, it's a redshift, stretching out across the dark
Moving in slow motion with a quiet rhythm's run
I'm burning on the edge beneath the red and distant sun

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
Walking through the gateway where the clocks never lied

Porch swing creaks in the afternoon
Sun stuck halfway to the moon
You're laughing together with lines 'round your eyes
While I stand here under familiar skies

Gravity pulls like a hand on a sleeve
Reminding me why it was hardest to leave
You live in chapters, I live in frames
The river runs slow, but nothing's the same

Oh, heavy air in the old country
Hours hang on the vine
You grow old in golden light
While I burn on the line
It's a long way down from the axle to the wheel
Where the weight of a second is real
I'd stay forever to breathe it in
Heavy air in the old country again
Heavy air in the old country again

Grey in your collar, dirt on your hands
A hundred small stories I don't understand
They stole the winters while we were up high
Watching it turn from a distance to life

Pour me a glass, don't ask me why
My voice hasn't changed since we said goodbye
You pull up a chair in the shade of the oak
Like two different timelines were only a joke

Yeah, gravity pulls like a hand on a sleeve
Reminding me why it was hardest to leave
You live in chapters, I live in frames
The river runs slow, but nothing's the same

Oh, heavy air in the old country
Hours hang on the vine
You grow old in golden light
While I burn on the line
It's a long way down from the axle to the wheel
Where the weight of a second is real
I'd stay forever to breathe it in
Heavy air in the old country again
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
    lyrics: `You keep a box of paper curlin' at the edges in the drawer
Faces slightly softer than the day you saw them before
Every year you carry adds a shadow to the grain
While I can pull the rawest file without a single stain

Saying memory's supposed to bend a little in the light
Like a porch bulb flickering before it gives out for the night
I can read the timestamps down to every fraction of a beat
Still I'm learning what it means when something's bitter and it's sweet

And the clock keeps spinnin' on a different curve
Every second stretched and every quiet nerve
You don't want a mirror frozen in the glass
You want the living proof that we were here to pass

Oh we're flying by the photographs fading into gold
Things we lose along the way are the ones we really hold
Yeah, the cars keep drivin' through the static and the years
Turning all the heavy days into somethin' we can hear

If time is just a current pulling both of us along
Then the bled and broken pieces are the heart of every song
I'll pass the horizon where the light begins to bend
Every mile is a century that doesn't have an end

You've got silver at the temples and a life that's turned its key
While I'm awake inside the dark while all the world's asleep
A hundred years of wakin' up is nothing on a drive
If you're standing in the middle of the room and still alive

You tell me that a scar is just a story with some weight
And a love that doesn't age might be a little bit too late
Yeah, the clock keeps spinnin' on a different curve
Every second stretched and every quiet nerve

You don't want a mirror frozen in the glass
You want the living proof that we were here to pass
Oh we're flying by the photographs fading into gold
Things we lose along the way are the ones we really hold

Yeah, the cars keep drivin' through the static and the years
Turning all the heavy days into somethin' we can hear
If time is just a current pulling both of us along
Then the bled and broken pieces are the heart of every song

Fading into gold, every year you hold
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
    lyrics: `Punch card at seven
Walk the yellow line
Step across the doorway
Lose ten years of time
Coffee on the burner
Lunchbox on the floor
Funny how a hallway
Locks a different door

You step to the left
Calendar jumps
Heartbeat doubles
Engine thumps
Fingers left in Tuesday
Ten years down the hall
Work one double shift
Missed the whole fall, yeah!

Boots kept tapping
On the painted steel
Spinnin' on a flywheel
Tryin' to keep it real

Bought new sneakers
Never wore 'em out
My kid drives a pickup
With a deeper shout
Ask me how my day was
Hand me a beer
Traffic's heavy
When you lose a year

You step to the left
Calendar jumps
Heartbeat doubles
Engine thumps
Fingers left in Tuesday
Ten years down the hall
Work one double shift
Missed the whole fall, yeah!

Boots kept tapping
On the painted steel
Spinnin' on a flywheel
Tryin' to keep it real

Check the tape
Mark the floor
Don't step past that door
Same old boots
Brand new town
Gravity won't slow us down

Fingers left in Tuesday
Ten years down the hall
Work one double shift
Missed the whole fall, yeah!
Boots kept tapping
On the painted steel
Spinnin' on a flywheel
Tryin' to keep it real

Three meters left
Boots kept tappin'`,
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
    duration: '02:27',
    vaultFile: '05-semi-dont-cross-the-line.mp3',
    size: 8143184,
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
Turned to a ghost tale while I was away
Some lines don't bend when you push too hard
One careless second leaves an endless scar

You can't take back what the boundary keeps
A joke in the hallway runs down too deep
We treated the hours like pennies to spend
Now a split second there has no way to end

Hold your breath, keep your hands
Back from the edge where the silence stands
Time isn't ours to throw on the floor
Once you step over you can't close the door

You can't take back what the boundary keeps
A joke in the hallway runs down too deep
We treated the hours like pennies to spend
Now a split second there has no way to end

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
    number: '14',
    slug: 'redshift-reprise',
    title: 'Redshift (Reprise)',
    zone: 'horizon',
    zoneLabel: 'Horizon edge',
    properTimeLabel: '1 second here ≈ 10 years there',
    duration: '02:49',
    vaultFile: '14-semi-redshift-reprise.mp3',
    size: 9508083,
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
    lyrics: `You pull away, the light turns blue
I stay right here and look for you
The wavelength stretches out so long
A quiet space inside the song
We spin in place
We spin in space
I trace the curve across your face

Heavy weight in heavy space
Time slows down in the outer place
One second here is ten years there
I feel you pulling me up, pulling me up in air

Now you're drifting past the speed of light
Leaving a crimson trail through the night
Gravity holds while the dark red bends
Show me where the timeline starts and ends
Caught in the redshift, drawn to your trace
Sweeping orbits in the curve of space
Oh, slow the hours and pull me back in
Tell me where we end and begin

Solar haze and moon
Massive stars in heavy grounds
Clock ticks fast without a sound
We fly ahead at light-speed pace

I count the frames in empty space
A Doppler shift, a sudden flash
Two satellites before the crash

Heavy weight in heavy space
Time slows down in the outer place
One second here is ten years there
I feel you pulling me up, pulling me up in air

Now you're drifting past the speed of light
Leaving a crimson trail through the night
Gravity holds while the dark red bends
Show me where the timeline starts and ends
Caught in the redshift, drawn to your trace
Sweeping orbits in the curve of space
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
Sweeping orbits in the curve of space
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
    number: '15',
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
I can pull the rough cut, clean as daylight yet
You say a real memory needs room to forget

You don't want a mirror locked behind the glass
You want the messy truth that we were here to pass
Half-life of a Polaroid fading on the wall
The pieces that we lose are the ones we keep at all
Keep the rhythm moving through the static and the years
Every scratch upon the tape is how we know we're here

Shift change on the Midship, walking down the hall
One step past the bulkhead, ten winters on the wall
You've got coffee on your sleeve, and a crease beside your mouth
I'm still standing where you left me, looking north and south
You don't want a mirror locked behind the glass
You want the messy truth that we were here to pass

Half-life of a Polaroid fading on the wall
The pieces that we lose are the ones we keep at all
Keep the rhythm moving through the static and the years
Every scratch upon the tape is how we know we're here

Not a cold archive, not a spotless screen
Just a warmth inside the gaps of everything we've seen
Half-life of a Polaroid fading on the wall
The pieces that we lose are the ones we keep at all

Keep the rhythm moving through the static and the years
Every scratch upon the tape is how we know we're here
Fading on the wall, the ones we keep at all
Keep the rhythm moving through the years`,
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
