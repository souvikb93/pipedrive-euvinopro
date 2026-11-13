// Calendars for the scheduling view. One data model feeds the timeline, the free-time row, the conflict check and the suggestions.
// Prototype data: Wednesday 11 November 2026 has fixed demo calendars (Schlumberger scenario); other days use day patterns
// picked by name and date, so the same person and day always look the same.

export type EventStatus = 'busy' | 'tentative' | 'pending';

export interface CalEvent {
  /** Minutes from midnight. */
  start: number;
  end: number;
  title: string;
  /** `busy` confirmed, `tentative` maybe, `pending` details not yet known. All three block a slot. */
  status: EventStatus;
}

export interface Participant {
  id: string;
  name: string;
  photo?: string;
  /** `team` is a EuvinoPRO user; `contact` is a person at the organisation. */
  kind: 'team' | 'contact';
  /** The signed-in user, owner of the activity. */
  you?: boolean;
}

export interface Slot { day: string; start: number; end: number }

/** Visible hours of the timeline. */
export const DAY_START = 8 * 60;
export const DAY_END = 18 * 60;
export const STEP = 30;
/** Working hours: outside them a person counts as unavailable. */
export const WORK_START = 8 * 60 + 30;
export const WORK_END = 17 * 60 + 30;

export const TEAM: Participant[] = [
  { id: 'jf', name: 'Johannes Finzer', kind: 'team', you: true },
  { id: 'me', name: 'Maximilian Eul', kind: 'team' },
  { id: 'lh', name: 'Lena Hoffmann', kind: 'team' },
];

export const DEMO_DAY = '2026-11-11';
const DEMO: Record<string, CalEvent[]> = {
  'Johannes Finzer': [
    { start: 600, end: 660, title: 'Team Sync', status: 'busy' },
    { start: 900, end: 990, title: 'Projekt-Review', status: 'busy' },
  ],
  'Maximilian Eul': [
    { start: 510, end: 600, title: 'Kunden-Call', status: 'busy' },
    { start: 750, end: 810, title: '1:1', status: 'pending' },
    { start: 930, end: 990, title: 'Vertrieb Update', status: 'busy' },
  ],
  'Andrea Poguntke': [
    { start: 540, end: 630, title: 'Fokuszeit', status: 'tentative' },
    { start: 690, end: 750, title: 'Workshop', status: 'busy' },
    { start: 990, end: 1050, title: 'Kunden-Call', status: 'busy' },
  ],
};

const PATTERNS: CalEvent[][] = [
  [{ start: 540, end: 600, title: 'Kundentermin', status: 'busy' }, { start: 720, end: 780, title: 'Mittagspause', status: 'busy' }, { start: 900, end: 960, title: 'Team-Meeting', status: 'tentative' }],
  [{ start: 540, end: 630, title: 'Messevorbereitung', status: 'busy' }, { start: 690, end: 750, title: 'Mittagspause', status: 'busy' }, { start: 840, end: 870, title: 'Telefonat', status: 'pending' }, { start: 990, end: 1020, title: 'Weinprobe', status: 'busy' }],
  [{ start: 600, end: 660, title: 'Jour fixe', status: 'busy' }, { start: 780, end: 840, title: 'Mittagspause', status: 'busy' }, { start: 960, end: 1020, title: 'Abstimmung Marketing', status: 'tentative' }],
  [{ start: 630, end: 690, title: 'Lieferantengespräch', status: 'busy' }, { start: 720, end: 750, title: 'Mittagspause', status: 'busy' }, { start: 870, end: 960, title: 'Workshop', status: 'busy' }],
];

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7);
export const dateOf = (iso: string) => new Date(`${iso}T00:00`);
export const isoOf = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const isWeekend = (iso: string) => [0, 6].includes(dateOf(iso).getDay());
export const addDays = (iso: string, n: number) => { const d = dateOf(iso); return isoOf(new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)); };
/** Next or previous weekday. */
export const stepWorkday = (iso: string, dir: 1 | -1) => { let d = addDays(iso, dir); while (isWeekend(d)) d = addDays(d, dir); return d; };
/** Monday of the week that holds `iso`. */
export const mondayOf = (iso: string) => { const wd = (dateOf(iso).getDay() + 6) % 7; return addDays(iso, -wd); };

