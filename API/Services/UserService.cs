using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CUpido.Data;
using CUpido.DTOs;
using CUpido.Interfaces;
namespace CUpido.Services;
public class UserService : IUserService
{
    private readonly CUpidoContext _ctx;
    public UserService(CUpidoContext ctx) => _ctx = ctx;
    public async Task<IEnumerable<UserDTO>> GetUsersAsync(UserFilterDTO f)
    {
        var q = _ctx.Users.AsQueryable();
        if (!string.IsNullOrEmpty(f.Gender)) q = q.Where(x => x.Gender == f.Gender);
        if (f.MinAge.HasValue) q = q.Where(x => x.DateOfBirth <= DateTime.UtcNow.AddYears(-f.MinAge.Value));
        if (f.MaxAge.HasValue) q = q.Where(x => x.DateOfBirth >= DateTime.UtcNow.AddYears(-f.MaxAge.Value - 1));
        q = (f.SortBy, f.SortOrder.ToLower()) switch
        {
            ("Created", "asc") => q.OrderBy(x => x.Created),
            ("Created", _) => q.OrderByDescending(x => x.Created),
            ("LastActive", "asc") => q.OrderBy(x => x.LastActive),
            _ => q.OrderByDescending(x => x.LastActive)
        };
        return await q.Select(x => new UserDTO
        {
            Id = x.Id,
            Username = x.UserName,
            Age = x.GetAge(),
            Gender = x.Gender,
            PhotoUrl = x.Photos.FirstOrDefault(p => p.IsMain)?.Url,
            LastActive = x.LastActive
        }).ToListAsync();
    }
}
