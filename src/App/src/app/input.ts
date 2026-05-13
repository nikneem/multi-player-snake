import { DOCUMENT } from '@angular/common';
import { DestroyRef, Injectable, afterNextRender, inject } from '@angular/core';
import { Direction } from './models/snake.model';
import { Snake } from './snake';

const KEY_MAP: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
};

@Injectable({ providedIn: 'root' })
export class Input {
  private readonly document = inject(DOCUMENT);
  private readonly snakeService = inject(Snake);
  private readonly destroyRef = inject(DestroyRef);

  private touchStartX = 0;
  private touchStartY = 0;

  constructor() {
    afterNextRender(() => {
      const onKeyDown = (event: KeyboardEvent) => {
        const dir = KEY_MAP[event.key];
        if (dir) {
          event.preventDefault();
          this.snakeService.changeDirection(dir);
        }
      };

      this.document.addEventListener('keydown', onKeyDown);
      this.destroyRef.onDestroy(() =>
        this.document.removeEventListener('keydown', onKeyDown),
      );
    });
  }

  registerPlayfieldElement(el: HTMLElement): void {
    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      this.touchStartX = e.changedTouches[0].clientX;
      this.touchStartY = e.changedTouches[0].clientY;
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const dx = e.changedTouches[0].clientX - this.touchStartX;
      const dy = e.changedTouches[0].clientY - this.touchStartY;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (Math.max(absDx, absDy) < 30) return;

      if (absDx >= absDy) {
        this.snakeService.changeDirection(dx > 0 ? 'right' : 'left');
      } else {
        this.snakeService.changeDirection(dy > 0 ? 'down' : 'up');
      }
    };

    el.addEventListener('touchstart', onTouchStart, { passive: false });
    el.addEventListener('touchend', onTouchEnd, { passive: false });

    this.destroyRef.onDestroy(() => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchend', onTouchEnd);
    });
  }
}

