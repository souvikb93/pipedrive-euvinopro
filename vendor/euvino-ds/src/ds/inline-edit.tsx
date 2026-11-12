import * as React from 'react';
import { cn } from './cn';
import { Icon } from './icon';
import { Calendar } from './form';

export interface InlineEditProps {
  /** Current value. For `type="date"` an ISO day `YYYY-MM-DD`. */
  value: string;
  /** Called with the new value when people save. Not called when the value did not change. */
  onChange: (value: string) => void;
  /** Accessible name of the edit button, such as "Edit name of Anna Roell". */
  label: string;
  /** Kind of value. `date` opens a Calendar. */
  type?: 'text' | 'number' | 'email' | 'tel' | 'date';
  /** What to show while not editing, such as a link or formatted date. Without it the value shows as text and a click on it edits. */
  display?: React.ReactNode;
  /** Blocks saving an empty value. */
  required?: boolean;
  /** For `type="date"`: BCP 47 locale for the Calendar. */
  locale?: string;
}

/**
 * A value that people change in place, such as a table cell or a detail field. A pencil appears on hover and focus.
 * Text: Enter or leaving the field saves, Escape cancels. Date: picking a day saves, Escape cancels.
 */
export function InlineEdit({ value, onChange, label, type = 'text', display, required, locale = 'en' }: InlineEditProps) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [pos, setPos] = React.useState<{ top?: number; bottom?: number; left: number }>({ left: 0 });
  const root = React.useRef<HTMLSpanElement>(null);
  const edit = React.useRef<HTMLButtonElement>(null);
  const pop = React.useRef<HTMLDivElement>(null);
  const input = React.useRef<HTMLInputElement>(null);
  const cancelled = React.useRef(false);

  const start = () => { setDraft(value); cancelled.current = false; setEditing(true); };
  const stop = (refocus = true) => { setEditing(false); if (refocus) requestAnimationFrame(() => edit.current?.focus()); };
  const commit = (next: string) => {
    const v = next.trim();
    if (cancelled.current) return;
    if (required && !v) { stop(); return; }
    if (v !== value) onChange(v);
    stop();
  };

  const place = React.useCallback(() => {
    const r = root.current?.getBoundingClientRect();
    if (!r) return;
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--eu-spacing-3xs')) || 0;
    const h = pop.current?.offsetHeight ?? 0;
    const below = window.innerHeight - r.bottom;
    const w = pop.current?.offsetWidth ?? 0;
    const left = Math.max(gap, Math.min(r.left, window.innerWidth - w - gap));
    setPos(h > 0 && below < h + gap && r.top > below ? { bottom: window.innerHeight - r.top + gap, left } : { top: r.bottom + gap, left });
  }, []);

  React.useLayoutEffect(() => { if (editing && type === 'date') place(); }, [editing, type, place]);
  React.useEffect(() => {
    if (!editing) return;
    if (type !== 'date') { input.current?.focus(); input.current?.select(); return; }
    const onDown = (e: MouseEvent) => { const t = e.target as Node; if (!pop.current?.contains(t) && !root.current?.contains(t)) stop(false); };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { e.preventDefault(); stop(); } };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place); };
  }, [editing, type, place]);

  if (editing && type !== 'date') {
    return (
      <span className="eu-inline is-editing" ref={root}>
        <input
          ref={input} type={type} aria-label={label} required={required} value={draft}
          className="eu-inline__input" onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') { e.preventDefault(); commit(draft); }
            else if (e.key === 'Escape') { e.preventDefault(); cancelled.current = true; stop(); }
          }}
          onBlur={() => commit(draft)}
        />
      </span>
    );
  }

  return (
    <span className={cn('eu-inline', editing && 'is-open')} ref={root}>
      {display !== undefined ? <span className="eu-inline__value">{display}</span> : (
        <span className="eu-inline__value eu-inline__text" onClick={start}>{value || '–'}</span>
      )}
      <button ref={edit} type="button" className="eu-inline__edit" aria-label={label} aria-haspopup={type === 'date' ? 'dialog' : undefined} aria-expanded={type === 'date' ? editing : undefined} onClick={() => (editing ? stop() : start())}>
        <Icon name={type === 'date' ? 'calendar' : 'edit'} size="sm" />
      </button>
      {editing && type === 'date' ? (
        <div ref={pop} role="dialog" aria-label={label} className="eu-inline__pop" style={pos}>
          <Calendar value={value || undefined} locale={locale} onChange={(d) => { if (d !== value) onChange(d); stop(); }} />
        </div>
      ) : null}
    </span>
  );
}
