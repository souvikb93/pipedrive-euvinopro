// Dummy "Verlauf" (history) for the organisation detail page. Peter Mertes follows the reference screen; every other
// organisation gets a generated history built from its own contacts, so each detail page has realistic content.
import type { Contact } from './contacts';
import type { Organisation } from './organisations';

export type HistoryKind = 'email' | 'note' | 'call' | 'activity' | 'whatsapp' | 'file' | 'change';

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  title: string;
  /** ISO day, used for the relative date in the meta line. */
  day: string;
  /** Rest of the meta line after the date, such as "Maximilian Eul → oliver.nuebel@scc-on.de +3". */
  meta: string;
  preview?: string;
  people?: string;
  organisation?: string;
  attachments?: string[];
}

export const TODAY = new Date('2026-11-11T00:00');
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];

/** "4. März 2021". */
export function shortGermanDate(day: string): string {
  const d = new Date(`${day}T00:00`);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Whole days from `day` to today. */
export function daysSince(day: string): number {
  return Math.max(0, Math.round((TODAY.getTime() - new Date(`${day}T00:00`).getTime()) / 86400000));
}

/** "15. Oktober 2026 (vor 27 Tagen)". */
export function germanDate(day: string): string {
  const d = new Date(`${day}T00:00`);
  const days = Math.round((TODAY.getTime() - d.getTime()) / 86400000);
  const rel = days <= 0 ? 'heute' : days === 1 ? 'gestern' : days < 30 ? `vor ${days} Tagen` : days < 60 ? 'vor 1 Monat' : `vor ${Math.floor(days / 30)} Monaten`;
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()} (${rel})`;
}

const PETER_MERTES: HistoryEntry[] = [
  { id: 'pm1', kind: 'email', day: '2026-10-15', title: 'Re: Peter Mertes - Übergabe GDSN-Daten kJ / kcal #14512', meta: 'Maximilian Eul → oliver.nuebel@scc-on.de +3', preview: 'Hallo Herr Nübel, die Anpassung ist nun live und kann ab sofort verwendet werden. Mit freundlichen Grüßen Maximilian Eul-Weiß …', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)', attachments: ['GDSN_kJ_kcal_Mapping.xlsx'] },
  { id: 'pm2', kind: 'email', day: '2026-10-14', title: 'Re: Peter Mertes - Übergabe GDSN-Daten kJ / kcal #14512', meta: 'Maximilian Eul → oliver.nuebel@scc-on.de +3', preview: 'Hallo Herr Nübel, diese Anpassung konnten wir zwischenzeitlich bereits umsetzen, sie wird zeitnah online gehen. Ich informiere Sie dann gern nochmal …', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)', attachments: ['Changelog_14512.pdf'] },
  { id: 'pm3', kind: 'call', day: '2026-10-12', title: 'Anruf mit Beate Schmitt', meta: '18 Min. · Johannes Finzer', preview: 'Rebsortenliste besprochen: Peter Mertes prüft intern, welche Artikel betroffen sind, und meldet sich bis Ende der Woche.', people: 'Beate Schmitt' },
  { id: 'pm4', kind: 'email', day: '2026-10-08', title: 'Re: Peter Mertes - Übergabe GDSN-Daten kJ / kcal #14512', meta: 'Maximilian Eul → oliver.nuebel@scc-on.de +3', preview: 'Hallo Herr Nübel, ich werde mich dazu mit den Kollegen abstimmen, wie und wann wir das am besten umsetzen können und informiere Sie, sobald ich dazu …', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)', attachments: ['Anfrage_Naehrwerte.pdf'] },
  { id: 'pm5', kind: 'note', day: '2026-09-28', title: 'Notiz', meta: 'Johannes Finzer', preview: 'Peter Mertes möchte ab Januar alle neuen Jahrgänge direkt über den GDSN-Connector melden. Ansprechpartnerin bleibt Beate Schmitt.' },
  { id: 'pm6', kind: 'email', day: '2026-09-03', title: 'Re: WG: Validierungsfehler Rebsorte', meta: 'Hinrichs → Beate Schmitt +1', preview: 'Hallo Frau Schmitt, in der Tat hat sich die Rebsortenliste wieder ohne erkennbaren Grund geändert. Die Rebsorte, die erst letztes Jahr in die Liste mit aufgeno…', people: 'Hinrichs (+2)', organisation: 'Peter Mertes KG We… (+1)', attachments: ['Rebsortenliste_2026.csv'] },
  { id: 'pm7', kind: 'email', day: '2026-09-02', title: 'Re: WG: Validierungsfehler Rebsorte', meta: 'Hinrichs → Beate Schmitt +1', preview: 'Sehr geehrte Frau Schmitt, die Fehlermeldung kommt nicht von uns sondern aus dem GDSN System. Ich fürchte, dass dort die Liste der akzeptierten Rebsorte…', people: 'Hinrichs (+2)', organisation: 'Peter Mertes KG We… (+1)', attachments: ['Fehlerprotokoll.txt'] },
  { id: 'pm8', kind: 'email', day: '2026-09-02', title: 'AW: Validierungsfehler Rebsorte', meta: 'Johannes Finzer → Beate Schmitt', preview: 'Hallo Frau Schmitt, der GDSN Datenpool hat wahrscheinlich wieder die Rebsortenliste angepasst. Schauen wir uns an und fixen das so schnell es geht. Ich mel…', people: 'Johannes Finzer (+1)', organisation: 'Euvino Gmbh (+1)' },
  { id: 'pm9', kind: 'email', day: '2026-09-02', title: 'Validierungsfehler Rebsorte', meta: 'Beate Schmitt → Johannes Finzer', preview: 'Sehr geehrter Herr Finzer, wir haben einen Validierungsfehler im Euvino System. Können sie den Vorgang bitte intern in ihrem Hause an den entsprechenden B…', people: 'Beate Schmitt (+1)', organisation: 'Peter Mertes KG We… (+1)' },
  { id: 'pm10', kind: 'activity', day: '2026-09-01', title: 'Termin: Abstimmung GDSN-Themen', meta: '10:00–11:00 · Johannes Finzer, Marco Lenz, Beate Schmitt', preview: 'Offene Punkte: Nährwertangaben kJ/kcal, Rebsortenliste, Marketingbotschaft M256.', people: 'Marco Lenz (+2)' },
  { id: 'pm11', kind: 'email', day: '2026-08-31', title: 'Peter Mertes - Umsetzung div Themen GDSN', meta: 'oliver.nuebel@scc-on.de → Johannes Finzer +3', preview: 'Hallo Herr Finzer, ich habe mit den Kolleginnen von Peter Mertes gesprochen. Wir können mit der Anpassung der folgenden Themen bis zur Rückkehr von Herrn…', people: 'Johannes Finzer (+3)', organisation: 'Euvino Gmbh (+1)' },
  { id: 'pm12', kind: 'email', day: '2026-08-24', title: 'Peter Mertes - Übergabe GDSN-Daten kJ / kcal', meta: 'oliver.nuebel@scc-on.de → Maximilian Eul +3', preview: 'Hallo Herr Eul-Weiß, wir haben in der GDSN-Übergabe noch ein Problem festgestellt. Bei der Übergabe von Nährwertangaben für Kalorien in kJ und kcal erfolg…', people: 'Maximilian Eul (+3)', organisation: 'Euvino Gmbh (+1)' },
  { id: 'pm13', kind: 'file', day: '2026-07-14', title: 'Produktdatenblatt_Mertes_2027.pdf', meta: 'hochgeladen von Johannes Finzer · 1,4 MB', people: 'Johannes Finzer' },
  { id: 'pm14', kind: 'change', day: '2026-06-02', title: 'Label geändert: Lead → Prospect', meta: 'Johannes Finzer' },
  { id: 'pm15', kind: 'email', day: '2026-03-19', title: 'Re: AW: Peter Mertes - GDSN Attribute M256 und M552', meta: 'Maximilian Eul → oliver.nuebel@scc-on.de +1', preview: 'Hallo Herr Nübel, Hallo Frau Schmitt, das gewünschte GDSN-Feature (Feld M256 Marketingbotschaft des Artikels) können wir mit einem geschätzten Gesamt…', people: 'Maximilian Eul (+1)', organisation: 'Euvino Gmbh (+1)', attachments: ['Angebot_M256.pdf'] },
  { id: 'pm16', kind: 'email', day: '2026-03-02', title: 'Publikation funktioniert nicht', meta: 'Beate Schmitt → Johannes Finzer', preview: 'Hallo Herr Finzer, seit heute Morgen werden unsere Artikel nicht mehr an den Datenpool publiziert. Können Sie bitte prüfen, woran das liegt?', people: 'Beate Schmitt (+1)', organisation: 'Peter Mertes KG We… (+1)' },
];

const shift = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00`);
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const lastName = (n: string) => n.replace(/,.*$/, '').split(' ').filter(Boolean).pop() ?? n;

