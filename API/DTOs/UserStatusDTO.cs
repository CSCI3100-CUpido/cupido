using System;
namespace CUpido.DTOs;
public class UserStatusDTO
{
    public int UserId { get; set; }
    public bool IsOnline { get; set; }
    public DateTime LastActive { get; set; }
}
