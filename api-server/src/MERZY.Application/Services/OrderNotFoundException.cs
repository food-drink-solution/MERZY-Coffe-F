namespace MERZY.Application.Services;

/// <summary>Thrown when an order id does not exist. Maps to HTTP 404.</summary>
public sealed class OrderNotFoundException : InvalidOperationException
{
    public OrderNotFoundException() : base("Order not found.") { }
}
