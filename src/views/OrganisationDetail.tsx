import * as React from 'react';
import {
  ActivityCard,
  ActivityItem,
  Editor,
  Avatar,
  Badge,
  BreakdownBar,
  Button,
  Card,
  Divider,
  EmptyState,
  FilterTabs,
  Icon,
  IconButton,
  KeyValueList,
  LabelPicker,
  LinkButton,
  Menu,
  PageHeader,
  Stack,
  Text,
  Timeline,
  Toggle,
  TopNav,
  type IconName,
  type LabelOption,
} from '@euvino/ds';
import type { Contact } from '../data/contacts';
import { organisations, type Organisation } from '../data/organisations';
import { TEAM, addDays, hm, shortDay, type Participant } from '../data/availability';
import { PlanActivity } from './PlanActivity';
import { ActivityModal } from './ActivityModal';
import { TODAY, daysSince, germanDate, historyFor, nextActivityFor, shortGermanDate, type FocusActivity, type HistoryEntry, type HistoryKind } from '../data/history';
import { hrefFor } from '../route';

// Layout from Figma (Pipedrive New, node 1:3486); copy and history pattern from the German reference screen.
// Only Notizen and Aktivität have content yet. The other tabs show hover feedback but stay unselected.
const COMPOSER: Array<{ id: string; label: string; icon: IconName; placeholder: string; kind: HistoryKind; saved: string }> = [
  { id: 'notes', label: 'Notizen', icon: 'edit', placeholder: 'Notiz schreiben … Mit @ jemanden erwähnen', kind: 'note', saved: 'Notiz gespeichert' },
  { id: 'activity', label: 'Aktivität', icon: 'calendar', placeholder: 'Aktivität beschreiben', kind: 'activity', saved: 'Aktivität gespeichert' },
  { id: 'call', label: 'Anruf', icon: 'phone', placeholder: 'Anruf protokollieren', kind: 'call', saved: 'Anruf gespeichert' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat-bubble', placeholder: 'WhatsApp-Nachricht schreiben', kind: 'whatsapp', saved: 'WhatsApp-Nachricht gespeichert' },
  { id: 'email', label: 'E-Mail', icon: 'mail', placeholder: 'E-Mail schreiben', kind: 'email', saved: 'E-Mail gespeichert' },
  { id: 'files', label: 'Dateien', icon: 'attachment', placeholder: 'Beschreibung zur Datei', kind: 'file', saved: 'Datei gespeichert' },
  { id: 'documents', label: 'Dokumente', icon: 'page', placeholder: 'Beschreibung zum Dokument', kind: 'note', saved: 'Dokument gespeichert' },
];

const KIND_ICON: Record<HistoryKind, IconName> = { email: 'mail', note: 'edit', call: 'phone', activity: 'calendar', whatsapp: 'chat-bubble', file: 'attachment', change: 'clock' };

// History filters. Only Alle, Notizen and Aktivitäten can be chosen for now; the others are shown but inert.
const FILTERS: Array<{ id: string; label: string; kinds: HistoryKind[] | null; live: boolean; counted: boolean }> = [
  { id: 'all', label: 'Alle', kinds: null, live: true, counted: false },
  { id: 'notes', label: 'Notizen', kinds: ['note'], live: true, counted: true },
  { id: 'activities', label: 'Aktivitäten', kinds: ['activity', 'call'], live: true, counted: true },
  { id: 'whatsapp', label: 'WhatsApp', kinds: ['whatsapp'], live: false, counted: false },
  { id: 'emails', label: 'E-Mails', kinds: ['email'], live: false, counted: false },
  { id: 'files', label: 'Dateien', kinds: ['file'], live: false, counted: false },
  { id: 'documents', label: 'Dokumente', kinds: [], live: false, counted: false },
  { id: 'leads', label: 'Leads', kinds: [], live: false, counted: false },
  { id: 'deals', label: 'Deals', kinds: [], live: false, counted: false },
  { id: 'changes', label: 'Änderungsprotokoll', kinds: ['change'], live: false, counted: false },
];

const noop = () => {};

/** City and country out of an address such as "Street 1, 12345 City, Country". */
function placeOf(address: string): string {
  const parts = address.split(',').map((p) => p.trim()).filter(Boolean);
  if (parts.length < 2) return address;
  const city = parts[parts.length - 2].replace(/^\d{4,5}\s+/, '');
  return `${city}, ${parts[parts.length - 1]}`;
}

/** Fokus: the next planned activity, first section of the side card. The whole box opens the activity; the names inside are their own links. */
function FocusActivityBox({ activity, participants, onOpen, onSoon }: { activity: FocusActivity | null; participants: Participant[]; onOpen: () => void; onSoon: (what: string) => void }) {
  const shown = participants.slice(0, 2);
  const more = participants.length - shown.length;
  return (
    <>
      {activity ? (
        <ActivityCard
          title={activity.title}
          type={activity.type}
          onOpen={onOpen}
          rows={[
            { icon: 'calendar', content: `${shortDay(activity.day)} · ${hm(activity.start)}–${hm(activity.end)}` },
            {
              icon: 'user',
              content: (
                <>
                  {shown.map((p, i) => (
                    <React.Fragment key={p.id}>
                      {i > 0 ? ', ' : null}
                      {p.kind === 'contact'
                        ? <LinkButton variant="link" href={hrefFor.contact(p.id)}>{p.name}</LinkButton>
                        : <LinkButton variant="link" href="#" onClick={(e) => { e.preventDefault(); onSoon(p.name); }}>{p.name}</LinkButton>}
                    </React.Fragment>
                  ))}
                  {more > 0 ? <Text as="span" variant="body-small" tone="muted">{` +${more}`}</Text> : null}
                </>
              ),
            },
          ]}
        />
      ) : <Text variant="body-small" tone="muted">Keine Aktivität geplant.</Text>}
    </>
  );
}

// Activity kinds counted in Überblick, with their German names.
const ACTIVITY_LABEL: Partial<Record<HistoryKind, string>> = { call: 'Anruf', activity: 'Termin', note: 'Notiz', email: 'E-Mail', whatsapp: 'WhatsApp' };

function EntryActions({ e }: { e: HistoryEntry }) {
  if (e.kind === 'email') {
    return (
      <>
        <IconButton icon="arrow-separate-vertical" label="Ganze Unterhaltung anzeigen" size="small" />
        <Menu label="Sichtbarkeit" trigger={<IconButton icon="lock" label="Sichtbarkeit: privat" size="small" variant="primary" />} items={[{ label: 'Privat', icon: 'lock', selected: true, onSelect: noop }, { label: 'Mit dem Team teilen', icon: 'group', selected: false, onSelect: noop }]} />
        {e.attachments?.length ? (
          <Menu label="Anhänge" trigger={<IconButton icon="attachment" label={`${e.attachments.length} Anhang`} size="small" variant="secondary" />} items={e.attachments.map((a) => ({ label: a, icon: 'download' as IconName, onSelect: noop }))} />
        ) : null}
        <Button variant="secondary" size="small" icon="reply">Antworten</Button>
        <Menu label="Weitere Antwortoptionen" trigger={<IconButton icon="nav-down" label="Weitere Antwortoptionen" size="small" variant="secondary" />} items={[{ label: 'Allen antworten', onSelect: noop }, { label: 'Weiterleiten', onSelect: noop }]} />
      </>
    );
  }
  if (e.kind === 'whatsapp') return <Button variant="secondary" size="small" icon="reply">Antworten</Button>;
  if (e.kind === 'file') {
    return (
      <>
        <IconButton icon="download" label={`${e.title} herunterladen`} size="small" variant="secondary" />
        <Menu label={`Aktionen für ${e.title}`} trigger={<IconButton icon="more-horiz" label={`Aktionen für ${e.title}`} size="small" />} items={[{ label: 'Umbenennen', icon: 'edit', onSelect: noop }, { label: 'Löschen', icon: 'trash', danger: true, onSelect: noop }]} />
      </>
    );
  }
  if (e.kind === 'change') return null;
  return (
    <Menu
      label={`Aktionen für ${e.title}`}
      trigger={<IconButton icon="more-horiz" label={`Aktionen für ${e.title}`} size="small" />}
      items={[{ label: 'Bearbeiten', icon: 'edit', onSelect: noop }, ...(e.kind === 'note' ? [{ label: 'Anheften', icon: 'star' as IconName, onSelect: noop }] : []), { label: 'Löschen', icon: 'trash', danger: true, onSelect: noop }]}
    />
  );
}

function EntryFooter({ e }: { e: HistoryEntry }) {
  if (!e.people && !e.organisation && e.kind !== 'email') return null;
  return (
    <>
      {e.people ? <Stack as="span" direction="horizontal" gap="1" align="center"><Icon name="user" size="sm" />{e.people}</Stack> : null}
      {e.organisation ? <Stack as="span" direction="horizontal" gap="1" align="center"><Icon name="building" size="sm" />{e.organisation}</Stack> : null}
      {e.kind === 'email' ? <Stack as="span" direction="horizontal" gap="1" align="center"><Icon name="link" size="sm" /><LinkButton variant="link" href="#">Element verbinden</LinkButton></Stack> : null}
    </>
  );
}

export interface OrganisationDetailProps {
  organisation: Organisation;
  people: Contact[];
  labelOptions: LabelOption[];
  labelId: string | null;
  onLabelChange: (id: string) => void;
  onLabelCreate: (name: string) => void;
  /** Opens the Kontakt modal. */
  onAddContact: () => void;
  /** Placeholder for actions this prototype does not build yet. */
  onSoon: (what: string) => void;
  /** Confirms that something just happened. */
  onNotify: (title: string) => void;
}

export function OrganisationDetail({ organisation: o, people, labelOptions, labelId, onLabelChange, onLabelCreate, onAddContact, onSoon, onNotify }: OrganisationDetailProps) {
  const [composer, setComposer] = React.useState('notes');
  const [historyFilter, setHistoryFilter] = React.useState('all');
  const [expandAll, setExpandAll] = React.useState(false);
  const [draft, setDraft] = React.useState('');
  const [added, setAdded] = React.useState<HistoryEntry[]>([]);
  React.useEffect(() => { setDraft(''); setAdded([]); }, [o.id]);
  const history = React.useMemo(() => [...added, ...historyFor(o, people)], [added, o, people]);
  const contactsAsPeople = React.useMemo<Participant[]>(() => people.map((p) => ({ id: p.id, name: p.name, photo: p.photo, kind: 'contact' })), [people]);
  const [focus, setFocus] = React.useState(() => nextActivityFor(o, Math.max(0, organisations.findIndex((x) => x.id === o.id))));
  const [focusPeople, setFocusPeople] = React.useState<Participant[]>([]);
  const [activityOpen, setActivityOpen] = React.useState(false);
  React.useEffect(() => {
    setFocus(nextActivityFor(o, Math.max(0, organisations.findIndex((x) => x.id === o.id))));
    setFocusPeople([TEAM[0], TEAM[1], ...contactsAsPeople.slice(0, 1)]);
    setActivityOpen(false);
  }, [o, contactsAsPeople]);
  React.useEffect(() => { setHistoryFilter('all'); }, [o.id]);

  // Überblick is worked out from the history and this organisation's own contact records. Refresh works it out again.
  // The side column scrolls with the page; once its end is in view it stays there while the main column goes on.
  const sideRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = sideRef.current;
    if (!el) return undefined;
    const measure = () => el.style.setProperty('--detail-side-h', `${el.offsetHeight}px`);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const [overviewVersion, setOverviewVersion] = React.useState(0);
  const overview = React.useMemo(() => {
    const kinds = Object.entries(ACTIVITY_LABEL) as Array<[HistoryKind, string]>;
    const activities = kinds
      .map(([k, label]) => ({ label, value: history.filter((h) => h.kind === k).length }))
      .filter((a) => a.value > 0)
      .sort((a, b) => b.value - a.value);
    const mentions = (name: string) => history.filter((h) => [h.title, h.meta, h.people ?? '', h.preview ?? ''].some((t) => t.includes(name))).length;
    const users = people
      .map((p) => ({ label: p.name, value: mentions(p.name), href: hrefFor.contact(p.id) }))
      .filter((u) => u.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 3);
    const days = history.map((h) => h.day).sort();
    return {
      activities,
      users,
      inactive: days.length ? String(daysSince(days[days.length - 1])) : '–',
      created: days.length ? shortGermanDate(days[0]) : '–',
    };
  }, [history, people, overviewVersion]); // eslint-disable-line react-hooks/exhaustive-deps
  const refreshOverview = () => { setOverviewVersion((v) => v + 1); onNotify('Überblick aktualisiert'); };

  const field = (label: string, value: string, display?: React.ReactNode) => ({ label, text: value, value: value ? display ?? value : '–' });
  const details = [
    field('Website', o.website, <LinkButton variant="link" href={o.website} target="_blank" rel="noreferrer">{o.website}</LinkButton>),
    field('Telefonnummer', o.phone, <LinkButton variant="link" href={`tel:${o.phone.replace(/[^+\d]/g, '')}`}>{o.phone.replace(/\s/g, '')}</LinkButton>),
    field('Geschäftsführer', o.managingDirector, <LinkButton variant="link" href="#">{o.managingDirector}</LinkButton>),
    field('Branchenzweig', o.industry, <Badge size="tiny">{o.industry}</Badge>),
    field('PLZ', o.postalCode),
    { label: 'Interner Admin', text: 'backend', value: <LinkButton variant="link" href={`https://backend.euvinopro.eu/admin/vendors/${o.id}`} target="_blank" rel="noreferrer">{`backend.euvinopro.eu/admin/vendors/${o.id}`}</LinkButton> },
  ];

  const countOf = (kinds: HistoryKind[] | null) => (kinds === null ? history.length : history.filter((h) => kinds.includes(h.kind)).length);
  const active = FILTERS.find((f) => f.id === historyFilter) ?? FILTERS[0];
  const shown = active.kinds === null ? history : history.filter((h) => active.kinds?.includes(h.kind));
  const tab = COMPOSER.find((c) => c.id === composer) ?? COMPOSER[0];

  const section = (id: string, title: string, action: React.ReactNode, body: React.ReactNode) => ({
    id,
    node: (
      <Stack as="section" gap="3" aria-labelledby={`side-${id}`}>
        <Stack direction="horizontal" gap="2" align="center" justify="between">
          <Text as="h2" id={`side-${id}`} variant="h6">{title}</Text>
          {action ? <Stack direction="horizontal" gap="1" align="center">{action}</Stack> : null}
        </Stack>
        {body}
      </Stack>
    ),
  });
  const edit = (what: string) => <IconButton icon="edit" label={`${what} bearbeiten`} size="small" onClick={() => onSoon(`${what} bearbeiten`)} />;
  const add = (label: string, onClick: () => void) => <IconButton icon="plus" label={label} size="small" onClick={onClick} />;
  const empty = (text: string) => <Text variant="body-small" tone="muted">{text}</Text>;

  const sections = [
    section('focus', 'Fokus', null, <FocusActivityBox activity={focus} participants={focusPeople} onOpen={() => setActivityOpen(true)} onSoon={onSoon} />),
    section('organisation', 'Organisationsdetails', edit('Organisationsdetails'), <KeyValueList layout="columns" items={details.map(({ label, value }) => ({ label, value }))} />),
    section('related', 'Zugehörige Organisationen', add('Organisation verknüpfen', () => onSoon('Organisation verknüpfen')), empty('Noch keine zugehörigen Organisationen hinzugefügt.')),
    section('contacts', 'Kontakte', add('Kontakt hinzufügen', onAddContact), people.length ? (
      <Text as="div" variant="body-small"><Stack gap="2" as="ul" className="detail-list">
        {people.map((p) => (
          <Stack as="li" key={p.id} direction="horizontal" gap="2" align="center" justify="between">
            <Stack direction="horizontal" gap="2" align="center">
              <Avatar name={p.name} src={p.photo} size="tiny" />
              <LinkButton variant="link" href={hrefFor.contact(p.id)}>{p.name}</LinkButton>
            </Stack>
            <Stack direction="horizontal" gap="1" align="center">
              <IconButton icon="phone" label={`${p.name} anrufen`} size="small" disabled={!p.phones.length} onClick={() => onSoon(`${p.name} anrufen`)} />
              <IconButton icon="mail" label={`E-Mail an ${p.name}`} size="small" disabled={!p.email} onClick={() => onSoon(`E-Mail an ${p.name}`)} />
            </Stack>
          </Stack>
        ))}
      </Stack></Text>
    ) : empty('Noch keine Kontakte hinzugefügt.')),
    section('overview', 'Überblick', <IconButton icon="refresh" label="Überblick aktualisieren" size="small" onClick={refreshOverview} />, (
      <Stack gap="4">
        <Stack gap="2">
          <Text as="h3" variant="caption-strong">Top-Aktivitäten</Text>
          {overview.activities.length ? <BreakdownBar label="Top-Aktivitäten" items={overview.activities} /> : empty('Noch keine Aktivitäten.')}
        </Stack>
        <Stack gap="2">
          <Text as="h3" variant="caption-strong">Aktivste Nutzer</Text>
          {overview.users.length ? <BreakdownBar label="Aktivste Nutzer" items={overview.users} /> : empty('Noch keine Aktivitäten.')}
        </Stack>
        <KeyValueList layout="columns" items={[{ label: 'Inaktiv (Tage)', value: overview.inactive }, { label: 'Erstellt', value: overview.created }]} />
      </Stack>
    )),
    section('leads', 'Leads', add('Lead hinzufügen', () => onSoon('Lead hinzufügen')), empty('Noch keine Leads hinzugefügt.')),
  ];

  return (
    <Stack gap="4">
      <PageHeader
        title={o.name}
        icon="organisation"
        meta={(
          <>
            <span>
              <LabelPicker
                size="small"
                label={`Label für ${o.name}`}
                value={labelId}
                options={labelOptions}
                onChange={onLabelChange}
                onCreate={onLabelCreate}
                labels={{ search: 'Label suchen', add: 'Label hinzufügen', addNamed: (n) => `„${n}“ als Label hinzufügen`, empty: 'Kein Label gefunden', none: 'Label hinzufügen' }}
              />
            </span>
            {o.address ? (
              <span>
                <Icon name="map-pin" size="sm" />
                <LinkButton variant="plain" href={`https://maps.google.com/?q=${encodeURIComponent(o.address)}`} target="_blank" rel="noreferrer" title={o.address}>{placeOf(o.address)}</LinkButton>
              </span>
            ) : null}
          </>
        )}
      />

      <Stack direction="horizontal" gap="8" align="start" wrap>
        <div className="detail-side" ref={sideRef}><Stack gap="3">
          {sections.length ? (
            <Card padding="medium">
              <Stack gap="4">
                {sections.map((sec, i) => (
                  <React.Fragment key={sec.id}>
                    {i > 0 ? <Divider /> : null}
                    {sec.node}
                  </React.Fragment>
                ))}
              </Stack>
            </Card>
          ) : null}
        </Stack></div>

        <Stack gap="6" className="detail-main">
          <Card padding="medium">
            <TopNav label="Zum Verlauf hinzufügen" items={COMPOSER.map((c) => ({ label: c.label, icon: c.icon, selected: composer === c.id, onClick: () => { if (c.id === 'notes' || c.id === 'activity') setComposer(c.id); } }))} />
            {composer === 'activity' ? (
              <PlanActivity
                key={o.id}
                from={addDays(`${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`, 1)}
                participants={[TEAM[0], TEAM[1], ...contactsAsPeople.slice(0, 1)]}
                candidates={[...TEAM, ...contactsAsPeople]}
                onCancel={() => setComposer('notes')}
                onPlan={(a, list) => {
                  setComposer('notes');
                  setAdded((h) => [{ id: `plan-${Date.now()}`, kind: a.kind === 'call' ? 'call' : 'activity', day: a.day, title: `${a.type} geplant: ${a.title}`, meta: `${hm(a.start)}–${hm(a.end)} · ${list.map((p) => p.name).join(', ')}`, people: list.length > 1 ? `${list[1].name}${list.length > 2 ? ` (+${list.length - 2})` : ''}` : undefined }, ...h]);
                  if (!focus || a.day < focus.day || (a.day === focus.day && a.start < focus.start)) { setFocus(a); setFocusPeople(list); }
                  onNotify(`Einladung an ${list.length - 1} Teilnehmer gesendet`);
                }}
              />
            ) : (
              <Editor
                label={tab.label}
                placeholder={tab.placeholder}
                value={draft}
                onChange={setDraft}
                onSave={(text) => {
                  const today = `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`;
                  const plain = text.replace(/\*\*|<\/?u>|(^|\s)_|_(\s|$)/g, '$1$2');
                  setAdded((a) => [{ id: `new-${Date.now()}`, kind: tab.kind, day: today, title: tab.label === 'Notizen' ? 'Notiz' : tab.label, meta: 'Johannes Finzer', preview: plain }, ...a]);
                  setDraft('');
                  onNotify(tab.saved);
                }}
                labels={{ toolbar: 'Formatierung', bold: 'Fett', italic: 'Kursiv', underline: 'Unterstrichen', bullets: 'Aufzählung', numbers: 'Nummerierte Liste', link: 'Link einfügen', mention: 'Jemanden erwähnen', cancel: 'Abbrechen', save: 'Speichern' }}
              />
            )}
          </Card>

          <Stack gap="4">
            <Stack direction="horizontal" gap="2" align="center" justify="between" wrap>
              <Text as="h2" variant="h5">Verlauf</Text>
              <Toggle label="Alle Elemente ausklappen" checked={expandAll} onChange={setExpandAll} textSide="left" />
            </Stack>
            {(
              <>
                <FilterTabs
                  variant="chip"
                  label="Verlauf filtern"
                  value={historyFilter}
                  onChange={setHistoryFilter}
                  items={FILTERS.map((f) => ({ id: f.id, label: f.label, count: f.counted ? countOf(f.kinds) : undefined, inert: !f.live }))}
                />
                {shown.length ? (
                  <Timeline label="Verlauf">
                    {shown.map((e) => (
                      <ActivityItem
                        key={e.id}
                        icon={KIND_ICON[e.kind]}
                        title={e.title}
                        meta={`${germanDate(e.day)} · ${e.meta}`}
                        actions={<EntryActions e={e} />}
                        footer={<EntryFooter e={e} />}
                        expanded={expandAll}
                        onOpen={noop}
                      >
                        {e.preview}
                      </ActivityItem>
                    ))}
                  </Timeline>
                ) : (
                  <EmptyState
                    size="small"
                    icon="list"
                    title="Noch keine Einträge"
                    description={`Für ${o.name} gibt es in „${active.label}“ noch nichts.`}
                    action={<Button variant="secondary" onClick={() => setHistoryFilter('all')}>Gesamten Verlauf anzeigen</Button>}
                  />
                )}
              </>
            )}
          </Stack>
        </Stack>
      </Stack>
      {focus ? (
        <ActivityModal
          open={activityOpen}
          onClose={() => setActivityOpen(false)}
          activity={focus}
          organisation={o.name}
          participants={focusPeople}
          candidates={[...TEAM, ...contactsAsPeople]}
          onSave={(a, list) => { setFocus(a); setFocusPeople(list); setActivityOpen(false); onNotify('Aktivität aktualisiert'); }}
        />
      ) : null}
    </Stack>
  );
}
