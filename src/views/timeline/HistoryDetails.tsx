import * as React from 'react';
import { Button, ConfirmDialog, Drawer, FileChipList, InlineList, KeyValueList, LinkButton, Stack, Text, Textarea } from '@euvino/ds';
import { organisations } from '../../data/organisations';
import type { HistoryEntry } from '../../data/history';
import { hrefFor } from '../../route';
import { MentionText, PersonAction, Person } from '../shared/people';
import { KIND_NAME, ReplyButton, entryWhen, type HistoryHandlers } from './HistoryCard';
import { downloadByName } from './download';

const ORG_ID = new Map(organisations.flatMap((o) => [[o.name, o.id], [o.contactOrg, o.id]] as Array<[string, string]>));

function Organisation({ name }: { name: string }) {
  const id = ORG_ID.get(name);
  return id ? <LinkButton variant="link" href={hrefFor.organisation(id)}>{name}</LinkButton> : <span>{name}</span>;
}

/** Detail view of one entry: all fields, the full text and the files. Notes are edited here. */
export function HistoryDetails({ e, editing, onClose, onSave, h }: { e: HistoryEntry | null; editing: boolean; onClose: () => void; onSave: (e: HistoryEntry, text: string) => void; h: HistoryHandlers }) {
  const [text, setText] = React.useState('');
  React.useEffect(() => { setText(e?.body ?? e?.preview ?? ''); }, [e, editing]);
  if (!e) return null;
  const rows: Array<{ label: string; value: React.ReactNode }> = [
    { label: 'Art', value: KIND_NAME[e.kind] },
    { label: 'Datum', value: entryWhen(e) },
  ];
  if (e.by) rows.push({ label: e.kind === 'email' || e.kind === 'whatsapp' ? 'Von' : e.kind === 'file' ? 'Hochgeladen von' : 'Erstellt von', value: <Person p={e.by} /> });
  if (e.to?.length) rows.push({ label: e.kind === 'activity' ? 'Teilnehmer' : 'An', value: <Stack gap="1">{e.to.map((p) => <InlineList key={p.name} items={[<Person p={p} />, p.email && p.email !== p.name ? <Text as="span" variant="caption" tone="muted">{p.email}</Text> : null]} />)}</Stack> });
  if (e.extra) rows.push({ label: e.kind === 'call' ? 'Dauer' : 'Größe', value: e.extra });
  if (e.contacts?.length) rows.push({ label: 'Kontakte', value: <Stack gap="1">{e.contacts.map((p) => <span key={p.name}><Person p={p} /></span>)}</Stack> });
  if (e.organisations?.length) rows.push({ label: 'Organisationen', value: <Stack gap="1">{e.organisations.map((n) => <span key={n}><Organisation name={n} /></span>)}</Stack> });
  const footer = editing
    ? <Stack direction="horizontal" gap="2" justify="end"><Button variant="secondary" onClick={onClose}>Abbrechen</Button><Button variant="primary" onClick={() => onSave(e, text)} disabled={!text.trim()}>Speichern</Button></Stack>
    : e.kind === 'email'
      ? <Stack direction="horizontal" gap="2" justify="end"><Button variant="secondary" onClick={onClose}>Schließen</Button><ReplyButton e={e} h={h} variant="primary" /></Stack>
      : <Stack direction="horizontal" gap="2" justify="end">{e.kind === 'note' ? <Button variant="secondary" onClick={() => h.onEdit(e)}>Bearbeiten</Button> : null}<Button variant="primary" onClick={onClose}>Schließen</Button></Stack>;
  return (
    <PersonAction.Provider value={h.onPerson}>
      <Drawer open onClose={onClose} title={e.title} closeLabel="Schließen" footer={footer}>
        <Stack gap="6">
          <KeyValueList layout="columns" items={rows} />
          {editing ? (
            <Textarea label="Notiz" value={text} onChange={(ev) => setText(ev.target.value)} rows={6} />
          ) : e.body || e.preview ? (
            <Stack gap="2">
              <Text as="h3" variant="h6">{e.kind === 'email' ? 'Nachricht' : e.kind === 'note' ? 'Notiz' : 'Beschreibung'}</Text>
              <Text as="div" variant="body-small"><MentionText text={e.body ?? e.preview ?? ''} /></Text>
            </Stack>
          ) : null}
          {e.attachments?.length ? (
            <Stack gap="2">
              <Text as="h3" variant="h6">{e.attachments.length === 1 ? 'Anhang' : `Anhänge (${e.attachments.length})`}</Text>
              <FileChipList label="Anhänge" files={e.attachments} onDownload={downloadByName(e.attachments)} downloadLabel={(n) => `${n} herunterladen`} />
            </Stack>
          ) : null}
        </Stack>
      </Drawer>
    </PersonAction.Provider>
  );
}

/** Asks before a history entry is removed. */
export function DeleteEntry({ e, onCancel, onConfirm }: { e: HistoryEntry | null; onCancel: () => void; onConfirm: () => void }) {
  const kind = e ? KIND_NAME[e.kind] : 'Eintrag';
  return (
    <ConfirmDialog open={!!e} tone="danger" title={`${kind} löschen?`} confirmLabel={`${kind} löschen`} cancelLabel="Abbrechen" onCancel={onCancel} onConfirm={onConfirm}>
      {e ? `„${e.title}“ wird aus dem Verlauf entfernt. Das lässt sich nicht rückgängig machen.` : ''}
    </ConfirmDialog>
  );
}
