import { describe, expect, it } from 'vitest';
import { contacts } from '../src/data/contacts';
import { organisations } from '../src/data/organisations';
import { entryDate, entryText, historyFor } from '../src/data/history';
import { inCategory, searchAll } from '../src/data/search';
import { TEAM, commonFree, rankedSlots } from '../src/data/availability';
import { activityKey, slug } from '../src/lib/format';
import { durationLabel, parseDuration, parseTime } from '../src/lib/time';

const peopleOf = (id: string) => {
  const o = organisations.find((x) => x.id === id)!;
  return contacts.filter((c) => c.organisation === o.contactOrg);
};

describe('history', () => {
  it('formats dates as in the cards', () => {
    expect(entryDate('2026-10-28', '10:24')).toBe('28. Okt. 2026, 10:24');
    expect(entryDate('2026-03-02')).toBe('2. März 2026');
  });
  it('builds every organisation history from its own contacts, with an exact recipient count', () => {
    const o = organisations.find((x) => x.id === 'weingut-geil')!;
    const people = peopleOf(o.id);
    const [mail] = historyFor(o, people);
    expect(mail.kind).toBe('email');
    expect(mail.to?.length).toBe(people.length + 1);
    expect(mail.to?.slice(1).map((p) => p.name)).toEqual(people.map((p) => p.name));
    expect(entryText(mail)).toContain(people[0].name);
  });
  it('gives every entry an id that is unique on its page', () => {
    for (const o of organisations) {
      const ids = historyFor(o, peopleOf(o.id)).map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('search', () => {
  it('finds organisations first, then people, and filters by category', () => {
    const hits = searchAll('geil', contacts);
    expect(hits[0].kind).toBe('organisations');
    expect(hits.some((h) => h.kind === 'contacts' && h.title === 'Andreas Geil')).toBe(true);
    expect(inCategory(hits, 'contacts').every((h) => h.kind === 'contacts')).toBe(true);
    expect(searchAll('   ', contacts)).toEqual([]);
  });
});

describe('scheduling', () => {
  it('reads typed times and durations like Teams', () => {
    expect(parseTime('930')).toBe(570);
    expect(parseTime('9:30')).toBe(570);
    expect(parseTime('14 Uhr')).toBe(840);
    expect(parseTime('25:00')).toBeUndefined();
    expect(parseDuration('1,5 Std.')).toBe(90);
    expect(parseDuration('45')).toBe(45);
    expect(parseDuration('1:15')).toBe(75);
    expect(parseDuration('abc')).toBeUndefined();
    expect(durationLabel(90)).toBe('1 Std. 30 Min.');
  });
  it('only suggests slots where everyone is free', () => {
    const people = TEAM.slice(0, 2);
    const day = '2026-11-11';
    const free = commonFree(people, day);
    for (const s of rankedSlots(people, day, 30, 9 * 60).filter((x) => x.day === day)) {
      expect(free.some((f) => s.start >= f.start && s.end <= f.end)).toBe(true);
    }
  });
});

describe('format', () => {
  it('sorts activity dates and makes ids', () => {
    expect(activityKey('11.11.2026 · 09:00') < activityKey('12.11.2026 · 08:00')).toBe(true);
    expect(slug('Weingut Helmut Geil')).toBe('weingut-helmut-geil');
  });
});
