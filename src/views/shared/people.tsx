import * as React from 'react';
import { PeopleList, type PersonItem } from '@euvino/ds';
import { contacts } from '../../data/contacts';
import { TEAM } from '../../data/availability';
import type { PersonRef } from '../../data/history';
import { hrefFor } from '../../route';

// One rule for people everywhere (timeline, Fokus card, organisation table):
// other people's names are blue links to their contact record; team members without a record run `PersonAction`;
// the signed-in user's own name is plain text; "+N" lists exactly the hidden people.

/** The signed-in user. */
export const CURRENT_USER = 'Johannes Finzer';

/** Heading of a "+N" list. */
export const morePeople = (n: number) => (n === 1 ? '1 weitere Person' : `${n} weitere Personen`);

/** What a click on a team member's name does; they have no contact record yet. */
export const PersonAction = React.createContext<(name: string) => void>(() => {});

const CONTACT_ID = new Map(contacts.map((c) => [c.name, c.id]));

/** Maps a person to a PeopleList item. `label` replaces the shown name, such as "@Anna Berg" for a mention. */
export function usePersonItem() {
  const onPerson = React.useContext(PersonAction);
  return React.useCallback((p: PersonRef, label?: string): PersonItem => {
    const name = label ?? p.name;
    if (p.name === CURRENT_USER) return { name, current: true };
    const id = CONTACT_ID.get(p.name);
    if (id) return { name, href: hrefFor.contact(id), detail: p.email };
    if (p.name.includes('@')) return { name, href: `mailto:${p.email ?? p.name}` };
    return { name, onClick: () => onPerson(p.name), detail: p.email };
  }, [onPerson]);
}

/** Names with "+N" for the rest. */
export function People({ list, max = 2 }: { list: PersonRef[]; max?: number }) {
  const toItem = usePersonItem();
  return <PeopleList people={list.map((p) => toItem(p))} max={max} moreLabel={morePeople} />;
}

/** One person's name, linked by the same rule. */
export function Person({ p }: { p: PersonRef }) {
  return <People list={[p]} max={1} />;
}

const KNOWN = [...new Set([...contacts.map((c) => c.name), ...TEAM.map((t) => t.name)])].sort((a, b) => b.length - a.length);
const MENTION = new RegExp(`@(${KNOWN.map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');

/** Text with @mentions turned into person links. */
export function MentionText({ text }: { text: string }) {
  const toItem = usePersonItem();
  const parts: React.ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(MENTION)) {
    const i = m.index ?? 0;
    if (i > last) parts.push(text.slice(last, i));
    parts.push(<PeopleList key={i} people={[toItem({ name: m[1] }, `@${m[1]}`)]} max={1} />);
    last = i + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}
