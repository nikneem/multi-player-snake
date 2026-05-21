using Microsoft.AspNetCore.SignalR;

namespace Snake.Api.Hubs;

/// <summary>
/// SignalR hub at <c>/hubs/snake</c> that relays snake-state messages between players.
/// The hub is intentionally a thin broadcaster — it never trusts a client-supplied
/// <see cref="SnakeStateMessage.ConnectionId"/> and instead stamps the server-known
/// <see cref="HubCallerContext.ConnectionId"/> on every outbound message.
/// Spec: <c>openspec/changes/add-multiplayer-signalr/specs/multiplayer-realtime/spec.md</c>.
/// </summary>
public class SnakeHub : Hub
{
    /// <summary>
    /// Broadcasts the caller's snake state to all OTHER connected clients via a
    /// <c>SnakeState</c> event. The caller itself does not receive its own message.
    /// </summary>
    public async Task PublishState(SnakeStateMessage message)
    {
        // Overwrite the connection ID server-side so clients cannot spoof another player's ID
        var authoritative = message with { ConnectionId = Context.ConnectionId };
        await Clients.Others.SendAsync("SnakeState", authoritative);
    }

    /// <summary>
    /// Notifies all remaining clients that a player has left, so they can remove
    /// the departing player's snake from their playfield.
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await Clients.All.SendAsync("PlayerLeft", Context.ConnectionId);
        await base.OnDisconnectedAsync(exception);
    }
}
