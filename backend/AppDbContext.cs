using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Member> Members => Set<Member>();
    public DbSet<Course> Courses => Set<Course>();
    public DbSet<Lesson> Lessons => Set<Lesson>();
    public DbSet<Enrollment> Enrollments => Set<Enrollment>();
    public DbSet<Progress> Progresses => Set<Progress>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Member
        modelBuilder.Entity<Member>(e =>
        {
            e.ToTable("member");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Username).HasColumnName("username").HasMaxLength(50);
            e.Property(x => x.Password).HasColumnName("password").HasMaxLength(255);
        });

        // Course
        modelBuilder.Entity<Course>(e =>
        {
            e.ToTable("course");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.Title).HasColumnName("title").HasMaxLength(255);
            e.Property(x => x.Description).HasColumnName("description");
            e.Property(x => x.CreatedBy).HasColumnName("created_by");

            // Course → Member (created_by)
            e.HasOne(x => x.Creator)
             .WithMany(x => x.Courses)
             .HasForeignKey(x => x.CreatedBy)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Lesson
        modelBuilder.Entity<Lesson>(e =>
        {
            e.ToTable("lesson");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.CourseId).HasColumnName("course_id");
            e.Property(x => x.Title).HasColumnName("title").HasMaxLength(255);
            e.Property(x => x.Content).HasColumnName("content");
            e.Property(x => x.VideoUrl).HasColumnName("video_url").HasMaxLength(255);

            // Lesson → Course
            e.HasOne(x => x.Course)
             .WithMany(x => x.Lessons)
             .HasForeignKey(x => x.CourseId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Enrollment
        modelBuilder.Entity<Enrollment>(e =>
        {
            e.ToTable("enrollment");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.MemberId).HasColumnName("member_id");
            e.Property(x => x.CourseId).HasColumnName("course_id");
            e.Property(x => x.EnrolledAt).HasColumnName("enrolled_at");

            // Enrollment → Member
            e.HasOne(x => x.Member)
             .WithMany(x => x.Enrollments)
             .HasForeignKey(x => x.MemberId)
             .OnDelete(DeleteBehavior.Cascade);

            // Enrollment → Course
            e.HasOne(x => x.Course)
             .WithMany(x => x.Enrollments)
             .HasForeignKey(x => x.CourseId)
             .OnDelete(DeleteBehavior.Cascade);
        });

        // Progress
        modelBuilder.Entity<Progress>(e =>
        {
            e.ToTable("progress");
            e.HasKey(x => x.Id);
            e.Property(x => x.Id).HasColumnName("id");
            e.Property(x => x.MemberId).HasColumnName("member_id");
            e.Property(x => x.LessonId).HasColumnName("lesson_id");
            e.Property(x => x.IsCompleted).HasColumnName("is_completed");
            e.Property(x => x.CompletedAt).HasColumnName("completed_at");

            // Progress → Member
            e.HasOne(x => x.Member)
             .WithMany(x => x.Progresses)
             .HasForeignKey(x => x.MemberId)
             .OnDelete(DeleteBehavior.Cascade);

            // Progress → Lesson
            e.HasOne(x => x.Lesson)
             .WithMany(x => x.Progresses)
             .HasForeignKey(x => x.LessonId)
             .OnDelete(DeleteBehavior.Cascade);
        });
    }
}