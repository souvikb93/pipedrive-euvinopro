import * as React from 'react';
import { WORK_START, allFree, blockedPeople, nextFreeDay, rankedSlots, type Participant, type Slot } from '../../data/availability';

export interface SchedulingInit {
  day: string;
  start: number;
  end: number;
  people: Participant[];
  /** The time that was asked for. Kept as a conflict reference when it does not work for everyone. */
  requested?: Slot | null;
  /** Pick the best free slot when the given time clashes. Off: open on the given time and let people choose. Defaults to true. */
  autoSelect?: boolean;
}

/**
 * One source of truth for date, time, duration and participants. Selection, suggestions and conflicts are all derived from it,
 * so the form fields, the chips and the timeline can never disagree.
 *
 * Rules: a selection that works for everyone is kept. When a constraint changes (participants, date, duration) and the selection
 * no longer works, the best free slot of that day is picked. A start or slot chosen by hand is kept even when it clashes;
 * it is then shown as a conflict and cannot be saved.
 */
export function useScheduling(init: SchedulingInit) {
  const [people, setPeopleState] = React.useState(init.people);
  const [requested, setRequested] = React.useState<Slot | null>(init.requested ?? null);
  const [reference, setReference] = React.useState(init.requested?.start ?? WORK_START + 30);
  const [sel, setSel] = React.useState<Slot>({ day: init.day, start: init.start, end: init.end });
  const [auto, setAuto] = React.useState(false);

  const resolve = React.useCallback((next: Slot, list: Participant[], ref: number): { slot: Slot; auto: boolean } => {
    if (allFree(list, next)) return { slot: next, auto: false };
    const best = rankedSlots(list, next.day, next.end - next.start, ref)[0];
    return best ? { slot: best, auto: true } : { slot: next, auto: false };
  }, []);

  const apply = (r: { slot: Slot; auto: boolean }) => {
    setSel(r.slot);
    setAuto(r.auto);
  };

  /** Starts over from new data, such as when a modal opens. */
  const reset = React.useCallback(
    (i: SchedulingInit) => {
      const ref = i.requested?.start ?? WORK_START + 30;
      setPeopleState(i.people);
      setRequested(i.requested ?? null);
      setReference(ref);
      const given = { day: i.day, start: i.start, end: i.end };
      const r = i.autoSelect === false ? { slot: given, auto: false } : resolve(given, i.people, ref);
      setSel(r.slot);
      setAuto(r.auto);
    },
    [resolve],
  );

  React.useEffect(() => {
    reset(init);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- set up once on mount; later changes go through reset()

  const duration = sel.end - sel.start;
  const ranked = React.useMemo(() => rankedSlots(people, sel.day, duration, reference), [people, sel.day, duration, reference]);
  const valid = allFree(people, sel);
  const blocked = valid ? [] : blockedPeople(people, sel);
  const requestedBlocked = requested ? blockedPeople(people, requested) : [];
  const freeDay = ranked.length ? null : nextFreeDay(people, sel.day, duration);

  return {
    people,
    sel,
    duration,
    requested,
    requestedBlocked,
    auto,
    ranked,
    valid,
    blocked,
    freeDay,
    reset,
    setDay: (day: string) => apply(resolve({ day, start: sel.start, end: sel.start + duration }, people, reference)),
    setDuration: (d: number) => apply(resolve({ ...sel, end: sel.start + d }, people, reference)),
    setEnd: (end: number) => apply(resolve({ ...sel, end }, people, reference)),
    /** By hand: kept as chosen. */
    setStart: (start: number) => {
      setSel({ ...sel, start, end: start + duration });
      setAuto(false);
      setReference(start);
    },
    pick: (s: Slot) => {
      setSel(s);
      setAuto(false);
    },
    pickAt: (day: string, start: number) => {
      setSel({ day, start, end: start + duration });
      setAuto(false);
      setReference(start);
    },
    setPeople: (list: Participant[]) => {
      setPeopleState(list);
      apply(resolve(sel, list, reference));
    },
  };
}

export type Scheduling = ReturnType<typeof useScheduling>;
