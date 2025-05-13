using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
[Route("api/users/{userId}/[controller]")]
public class ProfileController : BaseApiController
{
    private readonly IUserProfileService _profiles;
    public ProfileController(IUserProfileService profiles) => _profiles = profiles;

    // GET /users/{userId}/profile
    [HttpGet]
    public async Task<ActionResult<UserProfileDTO>> Get(string userId)
        => Ok(await _profiles.GetAsync(userId, User.GetUserId()));

    // PUT /users/{userId}/profile
    [HttpPut]
    public async Task<ActionResult<UserProfileDTO>> Update(string userId, UpdateProfileDTO dto)
        => Ok(await _profiles.UpdateAsync(userId, User.GetUserId(), dto));

    // GET /users/{userId}/profile/complete
    [HttpGet("complete")]
    public async Task<ActionResult<bool>> IsComplete(string userId)
        => Ok(await _profiles.IsCompleteAsync(userId));

    // GET /users/{userId}/profile/steps
    [HttpGet("steps")]
    public async Task<ActionResult<IEnumerable<string>>> Steps(string userId)
        => Ok(await _profiles.GetCompletionStepsAsync(userId));
}
