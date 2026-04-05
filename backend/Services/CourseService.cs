using Microsoft.EntityFrameworkCore;

public class CourseService : ICourseService
{
    private readonly AppDbContext _db;

    public CourseService(AppDbContext db) => _db = db;

    public async Task<List<CourseDto>> GetAllAsync()
    {
        return await _db.Courses
            .Include(c => c.Creator)
            .Select(c => new CourseDto(
                c.Id,
                c.Title,
                c.Description,
                c.CreatedBy,
                c.Creator!.Username
            ))
            .ToListAsync();
    }

    public async Task<CourseDetailDto> GetByIdAsync(int id)
    {
        var course = await _db.Courses
            .Include(c => c.Creator)
            .Include(c => c.Lessons)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            throw new Exception($"Course id {id} not found");

        var lessons = course.Lessons.Select(l => new LessonDto(
            l.Id,
            l.CourseId,
            l.Title,
            l.Content,
            l.VideoUrl
        )).ToList();

        return new CourseDetailDto(
            course.Id,
            course.Title,
            course.Description,
            course.CreatedBy,
            course.Creator?.Username,
            lessons
        );
    }

    public async Task<CourseDto> CreateAsync(int memberId, CreateCourseDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            throw new Exception("Title is required");

        // เช็คว่า member มีอยู่จริง
        var member = await _db.Members.FindAsync(memberId);
        if (member == null)
            throw new Exception($"Member id {memberId} not found");

        var course = new Course
        {
            Title = dto.Title,
            Description = dto.Description,
            CreatedBy = memberId
        };

        _db.Courses.Add(course);
        await _db.SaveChangesAsync();

        return new CourseDto(
            course.Id,
            course.Title,
            course.Description,
            course.CreatedBy,
            member.Username
        );
    }

    public async Task<CourseDto> UpdateAsync(int id, UpdateCourseDto dto)
    {
        var course = await _db.Courses
            .Include(c => c.Creator)
            .FirstOrDefaultAsync(c => c.Id == id);

        if (course == null)
            throw new Exception($"Course id {id} not found");

        if (!string.IsNullOrWhiteSpace(dto.Title))
            course.Title = dto.Title;

        if (dto.Description != null)
            course.Description = dto.Description;

        await _db.SaveChangesAsync();

        return new CourseDto(
            course.Id,
            course.Title,
            course.Description,
            course.CreatedBy,
            course.Creator?.Username
        );
    }

    public async Task DeleteAsync(int id)
    {
        var course = await _db.Courses.FindAsync(id);

        if (course == null)
            throw new Exception($"Course id {id} not found");

        _db.Courses.Remove(course);
        await _db.SaveChangesAsync();
    }

    public async Task<List<EnrollmentDto>> GetStudentsAsync(int courseId)
    {
        var course = await _db.Courses.FindAsync(courseId);

        if (course == null)
            throw new Exception($"Course id {courseId} not found");

        return await _db.Enrollments
            .Include(e => e.Member)
            .Include(e => e.Course)
            .Where(e => e.CourseId == courseId)
            .Select(e => new EnrollmentDto(
                e.Id,
                e.MemberId,
                e.Member!.Username,
                e.CourseId,
                e.Course!.Title,
                e.EnrolledAt
            ))
            .ToListAsync();
    }
}