## Why

The game already broadcasts snake state over SignalR, but remote players are purely cosmetic ghosts — the local snake cannot collide with them, and every remote player is rendered with one indistinguishable red colour. To make the game a genuine multiplayer experience, the local snake must die when it crashes into another player's body, every remote player needs to be visually distinguishable, and the existing automatic respawn must keep the round flowing without manual intervention.

## What Changes

- Local snake head collision against any remote snake segment SHALL trigger the death sequence.
- After dying (from any cause: wall, self, or remote collision), the local snake SHALL automatically respawn at its initial position and resume broadcasting.
- On respawn, the player SHALL emit a fresh state so other clients immediately see the new position rather than the stale pre-death state.
- The local player's snake SHALL always render in green; each remote player SHALL render in a distinct, deterministic shade of red derived from their SignalR connection id, so two remote players never look identical.
- The SignalR move payload SHALL continue to include the snake segments (x, y coordinates per segment) and the current direction; the head position is implied by `segments[0]`. The hub SHALL keep stamping the authoritative `ConnectionId` on every broadcast.
- Disconnected players SHALL be removed from the playfield (already implemented via `PlayerLeft`, retained as a requirement).

## Capabilities

### New Capabilities
- `multiplayer-realtime`: SignalR-based real-time exchange of snake state between players, including connection lifecycle and remote-player tracking on the client.
- `remote-snake-rendering`: Visual differentiation between the local snake (green) and each remote snake (a deterministic shade of red per connection id).

### Modified Capabilities
- `snake-collision`: Adds a new collision class — head-vs-remote-snake — that also triggers the death sequence.
- `game-reset`: Respawn after death SHALL also broadcast the new initial state so other clients are not left rendering the dead snake.

## Impact

- **Backend (`src/Snake.Api/`)**: `SnakeHub` and `SnakeStateMessage` already exist; this change formalises their contract as a spec but requires no new endpoints. CORS / SignalR registration in `Program.cs` is unchanged.
- **Frontend (`src/App/`)**:
  - `Snake` service: collision check extended to include remote segment indices; respawn must republish state.
  - `RealtimeService`: assigns/derives a colour shade per remote `connectionId`; clears remote state on `PlayerLeft`.
  - `Playfield` component / template / SCSS: renders remote snake cells with inline per-player colour, keeps local snake green.
- **Dependencies**: `@microsoft/signalr` is already installed; no new packages.
- **Tests**: Vitest specs for `Snake` and `Playfield` updated to cover remote collision and colour assignment.
