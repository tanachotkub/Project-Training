// CourseDetailDto.cs — ส่งพร้อม lessons
public record CourseDetailDto(
    int Id,
    string Title,
    string? Description,
    int CreatedBy,
    string? CreatedByUsername,
    List<LessonDto> Lessons      // lessons ทั้งหมดใน course
);