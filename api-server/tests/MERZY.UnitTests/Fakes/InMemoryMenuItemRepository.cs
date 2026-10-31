namespace MERZY.UnitTests.Fakes;

using MERZY.Application.Common.Interfaces;
using MERZY.Domain.Entities;

/// <summary>
/// In-memory menu repository. Deterministic seed shared by tests so that
/// item ids in assertions match the production seed GUID pattern.
/// </summary>
public sealed class InMemoryMenuItemRepository : IMenuItemRepository
{
    public static readonly MenuItem Espresso = new()
    {
        Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000001"),
        Name = "Dirty Espresso",
        Description = "Signature espresso over microfoam.",
        Category = "coffee",
        Price = 60m,
    };

    public static readonly MenuItem FlatWhite = new()
    {
        Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000002"),
        Name = "Flat White",
        Description = "Double ristretto with silky microfoam.",
        Category = "coffee",
        Price = 55m,
    };

    public static readonly MenuItem LondonCake = new()
    {
        Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000003"),
        Name = "London Cake",
        Description = "Seasonal MERZY creation.",
        Category = "desserts",
        Price = 50m,
    };

    public static readonly MenuItem ClubSandwich = new()
    {
        Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000004"),
        Name = "Club Sandwich",
        Description = "Fresh baguette, coffee-ready.",
        Category = "bakery",
        Price = 70m,
    };

    private readonly List<MenuItem> _items;

    public InMemoryMenuItemRepository()
    {
        _items = [Espresso, FlatWhite, LondonCake, ClubSandwich];
    }

    public Task<IReadOnlyList<MenuItem>> GetAllAsync(string? category = null, CancellationToken ct = default)
    {
        IEnumerable<MenuItem> query = _items;

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(i => i.Category == category);

        return Task.FromResult<IReadOnlyList<MenuItem>>(query.ToList());
    }

    public Task<IReadOnlyList<MenuItem>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken ct = default)
    {
        return Task.FromResult<IReadOnlyList<MenuItem>>(_items.Where(i => ids.Contains(i.Id)).ToList());
    }
}
