using System.Collections.Generic;
namespace CUpido.Interfaces;
public interface IUserTrackingService
{
    void MarkOnline(int userId);
    void MarkOffline(int userId);
    bool IsOnline(int userId);
    IEnumerable<int> GetOnlineUsers();
}
