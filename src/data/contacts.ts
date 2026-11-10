// Contact rows copied from the Figma frame "Kontakte — EuvinoPRO" (Pipedrive New, node 21:20587).
export type ContactLabel = 'customer' | 'partner' | 'prospect' | 'hot-lead' | 'lead';

export interface Contact {
  id: string;
  name: string;
  label: ContactLabel;
  organisation: string;
  email: string;
  phone: string;
  wonDeals: number;
  openDeals: number;
  nextActivity: string;
  owner: string;
}

export const TOTAL_CONTACTS = 1430;

export const contacts: Contact[] = [
  {
    "id": "c1",
    "name": "Andrea Poguntke",
    "label": "customer",
    "organisation": "Schlumberger Vertriebsgesellsch…",
    "email": "andrea.poguntke@schlumberger.de (Büro)",
    "phone": "+49 2225925191 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "11.11.2026 · 09:00",
    "owner": "Johannes"
  },
  {
    "id": "c2",
    "name": "Andreas Geil",
    "label": "customer",
    "organisation": "Weingut Helmut Geil",
    "email": "info@weingut-helmut-geil.de (Büro)",
    "phone": "+496244220 (Büro)",
    "wonDeals": 1,
    "openDeals": 0,
    "nextActivity": "12.11.2026 · 10:30",
    "owner": "Johannes"
  },
  {
    "id": "c3",
    "name": "Rudolf Knickenberg",
    "label": "partner",
    "organisation": "Schlumberger Vertriebsgesellsch…",
    "email": "rudolf.knickenberg@schlumberger.de (Büro)",
    "phone": "02225925112 (Büro)",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "13.11.2026 · 11:00",
    "owner": "Johannes"
  },
  {
    "id": "c4",
    "name": "Marco Lenz",
    "label": "prospect",
    "organisation": "Peter Mertes KG Weingut - Weink…",
    "email": "m.lenz@mertes.de (Büro)",
    "phone": "+49 6531/55-133  0171-3797 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "14.11.2026 · 12:30",
    "owner": "Johannes"
  },
  {
    "id": "c5",
    "name": "Yvonne Klingberg",
    "label": "hot-lead",
    "organisation": "Weinland Rheingau e. G.",
    "email": "Yvonne.Klingberg@rheingauerwein.de (Büro)",
    "phone": "+49 (0) 61 23 – 90 88 014 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "15.11.2026 · 13:00",
    "owner": "Johannes"
  },
  {
    "id": "c6",
    "name": "Katrin Flusche",
    "label": "customer",
    "organisation": "Rotkäppchen-Mumm Sektkellerei…",
    "email": "Katrin.Flusche@rotkaeppchen-mumm.de (Büro)",
    "phone": "+496123606527  +49152262 (Büro)",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "16.11.2026 · 14:30",
    "owner": "Johannes"
  },
  {
    "id": "c7",
    "name": "Sarah Janson",
    "label": "hot-lead",
    "organisation": "Weingut Schloss Janson",
    "email": "info@schloss-janson.de (Büro)",
    "phone": "06359/4148 (Büro)",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "17.11.2026 · 15:00",
    "owner": "Johannes"
  },
  {
    "id": "c8",
    "name": "Max Augustin",
    "label": "partner",
    "organisation": "Weinladen Schmidt GmbH",
    "email": "max.augustin@weinladen.com (Büro)",
    "phone": "030200039531 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "18.11.2026 · 16:30",
    "owner": "Johannes"
  },
  {
    "id": "c9",
    "name": "Nikolay, Marco",
    "label": "prospect",
    "organisation": "Rotkäppchen-Mumm Sektkellerei…",
    "email": "Marco.Nikolay@rotkaeppchen-mumm.de (Büro)",
    "phone": "+49 30 0000 1009 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "19.11.2026 · 09:00",
    "owner": "Johannes"
  },
  {
    "id": "c10",
    "name": "Alexander Spitzmacher",
    "label": "hot-lead",
    "organisation": "Eggers & Franke Holding GmbH",
    "email": "A.Spitzmacher@egfra.de (Büro)",
    "phone": "+49 30 0000 1010 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "20.11.2026 · 10:30",
    "owner": "Johannes"
  },
  {
    "id": "c11",
    "name": "Fischer Tim",
    "label": "customer",
    "organisation": "Schlumberger Vertriebsgesellsch…",
    "email": "tim.fischer@schlumberger.de (Büro)",
    "phone": "+49 30 0000 1011 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "21.11.2026 · 11:00",
    "owner": "Johannes"
  },
  {
    "id": "c12",
    "name": "Schiffmann Ivo",
    "label": "lead",
    "organisation": "Schlumberger Vertriebsgesellsch…",
    "email": "ivo.schiffmann@schlumberger.de (Büro)",
    "phone": "02225 925 138  02225 925 1 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "22.11.2026 · 12:30",
    "owner": "Johannes"
  },
  {
    "id": "c13",
    "name": "Ramin Movahed",
    "label": "partner",
    "organisation": "Wein Wolf GmbH",
    "email": "R.Movahed@swb-weinteam.de (Büro)",
    "phone": "+49 228 4496-310  4917355 (Büro)",
    "wonDeals": 1,
    "openDeals": 0,
    "nextActivity": "23.11.2026 · 13:00",
    "owner": "Johannes"
  },
  {
    "id": "c14",
    "name": "Beate Schmitt",
    "label": "prospect",
    "organisation": "Peter Mertes KG Weingut - Weink…",
    "email": "b.schmitt@mertes.de (Büro)",
    "phone": "+49 6531/55-131 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "24.11.2026 · 14:30",
    "owner": "Johannes"
  },
  {
    "id": "c15",
    "name": "N Diewald",
    "label": "hot-lead",
    "organisation": "Peter Mertes KG Weingut - Weink…",
    "email": "n.diewald@mertes.de (Büro)",
    "phone": "+49 30 0000 1015 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "25.11.2026 · 15:00",
    "owner": "Johannes"
  },
  {
    "id": "c16",
    "name": "Christine Kaiser",
    "label": "customer",
    "organisation": "Peter Mertes KG Weingut - Weink…",
    "email": "c.kaiser@mertes.de (Büro)",
    "phone": "+49 30 0000 1016 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "26.11.2026 · 16:30",
    "owner": "Johannes"
  },
  {
    "id": "c17",
    "name": "David Prinz",
    "label": "lead",
    "organisation": "Schlumberger Vertriebsgesellsch…",
    "email": "Prinz.David@outlook.com (Büro)",
    "phone": "+49 30 0000 1017 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "27.11.2026 · 09:00",
    "owner": "Johannes"
  },
  {
    "id": "c18",
    "name": "Anna Röll",
    "label": "partner",
    "organisation": "VINUM Distribution GmbH",
    "email": "anna@vinum-distribution.de (Büro)",
    "phone": "+39 0471 061627 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "28.11.2026 · 10:30",
    "owner": "Johannes"
  },
  {
    "id": "c19",
    "name": "Erhard Markart",
    "label": "prospect",
    "organisation": "INFOMINDS GmbH",
    "email": "Erhard.Markart@infominds.eu (Büro)",
    "phone": "+49 30 0000 1019 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "11.11.2026 · 11:00",
    "owner": "Johannes"
  },
  {
    "id": "c20",
    "name": "Johannes Mulser",
    "label": "hot-lead",
    "organisation": "INFOMINDS GmbH",
    "email": "Johannes.Mulser@infominds.eu (Büro)",
    "phone": "+49 30 0000 1020 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "12.11.2026 · 12:30",
    "owner": "Johannes"
  },
  {
    "id": "c21",
    "name": "Claudia Crepaz",
    "label": "customer",
    "organisation": "INFOMINDS GmbH",
    "email": "Claudia.Crepaz@infominds.eu (Büro)",
    "phone": "+49 30 0000 1021 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "13.11.2026 · 13:00",
    "owner": "Johannes"
  },
  {
    "id": "c22",
    "name": "Daniel Freund",
    "label": "lead",
    "organisation": "Weinkontor Freund GmbH",
    "email": "Daniel.Freund@weinkontor-freund.de (Büro)",
    "phone": "0174 2381438 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "14.11.2026 · 14:30",
    "owner": "Johannes"
  },
  {
    "id": "c23",
    "name": "Hans Jürgen Heitz",
    "label": "partner",
    "organisation": "Weinkontor Freund GmbH",
    "email": "Administrator@weinkontor-freund.de (Büro)",
    "phone": "+49 30 0000 1023 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "15.11.2026 · 15:00",
    "owner": "Johannes"
  },
  {
    "id": "c24",
    "name": "Momcilo Vasiljevic",
    "label": "prospect",
    "organisation": "Brogsitter Weingüter • Privat-Sekt…",
    "email": "Momcilo.Vasiljevic@brogsitter.de (Büro)",
    "phone": "02225 / 918 240 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "16.11.2026 · 16:30",
    "owner": "Johannes"
  },
  {
    "id": "c25",
    "name": "Elmar Sermann",
    "label": "hot-lead",
    "organisation": "Brogsitter Weingüter • Privat-Sekt…",
    "email": "Elmar.Sermann@brogsitter.de (Büro)",
    "phone": "02225 / 918 210 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "17.11.2026 · 09:00",
    "owner": "Johannes"
  },
  {
    "id": "c26",
    "name": "Johannes Dismon",
    "label": "customer",
    "organisation": "Brogsitter Weingüter • Privat-Sekt…",
    "email": "Johannes.Dismon@brogsitter.de (Büro)",
    "phone": "+49 30 0000 1026 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "18.11.2026 · 10:30",
    "owner": "Johannes"
  },
  {
    "id": "c27",
    "name": "Ole Lau Rasmussen",
    "label": "lead",
    "organisation": "AMKA GmbH",
    "email": "olr@amka-deutschland.de (Büro)",
    "phone": "+49 151 406 400 82 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "19.11.2026 · 11:00",
    "owner": "Johannes"
  },
  {
    "id": "c28",
    "name": "Christopher Maaß",
    "label": "partner",
    "organisation": "Wein & Vinos GmbH",
    "email": "christopher.maass@weinhandel.example (Büro)",
    "phone": "+49 30 0000 1028 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "20.11.2026 · 12:30",
    "owner": "Johannes"
  },
  {
    "id": "c29",
    "name": "Dirk Pampel",
    "label": "prospect",
    "organisation": "Jacques’ Wein-Depot Wein-Einzel…",
    "email": "dirk.pampel@weinhandel.example (Büro)",
    "phone": "+49 30 0000 1029 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "21.11.2026 · 13:00",
    "owner": "Johannes"
  },
  {
    "id": "c30",
    "name": "Sascha Krinke",
    "label": "hot-lead",
    "organisation": "Jacques’ Wein-Depot Wein-Einzel…",
    "email": "sascha.krinke@jacques.de (Büro)",
    "phone": "+49 211 39 002-14 (Büro)",
    "wonDeals": 2,
    "openDeals": 0,
    "nextActivity": "22.11.2026 · 14:30",
    "owner": "Johannes"
  },
  {
    "id": "c31",
    "name": "Thierry Fontannaz",
    "label": "customer",
    "organisation": "Jacques’ Wein-Depot Wein-Einzel…",
    "email": "Thierry.Fontannaz@jacques.de (Büro)",
    "phone": "0 211 39 002-19  017274302 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "23.11.2026 · 15:00",
    "owner": "Johannes"
  },
  {
    "id": "c32",
    "name": "Oliver Gloden",
    "label": "lead",
    "organisation": "Schloss Wachenheim AG",
    "email": "ogloden@schloss-wachenheim.de (Büro)",
    "phone": "+49 30 0000 1032 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "24.11.2026 · 16:30",
    "owner": "Johannes"
  },
  {
    "id": "c33",
    "name": "Stefan Justinger",
    "label": "partner",
    "organisation": "Schloss Wachenheim AG",
    "email": "justinger@schloss-wachenheim.de (Büro)",
    "phone": "+49 (0) 651 9988-208 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "25.11.2026 · 09:00",
    "owner": "Johannes"
  },
  {
    "id": "c34",
    "name": "Lukas Heyen",
    "label": "prospect",
    "organisation": "Schloss Wachenheim AG",
    "email": "lheyen@schloss-wachenheim.de (Büro)",
    "phone": "0651/9988-252 (Büro)",
    "wonDeals": 0,
    "openDeals": 0,
    "nextActivity": "26.11.2026 · 10:30",
    "owner": "Johannes"
  }
];
