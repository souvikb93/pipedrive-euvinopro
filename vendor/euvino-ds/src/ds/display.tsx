import * as React from 'react';
import { cn } from './cn';
import { Icon, type IconName } from './icon';
import type { Status } from './feedback';

export interface AvatarProps {
  /** Person's name. Gives the initials and the accessible name. */
  name: string;
  /** Picture URL. */
  src?: string;
  /** `tiny` 24, `small` 32, `medium` 40, `large` 48, `giant` 64. */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'giant';
  /** Status dot. Pair it with text if the status matters. */
  status?: 'online' | 'offline' | 'busy';
}

/** A person as picture or initials. */
export function Avatar({ name, src, size = 'medium', status }: AvatarProps) {
  const initials = name.split(/\s+/).map((p) => p[0]).slice(0, 2).join('').toUpperCase();
  return (
    <span className={cn('eu-avatar', `eu-avatar--${size}`)} role="img" aria-label={name}>
      {src ? <img src={src} alt="" /> : <span aria-hidden="true">{initials}</span>}
      {status ? <span className={cn('eu-avatar__dot', `is-${status}`)} /> : null}
    </span>
  );
}

export interface AvatarGroupProps {
  /** People to show; the first `max` are drawn and the rest collapse into a count. */
  people: Array<{ name: string; src?: string }>;
  /** Most avatars to draw. */
  max?: number;
  /** Size of each. */
  size?: AvatarProps['size'];
}

/** Several people in a small space. Show at most 4. */
export function AvatarGroup({ people, max = 4, size = 'small' }: AvatarGroupProps) {
  const more = people.length - max;
  return <span className="eu-avatars">{people.slice(0, max).map((p) => <Avatar key={p.name} {...p} size={size} />)}{more > 0 ? <span className={cn('eu-avatar', `eu-avatar--${size}`)} aria-label={`${more} more`} role="img"><span aria-hidden="true">+{more}</span></span> : null}</span>;
}

export interface ListItemProps extends Omit<React.HTMLAttributes<HTMLLIElement>, 'title' | 'style'> {
  /** Main text. */
  title: React.ReactNode;
  /** Second line. */
  description?: React.ReactNode;
  /** Left slot: Icon, Avatar or ProductThumbnail. */
  leading?: React.ReactNode;
  /** Right slot: text, Badge, Toggle, Button. */
  trailing?: React.ReactNode;
}

/** One row of a List. */
export function ListItem({ title, description, leading, trailing, className, ...rest }: ListItemProps) {
  return <li {...rest} className={cn('eu-listitem', className)}>{leading}<span className="eu-listitem__body"><span className="eu-type-ui-card-title eu-listitem__title">{title}</span>{description ? <span className="eu-type-body-caption eu-check__desc">{description}</span> : null}</span>{trailing ? <span className="eu-listitem__trail">{trailing}</span> : null}</li>;
}

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  /** ListItem rows. */
  children: React.ReactNode;
  /** Hairline between rows. */
  divided?: boolean;
}

/** Rows of related items, such as settings, devices or files. For sortable columns of data use Table. */
export function List({ children, divided = true, className, ...rest }: ListProps) {
  return <ul {...rest} className={cn('eu-list', divided && 'is-divided', className)}>{children}</ul>;
}

export interface ProductThumbnailProps {
  /** Product photo URL. Without one an icon placeholder shows. */
  src?: string;
  /** Product name for the image. */
  alt: string;
  /** `small` 40, `medium` 48, `large` 64. */
  size?: 'small' | 'medium' | 'large';
  /** Placeholder icon. */
  icon?: IconName;
}

/** Product image tile for tables and lists. */
export function ProductThumbnail({ src, alt, size = 'medium', icon = 'box' }: ProductThumbnailProps) {
  return <span className={cn('eu-thumb', `eu-thumb--${size}`)}>{src ? <img src={src} alt={alt} /> : <Icon name={icon} size="md" label={alt} />}</span>;
}

export interface EmptyStateProps {
  /** Why it is empty, as a heading. */
  title: string;
  /** What to do next. */
  description?: React.ReactNode;
  /** Icon. */
  icon?: IconName;
  /** Next action, usually a Button. */
  action?: React.ReactNode;
  /** `medium` for a page or section, `small` inside a card. */
  size?: 'medium' | 'small';
}

