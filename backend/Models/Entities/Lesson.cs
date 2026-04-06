public class Lesson
{
    public int Id { get; set; }
    public int CourseId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Content { get; set; }
    public string? VideoUrl { get; set; }

    // Navigation Properties
    public Course? Course { get; set; }
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
}