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

     public async Task<MemberDto> LoginAsync(LoginDto dto)
    {
        // Validate null/empty
        if (string.IsNullOrWhiteSpace(dto.Username))
            throw new Exception("Username is required");

        if (string.IsNullOrWhiteSpace(dto.Password))
            throw new Exception("Password is required");

        // หา member จาก username
        var member = await _db.Members
            .FirstOrDefaultAsync(m => m.Username == dto.Username);

        if (member == null)
            throw new Exception("Username or password is incorrect");

        // เทียบ password กับ hash ใน DB
        var isValid = BCrypt.Net.BCrypt.Verify(dto.Password, member.Password);

        if (!isValid)
            throw new Exception("Username or password is incorrect");

        return new MemberDto(member.Id, member.Username);
    }

      public async Task<MemberDto> UpdateAsync(int id, UpdateMemberDto dto)
    {
        // หา member จาก id
        var member = await _db.Members.FindAsync(id);

        if (member == null)
            throw new Exception($"Member id {id} not found");

        // เปลี่ยน username ถ้าส่งมา
        if (!string.IsNullOrWhiteSpace(dto.Username))
        {
            // เช็คว่า username ใหม่ซ้ำกับคนอื่นไหม
            var exists = await _db.Members
                .AnyAsync(m => m.Username == dto.Username && m.Id != id);

            if (exists)
                throw new Exception($"Username '{dto.Username}' already exists");

            member.Username = dto.Username;
        }

        // เปลี่ยน password ถ้าส่งมา
        if (!string.IsNullOrWhiteSpace(dto.Password))
        {
            member.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);
        }

        await _db.SaveChangesAsync();

        return new MemberDto(member.Id, member.Username);
    }

    public async Task DeleteAsync(int id)
    {
        var member = await _db.Members.FindAsync(id);

        if (member == null)
            throw new Exception($"Member id {id} not found");

        _db.Members.Remove(member);
        await _db.SaveChangesAsync();
    }
}