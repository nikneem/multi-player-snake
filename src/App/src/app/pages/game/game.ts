import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { Playfield } from '../../playfield/playfield';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'snk-game',
  imports: [Playfield],
  templateUrl: './game.html',
  styleUrl: './game.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Game implements OnInit {
  private readonly healthService = inject(HealthService);

  ngOnInit(): void {
    this.healthService.check().subscribe({
      next: () => console.log('[snake] Backend healthy'),
      error: (err) => console.warn('[snake] Backend health check failed:', err),
    });
  }
}
