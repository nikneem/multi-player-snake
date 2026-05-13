import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Playfield } from '../../playfield/playfield';

@Component({
  selector: 'snk-game',
  imports: [Playfield],
  templateUrl: './game.html',
  styleUrl: './game.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Game {}
