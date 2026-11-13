import * as React from 'react';
import { cn } from './cn';
import { Popover } from './feedback';

export interface PersonItem {
  /** Full name. */
  name: string;
  /** Opens the person's record. */
  href?: string;
  /** Runs instead of a link, such as for a team member without a record. */
  onClick?: () => void;
  /** Second line in the "+N" list, such as an email address. */
  detail?: string;
  /** The signed-in user: shown as plain text, never as a link. */
  current?: boolean;
}

export interface PeopleListProps {
  /** People in order. The first `max` show inline; the rest sit behind "+N". */
  people: PersonItem[];
  /** How many names show inline. */
  max?: number;
  /** Heading of the "+N" list, such as `(n) => \`${n} weitere Personen\``. Pass it in the page's language. */
  moreLabel?: (count: number) => string;
  /** Extra class. */
  className?: string;
}

function Name({ p }: { p: PersonItem }) {
  if (p.current || (!p.href && !p.onClick)) return <span>{p.name}</span>;
  if (p.href)
    return (
      <a href={p.href} className="eu-link eu-link--link" onClick={p.onClick}>
        {p.name}
      </a>
    );
  return (
    <button type="button" className="eu-link eu-link--link" onClick={p.onClick}>
      {p.name}
    </button>
  );
}

/**
 * Names of people inline, such as recipients or participants: "Anna Berg, Ben Kohl +3". Names are blue links to the person's record;
 * your own name stays plain. "+N" opens a list of exactly the hidden people on hover, click or Enter. Inherits the surrounding text style.
 */
export function PeopleList({ people, max = 2, moreLabel = (n) => `${n} more`, className }: PeopleListProps) {
  const shown = people.slice(0, max);
  const rest = people.slice(max);
  const [open, setOpen] = React.useState(false);
  const timer = React.useRef<number | undefined>(undefined);
  React.useEffect(() => () => window.clearTimeout(timer.current), []);
  const show = () => {
    window.clearTimeout(timer.current);
    setOpen(true);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(false), 150);
  };
  return (
    <span className={cn('eu-people', className)}>
      {shown.map((p, i) => (
        <React.Fragment key={`${p.name}-${i}`}>
          {i > 0 ? ', ' : null}
          <Name p={p} />
        </React.Fragment>
      ))}
      {rest.length ? (
        <>
          {' '}
          <span className="eu-people__more" onMouseEnter={show} onMouseLeave={hide}>
            <Popover
              open={open}
              onOpenChange={setOpen}
              title={moreLabel(rest.length)}
              trigger={
                <button type="button" className="eu-link eu-link--link" aria-label={moreLabel(rest.length)}>{`+${rest.length}`}</button>
              }
            >
              <ul className="eu-people__list">
                {rest.map((p, i) => (
                  <li key={`${p.name}-${i}`} className="eu-people__item">
                    <span className="eu-type-body-small">
                      <Name p={p} />
                    </span>
                    {p.detail && p.detail !== p.name ? <span className="eu-type-body-caption eu-people__detail">{p.detail}</span> : null}
                  </li>
                ))}
              </ul>
            </Popover>
          </span>
        </>
      ) : null}
    </span>
  );
}
