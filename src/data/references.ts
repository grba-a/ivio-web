/**
 * Real messages guests sent Ivio after their day, quoted verbatim.
 * Nothing here is written by us. Do not add an entry without a source.
 *
 * Charlie's message also mentioned a EUR 60 tip. Cut deliberately: it sets a
 * price expectation for the next guest and publishes someone's private payment.
 */
export type Reference = {
  id: string;
  from: string;
  origin: string;
  body: string;
  weight?: 'lead';
};

export const REFERENCES: Reference[] = [
  {
    id: 'frank',
    from: 'Frank',
    origin: 'after a boat trip',
    body: 'Thanks for the great tour today. I gave your contact to Philip and Sarah. Maybe they will send you a message to do an exciting boat trip.',
    weight: 'lead',
  },
  {
    id: 'charlie',
    from: 'Charlie',
    origin: 'after a boat trip',
    body: 'I just wanted to say a huge thank you, we had an amazing day and your energy and knowledge of Cavtat and the surrounding areas made the boat trip so much more special. Hopefully see you next time where you can teach us how to Scuba dive!',
  },
  // Third message is held back until attribution is confirmed - it was addressed
  // to "Ivan", not to Ivio, so we cannot yet say truthfully who is speaking.
];
