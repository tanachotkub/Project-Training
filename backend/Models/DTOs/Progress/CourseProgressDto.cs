// CourseProgressDto.cs — ภาพรวมความคืบหน้าของ course
public record CourseProgressDto(
    int CourseId,
    string CourseTitle,
    int TotalLessons,
    int CompletedLessons,
    double ProgressPercent,      // คำนวณ = CompletedLessons / TotalLessons * 100
    List<ProgressDto> Lessons    // รายละเอียดแต่ละ lesson
);