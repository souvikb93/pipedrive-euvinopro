import * as React from 'react';
import {
  ActivityItem,
  Button,
  Card,
  Chip,
  EmptyState,
  Icon,
  IconButton,
  Input,
  KeyValueList,
  LabelPicker,
  LinkButton,
  Menu,
  PageHeader,
  Stack,
  Text,
  Textarea,
  Timeline,
  TopNav,
  type IconName,
  type LabelOption,
} from '@euvino/ds';
import type { Contact } from '../data/contacts';
import type { Organisation } from '../data/organisations';
import { germanDate, historyFor, type HistoryEntry, type HistoryKind } from '../data/history';

// Layout from Figma (Pipedrive New, node 1:3486); copy and history pattern from the German reference screen.
const COMPOSER: Array<{ id: string; label: string; icon: IconName; placeholder: string }> = [
  { id: 'notes', label: 'Notizen', icon: 'edit', placeholder: 'Machen Sie eine Notiz mit @name' },
  { id: 'activity', label: 'Aktivität', icon: 'calendar', placeholder: 'Aktivität beschreiben' },
  { id: 'call', label: 'Anruf', icon: 'phone', placeholder: 'Anruf protokollieren' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat-bubble', placeholder: 'WhatsApp-Nachricht schreiben' },
  { id: 'email', label: 'E-Mail', icon: 'mail', placeholder: 'E-Mail schreiben' },
  { id: 'files', label: 'Dateien', icon: 'attachment', placeholder: 'Beschreibung zur Datei' },
  { id: 'documents', label: 'Dokumente', icon: 'page', placeholder: 'Beschreibung zum Dokument' },
];

const KIND_ICON: Record<HistoryKind, IconName> = { email: 'mail', note: 'edit', call: 'phone', activity: 'calendar', whatsapp: 'chat-bubble', file: 'attachment', change: 'clock' };

// History filters; the counts come from the entries.
const FILTERS: Array<{ id: string; label: string; kinds: HistoryKind[] | null }> = [
  { id: 'all', label: 'Alle', kinds: null },
  { id: 'notes', label: 'Notizen', kinds: ['note'] },
  { id: 'activities', label: 'Aktivitäten', kinds: ['activity', 'call'] },
  { id: 'whatsapp', label: 'WhatsApp', kinds: ['whatsapp'] },
  { id: 'emails', label: 'E-Mails', kinds: ['email'] },
  { id: 'files', label: 'Dateien', kinds: ['file'] },
  { id: 'documents', label: 'Dokumente', kinds: [] },
  { id: 'leads', label: 'Leads', kinds: [] },
  { id: 'deals', label: 'Deals', kinds: [] },
  { id: 'changes', label: 'Änderungsprotokoll', kinds: ['change'] },
];

const noop = () => {};

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
}

