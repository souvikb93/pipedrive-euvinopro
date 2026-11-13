// Dummy "Verlauf" (history) for the organisation detail page. Peter Mertes follows the reference screen; every other
// organisation gets a generated history built from its own contacts, so each detail page has realistic content.
import type { Contact } from './contacts';
import type { Organisation } from './organisations';

export type HistoryKind = 'email' | 'note' | 'call' | 'activity' | 'whatsapp' | 'file' | 'change';

/** A person in the history. Shown by name; matched to a contact record by name when one exists. */
export interface PersonRef {
  name: string;
  email?: string;
}

export interface Attachment {
  name: string;
  /** "4,2 MB". */
  size: string;
}

export interface HistoryEntry {
  id: string;
  kind: HistoryKind;
  /** Subject of an email, title of a note, call or meeting. */
  title: string;
  /** ISO day. */
  day: string;
  /** "10:24". */
  time?: string;
  /** "10:00–11:00" for meetings. */
  span?: string;
  /** Who wrote, called or uploaded it. */
  by?: PersonRef;
  /** Email and WhatsApp recipients, meeting participants. */
  to?: PersonRef[];
  /** "12 Min." for calls, "1,4 MB" for files. */
  extra?: string;
  /** Text shown on the card; the detail view shows `body` when there is one. */
  preview?: string;
  body?: string;
  /** Related contacts, shown in the footer. */
  contacts?: PersonRef[];
  /** Related organisations by name, shown in the footer. */
  organisations?: string[];
  attachments?: Attachment[];
}

export const TODAY = new Date('2026-11-11T00:00');
const MONTHS = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'];
const MONTHS_SHORT = ['Jan.', 'Feb.', 'März', 'Apr.', 'Mai', 'Juni', 'Juli', 'Aug.', 'Sept.', 'Okt.', 'Nov.', 'Dez.'];

