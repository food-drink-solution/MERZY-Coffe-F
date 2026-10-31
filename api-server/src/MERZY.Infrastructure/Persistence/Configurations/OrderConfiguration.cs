namespace MERZY.Infrastructure.Persistence.Configurations;

using MERZY.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Orders");

        builder.HasKey(o => o.Id);

        builder.Property(o => o.Code).HasMaxLength(24).IsRequired();
        builder.HasIndex(o => o.Code).IsUnique();

        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);

        builder.Property(o => o.Subtotal).HasPrecision(10, 2);

        builder.Property(o => o.Notes).HasMaxLength(300);

        builder.HasMany(o => o.Items)
            .WithOne(i => i.Order)
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
