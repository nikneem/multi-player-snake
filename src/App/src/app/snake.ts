import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Direction, SnakeSegment } from './models/snake.model';
import { RealtimeService } from './services/realtime.service';

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

@Injectable({ providedIn: 'root' })
export class Snake {
  private readonly destroyRef = inject(DestroyRef);
  private readonly realtimeService = inject(RealtimeService);

  readonly segments = signal<SnakeSegment[]>([]);
  readonly direction = signal<Direction>('right');
  readonly foodPosition = signal<SnakeSegment | null>(null);
  readonly gameState = signal<'playing' | 'dead'>('playing');

  constructor() {
    this.initialiseSnake();

    const id = setInterval(() => this.tick(), 150);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }

  changeDirection(dir: Direction): void {
    if (this.gameState() === 'dead') return;
    if (dir === OPPOSITE[this.direction()]) return;
    this.direction.set(dir);
  }

  private initialiseSnake(): void {
    const row = 50;
    const segs: SnakeSegment[] = [52, 51, 50, 49, 48].map((col) => ({
      col,
      row,
    }));
    this.segments.set(segs);
    this.spawnFood();
  }

  private tick(): void {
    if (this.gameState() === 'dead') return;

    const segs = this.segments();
    const head = segs[0];
    const dir = this.direction();

    let col = head.col;
    let row = head.row;

    if (dir === 'right') col = col + 1;
    else if (dir === 'left') col = col - 1;
    else if (dir === 'down') row = row + 1;
    else if (dir === 'up') row = row - 1;

    // Wall collision
    if (col < 0 || col >= 100 || row < 0 || row >= 100) {
      this.die();
      return;
    }

    // Self-collision: check against body segments that will remain after tail removal
    const bodyAfterMove = new Set(
      segs.slice(1, -1).map((s) => s.row * 100 + s.col),
    );
    if (bodyAfterMove.has(row * 100 + col)) {
      this.die();
      return;
    }

    // Remote-snake collision: any segment of any remote player is lethal.
    // Spec: openspec/changes/add-multiplayer-signalr/specs/snake-collision/spec.md
    const remoteSnakes = this.realtimeService.remoteSnakes();
    if (remoteSnakes.size > 0) {
      const newHeadIndex = row * 100 + col;
      for (const remote of remoteSnakes.values()) {
        for (const seg of remote.segments) {
          if (seg.row * 100 + seg.col === newHeadIndex) {
            this.die();
            return;
          }
        }
      }
    }

    const newHead: SnakeSegment = { col, row };
    const food = this.foodPosition();
    const atFood = food !== null && col === food.col && row === food.row;

    if (atFood) {
      this.segments.set([newHead, ...segs]);
      this.spawnFood();
    } else {
      this.segments.set([newHead, ...segs.slice(0, -1)]);
    }

    this.publishCurrentState();
  }

  private die(): void {
    this.gameState.set('dead');
    setTimeout(() => this.resetGame(), 600);
  }

  private resetGame(): void {
    this.direction.set('right');
    this.initialiseSnake();
    this.gameState.set('playing');
    // Republish so peers stop rendering the dead snake before the next tick.
    // Spec: openspec/changes/add-multiplayer-signalr/specs/game-reset/spec.md
    this.publishCurrentState();
  }

  private publishCurrentState(): void {
    const updatedSegments = this.segments();
    this.realtimeService.publishState({
      connectionId: '',
      segments: updatedSegments,
      direction: this.direction(),
      length: updatedSegments.length,
    });
  }

  private spawnFood(): void {
    const occupied = new Set(
      this.segments().map((s) => s.row * 100 + s.col),
    );
    let index: number;
    do {
      index = Math.floor(Math.random() * 10_000);
    } while (occupied.has(index));

    this.foodPosition.set({ col: index % 100, row: Math.floor(index / 100) });
  }
}