/** "4. März 2021". */
export function shortGermanDate(day: string): string {
  const d = new Date(`${day}T00:00`);
  return `${d.getDate()}. ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** "28. Okt. 2026, 10:24". */
export function entryDate(day: string, time?: string): string {
  const d = new Date(`${day}T00:00`);
  return `${d.getDate()}. ${MONTHS_SHORT[d.getMonth()]} ${d.getFullYear()}${time ? `, ${time}` : ''}`;
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

/** All searchable text of an entry, for counting mentions in Überblick. */
export function entryText(e: HistoryEntry): string {
  const names = [e.by, ...(e.to ?? []), ...(e.contacts ?? [])].filter(Boolean).map((p) => p!.name);
  return [e.title, e.preview ?? '', e.body ?? '', ...names].join(' ');
}

const JF: PersonRef = { name: 'Johannes Finzer', email: 'johannes.finzer@euvino.de' };
const ME: PersonRef = { name: 'Maximilian Eul', email: 'maximilian.eul@euvino.de' };
const NUEBEL: PersonRef = { name: 'Oliver Nübel', email: 'oliver.nuebel@scc-on.de' };
const SCHMITT: PersonRef = { name: 'Beate Schmitt', email: 'beate.schmitt@mertes.de' };
const KAISER: PersonRef = { name: 'Christine Kaiser', email: 'christine.kaiser@mertes.de' };
const DIEWALD: PersonRef = { name: 'N Diewald', email: 'n.diewald@mertes.de' };
const LENZ: PersonRef = { name: 'Marco Lenz', email: 'marco.lenz@mertes.de' };
const HINRICHS: PersonRef = { name: 'Hinrichs', email: 'hinrichs@scc-on.de' };
const MERTES = 'Peter Mertes KG Weingut';
const SCC = 'SCC Onlinesysteme';

const PETER_MERTES: HistoryEntry[] = [
  { id: 'pm1', kind: 'email', day: '2026-10-15', time: '15:12', title: 'Re: Peter Mertes – Übergabe GDSN-Daten kJ / kcal (Ticket 14512)', by: ME, to: [NUEBEL, SCHMITT, KAISER, JF], preview: 'Hallo Herr Nübel, die Anpassung ist nun live und kann ab sofort verwendet werden. Mit freundlichen Grüßen Maximilian Eul-Weiß', contacts: [SCHMITT, KAISER], organisations: [MERTES, SCC], attachments: [{ name: 'GDSN_kJ_kcal_Mapping.xlsx', size: '86 KB' }] },
  { id: 'pm2', kind: 'email', day: '2026-10-14', time: '09:41', title: 'Re: Peter Mertes – Übergabe GDSN-Daten kJ / kcal (Ticket 14512)', by: ME, to: [NUEBEL, SCHMITT, KAISER, JF], preview: 'Hallo Herr Nübel, diese Anpassung konnten wir zwischenzeitlich bereits umsetzen, sie wird zeitnah online gehen. Ich informiere Sie dann gern nochmal, sobald sie live ist.', contacts: [SCHMITT, KAISER], organisations: [MERTES, SCC], attachments: [{ name: 'Changelog_14512.pdf', size: '212 KB' }] },
  { id: 'pm3', kind: 'call', day: '2026-10-12', time: '11:30', title: 'Anruf mit Beate Schmitt', by: JF, extra: '18 Min.', preview: 'Rebsortenliste besprochen: Peter Mertes prüft intern, welche Artikel betroffen sind, und meldet sich bis Ende der Woche.', contacts: [SCHMITT], organisations: [MERTES] },
  { id: 'pm4', kind: 'email', day: '2026-10-08', time: '16:05', title: 'Re: Peter Mertes – Übergabe GDSN-Daten kJ / kcal (Ticket 14512)', by: ME, to: [NUEBEL, SCHMITT, KAISER, JF], preview: 'Hallo Herr Nübel, ich werde mich dazu mit den Kollegen abstimmen, wie und wann wir das am besten umsetzen können, und informiere Sie, sobald ich dazu mehr weiß.', contacts: [SCHMITT, KAISER], organisations: [MERTES, SCC], attachments: [{ name: 'Anfrage_Naehrwerte.pdf', size: '1,1 MB' }] },
  { id: 'pm5', kind: 'note', day: '2026-09-28', time: '10:15', title: 'Neue Jahrgänge über den GDSN-Connector', by: JF, preview: 'Peter Mertes möchte ab Januar alle neuen Jahrgänge direkt über den GDSN-Connector melden. Ansprechpartnerin bleibt @Beate Schmitt.', contacts: [SCHMITT], organisations: [MERTES] },
  { id: 'pm6', kind: 'email', day: '2026-09-03', time: '14:22', title: 'Re: WG: Validierungsfehler Rebsorte', by: HINRICHS, to: [SCHMITT, JF], preview: 'Hallo Frau Schmitt, in der Tat hat sich die Rebsortenliste wieder ohne erkennbaren Grund geändert. Die Rebsorte, die erst letztes Jahr in die Liste aufgenommen wurde, fehlt erneut.', contacts: [SCHMITT], organisations: [MERTES, SCC], attachments: [{ name: 'Rebsortenliste_2026.csv', size: '34 KB' }] },
  { id: 'pm7', kind: 'email', day: '2026-09-02', time: '17:48', title: 'Re: WG: Validierungsfehler Rebsorte', by: HINRICHS, to: [SCHMITT, JF], preview: 'Sehr geehrte Frau Schmitt, die Fehlermeldung kommt nicht von uns, sondern aus dem GDSN-System. Ich fürchte, dass dort die Liste der akzeptierten Rebsorten angepasst wurde.', contacts: [SCHMITT], organisations: [MERTES, SCC], attachments: [{ name: 'Fehlerprotokoll.txt', size: '8 KB' }] },
  { id: 'pm8', kind: 'email', day: '2026-09-02', time: '11:10', title: 'AW: Validierungsfehler Rebsorte', by: JF, to: [SCHMITT], preview: 'Hallo Frau Schmitt, der GDSN-Datenpool hat wahrscheinlich wieder die Rebsortenliste angepasst. Wir schauen uns das an und beheben es so schnell wie möglich.', contacts: [SCHMITT], organisations: [MERTES] },
  { id: 'pm9', kind: 'email', day: '2026-09-02', time: '09:03', title: 'Validierungsfehler Rebsorte', by: SCHMITT, to: [JF], preview: 'Sehr geehrter Herr Finzer, wir haben einen Validierungsfehler im Euvino-System. Können Sie den Vorgang bitte intern an die zuständige Stelle weitergeben?', contacts: [SCHMITT], organisations: [MERTES] },
  { id: 'pm10', kind: 'activity', day: '2026-09-01', time: '10:00', span: '10:00–11:00', title: 'Termin: Abstimmung GDSN-Themen', by: JF, to: [LENZ, SCHMITT, ME], preview: 'Offene Punkte: Nährwertangaben kJ/kcal, Rebsortenliste, Marketingbotschaft M256.', contacts: [LENZ, SCHMITT], organisations: [MERTES] },
  { id: 'pm11', kind: 'email', day: '2026-08-31', time: '13:37', title: 'Peter Mertes – Umsetzung div. Themen GDSN', by: NUEBEL, to: [JF, ME, SCHMITT, DIEWALD], preview: 'Hallo Herr Finzer, ich habe mit den Kolleginnen von Peter Mertes gesprochen. Wir können mit der Anpassung der folgenden Themen bis zur Rückkehr von Herrn Eul warten.', contacts: [SCHMITT, DIEWALD], organisations: [MERTES, SCC] },
  { id: 'pm12', kind: 'email', day: '2026-08-24', time: '08:55', title: 'Peter Mertes – Übergabe GDSN-Daten kJ / kcal', by: NUEBEL, to: [ME, JF, SCHMITT, KAISER], preview: 'Hallo Herr Eul-Weiß, wir haben in der GDSN-Übergabe noch ein Problem festgestellt. Bei der Übergabe von Nährwertangaben für Kalorien in kJ und kcal erfolgt keine Umrechnung.', contacts: [SCHMITT, KAISER], organisations: [MERTES, SCC] },
  { id: 'pm13', kind: 'file', day: '2026-07-14', time: '12:02', title: 'Produktdatenblatt_Mertes_2027.pdf', by: JF, attachments: [{ name: 'Produktdatenblatt_Mertes_2027.pdf', size: '1,4 MB' }], organisations: [MERTES] },
  { id: 'pm14', kind: 'change', day: '2026-06-02', time: '09:30', title: 'Label geändert: Lead → Prospect', by: JF },
  { id: 'pm15', kind: 'email', day: '2026-03-19', time: '10:24', title: 'Re: AW: Peter Mertes – GDSN-Attribute M256 und M552', by: ME, to: [NUEBEL, SCHMITT], preview: 'Hallo Herr Nübel, hallo Frau Schmitt, das gewünschte GDSN-Feature (Feld M256 Marketingbotschaft des Artikels) können wir mit einem geschätzten Gesamtaufwand von drei Tagen umsetzen.', contacts: [SCHMITT], organisations: [MERTES, SCC], attachments: [{ name: 'Angebot_M256.pdf', size: '640 KB' }] },
  { id: 'pm16', kind: 'email', day: '2026-03-02', time: '08:12', title: 'Publikation funktioniert nicht', by: SCHMITT, to: [JF], preview: 'Hallo Herr Finzer, seit heute Morgen werden unsere Artikel nicht mehr an den Datenpool publiziert. Können Sie bitte prüfen, woran das liegt?', contacts: [SCHMITT], organisations: [MERTES] },
];

const shift = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00`);
  d.setDate(d.getDate() - days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const lastName = (n: string) => n.replace(/,.*$/, '').split(' ').filter(Boolean).pop() ?? n;
const ref = (c: Contact): PersonRef => ({ name: c.name, email: c.email });

/** A believable history for any organisation, built from its own contact records and dates. */
function generate(o: Organisation, people: Contact[]): HistoryEntry[] {
  const refs = people.map(ref);
  const p0 = refs[0] ?? { name: 'Ansprechpartner' };
  const p1 = refs[1] ?? p0;
  const info: PersonRef = { name: `info@${o.website.replace(/^https?:\/\/(www\.)?/, '')}`, email: `info@${o.website.replace(/^https?:\/\/(www\.)?/, '')}` };
  const m = /^(\d{2})\.(\d{2})\.(\d{4}) · (\d{2}:\d{2})$/.exec(o.lastActivity);
  const start = m ? `${m[3]}-${m[2]}-${m[1]}` : '2026-11-04';
  const time = m ? m[4] : '10:24';
  const org = [o.name];
  return [
    { id: `${o.id}-1`, kind: 'email', day: start, time, title: `Re: ${o.name} – Produktdaten Saison 2027`, by: JF, to: [info, ...refs], preview: `Hallo ${lastName(p0.name)}, anbei die aktualisierten Produktdaten für die Saison 2027. Bitte prüfen Sie die Preise und Jahrgänge bis Ende des Monats und geben Sie uns kurz Bescheid, falls etwas fehlt. Neu sind in diesem Jahr die Nährwertangaben pro 100 ml sowie die Allergenkennzeichnung nach LMIV; beides übertragen wir ab Januar automatisch über den GDSN-Connector an Ihre Handelspartner. Die Preisliste enthält bereits die angekündigte Anpassung zum 1. Februar. Wenn Sie Fragen haben, rufen Sie mich gern direkt an. Viele Grüße, Johannes Finzer`, contacts: refs, organisations: org, attachments: [{ name: 'Produktdaten_2027.pdf', size: '4,2 MB' }, { name: 'Preisliste_2027.xlsx', size: '1,1 MB' }] },
    { id: `${o.id}-2`, kind: 'call', day: shift(start, 3), time: '15:40', title: `Anruf mit ${p0.name}`, by: JF, extra: '12 Min.', preview: 'Liefertermine für das erste Quartal besprochen. Muster werden nächste Woche verschickt.', contacts: [p0], organisations: org },
    { id: `${o.id}-3`, kind: 'note', day: shift(start, 6), time: '11:15', title: 'Nachfassen zur Preisliste', by: JF, preview: `Mit @${ME.name} die aktualisierte Preisliste nachgefasst. @${p0.name} schickt die finale Version bis Freitag.`, contacts: [p0], organisations: org },
    { id: `${o.id}-4`, kind: 'email', day: shift(start, 9), time: '09:12', title: 'Frage zur GDSN-Übertragung', by: p0, to: [JF], preview: 'Guten Tag Herr Finzer, bei der letzten Übertragung fehlen bei einigen Artikeln die Allergenangaben. Betroffen sind vor allem die Sekte und die beiden neuen Rotweine aus der Lage Westhofen. Unsere Handelspartner haben die Artikel deshalb noch nicht freigegeben. Können Sie das bitte prüfen und uns sagen, bis wann die Daten korrigiert sind? Vielen Dank und freundliche Grüße', contacts: [p0], organisations: org },
    { id: `${o.id}-5`, kind: 'activity', day: shift(start, 14), time: '10:00', span: '10:00–11:00', title: 'Termin: Jahresgespräch 2027', by: JF, to: refs.slice(0, 3), preview: 'Agenda: Sortiment 2027, Preisanpassungen, Datenqualität.', contacts: refs.slice(0, 3), organisations: org },
    { id: `${o.id}-6`, kind: 'whatsapp', day: shift(start, 18), time: '17:02', title: `WhatsApp mit ${p1.name}`, by: p1, to: [JF], preview: 'Danke, die Muster sind gut angekommen. Wir melden uns nach der Verkostung.', contacts: [p1], organisations: org },
    { id: `${o.id}-7`, kind: 'file', day: shift(start, 25), time: '14:30', title: 'Preisliste_2027.pdf', by: JF, attachments: [{ name: 'Preisliste_2027.pdf', size: '820 KB' }], organisations: org },
    { id: `${o.id}-8`, kind: 'change', day: shift(start, 40), time: '09:00', title: 'Organisation angelegt', by: JF },
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
