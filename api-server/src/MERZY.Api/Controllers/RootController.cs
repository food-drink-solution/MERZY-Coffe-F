using Microsoft.AspNetCore.Mvc;

namespace MERZY.Api.Controllers;

/// <summary>
/// Root API controller — provides welcome and documentation redirect.
/// </summary>
[ApiController]
[Route("")]
public sealed class RootController : ControllerBase
{
    /// <summary>
    /// Welcome endpoint — redirects to Swagger documentation.
    /// </summary>
    [HttpGet]
    public IActionResult Index()
    {
        return RedirectPermanent("/swagger");
    }

    /// <summary>
    /// API information endpoint.
    /// </summary>
    [HttpGet("info")]
    public IActionResult Info()
    {
        var info = new
        {
            service = "MERZY API",
            version = "1.0.0",
            environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
            timestamp = DateTime.UtcNow,
            documentation = "https://merzy-coffee-api.runasp.net/swagger",
            healthCheck = "https://merzy-coffee-api.runasp.net/healthz"
        };

        return Ok(info);
    }
}
