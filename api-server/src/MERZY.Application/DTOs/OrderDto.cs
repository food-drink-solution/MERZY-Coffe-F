namespace MERZY.Application.DTOs;

public sealed record OrderItemDto(
    Guid ItemId,
    string ItemName,
    decimal UnitPrice,
    int Quantity,
    decimal LineTotal);

public sealed record OrderDto(
    Guid Id,
    string Code,
    string Status,
    decimal Subtotal,
    string? Notes,
    DateTime CreatedAtUtc,
    IReadOnlyList<OrderItemDto> Items);