/** A believable history for any organisation, built from its contacts and dates. */
function generate(o: Organisation, people: Contact[]): HistoryEntry[] {
  const p0 = people[0]?.name ?? 'Ansprechpartner';
  const p1 = people[1]?.name ?? p0;
  const mail0 = people[0]?.email ?? 'info@example.de';
  const extra = Math.max(0, people.length - 1);
  const start = o.lastActivity ? o.lastActivity.replace(/^(\d{2})\.(\d{2})\.(\d{4}).*$/, '$3-$2-$1') : '2026-11-04';
  const short = o.name.length > 22 ? `${o.name.slice(0, 20)}…` : o.name;
  return [
    { id: `${o.id}-1`, kind: 'email', day: start, title: `Re: ${o.name} - Produktdaten Saison 2027`, meta: `Johannes Finzer → ${mail0}${extra ? ` +${extra}` : ''}`, preview: `Hallo ${lastName(p0)}, anbei die aktualisierten Produktdaten für die Saison 2027. Bitte prüfen Sie die Preise und Jahrgänge bis Ende des Monats …`, people: `Johannes Finzer (+${extra + 1})`, organisation: 'Euvino Gmbh (+1)', attachments: ['Produktdaten_2027.xlsx'] },
    { id: `${o.id}-2`, kind: 'call', day: shift(start, 3), title: `Anruf mit ${p0}`, meta: '12 Min. · Johannes Finzer', preview: 'Liefertermine für das erste Quartal besprochen. Muster werden nächste Woche verschickt.', people: p0 },
    { id: `${o.id}-3`, kind: 'note', day: shift(start, 6), title: 'Notiz', meta: 'Johannes Finzer', preview: `${short} plant die Umstellung auf den GDSN-Connector. Zuständig: ${p0}.` },
    { id: `${o.id}-4`, kind: 'email', day: shift(start, 9), title: 'Frage zur GDSN-Übertragung', meta: `${p0} → Johannes Finzer`, preview: 'Guten Tag Herr Finzer, bei der letzten Übertragung fehlen bei einigen Artikeln die Allergenangaben. Können Sie das bitte prüfen?', people: `${p0} (+1)`, organisation: `${short} (+1)` },
    { id: `${o.id}-5`, kind: 'activity', day: shift(start, 14), title: 'Termin: Jahresgespräch 2027', meta: `10:00–11:00 · Johannes Finzer, ${p0}`, preview: 'Agenda: Sortiment 2027, Preisanpassungen, Datenqualität.', people: `${p0} (+1)` },
    { id: `${o.id}-6`, kind: 'whatsapp', day: shift(start, 18), title: `WhatsApp mit ${p1}`, meta: `${p1} → Johannes Finzer`, preview: 'Danke, die Muster sind gut angekommen. Wir melden uns nach der Verkostung.', people: p1 },
    { id: `${o.id}-7`, kind: 'file', day: shift(start, 25), title: 'Preisliste_2027.pdf', meta: 'hochgeladen von Johannes Finzer · 820 KB', people: 'Johannes Finzer' },
    { id: `${o.id}-8`, kind: 'change', day: shift(start, 40), title: 'Organisation angelegt', meta: 'Johannes Finzer' },
  ];
}

