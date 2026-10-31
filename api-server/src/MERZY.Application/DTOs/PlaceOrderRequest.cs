namespace MERZY.Application.DTOs;

/// <summary>POST /api/orders body.</summary>
public sealed record PlaceOrderItemRequest(Guid ItemId, int Quantity);

public sealed record PlaceOrderRequest(IReadOnlyList<PlaceOrderItemRequest> Items, string? Notes = null);
