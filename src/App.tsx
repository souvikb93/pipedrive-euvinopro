import * as React from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Header,
  Icon,
  IconButton,
  LinkButton,
  Menu,
  SearchField,
  SegmentedControl,
  SideNav,
  Stack,
  Table,
  Text,
  UserMenu,
  VisuallyHidden,
  type SearchResult,
  type SideNavItem,
  type Status,
  type TableColumn,
} from '@euvino/ds';
import './app.css';
import { contacts, TOTAL_CONTACTS, type Contact, type ContactLabel } from './data/contacts';

// Figma: Side Nav, Content=Icon, Theme=Dark, Logo on. Icons and counts as in the frame.
const NAV: SideNavItem[] = [
  { label: 'Overview', icon: 'page-edit', href: '#' },
  { label: 'Product Catalog', icon: 'precision-tool', href: '#' },
  { label: 'Requests', icon: 'coin', href: '#' },
  { label: 'Data Validation', icon: 'chat-bubble-check', href: '#' },
  { label: 'Suppliers', icon: 'send-mail', href: '#', count: 1 },
  { label: 'Trading Partners', icon: 'shop', href: '#', count: 3, countStatus: 'error' },
  { label: 'Data Transfer', icon: 'credit-cards', href: '#', selected: true },
  { label: 'Reports', icon: 'stats-down-square', href: '#' },
  { label: 'Settings', icon: 'box-iso', href: '#' },
];

// Figma: Badge Size=Tiny, Style=Subtle. State per label.
const LABELS: Record<ContactLabel, { text: string; status: Status }> = {
  customer: { text: 'Customer', status: 'success' },
  partner: { text: 'Partner', status: 'default' },
  prospect: { text: 'Prospect', status: 'warning' },
  'hot-lead': { text: 'Hot Lead', status: 'error' },
  lead: { text: 'Lead', status: 'info' },
};

const VIEWS = [
  { value: 'contacts', label: 'Kontakte', icon: 'list' as const },
  { value: 'organisations', label: 'Organisationen', icon: 'view-grid' as const },
  { value: 'timeline', label: 'Timeline', icon: 'calendar' as const },
];

const noop = () => {};

/** Link text in foreground/link; the note in brackets stays normal body text. */
function Linked({ links, note, scheme }: { links: string[]; note: string | null; scheme: 'mailto' | 'tel' }) {
  return (
    <>
      {links.map((l, i) => (
        <React.Fragment key={l}>
          {i > 0 ? ' ' : null}
          <LinkButton variant="link" href={`${scheme}:${scheme === 'tel' ? l.replace(/[^+\d]/g, '') : l}`}>{l}</LinkButton>
        </React.Fragment>
      ))}
      {note ? ` (${note})` : null}
    </>
  );
}

function searchContacts(query: string): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const people = contacts
    .filter((c) => [c.name, c.email, ...c.phones].some((v) => v.toLowerCase().includes(q)))
    .slice(0, 5)
    .map((c) => ({ id: c.id, label: c.name, description: `${c.organisation} · ${c.email}`, icon: 'user' as const, group: 'Kontakte' }));
  const orgs = [...new Set(contacts.map((c) => c.organisation))]
    .filter((o) => o.toLowerCase().includes(q))
    .slice(0, 3)
    .map((o) => ({
      id: `org-${o}`,
      label: o,
      description: `${contacts.filter((c) => c.organisation === o).length} Kontaktpersonen`,
      icon: 'group' as const,
      group: 'Organisationen',
    }));
  return [...people, ...orgs];
}

