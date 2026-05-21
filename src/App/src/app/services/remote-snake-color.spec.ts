import { colorForConnectionId } from './remote-snake-color';

describe('colorForConnectionId', () => {
  it('is deterministic for the same id', () => {
    expect(colorForConnectionId('abc123')).toBe(colorForConnectionId('abc123'));
    expect(colorForConnectionId('xyz')).toBe(colorForConnectionId('xyz'));
  });

  it('returns an hsl() string with hue in [0, 20], sat in [70, 90], lightness in [35, 60]', () => {
    const ids = [
      'a', 'b', 'connection-1', 'connection-2', 'AAAAA', 'zzzzz',
      'abcdef0123456789', '00000000', 'longish-signalr-connection-id-value',
    ];
    const pattern = /^hsl\((\d+), (\d+)%, (\d+)%\)$/;
    for (const id of ids) {
      const value = colorForConnectionId(id);
      const match = value.match(pattern);
      expect(match, `${value} should match hsl pattern`).not.toBeNull();
      const [, hueStr, satStr, lightStr] = match!;
      const hue = Number(hueStr);
      const sat = Number(satStr);
      const light = Number(lightStr);
      expect(hue).toBeGreaterThanOrEqual(0);
      expect(hue).toBeLessThanOrEqual(20);
      expect(sat).toBeGreaterThanOrEqual(70);
      expect(sat).toBeLessThanOrEqual(90);
      expect(light).toBeGreaterThanOrEqual(35);
      expect(light).toBeLessThanOrEqual(60);
    }
  });

  it('produces distinguishable shades for distinct ids', () => {
    const sample = ['alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot'];
    const colors = new Set(sample.map(colorForConnectionId));
    // Out of 6 ids we expect at least 4 distinct colour strings.
    expect(colors.size).toBeGreaterThanOrEqual(4);
  });
});
