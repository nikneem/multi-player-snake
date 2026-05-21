import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WireframeBackground } from './wireframe-background/wireframe-background';

@Component({
  selector: 'snk-root',
  imports: [RouterOutlet, WireframeBackground],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}

