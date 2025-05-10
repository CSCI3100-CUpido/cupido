using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using CUpido.Interfaces;
namespace CUpido.Hubs;
public class UserHub : Hub
{
    private readonly IUserTrackingService _svc;
    public UserHub(IUserTrackingService svc) => _svc = svc;
    public override Task OnConnectedAsync()
    {
        _svc.MarkOnline(int.Parse(Context.UserIdentifier));
        Clients.Others.SendAsync("UserOnline", Context.UserIdentifier);
        return base.OnConnectedAsync();
    }
    public override Task OnDisconnectedAsync(System.Exception e)
    {
        _svc.MarkOffline(int.Parse(Context.UserIdentifier));
        Clients.Others.SendAsync("UserOffline", Context.UserIdentifier);
        return base.OnDisconnectedAsync(e);
    }
}
