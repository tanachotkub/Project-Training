// public class Member
// {
//     public int Id { get; set; }
//     public string? Username { get; set; }
//     public string? Password { get; set; }
// }


public class Member
{
    public int Id { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }

    // Navigation Properties
    public ICollection<Course> Courses { get; set; } = new List<Course>();
    public ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();
}