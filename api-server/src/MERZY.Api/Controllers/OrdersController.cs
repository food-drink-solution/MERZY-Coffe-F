using MERZY.Application.DTOs;
using MERZY.Application.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace MERZY.Api.Controllers;

[ApiController]
[Route("api/orders")]
public sealed class OrdersController : ControllerBase
{
    private readonly IOrderService _orders;

    public OrdersController(IOrderService orders) => _orders = orders;

    [HttpPost]
    [EnableRateLimiting("order-create")]
    [RequestSizeLimit(32 * 1024)]
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

    // Fail closed: changing an order's state is an operational/staff action.
    // Do not expose mutation until an authenticated staff policy is implemented.
    [HttpPatch("{id:guid}/status")]
    public IActionResult UpdateStatus(Guid id) =>
        StatusCode(StatusCodes.Status501NotImplemented, new
        {
            error = "Order status updates are disabled until staff authentication and authorization are implemented."
        });
}
