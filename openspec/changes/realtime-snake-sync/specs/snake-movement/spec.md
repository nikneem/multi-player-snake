## ADDED Requirements

### Requirement: Snake state is published to the hub after every tick
After each successful movement tick (while `gameState` is `'playing'`), `SnakeService` SHALL call `RealtimeService.publishState()` with the current segments, direction, and length. This call is fire-and-forget; errors from the hub call SHALL NOT affect the local game loop.

#### Scenario: State published after normal tick
- **WHEN** a game tick completes and the snake moves without dying
- **THEN** `RealtimeService.publishState` is called once with the updated segments array, current direction, and current length

#### Scenario: State not published when dead
- **WHEN** `gameState` is `'dead'`
- **THEN** `tick()` returns early before publishing state and no hub call is made

#### Scenario: Hub error does not interrupt game
- **WHEN** `RealtimeService.publishState` rejects (e.g. connection dropped mid-tick)
- **THEN** the local snake continues moving normally on subsequent ticks
