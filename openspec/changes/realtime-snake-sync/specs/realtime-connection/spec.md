## ADDED Requirements

### Requirement: RealtimeService establishes a SignalR connection on initialisation
The Angular `RealtimeService` (provided in root) SHALL create a `HubConnection` targeting `${apiUrl}/hubs/snake` using the `@microsoft/signalr` package and start the connection when the service is first used.

#### Scenario: Connection starts successfully
- **WHEN** `RealtimeService` is first injected and the backend is reachable
- **THEN** the `HubConnection` transitions to the `Connected` state within 5 seconds

#### Scenario: Connection failure is non-fatal
- **WHEN** the backend hub is unreachable (e.g. cold-start not yet complete)
- **THEN** `RealtimeService` logs a warning to the console and the game continues in single-player mode without throwing an unhandled error

---

### Requirement: RealtimeService automatically reconnects on connection drop
The `HubConnection` SHALL be configured with `withAutomaticReconnect()` so that transient network interruptions are recovered without user intervention.

#### Scenario: Connection is re-established after a brief drop
- **WHEN** the WebSocket connection is interrupted and then the network recovers
- **THEN** the `HubConnection` automatically attempts to reconnect and resumes receiving `SnakeState` messages

---

### Requirement: RealtimeService exposes a method to publish local snake state
`RealtimeService` SHALL expose a `publishState(state: SnakeStateMessage)` method that calls `HubConnection.invoke('PublishState', state)`. If the connection is not in the `Connected` state the call is silently skipped.

#### Scenario: State is sent when connected
- **WHEN** `publishState` is called and the connection is in `Connected` state
- **THEN** the `PublishState` hub method is invoked with the provided state

#### Scenario: State is silently dropped when disconnected
- **WHEN** `publishState` is called and the connection is NOT in `Connected` state
- **THEN** no error is thrown and the call is ignored

---

### Requirement: RealtimeService registers handlers for incoming hub messages
`RealtimeService` SHALL register `on('SnakeState', ...)` and `on('PlayerLeft', ...)` handlers before starting the connection, so no messages are missed.

#### Scenario: Incoming SnakeState is stored in remote snake map
- **WHEN** the hub sends a `SnakeState` message
- **THEN** `RealtimeService` updates its `remoteSnakes` signal with the new state keyed by `connectionId`

#### Scenario: PlayerLeft removes the snake from remote snake map
- **WHEN** the hub sends a `PlayerLeft(connectionId)` message
- **THEN** `RealtimeService` removes the entry for that `connectionId` from its `remoteSnakes` signal
