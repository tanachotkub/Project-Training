// LessonDto.cs — ส่งให้ client
public record LessonDto(
    int Id,
    int CourseId,
    string Title,
    string? Content,
    string? VideoUrl
);