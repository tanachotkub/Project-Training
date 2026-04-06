public class Enrollment
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int CourseId { get; set; }
    public DateTime EnrolledAt { get; set; } = DateTime.UtcNow;

    // Navigation Properties
    public Member? Member { get; set; }
    public Course? Course { get; set; }
}