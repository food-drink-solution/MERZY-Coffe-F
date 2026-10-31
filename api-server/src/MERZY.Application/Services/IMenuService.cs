namespace MERZY.Application.Services;

using MERZY.Application.DTOs;

/// <summary>Menu read-side use cases.</summary>
public interface IMenuService
{
    Task<IReadOnlyList<MenuItemDto>> GetMenuAsync(string? category = null, CancellationToken ct = default);
}
