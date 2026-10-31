namespace MERZY.Domain.Entities;

/// <summary>
/// A line on an order. Price and name are snapshotted at placement time
/// so historical orders never drift with menu price changes.
/// </summary>
public class OrderItem : Common.BaseEntity
{
    public Guid OrderId { get; set; }

    public Order Order { get; set; } = null!;

    /// <summary>The menu item ordered (null if the item is deleted from the menu).</summary>
    public Guid MenuItemId { get; set; }

    public MenuItem? MenuItem { get; set; }

    /// <summary>Display name snapshot.</summary>
    public string ItemName { get; set; } = string.Empty;

    /// <summary>Unit price snapshot in EGP.</summary>
    public decimal UnitPrice { get; set; }

    public int Quantity { get; set; }

    /// <summary>UnitPrice * Quantity, stored for SQL-side aggregation.</summary>
    public decimal LineTotal { get; set; }
}
