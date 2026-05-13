import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Playfield } from './playfield/playfield';

@Component({
  selector: 'snk-root',
  imports: [Playfield],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
