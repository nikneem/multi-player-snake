## 1. Backend – SignalR Hub Setup

- [ ] 1.1 Add `Microsoft.AspNetCore.SignalR` NuGet reference (it ships with ASP.NET Core, just confirm no extra package needed)
- [ ] 1.2 Create `SnakeStateMessage` DTO record in `src/Snake.Api/Hubs/SnakeStateMessage.cs`
- [ ] 1.3 Create `SnakeHub : Hub` class in `src/Snake.Api/Hubs/SnakeHub.cs` with `PublishState` method that overwrites `ConnectionId` and broadcasts to `Clients.Others`
- [ ] 1.4 Override `OnDisconnectedAsync` in `SnakeHub` to broadcast `PlayerLeft(connectionId)` to all clients
- [ ] 1.5 Register `AddSignalR()` in `Program.cs`
- [ ] 1.6 Add a named CORS policy (`AllowAngularDev`) in `Program.cs` that permits the Angular dev-server origin in Development mode
- [ ] 1.7 Map the hub at `/hubs/snake` in `Program.cs`

## 2. Frontend – Install SignalR Client

- [ ] 2.1 Run `npm install @microsoft/signalr` in `src/App/`
- [ ] 2.2 Add `SnakeStateMessage` TypeScript interface in `src/App/src/app/models/snake-state-message.ts`

## 3. Frontend – RealtimeService

- [ ] 3.1 Create `src/App/src/app/services/realtime.service.ts` with `HubConnection` configured with `withAutomaticReconnect()`
- [ ] 3.2 Add `remoteSnakes` signal of type `Map<string, SnakeStateMessage>` to `RealtimeService`
- [ ] 3.3 Register `on('SnakeState', ...)` handler before connection start — updates `remoteSnakes` keyed by `connectionId`
- [ ] 3.4 Register `on('PlayerLeft', ...)` handler before connection start — removes entry from `remoteSnakes`
- [ ] 3.5 Implement `publishState(state: SnakeStateMessage)` — invokes `PublishState` only when connection is `Connected`, silently skips otherwise
- [ ] 3.6 Start the connection in a `try/catch`; on failure log a warning and continue in single-player mode
- [ ] 3.7 Stop the connection in `ngOnDestroy` / `DestroyRef` cleanup

## 4. Frontend – SnakeService publishes state after each tick

- [ ] 4.1 Inject `RealtimeService` into `SnakeService`
- [ ] 4.2 After a successful tick (game not dead), call `realtimeService.publishState(...)` with current `segments`, `direction`, and `length`
- [ ] 4.3 Wrap the `publishState` call in a `.catch(() => {})` so hub errors never propagate to the game loop

## 5. Frontend – PlayfieldComponent renders remote snakes

- [ ] 5.1 Inject `RealtimeService` into `PlayfieldComponent`
- [ ] 5.2 Add `remoteSegmentIndices` computed signal that flattens all remote snake segments into a `Set<number>`
- [ ] 5.3 In the cell rendering logic, apply `remote-snake` CSS class when the flat index is in `remoteSegmentIndices` (local snake classes take priority)
- [ ] 5.4 Add `.remote-snake` SCSS rule with a visually distinct colour from `snake-head` and `snake-body`

## 6. Aspire AppHost – SignalR Connection URL

- [ ] 6.1 Confirm `snake-api` service reference is wired to the Angular app's `API_URL` env var in the Aspire AppHost so the Angular dev proxy knows where to connect

## 7. Validation

- [ ] 7.1 Open two browser tabs; verify both snakes render on each tab's playfield
- [ ] 7.2 Close one tab; verify the remote snake disappears on the remaining tab
- [ ] 7.3 Verify the local game continues uninterrupted when the backend is unreachable
