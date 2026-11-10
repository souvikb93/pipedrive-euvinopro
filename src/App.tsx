import * as React from 'react';
import {
  Breadcrumbs,
  Button,
  GlobalSearch,
  Header,
  Icon,
  IconButton,
  LabelPicker,
  LinkButton,
  Menu,
  SegmentedControl,
  SideNav,
  Stack,
  Table,
  Text,
  UserMenu,
  VisuallyHidden,
  useToast,
  type GlobalSearchCategory,
  type GlobalSearchHit,
  type LabelOption,
  type MenuItemDef,
  type SideNavItem,
  type Status,
  type TableColumn,
} from '@euvino/ds';
import './app.css';
import { contacts as initialContacts, TOTAL_CONTACTS, type Contact, type ContactLabel } from './data/contacts';
import { organisations as initialOrganisations, type Organisation } from './data/organisations';
import { hrefFor, useRoute, type View } from './route';
import { OrganisationDetail } from './views/OrganisationDetail';
import { AddOrganisationModal, type NewOrganisation } from './views/AddOrganisationModal';

// Figma: Side Nav, Content=Icon, Theme=Dark, Logo on. Icons in the Figma order, German labels.
// Order is priority: when the window is short, items move into Mehr from the end. Kontakte (this page) stays visible.
const NAV: SideNavItem[] = [
  { label: 'Lead-Posteingang', icon: 'page-edit', href: '#' },
  { label: 'Deals', icon: 'precision-tool', href: '#' },
  { label: 'Umsatzprognose', icon: 'coin', href: '#' },
  { label: 'Aktivitäten', icon: 'chat-bubble-check', href: '#' },
  { label: 'E-Mail', icon: 'send-mail', href: '#', count: 1 },
  { label: 'Kalender', icon: 'shop', href: '#', count: 3, countStatus: 'error' },
  { label: 'Kontakte', icon: 'id-card', href: '#/kontakte', selected: true },
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
const baseLabelOptions = (): LabelOption[] => (Object.keys(LABELS) as ContactLabel[]).map((id) => ({ id, label: LABELS[id].text, status: LABELS[id].status }));
const LABEL_TEXTS = { search: 'Label suchen', add: 'Label hinzufügen', addNamed: (n: string) => `„${n}“ als Label hinzufügen`, empty: 'Kein Label gefunden', none: 'Kein Label' };

const VIEWS = [
  { value: 'contacts', label: 'Kontakte', icon: 'user' as const },
  { value: 'organisations', label: 'Organisationen', icon: 'building' as const },
  { value: 'timeline', label: 'Timeline', icon: 'calendar' as const },
];

const noop = () => {};
const slug = (v: string) => v.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '-').replace(/^-|-$/g, '');

/** "11.11.2026 · 09:00" as a sortable string. */
const activityKey = (v: string) => v.replace(/^(\d{2})\.(\d{2})\.(\d{4}) · (.*)$/, '$3$2$1 $4');

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
function searchAll(query: string, people: Contact[]): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const has = (v: string) => v.toLowerCase().includes(q);
  const orgs = [...new Set(people.map((c) => c.organisation))].flatMap((o): Hit[] => {
    const members = people.filter((c) => c.organisation === o);
    const viaEmail = members.filter((c) => has(c.email));
    if (!has(o) && viaEmail.length === 0) return [];
    const lines = [`${members.length} Kontaktpersonen`];
    if (viaEmail.length) lines.push(`Gefundene Übereinstimmung in E-Mail: ${viaEmail.map((c) => c.email).join(', ')}`);
    return [{ id: `org-${o}`, title: o, icon: 'building', lines, kind: 'organisations', lead: false }];
  });
  const found = people
    .filter((c) => [c.name, c.email, c.organisation, ...c.phones].some(has))
    .map((c): Hit => ({
      id: c.id,
      title: c.name,
      person: c.name,
      lines: [`${c.organisation} · ${c.email}`, ...(c.phones.some(has) ? [c.phones.join(', ')] : [])],
      kind: 'contacts',
      lead: c.label === 'lead' || c.label === 'hot-lead',
    }));
  return [...orgs, ...found];
}

