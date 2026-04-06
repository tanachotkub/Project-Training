using Microsoft.EntityFrameworkCore;

public class EnrollmentService : IEnrollmentService
{
    private readonly AppDbContext _db;

    public EnrollmentService(AppDbContext db) => _db = db;

    public async Task<EnrollmentDto> EnrollAsync(int memberId, EnrollCourseDto dto)
    {
        // เช็คว่า course มีอยู่จริง
        var course = await _db.Courses.FindAsync(dto.CourseId);
        if (course == null)
            throw new Exception($"Course id {dto.CourseId} not found");

        // เช็คว่าลงทะเบียนซ้ำไหม
        var exists = await _db.Enrollments
            .AnyAsync(e => e.MemberId == memberId && e.CourseId == dto.CourseId);

        if (exists)
            throw new Exception("Already enrolled in this course");

        var enrollment = new Enrollment
        {
            MemberId = memberId,
            CourseId = dto.CourseId,
            EnrolledAt = DateTime.UtcNow
        };

        _db.Enrollments.Add(enrollment);
        await _db.SaveChangesAsync();

        // ดึง member มา join
        var member = await _db.Members.FindAsync(memberId);

        return new EnrollmentDto(
            enrollment.Id,
            enrollment.MemberId,
            member!.Username,
            enrollment.CourseId,
            course.Title,
            enrollment.EnrolledAt
        );
    }

    public async Task<List<MyCourseDto>> GetMyCoursesAsync(int memberId)
    {
        var enrollments = await _db.Enrollments
            .Include(e => e.Course)
                .ThenInclude(c => c!.Lessons)
            .Where(e => e.MemberId == memberId)
            .ToListAsync();

        var result = new List<MyCourseDto>();

        foreach (var e in enrollments)
        {
            var totalLessons = e.Course!.Lessons.Count;

            // นับ lesson ที่เรียนจบแล้ว
            var completedLessons = await _db.Progresses
                .CountAsync(p =>
                    p.MemberId == memberId &&
                    p.Lesson!.CourseId == e.CourseId &&
                    p.IsCompleted);

            result.Add(new MyCourseDto(
                e.Id,
                e.CourseId,
                e.Course.Title,
                e.Course.Description,
                e.EnrolledAt,
                totalLessons,
                completedLessons
            ));
        }

        return result;
    }

    public async Task CancelAsync(int enrollmentId, int memberId)
    {
        var enrollment = await _db.Enrollments.FindAsync(enrollmentId);

        if (enrollment == null)
            throw new Exception($"Enrollment id {enrollmentId} not found");

        // เช็คว่าเป็นเจ้าของการลงทะเบียนนี้
        if (enrollment.MemberId != memberId)
            throw new Exception("You are not authorized to cancel this enrollment");

        _db.Enrollments.Remove(enrollment);
        await _db.SaveChangesAsync();
    }
}