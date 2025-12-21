#!/bin/bash
# ============================================================================
# PCM - Script de Configuración de Servicios
# Ambiente: CERTIFICACIÓN/STAGING
# ============================================================================

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  PCM - Configuración de Servicios para Certificación           ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

# Variables
APP_DIR="/var/www/pcm"

# ============================================================================
# 1. Crear archivo de variables de entorno para Backend
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1. Configurando variables de entorno del Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

cat > $APP_DIR/backend/.env << 'EOF'
# ============================================================================
# PCM Backend - Variables de Entorno (CERTIFICACIÓN)
# ============================================================================

ASPNETCORE_ENVIRONMENT=Staging
ASPNETCORE_URLS=http://0.0.0.0:5000

# Supabase Database Connection
ConnectionStrings__DefaultConnection=Host=aws-0-us-west-1.pooler.supabase.com;Port=6543;Database=postgres;Username=postgres.mtphzudwmpxewmtspird;Password=Pcm2024@@;SSL Mode=Require;Trust Server Certificate=true;Pooling=true;Minimum Pool Size=0;Maximum Pool Size=20

# Supabase Storage
Supabase__Url=https://mtphzudwmpxewmtspird.supabase.co
Supabase__ServiceKey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im10cGh6dWR3bXB4ZXdtdHNwaXJkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMTU5MDYxNiwiZXhwIjoyMDQ3MTY2NjE2fQ.RVeHV-7ESj0LCz3E7QVclaVZ_iyE_O2dVRYmJPjLQBk
Supabase__BucketName=documentos

# JWT
Jwt__Secret=PCM_JWT_SECRET_KEY_2024_SUPER_SECURE_256_BITS_MINIMUM_KEY
Jwt__Issuer=PCM_API
Jwt__Audience=PCM_Frontend

# CORS - Permitir acceso desde el frontend
Cors__Origins=http://localhost,http://localhost:80,http://10.211.55.4,http://ubuntu-linux-2404.local

# Logging
Logging__LogLevel__Default=Information
Logging__LogLevel__Microsoft.AspNetCore=Warning
EOF

print_status "Variables de entorno del backend configuradas"

# ============================================================================
# 2. Crear servicio systemd para Backend
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2. Creando servicio systemd para Backend..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sudo tee /etc/systemd/system/pcm-backend.service > /dev/null << 'EOF'
[Unit]
Description=PCM Backend API (.NET 9)
After=network.target

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=/var/www/pcm/backend/publish
ExecStart=/usr/bin/dotnet /var/www/pcm/backend/publish/PCM.API.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=pcm-backend
Environment=ASPNETCORE_ENVIRONMENT=Staging
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false
EnvironmentFile=/var/www/pcm/backend/.env

# Logs
StandardOutput=append:/var/www/pcm/logs/backend-stdout.log
StandardError=append:/var/www/pcm/logs/backend-stderr.log

[Install]
WantedBy=multi-user.target
EOF

# Dar permisos
sudo chown -R www-data:www-data $APP_DIR/backend
sudo chown -R www-data:www-data $APP_DIR/logs

print_status "Servicio pcm-backend.service creado"

# ============================================================================
# 3. Configurar Nginx
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3. Configurando Nginx..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

sudo tee /etc/nginx/sites-available/pcm << 'EOF'
# ============================================================================
# PCM - Nginx Configuration (CERTIFICACIÓN/STAGING)
# ============================================================================

server {
    listen 80;
    server_name localhost ubuntu-linux-2404.local 10.211.55.4;

    # Logs
    access_log /var/www/pcm/logs/nginx-access.log;
    error_log /var/www/pcm/logs/nginx-error.log;

    # Tamaño máximo de upload (para PDFs)
    client_max_body_size 50M;

    # ========================================================================
    # Frontend - React SPA
    # ========================================================================
    location / {
        root /var/www/pcm/frontend/dist;
        index index.html;
        try_files $uri $uri/ /index.html;

        # Cache para assets estáticos
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # ========================================================================
    # Backend API - Reverse Proxy a .NET
    # ========================================================================
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts para operaciones largas
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Swagger UI (solo en staging)
    location /swagger {
        proxy_pass http://127.0.0.1:5000/swagger;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Health check endpoint
    location /health {
        proxy_pass http://127.0.0.1:5000/health;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
EOF

# Habilitar el sitio
sudo rm -f /etc/nginx/sites-enabled/default
sudo ln -sf /etc/nginx/sites-available/pcm /etc/nginx/sites-enabled/pcm

# Verificar configuración
sudo nginx -t

print_status "Nginx configurado"

# ============================================================================
# 4. Habilitar y arrancar servicios
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4. Iniciando servicios..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Recargar systemd
sudo systemctl daemon-reload

# Habilitar backend
sudo systemctl enable pcm-backend
sudo systemctl restart pcm-backend

# Recargar nginx
sudo systemctl reload nginx

# Esperar a que el backend inicie
sleep 5

# Verificar estado
echo ""
echo "Estado de los servicios:"
echo "------------------------"
sudo systemctl status pcm-backend --no-pager -l | head -15
echo ""
sudo systemctl status nginx --no-pager -l | head -10

# ============================================================================
# 5. Obtener IP del servidor
# ============================================================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5. Información de acceso..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

IP=$(hostname -I | awk '{print $1}')

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║  ✅ CONFIGURACIÓN COMPLETADA                                   ║"
echo "╠════════════════════════════════════════════════════════════════╣"
echo "║                                                                ║"
echo "║  🌐 Acceso al Sistema:                                         ║"
echo "║     Frontend:  http://$IP                               ║"
echo "║     API:       http://$IP/api                           ║"
echo "║     Swagger:   http://$IP/swagger                       ║"
echo "║                                                                ║"
echo "║  📋 Comandos útiles:                                           ║"
echo "║     Ver logs backend:  sudo journalctl -u pcm-backend -f       ║"
echo "║     Ver logs nginx:    sudo tail -f /var/www/pcm/logs/*.log    ║"
echo "║     Reiniciar backend: sudo systemctl restart pcm-backend      ║"
echo "║     Reiniciar nginx:   sudo systemctl reload nginx             ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
