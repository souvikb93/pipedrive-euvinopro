import * as React from 'react';
import {
  InlineList,
  AvailabilityTimeline,
  StatusSummary,
  PersonChip,
  Badge,
  Button,
  Combobox,
  DatePicker,
  FieldAction,
  Icon,
  Menu,
  Stack,
  Text,
} from '@euvino/ds';
import {
  DAY_END,
  DAY_START,
  WORK_END,
  WORK_START,
  addDays,
  commonFree,
  eventsFor,
  hm,
  longDay,
  mondayOf,
  range,
  shortDay,
  stepWorkday,
  weekdayShort,
  type Participant,
  type Slot,
} from '../../data/availability';
import type { Scheduling } from './useScheduling';
import { durationLabel, parseDuration, parseTime } from '../../lib/time';

const names = (list: Participant[]) =>
  list
    .map((p) => p.name)
    .join(', ')
    .replace(/, ([^,]*)$/, ' und $1');
const TIMES = Array.from({ length: (DAY_END - DAY_START) / 15 + 1 }, (_, i) => DAY_START + i * 15);
const DURATIONS = [15, 30, 45, 60, 90, 120];

/** Two free slots for everyone, never the chosen one and never side by side, so each reads as its own option. */
export function suggestionsFor(s: Scheduling): Slot[] {
  return s.ranked
    .filter((x) => !(x.day === s.sel.day && x.start === s.sel.start))
    .reduce<Slot[]>(
      (acc, x) => (acc.length < 2 && acc.every((y) => y.day !== x.day || x.end < y.start || x.start > y.end) ? [...acc, x] : acc),
      [],
    );
}

export interface ScheduleBodyProps {
  s: Scheduling;
  /** Everyone who can be added: the team and the organisation's contacts. */
  candidates: Participant[];
  /** Prefix for heading ids, so two of these can live on one page. */
  idPrefix: string;
  /** Shown first, such as the title field when planning. */
  before?: React.ReactNode;
  /** Set after a save attempt on a time that clashes. */
  saveError?: boolean;
  /** Date, start, end and duration as form fields (planning), instead of the read-only summary (rescheduling). */
  editable?: boolean;
}

/**
 * Time summary, participants and shared availability for one Termin. Date and time are not form fields: they change in the
 * calendar (a click on free time, a suggestion, the day arrows). Used by the reschedule modal and the inline planner.
 */
