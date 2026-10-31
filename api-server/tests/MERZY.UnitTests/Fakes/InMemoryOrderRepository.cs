namespace MERZY.UnitTests.Fakes;

using MERZY.Application.Common.Interfaces;
using MERZY.Domain.Entities;

/// <summary>In-memory order repository with lookup by id and append-only writes.</summary>
public sealed class InMemoryOrderRepository : IOrderRepository
{
    private readonly Dictionary<Guid, Order> _orders = new();

    public int SaveChangesCallCount { get; private set; }

    public Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default)
    {
        _orders.TryGetValue(id, out var order);
        return Task.FromResult(order);
    }

    public Task<Order> AddAsync(Order order, CancellationToken ct = default)
    {
        _orders[order.Id] = order;
        return Task.FromResult(order);
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default)
    {
        SaveChangesCallCount++;
        return Task.FromResult(1);
    }
}
