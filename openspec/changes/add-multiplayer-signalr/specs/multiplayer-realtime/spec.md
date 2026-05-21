## ADDED Requirements

### Requirement: SignalR hub endpoint for snake state exchange
The backend SHALL expose a SignalR hub at the route `/hubs/snake`. The hub SHALL accept a `PublishState` invocation from any connected client and SHALL broadcast the resulting message to all other connected clients via a `SnakeState` event. The hub SHALL overwrite the `ConnectionId` field of every outbound message with the server-known `Context.ConnectionId`, so clients cannot impersonate another player.

#### Scenario: Client publishes state
- **WHEN** a connected client invokes `PublishState` with a message
- **THEN** all OTHER connected clients SHALL receive a `SnakeState` event whose `ConnectionId` equals the publishing client's server-side connection id
- **AND** the publishing client itself SHALL NOT receive its own message back

#### Scenario: Client attempts to spoof connection id
- **WHEN** a client invokes `PublishState` with a `ConnectionId` field set to a value other than its own
- **THEN** the broadcast message SHALL still carry the server-known connection id of the publishing client, not the supplied value

---

### Requirement: Player disconnect broadcasts a `PlayerLeft` event
The hub SHALL emit a `PlayerLeft` event to all remaining clients whenever a client disconnects (gracefully or otherwise). The event payload SHALL be the disconnecting client's `ConnectionId`.

#### Scenario: Client disconnects
- **WHEN** a connected client's SignalR connection ends for any reason
- **THEN** all remaining connected clients SHALL receive a `PlayerLeft` event containing the departing client's connection id

---

### Requirement: Snake state message payload
The `SnakeStateMessage` exchanged through the hub SHALL contain at minimum: a `ConnectionId` (string), a `Segments` array of `{ col, row }` cell coordinates ordered head-first, a `Direction` value (`up` | `down` | `left` | `right`), and a `Length` integer. The head position is implied as `Segments[0]`.

#### Scenario: Move is published with coordinates and direction
- **WHEN** the local snake moves one cell during a tick and is alive
- **THEN** the client SHALL publish a state message whose `Segments` reflects the new positions of all segments, `Direction` is the current heading, and `Length` equals `Segments.length`

---

### Requirement: Client tracks remote snakes keyed by connection id
The client SHALL maintain a reactive map of remote snake states keyed by `connectionId`. The map SHALL be updated atomically on each `SnakeState` event and entries SHALL be removed on the matching `PlayerLeft` event.

#### Scenario: Remote state arrives
- **WHEN** a `SnakeState` event is received for connection id `X`
- **THEN** the remote-snakes map entry for `X` SHALL be replaced with the new state, and downstream consumers SHALL observe the change

#### Scenario: Remote player leaves
- **WHEN** a `PlayerLeft` event is received for connection id `X`
- **THEN** the remote-snakes map SHALL no longer contain an entry for `X`, and the playfield SHALL stop rendering that snake on the next change-detection pass

---

### Requirement: Local move broadcasting on every tick
On every game tick during which the local snake successfully moves (i.e. does not die), the client SHALL publish a fresh state message to the hub. If the hub connection is not in the `Connected` state, the publish SHALL be skipped silently and SHALL NOT throw.

#### Scenario: Tick while connected
- **WHEN** the local snake completes a tick in the `playing` state and the hub connection is `Connected`
- **THEN** exactly one `PublishState` invocation SHALL be sent containing the updated segments and current direction

#### Scenario: Tick while disconnected
- **WHEN** the local snake completes a tick and the hub connection is not `Connected`
- **THEN** no exception SHALL be raised and the game SHALL continue in single-player mode

---

### Requirement: Republish state on respawn
After the local snake respawns following death, the client SHALL publish exactly one state message with the freshly initialised segments before the next tick fires, so that peers stop rendering the pre-death snake position.

#### Scenario: Respawn after death
- **WHEN** the game transitions from `dead` back to `playing` via the automatic reset
- **THEN** the client SHALL publish a `SnakeState` message whose `Segments` matches the initial 5-segment configuration, before the next tick elapses
