public interface IMemberService
{
    Task<List<MemberDto>> GetAllAsync();
    Task<MemberDto> RegisterAsync(RegisterDto dto);  
    Task<MemberDto> LoginAsync(LoginDto dto);  
    Task<MemberDto> UpdateAsync(int id, UpdateMemberDto dto);  
    Task DeleteAsync(int id);                                   
}