# ------------------------------------------------------------------
# MERZY API — ASP.NET Core 8 / SQL Server (EF Core), Clean Architecture
# Build context: api-server/
# ------------------------------------------------------------------

# ---- Build stage ----
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Restore first: layer cache keeps dependencies out of rebuilds
COPY ["Directory.Build.props", "./"]
COPY ["MERZY.Backend.sln", "./"]
COPY ["src/MERZY.Domain/MERZY.Domain.csproj", "src/MERZY.Domain/"]
COPY ["src/MERZY.Application/MERZY.Application.csproj", "src/MERZY.Application/"]
COPY ["src/MERZY.Infrastructure/MERZY.Infrastructure.csproj", "src/MERZY.Infrastructure/"]
COPY ["src/MERZY.Api/MERZY.Api.csproj", "src/MERZY.Api/"]
COPY ["tests/MERZY.UnitTests/MERZY.UnitTests.csproj", "tests/MERZY.UnitTests/"]
RUN dotnet restore "MERZY.Backend.sln" && dotnet nuget locals all --clear

# Copy the rest of the source and publish
COPY . .
RUN dotnet publish "src/MERZY.Api/MERZY.Api.csproj" \
      -c Release \
      -o /app/publish \
      /p:UseAppHost=false

# ---- Runtime stage ----
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080 \
    ASPNETCORE_ENVIRONMENT=Production

COPY --from=build /app/publish .

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q -O /dev/null http://localhost:8080/healthz || exit 1

ENTRYPOINT ["dotnet", "MERZY.Api.dll"]
