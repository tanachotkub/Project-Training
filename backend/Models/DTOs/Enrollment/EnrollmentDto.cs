// EnrollmentDto.cs — ส่งให้ client
public record EnrollmentDto(
    int Id,
    int MemberId,
    string? Username,            // join มาจาก member
    int CourseId,
    string? CourseTitle,         // join มาจาก course
    DateTime EnrolledAt
);