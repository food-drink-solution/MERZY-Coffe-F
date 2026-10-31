namespace MERZY.Application;

using Microsoft.Extensions.DependencyInjection;
using MERZY.Application.Services;

/// <summary>Application-layer composition root. Registers use-case services.</summary>
public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddScoped<IMenuService, MenuService>();
        services.AddScoped<IOrderService, OrderService>();

        return services;
    }
}
