namespace MERZY.Infrastructure.Repositories;

using MERZY.Application.Common.Interfaces;
using MERZY.Domain.Entities;
using MERZY.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public sealed class MenuItemRepository : IMenuItemRepository
{
    private readonly MerzyDbContext _db;

    public MenuItemRepository(MerzyDbContext db) => _db = db;

    public async Task<IReadOnlyList<MenuItem>> GetAllAsync(string? category = null, CancellationToken ct = default)
    {
        var query = _db.MenuItems.AsNoTracking();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(i => i.Category == category);

        var items = await query.OrderBy(i => i.Category).ThenBy(i => i.Name).ToListAsync(ct);

        return items;
    }

    public async Task<IReadOnlyList<MenuItem>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken ct = default)
    {
        var items = await _db.MenuItems
            .Where(i => ids.Contains(i.Id))
            .AsNoTracking()
            .ToListAsync(ct);

        return items;
    }
}
