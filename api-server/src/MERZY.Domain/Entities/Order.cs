namespace MERZY.Domain.Entities;

using MERZY.Domain.Enums;

/// <summary>A customer order placed for pickup at MERZY.</summary>
public class Order : Common.BaseEntity
{
    /// <summary>Short human-readable code, e.g. "MERZY-K3F9A2".</summary>
    public string Code { get; set; } = string.Empty;

    public OrderStatus Status { get; set; } = OrderStatus.Received;

    /// <summary>Order total in EGP, computed at placement time.</summary>
    public decimal Subtotal { get; set; }

    /// <summary>Customer notes (milk preference, pickup time...).</summary>
    public string? Notes { get; set; }

    public ICollection<OrderItem> Items { get; set; } = new List<OrderItem>();
}
