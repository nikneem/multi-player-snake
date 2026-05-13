import { Direction, SnakeSegment } from './snake.model';

export interface SnakeStateMessage {
  connectionId: string;
  segments: SnakeSegment[];
  direction: Direction;
  length: number;
}
