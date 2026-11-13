import * as React from 'react';
import { ActivityItem, FileChipList, IconButton, Menu, SplitButton, Text, VisuallyHidden, type IconName, type MenuItemDef } from '@euvino/ds';
import { entryDate, type HistoryEntry, type HistoryKind } from '../../data/history';
import { MentionText, People, PersonAction, Person } from '../shared/people';
import { download, downloadByName } from './download';

// One Verlauf entry. The rail icon names the kind, so the card repeats no type icon.
// Hierarchy: subject, a quiet meta row (date, who → whom), a two-line preview, then attachments.

export const KIND_ICON: Record<HistoryKind, IconName> = { email: 'mail', note: 'edit', call: 'phone', activity: 'calendar', whatsapp: 'chat-bubble', file: 'attachment', change: 'clock' };
export const KIND_NAME: Record<HistoryKind, string> = { email: 'E-Mail', note: 'Notiz', call: 'Anruf', activity: 'Termin', whatsapp: 'WhatsApp', file: 'Datei', change: 'Änderung' };

export interface HistoryHandlers {
  onDetails: (e: HistoryEntry) => void;
  onEdit: (e: HistoryEntry) => void;
  onDelete: (e: HistoryEntry) => void;
  onReply: (e: HistoryEntry, how: 'reply' | 'all' | 'forward') => void;
  onShare: (e: HistoryEntry) => void;
  onLink: (e: HistoryEntry) => void;
  /** A team member's name was clicked. */
  onPerson: (name: string) => void;
}

/** "Johannes Finzer → Andreas Geil": the arrow is read as "an". */
function FromTo({ e, to, max = 1 }: { e: HistoryEntry; to: HistoryEntry['to']; max?: number }) {
  return <>{e.by ? <Person p={e.by} /> : null}<span aria-hidden="true"> → </span><VisuallyHidden> an </VisuallyHidden><People list={to ?? []} max={max} /></>;
}

export const entryWhen = (e: HistoryEntry) => (e.kind === 'activity' && e.span ? `${entryDate(e.day)}, ${e.span}` : entryDate(e.day, e.time));

function meta(e: HistoryEntry): React.ReactNode[] {
  const when = entryWhen(e);
  if ((e.kind === 'email' || e.kind === 'whatsapp') && e.to?.length) return [when, <FromTo e={e} to={e.to} />];
  if (e.kind === 'call' && e.contacts?.length) return [when, <FromTo e={e} to={e.contacts} />, e.extra];
  if (e.kind === 'activity' && e.to?.length) return [when, <>{e.by ? <><Person p={e.by} />, </> : null}<People list={e.to} /></>];
  return [when, e.extra, e.by ? <>{e.kind === 'file' ? 'hochgeladen von ' : null}<Person p={e.by} /></> : null];
}

/** Commands per kind: only what applies to that record. */
function menuItems(e: HistoryEntry, h: HistoryHandlers): MenuItemDef[] {
  const details: MenuItemDef = { label: 'Details anzeigen', icon: 'eye', onSelect: () => h.onDetails(e) };
  const del: MenuItemDef = { label: 'Löschen', icon: 'trash', danger: true, onSelect: () => h.onDelete(e) };
  switch (e.kind) {
    case 'email':
      return [details, { label: 'Mit Element verbinden', icon: 'link', onSelect: () => h.onLink(e) }, { label: 'Mit dem Team teilen', icon: 'group', onSelect: () => h.onShare(e) }];
    case 'note':
      return [details, { label: 'Bearbeiten', icon: 'edit', onSelect: () => h.onEdit(e) }, del];
    case 'call':
    case 'activity':
      return [details, del];
    case 'file':
      return [details, ...(e.attachments ?? []).map((a): MenuItemDef => ({ label: 'Herunterladen', icon: 'download', onSelect: () => download(a) })), del];
    default:
      return [details];
  }
}

export function ReplyButton({ e, h, variant = 'secondary' }: { e: HistoryEntry; h: HistoryHandlers; variant?: 'primary' | 'secondary' }) {
  return (
    <SplitButton
      variant={variant}
      size={variant === 'secondary' ? 'small' : 'medium'}
      icon="reply"
      onClick={() => h.onReply(e, 'reply')}
      menuLabel="Weitere Antwortoptionen"
      items={[{ label: 'Allen antworten', icon: 'reply', onSelect: () => h.onReply(e, 'all') }, { label: 'Weiterleiten', icon: 'arrow-right', onSelect: () => h.onReply(e, 'forward') }]}
    >
      Antworten
    </SplitButton>
  );
}

function Actions({ e, h }: { e: HistoryEntry; h: HistoryHandlers }) {
  // Ghost button with the Selected icon weight: lower emphasis than Reply, dots still clearly visible.
  const more = <Menu label={`Aktionen für ${e.title}`} trigger={<IconButton icon="more-horiz" variant="tertiary" size="medium" className="eu-mode-icon-weight-selected" label={`Aktionen für ${e.title}`} />} items={menuItems(e, h)} />;
  return e.kind === 'email' ? <><ReplyButton e={e} h={h} />{more}</> : more;
}

export function HistoryCard({ e, h }: { e: HistoryEntry; h: HistoryHandlers }) {
  return (
    <PersonAction.Provider value={h.onPerson}>
      <ActivityItem
        icon={KIND_ICON[e.kind]}
        title={<Text as="span" variant="h6">{e.title}</Text>}
        meta={meta(e)}
        actions={<Actions e={e} h={h} />}
        footer={e.attachments?.length ? <FileChipList label="Anhänge" files={e.attachments} onDownload={downloadByName(e.attachments)} downloadLabel={(n) => `${n} herunterladen`} /> : null}
        lines={2}
        onOpen={() => h.onDetails(e)}
      >
        {e.preview ? <MentionText text={e.preview} /> : null}
      </ActivityItem>
    </PersonAction.Provider>
  );
}
