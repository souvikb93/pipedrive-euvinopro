import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import { Avatar } from './display';

export interface GlobalSearchCategory {
  /** Value reported by `onCategoryChange`. */
  id: string;
  /** Visible text. */
  label: string;
  /** Icon before the text. */
  icon?: IconName;
  /** Number of hits in this category for the current text. */
  count?: number;
}

export interface GlobalSearchHit {
  /** Unique id. */
  id: string;
  /** Main line, such as a name. Matches of the search text are highlighted. */
  title: string;
  /** Detail lines under the title, such as company, email or a note. Matches are highlighted. */
  lines?: string[];
  /** Person: shows initials from this name instead of an icon. */
  person?: string;
  /** Icon for things that are not people, such as an organisation. */
  icon?: IconName;
}

export interface GlobalSearchProps {
  /** Accessible name of the search field. */
  label: string;
  /** Current text. */
  value: string;
  /** Called with the new text. */
  onChange: (value: string) => void;
  /** Categories in the left column. The first is usually "All". */
  categories: GlobalSearchCategory[];
  /** Selected category id. */
  category: string;
  /** Called when a category is chosen. */
  onCategoryChange: (id: string) => void;
  /** Hits for the current text and category, already filtered. */
  results: GlobalSearchHit[];
  /** Called when a hit is opened with click or Enter. The panel closes. */
  onSelect: (hit: GlobalSearchHit) => void;
  /** Heading above the hits, such as "All results". */
  heading: string;
  /** Placeholder of the field. */
  placeholder?: string;
  /** Shown when the text matches nothing. */
  emptyText?: string;
  /** Bottom of the category column, such as a help link. */
  footer?: React.ReactNode;
  /** Names of the built-in parts. Pass them in the page's language. */
  labels?: { clear?: string; categories?: string; count?: (n: number) => string };
}

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  if (!q) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = q.toLowerCase();
  const parts: React.ReactNode[] = [];
  let from = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, from)) {
    if (at > from) parts.push(text.slice(from, at));
    parts.push(<mark key={at} className="eu-gsearch__mark">{text.slice(at, at + q.length)}</mark>);
    from = at + q.length;
  }
  parts.push(text.slice(from));
  return <>{parts}</>;
}

/**
 * App-wide search: a header field that opens a large panel over a dimmed page, with categories on the left and
 * hits on the right. Matches are highlighted. Arrow keys move through hits, Enter opens one, Escape closes.
 * For a simple field with a short suggestion list use SearchField.
 */
export function GlobalSearch({
  label, value, onChange, categories, category, onCategoryChange, results, onSelect, heading,
  placeholder, emptyText = 'No matches', footer, labels,
}: GlobalSearchProps) {
  const id = React.useId();
  const input = React.useRef<HTMLInputElement>(null);
  const list = React.useRef<HTMLUListElement>(null);
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const show = open && value.trim().length > 0;

  React.useEffect(() => setActive(0), [value, category]);
  React.useEffect(() => {
    const el = list.current?.querySelector(`[data-index="${active}"]`) as HTMLElement | null;
    el?.scrollIntoView?.({ block: 'nearest' });
  }, [active]);

  const close = () => { setOpen(false); input.current?.focus(); };
  const choose = (hit: GlobalSearchHit) => { onSelect(hit); setOpen(false); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      if (show) { e.preventDefault(); close(); } else if (value) onChange('');
      return;
    }
    if (!show) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && e.target === input.current && results[active]) { e.preventDefault(); choose(results[active]); }
  };

  const listId = `${id}-results`;
  return (
    <div className={cn('eu-gsearch', show && 'is-open')} onKeyDown={onKeyDown}>
      <label htmlFor={`${id}-input`} className="eu-sr">{label}</label>
      <span className="eu-input eu-input--filled eu-gsearch__field">
        <Icon name="search" size="md" className="eu-input__icon" />
        <input
          ref={input} id={`${id}-input`} type="search" role="combobox" autoComplete="off"
          aria-expanded={show} aria-controls={listId} aria-autocomplete="list"
          aria-activedescendant={show && results[active] ? `${id}-hit-${active}` : undefined}
          className="eu-input__el eu-type-body-small" placeholder={placeholder} value={value}
          onChange={(e) => { onChange(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
        />
        {value ? <button type="button" className="eu-input__btn" aria-label={labels?.clear ?? 'Clear search'} onClick={() => { onChange(''); input.current?.focus(); }}><Icon name="close" size="md" /></button> : null}
      </span>

      {show ? (
        <>
          <div className="eu-gsearch__scrim" aria-hidden="true" onMouseDown={() => setOpen(false)} />
          <div className="eu-gsearch__panel">
            <div className="eu-gsearch__side">
              <div role="group" aria-label={labels?.categories ?? 'Categories'} className="eu-gsearch__cats">
                {categories.map((c) => (
                  <button
                    key={c.id} type="button" aria-pressed={c.id === category}
                    className={cn('eu-gsearch__cat eu-type-body-small', c.id === category && 'is-selected')}
                    onClick={() => { onCategoryChange(c.id); input.current?.focus(); }}
                  >
                    {c.icon ? <Icon name={c.icon} size="md" /> : null}
                    <span className="eu-gsearch__cat-label">{c.label}</span>
                    {c.count !== undefined ? <span className="eu-type-body-caption eu-gsearch__cat-count">{c.count}</span> : null}
                  </button>
                ))}
              </div>
              {footer ? <div className="eu-gsearch__foot">{footer}</div> : null}
            </div>

            <div className="eu-gsearch__main">
              <p className="eu-type-ui-card-title eu-gsearch__heading" id={`${id}-heading`}>{heading}</p>
              {results.length === 0 ? <p className="eu-type-body-small eu-gsearch__empty">{emptyText}</p> : (
                <ul ref={list} id={listId} role="listbox" aria-labelledby={`${id}-heading`} className="eu-gsearch__hits">
                  {results.map((h, i) => (
                    <li
                      key={h.id} id={`${id}-hit-${i}`} data-index={i} role="option" aria-selected={i === active}
                      className={cn('eu-gsearch__hit', i === active && 'is-active')}
                      onMouseDown={(e) => e.preventDefault()} onMouseEnter={() => setActive(i)} onClick={() => choose(h)}
                    >
                      <span className="eu-gsearch__lead">
                        {h.person ? <Avatar name={h.person} size="tiny" /> : <Icon name={h.icon ?? 'page'} size="md" />}
                      </span>
                      <span className="eu-gsearch__text">
                        <span className="eu-type-ui-card-title eu-gsearch__title"><Highlight text={h.title} query={value} /></span>
                        {h.lines?.map((l, j) => <span key={j} className="eu-type-body-caption eu-gsearch__line"><Highlight text={l} query={value} /></span>)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      ) : null}
      <span className="eu-sr" aria-live="polite">{show ? (labels?.count ?? ((n: number) => `${n} results`))(results.length) : ''}</span>
    </div>
  );
}
