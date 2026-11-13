# Handoff

## Goal

Pipedrive "Kontakte — EuvinoPRO" in React on the EuvinoPRO design system (`@euvino/ds`), aligned with the Figma library (`eoPfuJuIddL9imDtGiK2oX`). Tokens only, German copy. Shows the client an enterprise design system, product and codebase built with an AI-native workflow (see README).

Working rules: show changes on localhost first; Figma only after approval; archive, never delete, in Figma; the user decides when to deploy (a push to `main` deploys to Vercel).

## State

- Live: https://pipedrive-euvinopro.vercel.app, deployed from `main`. Local: `npm run dev` → http://localhost:4340.
- DS repo `~/euvinopro-ds` (souvikb93/winpro-ds) and this app are committed and pushed together; `vendor/euvino-ds` is in sync.
- Quality gate: `npm run check` (strict tsc incl. no unused code → `ds:check` on every source file → vitest → build). The DS has `npm run check` with 34 tests. An axe-core scan shows 0 violations on the lists, the organisation page, the drawer and the planner, and a fresh tab logs no console errors.
- Figma: versions saved up to "Activity Card names, Status Summary duration". **The library still needs publishing by hand.**

Organisation page:

- Header: PageHeader with icon tile, label and city. Breadcrumb current page is regular weight in a darker colour (DS + Figma).
- Side card: Fokus (ActivityCard; names via PeopleList), Organisationsdetails, Kontakte (call/mail open tel:/mailto:), Überblick, Leads. Sticky only while beside the main column.
- Composer: Notizen (Editor with B/I/U toggle states) and Aktivität (planner). The other tabs show hover only.
- Verlauf: `src/views/timeline/` on DS ActivityItem + PeopleList + FileChipList + InlineList. Filters show only categories with entries; Alle, Notizen, Aktivitäten, E-Mails and Dateien always show. Card click and "Details anzeigen" open a Drawer. Notes can be edited and deleted (with confirmation).
- People rule (`src/views/shared/people.tsx`): other people are blue links to `#/kontakte/<id>`, your own name is plain, and team members show the "coming later" message. "+N" lists exactly the hidden people.
- Lists: Kontaktperson column uses the same people rule; header "Organisation"; activity dates use InlineList.

Scheduling: one data model (`src/data/availability.ts`), state in `src/views/scheduling/useScheduling.ts`, and typed input parsing in `src/lib/time.ts`. Planner fields are four equal columns.

## Files

- App: `src/App.tsx` (shell, lists, routing), `src/views/list/` (toolbar, menus, labels, sorts), `src/views/shared/people.tsx`, `src/views/timeline/`, `src/views/scheduling/`, `src/data/` (incl. `search.ts`), `src/lib/`, `tests/`, `scripts/ds-check.mjs`.
- DS (new this round): `src/ds/people-list.tsx`, `file-chip.tsx`, `inline-list.tsx`; ActivityItem rhythm/marker/meta/lines in `display.tsx`; Editor toggles in `editor.tsx`; Combobox + typeable DatePicker in `form.tsx`; UserMenu name fix in `navigation.tsx`. `AGENTS.md`/`CLAUDE.md` component table updated.
- Figma scripts (session scratchpad, may be gone): `lib.js` binds fills, strokes, sizes and spacing to variables and text styles; run with `node ~/tools/euvino-ds/build/run-in.mjs "EuvinoPRO Design System" script.js out.json`.

## Changed (this round)

- DS + Figma: People List, File Chip, Inline List (thin line separator, 8px either side; replaces every dot separator), Editor Tool states, Combobox, typeable Date Picker, rebuilt Activity Item (H6 subject, 4/12/16 rhythm, marker on the subject row, 2-line preview, File Chip footer, Button Select reply), Breadcrumb current page.
- Code quality: every source file is DS-checked (not only App.tsx), strict unused checks are on, App.tsx is split into modules, there are no dead `noop` controls, and tests plus the README were added.
- Accessibility fixes: table icon header named, UserMenu name matches the visible text, links in running text underlined, no `<div>` inside `<p>`.

## Failed / gotchas

- Figma: `loadFontAsync` hangs with `variationSettings` (load `{ family, style }`). `combineAsVariants` needs nodes on the same page. Auto-layout sets need `primaryAxisSizingMode = 'AUTO'` after resize. `getNodeByIdAsync` on instance-sublayer ids ("I…;…") can hang, so find nodes with `findOne` instead. Auto-width text trims trailing spaces, so use one text node with range fills.
- `ds check` reads "from" in comments as an import, and "20px" in comments as a raw value.
- Run `npm run catalog` and `npm run llms` after DS API changes; the catalog does not delete stale `docs/components/*.md` files.
- An open popover inside an ActivityItem needs the higher-specificity lift rule (fixed in DS CSS).

## Quality round (13 Nov, not pushed yet)

- Code ↔ Figma parity audit: every component measured in both; differences fixed on the side that was wrong (see DS CHANGELOG). Dropdown options and input heights follow production, per the user.
- Tooling in both repos: ESLint (strict TS, hooks, jsx-a11y; reasons required), Prettier, EditorConfig, CI workflow (`npm run check`). DS: 22 Storybook stories added (87), token generator fixed.
- App: dead links and no-op menu items removed, people rule (contact link / team toast / otherwise plain), ErrorBoundary, per-route titles, favicon, stable list keys, no horizontal scroll at 375px, axe 0 violations.
- Checklist: `docs/quality-checklist.md`.

## Next

- Push both repos when the user says (push to main deploys).
- Decide on contact photos: they load from randomuser.me (third-party). Option: download into `public/` or use initials.

- Publish the Figma library by hand.
- Build the Figma screens of this app (the user will say when).
- Gaps (demo): Reply/Weiterleiten, Mit Element verbinden, profiles, row Bearbeiten/Löschen show "coming later"; downloads are placeholder files; calendars are demo data; no call recordings.
- Figma timeline tentative stripes are drawn shapes (variables cannot do patterns).
