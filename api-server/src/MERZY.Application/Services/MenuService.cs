namespace MERZY.Application.Services;

using MERZY.Application.Common.Interfaces;
using MERZY.Application.DTOs;
using MERZY.Domain.Entities;

public sealed class MenuService : IMenuService
{
    private readonly IMenuItemRepository _menuItems;

    public MenuService(IMenuItemRepository menuItems) => _menuItems = menuItems;

    public async Task<IReadOnlyList<MenuItemDto>> GetMenuAsync(string? category = null, CancellationToken ct = default)
    {
        var items = await _menuItems.GetAllAsync(category, ct);

        return items
            .Select(i => new MenuItemDto(i.Id, i.Name, i.Description, i.Category, i.Price, i.ImageUrl, i.IsAvailable))
            .ToList();
    }
}
