using MediatR;

public record GetMembersQuery : IRequest<List<MemberDto>>;

public class GetMembersHandler : IRequestHandler<GetMembersQuery, List<MemberDto>>
{
    private readonly IMemberRepository _repo;

    public GetMembersHandler(IMemberRepository repo) => _repo = repo;

    public async Task<List<MemberDto>> Handle(GetMembersQuery request, CancellationToken ct)
    {
        var members = await _repo.GetAllAsync();
        return members.Select(m => new MemberDto(m.Id, m.Username)).ToList();
    }
}