function inCategory(hits: Hit[], id: string) {
  if (id === 'all') return hits;
  if (id === 'leads') return hits.filter((h) => h.lead);
  return hits.filter((h) => h.kind === id);
}

type ContactSort = 'name' | 'organisation' | 'next';
const CONTACT_SORTS: Array<{ key: ContactSort; label: string }> = [
  { key: 'name', label: 'Name (A–Z)' },
  { key: 'organisation', label: 'Organisation (A–Z)' },
  { key: 'next', label: 'Nächste Aktivität' },
];
type OrgSort = 'name' | 'owner' | 'next' | 'last';
const ORG_SORTS: Array<{ key: OrgSort; label: string }> = [
  { key: 'name', label: 'Organisationsname (A–Z)' },
  { key: 'owner', label: 'Besitzer (A–Z)' },
  { key: 'next', label: 'Nächste Aktivität' },
  { key: 'last', label: 'Letzte Aktivität (neueste zuerst)' },
];

/** Label column, label filter and sort menu behave the same in every view; each view keeps its own state. */
function useLabels<T extends { id: string; label: string }>(rows: T[]) {
  const [options, setOptions] = React.useState<LabelOption[]>(baseLabelOptions);
  const [labelOf, setLabelOf] = React.useState<Record<string, string>>(() => Object.fromEntries(rows.map((r) => [r.id, r.label])));
  const name = (id: string | null) => options.find((o) => o.id === id)?.label ?? '';
  const create = (rowId: string, label: string) => {
    const id = `custom-${slug(label)}`;
    setOptions((o) => (o.some((x) => x.id === id) ? o : [...o, { id, label, status: 'default' }]));
    setLabelOf((m) => ({ ...m, [rowId]: id }));
  };
  return { options, labelOf, setLabelOf, name, create };
}

function Toolbar({ view, onView, count, primary, filter, sort }: { view: View; onView: (v: string) => void; count: string; primary: React.ReactNode; filter: React.ReactNode; sort: React.ReactNode }) {
  return (
    <Stack direction="horizontal" gap="4" justify="between" align="center" wrap>
      <SegmentedControl label="Ansicht" value={view} onChange={onView} options={VIEWS} />
      <Stack direction="horizontal" gap="4" align="center" wrap>
        <Text variant="body-small" tone="body">{count}</Text>
        <Stack direction="horizontal" gap="2" align="center">
          {primary}
          {filter}
          {sort}
        </Stack>
      </Stack>
    </Stack>
  );
}

function FilterMenu({ active, activeName, options, onPick }: { active: string | null; activeName: string; options: LabelOption[]; onPick: (id: string | null) => void }) {
  return (
    <Menu
      label="Nach Label filtern"
      trigger={<IconButton icon="filter" label={active ? `Filter einstellen (aktiv: ${activeName})` : 'Filter einstellen'} variant="secondary" indicator={Boolean(active)} />}
      items={[
        { label: 'Alle Labels', selected: active === null, onSelect: () => onPick(null) },
        ...options.map((o): MenuItemDef => ({ label: o.label, selected: active === o.id, onSelect: () => onPick(o.id) })),
      ]}
    />
  );
}

function SortMenu<K extends string>({ active, sorts, onPick }: { active: K | null; sorts: Array<{ key: K; label: string }>; onPick: (k: K | null) => void }) {
  return (
    <Menu
      label="Sortieren"
      trigger={<IconButton icon="sort" label={active ? `Sortieren (${sorts.find((o) => o.key === active)?.label})` : 'Sortieren'} variant="secondary" indicator={Boolean(active)} />}
      items={[
        { label: 'Standard', selected: active === null, onSelect: () => onPick(null) },
        ...sorts.map((o): MenuItemDef => ({ label: o.label, selected: active === o.key, onSelect: () => onPick(o.key) })),
      ]}
    />
  );
}

function RowActions({ name }: { name: string }) {
  return (
    <Menu
      label={`Aktionen für ${name}`}
      trigger={<IconButton icon="more-horiz" label={`Aktionen für ${name}`} size="tiny" />}
      items={[
        { label: 'Bearbeiten', icon: 'edit', onSelect: noop },
        { label: 'E-Mail senden', icon: 'mail', onSelect: noop },
        { label: 'Löschen', icon: 'trash', danger: true, onSelect: noop },
      ]}
    />
  );
}

