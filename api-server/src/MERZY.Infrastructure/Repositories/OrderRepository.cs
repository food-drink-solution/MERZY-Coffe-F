namespace MERZY.Infrastructure.Repositories;

using MERZY.Application.Common.Interfaces;
using MERZY.Domain.Entities;
using MERZY.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

public sealed class OrderRepository : IOrderRepository
{
    private readonly MerzyDbContext _db;

    public OrderRepository(MerzyDbContext db) => _db = db;

    public Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default) =>
        _db.Orders
            .Include(o => o.Items)
            .AsNoTracking()
            .FirstOrDefaultAsync(o => o.Id == id, ct);

    public async Task<Order> AddAsync(Order order, CancellationToken ct = default)
    {
        // EF traverses the Items collection: one Add covers the order and its lines.
        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);
        return order;
    }

    public Task<int> SaveChangesAsync(CancellationToken ct = default) => _db.SaveChangesAsync(ct);
}
