import * as React from 'react';
import type { LabelOption, Status } from '@euvino/ds';
import type { ContactLabel } from '../../data/contacts';
import { slug } from '../../lib/format';

// Figma: Badge Size=Tiny, Style=Subtle. State per label.
const LABELS: Record<ContactLabel, { text: string; status: Status }> = {
  customer: { text: 'Customer', status: 'success' },
  partner: { text: 'Partner', status: 'default' },
  prospect: { text: 'Prospect', status: 'warning' },
  'hot-lead': { text: 'Hot Lead', status: 'error' },
  lead: { text: 'Lead', status: 'info' },
};
export const baseLabelOptions = (): LabelOption[] => (Object.keys(LABELS) as ContactLabel[]).map((id) => ({ id, label: LABELS[id].text, status: LABELS[id].status }));
export const LABEL_TEXTS = { search: 'Label suchen', add: 'Label hinzufügen', addNamed: (n: string) => `„${n}“ als Label hinzufügen`, empty: 'Kein Label gefunden', none: 'Kein Label' };

/** Label column, label filter and sort menu behave the same in every view; each view keeps its own state. */
export function useLabels<T extends { id: string; label: string }>(rows: T[]) {
  const [options, setOptions] = React.useState<LabelOption[]>(baseLabelOptions);
  const [labelOf, setLabelOf] = React.useState<Record<string, string>>(() => Object.fromEntries(rows.map((r) => [r.id, r.label])));
  const name = (id: string | null) => options.find((o) => o.id === id)?.label ?? '';
  const create = (rowId: string, label: string) => {
    const id = `custom-${slug(label)}`;
    setOptions((o) => (o.some((x) => x.id === id) ? o : [...o, { id, label, status: 'default' }]));
    setLabelOf((m) => ({ ...m, [rowId]: id }));
  };
  return { options, labelOf, setLabelOf, name, create };
}
