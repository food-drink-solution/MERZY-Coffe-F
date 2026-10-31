namespace MERZY.UnitTests;

using MERZY.Application.DTOs;
using MERZY.Application.Services;
using MERZY.Domain.Enums;
using MERZY.UnitTests.Fakes;
using Xunit;

public sealed class MenuServiceTests
{
    [Fact]
    public async Task Returns_all_seed_items_when_no_category_is_given()
    {
        var service = new MenuService(new InMemoryMenuItemRepository());

        var menu = await service.GetMenuAsync(ct: CancellationToken.None);

        Assert.Equal(4, menu.Count);
    }

    [Fact]
    public async Task Filters_by_category_case_sensitive_as_configured()
    {
        var service = new MenuService(new InMemoryMenuItemRepository());

        var coffee = await service.GetMenuAsync("coffee", CancellationToken.None);

        Assert.All(coffee, i => Assert.Equal("coffee", i.Category));
        Assert.Equal(2, coffee.Count);
    }

    [Fact]
    public async Task Maps_entities_to_dtos_with_correct_prices()
    {
        var service = new MenuService(new InMemoryMenuItemRepository());

        var menu = await service.GetMenuAsync(ct: CancellationToken.None);
        var espresso = Assert.Single(menu, i => i.Name == "Dirty Espresso");

        Assert.Equal(60m, espresso.Price);
        Assert.True(espresso.IsAvailable);
        Assert.Equal("coffee", espresso.Category);
    }
}

public sealed class OrderServiceTests
{
    private static PlaceOrderRequest ValidRequest() => new(
    [
        new PlaceOrderItemRequest(InMemoryMenuItemRepository.Espresso.Id, 2),
        new PlaceOrderItemRequest(InMemoryMenuItemRepository.LondonCake.Id, 1),
    ], Notes: "oat milk");

    [Fact]
    public async Task Places_order_with_snapshot_prices_and_subtotal()
    {
        var service = CreateService();

        var order = await service.PlaceOrderAsync(ValidRequest(), CancellationToken.None);

        Assert.Equal("Received", order.Status);
        Assert.Equal(60m * 2 + 50m, order.Subtotal);
        Assert.All(order.Items, i => Assert.Equal(i.UnitPrice * i.Quantity, i.LineTotal));
        Assert.StartsWith("MERZY-", order.Code);
    }

    [Fact]
    public async Task Rejects_empty_orders()
    {
        var service = CreateService();

        var ex = await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.PlaceOrderAsync(new PlaceOrderRequest([]), CancellationToken.None));

        Assert.Contains("at least one item", ex.Message);
    }

    [Fact]
    public async Task Rejects_unknown_menu_items()
    {
        var service = CreateService();
        var request = new PlaceOrderRequest(
            [new PlaceOrderItemRequest(Guid.NewGuid(), 1)]);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.PlaceOrderAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task Rejects_non_positive_quantities()
    {
        var service = CreateService();
        var request = new PlaceOrderRequest(
            [new PlaceOrderItemRequest(InMemoryMenuItemRepository.Espresso.Id, 0)]);

        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.PlaceOrderAsync(request, CancellationToken.None));
    }

    [Fact]
    public async Task Unknown_order_id_returns_OrderNotFoundException()
    {
        var service = CreateService();

        await Assert.ThrowsAsync<OrderNotFoundException>(
            () => service.UpdateStatusAsync(Guid.NewGuid(), OrderStatus.Preparing, CancellationToken.None));
    }

    [Theory]
    [InlineData(OrderStatus.Received, OrderStatus.Preparing, true)]
    [InlineData(OrderStatus.Preparing, OrderStatus.Ready, true)]
    [InlineData(OrderStatus.Ready, OrderStatus.Completed, true)]
    [InlineData(OrderStatus.Received, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Preparing, OrderStatus.Cancelled, true)]
    [InlineData(OrderStatus.Received, OrderStatus.Ready, false)]
    [InlineData(OrderStatus.Ready, OrderStatus.Cancelled, false)]
    [InlineData(OrderStatus.Completed, OrderStatus.Preparing, false)]
    [InlineData(OrderStatus.Cancelled, OrderStatus.Received, false)]
    public async Task Enforces_forward_only_state_machine(OrderStatus from, OrderStatus to, bool allowed)
    {
        var service = CreateService();

        var placed = await service.PlaceOrderAsync(ValidRequest(), CancellationToken.None);

        // walk the order to the starting status
        foreach (var hop in ForwardPath(OrderStatus.Received, from))
            await service.UpdateStatusAsync(placed.Id, hop, CancellationToken.None);

        if (allowed)
        {
            var updated = await service.UpdateStatusAsync(placed.Id, to, CancellationToken.None);
            Assert.Equal(to.ToString(), updated.Status);
        }
        else
        {
            var ex = await Assert.ThrowsAsync<InvalidOperationException>(
                () => service.UpdateStatusAsync(placed.Id, to, CancellationToken.None));
            Assert.Contains("Illegal transition", ex.Message);
        }
    }

    private static OrderService CreateService() =>
        new(new InMemoryMenuItemRepository(), new InMemoryOrderRepository());

    private static IEnumerable<OrderStatus> ForwardPath(OrderStatus start, OrderStatus target)
    {
        var order = new[] { OrderStatus.Received, OrderStatus.Preparing, OrderStatus.Ready, OrderStatus.Completed };
        var startIx = Array.IndexOf(order, start);
        var targetIx = Array.IndexOf(order, target);

        for (var i = startIx + 1; i <= targetIx && i < order.Length; i++)
            yield return order[i];
    }
}
