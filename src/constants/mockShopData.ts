import { SUPPORT_EMAIL } from '@/src/constants/legalLinks';

export type MockShopReview = {
  id: string;
  name: string;
  title: string;
  body: string;
  dateLabel: string;
};

export const MOCK_SHOP_REVIEWS: MockShopReview[] = [
  {
    id: 'r1',
    name: 'Jordan M.',
    title: 'Flawless at events',
    body: 'Ordered three for our team — setup took minutes and taps have been rock solid.',
    dateLabel: '2 weeks ago',
  },
  {
    id: 'r2',
    name: 'Priya S.',
    title: 'Looks sharp, works every time',
    body: 'The matte black card feels premium. People actually comment on it when I hand it over.',
    dateLabel: '1 month ago',
  },
  {
    id: 'r3',
    name: 'Chris L.',
    title: 'Great support',
    body: 'Had a shipping hiccup; one email and they sorted it same day. Replacements policy is real.',
    dateLabel: '3 weeks ago',
  },
  {
    id: 'r4',
    name: 'Alex R.',
    title: 'Bulk order for our studio',
    body: 'We used the business form for a quote — quick response and fair pricing on volume.',
    dateLabel: '6 weeks ago',
  },
  {
    id: 'r5',
    name: 'Sam K.',
    title: 'Worth every penny',
    body: 'Gift wrap looked great and the card scans instantly on every phone I have tried.',
    dateLabel: '4 days ago',
  },
];

export const SHOP_BULK_EMAIL = SUPPORT_EMAIL;
