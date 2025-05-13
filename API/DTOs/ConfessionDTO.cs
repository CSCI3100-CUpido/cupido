// ConfessionDTO.cs
namespace API.DTOs
{
    public class ConfessionDTO
    {
        public string Id           { get; set; }
        public string UserId       { get; set; }
        public string Content      { get; set; }
        public string ImageUrl     { get; set; }
        public DateTime CreatedAt  { get; set; }
        public bool   IsAnonymous  { get; set; }
        public string AuthorName   { get; set; }   // null if anonymous
        public string AuthorPhoto  { get; set; }
        public int    LikesCount   { get; set; }
        public bool?  IsLiked      { get; set; }   // null when not logged‑in
        public int    CommentsCount{ get; set; }
        public bool?  IsOwner      { get; set; }
    }
}

// CreateConfessionDTO.cs
namespace API.DTOs
{
    public class CreateConfessionDTO
    {
        public string Content     { get; set; }
        public bool   IsAnonymous { get; set; } = false;
        public string? ImageUrl   { get; set; }
    }
}

// ConfessionCommentDTO.cs
namespace API.DTOs
{
    public class ConfessionCommentDTO
    {
        public string Id          { get; set; }
        public string ConfessionId{ get; set; }
        public string UserId      { get; set; }
        public string Content     { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool   IsAnonymous { get; set; }
        public string AuthorName  { get; set; }
        public string AuthorPhoto { get; set; }
        public bool?  IsOwner     { get; set; }
    }
}

// AddCommentDTO.cs
namespace API.DTOs
{
    public class AddCommentDTO
    {
        public string Content     { get; set; }
        public bool   IsAnonymous { get; set; }
    }
}

// ChatIdDTO.cs
namespace API.DTOs
{
    public record ChatIdDTO(string ChatId);
}
