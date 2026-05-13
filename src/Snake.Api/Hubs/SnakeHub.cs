using Microsoft.AspNetCore.SignalR;

namespace Snake.Api.Hubs;

public class SnakeHub : Hub
{
    public async Task PublishState(SnakeStateMessage message)
    {
        // Overwrite the connection ID server-side so clients cannot spoof another player's ID
        var authoritative = message with { ConnectionId = Context.ConnectionId };
        await Clients.Others.SendAsync("SnakeState", authoritative);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Clients.All.SendAsync("PlayerLeft", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
