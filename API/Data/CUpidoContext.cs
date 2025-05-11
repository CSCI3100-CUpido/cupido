using Microsoft.EntityFrameworkCore;
using CUpido.Entities;
namespace CUpido.Data;
public class CUpidoContext : DbContext
{
    public CUpidoContext(DbContextOptions<CUpidoContext> o) : base(o) { }
    public DbSet<AppUser> Users { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Like> Likes { get; set; }
    protected override void OnModelCreating(ModelBuilder b)
    {
        b.Entity<Message>().HasOne(m => m.Sender).WithMany(u => u.MessagesSent).HasForeignKey(m => m.SenderId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Message>().HasOne(m => m.Recipient).WithMany(u => u.MessagesReceived).HasForeignKey(m => m.RecipientId).OnDelete(DeleteBehavior.Restrict);
        b.Entity<Like>().HasKey(k => new { k.LikerId, k.LikeeId });
        b.Entity<Like>().HasOne(l => l.Liker).WithMany(u => u.LikesGiven).HasForeignKey(l => l.LikerId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<Like>().HasOne(l => l.Likee).WithMany(u => u.LikesReceived).HasForeignKey(l => l.LikeeId).OnDelete(DeleteBehavior.Cascade);
        b.Entity<Photo>().HasOne(p => p.AppUser).WithMany(u => u.Photos).HasForeignKey(p => p.AppUserId).OnDelete(DeleteBehavior.Cascade);
    }
}
