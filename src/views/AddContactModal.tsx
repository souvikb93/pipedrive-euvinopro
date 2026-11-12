import * as React from 'react';
import { Button, Divider, Dropdown, FieldAction, Input, Modal, Stack, Text, type LabelOption } from '@euvino/ds';
import { VISIBILITY } from './AddOrganisationModal';

export interface ContactEntry { value: string; type: string }

export interface NewContact {
  name: string;
  salutation: string;
  position: string;
  organisation: string;
  phones: ContactEntry[];
  emails: ContactEntry[];
  orgWebsite: string;
  orgPhone: string;
  owner: string;
  label: string | null;
  visibleTo: string;
}

export interface AddContactModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (c: NewContact) => void;
  onImport: () => void;
  labelOptions: LabelOption[];
  owners: string[];
}

const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }));
/** The signed-in user (first owner) is marked "(Sie)", as in Pipedrive. */
const ownerOpts = (list: string[]) => list.map((v, i) => ({ value: v, label: i === 0 ? `${v} (Sie)` : v }));
const PHONE_TYPES = ['Büro', 'Mobil', 'Privat', 'Sonstige'];
const EMAIL_TYPES = ['Büro', 'Privat', 'Sonstige'];
const SALUTATIONS = ['Frau', 'Herr', 'Divers', 'Keine Angabe'];

const empty = (owner: string): NewContact => ({
  name: '', salutation: '', position: '', organisation: '', phones: [{ value: '', type: 'Büro' }], emails: [{ value: '', type: 'Büro' }],
  orgWebsite: '', orgPhone: '', owner, label: null, visibleTo: VISIBILITY[0],
});

/** One repeatable value with its type: first row shows the labels, later rows reuse them. */
function EntryRows({ label, add, placeholder, entries, types, inputType, onChange }: { label: string; add: string; placeholder: string; entries: ContactEntry[]; types: string[]; inputType: 'tel' | 'email'; onChange: (e: ContactEntry[]) => void }) {
  const update = (i: number, patch: Partial<ContactEntry>) => onChange(entries.map((e, j) => (j === i ? { ...e, ...patch } : e)));
  return (
    <Stack gap="2">
      {entries.map((e, i) => (
        <Stack key={i} direction="horizontal" gap="2" align="end" className="entry-row">
          <Input label={i === 0 ? label : `${label} ${i + 1}`} hideLabel={i > 0} type={inputType} placeholder={placeholder} value={e.value} onChange={(ev) => update(i, { value: ev.target.value })} className="entry-row__value" />
          <Dropdown label={i === 0 ? 'Art' : `Art ${i + 1}`} hideLabel={i > 0} value={e.type} onChange={(v) => update(i, { type: v })} options={opts(types)} className="entry-row__type" />
        </Stack>
      ))}
      <FieldAction onClick={() => onChange([...entries, { value: '', type: types[0] }])}>{add}</FieldAction>
    </Stack>
  );
}

/** Two parts on one text edge, split by a divider: the person in aligned rows of two fields, then their organisation. */
export function AddContactModal({ open, onClose, onAdd, onImport, labelOptions, owners }: AddContactModalProps) {
  const [f, setF] = React.useState<NewContact>(empty(owners[0] ?? ''));
  const [error, setError] = React.useState<string | undefined>(undefined);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const set = <K extends keyof NewContact>(k: K) => (v: NewContact[K]) => setF((p) => ({ ...p, [k]: v }));

  React.useEffect(() => {
    if (!open) return;
    setF(empty(owners[0] ?? ''));
    setError(undefined);
  }, [open, owners]);


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
          <Button variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" type="submit" form="add-contact">Speichern</Button>
        </>
      }
    >
      <Stack as="form" id="add-contact" noValidate gap="6" onSubmit={submit}>
        <Stack as="section" gap="3" aria-labelledby="add-contact-person">
          <Text as="h3" id="add-contact-person" variant="label">Person</Text>
          <Stack gap="4">
            <Stack direction="horizontal" gap="8" align="start" className="form-columns">
              <Input ref={nameRef} label="Name" required placeholder="Vor- und Nachname" value={f.name} error={error} onChange={(e) => { set('name')(e.target.value); if (error) setError(undefined); }} />
              <Input label="Organisation" iconLeft="building" placeholder="Organisation eingeben" value={f.organisation} onChange={(e) => set('organisation')(e.target.value)} />
            </Stack>
            <Stack direction="horizontal" gap="8" align="start" className="form-columns">
              <EntryRows label="Telefonnummer" placeholder="z. B. +49 30 1234567" add="Telefonnummer hinzufügen" entries={f.phones} types={PHONE_TYPES} inputType="tel" onChange={set('phones')} />
              <EntryRows label="E-Mail" placeholder="name@firma.de" add="E-Mail-Adresse hinzufügen" entries={f.emails} types={EMAIL_TYPES} inputType="email" onChange={set('emails')} />
            </Stack>
            <Stack direction="horizontal" gap="8" align="start" className="form-columns">
              <Dropdown label="Besitzer" value={f.owner} onChange={set('owner')} options={ownerOpts(owners)} />
              <Dropdown label="Label" placeholder="Label hinzufügen" value={f.label ?? undefined} onChange={(v) => set('label')(v)} options={labelOptions.map((o) => ({ value: o.id, label: o.label }))} />
            </Stack>
            <Stack direction="horizontal" gap="8" align="start" className="form-columns">
              <Dropdown label="Anrede" placeholder="Auswählen" value={f.salutation || undefined} onChange={set('salutation')} options={opts(SALUTATIONS)} />
              <Input label="Position" placeholder="z. B. Einkaufsleitung" value={f.position} onChange={(e) => set('position')(e.target.value)} />
            </Stack>
          </Stack>
        </Stack>
        <Divider />
        <Stack as="section" gap="3" aria-labelledby="add-contact-org">
          <Text as="h3" id="add-contact-org" variant="label">Organisation</Text>
          <Stack direction="horizontal" gap="8" align="start" className="form-columns">
            <Input label="Website" type="url" placeholder="https://www.firma.de" value={f.orgWebsite} onChange={(e) => set('orgWebsite')(e.target.value)} />
            <Input label="Telefonnummer" type="tel" placeholder="z. B. +49 30 1234567" value={f.orgPhone} onChange={(e) => set('orgPhone')(e.target.value)} />
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  );
}
