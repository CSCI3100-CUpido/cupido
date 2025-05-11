namespace CUpido.DTOs;
public class UserFilterDTO
{
    public string Gender { get; set; }
    public int? MinAge { get; set; }
    public int? MaxAge { get; set; }
    public string SortBy { get; set; } = "LastActive";
    public string SortOrder { get; set; } = "Desc";
}