/** Shown when there is nothing to display. Say why and offer the next action. */
export function EmptyState({ title, description, icon = 'box', action, size = 'medium' }: EmptyStateProps) {
  return <div className={cn('eu-empty', `eu-empty--${size}`)}><span className="eu-empty__icon"><Icon name={icon} size="lg" /></span><h3 className="eu-type-ui-label eu-alert__title">{title}</h3>{description ? <p className="eu-type-body-small eu-check__desc eu-text">{description}</p> : null}{action}</div>;
}

export interface TimelineItemProps {
  /** Event title. */
  title: React.ReactNode;
  /** Detail line. */
  description?: React.ReactNode;
  /** When it happened. */
  time?: string;
  /** Marker colour. */
  status?: Status;
}

/** One event in a Timeline. */
export function TimelineItem({ title, description, time, status = 'default' }: TimelineItemProps) {
  return <li className="eu-tl__item"><span className={cn('eu-tl__dot', `eu-tl__dot--${status}`)} /><span><span className="eu-type-ui-card-title eu-alert__title eu-listitem__title">{title}</span>{description ? <span className="eu-type-body-small eu-check__desc eu-step__desc">{description}</span> : null}{time ? <time className="eu-type-body-caption eu-check__desc eu-step__desc">{time}</time> : null}</span></li>;
}

export interface TimelineProps {
  /** TimelineItem children, newest first. */
  children: React.ReactNode;
  /** Accessible name. */
  label?: string;
}

/** Chronological list of events, such as request history or an activity log. */
export function Timeline({ children, label }: TimelineProps) {
  return <ol aria-label={label} className="eu-tl">{children}</ol>;
}

export interface AccordionItemProps {
  /** Row title. */
  title: string;
  /** Hidden content. */
  children: React.ReactNode;
  /** Starts open. */
  defaultOpen?: boolean;
  /** Blocks interaction. */
  disabled?: boolean;
}

/** One expandable row of an Accordion. */
export function AccordionItem({ title, children, defaultOpen, disabled }: AccordionItemProps) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  const id = React.useId();
  return (
    <div className="eu-acc__item">
      <h3 className="eu-acc__h"><button type="button" disabled={disabled} aria-expanded={open} aria-controls={id} className="eu-acc__btn eu-type-ui-card-title" onClick={() => setOpen((o) => !o)}>{title}<Icon name={open ? 'nav-up' : 'nav-down'} size="md" /></button></h3>
      {open ? <div id={id} className="eu-acc__panel eu-type-body-small">{children}</div> : null}
    </div>
  );
}

export interface AccordionProps {
  /** AccordionItem children. */
  children: React.ReactNode;
}

/** Stacked expandable sections, when people need only some of the content. */
export function Accordion({ children }: AccordionProps) {
  return <div className="eu-acc">{children}</div>;
}

export interface CardProps extends Omit<React.HTMLAttributes<HTMLElement>, 'title' | 'style'> {
  /** Heading. */
  title?: React.ReactNode;
  /** Line under the heading. */
  description?: React.ReactNode;
  /** Top-right slot, such as a Menu or Badge. */
  headerAction?: React.ReactNode;
  /** Bottom slot, usually Buttons. */
  footer?: React.ReactNode;
  /** Image URL shown on top. */
  image?: string;
  /** Alt text for the image. */
  imageAlt?: string;
  /** Inner space: `medium` 16 or `large` 24. */
  padding?: 'medium' | 'large';
  /** Element to render. */
  as?: React.ElementType;
}

/** The one surface for grouped content: white, radius/xl, soft shadow. The Figma Card/* layouts are all this with different content. Do not stack cards inside cards. */
export function Card({ title, description, headerAction, footer, image, imageAlt = '', padding = 'large', as: As = 'section', className, children, ...rest }: CardProps) {
  return (
    <As {...rest} className={cn('eu-card', `eu-card--${padding}`, className)}>
      {image ? <img src={image} alt={imageAlt} className="eu-card__img" /> : null}
      {title || headerAction ? <div className="eu-card__head"><div>{title ? <h2 className="eu-type-ui-label eu-alert__title">{title}</h2> : null}{description ? <p className="eu-type-body-small eu-check__desc eu-text">{description}</p> : null}</div>{headerAction}</div> : null}
      {children}
      {footer ? <div className="eu-card__foot">{footer}</div> : null}
    </As>
  );
}

