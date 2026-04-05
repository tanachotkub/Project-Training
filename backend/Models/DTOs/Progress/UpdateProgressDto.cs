// UpdateProgressDto.cs — mark lesson ว่าเรียนจบ
public record UpdateProgressDto(
    int MemberId,
    int LessonId,
    bool IsCompleted
);