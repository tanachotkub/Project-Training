using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[ApiController]
[Route("api/courses")]
public class CourseController : ControllerBase
{
    private readonly ICourseService _courseService;

    public CourseController(ICourseService courseService)
        => _courseService = courseService;

    // GET api/courses
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var courses = await _courseService.GetAllAsync();
        return Ok(courses);
    }

    // GET api/courses/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        try
        {
            var course = await _courseService.GetByIdAsync(id);
            return Ok(course);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    // POST api/courses
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateCourseDto dto)
    {
        try
        {
            // ดึง memberId จาก JWT token
            var memberId = int.Parse(
                User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var course = await _courseService.CreateAsync(memberId, dto);
            return StatusCode(201, new
            {
                message = "Course created",
                data = course
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // PUT api/courses/1
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateCourseDto dto)
    {
        try
        {
            var course = await _courseService.UpdateAsync(id, dto);
            return Ok(new
            {
                message = "Course updated",
                data = course
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // DELETE api/courses/1
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            await _courseService.DeleteAsync(id);
            return Ok(new { message = $"Course id {id} deleted" });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // GET api/courses/1/students
    [HttpGet("{id}/students")]
    [Authorize]
    public async Task<IActionResult> GetStudents(int id)
    {
        try
        {
            var students = await _courseService.GetStudentsAsync(id);
            return Ok(students);
        }
        catch (Exception ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }
}