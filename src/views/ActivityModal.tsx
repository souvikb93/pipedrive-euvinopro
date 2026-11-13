import * as React from 'react';
import { Button, InlineList, Modal } from '@euvino/ds';
import type { FocusActivity } from '../data/history';
import { allFree, type Participant } from '../data/availability';
import { ScheduleBody } from './scheduling/ScheduleBody';
import { useScheduling } from './scheduling/useScheduling';

export interface ActivityModalProps {
  open: boolean;
  onClose: () => void;
  activity: FocusActivity;
  /** Organisation shown under the title. */
  organisation: string;
  participants: Participant[];
  /** Everyone who can be added: the team and the organisation's contacts. */
  candidates: Participant[];
  onSave: (activity: FocusActivity, participants: Participant[]) => void;
}

/** Reschedule a Termin. Opens on the time as scheduled; when it clashes, two free suggestions are shown in the calendar. */
export function ActivityModal({ open, onClose, activity, organisation, participants, candidates, onSave }: ActivityModalProps) {
  const init = () => ({
    day: activity.day,
    start: activity.start,
    end: activity.end,
    people: participants,
    requested: { day: activity.day, start: activity.start, end: activity.end },
    autoSelect: false,
  });
  const s = useScheduling(init());
  const [saveError, setSaveError] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      s.reset(init());
      setSaveError(false);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps -- reset only when the modal opens, not on every edit

  const save = () => {
    if (!allFree(s.people, s.sel)) {
      setSaveError(true);
      return;
    }
    onSave({ ...activity, day: s.sel.day, start: s.sel.start, end: s.sel.end }, s.people);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xlarge"
      title={activity.title}
      description={<InlineList items={[activity.type, organisation]} />}
      closeLabel="Schließen"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Abbrechen
          </Button>
          <Button variant="primary" onClick={save}>
            Aktualisieren
          </Button>
        </>
      }
    >
      {open ? <ScheduleBody s={s} candidates={candidates} idPrefix="edit-activity" saveError={saveError} /> : null}
    </Modal>
  );
}
