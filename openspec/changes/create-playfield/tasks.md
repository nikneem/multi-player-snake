## 1. Scaffold PlayfieldComponent

- [ ] 1.1 Generate `PlayfieldComponent` using Angular CLI: `ng generate component playfield` (selector `snk-playfield`, standalone, OnPush, SCSS)
- [ ] 1.2 Pre-compute a flat array of 10 000 cell indices in the component class (e.g. `cells = Array.from({ length: 10_000 }, (_, i) => i)`)

## 2. Template — Render the Grid

- [ ] 2.1 Add a wrapping `<div class="playfield">` container element to the component template
- [ ] 2.2 Use `@for (cell of cells; track cell)` to render 10 000 `<div class="cell">` elements inside the container
- [ ] 2.3 Verify the DOM contains exactly 10 000 `.cell` elements when the component is mounted

## 3. Styles — Responsive Square Grid

- [ ] 3.1 Style `.playfield` with `display: grid; grid-template-columns: repeat(100, 1fr);`
- [ ] 3.2 Set the board size using `width: min(90vw, 90vh, 90vmin)` so it fits within any viewport without overflow
- [ ] 3.3 Add `aspect-ratio: 1` to `.playfield` so the container itself stays square
- [ ] 3.4 Add `aspect-ratio: 1` to `.cell` to guarantee cells remain square as the grid scales
- [ ] 3.5 Add a subtle border or background colour to cells so the grid is visually apparent
- [ ] 3.6 Centre the board in the viewport: add host styles (or global styles) to display the app shell as a flex container centred both axes

## 4. Integrate into App Shell

- [ ] 4.1 Import `PlayfieldComponent` into `AppComponent`
- [ ] 4.2 Replace `AppComponent` template content with `<snk-playfield />`
- [ ] 4.3 Remove any default placeholder styles/content from `app.scss` and `styles.scss` that conflict with full-viewport centering

## 5. Manual Verification

- [ ] 5.1 Run `npm start` and confirm the grid renders at `http://localhost:4200`
- [ ] 5.2 Use browser DevTools to resize to 320 px width — confirm no horizontal scrollbar and board is fully visible
- [ ] 5.3 Resize to a large desktop resolution — confirm the board is large and centred
- [ ] 5.4 Confirm cells are visually square at multiple viewport sizes using the DevTools element inspector
