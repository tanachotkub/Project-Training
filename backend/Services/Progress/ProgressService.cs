using Microsoft.EntityFrameworkCore;

public class ProgressService : IProgressService
{
    private readonly AppDbContext _db;

    public ProgressService(AppDbContext db) => _db = db;

    public async Task<ProgressDto> MarkAsync(int memberId, MarkProgressDto dto)
    {
        // เช็คว่า lesson มีอยู่จริง
        var lesson = await _db.Lessons.FindAsync(dto.LessonId);
        if (lesson == null)
            throw new Exception($"Lesson id {dto.LessonId} not found");

        // เช็คว่า member ลงทะเบียน course นี้แล้วหรือยัง
        var enrolled = await _db.Enrollments
            .AnyAsync(e => e.MemberId == memberId && e.CourseId == lesson.CourseId);

        if (!enrolled)
            throw new Exception("You are not enrolled in this course");

        // หา progress ที่มีอยู่แล้ว หรือสร้างใหม่
        var progress = await _db.Progresses
            .FirstOrDefaultAsync(p =>
                p.MemberId == memberId &&
                p.LessonId == dto.LessonId);

        if (progress == null)
        {
            // สร้างใหม่
            progress = new Progress
            {
                MemberId = memberId,
                LessonId = dto.LessonId,
                IsCompleted = dto.IsCompleted,
                CompletedAt = dto.IsCompleted ? DateTime.UtcNow : null
            };
            _db.Progresses.Add(progress);
        }
        else
        {
            // อัปเดตของเดิม
            progress.IsCompleted = dto.IsCompleted;
            progress.CompletedAt = dto.IsCompleted ? DateTime.UtcNow : null;
        }

        await _db.SaveChangesAsync();

        return new ProgressDto(
            progress.Id,
            progress.MemberId,
            progress.LessonId,
            lesson.Title,
            progress.IsCompleted,
            progress.CompletedAt
        );
    }

    public async Task<CourseProgressDto> GetCourseProgressAsync(int memberId, int courseId)
    {
        // เช็คว่า course มีอยู่จริง
        var course = await _db.Courses
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == courseId);

        if (course == null)
            throw new Exception($"Course id {courseId} not found");

        // เช็คว่า member ลงทะเบียนแล้ว
        var enrolled = await _db.Enrollments
            .AnyAsync(e => e.MemberId == memberId && e.CourseId == courseId);

        if (!enrolled)
            throw new Exception("You are not enrolled in this course");

        var lessonIds = course.Lessons.Select(l => l.Id).ToList();

        // ดึง progress ทั้งหมดของ member ใน course นี้
        var progresses = await _db.Progresses
            .Where(p => p.MemberId == memberId && lessonIds.Contains(p.LessonId))
            .ToListAsync();

        var lessonDtos = course.Lessons.Select(l =>
        {
            var p = progresses.FirstOrDefault(p => p.LessonId == l.Id);
            return new ProgressDto(
                p?.Id ?? 0,
                memberId,
                l.Id,
                l.Title,
                p?.IsCompleted ?? false,
                p?.CompletedAt
            );
        }).ToList();

        var totalLessons = course.Lessons.Count;
        var completedLessons = lessonDtos.Count(l => l.IsCompleted);
        var percent = totalLessons == 0
            ? 0
            : Math.Round((double)completedLessons / totalLessons * 100, 2);

        return new CourseProgressDto(
            course.Id,
            course.Title,
            totalLessons,
            completedLessons,
            percent,
            lessonDtos
        );
    }

    public async Task<List<CourseProgressDto>> GetMyProgressAsync(int memberId)
    {
        // ดึง course ทั้งหมดที่ member ลงทะเบียน
        var enrollments = await _db.Enrollments
            .Include(e => e.Course)
                .ThenInclude(c => c!.Lessons)
            .Where(e => e.MemberId == memberId)
            .ToListAsync();

        var result = new List<CourseProgressDto>();

        foreach (var enrollment in enrollments)
        {
            var course = enrollment.Course!;
            var lessonIds = course.Lessons.Select(l => l.Id).ToList();

            var progresses = await _db.Progresses
                .Where(p => p.MemberId == memberId && lessonIds.Contains(p.LessonId))
                .ToListAsync();

            var lessonDtos = course.Lessons.Select(l =>
            {
                var p = progresses.FirstOrDefault(p => p.LessonId == l.Id);
                return new ProgressDto(
                    p?.Id ?? 0,
                    memberId,
                    l.Id,
                    l.Title,
                    p?.IsCompleted ?? false,
                    p?.CompletedAt
                );
            }).ToList();

            var totalLessons = course.Lessons.Count;
            var completedLessons = lessonDtos.Count(l => l.IsCompleted);
            var percent = totalLessons == 0
                ? 0
                : Math.Round((double)completedLessons / totalLessons * 100, 2);

            result.Add(new CourseProgressDto(
                course.Id,
                course.Title,
                totalLessons,
                completedLessons,
                percent,
                lessonDtos
            ));
        }

        return result;
    }
}