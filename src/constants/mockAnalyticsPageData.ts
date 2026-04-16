/** Mock analytics for the dedicated Analytics screen (replace with API later). */

export type AnalyticsPeriod = 'day' | 'week' | 'month';

export type TapPoint = {
  label: string;
  value: number;
};

export type AnalyticsPeriodBundle = {
  totalTaps: number;
  /** vs previous period of the same length */
  changePct: number;
  changeDirection: 'up' | 'down';
  rangeLabel: string;
  primarySeries: TapPoint[];
  peakLabel: string;
  peakValue: number;
  avgLabel: string;
  avgValue: string;
  secondaryTitle: string;
  secondarySeries: TapPoint[];
};

const HOURS_24: TapPoint[] = [
  { label: '12a', value: 0 },
  { label: '1a', value: 0 },
  { label: '2a', value: 1 },
  { label: '3a', value: 0 },
  { label: '4a', value: 1 },
  { label: '5a', value: 2 },
  { label: '6a', value: 4 },
  { label: '7a', value: 6 },
  { label: '8a', value: 9 },
  { label: '9a', value: 12 },
  { label: '10a', value: 11 },
  { label: '11a', value: 8 },
  { label: '12p', value: 7 },
  { label: '1p', value: 9 },
  { label: '2p', value: 10 },
  { label: '3p', value: 8 },
  { label: '4p', value: 6 },
  { label: '5p', value: 7 },
  { label: '6p', value: 5 },
  { label: '7p', value: 4 },
  { label: '8p', value: 3 },
  { label: '9p', value: 2 },
  { label: '10p', value: 1 },
  { label: '11p', value: 0 },
];

const WEEK_DAYS: TapPoint[] = [
  { label: 'Mon', value: 38 },
  { label: 'Tue', value: 44 },
  { label: 'Wed', value: 52 },
  { label: 'Thu', value: 41 },
  { label: 'Fri', value: 58 },
  { label: 'Sat', value: 49 },
  { label: 'Sun', value: 30 },
];

function monthDailyPoints(): TapPoint[] {
  const days = 30;
  const out: TapPoint[] = [];
  for (let d = 1; d <= days; d++) {
    const wave = 25 + Math.round(12 * Math.sin((d / days) * Math.PI * 2)) + ((d * 7) % 13);
    out.push({ label: `${d}`, value: Math.max(8, wave) });
  }
  return out;
}

const MONTH_DAILY = monthDailyPoints();

const SECONDARY_14: TapPoint[] = [
  { label: '1', value: 18 },
  { label: '2', value: 22 },
  { label: '3', value: 20 },
  { label: '4', value: 28 },
  { label: '5', value: 24 },
  { label: '6', value: 31 },
  { label: '7', value: 27 },
  { label: '8', value: 35 },
  { label: '9', value: 32 },
  { label: '10', value: 38 },
  { label: '11', value: 36 },
  { label: '12', value: 41 },
  { label: '13', value: 39 },
  { label: '14', value: 44 },
];

export const MOCK_ANALYTICS_BY_PERIOD: Record<AnalyticsPeriod, AnalyticsPeriodBundle> = {
  day: {
    totalTaps: HOURS_24.reduce((s, p) => s + p.value, 0),
    changePct: 14,
    changeDirection: 'up',
    rangeLabel: 'Last 24 hours',
    primarySeries: HOURS_24,
    peakLabel: 'Busiest hour',
    peakValue: 12,
    avgLabel: 'Per active hour',
    avgValue: '3.3 taps',
    secondaryTitle: 'Prior 14 days (daily totals)',
    secondarySeries: SECONDARY_14,
  },
  week: {
    totalTaps: WEEK_DAYS.reduce((s, p) => s + p.value, 0),
    changePct: 6,
    changeDirection: 'up',
    rangeLabel: 'Last 7 days',
    primarySeries: WEEK_DAYS,
    peakLabel: 'Busiest day',
    peakValue: 58,
    avgLabel: 'Daily average',
    avgValue: '45 taps',
    secondaryTitle: 'Week-over-week (mock)',
    secondarySeries: [
      { label: 'W1', value: 268 },
      { label: 'W2', value: 285 },
      { label: 'W3', value: 302 },
      { label: 'W4', value: 312 },
    ],
  },
  month: {
    totalTaps: MONTH_DAILY.reduce((s, p) => s + p.value, 0),
    changePct: 3,
    changeDirection: 'down',
    rangeLabel: 'Last 30 days',
    primarySeries: MONTH_DAILY,
    peakLabel: 'Best single day',
    peakValue: Math.max(...MONTH_DAILY.map((p) => p.value)),
    avgLabel: 'Daily average',
    avgValue: `${Math.round(MONTH_DAILY.reduce((s, p) => s + p.value, 0) / 30)} taps`,
    secondaryTitle: 'Taps by week (this month)',
    secondarySeries: [
      { label: 'W1', value: 312 },
      { label: 'W2', value: 298 },
      { label: 'W3', value: 341 },
      { label: 'W4', value: 329 },
    ],
  },
};
