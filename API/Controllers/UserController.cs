[HttpGet]
public async Task<ActionResult<IEnumerable<UserDTO>>> GetUsers([FromQuery] UserFilterDTO f)
{
    var users = await _userService.GetUsersAsync(f);
    return Ok(users);
}
