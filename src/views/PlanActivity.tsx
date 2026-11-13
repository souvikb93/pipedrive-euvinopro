import * as React from 'react';
import { Button, Divider, Input, Stack } from '@euvino/ds';
import type { FocusActivity } from '../data/history';
import { addDays, allFree, isWeekend, rankedSlots, type Participant } from '../data/availability';
import { ScheduleBody } from './scheduling/ScheduleBody';
import { useScheduling } from './scheduling/useScheduling';

export interface PlanActivityProps {
  /** First day to look at, usually the next working day. */
  from: string;
  participants: Participant[];
  candidates: Participant[];
  onCancel: () => void;
  onPlan: (activity: FocusActivity, participants: Participant[]) => void;
}

/** Plan a new Termin inside the composer card (only meetings are scheduled against participants' calendars): participants are preset and the best common free slot is already selected. */
export function PlanActivity({ from, participants, candidates, onCancel, onPlan }: PlanActivityProps) {
  let day = from;
  while (isWeekend(day)) day = addDays(day, 1);
  // Opens on the best common slot: on the hour, as close to 09:00 as possible.
  const best = rankedSlots(participants, day, 30, 9 * 60)[0] ?? { day, start: 9 * 60, end: 9 * 60 + 30 };
  const s = useScheduling({ day: best.day, start: best.start, end: best.end, people: participants });
  const [title, setTitle] = React.useState('');
  const [titleError, setTitleError] = React.useState<string | undefined>(undefined);
  const [saveError, setSaveError] = React.useState(false);
  const titleRef = React.useRef<HTMLInputElement>(null);

  const plan = () => {
    if (!title.trim()) {
      setTitleError('Geben Sie einen Titel ein.');
      titleRef.current?.focus();
      return;
    }
    if (!allFree(s.people, s.sel)) {
      setSaveError(true);
      return;
    }
    onPlan(
      {
        kind: 'activity',
        type: 'Termin',
        title: title.trim(),
        day: s.sel.day,
        start: s.sel.start,
        end: s.sel.end,
        assignee: s.people.find((p) => p.you)?.name ?? '',
      },
      s.people,
    );
  };

  return (
    <Stack gap="6">
      <ScheduleBody
        s={s}
        candidates={candidates}
        saveError={saveError}
        idPrefix="plan-activity"
        editable
        before={
          <Input
            ref={titleRef}
            label="Titel"
            placeholder="z. B. Jahresgespräch 2027 vorbereiten"
            value={title}
            error={titleError}
            onChange={(e) => {
              setTitle(e.target.value);
              if (titleError) setTitleError(undefined);
            }}
          />
        }
      />
      <Divider />
      <Stack direction="horizontal" gap="2" justify="end">
        <Button variant="secondary" onClick={onCancel}>
          Abbrechen
        </Button>
        <Button variant="primary" onClick={plan}>
          Einladung senden
        </Button>
      </Stack>
    </Stack>
  );
}
