public interface IProgressService
{
    Task<ProgressDto> MarkAsync(int memberId, MarkProgressDto dto);
    Task<CourseProgressDto> GetCourseProgressAsync(int memberId, int courseId);
    Task<List<CourseProgressDto>> GetMyProgressAsync(int memberId);
}