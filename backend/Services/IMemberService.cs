public interface IMemberService
{
    Task<List<MemberDto>> GetAllAsync();
    Task<MemberDto> RegisterAsync(RegisterDto dto);  // เพิ่ม

}