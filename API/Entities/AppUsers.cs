using System;
using System.Collections.Generic;
namespace CUpido.Entities;
public class AppUser
{
    public int Id { get; set; }
    public string UserName { get; set; }
    public string Gender { get; set; }
    public DateTime DateOfBirth { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string Role { get; set; } = "Member";
    public ICollection<Photo> Photos { get; set; }
    public ICollection<Message> MessagesSent { get; set; }
    public ICollection<Message> MessagesReceived { get; set; }
    public ICollection<Like> LikesGiven { get; set; }
    public ICollection<Like> LikesReceived { get; set; }
    public int GetAge() => (int)((DateTime.UtcNow - DateOfBirth).TotalDays / 365.25);
}
