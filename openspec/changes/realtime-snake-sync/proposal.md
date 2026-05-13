## Why

The game is called *multi-player* Snake, but currently every player runs in complete isolation — there is no connection between clients and no shared game state. Adding real-time communication over SignalR allows the backend to act as a message broker: each client broadcasts its own snake's state and receives all other players' states, making the multi-player experience a reality.

## What Changes

- New ASP.NET Core SignalR hub (`SnakeHub`) exposes methods for clients to publish their snake state and receives broadcasts from the server to all connected clients.
- Angular frontend connects to the hub on game start, sends a state update on every movement tick (position, direction, length), and receives state updates from all other connected players.
- Other players' snakes are rendered on the local playfield with a distinct visual style (different colour from the local snake).
- Players are assigned a connection ID on join; their snake is removed from all clients when they disconnect.
- Local snake state is **not** re-rendered from hub messages — the authoritative local state stays in `SnakeService`; only remote snakes come from the hub.

## Capabilities

### New Capabilities
- `signalr-hub`: Server-side SignalR hub that accepts snake state messages and broadcasts them to all other connected clients; handles player join/leave lifecycle.
- `realtime-connection`: Angular service that manages the SignalR connection lifecycle (connect on game start, reconnect on drop, disconnect on destroy).
- `remote-snake-rendering`: Frontend renders one snake per remote player on the playfield using a `remote-snake` CSS class, updated reactively from hub messages.

### Modified Capabilities
- `snake-movement`: On every tick, the local snake's current state (head position, all segments, direction, length) is published to the SignalR hub.
- `playfield`: Playfield now renders remote players' snake segments alongside the local snake, each visually distinct.

## Impact

- **Backend**: Add `Microsoft.AspNetCore.SignalR` (built-in with ASP.NET Core); new `SnakeHub.cs`; map hub endpoint in `Program.cs`; configure CORS to allow the Angular dev origin.
- **Frontend**: Add `@microsoft/signalr` npm package; new `RealtimeService` (Angular service); `SnakeService.tick()` publishes state after each move; `PlayfieldComponent` renders remote snakes.
- **Bicep / deployment**: No new Azure resources — ACA supports WebSockets on HTTP/1.1 ingress out of the box.
- **No breaking changes** to existing single-player gameplay — if the hub is unreachable the game continues locally (connection errors are non-fatal).
