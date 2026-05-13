## 1. Scaffold PlayfieldComponent

- [x] 1.1 Generate `PlayfieldComponent` using Angular CLI: `ng generate component playfield` (selector `snk-playfield`, standalone, OnPush, SCSS)
- [x] 1.2 Pre-compute a flat array of 10 000 cell indices in the component class (e.g. `cells = Array.from({ length: 10_000 }, (_, i) => i)`)

## 2. Template — Render the Grid

- [x] 2.1 Add a wrapping `<div class="playfield">` container element to the component template
- [x] 2.2 Use `@for (cell of cells; track cell)` to render 10 000 `<div class="cell">` elements inside the container
- [x] 2.3 Verify the DOM contains exactly 10 000 `.cell` elements when the component is mounted

## 3. Styles — Responsive Square Grid

- [x] 3.1 Style `.playfield` with `display: grid; grid-template-columns: repeat(100, 1fr);`
- [x] 3.2 Set the board size using `width: min(90vw, 90vh, 90vmin)` so it fits within any viewport without overflow
- [x] 3.3 Add `aspect-ratio: 1` to `.playfield` so the container itself stays square
- [x] 3.4 Add `aspect-ratio: 1` to `.cell` to guarantee cells remain square as the grid scales
- [x] 3.5 Add a subtle border or background colour to cells so the grid is visually apparent
- [x] 3.6 Centre the board in the viewport: add host styles (or global styles) to display the app shell as a flex container centred both axes

## 4. Integrate into App Shell

- [x] 4.1 Import `PlayfieldComponent` into `AppComponent`
- [x] 4.2 Replace `AppComponent` template content with `<snk-playfield />`
- [x] 4.3 Remove any default placeholder styles/content from `app.scss` and `styles.scss` that conflict with full-viewport centering

## 5. Routing & Page Component

- [x] 5.1 Generate `GamePage` component at `src/app/pages/game/` (selector `snk-game`, standalone, OnPush, SCSS)
- [x] 5.2 Import `PlayfieldComponent` into `GamePage` and render `<snk-playfield />` in its template
- [x] 5.3 Register `{ path: '', component: Game }` in `app.routes.ts` so `/` shows the game page
- [x] 5.4 Swap `AppComponent` to import `RouterOutlet` and render `<router-outlet />` instead of the playfield directly
- [x] 5.5 Run `ng build` — confirm 0 errors ✅

