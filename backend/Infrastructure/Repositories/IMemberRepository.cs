using Microsoft.EntityFrameworkCore;

public class MemberRepository : IMemberRepository
{
    private readonly AppDbContext _db;

    public MemberRepository(AppDbContext db) => _db = db;

    public async Task<List<Member>> GetAllAsync()
        => await _db.Members.ToListAsync();
}