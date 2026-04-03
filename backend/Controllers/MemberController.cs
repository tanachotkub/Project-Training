using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/member")]
public class MemberController : ControllerBase
{
    private readonly IMemberService _memberService;

    public MemberController(IMemberService memberService)
        => _memberService = memberService;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var members = await _memberService.GetAllAsync();
        return Ok(members);
    }

     // POST api/member/register
      [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto)
    {
        try
        {
            var member = await _memberService.RegisterAsync(dto);
            return StatusCode(201, new
            {
                message = "Register success",
                data = member
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}