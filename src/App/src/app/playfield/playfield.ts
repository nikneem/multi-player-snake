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

  constructor() {
    afterNextRender(() => {
      this.inputService.registerPlayfieldElement(
        this.elementRef.nativeElement,
      );
    });
  }
}

