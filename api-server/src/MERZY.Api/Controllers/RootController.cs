using Microsoft.AspNetCore.Mvc;

namespace MERZY.Api.Controllers;

/// <summary>
/// Root API controller — provides welcome and documentation redirect.
/// </summary>
[ApiController]
[Route("")]
public class RootController : ControllerBase
{
    /// <summary>
    /// Welcome endpoint — redirects to Swagger documentation.
    /// </summary>
    /// <returns>Redirect to /swagger UI</returns>
    [HttpGet(Name = "GetRoot")]
    [ProduceResponseType(StatusCodes.Status301MovedPermanently)]
    public IActionResult Index()
    {
        return RedirectPermanent("/swagger");
    }

    /// <summary>
    /// API information endpoint.
    /// </summary>
    /// <returns>API metadata</returns>
    [HttpGet("info", Name = "GetInfo")]
    [ProduceResponseType(typeof(ApiInfoDto), StatusCodes.Status200OK)]
    public ActionResult<ApiInfoDto> Info()
    {
        return Ok(new ApiInfoDto
        {
            Service = "MERZY API",
            Version = "1.0.0",
            Environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Unknown",
            Timestamp = DateTime.UtcNow,
            Documentation = "https://merzy-coffee-api.runasp.net/swagger",
            HealthCheck = "https://merzy-coffee-api.runasp.net/healthz"
        });
    }
}

/// <summary>
/// API information data transfer object.
/// </summary>
public record ApiInfoDto
{
    /// <summary>Service name</summary>
    public string Service { get; init; }

    /// <summary>API version</summary>
    public string Version { get; init; }

    /// <summary>Environment (Development, Production, etc.)</summary>
    public string Environment { get; init; }

    /// <summary>Current server timestamp (UTC)</summary>
    public DateTime Timestamp { get; init; }

    /// <summary>Link to Swagger documentation</summary>
    public string Documentation { get; init; }

    /// <summary>Link to health check endpoint</summary>
    public string HealthCheck { get; init; }
}
