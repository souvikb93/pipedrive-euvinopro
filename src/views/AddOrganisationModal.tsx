import * as React from 'react';
import { Button, Dropdown, Input, Modal, Stack, type LabelOption } from '@euvino/ds';

export interface NewOrganisation {
  name: string;
  address: string;
  owner: string;
  label: string | null;
}

export interface AddOrganisationModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (org: NewOrganisation) => void;
  labelOptions: LabelOption[];
  owners: string[];
}

/** Start of the organisation creation flow: the fields needed to create the record. */
export function AddOrganisationModal({ open, onClose, onAdd, labelOptions, owners }: AddOrganisationModalProps) {
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [owner, setOwner] = React.useState(owners[0] ?? '');
  const [label, setLabel] = React.useState<string | undefined>(undefined);
  const [error, setError] = React.useState<string | undefined>(undefined);
  const nameRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (!open) return;
    setName(''); setAddress(''); setOwner(owners[0] ?? ''); setLabel(undefined); setError(undefined);
  }, [open, owners]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Geben Sie den Namen der Organisation ein.');
      nameRef.current?.focus();
      return;
    }
    onAdd({ name: name.trim(), address: address.trim(), owner, label: label ?? null });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Organisation hinzufügen"
      closeLabel="Schließen"
      footer={
        <>
          <Button variant="tertiary" onClick={onClose}>Abbrechen</Button>
          <Button variant="primary" type="submit" form="add-organisation">Organisation hinzufügen</Button>
        </>
      }
    >
      <Stack as="form" id="add-organisation" gap="4" onSubmit={submit}>
        <Input ref={nameRef} label="Name" required value={name} error={error} onChange={(e) => { setName(e.target.value); if (error) setError(undefined); }} />
        <Input label="Adresse" value={address} onChange={(e) => setAddress(e.target.value)} />
        <Dropdown label="Besitzer" value={owner} onChange={setOwner} options={owners.map((o) => ({ value: o, label: o }))} />
        <Dropdown label="Label" placeholder="Kein Label" value={label} onChange={setLabel} options={labelOptions.map((o) => ({ value: o.id, label: o.label }))} />
      </Stack>
    </Modal>
  );
}
