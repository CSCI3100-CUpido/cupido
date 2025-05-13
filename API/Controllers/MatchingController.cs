using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[Route("api/[controller]")]
public class MatchingController : BaseApiController
{
    private readonly IMatchingService _match;
    public MatchingController(IMatchingService match) => _match = match;

    [HttpGet("potential")]
    public async Task<ActionResult<IEnumerable<MatchedUserDTO>>> Potential()
        => Ok(await _match.GetPotentialMatchesAsync(User.GetUserId()));

    [HttpGet("matches")]
    public async Task<ActionResult<IEnumerable<MatchedUserDTO>>> Matches()
        => Ok(await _match.GetMatchesAsync(User.GetUserId()));

    [HttpGet("liked")]
    public async Task<ActionResult<IEnumerable<MatchedUserDTO>>> Liked()
        => Ok(await _match.GetLikedAsync(User.GetUserId()));

    [HttpGet("liked-by")]
    public async Task<ActionResult<IEnumerable<MatchedUserDTO>>> LikedBy()
        => Ok(await _match.GetLikedByAsync(User.GetUserId()));

    [HttpPost("like/{targetId}")]
    public async Task<ActionResult<LikeResultDTO>> LikeUser(string targetId)
        => Ok(await _match.LikeAsync(User.GetUserId(), targetId));

    [HttpDelete("like/{targetId}")]
    public async Task<IActionResult> UnlikeUser(string targetId)
    {
        await _match.UnlikeAsync(User.GetUserId(), targetId);
        return Ok();
    }

    // ----------- 偏好 ----------
    [HttpGet("preferences")]
    public async Task<ActionResult<MatchingPreferenceDTO>> GetPref()
        => Ok(await _match.GetPreferencesAsync(User.GetUserId()));

    [HttpPut("preferences")]
    public async Task<ActionResult<MatchingPreferenceDTO>> UpdatePref(MatchingPreferenceDTO dto)
        => Ok(await _match.UpdatePreferencesAsync(User.GetUserId(), dto));

    // ----------- 邮箱验证状态 (Admin or self) ----------
    [HttpPut("verify/{userId}")]
    public async Task<ActionResult<bool>> UpdateVerify(string userId, VerifyStatusDTO dto)
        => Ok(await _match.SetVerificationStatusAsync(User.GetUserId(), userId, dto.Verified));

    [HttpGet("verify/{userId}")]
    public async Task<ActionResult<bool>> CheckVerify(string userId)
        => Ok(await _match.IsVerifiedAsync(userId));

    // ----------- 推荐 ----------
    [HttpGet("recommended")]
    public async Task<ActionResult<IEnumerable<MatchedUserDTO>>> Recommended([FromQuery] int count = 10)
        => Ok(await _match.GetRecommendedAsync(User.GetUserId(), count));
}
