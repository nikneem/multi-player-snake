## ADDED Requirements

### Requirement: Remote players' snakes are rendered on the playfield
`PlayfieldComponent` SHALL read `RealtimeService.remoteSnakes` and apply a `remote-snake` CSS class to every cell index occupied by any remote player's snake segments.

#### Scenario: Remote snake segments are marked
- **WHEN** a remote player's `SnakeState` message is received with N segments
- **THEN** all N cell indices occupied by that remote snake have the `remote-snake` CSS class applied on the next render cycle

#### Scenario: Multiple remote snakes are all rendered
- **WHEN** there are 3 connected remote players each with distinct snake positions
- **THEN** all remote snake segments from all 3 players are rendered with the `remote-snake` class

---

### Requirement: Remote snake is visually distinct from the local snake
Remote snake cells SHALL use a different colour from the local snake head (`snake-head`) and body (`snake-body`) so players can distinguish their own snake.

#### Scenario: Remote snake colour differs from local snake
- **WHEN** a remote snake segment occupies a cell adjacent to the local snake
- **THEN** the remote cell has a visually distinct colour from both `snake-head` and `snake-body` cells

---

### Requirement: Remote snake is removed from the playfield when a player leaves
When a `PlayerLeft` event is received, the corresponding remote snake segments SHALL be removed from the playfield immediately.

#### Scenario: Disconnected player's snake disappears
- **WHEN** `PlayerLeft(connectionId)` is received
- **THEN** all cells previously carrying the `remote-snake` class for that `connectionId` revert to unstyled within one render cycle

---

### Requirement: Local snake cells take visual priority over remote snake cells
If a remote snake segment coincidentally occupies the same cell as the local snake head or body, the local snake styling (`snake-head` or `snake-body`) SHALL take priority.

#### Scenario: Overlap renders local snake style
- **WHEN** a remote snake segment occupies the same cell as the local snake head
- **THEN** the cell displays `snake-head` styling, not `remote-snake` styling
