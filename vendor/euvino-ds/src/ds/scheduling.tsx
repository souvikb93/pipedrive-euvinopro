import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Avatar } from './display';
import { SegmentedControl, type SegmentOption } from './button';

// ---- DateNav

export interface DateNavProps {
  /** The date or range shown, such as "Mittwoch, 11. November 2026". */
  label: string;
  onPrevious: () => void;
  onNext: () => void;
  /** Accessible names of the arrows, in the page's language. */
  previousLabel?: string;
  nextLabel?: string;
}

/** A date between two bare chevrons that step back and forward. The chevrons have no box; their colour changes on hover. */
export function DateNav({ label, onPrevious, onNext, previousLabel = 'Previous', nextLabel = 'Next' }: DateNavProps) {
  return (
    <div className="eu-datenav">
      <button type="button" className="eu-datenav__btn" aria-label={previousLabel} onClick={onPrevious}><Icon name="nav-left" size="sm" /></button>
      <span className="eu-datenav__label eu-type-body-small" aria-live="polite">{label}</span>
      <button type="button" className="eu-datenav__btn" aria-label={nextLabel} onClick={onNext}><Icon name="nav-right" size="sm" /></button>
    </div>
  );
}

// ---- ActivityCard

export interface ActivityCardRow {
  icon: IconName;
  content: React.ReactNode;
}

export interface ActivityCardProps {
  /** Activity title. The whole card opens it. */
  title: string;
  /** Type under the title, such as "Termin". */
  type?: string;
  /** Short facts with an icon each, such as date and participants. Links inside stay their own targets. */
  rows?: ActivityCardRow[];
  /** Opens the activity. */
  onOpen: () => void;
}

/**
 * The next activity as one click target with an accent stroke, such as in a Fokus panel.
 * The title is the button and stretches over the card, so links in `rows` keep working on top.
 */
export function ActivityCard({ title, type, rows, onOpen }: ActivityCardProps) {
  return (
    <div className="eu-actcard">
      <div className="eu-actcard__head">
        <h3 className="eu-actcard__title eu-type-ui-card-title"><button type="button" className="eu-actcard__open" onClick={onOpen}>{title}</button></h3>
        {type ? <span className="eu-actcard__type eu-type-body-small">{type}</span> : null}
      </div>
      {rows?.length ? (
        <ul className="eu-actcard__rows eu-type-body-small">
          {rows.map((r, i) => <li key={i}><Icon name={r.icon} size="sm" className="eu-actcard__icon" /><span className="eu-actcard__content">{r.content}</span></li>)}
        </ul>
      ) : null}
    </div>
  );
}

// ---- AvailabilityTimeline

export type AvailabilityStatus = 'busy' | 'tentative' | 'pending';

export interface AvailabilityEvent {
  /** Minutes from midnight. */
  start: number;
  end: number;
  /** `busy` confirmed, `tentative` maybe, `pending` details not known yet. Drawn without a title. */
  status: AvailabilityStatus;
}

export interface AvailabilityRow {
  id: string;
  name: string;
  photo?: string;
  /** Entries per column id. */
  events: Record<string, AvailabilityEvent[]>;
}

export interface AvailabilityRange {
  /** Column id. */
  column: string;
  start: number;
  end: number;
}

export interface AvailabilityTimelineLabels {
  all?: string;
  allHint?: string;
  selected?: string;
  planned?: string;
  /** Legend name of the red fill: the planned time in conflict, or a chosen time someone cannot make. */
  conflict?: string;
  free?: string;
  busy?: string;
  tentative?: string;
  pending?: string;
  previous?: string;
  next?: string;
  legend?: string;
}

export interface AvailabilityTimelineProps {
  /** One column is a day view; several (such as Mon to Fri) a week view. */
  columns: Array<{ id: string; label: string }>;
  rows: AvailabilityRow[];
  /** Time when every row is free. Drawn as a light green fill across all rows. */
  free: AvailabilityRange[];
  /** The chosen slot. `valid: false` (someone is busy) draws it red; otherwise a deep green frame with a check. */
  selection?: AvailabilityRange & { valid: boolean };
  /** The originally planned time after the selection moved away from it, drawn as a red fill. */
  planned?: AvailabilityRange | null;
  /** Called with the column and the start of the clicked step. */
  onPick?: (column: string, start: number) => void;
  /** Header: the date or week, with arrows. */
  title: string;
  onPrevious: () => void;
  onNext: () => void;
  /** Optional view switch on the right, such as Tag and Woche. */
  view?: { value: string; options: SegmentOption[]; onChange: (v: string) => void; label: string };
  /** Visible hours in minutes. Defaults to 08:00 to 18:00. */
  hours?: { start: number; end: number };
  /** Working hours in minutes; outside them is hatched. Defaults to 08:30 to 17:30. */
  workHours?: { start: number; end: number };
  /** Click snapping in minutes. Defaults to 30. */
  step?: number;
  /** Names of the built-in parts, in the page's language. */
  labels?: AvailabilityTimelineLabels;
  /** Fixed legend entries, in order. Defaults to all five. Leave out what explains itself, such as `selected` while planning. */
  legend?: Array<'selected' | 'conflict' | 'free' | 'busy' | 'tentative'>;
}