export function ScheduleBody({ s, candidates, idPrefix, before, saveError, editable = false }: ScheduleBodyProps) {
  const durations = DURATIONS.includes(s.duration) ? DURATIONS : [...DURATIONS, s.duration].sort((a, b) => a - b);
  const [view, setView] = React.useState<'day' | 'week'>('day');
  const days = view === 'day' ? [s.sel.day] : Array.from({ length: 5 }, (_, i) => addDays(mondayOf(s.sel.day), i));
  const moved = !!s.requested && (s.requested.day !== s.sel.day || s.requested.start !== s.sel.start);
  const conflict = s.requested && s.requestedBlocked.length && moved ? s.requested : null;
  const suggestions = suggestionsFor(s);
  const addable = candidates.filter((c) => !s.people.some((p) => p.id === c.id));

  let note = '';
  if (!s.valid)
    note = `${names(s.blocked)} ${s.blocked.length > 1 ? 'sind' : 'ist'} zu dieser Zeit beschäftigt. ${suggestions.length ? 'Wählen Sie eine grün markierte freie Zeit im Kalender.' : ''}${saveError ? ' Speichern ist erst mit einer freien Zeit möglich.' : ''}`;
  else if (conflict) note = `Verschoben von ${range(conflict)}. Alle Teilnehmer sind frei.`;
  else note = 'Alle Teilnehmer sind zu dieser Zeit frei.';

  return (
    <Stack gap="6">
      {before}
      {editable ? (
        <Stack gap="2">
          <div className="sched-fields">
            <DatePicker
              label="Datum"
              locale="de-DE"
              placeholder="TT.MM.JJJJ"
              calendarLabel="Kalender öffnen"
              value={s.sel.day}
              onChange={s.setDay}
            />
            <Combobox
              label="Beginn"
              toggleLabel="Uhrzeiten anzeigen"
              value={String(s.sel.start)}
              format={(v) => hm(Number(v))}
              parse={(t) => {
                const v = parseTime(t);
                return v !== undefined && v < DAY_END ? String(v) : undefined;
              }}
              onChange={(v) => s.setStart(Number(v))}
              options={TIMES.slice(0, -1).map((t) => ({ value: String(t), label: hm(t) }))}
            />
            <Combobox
              label="Ende"
              toggleLabel="Uhrzeiten anzeigen"
              value={String(s.sel.end)}
              format={(v) => hm(Number(v))}
              parse={(t) => {
                const v = parseTime(t);
                return v !== undefined && v > s.sel.start ? String(v) : undefined;
              }}
              onChange={(v) => s.setEnd(Number(v))}
              options={TIMES.filter((t) => t > s.sel.start).map((t) => ({ value: String(t), label: hm(t) }))}
            />
            <Combobox
              label="Dauer"
              toggleLabel="Dauer auswählen"
              value={String(s.duration)}
              format={(v) => durationLabel(Number(v))}
              parse={(t) => {
                const v = parseDuration(t);
                return v !== undefined && s.sel.start + v <= DAY_END ? String(v) : undefined;
              }}
              onChange={(v) => s.setDuration(Number(v))}
              options={durations.map((d) => ({ value: String(d), label: durationLabel(d) }))}
            />
          </div>
          <Text as="div" variant="caption" tone={s.valid ? 'success' : 'error'} aria-live="polite">
            <Stack direction="horizontal" gap="2" align="center">
              <Icon name={s.valid ? 'check-circle' : 'warning-triangle'} size="sm" />
              {note}
            </Stack>
          </Text>
        </Stack>
      ) : (
        <StatusSummary
          icon={s.valid ? 'calendar' : 'warning-triangle'}
          tone={s.valid ? 'default' : 'error'}
          title={
            <>
              <InlineList
                items={[
                  shortDay(s.sel.day),
                  range(s.sel),
                  <Text as="span" variant="body-small" tone="muted">
                    {durationLabel(s.duration)}
                  </Text>,
                ]}
              />
            </>
          }
          description={note}
          trailing={
            s.valid ? null : (
              <Badge size="small" status="error" icon="warning-triangle">
                Konflikt
              </Badge>
            )
          }
        />
      )}

      <Stack as="section" gap="2" aria-labelledby={`${idPrefix}-people`}>
        <Text
          as="h3"
          id={`${idPrefix}-people`}
          variant={editable ? 'caption-medium' : 'card-title'}
        >{`Teilnehmer (${s.people.length})`}</Text>
        <Stack direction="horizontal" gap="2" align="center" wrap>
          {s.people.map((p) => (
            <PersonChip
              key={p.id}
              name={p.name}
              photo={p.photo}
              suffix={p.you ? '(Sie)' : undefined}
              onRemove={p.you ? undefined : () => s.setPeople(s.people.filter((x) => x.id !== p.id))}
              removeLabel={`${p.name} entfernen`}
            />
          ))}
          {addable.length ? (
            <Menu
              label="Teilnehmer hinzufügen"
              trigger={<FieldAction>Hinzufügen</FieldAction>}
              items={addable.map((c) => ({
                label: c.kind === 'team' ? `${c.name} (Team)` : c.name,
                icon: c.kind === 'team' ? ('user' as const) : ('user-circle' as const),
                onSelect: () => s.setPeople([...s.people, c]),
              }))}
            />
          ) : null}
        </Stack>
      </Stack>

      <Stack as="section" gap="2" aria-labelledby={`${idPrefix}-availability`}>
        <Text as="h3" id={`${idPrefix}-availability`} variant={editable ? 'caption-medium' : 'card-title'}>
          Verfügbarkeit
        </Text>
        <AvailabilityTimeline
          title={view === 'day' ? longDay(s.sel.day) : `Woche ${weekdayShort(days[0])} – ${weekdayShort(days[days.length - 1])}`}
          onPrevious={() => s.setDay(view === 'day' ? stepWorkday(s.sel.day, -1) : addDays(s.sel.day, -7))}
          onNext={() => s.setDay(view === 'day' ? stepWorkday(s.sel.day, 1) : addDays(s.sel.day, 7))}
          view={{
            label: 'Ansicht',
            value: view,
            onChange: (v) => setView(v as 'day' | 'week'),
            options: [
              { value: 'day', label: 'Tag' },
              { value: 'week', label: 'Woche' },
            ],
          }}
          columns={days.map((d) => ({ id: d, label: weekdayShort(d) }))}
          rows={s.people.map((p) => ({
            id: p.id,
            name: p.you ? `${p.name} (Sie)` : p.name,
            photo: p.photo,
            events: Object.fromEntries(days.map((d) => [d, eventsFor(p, d)])),
          }))}
          free={days.flatMap((d) => commonFree(s.people, d).map((f) => ({ column: d, ...f })))}
          selection={{ column: s.sel.day, start: s.sel.start, end: s.sel.end, valid: s.valid }}
          planned={conflict ? { column: conflict.day, start: conflict.start, end: conflict.end } : null}
          onPick={(col, start) => {
            if (view === 'week') {
              s.setDay(col);
              setView('day');
              return;
            }
            s.pickAt(col, start);
          }}
          hours={{ start: DAY_START, end: DAY_END }}
          workHours={{ start: WORK_START, end: WORK_END }}
          legend={['free', 'busy', 'tentative']}
          labels={{
            all: 'Alle Teilnehmer',
            allHint: 'Gemeinsame Verfügbarkeit',
            selected: 'Ausgewählt',
            conflict: 'Konflikt',
            planned: 'Geplant',
            free: 'Für alle frei',
            busy: 'Belegt',
            tentative: 'Vorläufig',
            pending: 'Details ausstehend',
            previous: view === 'day' ? 'Vorheriger Tag' : 'Vorherige Woche',
            next: view === 'day' ? 'Nächster Tag' : 'Nächste Woche',
            legend: 'Legende',
          }}
        />
        {!s.ranked.length && s.freeDay ? (
          <Stack direction="horizontal" gap="2" align="center">
            <Text as="span" variant="caption" tone="muted">
              An diesem Tag ist niemand gemeinsam frei.
            </Text>
            <Button variant="tertiary" size="small" onClick={() => s.setDay(s.freeDay as string)}>{`Zum ${shortDay(s.freeDay)}`}</Button>
          </Stack>
        ) : null}
      </Stack>
    </Stack>
  );
}
