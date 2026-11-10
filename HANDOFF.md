# Handoff

## Goal
Build the Figma frame "Kontakte — EuvinoPRO" (Pipedrive New `I3W13uloSbJdlSmy0rLRIK`, node `21:20587`) in React with the EuvinoPRO design system, no hard-coded values, and deploy it.

## State
- Live: https://pipedrive-euvinopro.vercel.app (Vercel project `pipedrive-euvinopro`, Vercel Authentication protection is on). Repo: `souvikb93/pipedrive-euvinopro` (private). Older repo `souvikb93/pipedrive-euvino` is the remote `old-origin`.
- Local: `npm run dev` on http://localhost:4340.
- Header is 56 (size/header-sm, common SaaS height); side nav is an expandable rail (toggle or `[`, page dimmed and blurred while open) with German labels and a Mehr menu that takes items that do not fit the window height (Projekte, Kampagnen, Einstellungen in Mehr are placeholders); global search panel opens from the header.
- Views via hash route: #/kontakte (default), #/organisationen (org table, Organisation hinzufügen modal), Timeline (looks normal, click does nothing; #/timeline shows Kontakte), #/organisationen/<id> (detail from Figma 1:3486, English copy as in Figma). Tables and the detail page are read-only except labels (LabelPicker).
- Matches the frame: search 400 × 38 at the same position, side nav 72 with 48 tiles, 24 icons, 16 gaps, sticky and not scrollable; rows 38; links in `foreground/link`, "(Büro)" in body colour; Filter button white.

## Files
- `src/App.tsx` screen, `src/app.css` layout (tokens only), `src/data/contacts.ts` rows read from Figma.
- `vendor/euvino-ds` copy of `@euvino/ds`. Never edit; change `../euvinopro-ds` and run `npm run sync-ds`.

## Changed in the design system (`~/euvinopro-ds`, NOT committed: mixed with an earlier session's uncommitted work)
- `figma/hydra.json` + `scripts/build-tokens.mjs`: Hydra tokens with new names, text-style variables. Text styles refreshed from Figma.
- New: `LabelPicker` (labels change in the table, new labels can be added), `GlobalSearch` (panel with categories and highlighted hits, token background/highlight), `SideNav expandable`, `SearchField`, `Input variant="filled"`, `LinkButton variant="link"`, `SideNav logo/sticky/countStatus/theme`, `Header layout="between"`, `UserMenu size` + chevron, `Table` column `overflow` and `fit`, 11 icons, bottle mark.
- Figma (own file `eoPfuJuIddL9imDtGiK2oX` only): added variables `foreground/link/default`, `foreground/link/hover`, `size/field-lg`, `background/highlight`, `blur/backdrop`; Segmented Control segments now Fill equally. Hydra file untouched.

## Failed / gotchas
- The Pipedrive file still uses an older library version, so the frame mixes old names (`bg/page`, `text/body`, `radius/lg` = 8) and Hydra names. Code keeps old names at their old values; colliding Hydra names (radius-lg 40, icon sizes) were not imported.
- Dev server logs a stale 500 while `sync-ds` swaps files; a reload fixes it.

## Next
- Commit the design system changes (decide how to split them from the earlier uncommitted work).
- Full Hydra migration of the code tokens (rename components to the new names, then drop the old ones).
