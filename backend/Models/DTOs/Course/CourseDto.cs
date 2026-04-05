// CourseDto.cs — ส่งให้ client
public record CourseDto(
    int Id,
    string Title,
    string? Description,
    int CreatedBy,
    string? CreatedByUsername    // join มาจาก member
);