import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { Snake } from './snake';
import { SnakeStateMessage } from './models/snake-state-message';
import { RealtimeService } from './services/realtime.service';

class StubRealtimeService {
  readonly remoteSnakes = signal<Map<string, SnakeStateMessage>>(new Map());
  readonly publishedStates: SnakeStateMessage[] = [];

  publishState(state: SnakeStateMessage): void {
    this.publishedStates.push(state);
  }
}

function createSnake(stub: StubRealtimeService): Snake {
  TestBed.configureTestingModule({
    providers: [{ provide: RealtimeService, useValue: stub }],
  });
  return TestBed.inject(Snake);
}

describe('Snake', () => {
  let stub: StubRealtimeService;

  beforeEach(() => {
    vi.useFakeTimers();
    stub = new StubRealtimeService();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.useRealTimers();
  });

  it('initialises with 5 horizontal segments around grid centre, moving right', () => {
    const snake = createSnake(stub);
    expect(snake.segments().length).toBe(5);
    expect(snake.direction()).toBe('right');
    expect(snake.gameState()).toBe('playing');
    expect(snake.segments()[0]).toEqual({ col: 52, row: 50 });
  });

  it('publishes its updated state on a normal tick', () => {
    const snake = createSnake(stub);
    stub.publishedStates.length = 0;

    vi.advanceTimersByTime(150);

    expect(stub.publishedStates.length).toBe(1);
    const published = stub.publishedStates[0];
    expect(published.direction).toBe('right');
    expect(published.length).toBe(5);
    expect(published.segments[0]).toEqual({ col: 53, row: 50 });
  });

  it('dies when its new head moves into a remote snake segment', () => {
    const snake = createSnake(stub);
    // Place a remote snake body segment one cell to the right of the head (col 53).
    stub.remoteSnakes.set(
      new Map<string, SnakeStateMessage>([
        [
          'remote-1',
          {
            connectionId: 'remote-1',
            segments: [{ col: 53, row: 50 }],
            direction: 'left',
            length: 1,
          },
        ],
      ]),
    );

    vi.advanceTimersByTime(150);

    expect(snake.gameState()).toBe('dead');
  });

  it('does not check remote snakes when the map is empty (still proceeds normally)', () => {
    const snake = createSnake(stub);
    // Map is empty by default — a normal tick must not die.
    vi.advanceTimersByTime(150);
    expect(snake.gameState()).toBe('playing');
  });

  it('respawns and republishes its initial state after death', () => {
    const snake = createSnake(stub);
    // Force a wall death by turning up and walking off the top edge.
    snake.changeDirection('up');
    // 50 ticks to walk from row 50 to row 0, then one more to leave the grid.
    vi.advanceTimersByTime(150 * 51);
    expect(snake.gameState()).toBe('dead');

    stub.publishedStates.length = 0;
    // Respawn timer is 600 ms.
    vi.advanceTimersByTime(600);

    expect(snake.gameState()).toBe('playing');
    // At least one publish happened on respawn, with the initial 5-segment layout.
    expect(stub.publishedStates.length).toBeGreaterThanOrEqual(1);
    const respawnPublish = stub.publishedStates[0];
    expect(respawnPublish.direction).toBe('right');
    expect(respawnPublish.length).toBe(5);
    expect(respawnPublish.segments[0]).toEqual({ col: 52, row: 50 });
    expect(respawnPublish.segments[4]).toEqual({ col: 48, row: 50 });
  });

  it('wall collision pre-empts the remote-snake collision check', () => {
    const snake = createSnake(stub);
    // Drop a remote segment somewhere that wouldn't be hit, just to confirm
    // the wall short-circuit fires first.
    stub.remoteSnakes.set(
      new Map<string, SnakeStateMessage>([
        [
          'remote-1',
          {
            connectionId: 'remote-1',
            segments: [{ col: 10, row: 10 }],
            direction: 'left',
            length: 1,
          },
        ],
      ]),
    );
    snake.changeDirection('up');
    vi.advanceTimersByTime(150 * 51);
    expect(snake.gameState()).toBe('dead');
  });
});
