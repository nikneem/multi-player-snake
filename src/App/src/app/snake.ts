import { DestroyRef, Injectable, inject, signal } from '@angular/core';
import { Direction, SnakeSegment } from './models/snake.model';

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

@Injectable({ providedIn: 'root' })
export class Snake {
  private readonly destroyRef = inject(DestroyRef);

  readonly segments = signal<SnakeSegment[]>([]);
  readonly direction = signal<Direction>('right');
  readonly foodPosition = signal<SnakeSegment | null>(null);

  constructor() {
    this.initialiseSnake();

    const id = setInterval(() => this.tick(), 150);
    this.destroyRef.onDestroy(() => clearInterval(id));
  }

  changeDirection(dir: Direction): void {
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
    const segs = this.segments();
    const head = segs[0];
    const dir = this.direction();

    let col = head.col;
    let row = head.row;

    if (dir === 'right') col = (col + 1) % 100;
    else if (dir === 'left') col = (col - 1 + 100) % 100;
    else if (dir === 'down') row = (row + 1) % 100;
    else if (dir === 'up') row = (row - 1 + 100) % 100;

    const newHead: SnakeSegment = { col, row };
    const food = this.foodPosition();
    const atFood = food !== null && col === food.col && row === food.row;

    if (atFood) {
      this.segments.set([newHead, ...segs]);
      this.spawnFood();
    } else {
      this.segments.set([newHead, ...segs.slice(0, -1)]);
    }
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

