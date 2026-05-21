import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  ViewChild,
} from '@angular/core';

interface Vertex {
  bx: number;
  by: number;
}

const GRID_SPACING = 80;
const LINE_COLOR = 'rgba(40, 40, 80, 0.6)';
const DOT_COLOR = 'rgba(120, 120, 220, 1)';
const GLOW_COLOR = 'rgba(100, 100, 255, 0.9)';
const DOT_RADIUS = 2;
const GLOW_BLUR = 12;

// Wave parameters — two layers for organic motion
const A1 = 14;
const A2 = 8;
const F1 = 0.018;
const F2 = 0.022;
const F3 = 0.013;
const F4 = 0.019;
const S1 = 0.22;
const S2 = 0.17;

@Component({
  selector: 'snk-wireframe-background',
  templateUrl: './wireframe-background.html',
  styleUrl: './wireframe-background.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WireframeBackground implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') private canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private grid: Vertex[][] = [];
  private rafId = 0;
  private cols = 0;
  private rows = 0;

  private readonly onResize = (): void => {
    this.resizeCanvas();
    this.buildGrid();
  };

  private readonly onVisibility = (): void => {
    if (document.visibilityState === 'hidden') {
      cancelAnimationFrame(this.rafId);
    } else {
      this.startLoop();
    }
  };

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();
    this.buildGrid();
    this.startLoop();

    window.addEventListener('resize', this.onResize);
    document.addEventListener('visibilitychange', this.onVisibility);
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibility);
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private buildGrid(): void {
    const canvas = this.canvasRef.nativeElement;
    this.cols = Math.ceil(canvas.width / GRID_SPACING) + 1;
    this.rows = Math.ceil(canvas.height / GRID_SPACING) + 1;
    this.grid = [];
    for (let r = 0; r < this.rows; r++) {
      const row: Vertex[] = [];
      for (let c = 0; c < this.cols; c++) {
        row.push({ bx: c * GRID_SPACING, by: r * GRID_SPACING });
      }
      this.grid.push(row);
    }
  }

  private getDisplacement(bx: number, by: number, t: number): number {
    return (
      A1 * Math.sin(bx * F1 + by * F2 + t * S1) +
      A2 * Math.sin(bx * F3 - by * F4 + t * S2)
    );
  }

  private drawFrame(t: number): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = this.ctx;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Precompute displaced positions
    const pts: { x: number; y: number }[][] = this.grid.map((row) =>
      row.map((v) => ({ x: v.bx, y: v.by + this.getDisplacement(v.bx, v.by, t) }))
    );

    ctx.shadowBlur = 0;
    ctx.strokeStyle = LINE_COLOR;
    ctx.lineWidth = 1;

    // Horizontal lines
    for (let r = 0; r < this.rows; r++) {
      ctx.beginPath();
      for (let c = 0; c < this.cols; c++) {
        const p = pts[r][c];
        if (c === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Vertical lines
    for (let c = 0; c < this.cols; c++) {
      ctx.beginPath();
      for (let r = 0; r < this.rows; r++) {
        const p = pts[r][c];
        if (r === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
    }

    // Glowing vertex dots
    ctx.shadowBlur = GLOW_BLUR;
    ctx.shadowColor = GLOW_COLOR;
    ctx.fillStyle = DOT_COLOR;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        const p = pts[r][c];
        ctx.beginPath();
        ctx.arc(p.x, p.y, DOT_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Reset shadow so it doesn't bleed into next frame's lines
    ctx.shadowBlur = 0;
  }

  private startLoop(): void {
    const loop = (): void => {
      this.drawFrame(performance.now() / 1000);
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }
}
