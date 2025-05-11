using System.Collections.Generic;
using System.Threading.Tasks;
using CUpido.DTOs;
namespace CUpido.Interfaces;
public interface IAdminService
{
    Task ChangeUserRoleAsync(int userId, string newRole);
    Task<IEnumerable<PhotoDTO>> GetPendingPhotosAsync();
    Task ApprovePhotoAsync(int photoId);
    Task RejectPhotoAsync(int photoId);
}
