using System.Collections.Generic;
using System.Threading.Tasks;
using CUpido.DTOs;
namespace CUpido.Interfaces;
public interface IMessageService
{
    Task<IEnumerable<MessageDTO>> GetMessagesAsync(int userId, string box);
}
