import * as React from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  GlobalSearch,
  Header,
  Icon,
  IconButton,
  LinkButton,
  Menu,
  SegmentedControl,
  SideNav,
  Stack,
  Table,
  Text,
  UserMenu,
  VisuallyHidden,
  type GlobalSearchCategory,
  type GlobalSearchHit,
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

const CATEGORIES: Array<Omit<GlobalSearchCategory, 'count'>> = [
  { id: 'all', label: 'Alle Kategorien', icon: 'view-grid' },
  { id: 'deals', label: 'Deals', icon: 'coin' },
  { id: 'leads', label: 'Leads', icon: 'star' },
  { id: 'contacts', label: 'Kontakte', icon: 'user' },
  { id: 'organisations', label: 'Organisationen', icon: 'building' },
  { id: 'activities', label: 'Aktivitäten', icon: 'calendar' },
  { id: 'products', label: 'Produkte', icon: 'box' },
  { id: 'files', label: 'Dateien', icon: 'attachment' },
  { id: 'knowledge', label: 'Knowledge Base', icon: 'book' },
  { id: 'apps', label: 'Apps', icon: 'app-window' },
];

type Hit = GlobalSearchHit & { kind: 'contacts' | 'organisations'; lead: boolean };

/** All hits for the text, organisations first, then people. */
function searchAll(query: string): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const has = (v: string) => v.toLowerCase().includes(q);
  const orgs = [...new Set(contacts.map((c) => c.organisation))].flatMap((o): Hit[] => {
    const members = contacts.filter((c) => c.organisation === o);
    const viaEmail = members.filter((c) => has(c.email));
    if (!has(o) && viaEmail.length === 0) return [];
    const lines = [`${members.length} Kontaktpersonen`];
    if (viaEmail.length) lines.push(`Gefundene Übereinstimmung in E-Mail: ${viaEmail.map((c) => c.email).join(', ')}`);
    return [{ id: `org-${o}`, title: o, icon: 'building', lines, kind: 'organisations', lead: false }];
  });
  const people = contacts
    .filter((c) => [c.name, c.email, c.organisation, ...c.phones].some(has))
    .map((c): Hit => ({
      id: c.id,
      title: c.name,
      person: c.name,
      lines: [`${c.organisation} · ${c.email}`, ...(c.phones.some(has) ? [c.phones.join(', ')] : [])],
      kind: 'contacts',
      lead: c.label === 'lead' || c.label === 'hot-lead',
    }));
  return [...orgs, ...people];
}

function inCategory(hits: Hit[], id: string) {
  if (id === 'all') return hits;
  if (id === 'leads') return hits.filter((h) => h.lead);
  return hits.filter((h) => h.kind === id);
}

export function App() {
  const [view, setView] = React.useState('contacts');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);

  const [category, setCategory] = React.useState('all');
  const hits = React.useMemo(() => searchAll(query), [query]);
  const results = React.useMemo(() => inCategory(hits, category), [hits, category]);
  const categories = CATEGORIES.map((c) => ({ ...c, count: query.trim() ? inCategory(hits, c.id).length : undefined }));
  const rows = React.useMemo(() => {
    if (!filter) return contacts;
    return contacts.filter((c) => c.id === filter || `org-${c.organisation}` === filter);
  }, [filter]);

  const onSelect = (hit: GlobalSearchHit) => {
    setFilter(hit.id);
    setQuery(hit.title);
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
      <SideNav
        label="Hauptnavigation"
        items={NAV}
        collapsed
        expandable
        theme="dark"
        logo
        logoLabel="EuvinoPRO"
        sticky
        labels={{ expand: 'Navigation ausklappen', collapse: 'Einklappen' }}
      />

      <Stack gap="0" className="app-main">
        <Header
          size="small"
          layout="between"
          brand={<Breadcrumbs label="Pfad" items={[{ label: 'Kontakte', href: '#' }, { label: 'Kontakte' }]} />}
          actions={
            <>
              <IconButton icon="shop" label="Marktplatz" />
              <IconButton icon="help" label="Hilfe" />
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
          <GlobalSearch
            label="Kontakte, Organisationen und mehr suchen"
            placeholder="Search"
            value={query}
            onChange={onQuery}
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            results={results}
            onSelect={onSelect}
            heading={category === 'all' ? 'Alle Suchergebnisse' : CATEGORIES.find((c) => c.id === category)?.label ?? ''}
            emptyText="Keine Treffer in dieser Kategorie"
            footer={<LinkButton variant="secondary" href="#">Schnellhilfe</LinkButton>}
            labels={{ clear: 'Suche leeren', categories: 'Kategorien', count: (n) => `${n} Treffer` }}
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
