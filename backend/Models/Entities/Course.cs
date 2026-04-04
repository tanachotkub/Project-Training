public class Course
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int CreatedBy { get; set; }

    // Navigation Properties
    public Member? Creator { get; set; }
    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}