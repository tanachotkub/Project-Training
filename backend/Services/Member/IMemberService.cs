public interface IMemberService
{
    Task<List<MemberDto>> GetAllAsync();
    Task<MemberDto> RegisterAsync(RegisterDto dto);  
    // Task<MemberDto> LoginAsync(LoginDto dto);  
    Task<LoginResponseDto> LoginAsync(LoginDto dto);  // แก้ return type
    Task<MemberDto> UpdateAsync(int id, UpdateMemberDto dto);  
    Task DeleteAsync(int id);                                   
}