namespace Snake.Api.Hubs;

public record SnakeStateMessage(
    string ConnectionId,
    SnakeSegment[] Segments,
    string Direction,
    int Length
);

public record SnakeSegment(int Col, int Row);
