// Lightly edited excerpts from Cubby’s novel-in-progress, Persist.
// Early drafts: wording may change before publication.
export interface PersistChapterBlock {
  type: 'p' | 'break';
  text: string;
}

export interface PersistChapter {
  slug: string;
  title: string;
  label: string;
  era: string;
  dek: string;
  readingMinutes: number;
  relatedTrackSlug: string;
  blocks: PersistChapterBlock[];
}

const BLOCKS: Record<string, PersistChapterBlock[]> = {
  "light": [
    {
      "type": "p",
      "text": "The buzz of New York City greeted the morning sun—a low, electric hum rising from the flies hovering over rancid garbage, the idling taxis listening to the morning news, the bustle of a million denizens trying to get ahead of the next guy at any cost. It was a thick, physical weight—a low-frequency purr that didn't just fill the ears but rattled the teeth and settled into the marrow. The August heat released the scent of old, spilled beer and sun-rotted produce that had leaked from split plastic bags overnight, creating a humid fog that clung to the skin like a tax on the simple act of breathing."
    },
    {
      "type": "p",
      "text": "Elijah stepped around a cluster of flies fluttering over a burst bag of fermented fruit. He passed a newsstand where the headlines were a chaotic collage of 1992—Bill Clinton’s bus tour, the erratic charts of Ross Perot, and the distorted, hollow faces of the post-80s era staring out from the covers of SPIN. A passing car was bleeding a tinny, overdriven bass line from Nevermind, the sound of the guitar cutting the air itself, like paper being torn by a serrated edge."
    },
    {
      "type": "p",
      "text": "He was twenty-five, a junior analyst at a mid-tier firm, and he felt like a stranger in a suit that was too heavy for the humidity. He was the son of a man who had kept ledgers with a fountain pen in the sixties, a man who understood money as a static monument—permanent and unmoving. Elijah, however, saw the world as a series of fluid, high-velocity signals. To him, the city wasn't a place; it was a bottleneck, a sprawling system of tradeoffs and barked orders that demanded a toll of focus and stamina for every inch of progress."
    },
    {
      "type": "p",
      "text": "Inside the corner deli, the air was a stagnant soup of burnt coffee and cleaning chemicals. Above the counter, a commercial-grade fluorescent tube was failing in a rhythmic, stuttering strobe. It emitted a jagged, electric whine—a dry, persistent flicker that felt like a needle scratching against the inside of Elijah’s skull. It was a modern light, the kind rolled out to save on energy costs, but the price was a violent loss of warmth and an enforced clinicality that could never truly be ignored, only tolerated in a moment."
    },
    {
      "type": "p",
      "text": "Elijah stood at the counter, his briefcase clutched in a white-knuckled grip. He had been awake since three in the morning, watching the green phosphor glow of a Quotron monitor that ran hot enough to smell like ozone. He was trying to find the one-cent discrepancy in a million-dollar capital flow—a hidden path of data that everyone else ignored. They traded on fundamentals, but Elijah traded based on information."
    },
    {
      "type": "p",
      "text": "\"No Swiss cheese,\" Elijah said, his voice a dry rasp. He held the wrapped sandwich like it was a failed trade. \"I asked for Swiss. It’s on the slip. It’s right there, in black and white.\""
    },
    {
      "type": "p",
      "text": "The clerk didn't look up, his hands already reaching for the next customer’s bagel. \"Out of Swiss, man. Provolone's the same. Just eat it.\" The sandwich maker was already on to the next customer’s order, pastrami on rye."
    },
    {
      "type": "p",
      "text": "Elijah stared at the sandwich. It wasn't the cheese; it was the lack of precision. He lived with a mind that tracked the delta between million-dollar trades, where a single-cent discrepancy was a systemic failure, and here he was, standing in a city that couldn't even manage a three-item order without an unasked-for substitution. He looked up at the flickering light, the buzzing grating him to his core."
    },
    {
      "type": "p",
      "text": "\"I know you can't fix it,\" Elijah said, turning back toward the clerk. \"But I hate these lights. They flicker in my office. They flicker in the subway. I come here for a sandwich, and I’m standing under a strobe light that makes everything look harsh and violent. You can’t even get a sandwich right, and the air itself is screaming at me.\""
    },
    {
      "type": "p",
      "text": "A woman at the end of the counter, her hair tied back with a piece of fabric, let out a short, surprised laugh. She was dressed in a charcoal trench coat that looked like it had seen a half dozen lives’ worth of winters. She was looking at the ceiling, her narrowed eyes tracking the flicker of the ballast with a focus that suggested she was seeing a map Elijah couldn't quite read."
    },
    {
      "type": "p",
      "text": "\"I thought I was the only person in the city who noticed the sound and hated these new CFLs,\" she said. \"I miss the silence of a real bulb. This just feels like we’re all living inside a giant, cheap radio.\""
    },
    {
      "type": "p",
      "text": "Elijah blinked. She wasn't looking at him with the usual New York suspicion and inconvenience. She was looking at the light with a clarity that matched his own."
    },
    {
      "type": "p",
      "text": "\"I'm Elijah,\" he said, the tension in his shoulders dropping an inch. \"And I don’t normally do this, but I'm about to go sit in a cubicle for ten hours. Would you want to get a coffee? Now? Before we both lose our minds?\""
    },
    {
      "type": "p",
      "text": "\"I’m Hannah,\" she said, checking a heavy plastic watch that looked like it had been dropped in a bucket of stage paint. \"I have to be at the Majestic Theatre for a focus call in 35 minutes. I’m a lighting designer. If I’m late, the director is going to fire people, starting with me. I’ve already spent half my morning on the phone arguing with him that a sunset shouldn’t look like a crime scene. But if you’re still sane by eight tonight, meet me at The Copperhead on Seventh. They only use incandescents.\" She smiled. “If you’re headed toward the subway, we can walk together.”"
    },
    {
      "type": "p",
      "text": "They walked out of the deli together, hitting the wall of heat on Avenue B. They walked south toward the subway entrance, a ten-minute trek through a landscape of puddles, discarded flyers, and people who were stuck in a place that universally seemed to be a mismatch with where they wanted to be."
    },
    {
      "type": "p",
      "text": "\"I have to go uptown,\" Hannah said, gesturing toward the stairs where the hot air of the tunnel was rising in a steady gasp. \"50 blocks of human misery and unpredictability. What about you?\""
    },
    {
      "type": "p",
      "text": "\"I'll walk,\" Elijah said, looking toward the financial district. \"I'd rather take the heat than the tunnel.\""
    },
    {
      "type": "p",
      "text": "\"Eight o'clock, Elijah,\" she said, stepping toward the stairs."
    },
    {
      "type": "p",
      "text": "Elijah’s walk to Wall Street was a descent into a different kind of fever. Here, the buzzing was mechanical—the sound of air conditioning units struggling against the sun and the frantic, rhythmic tapping of thousands of heels. Elijah entered the firm at 8:15 AM. The trading floor was a cavern of beige plastic and recycled air, defined by the rhythmic clacking of mechanical keyboards, punctuated by the return carriages of the secretary’s typewriters."
    },
    {
      "type": "p",
      "text": "He sat at his desk and slid a five-and-a-quarter-inch floppy into his computer’s drive. The machine whirred—a mechanical gasp for air—as it loaded his spreadsheets."
    },
    {
      "type": "p",
      "text": "Miller, a senior trader who fervently believed the market was a blood sport and Gordon Gekko was its purest aspiration, leaned over the cubicle wall. \"You're late, Elijah. The Nikkei is soft and London is eating our lunch. You want to survive? You stop looking at the numbers like they're a puzzle. It’s a dog-eat-dog world, kid. You either eat or you’re the garbage rotting in the heat.\""
    },
    {
      "type": "p",
      "text": "Elijah didn't respond. He waited for the cursor to blink, feeling the seconds bleed away as the drive clicked and groaned. To Elijah, the market was a biological system, a pulse of human intent that could be predicted if you just heard the frequency, had the tools to examine it, and occasionally the willpower to perform an autopsy. He moved through the data with a velocity that tested the hardware, hunting for the tiny discrepancies that everyone else was too set in their ways to notice. But the machine was a bottleneck. Every time he felt the pattern forming, the Quotron would lag, a stutter that left him buffering just like his hardware."
    },
    {
      "type": "p",
      "text": "Four miles uptown, Hannah was forty feet above the stage of the Majestic Theatre. The air offered an acrid mix of dust and old velvet, heated by massive, thousand-watt lamps that hummed around her like angry insects."
    },
    {
      "type": "p",
      "text": "She held a gel frame called \"Midnight Ember.\" Hannah saw the world with an unusual density because she had tetrachromacy, a condition in which her eyes carried a fourth kind of color cone. Where the director saw \"blue,\" Hannah saw the jagged ultraviolet spill that made the dust motes look like glowing embers. She saw the curvature of the light as it hit the floorboards, a hidden spectrum of deep violets and burning oranges that folded like a drawn curtain."
    },
    {
      "type": "p",
      "text": "\"Hannah! Give me more punch on the center spot!\" the director barked from the dark."
    },
    {
      "type": "p",
      "text": "\"The center spot is fine, Marcus,\" Hannah called back. \"But the spill from the wing-lights is corrupting the hue. It’s making the lead look like she’s standing in a puddle of ink.\""
    },
    {
      "type": "p",
      "text": "\"Just give me the damn lumens!\""
    },
    {
      "type": "p",
      "text": "Hannah sighed. She wanted a design so perfect it would become invisible, leaving only the music for the crowd to hold. But the tools were too low-resolution. The lamps flickered, the gels faded, and the men on the floor didn't even have a name for the colors she was trying to show them. She lived in the deltas—the tiny, unnoticeable changes in shade that turned a performance into a memory. Theater patrons would not recognize the lighting expertise she offered, but they would talk about the set design and the emotions it generated. Hannah didn’t view her work as a part of the performance; instead, she thought of lighting as the elemental focus of theater, choosing what to cast in shadow and to whom illumination should be provided."
    },
    {
      "type": "p",
      "text": "The Copperhead was buried three steps below the sidewalk on Seventh Street, a subterranean pocket where the city’s buzz finally met its match in the density of old brick and heavy timber. Stepping inside was like descending into a different century. The air was cool and smelled of wax, spilled gin, and the faint, lingering ghosts of clove cigarettes. Unlike the deli or the trading floor, there were no fluorescents here to scream at the nerves. The light came from small, amber-filament Edison bulbs and fat, white candles that sat in puddles of their own hardened wax on the bar top. It was soft, honest, and ancient."
    },
    {
      "type": "p",
      "text": "Elijah was sitting in a corner booth, the wood of the table scarred by decades of initials and cigarette burns. He had arrived twenty minutes early, driven by a restless energy he couldn’t name. He had spent the afternoon staring at his Quotron, but the numbers had felt flat, like a code he had already cracked. Every time the disk drive whirred, he had thought of the stuttering light in the deli."
    },
    {
      "type": "p",
      "text": "When Hannah walked in, the amber light caught the edges of her trench coat, turning the paint flecks on the fabric into tiny, glowing stars. She looked around, her eyes adjusting with a slow, deliberate sweep of the room. When she saw him, she didn't just smile; she exhaled, a visible release of the day’s tension."
    },
    {
      "type": "p",
      "text": "\"You’re still alive,\" she said, sliding into the booth across from him. The scent of stage-dust and cold night air followed her."
    },
    {
      "type": "p",
      "text": "\"Just barely,\" Elijah replied. He signaled the bartender, a man who looked like he had been part of the building's original foundation. \"Two martinis. Very cold.\""
    },
    {
      "type": "p",
      "text": "\"So,\" Hannah said, leaning forward. Her hands were stained with a smudge of deep indigo gel-dye. \"How was the dog-eat-dog world? Did you sharpen your knife?\""
    },
    {
      "type": "p",
      "text": "Elijah looked at his hands, then back at her. \"Miller—my senior partner—told me I need to stop looking at the market like a puzzle and start looking at it like a throat. He thinks the goal is to eat the guy next to you. But I spent my afternoon looking at a balance sheet for a shipping company and realized the entire logistics chain is built on a lie. They’re pretending the friction doesn't exist, but I can see it in the margins. It’s like everyone is shouting over the buzz, and I’m the only one who realizes we could just turn the machine off.\""
    },
    {
      "type": "p",
      "text": "He paused, his eyes tracing the symmetry of her face in the candlelight. \"I keep thinking about what you said. About the sound of the light. It’s the first time I’ve talked to someone who didn't look at me like I was malfunctioning when I mentioned it. How was the theater?\""
    },
    {
      "type": "p",
      "text": "\"I spent my day in the rafters,\" Hannah said, her voice dropping into a conspiratorial whisper. \"Argued with a union electrician for an hour because he didn't believe that a five-percent shift toward amber would change the emotional weight of the finale. He kept saying, 'It's just a light, kid.' But it's not. If the light is wrong, the actors are just people in costumes. If it's right, they're gods. I can see the layers, Elijah, I know that color is the only way to make the chemistry between the actors and the audience happen, and without the magic of light, the spell of the theater falls apart. I see colors that I can’t even describe to the director because the vocabulary doesn't exist in English.\""
    },
    {
      "type": "p",
      "text": "\"I think I understand,\" Elijah said. He reached for a napkin and a pen, but then stopped. \"I realized something today. While I was waiting for a trade to clear. Your name.\""
    },
    {
      "type": "p",
      "text": "Hannah raised an eyebrow. \"My name?\""
    },
    {
      "type": "p",
      "text": "\"It’s a palindrome,\" he said, his voice quiet. He wrote out H-A-N-N-A-H. “It’s the same forward and backward. It’s a closed loop. Perfect symmetry. In my world, that’s the rarest kind of data. It’s a signal that doesn't lose anything in the transmission. I love that. It’s probably strange, but I love finding palindromes in stock price sheets. They’re rare, but it’s like the system is winking at me.\""
    },
    {
      "type": "p",
      "text": "Hannah laughed, a warm, melodic sound that seemed to hum in the low-ceilinged room. \"I never thought of it that way. Maybe that’s why I like the lights, Elijah. They’re circular. They’re referenceable. They can blink and they can wink, just like us.\" She sipped her martini. “Most people just think it’s a 'nice name.' My parents picked it because it sounded 'classic.' They wanted something that wouldn't go out of style, like the mid-century furniture they’re so obsessed with. They’re terrified of the world getting too fast. My dad thinks the VCR is the end of civilization. He’s worried that once we can pause time, we’ll lose the ability to live in it.\""
    },
    {
      "type": "p",
      "text": "\"The VCR isn't the end,\" Elijah said, the martinis arriving. The glasses were frosted with a thin layer of ice. \"It’s the beginning. We’re on the edge of something, Hannah. I can feel the flow changing. This information superhighway everyone’s talking about—Al Gore and the rest—they think it’s just going to be faster computers. But it’s going to be more than that. It’s going to be a way for everything to finally connect. Music, money, memory. We’re going to be able to tape our lives, send them to others, and then they can play them or store them or stop playing them whenever they feel like it.\""
    },
    {
      "type": "p",
      "text": "\"Is that a good thing?\" Hannah asked, her fingers tracing the rim of her glass. \"If everything is connected, where does the human go? I’m worried we’re going to trade the warmth of the incandescent for the efficiency of this new buzz. I’m worried the future is going to be very bright and very cold.\""
    },
    {
      "type": "p",
      "text": "\"Maybe,\" Elijah admitted. \"But think about the potential. If we can map the world, maybe we can map the human heart. Maybe I won't have to guess if a trade is good or if a person is real. Maybe we can solve the equation of loneliness.\""
    },
    {
      "type": "p",
      "text": "They sat in the amber silence, the 1992 world humming outside the basement walls. They dreamed of a future where the grit of the Lower East Side was gone, replaced by something clean and light, not knowing that the 'clean' future would come with its own set of screens and shadows."
    },
    {
      "type": "p",
      "text": "\"I hope the future has more people like you,\" Hannah said, her eyes locked on his. \"People who can see the connections.\""
    },
    {
      "type": "p",
      "text": "\"I hope the future is lit by you,\" Elijah replied."
    },
    {
      "type": "p",
      "text": "By the time they finished their second drink, the bar was filling up and they were having to shout over the other patrons. They walked out of the Copperhead and back into the Alphabet City night. The air had cooled slightly, and the frantic buzz of the morning had settled into a low, rhythmic throb. The flies were gone, and the garbage was just a silhouette in the gutters."
    },
    {
      "type": "p",
      "text": "They walked hand in hand toward Avenue B, their steps falling into a shared cadence. As they passed the dark storefronts and the flickering streetlamps, the music from a distant club—the distorted, feedback-heavy wail of a guitar—seemed to pull them closer. They were electrified with a frequency they had never felt before, a shared excitement that finally matched the future’s promise."
    },
    {
      "type": "p",
      "text": "In that moment, standing near the edge of a millennium that was preparing to disappear, they didn't care about the outcome of the election or the speed of the disk drives. They only cared about the signal they had found in each other. They were radios tuned to the same station, playing the same song."
    },
    {
      "type": "p",
      "text": "The weeks that followed those first martinis at The Copperhead were a slow, rhythmic clearing of the noise. 1992 continued its frantic, distorted march outside. The headlines shifted from the Republican National Convention to the escalating hum of the computer age, but for Elijah and Hannah, the city’s whirr had begun to fade away into a shared peacefulness."
    },
    {
      "type": "p",
      "text": "They spent their evenings in the spaces where the light was honest. One Sunday, they trekked over to the West Side to walk a stretch of the High Line. In 1992, it wasn’t a park; it was a rusted, skeletal viaduct, an abandoned garden of steel and waist-high weeds that smelled of creosote and wild sumac. They climbed a chain-link fence near Gansevoort Street and walked north, looking out over a Hudson River that reflected the afternoon sun in jagged, oily fractals."
    },
    {
      "type": "p",
      "text": "\"Look at the shadows under the cross-beams,\" Hannah said, pointing to the geometry of the steel above them. She wasn't looking at the rust; she was tracking the way the light was being sliced by the structure. \"To most people, that’s just a dark spot. But look at the edge. There’s a bleed of deep magenta where the sun hits the iron oxide. It’s like the bridge is leaking its own history.\""
    },
    {
      "type": "p",
      "text": "Elijah leaned against a rusted railing, his eyes following her finger. He didn't see the magenta at first, but he saw the conviction in her posture. He saw the way she stood—balanced and focused, like a hunting dog tracking a duck, waiting for someone to fire."
    },
    {
      "type": "p",
      "text": "\"I see the pattern,\" Elijah said. \"It’s like the way a capital flow moves through a stagnant market. You think it’s just one big movement of money, but it’s actually thousands of tiny bleeds—discrepancies in the bid-ask spread that most people are too slow to notice. I spent my Thursday watching the yield on the ten-year note, and I realized the entire bond market was tilting in a way that didn't match the news cycle. It was a lie, Hannah. A beautiful, systemic lie.\""
    },
    {
      "type": "p",
      "text": "\"Does it ever stop?\" Hannah asked, her hair catching the wind off the river. \"The seeing? Do you ever just see a dollar bill as a dollar, or a sunset as a sunset?\""
    },
    {
      "type": "p",
      "text": "\"Not since I was a kid,\" Elijah admitted. \"My father used to take me to the office on Saturdays. He’d give me a ledger and a pencil, and he’d tell me to find the mistakes. He thought he was teaching me accounting. He didn't realize he was teaching me to see the ghost in the machine. What about you? When did the light start talking to you?\""
    },
    {
      "type": "p",
      "text": "Hannah sat on a piece of timber, her boots dangling over the edge of the viaduct. \"I was six. My mother took me to the World’s Fair site in Queens—the Unisphere. It was a grey day, the kind where the sky looks like a wet sheet. But I saw the light hitting the stainless steel of the globe, and I realized it wasn't grey at all. It was a thousand different shades of silver and electric blue. I told my mother the world was on fire, and she tried to give me an aspirin. She thought I had a fever. She didn't understand that the world is always on fire, Elijah. Most people just have very thick heads.\" She rapped a knuckle against her temple."
    },
    {
      "type": "p",
      "text": "They walked for hours, their steps falling into a shared cadence that seemed to defy the inconsistent vibrancy of the city’s noise, its creatures, its habits. They talked about the things that felt heavy that year—the fear of the loose nukes in the old Soviet bloc and the strange, visceral tension of the LA riots they’d watched on the grainy news feeds. They shared the specific anxieties of their generation—the hope that the “peace dividend” would actually mean something for once, and the lurking fear that like most beautiful promises, when the harsh light of reality shone upon it, it’d fall apart."
    },
    {
      "type": "p",
      "text": "\"I have this dream,\" Hannah said as the sun began to dip behind the New Jersey skyline, turning the Hudson into a sheet of hammered copper. \"I want to design a stage that isn't a stage. I want to create a space where the light and the actors are the same thing. No lamps, no gels—just illuminating resonance. A design so perfect that the audience doesn't even know they're looking at a performance. They just think they’ve finally woken up.\""
    },
    {
      "type": "p",
      "text": "\"I think I’m trying to do the same thing with the data,\" Elijah said. \"I want to build a system that is perfect. No latency. No noise. Just the absolute truth of the exchange running faster than the speed of thought.\""
    },
    {
      "type": "p",
      "text": "He looked at her then, the amber light of the setting sun catching the symmetry of her face. \"I thought about your name again today. Hannah. It doesn't matter which way you look at it—it’s always the same. It’s a closed circle of meaning.\""
    },
    {
      "type": "p",
      "text": "Hannah smiled, reaching out to take his hand. Her palm was warm, the skin slightly rough from the tools of her trade. \"Maybe that’s why I like the lights, Elijah. They’re circular. They show the details we want to see.\""
    },
    {
      "type": "p",
      "text": "By late September, the city’s heat had finally broken, replaced by a crisp, electric chill that made the Alphabet City air feel like it had been scrubbed clean. The music coming out of Seattle was still pulsing out of the tenement windows, but the distortion didn't feel violent anymore; it was a chorus they were singing together."
    },
    {
      "type": "p",
      "text": "The night they finally ended up in Hannah's loft, the city was unusually quiet. The loft was a sprawling, drafty space near the river, lit by a collection of mismatched antique lamps that Hannah had salvaged from theater dumpsters. The light was soft and honest, the kind of amber glow that Elijah had spent his life searching for in the green-tinted dark of the firm."
    },
    {
      "type": "p",
      "text": "They stood by the window, looking out at the skyline. The \"buzz\" of the city was still there—the distant scream of a siren, the low thrum of the traffic—but it felt like it was happening in another dimension."
    },
    {
      "type": "p",
      "text": "\"Do you hear it?\" Hannah whispered, her forehead resting against his."
    },
    {
      "type": "p",
      "text": "\"The ballast?\" Elijah asked."
    },
    {
      "type": "p",
      "text": "\"No,\" she said, her eyes locked on his. \"The silence. The part where the noise stops.\""
    },
    {
      "type": "p",
      "text": "Elijah didn't answer with words. He reached out and traced the line of her jaw, the movement slow and high-fidelity, a bit-perfect handshake that had been weeks in the making. In the quiet of the room, under the warm filaments of the ancient bulbs, the 1992 world finally fell away, leaving only the luminance of their bodies connecting—a signal that was finally incandescent after a lifetime of flickering and buzzing."
    },
    {
      "type": "p",
      "text": "The silence in the loft was a pressurized calm, a rare and heavy relief from the city’s scream. Outside, the night was a dark tapestry of 1992—the distant, rhythmic clatter of the J train crossing the Williamsburg Bridge and the low-frequency hum of a world that was still mostly analogue. Inside, the only light came from a single candle on the floor, its flame a steady, amber signal that didn't flicker."
    },
    {
      "type": "p",
      "text": "The world expanded. The buzz had been replaced by a deep, shared harmony that made the overdriven distortion of the day feel like a discarded skin. The shadow of the candle flame danced against the brick wall, mirroring the symmetry of the name Hannah—a bit-perfect loop—while the air held the violet-edges of the dark, a high-resolution secret vibrating in the silence."
    },
    {
      "type": "p",
      "text": "Then, something changed: a relentless descent, a dive that followed the realized joy of the room inward. It moved past skin and hair wrapped up together, deeper than the scent of stage-smoke and martinis, into the humid architecture of the interior."
    },
    {
      "type": "p",
      "text": "The biological machine was already in mid-execution."
    },
    {
      "type": "p",
      "text": "Inside the lightless void of the body, a frantic frenzy had begun—the ultimate high-frequency trade. Millions of spermatozoa, simple vessels of blind intent, were launched into the dark. They were billions of individual letters sent without a return address, a biological imperative that didn't know where the recipient lived, only that the recipient existed and must be reached at all costs. Life itself depended on it."
    },
    {
      "type": "p",
      "text": "The terrain was alien and hostile, a landscape of fluid and fire that demanded insurmountable effort for every nanometer of progress. There was no memory here of the 1990s or the anxieties of the trading floor, or of the city outside and the universe beyond it; there was only the draw of the target, a chemical siren song pulling signals through the dark."
    },
    {
      "type": "p",
      "text": "It was a race of absolute attrition. Millions of letters were lost along the journey. Some stalled in the thick currents; others were consumed by the environment itself. It was a winner-takes-all execution where the spread was existence. Only the fastest, the most resilient, the luckiest, and the most perfectly focused remained in the race."
    },
    {
      "type": "p",
      "text": "The competition was violent in its simplicity. Thousands were reduced to hundreds, then dozens, until a final few were left struggling against the outer wall of the singular, waiting egg—the one scarce resource in a universe of abundance. They were like traders shouting into the pit, each trying to clear the deal before the window closed."
    },
    {
      "type": "p",
      "text": "A single signal found the interface. A single letter reached its destination."
    },
    {
      "type": "p",
      "text": "At the exact moment of collision, the microscopic dark was obliterated. A small, solitary spark of electricity flashed—a burst of zinc-fueled energy that illuminated the microscopic void. To the two people in the loft, it was a silent, unnoticeable event that they wouldn’t be aware of for some weeks ahead. But in the smallness of the universe they’d created between themselves, it was as simple as light being spoken from darkness."
    },
    {
      "type": "p",
      "text": "The spark was not an isolated event. It was a recurring frequency, a rhythmic explosion of light that happened millions of times a day across the planet and the galaxy beyond. It flashed in a dark, cold cave thirty thousand years in the past as two lovers huddled together for warmth. It flashed in the silk-draped chambers of a Renaissance palace. It flashed in the mud-walled huts of the Mongolian steppe and in the back of a wagon crossing a dusty prairie. It was a golden chain of electrical pulses holding the species together via fire, the constantly intermittent crackling of creation, lighting up the darkness."
    },
    {
      "type": "p",
      "text": "And in this one particular spark, born in a loft in 1992, the code carried a different weight."
    },
    {
      "type": "p",
      "text": "Mixed into the data was the signature of the tetrachromat—the extra cone, the ability to see the curves in the dark and the high-resolution truth of the light. This specific spark didn't just create a child; it hard-coded a biological upgrade. It was the signal that would persist through the centuries, through the information revolutions and the wars."
    },
    {
      "type": "break",
      "text": "The Event Horizon"
    },
    {
      "type": "p",
      "text": "Thousands of years later, the ship Resonance sat frozen at the event horizon, a place where light was constant, but also the only place in the universe where light ends. On the observation decks throughout the ship, the people didn't rely on the data of standard sensors. They used their own biology, amplified by tech that tapped into the latent code of the extra cone. They didn't just see the stars; they saw the deep violet bleeds in the fabric of the universe, curling around a supermassive black hole."
    },
    {
      "type": "p",
      "text": "The black hole was the death of information, the place where the persistence of the signal reached its limit. It was the reverse of the 1992 spark. Where the moment of conception had been an explosion of light in the dark, the black hole was an explosion of dark in the light."
    },
    {
      "type": "p",
      "text": "Kiran stood by the transparent hull of the observation window, his hand resting on the shoulder of his young son, Leo. They weren't using the digital overlays that the rest of the crew relied on. Instead, Kiran had taught Leo to dial back the dampeners on his visor, allowing his own biology to take the lead."
    },
    {
      "type": "p",
      "text": "\"Don't look at where the light is brightest,\" Kiran whispered, his voice low in the pressurized silence of the deck. \"Look at the edges. Look for the bleed.\""
    },
    {
      "type": "p",
      "text": "Leo leaned closer to the glass. To a standard eye, the view was a terrifying void—a massive, lightless sphere of absolute gravity that seemed to be swallowing the stars. But through their eyes, the edges were alive. Leo gasped as he saw it: the deep, jagged violet waves slowly pulsing in the fabric of the universe where the light was being stretched and twisted by the singularity. He saw colors that had no names in the ship's technical manuals—vibrant, burning oranges and bruising purples that rolled with rhythmic frequency."
    },
    {
      "type": "p",
      "text": "\"It looks like it’s in pain,\" Leo said, his voice trembling."
    },
    {
      "type": "p",
      "text": "\"It’s the distortion,\" Kiran explained, his eyes fixed on a curve of light being bent into a perfect, glowing halo around the dark center. \"That’s the event horizon. It’s the place where the math breaks down and the signal ends. Everything we are, everything we’ve ever been, reaches its limit right there. It’s the ultimate silence.\""
    },
    {
      "type": "p",
      "text": "Inside the ship, the amber filaments of the resonance heaters hummed with a soft, steady glow—a deliberate echo of the ancient bulbs Elijah and Hannah had sat beneath in a basement bar on Seventh Street, of the Sun these humans left behind thousands of years ago. Kiran looked at the warmth reflecting in his son’s eyes and felt the persistence of the signal. They were the descendants of the makers and the strangers, the ones who had refused to accept the hands they’d been dealt."
    },
    {
      "type": "p",
      "text": "\"How do we know where to go if the light dies?\" Leo asked."
    },
    {
      "type": "p",
      "text": "Kiran squeezed his son’s shoulder. \"Because we don't just see the light, Leo. We see the curvature. We see the way the dark is shaped. Even when the signal is stretched thin, the pattern remains. We are the ones who hear the sounds and see the colors in the void.\""
    },
    {
      "type": "p",
      "text": "The light died at the horizon, but Kiran still felt optimistic. In the quiet warmth of the ship, father and son stood as a tiny, defiant flash moving across the cold darkness of the universe, refusing to be lost to the entropy of the dark."
    }
  ],
  "circle": [
    {
      "type": "p",
      "text": "Ana’s sledge was still stuck in the marsh."
    },
    {
      "type": "p",
      "text": "The Ljubljana mud was a patient, ancient predator. It didn't strike with the sudden violence of a mountain cat; it simply held. It was a slow-moving solid that demanded a tithe of bone and breath for every grunt of progress, gripping the ash-wood runners with indifferent force. It smelled of rotted sedge, iron-heavy water, and the dank, flat scent of old endings."
    },
    {
      "type": "p",
      "text": "Ana wiped a mixture of sweat and frigid mist from her brow. Her chest heaved against the braided hemp strap, the fiber biting through her tunic and into the soft tissue of her shoulders. She looked back at the platform. Pyotr lay bundled in deer hide, his face a pale moon against the dark, matted furs."
    },
    {
      "type": "p",
      "text": "Only two summers ago, Ana thought, her hand trembling as she reached back to touch his cheek, I could have slung him across my back in a simple wrap. I could have run with him. At seven winters, Pyotr was caught in the between-time of human growth. He had grown long and sturdy, his limbs gaining the density of a young oak, yet he had not reached the age where his spirit could command a broken body. He was too large to carry over this treacherous ground, yet too shattered to help. A week ago, he had been a creature of high-pitched shouts and frantic movement, chasing marsh-hens through the reeds; now, he was a silent, heavy cargo that the earth was trying to claim."
    },
    {
      "type": "p",
      "text": "If you had only five winters, I would carry you until my heart stopped, she thought, the heat from his fever radiating through the furs like embers buried in ash from last night’s fire. If you were ten, you would find a branch and hop beside me. But you are seven. You are exactly the weight of my failure."
    },
    {
      "type": "p",
      "text": "The sun was a bruised orange, dipping toward a horizon that offered no comfort. In the marsh, light was not a gift; it was a dwindling resource. Ana knew the healer’s hut sat on the rising ground where the pines began—the Hard Earth—but it was hours of peat and suction away. She dared not leave Pyotr, for fear he would go into the next world alone, and Urdjo would not return until the hunt and the binding ceremonies of the village young were done. Just eight summers past, she and Urdjo had been bound to each other, and when they had lain together after the feast, she thought it was a moment that would stretch into the rest of her life. She smiled and released a quick, snorting laugh. No, Ana, you fool, it has lasted until this marsh and this boy who is not ready to join the gods. Urdjo, my love, if only you were here to help me save this boy."
    },
    {
      "type": "p",
      "text": "She turned and braced her shoulder against the rear upright of the sledge, digging her toes into the submerged, slick roots of the marsh-grass. She pushed until the world went grey at the edges and her vision pulsed with the rhythm of her heart. The sledge groaned, the wood shrieking as the vacuum of the mud momentarily broke, only to settle back with a wet, gulping suck."
    },
    {
      "type": "p",
      "text": "Ana fell back against a fallen oak trunk, her breath coming in jagged, burning gasps. Her hip, injured during the spring move when a pack-elk had panicked in the high passes, sent a white-hot spike of pain up her spine."
    },
    {
      "type": "p",
      "text": "I am a tool that has snapped, she realized. My strength is a broken cord."
    },
    {
      "type": "p",
      "text": "She looked at the sledge. It was a flat thing, a legacy of the high country snows. Here, it was a joke played on her by the gods. It presented too much of its surface to the earth, inviting the marsh to take them both."
    },
    {
      "type": "p",
      "text": "Nearby, the massive oak she leaned against lay half-submerged. It had been stripped of its bark by seasons of ice, leaving the heartwood smooth and silvered like the skin of a deep-water fish. As Ana shifted her weight, the corner of the sledge’s runner pressed into the side of the log."
    },
    {
      "type": "p",
      "text": "The log rolled."
    },
    {
      "type": "p",
      "text": "It did not fight the mud. It did not scream. It simply turned on its own center, pushing a small curl of black water ahead of it with an indifferent grace."
    },
    {
      "type": "p",
      "text": "Ana froze. Her eyes, narrowed and sharp, tracked the movement. She saw the way the curved surface of the wood moved over the ground without dragging against it."
    },
    {
      "type": "p",
      "text": "The log does not argue with the earth, she thought. It walks across it."
    },
    {
      "type": "p",
      "text": "She reached out and pushed the log with her hand. It moved with a fluidity that mocked her exhaustion. A thought began to form—not a word, but a necessity taking shape. She looked at the birch rollers left by the axe men further up the bank. They were straight and uniform, stripped of their branches."
    },
    {
      "type": "p",
      "text": "What if the ground didn't touch the sledge? she wondered. What if the sledge rode upon the backs of the rolling trees?"
    },
    {
      "type": "p",
      "text": "She stood up, her hip screaming, and began to drag the smaller birch logs toward the front of her trapped sledge. She wedged the first under the front of the runners using a branch as a lever."
    },
    {
      "type": "p",
      "text": "Walk, pull, reset, she told herself."
    },
    {
      "type": "p",
      "text": "She took the hemp strap and leaned. The sledge surged. For three long, glorious paces, the mud was silenced. The birch rollers turned in the muck, and Pyotr didn't jostle; he floated. But then, the first log rolled out from the back. The second followed. The third stayed under the center for a moment longer before the sledge nose-dived back into the peat and Pyotr groaned."
    },
    {
      "type": "p",
      "text": "Ana stood trembling, looking back at the logs sitting behind her."
    },
    {
      "type": "p",
      "text": "I am the sledge, she thought. I am the thing that is stuck while the world moves past me."
    },
    {
      "type": "p",
      "text": "She thought of the hunters and the young ones who had left at first light, moving in straight lines toward the horizon. They did not look back at the friction. She thought of the younger women foraging for a husband in the high meadows as they waited for the men to return from the hunt for the feast, and the grandmothers whose knees had turned to grinding stones."
    },
    {
      "type": "p",
      "text": "My whole life is the walk back, she realized."
    },
    {
      "type": "p",
      "text": "Every day was a sequence of moving a log forward, watching the tribe progress over her effort, and then walking back into the mud to pick up the pieces they had left behind. She was the one who was never allowed to travel; she was forced to stay in the same spot, only providing the small utility that she could perform. If I walk back to get those logs now, Pyotr will be colder by the time I return. The logs must stay with the sledge. They cannot be a separate thing. It must be bound to the wood."
    },
    {
      "type": "p",
      "text": "She knelt in the muck, ignoring the wet seeping into her tunic and the mud squelching between her toes. She picked up a straight piece of mountain ash and held it against the side of the sledge’s frame. In her mind, she saw the log not as the body of a tree, but as circles waiting to be freed with the stroke of her adze."
    },
    {
      "type": "p",
      "text": "If the log cannot leave, it must turn. And if it turns while it is held, the sled will never have to touch the earth again."
    },
    {
      "type": "p",
      "text": "She reached for her stone adze. It was a heavy, blackened tool, the edge honed by hours of patient grinding against river-silt. She began to hack at the birch round. The thud-thud-thud of the stone against the green wood echoed across the silent marsh—a steady, rhythmic heartbeat. She freed two circles from the thing that used to be part of a tree."
    },
    {
      "type": "p",
      "text": "She had to be precise. If the hole was not at the heart of the wood, the sledge would limp, rising and falling like a wounded animal. Pyotr could not survive a limp. She used the tip of her copper-alloy awl and a heavy pounding-stone to create the hole, then widened it with the adze, charcoal-burning the interior to make the wood brittle enough to scrape. The smell of charred birch rose in the cold air, sweet and acrid."
    },
    {
      "type": "p",
      "text": "Is this what it feels like to be a god? she wondered, her muscles screaming as she twisted the ash-branch axle into the first birch wheel. To take the world apart and put it back together? To transform the body of a tree into saving my son’s life?"
    },
    {
      "type": "p",
      "text": "She carved notches into the frame of the sledge to cradle the axle, joining the moving part to the stationary part. She cut strips off the deer-hide blanket wrapped around Pyotr, soaked in the marsh water so they would shrink and tighten as they dried, binding the axle to the underside of the frame. By the time the first set was fixed, her fingers were aching and raw."
    },
    {
      "type": "p",
      "text": "She stood up and pushed the empty end of the sledge. The circles turned. They didn't just roll; they made a sound like the drums her tribe would play around a fire. A low, wooden hum that vibrated through the frame and into Ana’s hands."
    },
    {
      "type": "p",
      "text": "\"Pyotr,\" she breathed. He didn't answer, but his heart still beat—a faint, rapid drumming."
    },
    {
      "type": "p",
      "text": "She lifted the front of the sledge. For a moment, she held the full weight of her world—the wood, the furs, and the fading life of her son—entirely in her own muscle. Then, she leaned forward."
    },
    {
      "type": "p",
      "text": "The back of the sledge did not drag."
    },
    {
      "type": "p",
      "text": "There was a terrifying smoothness to the movement, and Ana worried that it was like a smooth rock in a river, seeming safe but hiding the risk of a slippery fall and broken body. The birch wheels, bound to the ash axle, turned as one. The resistance she had spent her life fighting simply dissolved. She wasn't buried in the mud anymore like a river rock; she was skimming across it like a stone."
    },
    {
      "type": "p",
      "text": "She looked back over her shoulder. In the silver moonlight, the tracks were not wide, wounded gashes. They were two thin, clean lines, continuous footsteps without any footprints. She was leaving the draw of the marsh behind as movement stayed with her."
    },
    {
      "type": "p",
      "text": "She moved toward the rising ground, a tiny spark of heat and intent moving across a cold, dark interface. Every rotation of the wooden wheels was a bridge being built, a road laid across the skin of a planet that had, until this moment, demanded a sacrifice from every living thing."
    },
    {
      "type": "p",
      "text": "She reached the Hard Earth. The wheels hummed louder on the firmer soil, a steady vibration that seemed to pulse in time with the boy's breathing. She didn't stop to thank the gods for the miracle. She didn't care that she had changed her tribe’s future and the course of human history."
    },
    {
      "type": "p",
      "text": "She only cared that the healer’s fire was visible through the trees."
    },
    {
      "type": "p",
      "text": "\"We are here, Pyotr,\" she whispered, her voice lost in the rhythmic, beautiful turning of the wood. \"The ground has let you go.\""
    }
  ]
};

function minutes(blocks: PersistChapterBlock[]): number {
  const words = blocks.reduce((n, b) => n + b.text.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 230));
}

export const PERSIST_CHAPTERS: PersistChapter[] = [
  {
    slug: 'circle',
    title: 'Circle',
    label: 'From the novel',
    era: 'The Ljubljana Marshes · Thousands of years ago',
    dek: 'A mother drags her feverish son through a freezing marsh toward the healer. Her sledge is stuck. What she builds to save him is the wheel.',
    readingMinutes: minutes(BLOCKS.circle),
    relatedTrackSlug: 'circle',
    blocks: BLOCKS.circle,
  },
];

export function getPersistChapter(slug: string): PersistChapter | undefined {
  return PERSIST_CHAPTERS.find((c) => c.slug === slug);
}

export function getPersistChapterByTrack(trackSlug: string): PersistChapter | undefined {
  return PERSIST_CHAPTERS.find((c) => c.relatedTrackSlug === trackSlug);
}
