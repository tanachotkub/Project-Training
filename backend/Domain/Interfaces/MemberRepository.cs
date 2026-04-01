public interface IMemberRepository
{
    Task<List<Member>> GetAllAsync();
}