import * as React from 'react';
import {
  ActivityCard,
  Editor,
  Avatar,
  Badge,
  BreakdownBar,
  Button,
  Card,
  Divider,
  EmptyState,
  FilterTabs,
  InlineList,
  Icon,
  IconButton,
  KeyValueList,
  LabelPicker,
  LinkButton,
  PageHeader,
  Stack,
  Text,
  Timeline,
  TopNav,
  type IconName,
  type LabelOption,
} from '@euvino/ds';
import type { Contact } from '../data/contacts';
import { organisations, type Organisation } from '../data/organisations';
import { TEAM, addDays, hm, shortDay, type Participant } from '../data/availability';
import { PlanActivity } from './PlanActivity';
import { ActivityModal } from './ActivityModal';
import {
  TODAY,
  daysSince,
  entryText,
  historyFor,
  nextActivityFor,
  shortGermanDate,
  type FocusActivity,
  type HistoryEntry,
  type HistoryKind,
  type PersonRef,
} from '../data/history';
import { HistoryCard, type HistoryHandlers } from './timeline/HistoryCard';
import { DeleteEntry, HistoryDetails } from './timeline/HistoryDetails';
import { CURRENT_USER, People, PersonAction } from './shared/people';
import { hrefFor } from '../route';

// Layout from Figma (Pipedrive New, node 1:3486); copy and history pattern from the German reference screen.
// Only Notizen and Aktivität have content yet. The other tabs show hover feedback but stay unselected.
const COMPOSER: Array<{ id: string; label: string; icon: IconName; placeholder: string; kind: HistoryKind; saved: string }> = [
  {
    id: 'notes',
    label: 'Notizen',
    icon: 'edit',
    placeholder: 'Notiz schreiben … Mit @ jemanden erwähnen',
    kind: 'note',
    saved: 'Notiz gespeichert',
  },
  {
    id: 'activity',
    label: 'Aktivität',
    icon: 'calendar',
    placeholder: 'Aktivität beschreiben',
    kind: 'activity',
    saved: 'Aktivität gespeichert',
  },
  { id: 'call', label: 'Anruf', icon: 'phone', placeholder: 'Anruf protokollieren', kind: 'call', saved: 'Anruf gespeichert' },
  {
    id: 'whatsapp',
    label: 'WhatsApp',
    icon: 'chat-bubble',
    placeholder: 'WhatsApp-Nachricht schreiben',
    kind: 'whatsapp',
    saved: 'WhatsApp-Nachricht gespeichert',
  },
  { id: 'email', label: 'E-Mail', icon: 'mail', placeholder: 'E-Mail schreiben', kind: 'email', saved: 'E-Mail gespeichert' },
  { id: 'files', label: 'Dateien', icon: 'attachment', placeholder: 'Beschreibung zur Datei', kind: 'file', saved: 'Datei gespeichert' },
  {
    id: 'documents',
    label: 'Dokumente',
    icon: 'page',
    placeholder: 'Beschreibung zum Dokument',
    kind: 'note',
    saved: 'Dokument gespeichert',
  },
];

// History filters. Alle, Notizen, Aktivitäten, E-Mails and Dateien are always there; the others show only when this organisation has entries of that kind.
const FILTERS: Array<{ id: string; label: string; kinds: HistoryKind[] | null; always: boolean }> = [
  { id: 'all', label: 'Alle', kinds: null, always: true },
  { id: 'notes', label: 'Notizen', kinds: ['note'], always: true },
  { id: 'activities', label: 'Aktivitäten', kinds: ['activity', 'call'], always: true },
  { id: 'emails', label: 'E-Mails', kinds: ['email'], always: true },
  { id: 'files', label: 'Dateien', kinds: ['file'], always: true },
  { id: 'whatsapp', label: 'WhatsApp', kinds: ['whatsapp'], always: false },
  { id: 'documents', label: 'Dokumente', kinds: [], always: false },
  { id: 'leads', label: 'Leads', kinds: [], always: false },
  { id: 'deals', label: 'Deals', kinds: [], always: false },
  { id: 'changes', label: 'Änderungsprotokoll', kinds: ['change'], always: false },
];

/** City and country out of an address such as "Street 1, 12345 City, Country". */
function placeOf(address: string): string {
  const parts = address
    .split(',')
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 2) return address;
  const city = parts[parts.length - 2].replace(/^\d{4,5}\s+/, '');
  return `${city}, ${parts[parts.length - 1]}`;
}

