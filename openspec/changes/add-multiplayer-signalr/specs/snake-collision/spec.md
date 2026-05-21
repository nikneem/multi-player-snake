## ADDED Requirements

### Requirement: Remote-snake collision detection
The system SHALL detect when the local snake's new head position coincides with any cell currently occupied by any segment (head or body) of any remote snake known to the client. When such a collision is detected, the game SHALL transition to the `dead` state immediately, using the same death pathway as wall and self collisions.

#### Scenario: Head enters a remote snake's body cell
- **WHEN** the local snake's new head position equals the cell of any segment of any remote snake in the current remote-snakes map
- **THEN** the game SHALL transition to the `dead` state immediately
- **AND** the automatic respawn defined by the `game-reset` capability SHALL fire after the standard pause

#### Scenario: Head-on collision with a remote head
- **WHEN** the local snake's new head position equals the head position (`Segments[0]`) of any remote snake
- **THEN** the game SHALL transition to the `dead` state immediately

#### Scenario: No remote snakes present
- **WHEN** the remote-snakes map is empty
- **THEN** no remote-snake collision SHALL occur and the tick SHALL proceed using only wall and self collision checks

#### Scenario: New head clears all remote segments
- **WHEN** the local snake's new head position does not match any cell of any remote snake
- **THEN** no remote-snake collision SHALL occur and the tick SHALL proceed normally

---

### Requirement: Remote-snake collision check ordering
Within a single tick, the remote-snake collision check SHALL be performed after the wall and self-collision checks but before the food-eating check. Death from any earlier check SHALL short-circuit the remote-snake check.

#### Scenario: Wall collision pre-empts remote check
- **WHEN** the local snake's new head position is out of bounds AND would also coincide with a remote segment
- **THEN** the death is attributed to the wall collision and the remote-snake check is not evaluated

#### Scenario: Self-collision pre-empts remote check
- **WHEN** the local snake's new head position is in its own remaining body AND would also coincide with a remote segment
- **THEN** the death is attributed to the self-collision and the remote-snake check is not evaluated
