using Microsoft.EntityFrameworkCore;

public class LessonService : ILessonService
{
    private readonly AppDbContext _db;

    public LessonService(AppDbContext db) => _db = db;

    public async Task<List<LessonDto>> GetByCourseIdAsync(int courseId)
    {
        // เช็คว่า course มีอยู่จริง
        var course = await _db.Courses.FindAsync(courseId);
        if (course == null)
            throw new Exception($"Course id {courseId} not found");

        return await _db.Lessons
            .Where(l => l.CourseId == courseId)
            .Select(l => new LessonDto(
                l.Id,
                l.CourseId,
                l.Title,
                l.Content,
                l.VideoUrl
            ))
            .ToListAsync();
    }

    public async Task<LessonDto> GetByIdAsync(int id)
    {
        var lesson = await _db.Lessons.FindAsync(id);

        if (lesson == null)
            throw new Exception($"Lesson id {id} not found");

        return new LessonDto(
            lesson.Id,
            lesson.CourseId,
            lesson.Title,
            lesson.Content,
            lesson.VideoUrl
        );
    }

    public async Task<LessonDto> CreateAsync(int courseId, CreateLessonDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new Exception("Title is required");

        // เช็คว่า course มีอยู่จริง
        var course = await _db.Courses.FindAsync(courseId);
        if (course == null)
            throw new Exception($"Course id {courseId} not found");

        var lesson = new Lesson
        {
            CourseId = courseId,
            Title = dto.Title,
            Content = dto.Content,
            VideoUrl = dto.VideoUrl
        };

        _db.Lessons.Add(lesson);
        await _db.SaveChangesAsync();

        return new LessonDto(
            lesson.Id,
            lesson.CourseId,
            lesson.Title,
            lesson.Content,
            lesson.VideoUrl
        );
    }

    public async Task<LessonDto> UpdateAsync(int id, UpdateLessonDto dto)
    {
        var lesson = await _db.Lessons.FindAsync(id);

        if (lesson == null)
            throw new Exception($"Lesson id {id} not found");

        if (!string.IsNullOrWhiteSpace(dto.Title))
            lesson.Title = dto.Title;

        if (dto.Content != null)
            lesson.Content = dto.Content;

        if (dto.VideoUrl != null)
            lesson.VideoUrl = dto.VideoUrl;

        await _db.SaveChangesAsync();

        return new LessonDto(
            lesson.Id,
            lesson.CourseId,
            lesson.Title,
            lesson.Content,
            lesson.VideoUrl
        );
    }

    public async Task DeleteAsync(int id)
    {
        var lesson = await _db.Lessons.FindAsync(id);

        if (lesson == null)
            throw new Exception($"Lesson id {id} not found");

        _db.Lessons.Remove(lesson);
        await _db.SaveChangesAsync();
    }
}