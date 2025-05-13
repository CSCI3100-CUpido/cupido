// UserProfileDTO.cs
namespace API.DTOs
{
    public class UserProfileDTO
    {
        public string Id                { get; set; }
        public string Username          { get; set; }
        public string Email             { get; set; }
        public string PhotoUrl          { get; set; }
        public DateOnly? DateOfBirth    { get; set; }
        public string Gender            { get; set; }
        public IEnumerable<string> Interests { get; set; }
        public string City              { get; set; }
        public string Country           { get; set; }
        public string Bio               { get; set; }
        public bool   IsEmailVerified   { get; set; }
        public bool   IsProfileComplete { get; set; }
        public string Campus            { get; set; }
        public string Department        { get; set; }
        public int?   GraduationYear    { get; set; }
    }
}

// UpdateProfileDTO.cs
namespace API.DTOs
{
    public class UpdateProfileDTO
    {
        public string PhotoUrl        { get; set; }
        public DateOnly? DateOfBirth  { get; set; }
        public string Gender          { get; set; }
        public IEnumerable<string> Interests { get; set; }
        public string City            { get; set; }
        public string Country         { get; set; }
        public string Bio             { get; set; }
        public string Campus          { get; set; }
        public string Department      { get; set; }
        public int?   GraduationYear  { get; set; }
    }
}
