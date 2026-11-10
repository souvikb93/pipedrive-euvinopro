import * as React from 'react';
import { cn } from './cn';
import { Icon } from './icon';
import { Badge, type Status } from './feedback';
import { Button } from './button';

export interface LabelOption {
  /** Value reported by `onChange`. */
  id: string;
  /** Text on the badge. */
  label: string;
  /** Badge colour. */
  status: Status;
}

export interface LabelPickerProps {
  /** Selected label id, or null for none. */
  value: string | null;
  /** All labels people can choose. */
  options: LabelOption[];
  /** Called with the chosen label id. */
  onChange: (id: string) => void;
  /** Called with the typed name when someone adds a new label. Add it to `options` and select it. Leave out to hide the add button. */
  onCreate?: (name: string) => void;
  /** Accessible name of the trigger, such as "Label for Anna Roell". The current label is added after it. */
  label: string;
  /** Names of the built-in parts. Pass them in the page's language. */
  labels?: { search?: string; add?: string; addNamed?: (name: string) => string; empty?: string; none?: string };
}

/**
 * Shows a label as a Badge and lets people change it in place, such as in a table cell. A pencil appears on hover and focus.
 * The popover has a search, the labels as badges (the current one checked) and an add button for a new label.
 * Arrow keys move, Enter picks, Escape closes. It is positioned against the window, so table scrolling never cuts it off.
 */
export function LabelPicker({ value, options, onChange, onCreate, label, labels }: LabelPickerProps) {
  const id = React.useId();
  const trigger = React.useRef<HTMLButtonElement>(null);
  const panel = React.useRef<HTMLDivElement>(null);
  const search = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState('');
  const [active, setActive] = React.useState(0);
  const [pos, setPos] = React.useState<{ top?: number; bottom?: number; left: number; minWidth: number }>({ left: 0, minWidth: 0 });

  const current = options.find((o) => o.id === value) ?? null;
  const q = query.trim().toLowerCase();
  const shown = q ? options.filter((o) => o.label.toLowerCase().includes(q)) : options;
  const exact = options.some((o) => o.label.toLowerCase() === q);

  const place = React.useCallback(() => {
    const r = trigger.current?.getBoundingClientRect();
    if (!r) return;
    const gap = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--eu-spacing-1')) || 0;
    const h = panel.current?.offsetHeight ?? 0;
    const below = window.innerHeight - r.bottom;
    const up = h > 0 && below < h + gap && r.top > below;
    const w = panel.current?.offsetWidth ?? 0;
    const left = Math.max(gap, Math.min(r.left, window.innerWidth - w - gap));
    setPos(up ? { bottom: window.innerHeight - r.top + gap, left, minWidth: r.width } : { top: r.bottom + gap, left, minWidth: r.width });
  }, []);

  React.useLayoutEffect(() => { if (open) place(); }, [open, place, shown.length]);
  React.useEffect(() => {
    if (!open) return;
    search.current?.focus();
    const onDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!panel.current?.contains(t) && !trigger.current?.contains(t)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    return () => { document.removeEventListener('mousedown', onDown); window.removeEventListener('scroll', place, true); window.removeEventListener('resize', place); };
  }, [open, place]);
  React.useEffect(() => setActive(0), [query]);

  const close = (refocus = true) => { setOpen(false); setQuery(''); if (refocus) trigger.current?.focus(); };
  const pick = (o: LabelOption) => { onChange(o.id); close(); };
  const create = () => {
    if (!onCreate) return;
    const name = query.trim();
    if (!name || exact) { search.current?.focus(); return; }
    onCreate(name);
    close();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, shown.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); if (shown[active]) pick(shown[active]); else create(); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); close(); }
    else if (e.key === 'Tab' && e.target === search.current && !e.shiftKey && !onCreate) close(false);
  };

  const listId = `${id}-list`;
  const addText = q && !exact ? (labels?.addNamed ?? ((n: string) => `Add "${n}"`))(query.trim()) : labels?.add ?? 'Add label';
  return (
    <span className={cn('eu-labelpick', open && 'is-open')}>
      <button
        ref={trigger} type="button" aria-haspopup="listbox" aria-expanded={open}
        aria-label={`${label}: ${current ? current.label : labels?.none ?? 'none'}`}
        className="eu-labelpick__trigger" onClick={() => (open ? close() : setOpen(true))}
      >
        {current ? <Badge size="tiny" status={current.status}>{current.label}</Badge> : <span className="eu-type-body-small eu-labelpick__none">{labels?.none ?? '–'}</span>}
        <span className="eu-labelpick__edit" aria-hidden="true"><Icon name="edit" size="sm" /></span>
      </button>
      {open ? (
        <div ref={panel} className="eu-labelpick__panel" style={pos} onKeyDown={onKeyDown}>
          <div className="eu-labelpick__search">
            <span className="eu-input eu-input--filled">
              <Icon name="search" size="md" className="eu-input__icon" />
              <input
                ref={search} type="text" role="combobox" aria-expanded="true" aria-controls={listId} aria-autocomplete="list"
                aria-activedescendant={shown[active] ? `${id}-opt-${active}` : undefined}
                aria-label={labels?.search ?? 'Search label'} placeholder={labels?.search ?? 'Search label'}
                className="eu-input__el eu-type-body-small" value={query} onChange={(e) => setQuery(e.target.value)}
              />
            </span>
          </div>
          <ul id={listId} role="listbox" aria-label={label} className="eu-labelpick__list">
            {shown.length === 0 ? <li role="presentation" className="eu-type-body-small eu-labelpick__empty">{labels?.empty ?? 'No label found'}</li> : shown.map((o, i) => (
              <li
                key={o.id} id={`${id}-opt-${i}`} role="option" aria-selected={o.id === value}
                className={cn('eu-labelpick__opt', i === active && 'is-active')}
                onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActive(i)} onClick={() => pick(o)}
              >
                <Badge size="tiny" status={o.status}>{o.label}</Badge>
                {o.id === value ? <Icon name="check" size="md" className="eu-labelpick__check" /> : null}
              </li>
            ))}
          </ul>
          {onCreate ? (
            <div className="eu-labelpick__foot">
              <Button variant="primary" icon="plus" fullWidth onClick={create}>{addText}</Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </span>
  );
}
