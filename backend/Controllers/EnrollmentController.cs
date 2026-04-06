using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Authorize]
public class EnrollmentController : ControllerBase
{
    private readonly IEnrollmentService _enrollmentService;

    public EnrollmentController(IEnrollmentService enrollmentService)
        => _enrollmentService = enrollmentService;

    // ดึง memberId จาก JWT token
    private int GetMemberId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // POST api/enrollments
    [HttpPost("api/enrollments")]
    public async Task<IActionResult> Enroll([FromBody] EnrollCourseDto dto)
    {
        try
        {
            var enrollment = await _enrollmentService.EnrollAsync(GetMemberId(), dto);
            return StatusCode(201, new
            {
                message = "Enrolled successfully",
                data = enrollment
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/my-courses
    [HttpGet("api/my-courses")]
    public async Task<IActionResult> GetMyCourses()
    {
        try
        {
            var courses = await _enrollmentService.GetMyCoursesAsync(GetMemberId());
            return Ok(courses);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE api/enrollments/1
    [HttpDelete("api/enrollments/{id}")]
    public async Task<IActionResult> Cancel(int id)
    {
        try
        {
            await _enrollmentService.CancelAsync(id, GetMemberId());
            return Ok(new { message = "Enrollment cancelled" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}