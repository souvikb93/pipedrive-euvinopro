import * as React from 'react';
import {
  ActivityItem,
  Button,
  Card,
  Chip,
  EmptyState,
  Icon,
  IconButton,
  InlineEdit,
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
import { historyByOrganisation } from '../data/history';

// Figma: Pipedrive New, node 1:3486 ("Organisation detail"). Copy follows the Figma frame.
const COMPOSER: Array<{ id: string; label: string; icon: IconName }> = [
  { id: 'notes', label: 'Notes', icon: 'edit' },
  { id: 'activity', label: 'Activity', icon: 'calendar' },
  { id: 'call', label: 'Call', icon: 'phone' },
  { id: 'whatsapp', label: 'WhatsApp', icon: 'chat-bubble' },
  { id: 'email', label: 'Email', icon: 'mail' },
  { id: 'files', label: 'Files', icon: 'attachment' },
  { id: 'documents', label: 'Documents', icon: 'page' },
];

const HISTORY_FILTERS = ['All', 'Notes (5)', 'Activities (12)', 'WhatsApp', 'Emails', 'Files', 'Documents', 'Leads', 'Deals', 'Change log'];

const noop = () => {};

export interface OrganisationDetailProps {
  organisation: Organisation;
  people: Contact[];
  labelOptions: LabelOption[];
  labelId: string | null;
  onLabelChange: (id: string) => void;
  onLabelCreate: (name: string) => void;
  /** Saves a changed field. */
  onUpdate: (patch: Partial<Organisation>) => void;
}

export function OrganisationDetail({ organisation: o, people, labelOptions, labelId, onLabelChange, onLabelCreate, onUpdate }: OrganisationDetailProps) {
  const [fieldFilter, setFieldFilter] = React.useState('');
  const [composer, setComposer] = React.useState('notes');
  const [historyOpen, setHistoryOpen] = React.useState(true);
  const [historyFilter, setHistoryFilter] = React.useState('Emails');
  const emails = historyByOrganisation[o.id] ?? [];

  const q = fieldFilter.trim().toLowerCase();
  const match = (...v: string[]) => !q || v.some((x) => x.toLowerCase().includes(q));
  const field = (label: string, key: keyof Organisation, value: string, display?: React.ReactNode, type: 'text' | 'tel' = 'text') => ({
    label,
    text: value,
    value: <InlineEdit type={type} label={`Edit ${label.toLowerCase()}`} value={value} onChange={(v) => onUpdate({ [key]: v } as Partial<Organisation>)} display={value ? display : undefined} />,
  });
  const details = [
    field('Website', 'website', o.website, <LinkButton variant="link" href={o.website} target="_blank" rel="noreferrer">{o.website}</LinkButton>),
    field('Phone number', 'phone', o.phone, <LinkButton variant="link" href={`tel:${o.phone.replace(/[^+\d]/g, '')}`}>{o.phone.replace(/\s/g, '')}</LinkButton>, 'tel'),
    field('Managing director', 'managingDirector', o.managingDirector, <LinkButton variant="link" href="#">{o.managingDirector}</LinkButton>),
    field('Industry', 'industry', o.industry),
    field('Postal code', 'postalCode', o.postalCode),
    { label: 'Internal admin', text: 'backend', value: <LinkButton variant="link" href={`https://backend.euvinopro.eu/admin/vendors/${o.id}`} target="_blank" rel="noreferrer">{`https://backend.euvinopro.eu/admin/vendors/${o.id}`}</LinkButton> },
  ].filter((d) => match(d.label, d.text));
  const shownPeople = people.filter((p) => match(p.name, 'contacts'));
  const shownEmails = historyFilter === 'All' || historyFilter === 'Emails' ? emails : [];

  return (
    <Stack gap="6">
      <PageHeader title={o.name} subtitle={o.kind || undefined} actions={<Button variant="primary" icon="plus">Schedule activity</Button>} />

      <Stack direction="horizontal" gap="8" align="start" wrap>
        <Stack gap="3" className="detail-side">
          <Input label="Filter fields" hideLabel placeholder="Filter fields" iconLeft="search" value={fieldFilter} onChange={(e) => setFieldFilter(e.target.value)} onClear={() => setFieldFilter('')} labels={{ clear: 'Clear filter' }} />

          {match('summary', 'label', o.address) ? (
            <Card title="Summary" padding="medium" collapsible toggleLabel="Show or hide Summary">
              <LabelPicker
                label={`Label for ${o.name}`}
                value={labelId}
                options={labelOptions}
                onChange={onLabelChange}
                onCreate={onLabelCreate}
                labels={{ search: 'Search label', add: 'Add label', addNamed: (n) => `Add "${n}" as label`, empty: 'No label found', none: 'Add label' }}
              />
              <Text as="div" variant="body-small"><Stack direction="horizontal" gap="2" align="center">
                <Icon name="globe" size="md" />
                <InlineEdit
                  label="Edit address"
                  value={o.address}
                  onChange={(v) => onUpdate({ address: v })}
                  display={o.address ? <LinkButton variant="link" href={`https://maps.google.com/?q=${encodeURIComponent(o.address)}`} target="_blank" rel="noreferrer">{o.address}</LinkButton> : undefined}
                />
              </Stack></Text>
            </Card>
          ) : null}

          {details.length ? (
            <Card title="Details" padding="medium" collapsible toggleLabel="Show or hide Details">
              <KeyValueList items={details.map(({ label, value }) => ({ label, value }))} />
            </Card>
          ) : null}

          {match('related organizations') ? (
            <Card title="Related organizations" padding="medium" collapsible toggleLabel="Show or hide Related organizations">
              <Text variant="body-small" tone="muted">No related organizations added yet.</Text>
              <Stack direction="horizontal"><Button variant="tertiary" size="small" icon="plus">Organization</Button></Stack>
            </Card>
          ) : null}

          {match('contacts') || shownPeople.length ? (
            <Card title="Contacts" padding="medium" collapsible toggleLabel="Show or hide Contacts" headerAction={<IconButton icon="plus" label="Add contact" size="tiny" />}>
              <Text as="div" variant="body-small"><Stack gap="2" as="ul" className="detail-list">
                {(q && !match('contacts') ? shownPeople : people).map((p) => (
                  <Stack as="li" key={p.id} direction="horizontal" gap="2" align="center">
                    <Icon name="user-circle" size="md" />
                    <LinkButton variant="link" href="#/kontakte">{p.name}</LinkButton>
                  </Stack>
                ))}
              </Stack></Text>
            </Card>
          ) : null}

          {match('smart bcc') ? (
            <Card title={<Stack as="span" direction="horizontal" gap="2" align="center">Smart BCC <Icon name="info" size="sm" /></Stack>} padding="medium" collapsible toggleLabel="Show or hide Smart BCC">
              <Input label="Label" placeholder="Placeholder" help="Helper text" />
            </Card>
          ) : null}

          {match('leads') ? (
            <Card title="Leads" padding="medium" collapsible toggleLabel="Show or hide Leads" headerAction={<IconButton icon="plus" label="Add lead" size="tiny" />}>
              <Stack direction="horizontal"><Button variant="tertiary" size="small" icon="plus">Add new lead</Button></Stack>
            </Card>
          ) : null}

          <Stack gap="1" padding="4">
            <Text variant="caption" tone="muted">Updated: Thursday, October 15, 2026 15:12</Text>
            <Text variant="caption" tone="muted">Created: Thursday, March 4, 2021 17:23</Text>
          </Stack>
        </Stack>

        <Stack gap="6" className="detail-main">
          <Card padding="medium">
            <TopNav label="Add to history" items={COMPOSER.map((c) => ({ label: c.label, icon: c.icon, selected: composer === c.id, onClick: () => setComposer(c.id) }))} />
            <Textarea aria-label={`${COMPOSER.find((c) => c.id === composer)?.label}`} placeholder="Write a note with @name" />
          </Card>

          <Stack gap="4">
            <Stack direction="horizontal" gap="1" align="center">
              <Text as="h2" variant="h5">History</Text>
              <IconButton icon={historyOpen ? 'nav-up' : 'nav-down'} label="Show or hide History" size="tiny" aria-expanded={historyOpen} onClick={() => setHistoryOpen((v) => !v)} />
            </Stack>
            {historyOpen ? (
              <>
                <Stack direction="horizontal" gap="2" wrap>
                  {HISTORY_FILTERS.map((f) => <Chip key={f} selected={historyFilter === f} onClick={() => setHistoryFilter(f)}>{f}</Chip>)}
                </Stack>
                {shownEmails.length ? (
                  <Timeline label="History">
                    {shownEmails.map((e) => (
                      <ActivityItem
                        key={e.id}
                        icon="mail"
                        title={e.subject}
                        meta={e.meta}
                        actions={
                          <>
                            <IconButton icon="arrow-separate-vertical" label="Show whole conversation" size="small" />
                            <IconButton icon="lock" label="Private" size="small" variant="primary" />
                            {e.attachments ? <IconButton icon="attachment" label="Show attachments" size="small" variant="secondary" /> : null}
                            <Button variant="secondary" size="small" icon="reply">Reply</Button>
                            <Menu label="Reply options" trigger={<IconButton icon="nav-down" label="More reply options" size="small" variant="secondary" />} items={[{ label: 'Reply all', onSelect: noop }, { label: 'Forward', onSelect: noop }]} />
                          </>
                        }
                        footer={
                          <>
                            <Stack as="span" direction="horizontal" gap="1" align="center"><Icon name="user-circle" size="sm" />{e.people}</Stack>
                            <Stack as="span" direction="horizontal" gap="1" align="center"><Icon name="building" size="sm" />{e.organisation}</Stack>
                            <Stack as="span" direction="horizontal" gap="1" align="center"><Icon name="link" size="sm" /><LinkButton variant="link" href="#">Link item</LinkButton></Stack>
                          </>
                        }
                      >
                        {e.preview}
                      </ActivityItem>
                    ))}
                  </Timeline>
                ) : (
                  <EmptyState size="small" icon="list" title="Nothing here yet" description={`No ${historyFilter.replace(/ \(\d+\)$/, '').toLowerCase()} for ${o.name} so far.`} action={historyFilter !== 'All' ? <Button variant="secondary" onClick={() => setHistoryFilter('All')}>Show all history</Button> : undefined} />
                )}
              </>
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}
