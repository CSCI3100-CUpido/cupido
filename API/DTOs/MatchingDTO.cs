// MatchingPreferenceDTO.cs
namespace API.DTOs
{
    public class MatchingPreferenceDTO
    {
        public int MinAge               { get; set; }
        public int MaxAge               { get; set; }
        public IEnumerable<string> GenderPreference { get; set; }
        public IEnumerable<string> Interests        { get; set; }
        public IEnumerable<string> CampusPreference { get; set; }
    }
}

// MatchedUserDTO.cs
namespace API.DTOs
{
    public class MatchedUserDTO
    {
        public string Id                 { get; set; }
        public string Username           { get; set; }
        public int    Age                { get; set; }
        public string PhotoUrl           { get; set; }
        public string Bio                { get; set; }
        public string City               { get; set; }
        public string Campus             { get; set; }
        public IEnumerable<string> Interests { get; set; }
        public bool   IsOnline           { get; set; }
        public DateTime? LastActive      { get; set; }
        public int    CompatibilityScore { get; set; }
        public IEnumerable<string> MatchingInterests { get; set; }
        public bool?  IsLiked            { get; set; }
    }
}

// LikeResultDTO.cs
namespace API.DTOs
{
    public record LikeResultDTO(bool IsMatch);
}

// VerifyStatusDTO.cs
namespace API.DTOs
{
    public record VerifyStatusDTO(bool Verified);
}
