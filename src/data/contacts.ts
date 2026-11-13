// Contact rows copied from the Figma frame "Kontakte — EuvinoPRO" (Pipedrive New, node 21:20587).
export type ContactLabel = 'customer' | 'partner' | 'prospect' | 'hot-lead' | 'lead';

export interface Contact {
  id: string;
  name: string;
  label: ContactLabel;
  organisation: string;
  email: string;
  /** Note shown after the address, such as "Büro". Not part of the link. */
  emailType: string | null;
  /** One or more numbers. */
  phones: string[];
  /** Note shown after the numbers, such as "Büro". Not part of the link. */
  phoneType: string | null;
  wonDeals: number;
  openDeals: number;
  nextActivity: string;
  owner: string;
  /** Profile picture URL. Sample portraits for the prototype. */
  photo?: string;
}

export const TOTAL_CONTACTS = 1430;

export const contacts: Contact[] = [
  {
    "id": "c1",
    "name": "Andrea Poguntke",
    "label": "customer",
    "organisation": "Schlumberger Vertriebsgesellsch",
    "email": "andrea.poguntke@schlumberger.de",
    "emailType": "Büro",
    "phones": [
      "+49 2225925191"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "11.11.2026 · 09:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/10.jpg"
  },
  {
    "id": "c2",
    "name": "Andreas Geil",
    "label": "customer",
    "organisation": "Weingut Helmut Geil",
    "email": "info@weingut-helmut-geil.de",
    "emailType": "Büro",
    "phones": [
      "+496244220"
    ],
    "phoneType": "Büro",
    "wonDeals": 1,
    "openDeals": 0,
    "nextActivity": "12.11.2026 · 10:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/10.jpg"
  },
  {
    "id": "c3",
    "name": "Rudolf Knickenberg",
    "label": "partner",
    "organisation": "Schlumberger Vertriebsgesellsch",
    "email": "rudolf.knickenberg@schlumberger.de",
    "emailType": "Büro",
    "phones": [
      "02225925112"
    ],
    "phoneType": "Büro",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "13.11.2026 · 11:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/13.jpg"
  },
  {
    "id": "c4",
    "name": "Marco Lenz",
    "label": "prospect",
    "organisation": "Peter Mertes KG Weingut - Weink",
    "email": "m.lenz@mertes.de",
    "emailType": "Büro",
    "phones": [
      "+49 6531/55-133",
      "0171-3797"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "14.11.2026 · 12:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/16.jpg"
  },
  {
    "id": "c5",
    "name": "Yvonne Klingberg",
    "label": "hot-lead",
    "organisation": "Weinland Rheingau e. G.",
    "email": "Yvonne.Klingberg@rheingauerwein.de",
    "emailType": "Büro",
    "phones": [
      "+49 (0) 61 23 – 90 88 014"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "15.11.2026 · 13:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/13.jpg"
  },
  {
    "id": "c6",
    "name": "Katrin Flusche",
    "label": "customer",
    "organisation": "Rotkäppchen-Mumm Sektkellerei",
    "email": "Katrin.Flusche@rotkaeppchen-mumm.de",
    "emailType": "Büro",
    "phones": [
      "+496123606527",
      "+49152262"
    ],
    "phoneType": "Büro",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "16.11.2026 · 14:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/16.jpg"
  },
  {
    "id": "c7",
    "name": "Sarah Janson",
    "label": "hot-lead",
    "organisation": "Weingut Schloss Janson",
    "email": "info@schloss-janson.de",
    "emailType": "Büro",
    "phones": [
      "06359/4148"
    ],
    "phoneType": "Büro",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "17.11.2026 · 15:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/19.jpg"
  },
  {
    "id": "c8",
    "name": "Max Augustin",
    "label": "partner",
    "organisation": "Weinladen Schmidt GmbH",
    "email": "max.augustin@weinladen.com",
    "emailType": "Büro",
    "phones": [
      "030200039531"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "18.11.2026 · 16:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/19.jpg"
  },
  {
    "id": "c9",
    "name": "Nikolay, Marco",
    "label": "prospect",
    "organisation": "Rotkäppchen-Mumm Sektkellerei",
    "email": "Marco.Nikolay@rotkaeppchen-mumm.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1009"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "19.11.2026 · 09:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/22.jpg"
  },
  {
    "id": "c10",
    "name": "Alexander Spitzmacher",
    "label": "hot-lead",
    "organisation": "Eggers & Franke Holding GmbH",
    "email": "A.Spitzmacher@egfra.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1010"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "20.11.2026 · 10:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/25.jpg"
  },
  {
    "id": "c11",
    "name": "Fischer Tim",
    "label": "customer",
    "organisation": "Schlumberger Vertriebsgesellsch",
    "email": "tim.fischer@schlumberger.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1011"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "21.11.2026 · 11:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/28.jpg"
  },
  {
    "id": "c12",
    "name": "Schiffmann Ivo",
    "label": "lead",
    "organisation": "Schlumberger Vertriebsgesellsch",
    "email": "ivo.schiffmann@schlumberger.de",
    "emailType": "Büro",
    "phones": [
      "02225 925 138",
      "02225 925 1"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "22.11.2026 · 12:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/31.jpg"
  },
  {
    "id": "c13",
    "name": "Ramin Movahed",
    "label": "partner",
    "organisation": "Wein Wolf GmbH",
    "email": "R.Movahed@swb-weinteam.de",
    "emailType": "Büro",
    "phones": [
      "+49 228 4496-310",
      "4917355"
    ],
    "phoneType": "Büro",
    "wonDeals": 1,
    "openDeals": 0,
    "nextActivity": "23.11.2026 · 13:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/34.jpg"
  },
  {
    "id": "c14",
    "name": "Beate Schmitt",
    "label": "prospect",
    "organisation": "Peter Mertes KG Weingut - Weink",
    "email": "b.schmitt@mertes.de",
    "emailType": "Büro",
    "phones": [
      "+49 6531/55-131"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "24.11.2026 · 14:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/22.jpg"
  },
  {
    "id": "c15",
    "name": "N Diewald",
    "label": "hot-lead",
    "organisation": "Peter Mertes KG Weingut - Weink",
    "email": "n.diewald@mertes.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1015"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "25.11.2026 · 15:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/25.jpg"
  },
  {
    "id": "c16",
    "name": "Christine Kaiser",
    "label": "customer",
    "organisation": "Peter Mertes KG Weingut - Weink",
    "email": "c.kaiser@mertes.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1016"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "26.11.2026 · 16:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/28.jpg"
  },
  {
    "id": "c17",
    "name": "David Prinz",
    "label": "lead",
    "organisation": "Schlumberger Vertriebsgesellsch",
    "email": "Prinz.David@outlook.com",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1017"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "27.11.2026 · 09:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/37.jpg"
  },
  {
    "id": "c18",
    "name": "Anna Röll",
    "label": "partner",
    "organisation": "VINUM Distribution GmbH",
    "email": "anna@vinum-distribution.de",
    "emailType": "Büro",
    "phones": [
      "+39 0471 061627"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "28.11.2026 · 10:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/31.jpg"
  },
  {
    "id": "c19",
    "name": "Erhard Markart",
    "label": "prospect",
    "organisation": "INFOMINDS GmbH",
    "email": "Erhard.Markart@infominds.eu",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1019"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "11.11.2026 · 11:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/40.jpg"
  },
  {
    "id": "c20",
    "name": "Johannes Mulser",
    "label": "hot-lead",
    "organisation": "INFOMINDS GmbH",
    "email": "Johannes.Mulser@infominds.eu",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1020"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "12.11.2026 · 12:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/43.jpg"
  },
  {
    "id": "c21",
    "name": "Claudia Crepaz",
    "label": "customer",
    "organisation": "INFOMINDS GmbH",
    "email": "Claudia.Crepaz@infominds.eu",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1021"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "13.11.2026 · 13:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/34.jpg"
  },
  {
    "id": "c22",
    "name": "Daniel Freund",
    "label": "lead",
    "organisation": "Weinkontor Freund GmbH",
    "email": "Daniel.Freund@weinkontor-freund.de",
    "emailType": "Büro",
    "phones": [
      "0174 2381438"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "14.11.2026 · 14:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/46.jpg"
  },
  {
    "id": "c23",
    "name": "Hans Jürgen Heitz",
    "label": "partner",
    "organisation": "Weinkontor Freund GmbH",
    "email": "Administrator@weinkontor-freund.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1023"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "15.11.2026 · 15:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/49.jpg"
  },
  {
    "id": "c24",
    "name": "Momcilo Vasiljevic",
    "label": "prospect",
    "organisation": "Brogsitter Weingüter • Privat-Sekt",
    "email": "Momcilo.Vasiljevic@brogsitter.de",
    "emailType": "Büro",
    "phones": [
      "02225 / 918 240"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "16.11.2026 · 16:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/52.jpg"
  },
  {
    "id": "c25",
    "name": "Elmar Sermann",
    "label": "hot-lead",
    "organisation": "Brogsitter Weingüter • Privat-Sekt",
    "email": "Elmar.Sermann@brogsitter.de",
    "emailType": "Büro",
    "phones": [
      "02225 / 918 210"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "17.11.2026 · 09:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/55.jpg"
  },
  {
    "id": "c26",
    "name": "Johannes Dismon",
    "label": "customer",
    "organisation": "Brogsitter Weingüter • Privat-Sekt",
    "email": "Johannes.Dismon@brogsitter.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1026"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "18.11.2026 · 10:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/58.jpg"
  },
  {
    "id": "c27",
    "name": "Ole Lau Rasmussen",
    "label": "lead",
    "organisation": "AMKA GmbH",
    "email": "olr@amka-deutschland.de",
    "emailType": "Büro",
    "phones": [
      "+49 151 406 400 82"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "19.11.2026 · 11:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/61.jpg"
  },
  {
    "id": "c28",
    "name": "Christopher Maaß",
    "label": "partner",
    "organisation": "Wein & Vinos GmbH",
    "email": "christopher.maass@weinhandel.example",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1028"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "20.11.2026 · 12:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/64.jpg"
  },
  {
    "id": "c29",
    "name": "Dirk Pampel",
    "label": "prospect",
    "organisation": "Jacques’ Wein-Depot Wein-Einzel",
    "email": "dirk.pampel@weinhandel.example",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1029"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "21.11.2026 · 13:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/67.jpg"
  },
  {
    "id": "c30",
    "name": "Sascha Krinke",
    "label": "hot-lead",
    "organisation": "Jacques’ Wein-Depot Wein-Einzel",
    "email": "sascha.krinke@jacques.de",
    "emailType": "Büro",
    "phones": [
      "+49 211 39 002-14"
    ],
    "phoneType": "Büro",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "22.11.2026 · 14:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/70.jpg"
  },
  {
    "id": "c31",
    "name": "Thierry Fontannaz",
    "label": "customer",
    "organisation": "Jacques’ Wein-Depot Wein-Einzel",
    "email": "Thierry.Fontannaz@jacques.de",
    "emailType": "Büro",
    "phones": [
      "0 211 39 002-19",
      "017274302"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "23.11.2026 · 15:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/73.jpg"
  },
  {
    "id": "c32",
    "name": "Oliver Gloden",
    "label": "lead",
    "organisation": "Schloss Wachenheim AG",
    "email": "ogloden@schloss-wachenheim.de",
    "emailType": "Büro",
    "phones": [
      "+49 30 0000 1032"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "24.11.2026 · 16:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/76.jpg"
  },
  {
    "id": "c33",
    "name": "Stefan Justinger",
    "label": "partner",
    "organisation": "Schloss Wachenheim AG",
    "email": "justinger@schloss-wachenheim.de",
    "emailType": "Büro",
    "phones": [
      "+49 (0) 651 9988-208"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "25.11.2026 · 09:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/79.jpg"
  },
  {
    "id": "c34",
    "name": "Lukas Heyen",
    "label": "prospect",
    "organisation": "Schloss Wachenheim AG",
    "email": "lheyen@schloss-wachenheim.de",
    "emailType": "Büro",
    "phones": [
      "0651/9988-252"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "26.11.2026 · 10:30",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/82.jpg"
  },
  {
    "id": "c35",
    "name": "Monika Geil",
    "label": "customer",
    "organisation": "Weingut Helmut Geil",
    "email": "monika.geil@weingut-helmut-geil.de",
    "emailType": "Büro",
    "phones": [
      "+49 6244 2211"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "01.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/37.jpg"
  },
  {
    "id": "c36",
    "name": "Jonas Brenner",
    "label": "partner",
    "organisation": "Weingut Helmut Geil",
    "email": "jonas.brenner@weingut-helmut-geil.de",
    "emailType": "Büro",
    "phones": [
      "+49 6244 2212"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "02.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/85.jpg"
  },
  {
    "id": "c37",
    "name": "Stefanie Wagner",
    "label": "prospect",
    "organisation": "Weinland Rheingau e. G.",
    "email": "stefanie.wagner@rheingauerwein.de",
    "emailType": "Büro",
    "phones": [
      "+49 6123 908120"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "03.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/40.jpg"
  },
  {
    "id": "c38",
    "name": "Florian Hesse",
    "label": "hot-lead",
    "organisation": "Weinland Rheingau e. G.",
    "email": "florian.hesse@rheingauerwein.de",
    "emailType": "Büro",
    "phones": [
      "+49 6123 908134"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "04.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/88.jpg"
  },
  {
    "id": "c39",
    "name": "Julia Hartmann",
    "label": "lead",
    "organisation": "Rotkäppchen-Mumm Sektkellerei",
    "email": "julia.hartmann@rotkaeppchen-mumm.de",
    "emailType": "Büro",
    "phones": [
      "+49 34464 34120"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "05.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/43.jpg"
  },
  {
    "id": "c40",
    "name": "Peter Janson",
    "label": "customer",
    "organisation": "Weingut Schloss Janson",
    "email": "peter@schloss-janson.de",
    "emailType": "Büro",
    "phones": [
      "+49 6359 41481"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "06.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/91.jpg"
  },
  {
    "id": "c41",
    "name": "Lena Vogt",
    "label": "partner",
    "organisation": "Weingut Schloss Janson",
    "email": "lena.vogt@schloss-janson.de",
    "emailType": "Büro",
    "phones": [
      "+49 6359 41482"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "07.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    "id": "c42",
    "name": "Carsten Schmidt",
    "label": "prospect",
    "organisation": "Weinladen Schmidt GmbH",
    "email": "carsten.schmidt@weinladen.com",
    "emailType": "Büro",
    "phones": [
      "+49 30 20039530"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "08.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/94.jpg"
  },
  {
    "id": "c43",
    "name": "Nadine Krüger",
    "label": "hot-lead",
    "organisation": "Weinladen Schmidt GmbH",
    "email": "nadine.krueger@weinladen.com",
    "emailType": "Büro",
    "phones": [
      "+49 30 20039532"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "09.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/49.jpg"
  },
  {
    "id": "c44",
    "name": "Birgit Lohmann",
    "label": "lead",
    "organisation": "Eggers & Franke Holding GmbH",
    "email": "b.lohmann@egfra.de",
    "emailType": "Büro",
    "phones": [
      "+49 421 3684210"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "10.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/52.jpg"
  },
  {
    "id": "c45",
    "name": "Tobias Meyer",
    "label": "customer",
    "organisation": "Eggers & Franke Holding GmbH",
    "email": "t.meyer@egfra.de",
    "emailType": "Büro",
    "phones": [
      "+49 421 3684225"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "11.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/97.jpg"
  },
  {
    "id": "c46",
    "name": "Sabine Wolf",
    "label": "partner",
    "organisation": "Wein Wolf GmbH",
    "email": "s.wolf@weinwolf.de",
    "emailType": "Büro",
    "phones": [
      "+49 228 449090"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "12.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/55.jpg"
  },
  {
    "id": "c47",
    "name": "Michael Becker",
    "label": "prospect",
    "organisation": "Wein Wolf GmbH",
    "email": "m.becker@weinwolf.de",
    "emailType": "Büro",
    "phones": [
      "+49 228 449091"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "13.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/100.jpg"
  },
  {
    "id": "c48",
    "name": "Martin Keller",
    "label": "hot-lead",
    "organisation": "VINUM Distribution GmbH",
    "email": "martin@vinum-distribution.de",
    "emailType": "Büro",
    "phones": [
      "+49 89 5432101"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "14.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/103.jpg"
  },
  {
    "id": "c49",
    "name": "Laura Seidel",
    "label": "lead",
    "organisation": "VINUM Distribution GmbH",
    "email": "laura@vinum-distribution.de",
    "emailType": "Büro",
    "phones": [
      "+49 89 5432102"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "15.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/58.jpg"
  },
  {
    "id": "c50",
    "name": "Katharina Freund",
    "label": "customer",
    "organisation": "Weinkontor Freund GmbH",
    "email": "Katharina.Freund@weinkontor-freund.de",
    "emailType": "Büro",
    "phones": [
      "+49 4171 78420"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "16.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/61.jpg"
  },
  {
    "id": "c51",
    "name": "Henrik Sørensen",
    "label": "partner",
    "organisation": "AMKA GmbH",
    "email": "hs@amka-deutschland.de",
    "emailType": "Büro",
    "phones": [
      "+49 461 9097710"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "17.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/106.jpg"
  },
  {
    "id": "c52",
    "name": "Melanie Thiel",
    "label": "prospect",
    "organisation": "AMKA GmbH",
    "email": "mt@amka-deutschland.de",
    "emailType": "Büro",
    "phones": [
      "+49 461 9097712"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "18.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/64.jpg"
  },
  {
    "id": "c53",
    "name": "Isabel García",
    "label": "hot-lead",
    "organisation": "Wein & Vinos GmbH",
    "email": "isabel.garcia@weinhandel.example",
    "emailType": "Büro",
    "phones": [
      "+49 30 6121010"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "19.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/women/67.jpg"
  },
  {
    "id": "c54",
    "name": "Sven Albrecht",
    "label": "lead",
    "organisation": "Wein & Vinos GmbH",
    "email": "sven.albrecht@weinhandel.example",
    "emailType": "Büro",
    "phones": [
      "+49 30 6121012"
    ],
    "phoneType": "Büro",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "20.12.2026 · 10:00",
    "owner": "Johannes",
    "photo": "https://randomuser.me/api/portraits/men/109.jpg"
  }
];
