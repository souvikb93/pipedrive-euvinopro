import * as React from 'react';
import { Button, Divider, Dropdown, Input, Modal, Stack, Text, type LabelOption } from '@euvino/ds';
import { VISIBILITY } from './AddOrganisationModal';

export interface ContactEntry { value: string; type: string }

export interface NewContact {
  name: string;
  salutation: string;
  position: string;
  organisationId: string | null;
  phones: ContactEntry[];
  emails: ContactEntry[];
  orgWebsite: string;
  orgPhone: string;
  owner: string;
  label: string | null;
  visibleTo: string;
}

export interface OrganisationChoice { id: string; name: string; website: string; phone: string }

export interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (c: NewContact) => void;
  onImport: () => void;
  organisations: OrganisationChoice[];
  labelOptions: LabelOption[];
  owners: string[];
}

const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }));
const PHONE_TYPES = ['Büro', 'Mobil', 'Privat', 'Sonstige'];
const EMAIL_TYPES = ['Büro', 'Privat', 'Sonstige'];
const SALUTATIONS = ['Frau', 'Herr', 'Divers', 'Keine Angabe'];

const empty = (owner: string): NewContact => ({
  name: '', salutation: '', position: '', organisationId: null, phones: [{ value: '', type: 'Büro' }], emails: [{ value: '', type: 'Büro' }],
  orgWebsite: '', orgPhone: '', owner, label: null, visibleTo: VISIBILITY[0],
});

/** Section title with a one-line explanation, shared by both add modals. */
export function FormSection({ title, hint }: { title: string; hint?: string }) {
  return (
    <Stack gap="1">
      <Text variant="card-title">{title}</Text>
      {hint ? <Text variant="caption" tone="body">{hint}</Text> : null}
    </Stack>
  );
}

/** One repeatable value with its type: first row shows the labels, later rows reuse them. */
function EntryRows({ label, add, entries, types, inputType, onChange }: { label: string; add: string; entries: ContactEntry[]; types: string[]; inputType: 'tel' | 'email'; onChange: (e: ContactEntry[]) => void }) {
  const update = (i: number, patch: Partial<ContactEntry>) => onChange(entries.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  return (
    <Stack gap="2">
      {entries.map((e, i) => (
        <Stack key={i} direction="horizontal" gap="2" align="end" className="entry-row">
          <Input label={i === 0 ? label : `${label} ${i + 1}`} hideLabel={i > 0} type={inputType} value={e.value} onChange={(ev) => update(i, { value: ev.target.value })} className="entry-row__value" />
          <Dropdown label={i === 0 ? 'Art' : `Art ${i + 1}`} hideLabel={i > 0} value={e.type} onChange={(v) => update(i, { type: v })} options={opts(types)} className="entry-row__type" />
        </Stack>
      ))}
      <Stack direction="horizontal">
        <Button variant="tertiary" size="small" icon="plus" onClick={() => onChange([...entries, { value: '', type: types[0] }])}>{add}</Button>
      </Stack>
    </Stack>
  );
}

/** Landscape form in two parts split by a divider: the person (two field columns) and their organisation. */
export function AddContactModal({ open, onClose, onAdd, onImport, organisations, labelOptions, owners }: AddContactModalProps) {
  const [f, setF] = React.useState<NewContact>(empty(owners[0] ?? ''));
  const [error, setError] = React.useState<string | undefined>(undefined);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const set = <K extends keyof NewContact>(k: K) => (v: NewContact[K]) => setF((p) => ({ ...p, [k]: v }));

  React.useEffect(() => {
    if (!open) return;
    setF(empty(owners[0] ?? ''));
    setError(undefined);
  }, [open, owners]);

  const pickOrganisation = (id: string) => {
    const o = organisations.find((x) => x.id === id);
    setF((p) => ({ ...p, organisationId: id, orgWebsite: o?.website ?? '', orgPhone: o?.phone ?? '' }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) {
      setError('Geben Sie den Namen der Person ein.');
      nameRef.current?.focus();
      return;
    }
    onAdd({ ...f, name: f.name.trim() });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xlarge"
      title="Kontakt hinzufügen"
      closeLabel="Schließen"
      footerStart={<Button variant="tertiary" icon="upload" onClick={onImport}>Import</Button>}
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" type="submit" form="add-contact">Speichern</Button>
        </>
      }
    >
      <Stack as="form" id="add-contact" noValidate direction="horizontal" gap="6" align="stretch" className="contact-form" onSubmit={submit}>
        <Stack gap="4" className="contact-form__person">
          <FormSection title="Person" hint="Wer ist der Kontakt und wie erreichen Sie ihn?" />
          <Input ref={nameRef} label="Name" required value={f.name} error={error} onChange={(e) => { set('name')(e.target.value); if (error) setError(undefined); }} />
          <Stack direction="horizontal" gap="4" align="start" className="form-columns">
            <Dropdown label="Anrede" placeholder="Auswählen" value={f.salutation || undefined} onChange={set('salutation')} options={opts(SALUTATIONS)} />
            <Input label="Position" value={f.position} onChange={(e) => set('position')(e.target.value)} />
          </Stack>
          <Stack direction="horizontal" gap="4" align="start" className="form-columns">
            <EntryRows label="Telefonnummer" add="Telefonnummer hinzufügen" entries={f.phones} types={PHONE_TYPES} inputType="tel" onChange={set('phones')} />
            <EntryRows label="E-Mail" add="E-Mail-Adresse hinzufügen" entries={f.emails} types={EMAIL_TYPES} inputType="email" onChange={set('emails')} />
          </Stack>
          <Stack direction="horizontal" gap="4" align="start" className="form-columns">
            <Dropdown label="Besitzer" value={f.owner} onChange={set('owner')} options={opts(owners)} />
            <Dropdown label="Label" placeholder="Label hinzufügen" value={f.label ?? undefined} onChange={(v) => set('label')(v)} options={labelOptions.map((o) => ({ value: o.id, label: o.label }))} />
          </Stack>
          <Stack direction="horizontal" gap="4" align="start" className="form-columns">
            <Dropdown label="Sichtbar für" value={f.visibleTo} onChange={set('visibleTo')} options={opts(VISIBILITY)} />
            <span aria-hidden="true" />
          </Stack>
        </Stack>
        <Divider orientation="vertical" />
        <Stack gap="4" className="contact-form__org">
          <FormSection title="Organisation" hint="Firma, zu der die Person gehört. Website und Telefon werden aus der Organisation übernommen." />
          <Dropdown label="Organisation" placeholder="Organisation auswählen" value={f.organisationId ?? undefined} onChange={pickOrganisation} options={organisations.map((o) => ({ value: o.id, label: o.name }))} />
          <Input label="Website" type="url" placeholder="https://" value={f.orgWebsite} onChange={(e) => set('orgWebsite')(e.target.value)} />
          <Input label="Telefonnummer" type="tel" value={f.orgPhone} onChange={(e) => set('orgPhone')(e.target.value)} />
        </Stack>
      </Stack>
    </Modal>
  );
}