/** Fokus: the next planned activity, first section of the side card. The whole box opens the activity; the names inside are their own links. */
function FocusActivityBox({
  activity,
  participants,
  onOpen,
  onSoon,
}: {
  activity: FocusActivity | null;
  participants: Participant[];
  onOpen: () => void;
  onSoon: (what: string) => void;
}) {
  return (
    <>
      {activity ? (
        <ActivityCard
          title={activity.title}
          type={activity.type}
          onOpen={onOpen}
          rows={[
            { icon: 'calendar', content: <InlineList items={[shortDay(activity.day), `${hm(activity.start)}–${hm(activity.end)}`]} /> },
            {
              icon: 'user',
              content: (
                <PersonAction.Provider value={onSoon}>
                  <People list={participants.map((p) => ({ name: p.name }))} />
                </PersonAction.Provider>
              ),
            },
          ]}
        />
      ) : (
        <Text variant="body-small" tone="muted">
          Keine Aktivität geplant.
        </Text>
      )}
    </>
  );
}

/** You, the signed-in user: author of new notes and planned activities. */
const ME_REF: PersonRef = { name: CURRENT_USER, email: 'johannes.finzer@euvino.de' };

// Activity kinds counted in Überblick, with their German names.
const ACTIVITY_LABEL: Partial<Record<HistoryKind, string>> = {
  call: 'Anruf',
  activity: 'Termin',
  note: 'Notiz',
  email: 'E-Mail',
  whatsapp: 'WhatsApp',
};

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