const LABELS: Required<AvailabilityTimelineLabels> = {
  all: 'All participants', allHint: 'Shared availability', selected: 'Selected', planned: 'Planned', conflict: 'Conflict', free: 'Free for all',
  busy: 'Busy', tentative: 'Tentative', pending: 'Details pending', previous: 'Previous', next: 'Next', legend: 'Legend',
};

const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

/**
 * Shared availability, as in a scheduling assistant: one row per person on one time axis, plus an "all participants" row.
 * Free time for everyone is a green fill, the planned time in conflict a red fill, the chosen slot a green frame.
 * Fills sit behind calendar entries and grid lines, so nothing under them is hidden. Entries show no titles.
 */
export function AvailabilityTimeline({
  columns, rows, free, selection, planned, onPick, title, onPrevious, onNext, view,
  hours = { start: 480, end: 1080 }, workHours = { start: 510, end: 1050 }, step = 30, labels, legend: legendKeys = ['selected', 'conflict', 'free', 'busy', 'tentative'],
}: AvailabilityTimelineProps) {
  const t = { ...LABELS, ...labels };
  const span = hours.end - hours.start;
  const n = columns.length;
  const ids = columns.map((c) => c.id);
  const x = (col: string, m: number) => ((ids.indexOf(col) + (m - hours.start) / span) / n) * 100;
  const w = (a: number, b: number) => ((b - a) / span / n) * 100;
  const place = (col: string, a: number, b: number): React.CSSProperties => ({ left: `${x(col, a)}%`, width: `${w(a, b)}%` });
  const inView = (r?: AvailabilityRange | null): r is AvailabilityRange => !!r && ids.includes(r.column);
  const hourMarks = Array.from({ length: span / 60 + 1 }, (_, i) => hours.start + i * 60);
  const lines = n === 1 ? Array.from({ length: span / step - 1 }, (_, i) => hours.start + (i + 1) * step) : [];

  const pick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onPick) return;
    const r = e.currentTarget.getBoundingClientRect();
    const f = ((e.clientX - r.left) / r.width) * n;
    const col = ids[Math.min(n - 1, Math.floor(f))];
    const m = hours.start + Math.floor(((f % 1) * span) / step) * step;
    onPick(col, Math.min(Math.max(m, hours.start), hours.end - step));
  };

  const offHours = (key: string) => ids.flatMap((c) => [
    <span key={`${key}-${c}-am`} className="eu-avail__off" style={place(c, hours.start, workHours.start)} />,
    <span key={`${key}-${c}-pm`} className="eu-avail__off" style={place(c, workHours.end, hours.end)} />,
  ]);
  const status = (s: AvailabilityStatus) => (s === 'busy' ? t.busy : s === 'tentative' ? t.tentative : t.pending);
  // Fixed legend: the same entries in every state, so it never shifts while people pick a time.
  const LEGEND = { selected: ['selected', t.selected], conflict: ['planned', t.conflict], free: ['free', t.free], busy: ['busy', t.busy], tentative: ['tentative', t.tentative] } as const;
  const legend = legendKeys.map((k) => LEGEND[k]);

  return (
    <div className="eu-avail">
      <div className="eu-avail__head">
        <DateNav label={title} onPrevious={onPrevious} onNext={onNext} previousLabel={t.previous} nextLabel={t.next} />
        {view ? <SegmentedControl size="small" label={view.label} value={view.value} onChange={view.onChange} options={view.options} /> : null}
      </div>
      <div className="eu-avail__body">
        <div className="eu-avail__labels">
          <span className="eu-avail__axis-gap" />
          <span className="eu-avail__who eu-avail__who--all">
            <span className="eu-type-body-caption-strong">{t.all}</span>
            {t.allHint ? <span className="eu-type-body-caption eu-avail__hint">{t.allHint}</span> : null}
          </span>
          {rows.map((r) => (
            <span key={r.id} className="eu-avail__who">
              <Avatar name={r.name} src={r.photo} size="tiny" />
              <span className="eu-type-body-caption eu-avail__name">{r.name}</span>
            </span>
          ))}
        </div>
        <div className="eu-avail__grid">
          <div className="eu-avail__axis" aria-hidden="true">
            {n === 1
              ? hourMarks.map((h, i) => <span key={h} className={cn('eu-avail__tick eu-type-body-caption', i === 0 && 'is-first', i === hourMarks.length - 1 && 'is-last')} style={{ left: `${x(ids[0], h)}%` }}>{hm(h)}</span>)
              : columns.map((c) => <span key={c.id} className="eu-avail__tick is-day eu-type-body-caption-strong" style={{ left: `${x(c.id, hours.start)}%`, width: `${100 / n}%` }}>{c.label}</span>)}
          </div>
          <div className={cn('eu-avail__tracks', onPick && 'is-pickable')} onClick={pick} role="presentation">
            <span className="eu-avail__allbg" aria-hidden="true" />
            {free.filter(inView).map((f) => <span key={`f-${f.column}-${f.start}`} className="eu-avail__fill eu-avail__fill--free" style={place(f.column, f.start, f.end)} title={`${t.free} · ${hm(f.start)}–${hm(f.end)}`} />)}
            {inView(planned) ? <span className="eu-avail__fill eu-avail__fill--planned" style={place(planned.column, planned.start, planned.end)} title={`${t.planned} · ${hm(planned.start)}–${hm(planned.end)}`} /> : null}
            {inView(selection) && !selection.valid ? <span className="eu-avail__fill eu-avail__fill--planned" style={place(selection.column, selection.start, selection.end)} /> : null}
            <span className="eu-avail__lines" aria-hidden="true">
              {lines.map((m) => <span key={m} className={cn('eu-avail__line', m % 60 !== 0 && 'is-half')} style={{ left: `${x(ids[0], m)}%` }} />)}
              {n > 1 ? ids.slice(1).map((c) => <span key={c} className="eu-avail__line is-day" style={{ left: `${x(c, hours.start)}%` }} />) : null}
            </span>
            <div className="eu-avail__track eu-avail__track--all">{offHours('all')}</div>
            {rows.map((r) => (
              <div key={r.id} className="eu-avail__track">
                {offHours(r.id)}
                {ids.flatMap((c) => (r.events[c] ?? []).map((e) => (
                  <span key={`${c}-${e.start}`} className={cn('eu-avail__event', `eu-avail__event--${e.status}`)} style={place(c, e.start, e.end)} title={`${status(e.status)} · ${hm(e.start)}–${hm(e.end)}`} aria-label={`${r.name}: ${status(e.status)}, ${hm(e.start)}–${hm(e.end)}`} role="img" />
                )))}
              </div>
            ))}
            {inView(selection) ? (
              <span className={cn('eu-avail__mark', selection.valid ? 'eu-avail__mark--selected' : 'eu-avail__mark--conflict')} style={place(selection.column, selection.start, selection.end)} title={`${selection.valid ? t.selected : t.planned} · ${hm(selection.start)}–${hm(selection.end)}`}>
                <span className="eu-avail__mark-icon"><Icon name={selection.valid ? 'check-circle' : 'warning-triangle'} size="md" /></span>
              </span>
            ) : null}
          </div>
          <ul className="eu-avail__legend" aria-label={t.legend}>
            {legend.map(([k, label]) => <li key={k}><span className={`eu-avail__key eu-avail__key--${k}`} aria-hidden="true" /><span className="eu-type-body-caption-strong">{label}</span></li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ---- StatusSummary

export interface StatusSummaryProps {
  /** Icon in the tile. */
  icon: IconName;
  /** Main line, such as the date and time. */
  title: React.ReactNode;
  /** Second line, such as who is busy. */
  description?: React.ReactNode;
  /** `default` accent tile, `error` red tile and red description. */
  tone?: 'default' | 'error';
  /** Right slot, such as a Badge. */
  trailing?: React.ReactNode;
}

/** A quiet bar that states what is set and whether it works, such as the time of a Termin above its availability. Read-only. */
export function StatusSummary({ icon, title, description, tone = 'default', trailing }: StatusSummaryProps) {
  return (
    <div className={cn('eu-summary', tone === 'error' && 'is-error')} aria-live="polite">
      <span className="eu-summary__icon" aria-hidden="true"><Icon name={icon} size="md" /></span>
      <span className="eu-summary__text">
        <span className="eu-summary__title eu-type-ui-card-title">{title}</span>
        {description ? <span className="eu-summary__desc eu-type-body-caption">{description}</span> : null}
      </span>
      {trailing}
    </div>
  );
}
