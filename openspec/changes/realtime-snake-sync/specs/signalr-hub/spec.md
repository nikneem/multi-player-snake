## ADDED Requirements

### Requirement: Hub accepts snake state publications from clients
The `SnakeHub` SignalR hub SHALL expose a `PublishState` method that clients call on every tick to broadcast their current snake state to all other connected clients.

#### Scenario: State is relayed to all other clients
- **WHEN** a connected client calls `PublishState` with a valid `SnakeStateMessage`
- **THEN** the hub SHALL call `Clients.Others.SendAsync("SnakeState", message)` so every other connected client receives the message

#### Scenario: Connection ID is injected server-side
- **WHEN** a client calls `PublishState`
- **THEN** the hub SHALL overwrite the `ConnectionId` field of the message with `Context.ConnectionId` before relaying, so clients cannot spoof another player's ID

---

### Requirement: Hub notifies all clients when a player disconnects
The `SnakeHub` SHALL override `OnDisconnectedAsync` and broadcast a `PlayerLeft` message carrying the disconnecting client's `ConnectionId` to all remaining connected clients.

#### Scenario: Player leaves cleanly
- **WHEN** a client closes the browser tab or navigates away
- **THEN** `OnDisconnectedAsync` is triggered and all remaining clients receive `PlayerLeft(connectionId)`

#### Scenario: Player drops unexpectedly
- **WHEN** a client loses its network connection and the SignalR keep-alive times out
- **THEN** `OnDisconnectedAsync` is triggered and all remaining clients receive `PlayerLeft(connectionId)`

---

### Requirement: Hub endpoint is mapped in the ASP.NET Core pipeline
The hub SHALL be mapped at `/hubs/snake` in `Program.cs` so clients can connect to a stable URL.

#### Scenario: Hub responds to SignalR negotiate request
- **WHEN** a client performs an HTTP POST to `/hubs/snake/negotiate`
- **THEN** the server responds with a valid SignalR negotiation payload

---

### Requirement: CORS allows the Angular origin in development
The backend SHALL configure a named CORS policy that permits the Angular dev-server origin so that SignalR's HTTP negotiation request succeeds during local development.

#### Scenario: Preflight from Angular dev origin succeeds
- **WHEN** the Angular app running on the dev server sends an OPTIONS preflight to `/hubs/snake/negotiate`
- **THEN** the server responds with appropriate CORS headers and the negotiation proceeds