export function historyFor(o: Organisation, people: Contact[]): HistoryEntry[] {
  return o.id === 'peter-mertes' ? PETER_MERTES : generate(o, people);
}

/** The next planned activity of an organisation, shown in the Fokus card and edited in the activity modal. */
export interface FocusActivity {
  kind: 'call' | 'activity' | 'email';
  /** Activity type in German, such as "Anruf". */
  type: string;
  title: string;
  /** ISO day, such as "2026-11-12". */
  day: string;
  /** Minutes from midnight. */
  start: number;
  end: number;
  /** Person the activity is assigned to. */
  assignee: string;
}

// Fokus shows a Termin for every organisation: only meetings have participants whose calendars can be compared.
const NEXT: Array<Pick<FocusActivity, 'kind' | 'type' | 'title'>> = [
  { kind: 'activity', type: 'Termin', title: 'Rückmeldung zum Produktkatalog einholen' },
  { kind: 'activity', type: 'Termin', title: 'Jahresgespräch 2027 vorbereiten' },
  { kind: 'activity', type: 'Termin', title: 'Offene GDSN-Daten abstimmen' },
  { kind: 'activity', type: 'Termin', title: 'Preisliste 2027 besprechen' },
];

/** Builds the Fokus activity from the organisation's `nextActivity` ("12.11.2026 · 10:30"). Returns null when none is planned. */
export function nextActivityFor(o: Organisation, index: number): FocusActivity | null {
  const m = /^(\d{2})\.(\d{2})\.(\d{4}) · (\d{2}):(\d{2})$/.exec(o.nextActivity);
  if (!m) return null;
  const [, dd, mm, yyyy, hh, min] = m;
  const start = Number(hh) * 60 + Number(min);
  return { ...NEXT[index % NEXT.length], day: `${yyyy}-${mm}-${dd}`, start, end: start + 30, assignee: 'Johannes Finzer' };
}
