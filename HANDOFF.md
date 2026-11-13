# Handoff

## Goal
Pipedrive "Kontakte — EuvinoPRO" in React on the EuvinoPRO design system (`@euvino/ds`), aligned with the Figma library (`eoPfuJuIddL9imDtGiK2oX`). Tokens only, German copy. Shows the client an enterprise design system, product and codebase built with an AI-native workflow.

Working rules: show changes on localhost first; Figma only after approval; archive, never delete, in Figma; the user decides when to deploy (a push to `main` deploys to Vercel).

## State
- Live: https://pipedrive-euvinopro.vercel.app (deployed from this commit).
- Local: `npm run dev` → http://localhost:4340, e.g. `#/organisationen/schlumberger`.
- Design system repo `~/euvinopro-ds` (souvikb93/winpro-ds) and this app are committed and pushed together.
- Figma library has a saved version "Scheduling components".

Organisation detail page:
- Header: PageHeader with icon tile, name, label (LabelPicker small) and city.
- Side card: Fokus (ActivityCard, always a Termin) → opens the reschedule modal; Organisationsdetails; Zugehörige Organisationen; Kontakte (call/mail icon buttons); Überblick (BreakdownBar); Leads.
- Composer: only Notizen (Editor) and Aktivität (inline planner) are selectable; the other tabs hover only.
- Verlauf: Timeline without scroll progress colouring.

Scheduling (one data model, `src/data/availability.ts`, state in `src/views/scheduling/useScheduling.ts`):
- Modal (Fokus card): StatusSummary (read-only time, Konflikt badge), Teilnehmer (PersonChip), AvailabilityTimeline. Opens on the scheduled time (Schlumberger demo: 09:00 conflict); free time for everyone is green; click a free slot to move; "Aktualisieren" blocks saving a clash.
- Inline planner (Aktivität tab): Titel, Datum/Beginn/Ende/Dauer fields, same timeline; "Einladung senden".
- Legend is fixed: Für alle frei · Belegt · Vorläufig, in both.

## Files
- App: `src/views/OrganisationDetail.tsx`, `src/views/ActivityModal.tsx`, `src/views/PlanActivity.tsx`, `src/views/scheduling/ScheduleBody.tsx`, `src/views/scheduling/useScheduling.ts`, `src/data/availability.ts`, `src/data/history.ts`, `src/app.css` (layout only).
- DS: `src/ds/scheduling.tsx` (AvailabilityTimeline, ActivityCard, DateNav, StatusSummary), `src/ds/editor.tsx`, `src/ds/button.tsx` (PersonChip, SegmentedControl size, Chip), `src/ds/display.tsx` (Avatar tone), `src/ds/navigation.tsx` (PageHeader meta), `src/ds/layout.tsx` (Text `caption-medium`), `src/styles/components.css`, `scripts/meta.json`, `scripts/build-catalog.mjs` (now includes editor and scheduling).
- Figma scripts (session scratchpad, may be gone): helper `lib.js` binds every fill, stroke, size and spacing to variables and text styles; runner `node ~/tools/euvino-ds/build/run-in.mjs "EuvinoPRO Design System" script.js out.json`.

## Changed (this session)
- New DS components: AvailabilityTimeline, ActivityCard, DateNav, StatusSummary, PersonChip, Editor; SegmentedControl `size="small"`; Avatar `tone` (light default, solid); Text `caption-medium`; PageHeader meta row and icon tile.
- App moved onto them; app CSS has no DS overrides and no raw values; `ds check` passes for every file.
- Figma: new sections Availability Timeline, Breakdown Bar (Charts); Status Summary, Activity Card (Cards); Date Nav, Page Header (Navigation); Editor (Forms); Person Chip (Data Display). Segmented Control got Size=Small (existing variants renamed with Size=Medium). Avatar got Type=Letter Light. Icon `organisation` copied from Archive into the icon library (archive copy kept).

## Failed / gotchas
- Figma `loadFontAsync` hangs when given a style's fontName with `variationSettings`; load `{ family, style }` only.
- `combineAsVariants` needs the components on the same page as the parent; append first.
- Variant sets built with auto layout keep a fixed height after `resize`; set `primaryAxisSizingMode = 'AUTO'` afterwards.
- `ds check` reads "from" in comments as an import; avoid `from "…"` in comments.
- Run `npm run catalog` and `npm run llms` after DS API changes, or `npm run check` fails.

## Next
- Publish the Figma library by hand.
- Figma timeline tentative stripes are drawn shapes (variables cannot pattern); code uses a token gradient.
- Planner/modal time data is demo data; a real calendar source is not connected.
- PersonChip default fill (background/functional/neutral) is light on white; revisit if it needs more contrast.