/** Calendar entries of one person on one day. Weekends are empty. */
export function eventsFor(p: Participant, iso: string): CalEvent[] {
  if (isWeekend(iso)) return [];
  if (iso === DEMO_DAY && DEMO[p.name]) return DEMO[p.name];
  const d = dateOf(iso);
  const dayOfYear = Math.round((d.getTime() - new Date(d.getFullYear(), 0, 1).getTime()) / 86400000);
  return PATTERNS[(hash(p.name) + dayOfYear) % PATTERNS.length];
}

const overlaps = (a: number, b: number, e: { start: number; end: number }) => a < e.end && b > e.start;

/** Entries of `p` that overlap the range. Tentative and pending entries count: they are not confirmed free. */
export const clashesFor = (p: Participant, iso: string, start: number, end: number) => eventsFor(p, iso).filter((e) => overlaps(start, end, e));

/** True when `p` can attend: inside working hours, on a weekday, with nothing in the calendar. */
export function isFree(p: Participant, iso: string, start: number, end: number): boolean {
  return !isWeekend(iso) && start >= WORK_START && end <= WORK_END && clashesFor(p, iso, start, end).length === 0;
}

export const allFree = (people: Participant[], s: Slot) => people.every((p) => isFree(p, s.day, s.start, s.end));
/** People who cannot attend the slot. */
export const blockedPeople = (people: Participant[], s: Slot) => people.filter((p) => !isFree(p, s.day, s.start, s.end));

/** Ranges on `iso` when everyone is free, merged, on the STEP grid. */
export function commonFree(people: Participant[], iso: string): Array<{ start: number; end: number }> {
  const out: Array<{ start: number; end: number }> = [];
  for (let t = DAY_START; t < DAY_END; t += STEP) {
    if (!people.every((p) => isFree(p, iso, t, t + STEP))) continue;
    const last = out[out.length - 1];
    if (last && last.end === t) last.end = t + STEP; else out.push({ start: t, end: t + STEP });
  }
  return out;
}

/**
 * Every slot of `duration` on `iso` that is free for everyone, best first.
 * Ranking: starts on the full hour first (easier to remember and to join), then closest to `reference` (the time asked for).
 */
export function rankedSlots(people: Participant[], iso: string, duration: number, reference: number): Slot[] {
  const out: Slot[] = [];
  for (let t = WORK_START; t + duration <= WORK_END; t += STEP) {
    const s = { day: iso, start: t, end: t + duration };
    if (allFree(people, s)) out.push(s);
  }
  return out.sort((a, b) => (Number(a.start % 60 !== 0) - Number(b.start % 60 !== 0)) || (Math.abs(a.start - reference) - Math.abs(b.start - reference)) || (a.start - b.start));
}

/** First weekday after `iso` (within two weeks) that has a free slot for everyone. */
export function nextFreeDay(people: Participant[], iso: string, duration: number): string | null {
  let d = iso;
  for (let i = 0; i < 14; i += 1) {
    d = stepWorkday(d, 1);
    if (rankedSlots(people, d, duration, WORK_START).length) return d;
  }
  return null;
}

export const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
export const range = (s: { start: number; end: number }) => `${hm(s.start)}–${hm(s.end)}`;
const WEEKDAYS = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
const WEEKDAYS_LONG = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const MONTHS_SHORT = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
/** "Mi, 11. Nov. 2026". */
export const shortDay = (iso: string) => { const d = dateOf(iso); return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}`; };
/** "Mi, 11. Nov.". */
export const chipDay = (iso: string) => { const d = dateOf(iso); return `${WEEKDAYS[d.getDay()]}, ${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]}`; };
/** "Mittwoch, 11. November 2026". */
export const longDay = (iso: string) => { const d = dateOf(iso); return `${WEEKDAYS_LONG[d.getDay()]}, ${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`; };
/** "Mo 9.". */
export const weekdayShort = (iso: string) => { const d = dateOf(iso); return `${WEEKDAYS[d.getDay()]} ${d.getDate()}.`; };
export const STATUS_LABEL: Record<EventStatus, string> = { busy: 'Beschäftigt', tentative: 'Vorläufig', pending: 'Details ausstehend' };