export function App() {
  const [route, go] = useRoute();
  const toast = useToast();
  const listView: View = route.name === 'list' ? route.view : 'organisations';
  const onView = (v: string) => go(hrefFor.view(v as View));

  // ---- Contacts (Kontakte and Timeline show this list, as before)
  const [people] = React.useState<Contact[]>(initialContacts);
  const contactLabels = useLabels(people);
  const [contactFilter, setContactFilter] = React.useState<string | null>(null);
  const [contactLabelFilter, setContactLabelFilter] = React.useState<string | null>(null);
  const [contactSort, setContactSort] = React.useState<ContactSort | null>(null);
  const [contactSelected, setContactSelected] = React.useState<string[]>([]);
  const contactRows = React.useMemo(() => {
    let list = contactFilter ? people.filter((c) => c.id === contactFilter || `org-${c.organisation}` === contactFilter) : people;
    if (contactLabelFilter) list = list.filter((c) => contactLabels.labelOf[c.id] === contactLabelFilter);
    if (contactSort) {
      const by = (c: Contact) => (contactSort === 'next' ? activityKey(c.nextActivity) : contactSort === 'organisation' ? c.organisation : c.name);
      list = [...list].sort((a, b) => by(a).localeCompare(by(b), 'de'));
    }
    return list;
  }, [people, contactFilter, contactLabelFilter, contactLabels.labelOf, contactSort]);

  // ---- Organisations (own state; nothing here touches the contacts view)
  const [orgs, setOrgs] = React.useState<Organisation[]>(initialOrganisations);
  const updateOrg = (id: string, patch: Partial<Organisation>) => setOrgs((list) => list.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  const orgLabels = useLabels(orgs);
  const [orgLabelFilter, setOrgLabelFilter] = React.useState<string | null>(null);
  const [orgSort, setOrgSort] = React.useState<OrgSort | null>(null);
  const [orgSelected, setOrgSelected] = React.useState<string[]>([]);
  const [adding, setAdding] = React.useState(false);
  const peopleOf = React.useCallback((o: Organisation) => people.filter((c) => c.organisation === o.contactOrg), [people]);
  const orgRows = React.useMemo(() => {
    let list = orgLabelFilter ? orgs.filter((o) => orgLabels.labelOf[o.id] === orgLabelFilter) : orgs;
    if (orgSort) {
      const by = (o: Organisation) => (orgSort === 'next' ? activityKey(o.nextActivity) : orgSort === 'last' ? activityKey(o.lastActivity) : orgSort === 'owner' ? o.owner : o.name);
      list = [...list].sort((a, b) => by(a).localeCompare(by(b), 'de'));
      if (orgSort === 'last') list.reverse();
    }
    return list;
  }, [orgs, orgLabelFilter, orgLabels.labelOf, orgSort]);

  const addOrganisation = (n: NewOrganisation) => {
    let id = slug(n.name) || 'organisation';
    while (orgs.some((o) => o.id === id)) id = `${id}-2`;
    const org: Organisation = {
      id, name: n.name, kind: '', contactOrg: n.name, owner: n.owner, address: n.address, label: 'lead',
      nextActivity: '', lastActivity: '', website: '', phone: '', managingDirector: '', industry: '', postalCode: '',
    };
    setOrgs((list) => [org, ...list]);
    if (n.label) orgLabels.setLabelOf((m) => ({ ...m, [id]: n.label as string }));
    else orgLabels.setLabelOf((m) => { const next = { ...m }; delete next[id]; return next; });
    setAdding(false);
    toast({ title: `${n.name} hinzugefügt`, status: 'success' });
  };

  // ---- Global search
  const [query, setQuery] = React.useState('');
  const [category, setCategory] = React.useState('all');
  React.useEffect(() => { setCategory(listView === 'organisations' ? 'organisations' : 'all'); }, [listView]);
  const hits = React.useMemo(() => searchAll(query, people), [query, people]);
  const results = React.useMemo(() => inCategory(hits, category), [hits, category]);
  const categories = CATEGORIES.map((c) => ({ ...c, count: query.trim() ? inCategory(hits, c.id).length : undefined }));
  const onSelect = (hit: GlobalSearchHit) => {
    const org = hit.id.startsWith('org-') ? orgs.find((o) => `org-${o.contactOrg}` === hit.id) : undefined;
    if (listView === 'organisations' && org) { go(hrefFor.organisation(org.id)); setQuery(''); return; }
    setContactFilter(hit.id);
    setQuery(hit.title);
    if (route.name !== 'list' || listView === 'organisations') go(hrefFor.view('contacts'));
  };
  const onQuery = (v: string) => {
    setQuery(v);
    if (!v) setContactFilter(null);
  };

  const contactColumns: Array<TableColumn<Contact>> = [
    { key: 'name', header: 'Name', overflow: 'truncate', render: (c) => <Text as="span" variant="card-title" tone="strong-body">{c.name}</Text> },
    { key: 'label', header: 'Label', fit: true, render: (c) => (
        <LabelPicker label={`Label für ${c.name}`} value={contactLabels.labelOf[c.id] ?? null} options={contactLabels.options}
          onChange={(id) => contactLabels.setLabelOf((m) => ({ ...m, [c.id]: id }))} onCreate={(n) => contactLabels.create(c.id, n)} labels={LABEL_TEXTS} />
      ) },
    { key: 'organisation', header: 'Organisation', overflow: 'truncate', render: (c) => c.organisation },
    { key: 'email', header: 'E-Mail', overflow: 'truncate', render: (c) => <Linked links={[c.email]} note={c.emailType} scheme="mailto" /> },
    { key: 'phone', header: 'Telefonnummer', overflow: 'truncate', render: (c) => <Linked links={c.phones} note={c.phoneType} scheme="tel" /> },
    { key: 'won', header: 'Abgeschlossene Deals', fit: true, render: (c) => c.wonDeals },
    { key: 'open', header: 'Offene Deals', fit: true, render: (c) => c.openDeals },
    { key: 'next', header: 'Datum nächste Aktivität', fit: true, overflow: 'nowrap', render: (c) => c.nextActivity },
    { key: 'owner', header: 'Besitzer', fit: true, overflow: 'nowrap', render: (c) => c.owner },
    { key: 'actions', fit: true, header: <Icon name="settings" size="sm" />, render: (c) => <RowActions name={c.name} /> },
  ];

  const orgColumns: Array<TableColumn<Organisation>> = [
    { key: 'name', header: 'Organisationsname', overflow: 'truncate', render: (o) => <Text as="span" variant="card-title"><LinkButton variant="link" href={hrefFor.organisation(o.id)}>{o.name}</LinkButton></Text> },
    { key: 'person', header: 'Kontaktperson', overflow: 'truncate', render: (o) => {
        const p = peopleOf(o);
        return p.length ? <>{p[0].name}{p.length > 1 ? <Text as="span" variant="body-small" tone="muted">{` +${p.length - 1}`}</Text> : null}</> : <Text as="span" variant="body-small" tone="muted">–</Text>;
      } },
    { key: 'owner', header: 'Besitzer', fit: true, overflow: 'nowrap', render: (o) => o.owner },
    { key: 'address', header: 'Adresse', overflow: 'truncate', render: (o) => o.address },
    { key: 'label', header: 'Label', fit: true, render: (o) => (
        <LabelPicker label={`Label für ${o.name}`} value={orgLabels.labelOf[o.id] ?? null} options={orgLabels.options}
          onChange={(id) => orgLabels.setLabelOf((m) => ({ ...m, [o.id]: id }))} onCreate={(n) => orgLabels.create(o.id, n)} labels={LABEL_TEXTS} />
      ) },
    { key: 'next', header: 'Nächste Aktivität', fit: true, overflow: 'nowrap', render: (o) => o.nextActivity || '–' },
    { key: 'last', header: 'Letzte Aktivität', fit: true, overflow: 'nowrap', render: (o) => o.lastActivity || '–' },
    { key: 'actions', fit: true, header: <Icon name="settings" size="sm" />, render: (o) => <RowActions name={o.name} /> },
  ];

  const detail = route.name === 'organisation' ? orgs.find((o) => o.id === route.id) : undefined;
  const crumbs =
    route.name === 'organisation'
      ? [{ label: 'Kontakte', href: hrefFor.view('contacts') }, { label: 'Organisationen', href: hrefFor.view('organisations') }, { label: detail?.name ?? 'Organisation' }]
      : [{ label: 'Kontakte', href: hrefFor.view('contacts') }, { label: listView === 'organisations' ? 'Organisationen' : 'Kontakte' }];
  const heading = route.name === 'organisation' ? null : listView === 'organisations' ? 'Organisationen' : 'Kontakte';
  const contactsNarrowed = Boolean(contactFilter || contactLabelFilter);

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
          brand={<Breadcrumbs label="Pfad" items={crumbs} />}
          actions={
            <>
              <IconButton icon="shop" label="Marktplatz" />
              <IconButton icon="help" label="Hilfe" />
              <Menu
                label="Konto"
                trigger={<UserMenu name="Johannes Finzer" compact />}
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
            placeholder={route.name === 'list' && listView === 'organisations' ? 'Organisationen suchen' : 'Search'}
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
          {heading ? <VisuallyHidden><Text as="h1" variant="h1">{heading}</Text></VisuallyHidden> : null}

          {route.name === 'organisation' ? (
            detail ? (
              <OrganisationDetail
                organisation={detail}
                people={peopleOf(detail)}
                labelOptions={orgLabels.options}
                labelId={orgLabels.labelOf[detail.id] ?? null}
                onLabelChange={(id) => orgLabels.setLabelOf((m) => ({ ...m, [detail.id]: id }))}
                onLabelCreate={(n) => orgLabels.create(detail.id, n)}
                onUpdate={(patch) => updateOrg(detail.id, patch)}
              />
            ) : (
              <Stack gap="4">
                <Text as="h1" variant="h4">Organisation nicht gefunden</Text>
                <Stack direction="horizontal"><Button variant="secondary" icon="arrow-left" onClick={() => go(hrefFor.view('organisations'))}>Zu den Organisationen</Button></Stack>
              </Stack>
            )
          ) : listView === 'organisations' ? (
            <>
              <Toolbar
                view="organisations"
                onView={onView}
                count={`${orgLabelFilter ? `${orgRows.length} von ${orgs.length}` : orgs.length} Organisationen`}
                primary={<Button variant="primary" icon="plus" onClick={() => setAdding(true)}>Organisation hinzufügen</Button>}
                filter={<FilterMenu active={orgLabelFilter} activeName={orgLabels.name(orgLabelFilter)} options={orgLabels.options} onPick={setOrgLabelFilter} />}
                sort={<SortMenu active={orgSort} sorts={ORG_SORTS} onPick={setOrgSort} />}
              />
              <Table
                caption="Organisationen"
                rows={orgRows}
                rowKey={(o) => o.id}
                columns={orgColumns}
                selected={orgSelected}
                onSelectedChange={setOrgSelected}
                labels={{ selectAll: 'Alle auswählen', selectRow: (o) => `${o.name} auswählen` }}
              />
              <AddOrganisationModal open={adding} onClose={() => setAdding(false)} onAdd={addOrganisation} labelOptions={orgLabels.options} owners={['Johannes', 'Maximilian Eul', 'Beate Schmitt']} />
            </>
          ) : (
            <>
              <Toolbar
                view={listView}
                onView={onView}
                count={`${contactsNarrowed ? `${contactRows.length} von ${TOTAL_CONTACTS}` : TOTAL_CONTACTS} Kontaktpersonen`}
                primary={<Button variant="primary" icon="plus">Kontakte</Button>}
                filter={<FilterMenu active={contactLabelFilter} activeName={contactLabels.name(contactLabelFilter)} options={contactLabels.options} onPick={setContactLabelFilter} />}
                sort={<SortMenu active={contactSort} sorts={CONTACT_SORTS} onPick={setContactSort} />}
              />
              <Table
                caption="Kontaktpersonen"
                rows={contactRows}
                rowKey={(c) => c.id}
                columns={contactColumns}
                selected={contactSelected}
                onSelectedChange={setContactSelected}
                labels={{ selectAll: 'Alle auswählen', selectRow: (c) => `${c.name} auswählen` }}
              />
            </>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
