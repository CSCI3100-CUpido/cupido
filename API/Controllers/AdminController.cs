[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly IAdminService _svc;
    public AdminController(IAdminService svc) => _svc = svc;
    [HttpPut("user-role")]
    public async Task<IActionResult> ChangeRole(RoleUpdateDTO d)
    {
        await _svc.ChangeUserRoleAsync(d.UserId, d.NewRole);
        return NoContent();
    }
    [HttpGet("pending-photos")]
    public async Task<IEnumerable<PhotoDTO>> Pending() =>
        await _svc.GetPendingPhotosAsync();
    [HttpPost("photo-moderation")]
    public async Task<IActionResult> Moderate(PhotoModerationDTO d)
    {
        if (d.Approve) await _svc.ApprovePhotoAsync(d.PhotoId);
        else await _svc.RejectPhotoAsync(d.PhotoId);
        return Ok();
    }
}
