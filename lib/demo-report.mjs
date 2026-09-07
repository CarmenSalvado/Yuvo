export const DEMO_IDEA = "An episodic cozy mystery about a young woman who can speak to abandoned buildings. Buildings remember fragments of events that occurred inside them, but their memories are incomplete.";

export const DEMO_REPORT = {
  idea: DEMO_IDEA,
  demo: true,
  partial: false,
  researchedAt: "2026-09-01T10:00:00.000Z",
  overview: "The premise sits at a useful intersection: cozy investigation, place-memory, and unreliable supernatural testimony. The surrounding territory is familiar enough to signal genre quickly, while the building-as-witness mechanic creates room to make clue gathering feel materially different.",
  queries: ["supernatural cozy mystery novels", "sentient house fiction", "buildings remember fiction", "cozy mystery reader complaints", "supernatural mystery rule consistency", "cozy mystery romance criticism"],
  clusters: [
    { name: "Supernatural cozy mystery", relevance: "closest", summary: "Amateur detection, contained danger, and paranormal access form the clearest genre neighborhood.", sourceIds: [1, 2] },
    { name: "Memory-bearing places", relevance: "closest", summary: "Locations that retain emotional or historical residue move setting from backdrop to witness.", sourceIds: [3] },
    { name: "Unreliable witnesses", relevance: "nearby", summary: "Fragmentary testimony supports fair-play puzzles when its limits are legible to the audience.", sourceIds: [4] },
    { name: "Genius loci", relevance: "nearby", summary: "Stories that give places agency establish a broad precedent without matching the investigative mechanic directly.", sourceIds: [3] },
    { name: "Environmental storytelling", relevance: "adjacent", summary: "Narratives that reveal history through spaces offer a visual grammar for dramatizing a building's recollections.", sourceIds: [5] },
  ],
  saturated: [
    { pattern: "A paranormal helper who supplies exposition", why: "The supernatural element often becomes a convenient information channel instead of a source of dramatic resistance.", sourceIds: [2, 3] },
    { pattern: "Charm-first small-town mystery", why: "Cozy conventions frequently rely on quaint community texture, amateur sleuthing, and low on-page violence.", sourceIds: [1, 2] },
    { pattern: "Romance as the automatic long arc", why: "Romantic subplots are a frequent companion to cozy mystery series even when the central hook promises another engine.", sourceIds: [1] },
  ],
  frictions: [
    { signal: "Rules bend when the plot needs an answer", detail: "A supernatural investigation loses tension when powers acquire convenient new capabilities at the reveal.", sourceIds: [3, 4] },
    { signal: "The central hook fades after the pilot", detail: "High-concept mechanics disappoint when later mysteries could function unchanged without them.", sourceIds: [2] },
    { signal: "The audience cannot solve along", detail: "Mystery satisfaction drops when decisive supernatural clues arrive too late or cannot be interpreted in advance.", sourceIds: [4] },
    { signal: "Atmosphere crowds out consequence", detail: "A gentle tone can still carry emotional stakes; comfort alone is not a substitute for a consequential reveal.", sourceIds: [1, 2] },
  ],
  whitespace: [
    { title: "Make memory loss the mystery engine", familiar: "A supernatural witness", crowded: "Ghosts that deliver clean exposition", friction: "Convenient powers and unsolvable reveals", opportunity: "Each building remembers only through material traces—sound in pipes, heat in brick, pressure in floors—and every mystery publishes those limits early.", why: "This keeps the paranormal hook central while turning its constraint into fair-play clue design.", move: "Write a five-rule building-memory card and make episode one solvable using only those rules.", sourceIds: [3, 4] },
    { title: "Let preservation create conflict", familiar: "A beloved recurring town", crowded: "Static quaint settings", friction: "Atmosphere without consequence", opportunity: "Every solved case changes whether a building is restored, repurposed, or demolished, making the mystery alter the physical world of the series.", why: "The research points to setting as comfort; giving locations irreversible stakes turns that familiarity into momentum.", move: "Tie the first victim, suspect, and final choice to three competing futures for the same property.", sourceIds: [1, 5] },
    { title: "Replace romance-first with civic intimacy", familiar: "A warm ensemble", crowded: "The expected slow-burn couple", friction: "The core premise becoming secondary", opportunity: "Build the long arc around the heroine earning trust from residents and neglected places whose versions of local history conflict.", why: "Community warmth remains, but the relationship engine now reinforces the premise instead of competing with it.", move: "Give each recurring character a different belief about which buildings deserve to be remembered.", sourceIds: [1, 2, 3] },
  ],
  sources: [
    { id: 1, title: "Cozy mystery", url: "https://en.wikipedia.org/wiki/Cozy_mystery", excerpts: ["A concise overview of recurring cozy mystery conventions."], publishDate: null },
    { id: 2, title: "The rise and rise of cosy crime", url: "https://www.theguardian.com/books/2023/jan/26/murder-mystery-books-cosy-crime-fiction", excerpts: ["Discussion of the appeal, conventions, and renewed popularity of cozy crime."], publishDate: "2023-01-26" },
    { id: 3, title: "Genius Loci", url: "https://tvtropes.org/pmwiki/pmwiki.php/Main/GeniusLoci", excerpts: ["Examples and patterns for locations portrayed with consciousness or agency."], publishDate: null },
    { id: 4, title: "Unreliable narrator", url: "https://en.wikipedia.org/wiki/Unreliable_narrator", excerpts: ["Background on testimony whose credibility or completeness is compromised."], publishDate: null },
    { id: 5, title: "Environmental storytelling", url: "https://en.wikipedia.org/wiki/Environmental_storytelling", excerpts: ["How spaces and objects communicate narrative information."], publishDate: null },
  ],
};
