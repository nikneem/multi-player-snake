## 1. Backend (SignalR contract)

- [x] 1.1 Verify `SnakeHub.PublishState` still overwrites `ConnectionId` with `Context.ConnectionId` and broadcasts only to `Clients.Others` (already present — confirm and add an XML doc comment describing the spec contract).
- [x] 1.2 Verify `SnakeHub.OnDisconnectedAsync` broadcasts `PlayerLeft` with the disconnecting connection id to `Clients.All` (already present — confirm).
- [x] 1.3 Confirm `SnakeStateMessage` and `SnakeSegment` records expose `ConnectionId`, `Segments`, `Direction`, `Length`, `Col`, `Row` exactly as the `multiplayer-realtime` spec requires; adjust naming if necessary.

## 2. Frontend — RealtimeService colour assignment

- [x] 2.1 Add a pure helper (e.g. `src/App/src/app/services/remote-snake-color.ts`) that turns a `connectionId` string into a stable HSL string with hue in [0°, 20°], saturation in [70%, 90%], lightness in [35%, 60%], using a deterministic hash (e.g. FNV-1a or DJB2).
- [x] 2.2 In `RealtimeService`, extend the `remoteSnakes` value or add a parallel `remoteColors` computed/signal that maps each known `connectionId` to its HSL string. Recompute only when the set of connection ids changes.
- [x] 2.3 Add unit tests for the colour helper: determinism (same id → same colour), distinctness for several sample ids, and that the returned hue stays within the red band.

## 3. Frontend — Snake service collision & respawn

- [x] 3.1 In `Snake.tick()`, after the existing wall and self-collision checks and before the food check, compute the union set of remote-segment flat indices from `realtimeService.remoteSnakes()` and call `die()` if `newHead` is in that set.
- [x] 3.2 In `Snake.resetGame()`, after restoring segments and direction and setting state back to `playing`, call `realtimeService.publishState(...)` once with the freshly initialised segments so peers stop rendering the dead snake.
- [x] 3.3 Make sure the existing per-tick publish still fires only while the local snake is alive (already gated by `gameState`), and that `publishState` is a no-op when the hub is not `Connected` (already implemented — confirm).
- [x] 3.4 Add Vitest unit tests for `Snake`:
  - dies when its computed new head matches a remote segment
  - does not die when remote snakes map is empty
  - publishes once on respawn with the initial 5-segment configuration
  - wall and self-collision short-circuit the remote check (no remote map access required).

## 4. Frontend — Playfield rendering

- [x] 4.1 In `Playfield`, change `remoteSegmentIndices` from a `Set<number>` to a `Map<number, string>` whose value is the HSL colour for that cell's owning remote player. Resolve overlaps by skipping cells already occupied by the local head/body so local rendering always wins.
- [x] 4.2 Update `playfield.html` so the remote-snake cell uses `[style.background-color]` bound to the per-cell colour from the map, and keeps the existing `[class.remote-snake]` for non-colour styling (border / glow).
- [x] 4.3 Update `playfield.scss` so `.snake-head` and `.snake-body` (local) are green by default, the existing `.is-dead .snake-head` / `.snake-body` red override still wins, and `.remote-snake` no longer hard-codes a single red (background is supplied inline).
- [x] 4.4 Add Playfield component tests covering: local cells render green while playing, local cells render red while dead, two remote players render with different background colours, a cell occupied by both local and remote renders as local.

## 5. Verification

- [x] 5.1 Run `npm test` from `src/App/` and confirm all existing + new Vitest specs pass. *(16/16 new tests pass; 1 pre-existing `app.spec.ts` failure unrelated to this change.)*
- [x] 5.2 Run `dotnet build src/snake.slnx` and confirm the API still builds (no contract change expected). *(Compilation clean; only post-build copy fails because a local `Snake.Api` process is holding the output DLL — environmental, not a code issue.)*
- [ ] 5.3 Manual smoke test via `dotnet run --project src/Aspire/Snake.Aspire.AppHost`: open two browser tabs, drive one snake into the other's body, verify the moving player dies, respawns at the start position within ~600 ms, and that the two remote snakes seen from a third tab render in different shades of red.

## 6. OpenSpec archival

- [ ] 6.1 Once implementation + tests are merged and verified, run `/opsx:archive` for `add-multiplayer-signalr` so the new specs become canonical under `openspec/specs/`.
