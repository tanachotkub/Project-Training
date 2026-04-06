// CreateLessonDto.cs
public record CreateLessonDto(
    int CourseId,
    string Title,
    string? Content,
    string? VideoUrl
);