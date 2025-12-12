#!/bin/bash

# =============================================
# Script de Deployment para PCM
# =============================================
# Uso: ./deploy.sh [comando]
# Comandos: install, start, stop, restart, logs, backup, update

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directorios
DEPLOY_DIR="/opt/pcm"
FRONTEND_DIR="/var/www/pcm"
NGINX_CONF="/etc/nginx/sites-available/pcm"
REPO_DIR="${DEPLOY_DIR}/repo"

# Función para mostrar mensajes
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar que se ejecuta como root o con sudo
check_root() {
    if [[ $EUID -ne 0 ]]; then
        log_error "Este script debe ejecutarse con sudo"
        exit 1
    fi
}

# Instalar dependencias del sistema
install_dependencies() {
    log_info "Actualizando sistema..."
    apt update && apt upgrade -y
    
    log_info "Instalando dependencias básicas..."
    apt install -y curl wget git unzip nano htop
    
    log_info "Instalando Docker..."
    if ! command -v docker &> /dev/null; then
        curl -fsSL https://get.docker.com -o get-docker.sh
        sh get-docker.sh
        rm get-docker.sh
    else
        log_info "Docker ya está instalado"
    fi
    
    log_info "Instalando Docker Compose..."
    apt install -y docker-compose-plugin
    
    log_info "Instalando Nginx..."
    apt install -y nginx
    systemctl enable nginx
    
    log_info "Instalando Node.js..."
    if ! command -v node &> /dev/null; then
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs
    else
        log_info "Node.js ya está instalado"
    fi
    
    log_info "Configurando firewall..."
    ufw allow OpenSSH
    ufw allow 80/tcp
    ufw allow 443/tcp
    ufw --force enable
    
    log_info "Dependencias instaladas correctamente"
}

# Crear estructura de directorios
setup_directories() {
    log_info "Creando estructura de directorios..."
    mkdir -p ${DEPLOY_DIR}/data/postgres
    mkdir -p ${FRONTEND_DIR}
    
    log_info "Directorios creados"
}

# Clonar o actualizar repositorio
clone_repo() {
    if [ -d "${REPO_DIR}" ]; then
        log_info "Actualizando repositorio..."
        cd ${REPO_DIR}
        git pull origin main
    else
        log_info "Clonando repositorio..."
        git clone https://github.com/miguelgargurevich/pcm.git ${REPO_DIR}
    fi
}

# Configurar archivo .env
setup_env() {
    if [ ! -f "${DEPLOY_DIR}/.env" ]; then
        log_warn "Archivo .env no encontrado"
        log_info "Copiando archivo de ejemplo..."
        cp ${REPO_DIR}/deploy/.env.example ${DEPLOY_DIR}/.env
        log_warn "IMPORTANTE: Edita ${DEPLOY_DIR}/.env con tus credenciales"
        nano ${DEPLOY_DIR}/.env
    else
        log_info "Archivo .env ya existe"
    fi
}

# Copiar archivos de configuración
copy_configs() {
    log_info "Copiando docker-compose.yml..."
    cp ${REPO_DIR}/deploy/docker-compose.prod.yml ${DEPLOY_DIR}/docker-compose.yml
    
    log_info "Copiando Dockerfile..."
    cp ${REPO_DIR}/deploy/Dockerfile.backend ${DEPLOY_DIR}/Dockerfile.backend
    
    log_info "Copiando configuración de Nginx..."
    cp ${REPO_DIR}/deploy/nginx/pcm.conf ${NGINX_CONF}
    ln -sf ${NGINX_CONF} /etc/nginx/sites-enabled/pcm
    rm -f /etc/nginx/sites-enabled/default
}

# Construir backend
build_backend() {
    log_info "Construyendo imagen del backend..."
    cd ${DEPLOY_DIR}
    
    # Copiar código del backend
    rm -rf ${DEPLOY_DIR}/backend
    cp -r ${REPO_DIR}/backend ${DEPLOY_DIR}/
    
    # Ajustar docker-compose para usar el contexto correcto
    docker compose build backend
    
    log_info "Backend construido"
}

# Construir frontend
build_frontend() {
    log_info "Construyendo frontend..."
    cd ${REPO_DIR}/frontend
    
    # Crear archivo de configuración de producción
    cat > .env.production << EOF
VITE_API_URL=/api
VITE_APP_NAME=PCM
EOF
    
    npm install
    npm run build
    
    log_info "Copiando archivos del frontend..."
    rm -rf ${FRONTEND_DIR}/*
    cp -r dist/* ${FRONTEND_DIR}/
    chown -R www-data:www-data ${FRONTEND_DIR}
    
    log_info "Frontend construido y desplegado"
}

# Iniciar servicios
start_services() {
    log_info "Iniciando servicios Docker..."
    cd ${DEPLOY_DIR}
    docker compose up -d
    
    log_info "Reiniciando Nginx..."
    nginx -t && systemctl restart nginx
    
    log_info "Servicios iniciados"
}

# Detener servicios
stop_services() {
    log_info "Deteniendo servicios Docker..."
    cd ${DEPLOY_DIR}
    docker compose down
    
    log_info "Servicios detenidos"
}

# Ver logs
show_logs() {
    cd ${DEPLOY_DIR}
    docker compose logs -f
}

# Backup de la base de datos
backup_db() {
    BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
    log_info "Creando backup: ${BACKUP_FILE}"
    
    cd ${DEPLOY_DIR}
    docker exec pcm-postgres pg_dump -U pcm_user pcm_db > ${DEPLOY_DIR}/backups/${BACKUP_FILE}
    
    log_info "Backup creado: ${DEPLOY_DIR}/backups/${BACKUP_FILE}"
}

# Instalación completa
full_install() {
    check_root
    install_dependencies
    setup_directories
    clone_repo
    setup_env
    copy_configs
    build_backend
    build_frontend
    start_services
    
    echo ""
    log_info "======================================"
    log_info "Instalación completada!"
    log_info "======================================"
    log_info "Frontend: http://$(hostname -I | awk '{print $1}')"
    log_info "API: http://$(hostname -I | awk '{print $1}')/api"
    log_info ""
    log_info "Comandos útiles:"
    log_info "  Ver logs: ./deploy.sh logs"
    log_info "  Reiniciar: ./deploy.sh restart"
    log_info "  Backup: ./deploy.sh backup"
}

# Actualizar aplicación
update_app() {
    check_root
    clone_repo
    build_backend
    build_frontend
    
    log_info "Reiniciando servicios..."
    cd ${DEPLOY_DIR}
    docker compose restart backend
    
    log_info "Actualización completada"
}

# Menú principal
case "$1" in
    install)
        full_install
        ;;
    start)
        start_services
        ;;
    stop)
        stop_services
        ;;
    restart)
        stop_services
        start_services
        ;;
    logs)
        show_logs
        ;;
    backup)
        mkdir -p ${DEPLOY_DIR}/backups
        backup_db
        ;;
    update)
        update_app
        ;;
    *)
        echo "Uso: $0 {install|start|stop|restart|logs|backup|update}"
        echo ""
        echo "Comandos:"
        echo "  install  - Instalación completa del sistema"
        echo "  start    - Iniciar todos los servicios"
        echo "  stop     - Detener todos los servicios"
        echo "  restart  - Reiniciar todos los servicios"
        echo "  logs     - Ver logs en tiempo real"
        echo "  backup   - Crear backup de la base de datos"
        echo "  update   - Actualizar la aplicación desde Git"
        exit 1
        ;;
esac
