[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MessagingController : ControllerBase
{
    private readonly IMessageService _svc;
    public MessagingController(IMessageService svc) => _svc = svc;
    [HttpGet("inbox")]
    public async Task<IEnumerable<MessageDTO>> Inbox() =>
        await _svc.GetMessagesAsync(User.GetUserId(), "Inbox");
    [HttpGet("outbox")]
    public async Task<IEnumerable<MessageDTO>> Outbox() =>
        await _svc.GetMessagesAsync(User.GetUserId(), "Outbox");
    [HttpGet("unread")]
    public async Task<IEnumerable<MessageDTO>> Unread() =>
        await _svc.GetMessagesAsync(User.GetUserId(), "Unread");
}
