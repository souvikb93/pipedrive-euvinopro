import * as React from 'react';
import { Button, Dropdown, Input, Modal, Stack, type LabelOption } from '@euvino/ds';

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

/** Landscape form, one part in three columns: ownership, contact details, classification. */
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
      title="Organisation hinzufügen"
      closeLabel="Schließen"
      footerStart={<Button variant="tertiary" icon="upload" onClick={onImport}>Import</Button>}
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" type="submit" form="add-organisation">Speichern</Button>
        </>
      }
    >
      <Stack as="form" id="add-organisation" noValidate direction="horizontal" gap="6" align="start" className="form-columns" onSubmit={submit}>
        <Stack gap="4">
          <Input ref={nameRef} label="Name" required value={f.name} error={error} onChange={(e) => { set('name')(e.target.value); if (error) setError(undefined); }} />
          <Dropdown label="Besitzer" value={f.owner} onChange={set('owner')} options={opts(owners)} />
          <Dropdown label="Label" placeholder="Label hinzufügen" value={f.label ?? undefined} onChange={(v) => set('label')(v)} options={labelOptions.map((o) => ({ value: o.id, label: o.label }))} />
          <Dropdown label="Sichtbar für" value={f.visibleTo} onChange={set('visibleTo')} options={opts(VISIBILITY)} />
        </Stack>
        <Stack gap="4">
          <Input label="Adresse" value={f.address} onChange={(e) => set('address')(e.target.value)} />
          <Input label="PLZ" inputMode="numeric" value={f.postalCode} onChange={(e) => set('postalCode')(e.target.value)} />
          <Input label="Website" type="url" placeholder="https://" value={f.website} onChange={(e) => set('website')(e.target.value)} />
          <Input label="E-Mail" type="email" value={f.email} onChange={(e) => set('email')(e.target.value)} />
          <Input label="Telefonnummer" type="tel" value={f.phone} onChange={(e) => set('phone')(e.target.value)} />
          <Input label="Geschäftsführer" iconLeft="user" value={f.managingDirector} onChange={(e) => set('managingDirector')(e.target.value)} />
        </Stack>
        <Stack gap="4">
          <Dropdown label="Branchenzweig" placeholder="Auswählen" value={f.industry || undefined} onChange={set('industry')} options={opts(INDUSTRY)} />
          <Dropdown label="Branchenzweig Produzent" placeholder="Auswählen" value={f.producerType || undefined} onChange={set('producerType')} options={opts(PRODUCER)} />
          <Dropdown label="Kundenkategorie" placeholder="Auswählen" value={f.customerCategory || undefined} onChange={set('customerCategory')} options={opts(CATEGORY)} />
          <Dropdown label="Mitglied Kooperation" placeholder="Auswählen" value={f.cooperation || undefined} onChange={set('cooperation')} options={opts(YES_NO)} />
          <Input label="Verbund" value={f.association} onChange={(e) => set('association')(e.target.value)} />
          <Dropdown label="ERP" placeholder="Auswählen" value={f.erp || undefined} onChange={set('erp')} options={opts(ERP)} />
        </Stack>
      </Stack>
    </Modal>
  );
}
