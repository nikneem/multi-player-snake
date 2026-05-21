# Copilot Instructions

## Architecture Overview

This is a **multi-player Snake game** composed of:

- **`src/App/`** — Angular 21 frontend (standalone components, signals-based state, SCSS, Vitest). Uses `@microsoft/signalr` to connect to the backend hub.
- **`src/Snake.Api/`** — ASP.NET Core 10 minimal API backend. Real-time multiplayer flows through **SignalR** (`SnakeHub` mapped at `/hubs/snake`); REST endpoints are minimal.
- **`src/Aspire/`** — .NET Aspire orchestration. `AppHost.cs` wires the API as a .NET project and the Angular app via `AddJavaScriptApp(...)` with `WithReference(api)` for service discovery (the frontend reads the backend URL from `services__snake-api__http__0` style env vars).
- **`infra/`** — Bicep (`main.bicep` + `main.bicepparam`) that provisions the Azure Container Apps environment and the two apps.
- **`openspec/`** — Spec-driven change management; active changes in `openspec/changes/<name>/`, archived in `openspec/changes/archive/`, current capability specs in `openspec/specs/`.

The .NET solution file is **`src/snake.slnx`** (the newer XML solution format — not `.sln`). The Angular app lives separately under `src/App/` and is not part of the .NET solution.

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
dotnet run --project src/Aspire/Snake.Aspire.AppHost   # start all services via Aspire (preferred)
dotnet run --project src/Snake.Api                      # run API directly
dotnet build src/snake.slnx                             # build the whole .NET solution
dotnet test                                             # run all .NET tests (none currently exist)
```

Aspire is the entry point for local dev — it boots the API and the Angular dev server together, wires service discovery, and exposes the dashboard. The Angular app picks up the API URL from Aspire-injected env vars at runtime.

## SignalR Conventions

- Real-time game state is exchanged via **SignalR**, not REST. The hub lives in `src/Snake.Api/Hubs/SnakeHub.cs` and is mapped at `/hubs/snake`.
- Message contracts (e.g., `SnakeStateMessage`) live alongside the hub in `src/Snake.Api/Hubs/` and are duplicated as TypeScript models under `src/App/src/app/models/`. Keep these in sync when changing the wire format.
- CORS is configured from `Cors:AllowedOrigins` in `appsettings*.json` and **must** include `AllowCredentials()` for SignalR — do not remove it.

## .NET Conventions

- Target framework: **net10.0**, nullable reference types and implicit usings enabled
- **Minimal API style** in `Program.cs` (no controllers)
- Service defaults wired via `builder.AddServiceDefaults()` / `app.MapDefaultEndpoints()` from the Aspire ServiceDefaults project — always call these in new services
- OpenAPI registered via `builder.Services.AddOpenApi()` and only mapped in Development
- Solution file is **`snake.slnx`** (XML format); use it with `dotnet build`/`dotnet test`

## Infrastructure & Deployment

- Infra is Bicep in `infra/main.bicep` parameterised by `infra/main.bicepparam`. Both ACA apps (`snake-api`, `snake-frontend`) are deployed from this template.
- Deployment runs from `.github/workflows/deploy.yml` on push to `main`: builds & pushes two Docker images (`src/Snake.Api/Dockerfile` and `src/App/Dockerfile`) tagged with the Git SHA, then runs `az deployment group create`.
- **Versioning** is driven by **GitVersion** (`GitVersion.yml`, ContinuousDelivery mode, starting at `1.0.0`). Image tags and release versions are derived from it — do not hand-edit version numbers in csproj/package.json.
- The frontend container reads `API_URL` at startup (see `src/App/docker-entrypoint.sh` + `env.template.js`) — it is injected by the deployment with the backend's ACA FQDN. Locally, the URL comes from Aspire service discovery instead.

## Angular Conventions

The Angular app uses **Angular v21+** conventions (full details in `src/App/.github/copilot-instructions.md` — read it before non-trivial frontend work):

- **Standalone components only** — do NOT add `NgModule`; do NOT set `standalone: true` in decorators (it's the default)
- **Signals for state** — use `signal()`, `computed()`, `input()`, `output()`; never call `mutate()` (use `update()` or `set()`)
- **`ChangeDetectionStrategy.OnPush`** on every component
- **No `ngClass`/`ngStyle`** — use `class` and `style` bindings directly
- **No `@HostBinding`/`@HostListener`** — put host bindings in the `host` object of `@Component`/`@Directive`
- **Native control flow** — use `@if`, `@for`, `@switch`; not `*ngIf`, `*ngFor`, `*ngSwitch`
- **`inject()`** function for dependency injection, not constructor injection
- **SCSS** for styles; component selector prefix is **`snk-`**; use **`NgOptimizedImage`** for static images
- Services use `providedIn: 'root'`; **reactive forms** preferred over template-driven
- Tests use **Vitest** (not Karma/Jasmine) with **jsdom**

## OpenSpec Workflow

Spec-driven changes are managed via the `openspec` CLI from `openspec/`. Custom prompt commands available in this repo:

- `/opsx-propose` — create a new change (proposal + design + tasks)
- `/opsx-apply` — implement tasks from an existing change
- `/opsx-explore` — explore/review an existing change
- `/opsx-archive` — archive a completed change

Each change lives in `openspec/changes/<change-name>/` and contains `proposal.md`, `design.md`, and `tasks.md`. Capability deltas (`specs/<capability>/spec.md` inside the change) merge into the top-level `openspec/specs/` on archive. **Always read the relevant `proposal.md` / `design.md` / `tasks.md` before modifying a feature that has an in-flight change.**

## MCP Servers

`.mcp.json` registers the **Aspire MCP server** (`aspire agent mcp`). When the AppHost is running, use Aspire MCP tools to inspect resources, logs, and traces instead of shelling into containers manually.
