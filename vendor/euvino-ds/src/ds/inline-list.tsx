import * as React from 'react';
import { cn } from './cn';

export interface InlineListProps {
  /** Facts in order, such as a date, a person and a duration. Empty items are skipped. */
  items: React.ReactNode[];
  /** Extra class. */
  className?: string;
}

/** Short facts on one line, split by a thin vertical line: "4. Nov. 2026, 14:20 | Johannes Finzer → Anna Berg | 12 Min.". Inherits the surrounding text style. */
export function InlineList({ items, className }: InlineListProps) {
  const shown = items.filter((i) => i !== null && i !== undefined && i !== false && i !== '');
  return (
    <span className={cn('eu-inline-list', className)}>
      {shown.map((item, i) => (
        <React.Fragment key={i}>
          {i > 0 ? <span className="eu-inline-list__sep" aria-hidden="true" /> : null}
          <span>{item}</span>
        </React.Fragment>
      ))}
    </span>
  );
}
