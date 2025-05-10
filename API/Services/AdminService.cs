using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CUpido.Data;
using CUpido.DTOs;
using CUpido.Interfaces;
namespace CUpido.Services;
public class AdminService : IAdminService
{
    private readonly CUpidoContext _ctx;
    private readonly ICloudinaryService _cloud;
    public AdminService(CUpidoContext ctx, ICloudinaryService cloud)
    {
        _ctx = ctx;
        _cloud = cloud;
    }
    public async Task ChangeUserRoleAsync(int id, string role)
    {
        var u = await _ctx.Users.FindAsync(id);
        if (u == null) return;
        u.Role = role;
        await _ctx.SaveChangesAsync();
    }
    public async Task<IEnumerable<PhotoDTO>> GetPendingPhotosAsync() =>
        await _ctx.Photos.Where(p => !p.IsApproved)
            .Select(p => new PhotoDTO { Id = p.Id, Url = p.Url, Username = p.AppUser.UserName })
            .ToListAsync();
    public async Task ApprovePhotoAsync(int pid)
    {
        var p = await _ctx.Photos.FindAsync(pid);
        if (p == null) return;
        p.IsApproved = true;
        await _ctx.SaveChangesAsync();
    }
    public async Task RejectPhotoAsync(int pid)
    {
        var p = await _ctx.Photos.FindAsync(pid);
        if (p == null) return;
        await _cloud.DeleteAsync(p.Url);
        _ctx.Photos.Remove(p);
        await _ctx.SaveChangesAsync();
    }
}
