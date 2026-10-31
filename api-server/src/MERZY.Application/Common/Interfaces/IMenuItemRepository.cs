namespace MERZY.Application.Common.Interfaces;

using MERZY.Domain.Entities;

/// <summary>
/// Read/write access to menu items. Implemented by Infrastructure with EF Core;
/// faked in unit tests. Keep it lean — one concern per interface.
/// </summary>
public interface IMenuItemRepository
{
    Task<IReadOnlyList<MenuItem>> GetAllAsync(string? category = null, CancellationToken ct = default);

    Task<IReadOnlyList<MenuItem>> GetByIdsAsync(IReadOnlyCollection<Guid> ids, CancellationToken ct = default);
}
