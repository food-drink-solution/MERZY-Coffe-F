namespace MERZY.Application.Common.Interfaces;

using MERZY.Domain.Entities;

/// <summary>Read/write access to orders.</summary>
public interface IOrderRepository
{
    Task<Order?> GetByIdAsync(Guid id, CancellationToken ct = default);

    Task<Order> AddAsync(Order order, CancellationToken ct = default);

    /// <summary>Sql-side total in today's currency (for dashboards/reporting).</summary>
    Task<int> SaveChangesAsync(CancellationToken ct = default);
}
