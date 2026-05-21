import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  computed,
  inject,
} from '@angular/core';
import { Input } from '../input';
import { Snake } from '../snake';
import { RealtimeService } from '../services/realtime.service';

@Component({
  selector: 'snk-playfield',
  imports: [],
  templateUrl: './playfield.html',
  styleUrl: './playfield.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Playfield {
  private readonly snakeService = inject(Snake);
  private readonly inputService = inject(Input);
  private readonly elementRef = inject(ElementRef);
  private readonly realtimeService = inject(RealtimeService);

  readonly cells = Array.from({ length: 10_000 }, (_, i) => i);

  readonly headIndex = computed(() => {
    const h = this.snakeService.segments()[0];
    return h ? h.row * 100 + h.col : -1;
  });

  readonly bodyIndices = computed(
    () =>
      new Set(
        this.snakeService
          .segments()
          .slice(1)
          .map((s) => s.row * 100 + s.col),
      ),
  );

  readonly foodIndex = computed(() => {
    const f = this.snakeService.foodPosition();
    return f ? f.row * 100 + f.col : -1;
  });

  readonly isDead = computed(() => this.snakeService.gameState() === 'dead');

  readonly remoteSegmentColors = computed<Map<number, string>>(() => {
    const localOccupied = new Set<number>([
      this.headIndex(),
      ...this.bodyIndices(),
    ]);
    const colors = this.realtimeService.remoteColors();
    const map = new Map<number, string>();
    for (const [connectionId, state] of this.realtimeService.remoteSnakes()) {
      const color = colors.get(connectionId);
      if (!color) continue;
      for (const seg of state.segments) {
        const index = seg.row * 100 + seg.col;
        // Local rendering always wins over remote colouring.
        if (localOccupied.has(index)) continue;
        // First writer wins for overlapping remotes — order is insertion order.
        if (!map.has(index)) {
          map.set(index, color);
        }
      }
    }
    return map;
  });

  constructor() {
    afterNextRender(() => {
      this.inputService.registerPlayfieldElement(
        this.elementRef.nativeElement,
      );
    });
  }
}

