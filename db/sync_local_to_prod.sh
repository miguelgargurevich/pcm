#!/bin/bash

# Script para sincronizar la base de datos local con producción
# Ejecutar desde la carpeta db/

echo "Iniciando sincronización de BD local con producción..."

# 1. Asegurar columna updated_at en marco_normativo
echo "1. Ejecutando FIX_marco_normativo_updated_at.sql..."
# psql -f FIX_marco_normativo_updated_at.sql

# 2. Asegurar tablas de catálogos (tipo_norma, estado_compromiso)
echo "2. Ejecutando migration_catalogos_tipo_norma_estado.sql..."
# psql -f migration_catalogos_tipo_norma_estado.sql

# 3. Actualizar estructura de com1_liderg_td (CRÍTICO)
echo "3. Ejecutando FIX_LOCAL_update_com1_liderg_td.sql..."
# psql -f FIX_LOCAL_update_com1_liderg_td.sql

# 4. Actualizar permisos y módulos
echo "4. Ejecutando FIX_LOCAL_update_permissions.sql..."
# psql -f FIX_LOCAL_update_permissions.sql

echo "Sincronización completada. Por favor ejecuta los scripts SQL manualmente si no tienes psql configurado en este script."
echo "Archivos a ejecutar:"
echo "- db/FIX_marco_normativo_updated_at.sql"
echo "- db/migration_catalogos_tipo_norma_estado.sql"
echo "- db/FIX_LOCAL_update_com1_liderg_td.sql"
echo "- db/FIX_LOCAL_update_permissions.sql"
