import * as React from 'react';
import { Button, Dropdown, Input, Modal, Stack, type LabelOption } from '@euvino/ds';

/** The signed-in user (first owner) is marked "(Sie)", as in Pipedrive. */
const ownerOpts = (list: string[]) => list.map((v, i) => ({ value: v, label: i === 0 ? `${v} (Sie)` : v }));

export interface NewOrganisation {
  name: string;
  owner: string;
  label: string | null;
  visibleTo: string;
  address: string;
  postalCode: string;
  website: string;
  email: string;
  phone: string;
  managingDirector: string;
  industry: string;
  producerType: string;
  customerCategory: string;
  cooperation: string;
  association: string;
  erp: string;
}

export interface AddOrganisationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (org: NewOrganisation) => void;
  onImport: () => void;
  labelOptions: LabelOption[];
  owners: string[];
}

const opts = (list: string[]) => list.map((v) => ({ value: v, label: v }));
export const VISIBILITY = ['Alle Nutzer', 'Nur Besitzer', 'Team Vertrieb'];
const INDUSTRY = ['Erzeuger', 'Importeur', 'Distributor', 'Einzelhandel', 'Großhandel', 'Genossenschaft', 'Gastronomie'];
const PRODUCER = ['Weingut', 'Sektkellerei', 'Weinkellerei', 'Winzergenossenschaft', 'Brennerei'];
const CATEGORY = ['A-Kunde', 'B-Kunde', 'C-Kunde', 'Neukunde'];
const YES_NO = ['Ja', 'Nein'];
const ERP = ['SAP', 'Microsoft Dynamics', 'DATEV', 'Sage', 'Kein ERP'];

const empty = (owner: string): NewOrganisation => ({
  name: '', owner, label: null, visibleTo: VISIBILITY[0], address: '', postalCode: '', website: '', email: '', phone: '',
  managingDirector: '', industry: '', producerType: '', customerCategory: '', cooperation: '', association: '', erp: '',
});

/** Landscape form, one part in three columns, fields in the order of the Pipedrive form. */
export function AddOrganisationModal({ open, onClose, onAdd, onImport, labelOptions, owners }: AddOrganisationModalProps) {
  const [f, setF] = React.useState<NewOrganisation>(empty(owners[0] ?? ''));
  const [error, setError] = React.useState<string | undefined>(undefined);
  const nameRef = React.useRef<HTMLInputElement>(null);
  const set = <K extends keyof NewOrganisation>(k: K) => (v: NewOrganisation[K]) => setF((p) => ({ ...p, [k]: v }));

  React.useEffect(() => {
    if (!open) return;
    setF(empty(owners[0] ?? ''));
    setError(undefined);
  }, [open, owners]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.name.trim()) {
      setError('Geben Sie den Namen der Organisation ein.');
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
      title="Unternehmen hinzufügen"
      closeLabel="Schließen"
      footerStart={<Button variant="tertiary" icon="upload" onClick={onImport}>Import</Button>}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" type="submit" form="add-organisation">Speichern</Button>
        </>
      }
    >
      <Stack as="form" id="add-organisation" noValidate direction="horizontal" gap="8" align="start" className="form-columns" onSubmit={submit}>
        <Stack gap="2">
          <Input ref={nameRef} label="Name" required placeholder="z. B. Weingut Muster GmbH" value={f.name} error={error} onChange={(e) => { set('name')(e.target.value); if (error) setError(undefined); }} />
          <Dropdown label="Besitzer" value={f.owner} onChange={set('owner')} options={ownerOpts(owners)} />
          <Input label="Adresse" placeholder="Straße, Hausnummer, Ort" value={f.address} onChange={(e) => set('address')(e.target.value)} />
          <Dropdown label="Label" placeholder="Label hinzufügen" value={f.label ?? undefined} onChange={(v) => set('label')(v)} options={labelOptions.map((o) => ({ value: o.id, label: o.label }))} />
          <Input label="Website" type="url" placeholder="https://www.firma.de" value={f.website} onChange={(e) => set('website')(e.target.value)} />
          <Input label="Email" type="email" placeholder="info@firma.de" value={f.email} onChange={(e) => set('email')(e.target.value)} />
        </Stack>
        <Stack gap="2">
          <Input label="Telefonnummer" type="tel" placeholder="z. B. +49 30 1234567" value={f.phone} onChange={(e) => set('phone')(e.target.value)} />
          <Input label="Geschäftsführer" iconLeft="user" placeholder="Vor- und Nachname" value={f.managingDirector} onChange={(e) => set('managingDirector')(e.target.value)} />
          <Dropdown label="Branchenzweig" placeholder="Branchenzweig auswählen" value={f.industry || undefined} onChange={set('industry')} options={opts(INDUSTRY)} />
          <Dropdown label="Branchenzweig Produzent" placeholder="Produzententyp auswählen" value={f.producerType || undefined} onChange={set('producerType')} options={opts(PRODUCER)} />
          <Dropdown label="Kundenkategorien" placeholder="Kategorie auswählen" value={f.customerCategory || undefined} onChange={set('customerCategory')} options={opts(CATEGORY)} />
        </Stack>
        <Stack gap="2">
          <Dropdown label="Mitglied Kooperation" placeholder="Ja oder Nein" value={f.cooperation || undefined} onChange={set('cooperation')} options={opts(YES_NO)} />
          <Input label="Verbund" placeholder="z. B. Weinverbund Nord" value={f.association} onChange={(e) => set('association')(e.target.value)} />
          <Input label="PLZ" inputMode="numeric" placeholder="z. B. 10115" value={f.postalCode} onChange={(e) => set('postalCode')(e.target.value)} />
          <Dropdown label="ERP" placeholder="ERP-System auswählen" value={f.erp || undefined} onChange={set('erp')} options={opts(ERP)} />
          <Dropdown label="Sichtbar für" value={f.visibleTo} onChange={set('visibleTo')} options={opts(VISIBILITY)} />
        </Stack>
      </Stack>
    </Modal>
  );
}
