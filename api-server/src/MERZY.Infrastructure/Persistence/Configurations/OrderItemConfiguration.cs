namespace MERZY.Infrastructure.Persistence.Configurations;

using MERZY.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public sealed class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("OrderItems");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.ItemName).HasMaxLength(100).IsRequired();

        builder.Property(i => i.UnitPrice).HasPrecision(10, 2);

        builder.Property(i => i.LineTotal).HasPrecision(10, 2);

        builder.HasIndex(i => new { i.OrderId, i.MenuItemId });
    }
}
