using MERZY.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace MERZY.Api.Controllers;

[ApiController]
[Route("api/menu")]
public sealed class MenuController : ControllerBase
{
    private readonly IMenuService _menu;

    public MenuController(IMenuService menu) => _menu = menu;

    [HttpGet]
    public async Task<IActionResult> Get([FromQuery] string? category, CancellationToken ct)
    {
        var items = await _menu.GetMenuAsync(category, ct);

        return Ok(new { count = items.Count, items });
    }
}
