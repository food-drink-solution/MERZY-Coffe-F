namespace MERZY.Domain.Enums;

/// <summary>
/// Lifecycle of a MERZY order. Transitions are forward-only:
/// Received → Preparing → Ready → Completed. Any status can be Cancelled
/// until the order is Completed (see Application.OrderStateMachine).
/// </summary>
public enum OrderStatus
{
    Received = 0,
    Preparing = 1,
    Ready = 2,
    Completed = 3,
    Cancelled = 4
}
