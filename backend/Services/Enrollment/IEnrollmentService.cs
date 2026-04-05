public interface IEnrollmentService
{
    Task<EnrollmentDto> EnrollAsync(int memberId, EnrollCourseDto dto);
    Task<List<MyCourseDto>> GetMyCoursesAsync(int memberId);
    Task CancelAsync(int enrollmentId, int memberId);
}