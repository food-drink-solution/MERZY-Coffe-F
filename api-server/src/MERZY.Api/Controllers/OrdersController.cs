using MERZY.Application.DTOs;
using MERZY.Application.Services;
using MERZY.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MERZY.Api.Controllers;

[ApiController]
[Route("api/orders")]
public sealed class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpPost]
    public async Task<IActionResult> Place([FromBody] PlaceOrderRequest request, CancellationToken ct)
    {
        if (request is null || request.Items is null || request.Items.Count == 0)
            return BadRequest(new { error = "Items are required to place an order." });

        try
        {
            var order = await _orders.PlaceOrderAsync(request, ct);
            return CreatedAtAction(nameof(Get), new { id = order.Id }, order);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var order = await _orders.GetOrderAsync(id, ct);

        return order is null ? NotFound(new { error = "Order not found." }) : Ok(order);
    }

    [HttpPatch("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusRequest request, CancellationToken ct)
    {
        if (request is null || !Enum.TryParse<OrderStatus>(request.Status, ignoreCase: true, out var status))
            return BadRequest(new { error = "Status must be one of: Received, Preparing, Ready, Completed, Cancelled." });

        try
        {
            var order = await _orders.UpdateStatusAsync(id, status, ct);
            return Ok(order);
        }
        catch (OrderNotFoundException)
        {
            return NotFound(new { error = "Order not found." });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    public sealed record UpdateStatusRequest(string? Status);
}
