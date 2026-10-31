using MERZY.Domain.Entities;
using MERZY.Domain.Enums;
using MERZY.Infrastructure.Persistence;
using MERZY.Infrastructure.Repositories;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace MERZY.IntegrationTests;

public sealed class SqlServerOrderPersistenceTests
{
    [Fact]
    public async Task Order_and_price_snapshots_survive_a_new_DbContext()
    {
        var configured = Environment.GetEnvironmentVariable("MERZY_TEST_SQLSERVER");
        Assert.False(string.IsNullOrWhiteSpace(configured),
            "Set MERZY_TEST_SQLSERVER to a dedicated disposable SQL Server test instance; never use production.");

        var builder = new SqlConnectionStringBuilder(configured);
        var databaseName = $"MerzyIntegration_{Guid.NewGuid():N}";
        var adminBuilder = new SqlConnectionStringBuilder(builder.ConnectionString) { InitialCatalog = "master" };

        await using (var admin = new SqlConnection(adminBuilder.ConnectionString))
        {
            await admin.OpenAsync();
            await using var command = admin.CreateCommand();
            command.CommandText = $"CREATE DATABASE [{databaseName}]";
            await command.ExecuteNonQueryAsync();
        }

        try
        {
            builder.InitialCatalog = databaseName;
            var options = new DbContextOptionsBuilder<MerzyDbContext>()
                .UseSqlServer(builder.ConnectionString)
                .Options;

            Guid orderId;
            var menuItem = new MenuItem
            {
                Name = "Integration espresso",
                Description = "Test fixture",
                Category = "coffee",
                Price = 42m,
                IsAvailable = true,
            };

            await using (var writeContext = new MerzyDbContext(options))
            {
                await writeContext.Database.MigrateAsync();
                writeContext.MenuItems.Add(menuItem);
                await writeContext.SaveChangesAsync();

                var order = new Order
                {
                    Code = $"TEST-{Guid.NewGuid():N}"[..13],
                    Status = OrderStatus.Received,
                    Notes = "integration test",
                    Subtotal = 84m,
                };
                order.Items.Add(new OrderItem
                {
                    MenuItemId = menuItem.Id,
                    ItemName = menuItem.Name,
                    UnitPrice = 42m,
                    Quantity = 2,
                    LineTotal = 84m,
                });

                var repository = new OrderRepository(writeContext);
                await repository.AddAsync(order);
                orderId = order.Id;
            }

            // A different DbContext proves the read is not satisfied by tracked in-memory entities.
            await using (var readContext = new MerzyDbContext(options))
            {
                var repository = new OrderRepository(readContext);
                var persisted = await repository.GetByIdAsync(orderId);

                Assert.NotNull(persisted);
                Assert.Equal(OrderStatus.Received, persisted.Status);
                Assert.Equal(84m, persisted.Subtotal);
                Assert.Equal("integration test", persisted.Notes);
                var line = Assert.Single(persisted.Items);
                Assert.Equal("Integration espresso", line.ItemName);
                Assert.Equal(42m, line.UnitPrice);
                Assert.Equal(2, line.Quantity);
                Assert.Equal(84m, line.LineTotal);
                Assert.NotEqual(default, persisted.CreatedAtUtc);
            }
        }
        finally
        {
            await using var admin = new SqlConnection(adminBuilder.ConnectionString);
            await admin.OpenAsync();
            await using var command = admin.CreateCommand();
            command.CommandText = $"ALTER DATABASE [{databaseName}] SET SINGLE_USER WITH ROLLBACK IMMEDIATE; DROP DATABASE [{databaseName}]";
            await command.ExecuteNonQueryAsync();
        }
    }
}
