# ============================================
# Dockerfile para Backend - Pruebas Locales
# ============================================

# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copiar archivos de proyecto y restaurar dependencias
COPY backend/PCM.Domain/*.csproj ./backend/PCM.Domain/
COPY backend/PCM.Application/*.csproj ./backend/PCM.Application/
COPY backend/PCM.Infrastructure/*.csproj ./backend/PCM.Infrastructure/
COPY backend/PCM.Shared/*.csproj ./backend/PCM.Shared/
COPY backend/PCM.API/*.csproj ./backend/PCM.API/

RUN dotnet restore backend/PCM.API/PCM.API.csproj

# Copiar todo el código y compilar
COPY backend/ ./backend/
WORKDIR /src/backend/PCM.API
RUN dotnet clean && dotnet publish -c Release -o /app/publish --no-restore

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

# Copiar archivos publicados
COPY --from=build /app/publish .

# Crear directorio para storage de archivos
RUN mkdir -p /app/storage && \
    chmod 755 /app/storage

# Exponer puerto
EXPOSE 5164

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:5164/health || exit 1

# Variables de entorno por defecto
ENV ASPNETCORE_ENVIRONMENT=Docker
ENV ASPNETCORE_URLS=http://+:5164

# Comando de inicio
ENTRYPOINT ["dotnet", "PCM.API.dll"]
