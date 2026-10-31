namespace MERZY.Application.Services;

using MERZY.Application.Common.Interfaces;
using MERZY.Application.DTOs;
using MERZY.Domain.Entities;
using MERZY.Domain.Enums;

public sealed class OrderService : IOrderService
{
    private const int MaxItemsPerOrder = 50;
    private const int MaxQuantityPerItem = 100;

    private readonly IMenuItemRepository _menuItems;
    private readonly IOrderRepository _orders;

    public OrderService(IMenuItemRepository menuItems, IOrderRepository orders)
    {
        _menuItems = menuItems;
        _orders = orders;
    }

    public async Task<OrderDto> PlaceOrderAsync(PlaceOrderRequest request, CancellationToken ct = default)
    {
        if (request.Items is null || request.Items.Count == 0)
            throw new InvalidOperationException("An order needs at least one item.");

        if (request.Items.Count > MaxItemsPerOrder)
            throw new InvalidOperationException($"An order cannot contain more than {MaxItemsPerOrder} line items.");

        if (request.Items.Any(i => i.Quantity <= 0 || i.Quantity > MaxQuantityPerItem))
            throw new InvalidOperationException($"Item quantity must be between 1 and {MaxQuantityPerItem}.");

        if (string.IsNullOrWhiteSpace(request.Notes) is false && request.Notes!.Length > 300)
            throw new InvalidOperationException("Notes cannot exceed 300 characters.");

        var ids = request.Items.Select(i => i.ItemId).Distinct().ToList();
        var menu = await _menuItems.GetByIdsAsync(ids, ct);
        if (menu.Count != ids.Count)
            throw new InvalidOperationException("One or more items do not exist in the MERZY menu.");

        var order = new Order
        {
            Code = NewOrderCode(),
            Status = OrderStatus.Received,
            Notes = request.Notes,
        };

        foreach (var line in request.Items)
        {
            var item = menu.First(m => m.Id == line.ItemId);
            order.Items.Add(new OrderItem
            {
                MenuItemId = item.Id,
                ItemName = item.Name,
                UnitPrice = item.Price,
                Quantity = line.Quantity,
                LineTotal = item.Price * line.Quantity,
            });
        }

        order.Subtotal = order.Items.Sum(i => i.LineTotal);

        await _orders.AddAsync(order, ct);

        return OrderToDto(order);
    }

    public async Task<OrderDto?> GetOrderAsync(Guid id, CancellationToken ct = default)
    {
        var order = await _orders.GetByIdAsync(id, ct);
        return order is null ? null : OrderToDto(order);
    }

    public async Task<OrderDto> UpdateStatusAsync(Guid id, OrderStatus status, CancellationToken ct = default)
    {
        var order = await _orders.GetByIdAsync(id, ct)
            ?? throw new OrderNotFoundException();

        if (!CanTransition(order.Status, status))
            throw new InvalidOperationException($"Illegal transition {order.Status} → {status}.");

        order.Status = status;
        order.UpdatedAtUtc = DateTime.UtcNow;
        await _orders.SaveChangesAsync(ct);

        return OrderToDto(order);
    }

    /// <summary>
    /// Forward-only state machine. Terminal states (Completed, Cancelled) are final.
    /// </summary>
    private static bool CanTransition(OrderStatus from, OrderStatus to) => (from, to) switch
    {
        (OrderStatus.Received, OrderStatus.Preparing) => true,
        (OrderStatus.Preparing, OrderStatus.Ready) => true,
        (OrderStatus.Ready, OrderStatus.Completed) => true,
        (OrderStatus.Received, OrderStatus.Cancelled) => true,
        (OrderStatus.Preparing, OrderStatus.Cancelled) => true,
        _ => false,
    };

    private static string NewOrderCode() =>
        $"MERZY-{DateTime.UtcNow.Ticks.ToString("x").ToUpperInvariant()[^6..]}";

    private static OrderDto OrderToDto(Order order) => new(
        order.Id,
        order.Code,
        order.Status.ToString(),
        order.Subtotal,
        order.Notes,
        order.CreatedAtUtc,
        order.Items
            .Select(i => new OrderItemDto(i.MenuItemId, i.ItemName, i.UnitPrice, i.Quantity, i.LineTotal))
            .ToList());
}
