namespace MERZY.Infrastructure.Persistence;

using MERZY.Domain.Entities;
using Microsoft.EntityFrameworkCore;

/// <summary>
/// EF Core context for MERZY. Configurations live in Configurations/;
/// seed data is defined there so InitialCreate migrations are deterministic.
/// </summary>
public sealed class MerzyDbContext : DbContext
{
    public MerzyDbContext(DbContextOptions<MerzyDbContext> options) : base(options) { }

    public DbSet<MenuItem> MenuItems => Set<MenuItem>();

    public DbSet<Order> Orders => Set<Order>();

    public DbSet<OrderItem> OrderItems => Set<OrderItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(MerzyDbContext).Assembly);
    }
}
