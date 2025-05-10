[Authorize]
[ApiController]
[Route("api/[controller]")]
public class LikeController : ControllerBase
{
    private readonly ILikeService _svc;
    public LikeController(ILikeService svc) => _svc = svc;
    [HttpPost("{targetId}")]
    public async Task<IActionResult> AddLike(int targetId)
    {
        await _svc.AddLikeAsync(User.GetUserId(), targetId);
        return Ok();
    }
    [HttpGet("liked")]
    public async Task<IEnumerable<UserDTO>> Liked() =>
        await _svc.GetLikedUsersAsync(User.GetUserId());
    [HttpGet("liked-by")]
    public async Task<IEnumerable<UserDTO>> LikedBy() =>
        await _svc.GetLikedByUsersAsync(User.GetUserId());
}
