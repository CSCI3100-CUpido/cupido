using System.Collections.Generic;
using System.Threading.Tasks;
using CUpido.DTOs;
namespace CUpido.Interfaces;
public interface ILikeService
{
    Task AddLikeAsync(int userId, int targetId);
    Task<IEnumerable<UserDTO>> GetLikedUsersAsync(int userId);
    Task<IEnumerable<UserDTO>> GetLikedByUsersAsync(int userId);
}
