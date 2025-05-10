using System.Collections.Generic;
using System.Threading.Tasks;
using CUpido.DTOs;
namespace CUpido.Interfaces;
public interface IUserService
{
    Task<IEnumerable<UserDTO>> GetUsersAsync(UserFilterDTO filter);
}
