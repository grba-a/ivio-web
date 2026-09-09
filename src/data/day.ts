export type Hour = 'dawn' | 'morning' | 'noon' | 'deep' | 'dusk';

export type Scene = {
  id: string;
  time: string;
  /** Short label for the day bar. Must survive 390px. */
  label: string;
  title: string;
  body: string;
  facts: string[];
  hour: Hour;
  /** Written per scene. The same five words five times reads as a template. */
  cta: string;
  /** Promoted from the copy: one big figure per scene, so the five stop
   *  looking like one object repeated. */
  figure: { value: string; unit?: string; caption: string };
  ask: string;
  media:
    | { kind: 'photo';lead: string; support?: string[] }
    | { kind: 'video'; lead: string; support?: string[] }
    | { kind: 'route'; route: 'airport' | 'oldtown' };
};

export const SCENES: Scene[] = [
  {
    id: 'airport',
    time: '06:40',
    label: 'Airport',
    title: 'You land at Čilipi.',
    body: "The airport sits ten minutes from where I keep the boat. That isn't a sales line — it's the reason one person can carry the rest of this day. No transfer company, no handover, no stranger holding a card with your name spelled wrong.",
    facts: ['Any flight, any hour', 'Dubrovnik · Cavtat · Župa · Mlini', 'Split, Kotor and Mostar too'],
    cta: 'Tell me when you land',
    figure: { value: '10', unit: 'min', caption: 'from the runway to where the boat is kept' },
    hour: 'dawn',
    ask: "Hi Ivio — I need an airport transfer.\n\nFlight number: \nLanding: \nHow many of us: \nGoing to: ",
    media: { kind: 'route', route: 'airport' },
  },
  {
    id: 'oldtown',
    time: '08:15',
    label: 'Old Town',
    title: 'The city, before the ships.',
    body: "Cruise ships unload around ten. The walls open at eight. That two-hour gap is the whole tour — the same stone, a tenth of the people. I'll walk you down Stradun while they're still washing it, and point out the two or three things everybody walks straight past.",
    facts: ['2–3 hours on foot', 'Walls, Stradun, the lanes above', 'Start early. That is the trick.'],
    cta: 'Ask about the early walk',
    figure: { value: '2', unit: 'h', caption: 'of the city before the ships arrive' },
    hour: 'morning',
    ask: "Hi Ivio — we would like the Old Town walk.\n\nDates we are in Dubrovnik: \nHow many of us: ",
    media: { kind: 'route', route: 'oldtown' },
  },
  {
    id: 'boat',
    time: '11:30',
    label: 'Boat',
    title: 'Out.',
    body: "Twenty minutes off the coast the noise is gone. The Elaphiti are close enough that you don't lose half a day getting there, and empty enough that most afternoons we have a bay to ourselves. There's no fixed route. Flat sea, we go further. Rough sea, I know where it's calm.",
    facts: ['Half day or full day', 'Private — your group only', 'Koločep · Lopud · Šipan'],
    cta: 'Ask about a day on the water',
    figure: { value: '20', unit: 'min', caption: 'to open sea, and the noise is gone' },
    hour: 'noon',
    ask: "Hi Ivio — we are interested in a day on the boat.\n\nDates: \nHow many of us: \nHalf day or full day: ",
    media: { kind: 'photo', lead: 'helm-open-sea', support: ['boat-alone-blue', 'shore-boats-mountains'] },
  },
  {
    id: 'sea',
    time: '14:00',
    label: 'Under',
    title: 'Under.',
    body: "The Blue Cave on Koločep only does its trick between eleven and two, when the sun drops under the lip and the whole chamber lights up from below. Outside that window it's a cave. Inside it, it's the photograph you keep. Masks are on board. If you've never put your face in the water before — most people haven't.",
    facts: ['Blue Cave, Betina, coves with no name', 'Masks and floats included', 'Timed to the light, not the clock'],
    cta: 'Ask about the caves',
    figure: { value: '11–14', caption: 'the only hours the Blue Cave lights up' },
    hour: 'deep',
    ask: "Hi Ivio — we would love to do the caves and the snorkelling.\n\nDates: \nHow many of us: \nAny non-swimmers or children: ",
    media: { kind: 'video', lead: 'cave-glide', support: ['bluecave-guests', 'freediver-cave'] },
  },
  {
    id: 'sunset',
    time: '19:50',
    label: 'Sunset',
    title: 'Last light.',
    body: "We cut the engine somewhere off the islands and let it happen. It takes about forty minutes and nobody talks much. This is usually the part people message me about afterwards.",
    facts: ['About two hours', 'Timed to the real sunset — it moves all summer', 'Bring something to drink'],
    cta: 'Ask about the sunset trip',
    figure: { value: '40', unit: 'min', caption: 'and nobody talks much' },
    hour: 'dusk',
    ask: "Hi Ivio — we would like the sunset trip.\n\nDates: \nHow many of us: ",
    media: {
      kind: 'photo',
      lead: 'sunset-sun-horizon',
      support: ['sunset-wake', 'sunset-from-boat', 'sunset-boat-silhouette'],
    },
  },
];
