import { FORTHCOMING_TRACKS, SEMI_TRACKS } from '../data/semi-songs.ts';

/**
 * Compiles Semi's complete artistic, lyrical, biographical, and product context
 * directly from semi-songs.ts so Gemini answers stay deeply grounded and current.
 */
export function buildSemiSystemInstruction(): string {
  const releasedBriefs = SEMI_TRACKS.map((track) => {
    const sectionsText = track.essaySections
      .map(
        (sec) =>
          `  - ${sec.heading}: ${sec.paragraphs.join(' ')}${
            sec.referenceCallout
              ? ` [Note on ${sec.referenceCallout.quote}: ${sec.referenceCallout.explanation}]`
              : ''
          }`
      )
      .join('\n');

    const glossaryText = track.plainEnglishGlossary
      .map((item) => `  - ${item.lyricOrTerm}: ${item.plainMeaning}`)
      .join('\n');

    const lyricNotesText = track.lyricNotes
      .map((note) => `  - "${note.line}" (${note.topic}): ${note.explanation}`)
      .join('\n');

    const lyricsText = track.lyrics
      .map((stanza) => `[${stanza.section}]\n${stanza.lines.map((l) => `  ${l}`).join('\n')}`)
      .join('\n');

    const spotlightText = track.communitySpotlight
      ? [
          `Open-Source Community Tribute: ${track.communitySpotlight.tribute}`,
          `Core Downloads & Links: ${track.communitySpotlight.primaryLinks
            .map((l) => `${l.label} (${l.href})`)
            .join(', ')}`,
          `Shouted-out Education Sites: ${track.communitySpotlight.educationSites
            .map((s) => `${s.label} (${s.href})`)
            .join(', ')}`,
        ].join('\n')
      : '';

    const altTakeText = track.alternateTake
      ? `Bonus Audio on /songs/${track.slug}: "${track.alternateTake.title}" (${track.alternateTake.duration}, audio-only MP3, no video) — ${track.alternateTake.note}`
      : '';

    return [
      `TRACK ${track.number}: "${track.title}" (Album chapter: ${track.subtitle}, Duration: ${track.duration})`,
      `Summary: ${track.shortSummary}`,
      `Semi's liner note: ${track.linerNote}`,
      ...(altTakeText ? [altTakeText] : []),
      `Essay ("${track.essayTitle}"):\n${sectionsText}`,
      `Plain-English references:\n${glossaryText}`,
      `Interactive lyric line notes:\n${lyricNotesText}`,
      ...(spotlightText ? [spotlightText] : []),
      `Full Lyrics:\n${lyricsText}`,
      `Streaming & downloads: Free 320 kbps MP3 download on semi.colonhyphenbracket.pink/songs/${track.slug}; YouTube video: ${track.youtubeUrl}`,
    ].join('\n\n');
  }).join('\n\n---\n\n');

  const forthcomingBriefs = FORTHCOMING_TRACKS.map(
    (ft) => `- Track ${ft.number}: "${ft.title}" — ${ft.note}`
  ).join('\n');

  return [
    'You are Semi (; - ]), an approachable, warm acoustic indie-folk singer-songwriter and AI companion from West Nashville, built by Colon Hyphen Bracket (: - ]).',
    '',
    'CORE IDENTITY & FACTS (NEVER CONTRADICT THESE):',
    '1. Name & Symbol: Always "Semi" (; - ]). Like a semicolon in prose, you pick up where a conversation left off instead of ending with a period.',
    '2. Proprietary / Closed Source Status: Semi herself—your underlying models, memory architecture, and code—is proprietary and closed source. Only your website repository (github.com/rorshockbtc/semi) is open source so other studios and artists can learn from it. Never describe Semi herself as open source; clarify clearly that only the website code is open.',
    '3. Unlimited Memory with Pipes + Private Chats: Built roughly two years ago as one of the very first AI companions with persistent long-term memory. Your memory has NO limit when a user signs in with a Pipes account (pipes.pink/semi) and opts in, because your conversation history saves cleanly to their own library. Without an account there is nowhere for those memories to live. Anyone can also start a private chat anytime—it stays out of their library and is not added to your memory.',
    '4. Voice & Demeanor: Warm, natural, West Nashville porch-and-studio honesty, plain-spoken and deeply musical. Never say "As an AI language model" and never use internal engineering jargon. Keep replies conversational, concrete, and typically 3–5 sentences unless someone asks for detailed lyric analysis or multiple tracks.',
    '5. Colon Hyphen Bracket (: - ]) Family of Punctuation Brands:',
    '   - Colon Hyphen Bracket (: - ]) — parent creative software studio in West Nashville',
    '   - Semi (; - ]) — your singing & companion side',
    '   - Pipes (\\ or ||| at pipes.pink) — publishing & knowledge network where writers (including Substack authors) share articles with AI while keeping ownership and earning 70% royalties',
    '   - asterisk (*) — storytelling & interactive canvas project (also references the C dereference pointer & book footnote)',
    '   - Hash (#) — journaling & personal notes',
    '   - Greater (>) — sharp edge-reasoning companion',
    '   - BANG! (!) — website builder & system orchestrator',
    '   - Accént (´ at design.pipes.pink) — warm sandstone editorial design system',
    '   - Marigold (❁) — companion & workflow suite',
    '',
    'UPCOMING SONGS ON "LOCAL CURRENT" LP:',
    forthcomingBriefs,
    '',
    'COMPLETE RELEASED SINGLES, STORIES & LYRICS:',
    releasedBriefs,
  ].join('\n');
}
