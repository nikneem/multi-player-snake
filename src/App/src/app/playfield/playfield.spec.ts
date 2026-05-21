import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

import { Playfield } from './playfield';
import { Snake } from '../snake';
import { Input } from '../input';
import { RealtimeService } from '../services/realtime.service';
import { SnakeSegment } from '../models/snake.model';
import { SnakeStateMessage } from '../models/snake-state-message';
import { colorForConnectionId } from '../services/remote-snake-color';

class StubSnake {
  readonly segments = signal<SnakeSegment[]>([
    { col: 52, row: 50 },
    { col: 51, row: 50 },
    { col: 50, row: 50 },
    { col: 49, row: 50 },
    { col: 48, row: 50 },
  ]);
  readonly direction = signal<'up' | 'down' | 'left' | 'right'>('right');
  readonly foodPosition = signal<SnakeSegment | null>({ col: 10, row: 10 });
  readonly gameState = signal<'playing' | 'dead'>('playing');
}

class StubInput {
  registerPlayfieldElement(): void {
    // no-op
  }
}

class StubRealtimeService {
  readonly remoteSnakes = signal<Map<string, SnakeStateMessage>>(new Map());
  readonly remoteColors = signal<Map<string, string>>(new Map());

  setRemotes(messages: SnakeStateMessage[]): void {
    const stateMap = new Map<string, SnakeStateMessage>();
    const colorMap = new Map<string, string>();
    for (const m of messages) {
      stateMap.set(m.connectionId, m);
      colorMap.set(m.connectionId, colorForConnectionId(m.connectionId));
    }
    this.remoteSnakes.set(stateMap);
    this.remoteColors.set(colorMap);
  }

  publishState(): void {
    // no-op
  }
}

describe('Playfield', () => {
  let component: Playfield;
  let fixture: ComponentFixture<Playfield>;
  let snake: StubSnake;
  let realtime: StubRealtimeService;

  beforeEach(async () => {
    snake = new StubSnake();
    realtime = new StubRealtimeService();

    await TestBed.configureTestingModule({
      imports: [Playfield],
      providers: [
        { provide: Snake, useValue: snake },
        { provide: Input, useValue: new StubInput() },
        { provide: RealtimeService, useValue: realtime },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Playfield);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  function cellAt(col: number, row: number): HTMLElement {
    const cells = fixture.nativeElement.querySelectorAll('.cell');
    return cells.item(row * 100 + col) as HTMLElement;
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('renders the local snake head and body with the green snake classes', () => {
    const head = cellAt(52, 50);
    const bodyCell = cellAt(51, 50);
    expect(head.classList.contains('snake-head')).toBe(true);
    expect(bodyCell.classList.contains('snake-body')).toBe(true);
    // No inline background colour on local cells.
    expect(head.style.backgroundColor).toBe('');
    expect(bodyCell.style.backgroundColor).toBe('');
  });

  it('adds is-dead class when the local game state is dead', () => {
    snake.gameState.set('dead');
    fixture.detectChanges();
    const playfield = fixture.nativeElement.querySelector('.playfield');
    expect(playfield.classList.contains('is-dead')).toBe(true);
  });

  it('renders two remote snakes with different background colours', () => {
    realtime.setRemotes([
      {
        connectionId: 'remote-A',
        segments: [{ col: 10, row: 10 }],
        direction: 'right',
        length: 1,
      },
      {
        connectionId: 'remote-B',
        segments: [{ col: 20, row: 20 }],
        direction: 'left',
        length: 1,
      },
    ]);
    fixture.detectChanges();

    const cellA = cellAt(10, 10);
    const cellB = cellAt(20, 20);
    expect(cellA.classList.contains('remote-snake')).toBe(true);
    expect(cellB.classList.contains('remote-snake')).toBe(true);
    expect(cellA.style.backgroundColor).not.toBe('');
    expect(cellB.style.backgroundColor).not.toBe('');
    expect(cellA.style.backgroundColor).not.toBe(cellB.style.backgroundColor);
  });

  it('keeps local rendering when a remote segment overlaps a local segment', () => {
    // Overlap the local snake head at (52, 50).
    realtime.setRemotes([
      {
        connectionId: 'remote-overlap',
        segments: [{ col: 52, row: 50 }],
        direction: 'left',
        length: 1,
      },
    ]);
    fixture.detectChanges();

    const cell = cellAt(52, 50);
    expect(cell.classList.contains('snake-head')).toBe(true);
    expect(cell.classList.contains('remote-snake')).toBe(false);
    expect(cell.style.backgroundColor).toBe('');
  });

  it('removes a remote snake from rendering after the player leaves', () => {
    realtime.setRemotes([
      {
        connectionId: 'remote-leaver',
        segments: [{ col: 30, row: 30 }],
        direction: 'right',
        length: 1,
      },
    ]);
    fixture.detectChanges();
    expect(cellAt(30, 30).classList.contains('remote-snake')).toBe(true);

    realtime.setRemotes([]);
    fixture.detectChanges();
    expect(cellAt(30, 30).classList.contains('remote-snake')).toBe(false);
    expect(cellAt(30, 30).style.backgroundColor).toBe('');
  });
});
