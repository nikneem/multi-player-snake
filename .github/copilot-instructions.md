# Copilot Instructions

## Architecture Overview

This is a **multi-player Snake game** composed of two sub-projects:

- **`src/App/`** — Angular 21 frontend (standalone components, signals-based state, SCSS, Vitest)
- **`src/Snake.Api/`** — ASP.NET Core 10 minimal API backend
- **`src/Aspire/`** — .NET Aspire orchestration (AppHost + ServiceDefaults)
- **`openspec/`** — Spec-driven change management using the `openspec` CLI

The .NET solution (`src/snake.slnx`) ties together the API and Aspire projects. The Angular app lives separately under `src/App/`.

## Build, Test & Run Commands

### Angular Frontend (`src/App/`)

```bash
npm start          # dev server at http://localhost:4200
npm run build      # production build → dist/
npm test           # run all Vitest unit tests
ng test --include="**/app.spec.ts"   # run a single test file
ng generate component <name>         # scaffold new component (uses snk- prefix)
```

### .NET Backend (`src/`)

```bash
dotnet run --project Aspire/Snake.Aspire.AppHost   # start all services via Aspire
dotnet run --project Snake.Api                      # run API directly
dotnet test                                         # run all .NET tests
```

## Angular Conventions

The Angular app uses **Angular v21+** conventions (see `src/App/.github/copilot-instructions.md` for full details):

- **Standalone components only** — do NOT add `NgModule`; do NOT set `standalone: true` in decorators (it's the default)
- **Signals for state** — use `signal()`, `computed()`, `input()`, `output()`; never use `mutate()` (use `update()` or `set()`)
- **`ChangeDetectionStrategy.OnPush`** on every component
- **No `ngClass`/`ngStyle`** — use `class` and `style` bindings directly
- **No `@HostBinding`/`@HostListener`** — put host bindings in the `host` object of `@Component`/`@Directive`
- **Native control flow** — use `@if`, `@for`, `@switch`; not `*ngIf`, `*ngFor`, `*ngSwitch`
- **`inject()`** function for dependency injection, not constructor injection
- **SCSS** for styles; all components default to `.scss` (configured in `angular.json`)
- Component selector prefix is **`snk-`**
- Use **`NgOptimizedImage`** for static images (not base64 inline images)
- Services use `providedIn: 'root'`
- **Reactive forms** preferred over template-driven

## .NET Conventions

- Target framework: **net10.0**
- Nullable reference types and implicit usings enabled
- Minimal API style in `Program.cs` (no controllers)
- Service defaults wired via `builder.AddServiceDefaults()` / `app.MapDefaultEndpoints()` from the Aspire ServiceDefaults project
- OpenAPI auto-configured via `builder.Services.AddOpenApi()`

## OpenSpec Workflow

Changes are managed through the `openspec` CLI in the `openspec/` directory. Use the built-in prompt commands:

- `/opsx:propose` — create a new change with proposal, design, and tasks artifacts
- `/opsx:apply` — implement tasks from an existing change
- `/opsx:explore` — explore/review an existing change
- `/opsx:archive` — archive a completed change

Changes live in `openspec/changes/<change-name>/` and include `proposal.md`, `design.md`, and `tasks.md`. These artifacts guide implementation — always read them before making changes to a feature that has an associated change.
