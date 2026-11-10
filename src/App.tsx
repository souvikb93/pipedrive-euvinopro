import * as React from 'react';
import {
  Badge,
  Breadcrumbs,
  Button,
  Header,
  IconButton,
  Input,
  LinkButton,
  Menu,
  SegmentedControl,
  SideNav,
  Stack,
  Table,
  Text,
  UserMenu,
  VisuallyHidden,
  type SideNavItem,
  type Status,
  type TableColumn,
} from '@euvino/ds';
import './app.css';
import { contacts, TOTAL_CONTACTS, type Contact, type ContactLabel } from './data/contacts';

// Figma: Side Nav, Content=Icon, Theme=Dark. "Data Transfer" is the selected item.
const NAV: SideNavItem[] = [
  { label: 'Overview', icon: 'home', href: '#' },
  { label: 'Product Catalog', icon: 'box', href: '#' },
  { label: 'Requests', icon: 'page', href: '#' },
  { label: 'Data Validation', icon: 'check-circle', href: '#' },
  { label: 'Suppliers', icon: 'mail', href: '#', count: 1 },
  { label: 'Trading Partners', icon: 'group', href: '#', count: 3 },
  { label: 'Data Transfer', icon: 'cloud-sync', href: '#', selected: true },
  { label: 'Reports', icon: 'download', href: '#' },
  { label: 'Settings', icon: 'settings', href: '#' },
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
  { value: 'contacts', label: 'Kontakte', icon: 'menu' as const },
  { value: 'organisations', label: 'Organisationen', icon: 'group' as const },
  { value: 'timeline', label: 'Timeline', icon: 'calendar' as const },
];

const noop = () => {};

export function App() {
  const [view, setView] = React.useState('contacts');
  const [query, setQuery] = React.useState('');
  const [selected, setSelected] = React.useState<string[]>([]);

  const rows = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => [c.name, c.organisation, c.email].some((v) => v.toLowerCase().includes(q)));
  }, [query]);

  const columns: Array<TableColumn<Contact>> = [
    { key: 'name', header: 'Name', render: (c) => <Text variant="label" tone="primary">{c.name}</Text> },
    {
      key: 'label',
      header: 'Label',
      render: (c) => <Badge size="tiny" status={LABELS[c.label].status}>{LABELS[c.label].text}</Badge>,
    },
    { key: 'organisation', header: 'Organisation', render: (c) => c.organisation },
    { key: 'email', header: 'E-Mail', render: (c) => <LinkButton variant="primary" href="#">{c.email}</LinkButton> },
    { key: 'phone', header: 'Telefonnummer', render: (c) => <LinkButton variant="primary" href="#">{c.phone}</LinkButton> },
    { key: 'won', header: 'Abgeschlossene Deals', align: 'right', render: (c) => c.wonDeals },
    { key: 'open', header: 'Offene Deals', align: 'right', render: (c) => c.openDeals },
    { key: 'next', header: 'Datum nächste Aktivität', render: (c) => c.nextActivity },
    { key: 'owner', header: 'Besitzer', render: (c) => c.owner },
    {
      key: 'actions',
      header: <IconButton icon="settings" label="Spalten anpassen" size="small" />,
      render: (c) => (
        <Menu
          label={`Aktionen für ${c.name}`}
          trigger={<IconButton icon="more-horiz" label={`Aktionen für ${c.name}`} size="small" />}
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
    <Stack direction="horizontal" gap="0" align="stretch" className="app-shell">
      <SideNav label="Hauptnavigation" items={NAV} collapsed />

      <Stack gap="0" className="app-main">
        <Header
          size="large"
          brand={<Breadcrumbs label="Pfad" items={[{ label: 'CRM', href: '#' }, { label: 'Kontakte' }]} />}
          actions={
            <>
              <IconButton icon="box" label="Marktplatz" size="large" />
              <IconButton icon="help" label="Hilfe" size="large" />
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
          <Input
            label="Suche"
            hideLabel
            placeholder="Search"
            iconLeft="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            labels={{ clear: 'Suche leeren' }}
          />
        </Header>

        <Stack as="main" gap="6" padding="6">
          <VisuallyHidden>
            <Text as="h1" variant="h1">Kontakte</Text>
          </VisuallyHidden>

          <Stack direction="horizontal" gap="4" justify="between" align="center" wrap>
            <SegmentedControl label="Ansicht" value={view} onChange={setView} options={VIEWS} />
            <Stack direction="horizontal" gap="4" align="center" wrap>
              <Text variant="body" tone="body">{TOTAL_CONTACTS} Kontaktpersonen</Text>
              <Button variant="secondary" icon="sort">Filter einstellen</Button>
              <Button variant="primary" icon="plus">Kontakte</Button>
            </Stack>
          </Stack>

          <Stack gap="0" className="contacts-table">
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
    </Stack>
  );
}
