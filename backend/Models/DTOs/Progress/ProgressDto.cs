// ProgressDto.cs — ส่งให้ client
public record ProgressDto(
    int Id,
    int MemberId,
    int LessonId,
    string? LessonTitle,         // join มาจาก lesson
    bool IsCompleted,
    DateTime? CompletedAt
);