using API.DTOs;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
public class ConfessionsController : BaseApiController
{
    private readonly IConfessionService _svc;
    public ConfessionsController(IConfessionService svc) => _svc = svc;

    // GET /confessions
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ConfessionDTO>>> GetAll()
        => Ok(await _svc.GetConfessionsAsync());

    // GET /confessions/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<ConfessionDTO>> Get(string id)
        => Ok(await _svc.GetConfessionAsync(id));

    // POST /confessions
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<ConfessionDTO>> Create(CreateConfessionDTO dto)
        => Ok(await _svc.CreateConfessionAsync(User.GetUserId(), dto));

    // POST /confessions/{id}/like
    [Authorize]
    [HttpPost("{id}/like")]
    public async Task<IActionResult> Like(string id)
    {
        await _svc.LikeAsync(User.GetUserId(), id);
        return Ok();
    }

    // DELETE /confessions/{id}/like
    [Authorize]
    [HttpDelete("{id}/like")]
    public async Task<IActionResult> Unlike(string id)
    {
        await _svc.UnlikeAsync(User.GetUserId(), id);
        return Ok();
    }

    // GET /confessions/{id}/comments
    [HttpGet("{id}/comments")]
    public async Task<ActionResult<IEnumerable<ConfessionCommentDTO>>> GetComments(string id)
        => Ok(await _svc.GetCommentsAsync(id));

    // POST /confessions/{id}/comments
    [Authorize]
    [HttpPost("{id}/comments")]
    public async Task<ActionResult<ConfessionCommentDTO>> AddComment(string id, AddCommentDTO dto)
        => Ok(await _svc.AddCommentAsync(User.GetUserId(), id, dto));

    // POST /confessions/{id}/message
    [Authorize]
    [HttpPost("{id}/message")]
    public async Task<ActionResult<ChatIdDTO>> SendPrivateMessage(string id)
        => Ok(await _svc.StartPrivateChatAsync(User.GetUserId(), id));
}
