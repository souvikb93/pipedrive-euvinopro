# Pipedrive contacts · EuvinoPRO

The "Kontakte — EuvinoPRO" frame from the Figma file **Pipedrive New** (`I3W13uloSbJdlSmy0rLRIK`, node `21:20587`) built in React with the EuvinoPRO design system (`@euvino/ds`).

- Every element is a DS component: `SideNav`, `Header`, `Breadcrumbs`, `Input`, `IconButton`, `UserMenu`, `Menu`, `SegmentedControl`, `Button`, `Table`, `Badge`, `LinkButton`, `Text`, `Stack`.
- No hard-coded values. The only CSS (`src/app.css`) uses `var(--eu-*)` tokens and CSS keywords.
- Table rows were read from the Figma file with figma-cli (`src/data/contacts.ts`).

## Run

```bash
npm install
npm run dev        # http://localhost:4340
```

## Design system copy

`vendor/euvino-ds` is a copy of `@euvino/ds` so the app builds on its own (Vercel, fresh clones). Do not edit it. Change the design system in `../euvinopro-ds` (repo `souvikb93/winpro-ds`), then:

```bash
npm run sync-ds    # copy ../euvinopro-ds into vendor/ and reinstall
npm run ds:check   # DS lint on src/App.tsx (needs ../euvinopro-ds)
```
