namespace MERZY.Infrastructure.Persistence.Configurations;

using MERZY.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public sealed class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
    public void Configure(EntityTypeBuilder<MenuItem> builder)
    {
        builder.ToTable("MenuItems");

        builder.HasKey(i => i.Id);

        builder.Property(i => i.Name).HasMaxLength(100).IsRequired();

        builder.Property(i => i.Description).HasMaxLength(500).IsRequired();

        builder.Property(i => i.Category).HasMaxLength(50).IsRequired();

        builder.Property(i => i.Price).HasPrecision(10, 2);

        builder.Property(i => i.ImageUrl).HasMaxLength(300);

        builder.HasIndex(i => new { i.Category, i.IsAvailable });

        builder.HasData(
            new MenuItem { Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000001"), Name = "Dirty Espresso", Description = "Signature espresso over microfoam.", Category = "coffee", Price = 60m },
            new MenuItem { Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000002"), Name = "Flat White", Description = "Double ristretto with silky microfoam.", Category = "coffee", Price = 55m },
            new MenuItem { Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000003"), Name = "London Cake", Description = "Seasonal MERZY creation.", Category = "desserts", Price = 50m },
            new MenuItem { Id = Guid.Parse("c9b8fa00-5c0a-b248-0001-000000000004"), Name = "Club Sandwich", Description = "Fresh baguette, coffee-ready.", Category = "bakery", Price = 70m });
    }
}
