# Kontakte · EuvinoPRO

A Pipedrive-style CRM screen for EuvinoPRO: contact and organisation lists, an organisation page with a focus card, an activity timeline, notes and a meeting planner with team availability.
It is built entirely on the EuvinoPRO design system, which is maintained in code and in Figma side by side.

- **Live:** https://pipedrive-euvinopro.vercel.app
- **Design system (code):** [souvikb93/winpro-ds](https://github.com/souvikb93/winpro-ds)
- **Design system (Figma):** *EuvinoPRO Design System* library (`eoPfuJuIddL9imDtGiK2oX`)
- **Screen designs (Figma):** *Pipedrive New* (`I3W13uloSbJdlSmy0rLRIK`)

## How it was built

The product was built with an AI-native workflow: an AI agent writes the code, and the design system decides what it may write.

1. **Design system first.** Tokens are exported from Figma variables into `tokens.css`, and each component has a Figma counterpart with the same name, props and states.
2. **Rules the agent cannot skip.** The design system ships `AGENTS.md`, a component catalogue and a checker. App code uses only `@euvino/ds` components, `Stack`/`Text` for layout and type, and `var(--eu-*)` tokens. Raw colours, pixel values, hand-styled `<button>`/`<input>` and other UI packages are rejected.
3. **New needs become components.** When a screen needs something the system lacks, it is added to the design system and to Figma first, then used in the app. Examples: `PeopleList`, `FileChip`, `Combobox` and `AvailabilityTimeline`.
4. **Every change is checked.** Typecheck, design-system lint, tests and an accessibility scan run before a deploy.

## Quality gates

```bash
npm run check   # typecheck (strict, no unused code) → ds:check on every file → tests → production build
```

| Gate | What it guarantees |
|---|---|
| `tsc` (strict, `noUnusedLocals`) | Types are sound and no dead code is left behind |
| `ds:check` | Every source file uses design-system components and tokens only: no raw hex, px or rem, and no hand-made controls |
| `vitest` | Data rules, such as exact "+N" counts, typed times, free slots and search, plus card behaviour: links, reply, details and mentions |
| axe-core (manual run) | Zero violations on the lists, the organisation page, the drawer and the planner |

Accessibility: every control has an accessible name, toggles use `aria-pressed`, and "+N" lists open on hover, click or keyboard. Links inside running text are underlined, so colour is never the only cue. Destructive actions ask for confirmation first.

## Structure

```
src/
  App.tsx                 shell: side nav, header, search, list views, routing
  route.ts                hash routes (#/kontakte, #/organisationen/<id>)
  data/                   demo data and pure logic (history, availability, search)
  lib/                    small helpers (format, time parsing)
  views/
    OrganisationDetail.tsx  organisation page
    list/                 toolbar, filter, sort, labels and row actions shared by both lists
    shared/people.tsx     one rule for people: blue links, own name plain, exact "+N"
    timeline/             Verlauf card, detail drawer, downloads
    scheduling/           planner and reschedule modal (one data model, one hook)
  app.css                 page layout only, with tokens
tests/                    vitest + Testing Library
vendor/euvino-ds/         copy of the design system (do not edit)
```

## Run

```bash
npm install
npm run dev     # http://localhost:4340
npm test
```

## Design system copy

`vendor/euvino-ds` is a copy of `@euvino/ds`, so the app builds on its own (Vercel, fresh clones). Do not edit it. Change the design system in `../euvinopro-ds`, then:

```bash
npm run sync-ds    # copy ../euvinopro-ds into vendor/ and reinstall
npm run ds:check   # design-system lint on every source file (needs ../euvinopro-ds next to this repo)
```

## Demo data

Contacts and organisations come from the Figma frame. History, calendars and attachments are generated demo data: downloads save a placeholder file, and replying, linking items and user profiles show a "coming later" message.
