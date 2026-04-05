// MyCourseDto.cs — course ที่ member ลงทะเบียนไว้
public record MyCourseDto(
    int EnrollmentId,
    int CourseId,
    string CourseTitle,
    string? Description,
    DateTime EnrolledAt,
    int TotalLessons,            // จำนวน lesson ทั้งหมด
    int CompletedLessons         // จำนวนที่เรียนจบแล้ว
);