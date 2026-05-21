## Context

The repo already contains the SignalR plumbing for a multiplayer snake game:

- **Backend** (`src/Snake.Api/`): `SnakeHub` with a `PublishState` method that re-broadcasts the message to `Clients.Others`, stamping the server-known `ConnectionId`. A `PlayerLeft` event fires on disconnect.
- **Frontend** (`src/App/src/app/`):
  - `RealtimeService` connects via `@microsoft/signalr`, subscribes to `SnakeState` and `PlayerLeft`, and exposes a `remoteSnakes` signal keyed by `connectionId`.
  - `Snake` service ticks every 150 ms, calls `realtimeService.publishState(...)` after every move.
  - `Playfield` component overlays remote segments with a single `remote-snake` CSS class.

What is missing for a true multiplayer experience:

1. The local snake cannot collide with remote snake bodies — they are visual ghosts only.
2. All remote players use the same red colour and cannot be told apart.
3. After a respawn, the player keeps broadcasting from the dead position frame; other clients briefly see a stale snake.

This change closes those gaps without restructuring the existing services or hub contract.

## Goals / Non-Goals

**Goals:**

- A head-into-remote-body collision triggers the local death sequence using the same code path as wall/self collisions.
- After the existing 600 ms respawn delay, the local snake reappears at its initial position and immediately broadcasts so peers stop rendering the dead snake.
- The local snake is always rendered green; each remote snake is rendered in a deterministic shade of red derived from its `connectionId`, so two simultaneously-connected players never look identical.
- The hub continues to be the source of truth for `ConnectionId`; clients SHALL NOT trust client-supplied ids.
- Single-player experience remains unchanged when the hub is unreachable (`RealtimeService` already logs and falls back silently).

**Non-Goals:**

- No server-side authoritative game state, lobby, matchmaking, scoreboard, or persistence.
- No server-side collision arbitration (each client is authoritative for its own death — sufficient for friendly play).
- No interpolation/lag compensation; remote snakes render from the latest received state only.
- No reconnect-resume of the previous identity (a reconnect produces a new `connectionId`).
- No food synchronisation between players; each client keeps its own food (a deliberate scope limit — sync of food would require server-authoritative state).

## Decisions

### Decision 1: Client-authoritative death

**Choice:** Each client decides locally when it has crashed into a remote snake, using the latest received `remoteSnakes` snapshot.

**Rationale:** The hub is intentionally a thin relay. Server arbitration would require a tick loop and a server-side world model, which is out of scope. Latency between honest players is low (LAN / regional Azure SignalR) and the cost of an occasional disagreement is just a respawn — there is no score on the line.

**Alternatives considered:**

- *Server-authoritative collision*: rejected — would balloon the change far beyond the user's request.
- *Lock-step simulation*: rejected — over-engineered for a casual game.

### Decision 2: Collision check uses all remote segments (head + body)

**Choice:** On every tick, build a `Set<number>` of all flat indices occupied by any remote snake segment and test `newHead` against it, in the same place where self-collision is checked.

**Rationale:** Treats remote snakes symmetrically with the local body. Includes remote heads so head-on collisions kill at least one player (typically both, since each runs the same check independently). Using a flat index set keeps the check O(1) per tick, matching the existing self-collision pattern.

**Alternatives considered:**

- *Only test against remote bodies, ignoring remote heads*: rejected — head-on crashes feeling like ghosting is worse than the current "both die" outcome.

### Decision 3: Republish state on respawn

**Choice:** Immediately after `resetGame()` restores the initial segments, publish a state message so peers update before the next 150 ms tick.

**Rationale:** Without this, other clients keep rendering the snake at the pre-death position for up to 150 ms, which can cause spurious collisions on their end. Publishing once on respawn keeps the visual state consistent.

**Alternatives considered:**

- *Send an explicit "Died" event*: rejected — adds a new hub method and message contract for marginal benefit; a fresh state message conveys the same information.

### Decision 4: Deterministic red shade per remote player

**Choice:** Compute an HSL colour from a stable hash of `connectionId`: hue fixed in the red band (0°–20°), saturation 70–90%, lightness 35–60%. The shade is computed in `RealtimeService` (or a tiny pure helper) and exposed alongside the snake state.

**Rationale:** Deterministic from the id means no coordination is needed, and a player's colour is stable for the lifetime of their connection. Constraining hue to the red band satisfies the "shades of red" requirement; varying saturation and lightness gives enough perceptual distance for ~10+ simultaneous players.

**Alternatives considered:**

- *Sequential palette of 8 hand-picked reds*: rejected — would require coordinated assignment and would cycle/repeat with more players.
- *Random colour per connection*: rejected — not stable across re-render and could collide visually.

### Decision 5: Render colour via inline `style.background-color`, keep cell template generic

**Choice:** The 10 000-cell template applies `[style.background-color]` only on cells that are remote-snake cells, with the value pulled from a per-cell colour lookup the component computes once per remote-snakes change.

**Rationale:** Keeps SCSS responsible for layout/local-snake colours (green for local, red default for `is-dead`, etc.) and uses inline style only where dynamic per-player colour is required. Avoids generating ad-hoc CSS classes per connection id.

## Risks / Trade-offs

- **Client-authoritative collision can disagree between peers** → Mitigation: respawn is automatic and cheap; both clients usually agree because they receive the same state.
- **Stale state during network hiccups can cause perceived "ghost" collisions** → Mitigation: SignalR `withAutomaticReconnect()` is already enabled; on prolonged disconnect the `PlayerLeft` event clears the remote snake on peers.
- **Per-cell inline style on a 100×100 grid could pressure change detection** → Mitigation: the colour map is recomputed only when `remoteSnakes()` changes, and the template already iterates 10 000 cells with `OnPush`.
- **Two players with similar hashed shades may look alike** → Mitigation: hue/saturation/lightness variation gives enough spread; if it becomes a real problem, the helper can be swapped for a palette later without spec changes.
- **Republishing on respawn doubles the message rate around death events** → Acceptable: one extra message per death is negligible.
