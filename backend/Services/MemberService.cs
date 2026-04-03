using BCrypt.Net;  // เพิ่มบรรทัดนี้
using Microsoft.EntityFrameworkCore;

public class MemberService : IMemberService
{
    private readonly AppDbContext _db;

    public MemberService(AppDbContext db) => _db = db;

    public async Task<List<MemberDto>> GetAllAsync()
    {
        return await _db.Members
            .Select(m => new MemberDto(m.Id, m.Username))
            .ToListAsync();
    }

     public async Task<MemberDto> RegisterAsync(RegisterDto dto)
    {
        // Validate null/empty
        if (string.IsNullOrWhiteSpace(dto.Username))
            throw new Exception("Username is required");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("Password is required");

        // เช็ค username ซ้ำ
        var exists = await _db.Members
            .AnyAsync(m => m.Username == dto.Username);

        if (exists)
            throw new Exception($"Username '{dto.Username}' already exists");

        // Hash password ด้วย bcrypt
        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        var member = new Member
        {
            Username = dto.Username,
            Password = hashedPassword  // เก็บ hash ไม่เก็บ plain text
        };

        _db.Members.Add(member);
        await _db.SaveChangesAsync();

        return new MemberDto(member.Id, member.Username);
    }
}