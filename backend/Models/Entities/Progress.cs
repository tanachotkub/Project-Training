public class Progress
{
    public int Id { get; set; }
    public int MemberId { get; set; }
    public int LessonId { get; set; }
    public bool IsCompleted { get; set; } = false;
    public DateTime? CompletedAt { get; set; }

    // Navigation Properties
    public Member? Member { get; set; }
    public Lesson? Lesson { get; set; }
}