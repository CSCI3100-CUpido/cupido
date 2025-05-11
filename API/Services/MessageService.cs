using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using CUpido.Data;
using CUpido.DTOs;
using CUpido.Interfaces;
namespace CUpido.Services;
public class MessageService : IMessageService
{
    private readonly CUpidoContext _ctx;
    public MessageService(CUpidoContext ctx) => _ctx = ctx;
    public async Task<IEnumerable<MessageDTO>> GetMessagesAsync(int uid, string box)
    {
        var q = _ctx.Messages.Include(m => m.Sender).Include(m => m.Recipient).AsQueryable();
        q = box switch
        {
            "Inbox" => q.Where(m => m.RecipientId == uid && !m.DeletedByReceiver),
            "Outbox" => q.Where(m => m.SenderId == uid && !m.DeletedBySender),
            _ => q.Where(m => m.RecipientId == uid && !m.DeletedByReceiver && !m.IsRead)
        };
        return await q.OrderByDescending(m => m.MessageSent)
            .Select(m => new MessageDTO
            {
                Id = m.Id,
                SenderId = m.SenderId,
                SenderUsername = m.Sender.UserName,
                RecipientId = m.RecipientId,
                RecipientUsername = m.Recipient.UserName,
                Content = m.Content,
                MessageSent = m.MessageSent,
                IsRead = m.IsRead,
                ReadAt = m.ReadAt
            }).ToListAsync();
    }
}
