using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Authorize]
public class ProgressController : ControllerBase
{
    private readonly IProgressService _progressService;

    public ProgressController(IProgressService progressService)
        => _progressService = progressService;

    private int GetMemberId() =>
        int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // POST api/progress
    [HttpPost("api/progress")]
    public async Task<IActionResult> Mark([FromBody] MarkProgressDto dto)
    {
        try
        {
            var progress = await _progressService.MarkAsync(GetMemberId(), dto);
            return Ok(new
            {
                message = dto.IsCompleted
                    ? "Lesson marked as completed"
                    : "Lesson marked as incomplete",
                data = progress
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/courses/1/progress
    [HttpGet("api/courses/{courseId}/progress")]
    public async Task<IActionResult> GetCourseProgress(int courseId)
    {
        try
        {
            var progress = await _progressService
                .GetCourseProgressAsync(GetMemberId(), courseId);
            return Ok(progress);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/my-progress
    [HttpGet("api/my-progress")]
    public async Task<IActionResult> GetMyProgress()
    {
        try
        {
            var progress = await _progressService.GetMyProgressAsync(GetMemberId());
            return Ok(progress);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}