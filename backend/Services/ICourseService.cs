public interface ICourseService
{
    Task<List<CourseDto>> GetAllAsync();
    Task<CourseDetailDto> GetByIdAsync(int id);
    Task<CourseDto> CreateAsync(int memberId, CreateCourseDto dto);
    Task<CourseDto> UpdateAsync(int id, UpdateCourseDto dto);
    Task DeleteAsync(int id);
    Task<List<EnrollmentDto>> GetStudentsAsync(int courseId);
}