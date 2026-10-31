namespace MERZY.Domain.Common;

/// <summary>
/// Base for every persisted entity. Identity is a GUID so entities
/// can be generated client-side and safely keyed across services.
/// </summary>
public abstract class BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAtUtc { get; set; }
}