export function OrganisationDetail({ organisation: o, people, labelOptions, labelId, onLabelChange, onLabelCreate }: OrganisationDetailProps) {
  const [fieldFilter, setFieldFilter] = React.useState('');
  const [composer, setComposer] = React.useState('notes');
  const [historyOpen, setHistoryOpen] = React.useState(true);
  const [historyFilter, setHistoryFilter] = React.useState('all');
  const history = React.useMemo(() => historyFor(o, people), [o, people]);
  React.useEffect(() => { setHistoryFilter('all'); setFieldFilter(''); }, [o.id]);

  const q = fieldFilter.trim().toLowerCase();
  const match = (...v: string[]) => !q || v.some((x) => x.toLowerCase().includes(q));
  const field = (label: string, value: string, display?: React.ReactNode) => ({ label, text: value, value: value ? display ?? value : '–' });
  const details = [
    field('Website', o.website, <LinkButton variant="link" href={o.website} target="_blank" rel="noreferrer">{o.website}</LinkButton>),
    field('Telefonnummer', o.phone, <LinkButton variant="link" href={`tel:${o.phone.replace(/[^+\d]/g, '')}`}>{o.phone.replace(/\s/g, '')}</LinkButton>),
    field('Geschäftsführung', o.managingDirector, <LinkButton variant="link" href="#">{o.managingDirector}</LinkButton>),
    field('Branche', o.industry),
    field('Postleitzahl', o.postalCode),
    { label: 'Interne Verwaltung', text: 'backend', value: <LinkButton variant="link" href={`https://backend.euvinopro.eu/admin/vendors/${o.id}`} target="_blank" rel="noreferrer">{`https://backend.euvinopro.eu/admin/vendors/${o.id}`}</LinkButton> },
  ].filter((d) => match(d.label, d.text));
  const shownPeople = people.filter((p) => match(p.name, 'kontakte'));

  const countOf = (kinds: HistoryKind[] | null) => (kinds === null ? history.length : history.filter((h) => kinds.includes(h.kind)).length);
  const active = FILTERS.find((f) => f.id === historyFilter) ?? FILTERS[0];
  const shown = active.kinds === null ? history : history.filter((h) => active.kinds?.includes(h.kind));
  const tab = COMPOSER.find((c) => c.id === composer) ?? COMPOSER[0];

  return (
    <Stack gap="6">
      <PageHeader title={o.name} subtitle={o.kind || undefined} actions={<Button variant="primary" icon="plus">Aktivität planen</Button>} />

      <Stack direction="horizontal" gap="8" align="start" wrap>
        <Stack gap="3" className="detail-side">
          <Input label="Felder filtern" hideLabel placeholder="Felder filtern" iconLeft="search" value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)} onClear={() => setFieldFilter('')} labels={{ clear: 'Filter leeren' }} />

          {match('zusammenfassung', 'label', o.address) ? (
            <Card title="Zusammenfassung" padding="medium" collapsible toggleLabel="Zusammenfassung ein- oder ausblenden">
              <LabelPicker
                label={`Label für ${o.name}`}
                value={labelId}
                options={labelOptions}
                onChange={onLabelChange}
                onCreate={onLabelCreate}
                labels={{ search: 'Label suchen', add: 'Label hinzufügen', addNamed: (n) => `„${n}“ als Label hinzufügen`, empty: 'Kein Label gefunden', none: 'Label hinzufügen' }}
              />
              <Text as="div" variant="body-small"><Stack direction="horizontal" gap="2" align="center">
                <Icon name="globe" size="md" />
                {o.address ? <LinkButton variant="link" href={`https://maps.google.com/?q=${encodeURIComponent(o.address)}`} target="_blank" rel="noreferrer">{o.address}</LinkButton> : '–'}
              </Stack></Text>
            </Card>
          ) : null}

          {details.length ? (
            <Card title="Details" padding="medium" collapsible toggleLabel="Details ein- oder ausblenden">
              <KeyValueList items={details.map(({ label, value }) => ({ label, value }))} />
            </Card>
          ) : null}

          {match('verbundene organisationen') ? (
            <Card title="Verbundene Organisationen" padding="medium" collapsible toggleLabel="Verbundene Organisationen ein- oder ausblenden">
              <Text variant="body-small" tone="muted">Noch keine verbundenen Organisationen.</Text>
              <Stack direction="horizontal"><Button variant="tertiary" size="small" icon="plus">Organisation</Button></Stack>
            </Card>
          ) : null}

          {match('kontakte') || shownPeople.length ? (
            <Card title="Kontakte" padding="medium" collapsible toggleLabel="Kontakte ein- oder ausblenden" headerAction={<IconButton icon="plus" label="Kontakt hinzufügen" size="tiny" />}>
              <Text as="div" variant="body-small"><Stack gap="2" as="ul" className="detail-list">
                {(q && !match('kontakte') ? shownPeople : people).map((p) => (
                  <Stack as="li" key={p.id} direction="horizontal" gap="2" align="center">
                    <Icon name="user-circle" size="md" />
                    <LinkButton variant="link" href="#/kontakte">{p.name}</LinkButton>
                  </Stack>
                ))}
              </Stack></Text>
            </Card>
          ) : null}

          {match('smart bcc') ? (
            <Card title={<Stack as="span" direction="horizontal" gap="2" align="center">Smart BCC <Icon name="info" size="sm" /></Stack>} padding="medium" collapsible toggleLabel="Smart BCC ein- oder ausblenden">
              <Input label="Label" placeholder="Platzhalter" help="Hilfetext" />
            </Card>
          ) : null}

          {match('leads') ? (
            <Card title="Leads" padding="medium" collapsible toggleLabel="Leads ein- oder ausblenden" headerAction={<IconButton icon="plus" label="Lead hinzufügen" size="tiny" />}>
              <Stack direction="horizontal"><Button variant="tertiary" size="small" icon="plus">Neuen Lead hinzufügen</Button></Stack>
            </Card>
          ) : null}

          <Stack gap="1" padding="4">
            <Text variant="caption" tone="muted">Aktualisiert: Donnerstag, 15. Oktober 2026, 15:12</Text>
            <Text variant="caption" tone="muted">Erstellt: Donnerstag, 4. März 2021, 17:23</Text>
          </Stack>
        </Stack>

        <Stack gap="6" className="detail-main">
          <Card padding="medium">
            <TopNav label="Zum Verlauf hinzufügen" items={COMPOSER.map((c) => ({ label: c.label, icon: c.icon, selected: composer === c.id, onClick: () => setComposer(c.id) }))} />
            <Textarea aria-label={tab.label} placeholder={tab.placeholder} />
          </Card>

          <Stack gap="4">
            <Stack direction="horizontal" gap="1" align="center">
              <Text as="h2" variant="h5">Verlauf</Text>
              <IconButton icon={historyOpen ? 'nav-up' : 'nav-down'} label="Verlauf ein- oder ausblenden" size="tiny" aria-expanded={historyOpen} onClick={() => setHistoryOpen((v) => !v)} />
            </Stack>
            {historyOpen ? (
              <>
                <Stack direction="horizontal" gap="2" wrap>
                  {FILTERS.map((f) => {
                    const n = countOf(f.kinds);
                    return <Chip key={f.id} selected={historyFilter === f.id} onClick={() => setHistoryFilter(f.id)}>{f.id === 'all' || n === 0 ? f.label : `${f.label} (${n})`}</Chip>;
                  })}
                </Stack>
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
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
