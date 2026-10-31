namespace MERZY.Application.DTOs;

/// <summary>Menu item as exposed by the API.</summary>
public sealed record MenuItemDto(
    Guid Id,
    string Name,
    string Description,
    string Category,
    decimal Price,
    string? ImageUrl,
    bool IsAvailable);
