export type MockPortfolioItem = {
  id: string;
  label: string;
  tone: 'dark' | 'image';
  /** Opens the link-in-bio builder (live); other tiles are sample ideas. */
  opensLinkBuilder?: boolean;
};

export const MOCK_PORTFOLIO_ITEMS: MockPortfolioItem[] = [
  { id: 'p1', label: 'Your link page', tone: 'dark', opensLinkBuilder: true },
  { id: 'p2', label: 'Product showcase', tone: 'image' },
  { id: 'p3', label: 'Case study hub', tone: 'image' },
];

/** Placeholder analytics until the API is wired. */
export const MOCK_ANALYTICS_SNAPSHOT = {
  cardViews: 1284,
  topLink: 'Calendly · book a call',
  periodLabel: 'Last 30 days',
  byDevice: [
    { label: 'Mobile', pct: 72 },
    { label: 'Desktop', pct: 22 },
    { label: 'Tablet', pct: 6 },
  ] as const,
};

/** Member-submitted stories for the home dashboard (mock / marketing copy). */
export type MockUserStory = {
  id: string;
  quote: string;
  tag: string;
};

export const MOCK_USER_STORIES: MockUserStory[] = [
  {
    id: 'us1',
    quote: 'Got my first job from this card.',
    tag: 'Career',
  },
  {
    id: 'us2',
    quote: "I impressed her with this card - now she's my girlfriend.",
    tag: 'Personal',
  },
  {
    id: 'us3',
    quote:
      'Business owners now see an increase in their customer review counts with this card.',
    tag: 'Reviews',
  },
];

export type MockAccessory = {
  id: string;
  title: string;
  priceLabel: string;
  tag: string;
};

export const MOCK_ACCESSORIES: MockAccessory[] = [
  { id: 'a1', title: 'Matte black card', priceLabel: 'From $24', tag: 'NFC' },
  { id: 'a2', title: 'Metal card holder', priceLabel: '$18', tag: 'Carry' },
  { id: 'a3', title: 'Event lanyard pack', priceLabel: '$12', tag: 'Events' },
  { id: 'a4', title: 'Desk stand (QR + NFC)', priceLabel: '$32', tag: 'Office' },
];
