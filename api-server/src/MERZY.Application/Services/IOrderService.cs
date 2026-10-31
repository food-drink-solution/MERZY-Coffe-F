namespace MERZY.Application.Services;

using MERZY.Application.DTOs;
using MERZY.Domain.Enums;

/// <summary>Order use cases (place, track, advance status).</summary>
public interface IOrderService
{
    Task<OrderDto> PlaceOrderAsync(PlaceOrderRequest request, CancellationToken ct = default);

    Task<OrderDto?> GetOrderAsync(Guid id, CancellationToken ct = default);

    /// <exception cref="InvalidOperationException">unknown order or illegal status transition</exception>
    Task<OrderDto> UpdateStatusAsync(Guid id, OrderStatus status, CancellationToken ct = default);
}
