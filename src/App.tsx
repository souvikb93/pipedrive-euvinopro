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

// Figma: Side Nav, Content=Icon, Theme=Dark, Logo on. Icons in the Figma order, German labels.
// Order is priority: when the window is short, items move into Mehr from the end. Kontakte (this page) stays visible.
const NAV: SideNavItem[] = [
  { label: 'Lead-Posteingang', icon: 'page-edit', href: '#' },
  { label: 'Deals', icon: 'precision-tool', href: '#' },
  { label: 'Umsatzprognose', icon: 'coin', href: '#' },
  { label: 'Aktivitäten', icon: 'chat-bubble-check', href: '#' },
  { label: 'E-Mail', icon: 'send-mail', href: '#', count: 1 },
  { label: 'Kalender', icon: 'shop', href: '#', count: 3, countStatus: 'error' },
  { label: 'Kontakte', icon: 'credit-cards', href: '#', selected: true },
  { label: 'Einblicke', icon: 'stats-down-square', href: '#' },
  { label: 'Produkte', icon: 'box-iso', href: '#' },
];

// Always in the Mehr menu (placeholders until the real list is known).
const MORE: SideNavItem[] = [
  { label: 'Projekte', icon: 'page', href: '#' },
  { label: 'Kampagnen', icon: 'globe', href: '#' },
  { label: 'Einstellungen', icon: 'settings', href: '#' },
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

type SortKey = 'name' | 'organisation' | 'next';
const SORTS: Array<{ key: SortKey; label: string }> = [
  { key: 'name', label: 'Name (A–Z)' },
  { key: 'organisation', label: 'Organisation (A–Z)' },
  { key: 'next', label: 'Nächste Aktivität' },
];
/** "11.11.2026 · 09:00" as a sortable string. */
const activityKey = (v: string) => v.replace(/^(\d{2})\.(\d{2})\.(\d{4}) · (.*)$/, '$3$2$1 $4');

export function App() {
  const [view, setView] = React.useState('contacts');
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<string | null>(null);
  const [selected, setSelected] = React.useState<string[]>([]);

  const [category, setCategory] = React.useState('all');
  const hits = React.useMemo(() => searchAll(query), [query]);
  const results = React.useMemo(() => inCategory(hits, category), [hits, category]);
  const categories = CATEGORIES.map((c) => ({ ...c, count: query.trim() ? inCategory(hits, c.id).length : undefined }));
  const [labelFilter, setLabelFilter] = React.useState<ContactLabel | null>(null);
  const [sort, setSort] = React.useState<SortKey | null>(null);
  const rows = React.useMemo(() => {
    let list = filter ? contacts.filter((c) => c.id === filter || `org-${c.organisation}` === filter) : contacts;
    if (labelFilter) list = list.filter((c) => c.label === labelFilter);
    if (sort) {
      const by = (c: Contact) => (sort === 'next' ? activityKey(c.nextActivity) : sort === 'organisation' ? c.organisation : c.name);
      list = [...list].sort((a, b) => by(a).localeCompare(by(b), 'de'));
    }
    return list;
  }, [filter, labelFilter, sort]);
  const narrowed = Boolean(filter || labelFilter);

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
        overflow
        moreItems={MORE}
        theme="dark"
        logo
        logoLabel="EuvinoPRO"
        sticky
        labels={{ expand: 'Navigation ausklappen', collapse: 'Einklappen', more: 'Mehr' }}
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
                trigger={<UserMenu name="Johannes" subtitle="EuvinoPRO" />}
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
              <Text variant="body-small" tone="body">{narrowed ? `${rows.length} von ${TOTAL_CONTACTS}` : TOTAL_CONTACTS} Kontaktpersonen</Text>
              <Stack direction="horizontal" gap="2" align="center">
                <Button variant="primary" icon="plus">Kontakte</Button>
                <Menu
                  label="Nach Label filtern"
                  trigger={<IconButton icon="filter" label={labelFilter ? `Filter einstellen (aktiv: ${LABELS[labelFilter].text})` : 'Filter einstellen'} variant="secondary" indicator={Boolean(labelFilter)} />}
                  items={[
                    { label: 'Alle Labels', selected: labelFilter === null, onSelect: () => setLabelFilter(null) },
                    ...(Object.keys(LABELS) as ContactLabel[]).map((k) => ({ label: LABELS[k].text, selected: labelFilter === k, onSelect: () => setLabelFilter(k) })),
                  ]}
                />
                <Menu
                  label="Sortieren"
                  trigger={<IconButton icon="sort" label={sort ? `Sortieren (${SORTS.find((o) => o.key === sort)?.label})` : 'Sortieren'} variant="secondary" indicator={Boolean(sort)} />}
                  items={[
                    { label: 'Standard', selected: sort === null, onSelect: () => setSort(null) },
                    ...SORTS.map((o) => ({ label: o.label, selected: sort === o.key, onSelect: () => setSort(o.key) })),
                  ]}
                />
              </Stack>
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
