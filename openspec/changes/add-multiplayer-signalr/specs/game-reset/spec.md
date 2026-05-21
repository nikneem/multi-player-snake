## ADDED Requirements

### Requirement: Respawn republishes state to peers
After the automatic 600 ms reset restores the snake to its initial position, the client SHALL publish exactly one `SnakeState` message reflecting the freshly initialised segments and direction, before the next game tick elapses. This SHALL apply regardless of which collision class caused the death (wall, self, or remote snake).

#### Scenario: Republish after wall-collision respawn
- **WHEN** the game transitions from `dead` to `playing` following a wall-collision death
- **THEN** the client SHALL publish one state message containing the initial 5-segment configuration with direction `right` before the next tick

#### Scenario: Republish after remote-snake-collision respawn
- **WHEN** the game transitions from `dead` to `playing` following a collision with a remote snake
- **THEN** the client SHALL publish one state message containing the initial 5-segment configuration with direction `right` before the next tick

#### Scenario: No publish when hub is disconnected
- **WHEN** respawn occurs while the SignalR hub is not in the `Connected` state
- **THEN** no publish SHALL be attempted and no exception SHALL be raised
