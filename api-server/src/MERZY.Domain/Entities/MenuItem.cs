namespace MERZY.Domain.Entities;

/// <summary>A menu item sold at MERZY (coffee, bakery, dessert).</summary>
public class MenuItem : Common.BaseEntity
{
    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    /// <summary>Menu category (coffee, bakery, desserts...).</summary>
    public string Category { get; set; } = string.Empty;

    /// <summary>Price in EGP.</summary>
    public decimal Price { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsAvailable { get; set; } = true;
}