export function OrganisationDetail({
  organisation: o,
  people,
  labelOptions,
  labelId,
  onLabelChange,
  onLabelCreate,
  onAddContact,
  onSoon,
  onNotify,
}: OrganisationDetailProps) {
  const [composer, setComposer] = React.useState('notes');
  const [historyFilter, setHistoryFilter] = React.useState('all');
  const [draft, setDraft] = React.useState('');
  const [added, setAdded] = React.useState<HistoryEntry[]>([]);
  const [edits, setEdits] = React.useState<Record<string, Partial<HistoryEntry>>>({});
  const [removed, setRemoved] = React.useState<string[]>([]);
  const [detail, setDetail] = React.useState<{ id: string; editing: boolean } | null>(null);
  const [deleting, setDeleting] = React.useState<HistoryEntry | null>(null);
  React.useEffect(() => {
    setDraft('');
    setAdded([]);
    setEdits({});
    setRemoved([]);
    setDetail(null);
  }, [o.id]);
  const history = React.useMemo(
    () =>
      [...added, ...historyFor(o, people)].filter((h) => !removed.includes(h.id)).map((h) => (edits[h.id] ? { ...h, ...edits[h.id] } : h)),
    [added, o, people, removed, edits],
  );
  const open = detail ? (history.find((h) => h.id === detail.id) ?? null) : null;
  const handlers: HistoryHandlers = {
    onDetails: (e) => setDetail({ id: e.id, editing: false }),
    onEdit: (e) => setDetail({ id: e.id, editing: true }),
    onDelete: (e) => setDeleting(e),
    onReply: (e, how) =>
      onSoon(
        how === 'forward' ? 'Weiterleiten' : how === 'all' ? `Allen antworten: ${e.title}` : `Antworten an ${e.by?.name ?? 'Absender'}`,
      ),
    onShare: (e) => onNotify(`„${e.title}“ mit dem Team geteilt`),
    onLink: () => onSoon('Mit Element verbinden'),
    onPerson: (name) => onSoon(name),
  };
  const contactsAsPeople = React.useMemo<Participant[]>(
    () => people.map((p) => ({ id: p.id, name: p.name, photo: p.photo, kind: 'contact' })),
    [people],
  );
  const [focus, setFocus] = React.useState(() =>
    nextActivityFor(
      o,
      Math.max(
        0,
        organisations.findIndex((x) => x.id === o.id),
      ),
    ),
  );
  const [focusPeople, setFocusPeople] = React.useState<Participant[]>([]);
  const [activityOpen, setActivityOpen] = React.useState(false);
  React.useEffect(() => {
    setFocus(
      nextActivityFor(
        o,
        Math.max(
          0,
          organisations.findIndex((x) => x.id === o.id),
        ),
      ),
    );
    setFocusPeople([TEAM[0], TEAM[1], ...contactsAsPeople.slice(0, 1)]);
    setActivityOpen(false);
  }, [o, contactsAsPeople]);
  React.useEffect(() => {
    setHistoryFilter('all');
  }, [o.id]);

  // Überblick is worked out from the history and this organisation's own contact records. Refresh works it out again.
  // The side column scrolls with the page; once its end is in view it stays there while the main column goes on.
  const sideRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    const el = sideRef.current;
    if (!el) return undefined;
    // Sticky only while the side column sits beside the main column; once the layout wraps it scrolls normally.
    const measure = () => {
      el.style.setProperty('--detail-side-h', `${el.offsetHeight}px`);
      const main = el.nextElementSibling as HTMLElement | null;
      el.toggleAttribute('data-stacked', !!main && main.offsetTop > el.offsetTop);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, []);

  const [overviewVersion, setOverviewVersion] = React.useState(0);
  const overview = React.useMemo(() => {
    const kinds = Object.entries(ACTIVITY_LABEL) as Array<[HistoryKind, string]>;
    const activities = kinds
      .map(([k, label]) => ({ label, value: history.filter((h) => h.kind === k).length }))
      .filter((a) => a.value > 0)
      .sort((a, b) => b.value - a.value);
    const mentions = (name: string) => history.filter((h) => entryText(h).includes(name)).length;
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
  }, [history, people, overviewVersion]); // eslint-disable-line react-hooks/exhaustive-deps -- overviewVersion forces a recount on Aktualisieren
  const refreshOverview = () => {
    setOverviewVersion((v) => v + 1);
    onNotify('Überblick aktualisiert');
  };

  const field = (label: string, value: string, display?: React.ReactNode) => ({
    label,
    text: value,
    value: value ? (display ?? value) : '–',
  });
  const details = [
    field(
      'Website',
      o.website,
      <LinkButton variant="link" href={o.website} target="_blank" rel="noreferrer">
        {o.website}
      </LinkButton>,
    ),
    field(
      'Telefonnummer',
      o.phone,
      <LinkButton variant="link" href={`tel:${o.phone.replace(/[^+\d]/g, '')}`}>
        {o.phone.replace(/\s/g, '')}
      </LinkButton>,
    ),
    field('Geschäftsführer', o.managingDirector, <People list={[{ name: o.managingDirector }]} max={1} />),
    field('Branchenzweig', o.industry, <Badge size="tiny">{o.industry}</Badge>),
    field('PLZ', o.postalCode),
    {
      label: 'Interner Admin',
      text: 'backend',
      value: (
        <LinkButton
          variant="link"
          href={`https://backend.euvinopro.eu/admin/vendors/${o.id}`}
          target="_blank"
          rel="noreferrer"
        >{`backend.euvinopro.eu/admin/vendors/${o.id}`}</LinkButton>
      ),
    },
  ];

  const countOf = (kinds: HistoryKind[] | null) => (kinds === null ? history.length : history.filter((h) => kinds.includes(h.kind)).length);
  const active = FILTERS.find((f) => f.id === historyFilter && (f.always || countOf(f.kinds) > 0)) ?? FILTERS[0];
  const shown = active.kinds === null ? history : history.filter((h) => active.kinds?.includes(h.kind));
  const tab = COMPOSER.find((c) => c.id === composer) ?? COMPOSER[0];

  const section = (id: string, title: string, action: React.ReactNode, body: React.ReactNode) => ({
    id,
    node: (
      <Stack as="section" gap="3" aria-labelledby={`side-${id}`}>
        <Stack direction="horizontal" gap="2" align="center" justify="between">
          <Text as="h2" id={`side-${id}`} variant="h6">
            {title}
          </Text>
          {action ? (
            <Stack direction="horizontal" gap="1" align="center">
              {action}
            </Stack>
          ) : null}
        </Stack>
        {body}
      </Stack>
    ),
  });
  const edit = (what: string) => (
    <IconButton icon="edit" label={`${what} bearbeiten`} size="small" onClick={() => onSoon(`${what} bearbeiten`)} />
  );
  const add = (label: string, onClick: () => void) => <IconButton icon="plus" label={label} size="small" onClick={onClick} />;
  const empty = (text: string) => (
    <Text variant="body-small" tone="muted">
      {text}
    </Text>
  );

  const sections = [
    section(
      'focus',
      'Fokus',
      null,
      <FocusActivityBox activity={focus} participants={focusPeople} onOpen={() => setActivityOpen(true)} onSoon={onSoon} />,
    ),
    section(
      'organisation',
      'Organisationsdetails',
      edit('Organisationsdetails'),
      <KeyValueList layout="columns" items={details.map(({ label, value }) => ({ label, value }))} />,
    ),
    section(
      'related',
      'Zugehörige Organisationen',
      add('Organisation verknüpfen', () => onSoon('Organisation verknüpfen')),
      empty('Noch keine zugehörigen Organisationen hinzugefügt.'),
    ),
    section(
      'contacts',
      'Kontakte',
      add('Kontakt hinzufügen', onAddContact),
      people.length ? (
        <Text as="div" variant="body-small">
          <Stack gap="2" as="ul" className="detail-list">
            {people.map((p) => (
              <Stack as="li" key={p.id} direction="horizontal" gap="2" align="center" justify="between">
                <Stack direction="horizontal" gap="2" align="center">
                  <Avatar name={p.name} src={p.photo} size="tiny" />
                  <LinkButton variant="link" href={hrefFor.contact(p.id)}>
                    {p.name}
                  </LinkButton>
                </Stack>
                <Stack direction="horizontal" gap="1" align="center">
                  <IconButton
                    icon="phone"
                    label={`${p.name} anrufen`}
                    size="small"
                    disabled={!p.phones.length}
                    onClick={() => {
                      window.location.href = `tel:${p.phones[0].replace(/[^+\d]/g, '')}`;
                    }}
                  />
                  <IconButton
                    icon="mail"
                    label={`E-Mail an ${p.name}`}
                    size="small"
                    disabled={!p.email}
                    onClick={() => {
                      window.location.href = `mailto:${p.email}`;
                    }}
                  />
                </Stack>
              </Stack>
            ))}
          </Stack>
        </Text>
      ) : (
        empty('Noch keine Kontakte hinzugefügt.')
      ),
    ),
    section(
      'overview',
      'Überblick',
      <IconButton icon="refresh" label="Überblick aktualisieren" size="small" onClick={refreshOverview} />,
      <Stack gap="4">
        <Stack gap="2">
          <Text as="h3" variant="caption-strong">
            Top-Aktivitäten
          </Text>
          {overview.activities.length ? (
            <BreakdownBar label="Top-Aktivitäten" items={overview.activities} />
          ) : (
            empty('Noch keine Aktivitäten.')
          )}
        </Stack>
        <Stack gap="2">
          <Text as="h3" variant="caption-strong">
            Aktivste Nutzer
          </Text>
          {overview.users.length ? <BreakdownBar label="Aktivste Nutzer" items={overview.users} /> : empty('Noch keine Aktivitäten.')}
        </Stack>
        <KeyValueList
          layout="columns"
          items={[
            { label: 'Inaktiv (Tage)', value: overview.inactive },
            { label: 'Erstellt', value: overview.created },
          ]}
        />
      </Stack>,
    ),
    section(
      'leads',
      'Leads',
      add('Lead hinzufügen', () => onSoon('Lead hinzufügen')),
      empty('Noch keine Leads hinzugefügt.'),
    ),
  ];

  return (
    <Stack gap="4">
      <PageHeader
        title={o.name}
        icon="organisation"
        meta={
          <>
            <span>
              <LabelPicker
                size="small"
                label={`Label für ${o.name}`}
                value={labelId}
                options={labelOptions}
                onChange={onLabelChange}
                onCreate={onLabelCreate}
                labels={{
                  search: 'Label suchen',
                  add: 'Label hinzufügen',
                  addNamed: (n) => `„${n}“ als Label hinzufügen`,
                  empty: 'Kein Label gefunden',
                  none: 'Label hinzufügen',
                }}
              />
            </span>
            {o.address ? (
              <span>
                <Icon name="map-pin" size="sm" />
                <LinkButton
                  variant="plain"
                  href={`https://maps.google.com/?q=${encodeURIComponent(o.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  title={o.address}
                >
                  {placeOf(o.address)}
                </LinkButton>
              </span>
            ) : null}
          </>
        }
      />

      <Stack direction="horizontal" gap="8" align="start" wrap>
        <div className="detail-side" ref={sideRef}>
          <Stack gap="3">
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
          </Stack>
        </div>

        <Stack gap="6" className="detail-main">
          <Card padding="medium">
            <TopNav
              label="Zum Verlauf hinzufügen"
              items={COMPOSER.map((c) => ({
                label: c.label,
                icon: c.icon,
                selected: composer === c.id,
                onClick: () => {
                  if (c.id === 'notes' || c.id === 'activity') setComposer(c.id);
                },
              }))}
            />
            {composer === 'activity' ? (
              <PlanActivity
                key={o.id}
                from={addDays(
                  `${TODAY.getFullYear()}-${String(TODAY.getMonth() + 1).padStart(2, '0')}-${String(TODAY.getDate()).padStart(2, '0')}`,
                  1,
                )}
                participants={[TEAM[0], TEAM[1], ...contactsAsPeople.slice(0, 1)]}
                candidates={[...TEAM, ...contactsAsPeople]}
                onCancel={() => setComposer('notes')}
                onPlan={(a, list) => {
                  setComposer('notes');
                  setAdded((h) => [
                    {
                      id: `plan-${Date.now()}`,
                      kind: a.kind === 'call' ? 'call' : 'activity',
                      day: a.day,
                      time: hm(a.start),
                      span: `${hm(a.start)}–${hm(a.end)}`,
                      title: `${a.type}: ${a.title}`,
                      by: ME_REF,
                      to: list.slice(1).map((p): PersonRef => ({ name: p.name })),
                      contacts: list.filter((p) => p.kind === 'contact').map((p): PersonRef => ({ name: p.name })),
                      organisations: [o.name],
                    },
                    ...h,
                  ]);
                  if (!focus || a.day < focus.day || (a.day === focus.day && a.start < focus.start)) {
                    setFocus(a);
                    setFocusPeople(list);
                  }
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
                  const now = new Date();
                  setAdded((a) => [
                    {
                      id: `new-${Date.now()}`,
                      kind: tab.kind,
                      day: today,
                      time: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
                      title: tab.label === 'Notizen' ? 'Notiz' : tab.label,
                      by: ME_REF,
                      preview: plain,
                      organisations: [o.name],
                    },
                    ...a,
                  ]);
                  setDraft('');
                  onNotify(tab.saved);
                }}
                labels={{
                  toolbar: 'Formatierung',
                  bold: 'Fett',
                  italic: 'Kursiv',
                  underline: 'Unterstrichen',
                  bullets: 'Aufzählung',
                  numbers: 'Nummerierte Liste',
                  link: 'Link einfügen',
                  mention: 'Jemanden erwähnen',
                  cancel: 'Abbrechen',
                  save: 'Speichern',
                }}
              />
            )}
          </Card>

          <Stack gap="4">
            <Text as="h2" variant="h5">
              Verlauf
            </Text>
            {
              <>
                <FilterTabs
                  variant="chip"
                  label="Verlauf filtern"
                  value={active.id}
                  onChange={setHistoryFilter}
                  items={FILTERS.filter((f) => f.always || countOf(f.kinds) > 0).map((f) => ({
                    id: f.id,
                    label: f.label,
                    count: f.kinds === null ? undefined : countOf(f.kinds),
                  }))}
                />
                {shown.length ? (
                  <Timeline label="Verlauf">
                    {shown.map((e) => (
                      <HistoryCard key={e.id} e={e} h={handlers} />
                    ))}
                  </Timeline>
                ) : (
                  <EmptyState
                    size="small"
                    icon="list"
                    title="Noch keine Einträge"
                    description={`Für ${o.name} gibt es in „${active.label}“ noch nichts.`}
                    action={
                      <Button variant="secondary" onClick={() => setHistoryFilter('all')}>
                        Gesamten Verlauf anzeigen
                      </Button>
                    }
                  />
                )}
              </>
            }
          </Stack>
        </Stack>
      </Stack>
      <HistoryDetails
        e={open}
        editing={!!detail?.editing}
        h={handlers}
        onClose={() => setDetail(null)}
        onSave={(e, text) => {
          setEdits((x) => ({ ...x, [e.id]: { ...x[e.id], preview: text, body: undefined } }));
          setDetail({ id: e.id, editing: false });
          onNotify('Notiz gespeichert');
        }}
      />
      <DeleteEntry
        e={deleting}
        onCancel={() => setDeleting(null)}
        onConfirm={() => {
          if (deleting) {
            setRemoved((r) => [...r, deleting.id]);
            if (detail?.id === deleting.id) setDetail(null);
            onNotify(`„${deleting.title}“ gelöscht`);
          }
          setDeleting(null);
        }}
      />
      {focus ? (
        <ActivityModal
          open={activityOpen}
          onClose={() => setActivityOpen(false)}
          activity={focus}
          organisation={o.name}
          participants={focusPeople}
          candidates={[...TEAM, ...contactsAsPeople]}
          onSave={(a, list) => {
            setFocus(a);
            setFocusPeople(list);
            setActivityOpen(false);
            onNotify('Aktivität aktualisiert');
          }}
        />
      ) : null}
    </Stack>
  );
}
