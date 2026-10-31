using MERZY.Domain.Enums;
using Microsoft.AspNetCore.Mvc;

namespace MERZY.Api.Controllers;

/// <summary>Liveness endpoint (also /healthz primitive).</summary>
[ApiController]
[Route("api/health")]
public sealed class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() => Ok(new
    {
        ok = true,
        service = "merzy-api-server",
        time = DateTime.UtcNow
    });
}
