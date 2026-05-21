/**
 * Deterministically derives a "shade of red" HSL colour string from a SignalR
 * connection id.
 *
 * Hue stays in [0°, 20°] (red band), saturation in [70%, 90%], lightness in
 * [35%, 60%]. The function is pure and stable: the same id always yields the
 * same colour, and distinct ids generally yield perceptually distinct shades.
 *
 * Spec: openspec/changes/add-multiplayer-signalr/specs/remote-snake-rendering/spec.md
 */
export function colorForConnectionId(connectionId: string): string {
  // DJB2-style hash. Use unsigned 32-bit arithmetic via the >>> 0 trick.
  let hash = 5381;
  for (let i = 0; i < connectionId.length; i++) {
    hash = (((hash << 5) + hash) + connectionId.charCodeAt(i)) >>> 0;
  }

  const hue = hash % 21; // 0..20 inclusive
  const saturation = 70 + ((hash >>> 5) % 21); // 70..90 inclusive
  const lightness = 35 + ((hash >>> 10) % 26); // 35..60 inclusive

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}
