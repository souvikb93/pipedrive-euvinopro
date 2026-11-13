// Sort options of the two list views.

export type ContactSort = 'name' | 'organisation' | 'next';
export const CONTACT_SORTS: Array<{ key: ContactSort; label: string }> = [
  { key: 'name', label: 'Name (A–Z)' },
  { key: 'organisation', label: 'Organisation (A–Z)' },
  { key: 'next', label: 'Nächste Aktivität' },
];
export type OrgSort = 'name' | 'owner' | 'next' | 'last';
export const ORG_SORTS: Array<{ key: OrgSort; label: string }> = [
  { key: 'name', label: 'Organisation (A–Z)' },
  { key: 'owner', label: 'Besitzer (A–Z)' },
  { key: 'next', label: 'Nächste Aktivität' },
  { key: 'last', label: 'Letzte Aktivität (neueste zuerst)' },
];
