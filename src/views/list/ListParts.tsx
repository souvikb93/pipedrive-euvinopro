import * as React from 'react';
import { IconButton, InlineList, LinkButton, Menu, SegmentedControl, Stack, Text, type LabelOption, type MenuItemDef } from '@euvino/ds';
import type { View } from '../../route';

// Pieces shared by the Kontakte and Organisationen lists: view switch, toolbar, filter and sort menus, row actions, links.

export const VIEWS = [
  { value: 'contacts', label: 'Kontakte', icon: 'user' as const },
  { value: 'organisations', label: 'Organisationen', icon: 'building' as const },
  { value: 'timeline', label: 'Timeline', icon: 'calendar' as const },
];

/** Link text in foreground/link; the note in brackets stays normal body text. */
export function Linked({ links, note, scheme }: { links: string[]; note: string | null; scheme: 'mailto' | 'tel' }) {
  return (
    <>
      {links.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 ? ' ' : null}
          <LinkButton variant="link" href={`${scheme}:${scheme === 'tel' ? l.replace(/[^+\d]/g, '') : l}`}>
            {l}
          </LinkButton>
        </React.Fragment>
      ))}
      {note ? ` (${note})` : null}
    </>
  );
}

export function Toolbar({
  view,
  onView,
  count,
  primary,
  filter,
  sort,
}: {
  view: View;
  onView: (v: string) => void;
  count: string;
  primary: React.ReactNode;
  filter: React.ReactNode;
  sort: React.ReactNode;
}) {
  return (
    <Stack direction="horizontal" gap="4" justify="between" align="center" wrap className="app-toolbar">
      <SegmentedControl label="Ansicht" value={view} onChange={onView} options={VIEWS} />
      <Stack direction="horizontal" gap="4" align="end" wrap>
        <Text variant="caption" tone="body">
          {count}
        </Text>
        <Stack direction="horizontal" gap="2" align="center">
          {primary}
          {filter}
          {sort}
        </Stack>
      </Stack>
    </Stack>
  );
}

export function FilterMenu({
  active,
  activeName,
  options,
  onPick,
}: {
  active: string | null;
  activeName: string;
  options: LabelOption[];
  onPick: (id: string | null) => void;
}) {
  return (
    <Menu
      label="Nach Label filtern"
      trigger={
        <IconButton
          icon="filter"
          label={active ? `Filter einstellen (aktiv: ${activeName})` : 'Filter einstellen'}
          variant="secondary"
          indicator={Boolean(active)}
        />
      }
      items={[
        { label: 'Alle Labels', selected: active === null, onSelect: () => onPick(null) },
        ...options.map((o): MenuItemDef => ({ label: o.label, selected: active === o.id, onSelect: () => onPick(o.id) })),
      ]}
    />
  );
}

export function SortMenu<K extends string>({
  active,
  sorts,
  onPick,
}: {
  active: K | null;
  sorts: Array<{ key: K; label: string }>;
  onPick: (k: K | null) => void;
}) {
  return (
    <Menu
      label="Sortieren"
      trigger={
        <IconButton
          icon="sort"
          label={active ? `Sortieren (${sorts.find((o) => o.key === active)?.label})` : 'Sortieren'}
          variant="secondary"
          indicator={Boolean(active)}
        />
      }
      items={[
        { label: 'Standard', selected: active === null, onSelect: () => onPick(null) },
        ...sorts.map((o): MenuItemDef => ({ label: o.label, selected: active === o.key, onSelect: () => onPick(o.key) })),
      ]}
    />
  );
}

/** Row commands. E-Mail opens the mail app; editing and deleting rows are not built yet and say so. */
export function RowActions({ name, email, onSoon }: { name: string; email?: string; onSoon: (what: string) => void }) {
  return (
    <Menu
      label={`Aktionen für ${name}`}
      trigger={<IconButton icon="more-horiz" label={`Aktionen für ${name}`} size="tiny" />}
      items={[
        { label: 'Bearbeiten', icon: 'edit', onSelect: () => onSoon(`${name} bearbeiten`) },
        ...(email
          ? [
              {
                label: 'E-Mail senden',
                icon: 'mail',
                onSelect: () => {
                  window.location.href = `mailto:${email}`;
                },
              } as MenuItemDef,
            ]
          : []),
        { label: 'Löschen', icon: 'trash', danger: true, onSelect: () => onSoon(`${name} löschen`) },
      ]}
    />
  );
}

/** "11.11.2026 · 09:00" from the data, shown as date | time; a dash when nothing is planned. */
export function ActivityWhen({ value }: { value: string }) {
  if (!value) return <>–</>;
  return <InlineList items={value.split(' · ')} />;
}
