using MERZY.Api.Controllers;
using MERZY.Application.DTOs;
using MERZY.Application.Services;
using MERZY.Domain.Enums;
using Microsoft.AspNetCore.Mvc;
using Xunit;

namespace MERZY.UnitTests;

public sealed class OrdersControllerTests
{
    [Fact]
    public void UpdateStatus_returns_501_until_staff_authorization_is_implemented()
    {
        var controller = new OrdersController(new StubOrderService());

        var result = controller.UpdateStatus(Guid.NewGuid());

        var response = Assert.IsType<ObjectResult>(result);
        Assert.Equal(StatusCodes.Status501NotImplemented, response.StatusCode);
    }

    private sealed class StubOrderService : IOrderService
    {
        public Task<OrderDto> PlaceOrderAsync(PlaceOrderRequest request, CancellationToken ct = default) =>
            throw new NotSupportedException();

        public Task<OrderDto?> GetOrderAsync(Guid id, CancellationToken ct = default) =>
            Task.FromResult<OrderDto?>(null);

        public Task<OrderDto> UpdateStatusAsync(Guid id, OrderStatus status, CancellationToken ct = default) =>
            throw new NotSupportedException();
    }
}
