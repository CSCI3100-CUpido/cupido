using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CUpido.Data;
using CUpido.DTOs;
using CUpido.Entities;
using CUpido.Interfaces;
namespace CUpido.Services;
public class LikeService : ILikeService
{
    private readonly CUpidoContext _ctx;
    public LikeService(CUpidoContext ctx) => _ctx = ctx;
    public async Task AddLikeAsync(int uid, int tid)
    {
        if (uid == tid) return;
        if (await _ctx.Likes.FindAsync(uid, tid) != null) return;
        _ctx.Likes.Add(new Like { LikerId = uid, LikeeId = tid });
        await _ctx.SaveChangesAsync();
    }
    public async Task<IEnumerable<UserDTO>> GetLikedUsersAsync(int uid) =>
        await _ctx.Likes.Where(l => l.LikerId == uid)
            .Select(l => l.Likee)
            .Select(u => new UserDTO
            {
                Id = u.Id,
                Username = u.UserName,
                Age = u.GetAge(),
                Gender = u.Gender,
                PhotoUrl = u.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                LastActive = u.LastActive
            }).ToListAsync();
    public async Task<IEnumerable<UserDTO>> GetLikedByUsersAsync(int uid) =>
        await _ctx.Likes.Where(l => l.LikeeId == uid)
            .Select(l => l.Liker)
            .Select(u => new UserDTO
            {
                Id = u.Id,
                Username = u.UserName,
                Age = u.GetAge(),
                Gender = u.Gender,
                PhotoUrl = u.Photos.FirstOrDefault(p => p.IsMain)?.Url,
                LastActive = u.LastActive
            }).ToListAsync();
}
