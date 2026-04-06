using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
public class LessonController : ControllerBase
{
    private readonly ILessonService _lessonService;

    public LessonController(ILessonService lessonService)
        => _lessonService = lessonService;

    // GET api/courses/1/lessons
    [HttpGet("api/courses/{courseId}/lessons")]
    public async Task<IActionResult> GetByCourse(int courseId)
    {
        try
        {
            var lessons = await _lessonService.GetByCourseIdAsync(courseId);
            return Ok(lessons);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // GET api/lessons/1
    [HttpGet("api/lessons/{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var lesson = await _lessonService.GetByIdAsync(id);
            return Ok(lesson);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // POST api/courses/1/lessons
    [HttpPost("api/courses/{courseId}/lessons")]
    [Authorize]
    public async Task<IActionResult> Create(int courseId, [FromBody] CreateLessonDto dto)
    {
        try
        {
            var lesson = await _lessonService.CreateAsync(courseId, dto);
            return StatusCode(201, new
            {
                message = "Lesson created",
                data = lesson
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT api/lessons/1
    [HttpPut("api/lessons/{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateLessonDto dto)
    {
        try
        {
            var lesson = await _lessonService.UpdateAsync(id, dto);
            return Ok(new
            {
                message = "Lesson updated",
                data = lesson
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE api/lessons/1
    [HttpDelete("api/lessons/{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _lessonService.DeleteAsync(id);
            return Ok(new { message = $"Lesson id {id} deleted" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}