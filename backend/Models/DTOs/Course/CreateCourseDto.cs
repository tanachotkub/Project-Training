// CreateCourseDto.cs
public record CreateCourseDto(
    string Title,
    string? Description,
    int CreatedBy
);