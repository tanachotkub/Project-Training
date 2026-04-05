public interface ILessonService
{
    Task<List<LessonDto>> GetByCourseIdAsync(int courseId);
    Task<LessonDto> GetByIdAsync(int id);
    Task<LessonDto> CreateAsync(int courseId, CreateLessonDto dto);
    Task<LessonDto> UpdateAsync(int id, UpdateLessonDto dto);
    Task DeleteAsync(int id);
}