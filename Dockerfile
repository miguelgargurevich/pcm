# Usar la imagen oficial de .NET 9 SDK para build
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
# Forzar rebuild completo para actualizar navigation properties
RUN dotnet clean && dotnet publish -c Release -o /app/publish --no-restore

# Usar la imagen runtime de .NET 9 para ejecutar
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .

# Exponer el puerto (Render usa la variable PORT)
EXPOSE ${PORT:-5164}

# Comando de inicio
ENTRYPOINT ["dotnet", "PCM.API.dll"]