export function App() {
  const [view, setView] = React.useState('contacts');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);

  const results = React.useMemo(() => searchContacts(query), [query]);
  const rows = React.useMemo(() => {
    if (!filter) return contacts;
    return contacts.filter((c) => c.id === filter || `org-${c.organisation}` === filter);
  }, [filter]);

  const onSelect = (r: SearchResult) => {
    setFilter(r.id);
    setQuery(r.label);
  };
  const onQuery = (v: string) => {
    setQuery(v);
    if (!v) setFilter(null);
  };

  const columns: Array<TableColumn<Contact>> = [
    { key: 'name', header: 'Name', overflow: 'truncate', render: (c) => <Text as="span" variant="card-title" tone="strong-body">{c.name}</Text> },
    { key: 'label', header: 'Label', fit: true, render: (c) => <Badge size="tiny" status={LABELS[c.label].status}>{LABELS[c.label].text}</Badge> },
    { key: 'organisation', header: 'Organisation', overflow: 'truncate', render: (c) => c.organisation },
    { key: 'email', header: 'E-Mail', overflow: 'truncate', render: (c) => <Linked links={[c.email]} note={c.emailType} scheme="mailto" /> },
    { key: 'phone', header: 'Telefonnummer', overflow: 'truncate', render: (c) => <Linked links={c.phones} note={c.phoneType} scheme="tel" /> },
    { key: 'won', header: 'Abgeschlossene Deals', fit: true, render: (c) => c.wonDeals },
    { key: 'open', header: 'Offene Deals', fit: true, render: (c) => c.openDeals },
    { key: 'next', header: 'Datum nächste Aktivität', fit: true, overflow: 'nowrap', render: (c) => c.nextActivity },
    { key: 'owner', header: 'Besitzer', fit: true, overflow: 'nowrap', render: (c) => c.owner },
    {
      key: 'actions', fit: true,
      header: <Icon name="settings" size="sm" />,
      render: (c) => (
        <Menu
          label={`Aktionen für ${c.name}`}
          trigger={<IconButton icon="more-horiz" label={`Aktionen für ${c.name}`} size="tiny" />}
          items={[
            { label: 'Bearbeiten', icon: 'edit', onSelect: noop },
            { label: 'E-Mail senden', icon: 'mail', onSelect: noop },
            { label: 'Löschen', icon: 'trash', danger: true, onSelect: noop },
          ]}
        />
      ),
    },
  ];

  return (
    <Stack direction="horizontal" gap="0" align="start" className="app-shell">
      <SideNav label="Hauptnavigation" items={NAV} collapsed theme="dark" logo sticky />

      <Stack gap="0" className="app-main">
        <Header
          size="large"
          layout="between"
          brand={<Breadcrumbs label="Pfad" items={[{ label: 'Kontakte', href: '#' }, { label: 'Kontakte' }]} />}
          actions={
            <>
              <IconButton icon="shop" label="Marktplatz" size="giant" />
              <IconButton icon="help" label="Hilfe" size="giant" />
              <Menu
                label="Konto"
                trigger={<UserMenu name="Anna" compact />}
                items={[
                  { label: 'Profil', icon: 'user', onSelect: noop },
                  { label: 'Abmelden', icon: 'logout', onSelect: noop },
                ]}
              />
            </>
          }
        >
          <SearchField
            label="Kontakte und Organisationen suchen"
            placeholder="Search"
            value={query}
            onChange={onQuery}
            results={results}
            onSelect={onSelect}
            emptyText="Keine Treffer"
            labels={{ clear: 'Suche leeren', count: (n) => `${n} Vorschläge` }}
          />
        </Header>

        <Stack as="main" gap="6" className="app-content">
          <VisuallyHidden>
            <Text as="h1" variant="h1">Kontakte</Text>
          </VisuallyHidden>

          <Stack direction="horizontal" gap="4" justify="between" align="center" wrap>
            <SegmentedControl label="Ansicht" value={view} onChange={setView} options={VIEWS} />
            <Stack direction="horizontal" gap="4" align="center" wrap>
              <Text variant="body-small" tone="body">{filter ? `${rows.length} von ${TOTAL_CONTACTS}` : TOTAL_CONTACTS} Kontaktpersonen</Text>
              <Button variant="secondary" icon="sort">Filter einstellen</Button>
              <Button variant="primary" icon="plus">Kontakte</Button>
            </Stack>
          </Stack>

          <Table
            caption="Kontaktpersonen"
            rows={rows}
            rowKey={(c) => c.id}
            columns={columns}
            selected={selected}
            onSelectedChange={setSelected}
            labels={{ selectAll: 'Alle auswählen', selectRow: (c) => `${c.name} auswählen` }}
          />
        </Stack>
      </Stack>
    </Stack>
  );
}
