## Context

The repo is a multi-player Snake game. The frontend (Angular 21, signals) runs the full game loop locally — `SnakeService` owns all game state. The backend (ASP.NET Core 10 minimal API) currently exposes only a `/health` endpoint. There is no real-time channel between players.

The goal is to add a SignalR hub to the backend and a corresponding Angular service to the frontend so that each client's snake state is broadcast to all other connected clients on every tick (~150 ms).

## Goals / Non-Goals

**Goals:**
- Every connected player sees all other players' snakes rendered on their local playfield.
- Snake state published each tick: all segment positions, current direction, and length.
- Players are identified by their SignalR connection ID.
- When a player disconnects, their snake is removed from all other clients' views.
- Connection errors are non-fatal — single-player gameplay continues if the hub is unreachable.
- No new Azure infrastructure required.

**Non-Goals:**
- Server-authoritative game loop (clients remain authoritative over their own snake).
- Collision detection between players' snakes (future work).
- Named players / lobbies / rooms (all players share one global game).
- Food synchronisation across players (each client manages its own food independently for now).
- Spectator mode or replay.

## Decisions

### D1 — Transport: ASP.NET Core SignalR (not raw WebSockets or Socket.IO)
SignalR is built into ASP.NET Core with no extra package needed on the server. It provides automatic reconnect, fallback transports, and a typed hub API. The Angular client uses `@microsoft/signalr` (the official JS client). No separate message broker (Redis, Service Bus) is needed at this scale (max 1 backend replica).

*Alternative considered*: Raw WebSockets via `System.Net.WebSockets` — more control but far more boilerplate and no automatic reconnect.

### D2 — Message shape: flat `SnakeStateMessage` record
Each tick the frontend sends one message with all required fields:
```json
{
  "connectionId": "<hub-assigned>",
  "segments": [{ "col": 52, "row": 50 }, ...],
  "direction": "right",
  "length": 5
}
```
The hub relays this to all *other* clients via `Clients.Others.SendAsync("SnakeState", message)`. Keeping the payload flat avoids nested serialisation overhead.

*Alternative considered*: Send only the head position + delta — smaller payload but requires clients to maintain per-player state machines to reconstruct full snake, adding complexity.

### D3 — Hub method: single `PublishState` method (no per-property methods)
One hub method replaces separate `UpdateDirection`, `UpdateLength` etc. calls. This keeps the hub surface minimal and allows the frontend to batch all state in one network round-trip per tick.

### D4 — Client-side remote snake store: `Map<connectionId, SnakeStateMessage>` signal in `RealtimeService`
`RealtimeService` holds a `signal<Map<string, SnakeStateMessage>>` updated on each incoming hub message. `PlayfieldComponent` reads this signal and computes remote segment indices for rendering. This integrates cleanly with the existing Angular signals architecture.

*Alternative considered*: NgRx / RxJS BehaviorSubject — overkill given the project already uses signals exclusively.

### D5 — CORS: allow Angular dev origin explicitly
The Angular dev server runs on a dynamic port injected by Aspire. The backend must allow the frontend origin for SignalR's HTTP negotiation request. In development, `AllowAnyOrigin` is acceptable; in production (ACA) both apps share a `*.azurecontainerapps.io` domain so CORS is not an issue for same-origin requests. A named CORS policy `"DevCors"` is applied only in the Development environment.

### D6 — Player removal: `OnDisconnectedAsync` override in hub
When a client disconnects (normal or abnormal), `OnDisconnectedAsync` broadcasts a `PlayerLeft(connectionId)` message to all remaining clients. The Angular client removes that connection ID from its remote snake map.

## Risks / Trade-offs

- **150 ms tick × N players = O(N²) messages** → Mitigation: max 1 backend replica, designed for small lobbies (< 20 players); acceptable for demo scale.
- **Out-of-order messages** → Mitigation: SignalR over WebSockets is ordered; if fallback to long-polling occurs, messages may arrive slightly out of order but the full-state payload (not delta) means any message is self-consistent.
- **Cold-start delay (backend min 0 replicas)** → Mitigation: SignalR connection is attempted once on game start; if it fails or times out (5 s), `RealtimeService` logs a warning and the game continues in single-player mode.
- **ACA WebSocket support** → ACA supports WebSockets on HTTP/1.1 ingress by default; no extra configuration needed.

## Migration Plan

1. Add `@microsoft/signalr` to `src/App/package.json`.
2. Add `SnakeHub.cs` to `src/Snake.Api/` and map it in `Program.cs`.
3. Add `RealtimeService` to the Angular app; wire into `SnakeService.tick()` and `PlayfieldComponent`.
4. Test locally via Aspire (both services start together, Aspire injects the API URL into the frontend proxy).
5. Deploy: push to `main` → GitHub Actions builds new images → Bicep updates ACA container apps (no infra changes needed).
6. Rollback: re-run workflow on previous commit SHA.

## Open Questions

- Should food position be synchronised in a future change so all players share the same food? (Out of scope here — noted for follow-up.)
- Should player-to-player collision be detected server-side or client-side? (Out of scope here.)
