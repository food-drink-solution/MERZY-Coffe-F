using System.Threading.RateLimiting;
using MERZY.Application;
using MERZY.Infrastructure;
using MERZY.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configure trusted browser origins via MERZY_CORS_ORIGINS (comma-separated).
// Keep local origins as development defaults; production hosts should set the
// variable explicitly in the hosting environment.
var configuredOrigins = builder.Configuration["MERZY_CORS_ORIGINS"];
var allowedOrigins = string.IsNullOrWhiteSpace(configuredOrigins)
    ? new[] { "https://merzy-coffe.vercel.app", "http://localhost:4321", "https://localhost:4321" }
    : configuredOrigins.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

builder.Services.AddCors(options =>
    options.AddPolicy("MerzyWeb", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .WithMethods("GET", "POST", "PATCH")));

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddFixedWindowLimiter("order-create", limiter =>
    {
        limiter.PermitLimit = 10;
        limiter.Window = TimeSpan.FromMinutes(1);
        limiter.QueueLimit = 0;
        limiter.AutoReplenishment = true;
    });
});

// ---- Layer composition ----
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "MERZY API",
        Description = "Backend for MERZY specialty coffee & bakery (Alexandria, Egypt). " +
                      "Menu reads and order placement. Staff order-status mutation is disabled until authorization is implemented.",
        Version = "v1",
    });
});
builder.Services.AddHealthChecks();

var app = builder.Build();

// Swagger is intentionally available in production too: runasp.net has no
// gateway cockpit, so the deployment is verified through the live docs.
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "MERZY API v1");
    options.DocumentTitle = "MERZY API";
});

app.MapHealthChecks("/healthz");

// Explicit routing keeps endpoint-aware rate limiting in the correct middleware position.
app.UseRouting();
app.UseCors("MerzyWeb");
app.UseRateLimiter();
app.MapControllers();

// Apply migrations only when a connection string is configured. Health probes
// must still start in CI or diagnostics environments without database secrets.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrWhiteSpace(connectionString))
{
    app.Logger.LogWarning("ConnectionStrings:DefaultConnection is not configured; startup migrations are skipped.");
}
else
{
    try
    {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<MerzyDbContext>();
        await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database migration unavailable at startup — verify SQL Server connection.");
    }
}

app.Run();
