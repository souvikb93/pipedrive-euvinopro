import type { GlobalSearchCategory, GlobalSearchHit } from '@euvino/ds';
import type { Contact } from './contacts';

// Global search: categories in the header search and the matching over contacts and their organisations.

export const CATEGORIES: Array<Omit<GlobalSearchCategory, 'count'>> = [
  { id: 'all', label: 'Alle Kategorien', icon: 'view-grid' },
  { id: 'deals', label: 'Deals', icon: 'coin' },
  { id: 'leads', label: 'Leads', icon: 'star' },
  { id: 'contacts', label: 'Kontakte', icon: 'user' },
  { id: 'organisations', label: 'Organisationen', icon: 'building' },
  { id: 'activities', label: 'Aktivitäten', icon: 'calendar' },
  { id: 'products', label: 'Produkte', icon: 'box' },
  { id: 'files', label: 'Dateien', icon: 'attachment' },
  { id: 'knowledge', label: 'Knowledge Base', icon: 'book' },
  { id: 'apps', label: 'Apps', icon: 'app-window' },
];

export type Hit = GlobalSearchHit & { kind: 'contacts' | 'organisations'; lead: boolean };

/** All hits for the text, organisations first, then people. */
export function searchAll(query: string, people: Contact[]): Hit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const has = (v: string) => v.toLowerCase().includes(q);
  const orgs = [...new Set(people.map((c) => c.organisation))].flatMap((o): Hit[] => {
    const members = people.filter((c) => c.organisation === o);
    const viaEmail = members.filter((c) => has(c.email));
    if (!has(o) && viaEmail.length === 0) return [];
    const lines = [`${members.length} Kontaktpersonen`];
    if (viaEmail.length) lines.push(`Gefundene Übereinstimmung in E-Mail: ${viaEmail.map((c) => c.email).join(', ')}`);
    return [{ id: `org-${o}`, title: o, icon: 'building', lines, kind: 'organisations', lead: false }];
  });
  const found = people
    .filter((c) => [c.name, c.email, c.organisation, ...c.phones].some(has))
    .map((c): Hit => ({
      id: c.id,
      title: c.name,
      person: c.name,
      lines: [`${c.organisation} | ${c.email}`, ...(c.phones.some(has) ? [c.phones.join(', ')] : [])],
      kind: 'contacts',
      lead: c.label === 'lead' || c.label === 'hot-lead',
    }));
  return [...orgs, ...found];
}

export function inCategory(hits: Hit[], id: string) {
  if (id === 'all') return hits;
  if (id === 'leads') return hits.filter((h) => h.lead);
  return hits.filter((h) => h.kind === id);
}
