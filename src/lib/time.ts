import { DAY_END, DAY_START } from '../data/availability';

// Reading typed times and durations in the planner, as Teams and Outlook do.

export const snap = (m: number) => Math.round(m / 5) * 5;
/** Reads 9, 930, 9:30, 9.30 or 14 Uhr as minutes after midnight, kept inside the visible day. */
export const parseTime = (text: string) => {
  const t = text.toLowerCase().replace(/uhr/g, '').trim();
  const m = /^(\d{1,2})(?:[:.,h ]?(\d{2}))?$/.exec(t);
  if (!m) return undefined;
  const h = Number(m[1]);
  const min = Number(m[2] ?? 0);
  if (h > 23 || min > 59) return undefined;
  const v = snap(h * 60 + min);
  return v >= DAY_START && v <= DAY_END ? v : undefined;
};
/** Reads 45, 45 Min., 1:30, 1,5 Std. or 2 h as minutes; between 5 minutes and 8 hours. */
export const parseDuration = (text: string) => {
  const t = text.toLowerCase().replace(/\s+/g, ' ').trim();
  let v: number | undefined;
  const hm2 = /^(\d{1,2}):(\d{2})$/.exec(t);
  const hours = /^(\d+(?:[.,]\d+)?) ?(?:h|std\.?|stunden?)(?: ?(\d+) ?(?:m|min\.?|minuten)?)?$/.exec(t);
  const mins = /^(\d+) ?(?:m|min\.?|minuten)?$/.exec(t);
  if (hm2) v = Number(hm2[1]) * 60 + Number(hm2[2]);
  else if (hours) v = Number(hours[1].replace(',', '.')) * 60 + Number(hours[2] ?? 0);
  else if (mins) v = Number(mins[1]);
  if (v === undefined) return undefined;
  v = snap(v);
  return v >= 5 && v <= 480 ? v : undefined;
};
export const durationLabel = (m: number) =>
  m < 60 ? `${m} Min.` : m % 60 ? `${Math.floor(m / 60)} Std. ${m % 60} Min.` : `${m / 60} Std.`;
