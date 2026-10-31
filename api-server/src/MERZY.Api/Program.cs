using MERZY.Application;
using MERZY.Infrastructure;
using MERZY.Infrastructure.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// ---- CORS: the production frontend (Vercel) + local dev server ----
var allowedOrigins = new[]
{
    "https://merzy-coffe.vercel.app",
    "http://localhost:4321",
    "https://localhost:4321",
};

builder.Services.AddCors(options =>
    options.AddPolicy("MerzyWeb", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .WithMethods("GET", "POST", "PATCH")));

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
                      "Menu reads, order placement and the forward-only order status machine.",
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

// CORS must run before endpoint mapping so the browser preflight (OPTIONS) is answered.
app.UseCors("MerzyWeb");

app.MapControllers();

// Apply pending migrations at startup so the deployment is self-sufficient.
// A missing database server must never block the health probe — the app
// serves fine for health checks and surfaces DB errors on data endpoints.
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<MerzyDbContext>();
    try
    {
        await db.Database.MigrateAsync();
    }
    catch (Exception ex)
    {
        app.Logger.LogWarning(ex, "Database migration unavailable at startup — verify SQL Server connection.");
    }
}

app.Run();
