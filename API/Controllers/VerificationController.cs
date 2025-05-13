using API.DTOs;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
public class VerificationController : BaseApiController
{
    private readonly IVerificationService _ver;
    public VerificationController(IVerificationService ver) => _ver = ver;

    // POST /verification/send-code
    [HttpPost("send-code")]
    public async Task<ActionResult> SendCode(EmailDTO dto)
    {
        await _ver.SendCodeAsync(dto.Email);
        return Ok(new { success = true });
    }

    // POST /verification/verify-code
    [HttpPost("verify-code")]
    public async Task<ActionResult<VerificationResultDTO>> VerifyCode(VerifyCodeDTO dto)
        => Ok(await _ver.VerifyCodeAsync(dto.Email, dto.Code));

    // GET /verification/status/{email}
    [HttpGet("status/{email}")]
    public async Task<ActionResult<bool>> Status(string email)
        => Ok(await _ver.IsVerifiedAsync(email));
}