export interface TableColumn<T> {
  /** Unique key. */
  key: string;
  /** Header text. */
  header: React.ReactNode;
  /** Cell content for a row. Return text, Badge, thumbnail, or actions. */
  render: (row: T) => React.ReactNode;
  /** Align numbers right. */
  align?: 'left' | 'right';
  /** Header is sortable and shows this state. */
  sort?: 'none' | 'ascending' | 'descending';
  /** Called when a sortable header is pressed. */
  onSort?: () => void;
}

export interface TableProps<T> {
  /** Column definitions. */
  columns: Array<TableColumn<T>>;
  /** Rows. */
  rows: T[];
  /** Unique key for a row. */
  rowKey: (row: T) => string;
  /** Required table name for screen readers; hidden visually. */
  caption: string;
  /** Selected row keys. Turning it on adds a checkbox column. */
  selected?: string[];
  /** Called with the new selection. */
  onSelectedChange?: (keys: string[]) => void;
  /** Shows skeleton rows and `aria-busy`. */
  loading?: boolean;
  /** Rendered in place of the rows when there are none, usually EmptyState. */
  empty?: React.ReactNode;
  /** Names for the selection checkboxes. */
  labels?: { selectAll?: string; selectRow?: (row: T) => string };
}

/** Table only: toolbars, filters and Pagination sit around it. Header checkbox selects all. Selected rows get the accent tint. */
export function Table<T>({ columns, rows, rowKey, caption, selected, onSelectedChange, loading, empty, labels }: TableProps<T>) {
  const selectable = !!onSelectedChange;
  const keys = rows.map(rowKey);
  const sel = selected ?? [];
  const all = keys.length > 0 && keys.every((k) => sel.includes(k));
  const some = keys.some((k) => sel.includes(k));
  return (
    <div className="eu-table-wrap">
      <table className="eu-table" aria-busy={loading || undefined}>
        <caption className="eu-sr">{caption}</caption>
        <thead>
          <tr>
            {selectable ? <th scope="col" className="eu-table__check"><label className="eu-check eu-check--small"><input type="checkbox" className="eu-check__el" aria-label={labels?.selectAll ?? 'Select all rows'} checked={all} ref={(el) => { if (el) el.indeterminate = some && !all; }} onChange={() => onSelectedChange?.(all ? [] : keys)} /><span className="eu-check__box" aria-hidden="true"><Icon name={some && !all ? 'minus' : 'check'} size="xs" /></span></label></th> : null}
            {columns.map((c) => (
              <th key={c.key} scope="col" aria-sort={c.sort && c.sort !== 'none' ? c.sort : undefined} className={cn('eu-type-body-caption-strong', c.align === 'right' && 'is-right')}>
                {c.onSort ? <button type="button" className="eu-table__sort" onClick={c.onSort}>{c.header}<Icon name={c.sort === 'ascending' ? 'nav-up' : c.sort === 'descending' ? 'nav-down' : 'sort'} size="sm" /></button> : c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? Array.from({ length: 3 }, (_, i) => <tr key={i}><td colSpan={columns.length + (selectable ? 1 : 0)}><span className="eu-skel eu-skel--text" /></td></tr>) : rows.map((r) => {
            const k = rowKey(r); const on = sel.includes(k);
            return (
              <tr key={k} className={cn(on && 'is-selected')} aria-selected={selectable ? on : undefined}>
                {selectable ? <td className="eu-table__check"><label className="eu-check eu-check--small"><input type="checkbox" className="eu-check__el" aria-label={labels?.selectRow?.(r) ?? `Select row ${k}`} checked={on} onChange={() => onSelectedChange?.(on ? sel.filter((x) => x !== k) : [...sel, k])} /><span className="eu-check__box" aria-hidden="true"><Icon name="check" size="xs" /></span></label></td> : null}
                {columns.map((c) => <td key={c.key} className={cn('eu-type-body-small', c.align === 'right' && 'is-right')}>{c.render(r)}</td>)}
              </tr>
            );
          })}
        </tbody>
      </table>
      {!loading && rows.length === 0 ? empty : null}
    </div>
  );
}
