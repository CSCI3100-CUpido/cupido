using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using CUpido.Interfaces;
using CUpido.Data;
namespace CUpido.Services;
public class UserTrackingService : IUserTrackingService
{
    private readonly ConcurrentDictionary<int, DateTime> _online = new();
    private readonly CUpidoContext _ctx;
    public UserTrackingService(CUpidoContext ctx) => _ctx = ctx;
    public void MarkOnline(int id) => _online[id] = DateTime.UtcNow;
    public void MarkOffline(int id)
    {
        _online.TryRemove(id, out _);
        var u = _ctx.Users.Find(id);
        if (u != null)
        {
            u.LastActive = DateTime.UtcNow;
            _ctx.SaveChanges();
        }
    }
    public bool IsOnline(int id) => _online.ContainsKey(id);
    public IEnumerable<int> GetOnlineUsers() => _online.Keys;
}
