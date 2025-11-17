#!/bin/bash

# Script de prueba para verificar endpoints de la API PCM
# Ejecutar después de iniciar el servidor con: npm run dev

BASE_URL="http://localhost:5164/api"
TOKEN=""

echo "╔════════════════════════════════════════════════════════════╗"
echo "║     PRUEBAS DE API - PLATAFORMA DE CUMPLIMIENTO DIGITAL   ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir resultados
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

print_section() {
    echo ""
    echo -e "${BLUE}═══ $1 ═══${NC}"
}

# 1. LOGIN
print_section "1. AUTENTICACIÓN"
echo -e "${YELLOW}Probando login con admin@pcm.gob.pe...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/Auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@pcm.gob.pe",
    "password": "Admin123!"
  }')

echo "$LOGIN_RESPONSE" | jq '.' 2>/dev/null

if echo "$LOGIN_RESPONSE" | jq -e '.data.accessToken' > /dev/null 2>&1; then
    TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.data.accessToken')
    print_result 0 "Login exitoso - Token obtenido"
    echo "Token: ${TOKEN:0:50}..."
else
    print_result 1 "Login falló - Usando endpoint sin autenticación"
fi

# 2. CATÁLOGOS
print_section "2. CATÁLOGOS (públicos o con auth)"

echo -e "${YELLOW}Probando catálogo de niveles de gobierno...${NC}"
NIVELES_RESPONSE=$(curl -s -X GET "$BASE_URL/Catalogos/niveles-gobierno" \
  -H "Authorization: Bearer $TOKEN")
echo "$NIVELES_RESPONSE" | jq '.' 2>/dev/null | head -20
if [ $? -eq 0 ]; then
    print_result 0 "Catálogo Niveles de Gobierno obtenido"
else
    print_result 1 "Error al obtener Niveles de Gobierno"
fi

echo ""
echo -e "${YELLOW}Probando catálogo de sectores...${NC}"
SECTORES_RESPONSE=$(curl -s -X GET "$BASE_URL/Catalogos/sectores" \
  -H "Authorization: Bearer $TOKEN")
echo "$SECTORES_RESPONSE" | jq '.' 2>/dev/null | head -20
if [ $? -eq 0 ]; then
    print_result 0 "Catálogo Sectores obtenido"
else
    print_result 1 "Error al obtener Sectores"
fi

echo ""
echo -e "${YELLOW}Probando catálogo de tipos de norma...${NC}"
TIPOS_NORMA_RESPONSE=$(curl -s -X GET "$BASE_URL/Catalogos/tipos-norma" \
  -H "Authorization: Bearer $TOKEN")
echo "$TIPOS_NORMA_RESPONSE" | jq '.' 2>/dev/null | head -20
if [ $? -eq 0 ]; then
    print_result 0 "Catálogo Tipos de Norma obtenido"
else
    print_result 1 "Error al obtener Tipos de Norma"
fi

echo ""
echo -e "${YELLOW}Probando catálogo de estados...${NC}"
ESTADOS_RESPONSE=$(curl -s -X GET "$BASE_URL/Catalogos/estados" \
  -H "Authorization: Bearer $TOKEN")
echo "$ESTADOS_RESPONSE" | jq '.' 2>/dev/null | head -20
if [ $? -eq 0 ]; then
    print_result 0 "Catálogo Estados obtenido"
else
    print_result 1 "Error al obtener Estados"
fi

# 3. USUARIOS (requiere autenticación)
if [ -n "$TOKEN" ]; then
    print_section "3. USUARIOS"
    
    echo -e "${YELLOW}Listando usuarios...${NC}"
    USUARIOS_RESPONSE=$(curl -s -X GET "$BASE_URL/Usuario" \
      -H "Authorization: Bearer $TOKEN")
    echo "$USUARIOS_RESPONSE" | jq '.' 2>/dev/null | head -30
    if [ $? -eq 0 ]; then
        print_result 0 "Listado de usuarios obtenido"
    else
        print_result 1 "Error al listar usuarios"
    fi

    # 4. ENTIDADES
    print_section "4. ENTIDADES"
    
    echo -e "${YELLOW}Listando entidades...${NC}"
    ENTIDADES_RESPONSE=$(curl -s -X GET "$BASE_URL/Entidad" \
      -H "Authorization: Bearer $TOKEN")
    echo "$ENTIDADES_RESPONSE" | jq '.' 2>/dev/null | head -30
    if [ $? -eq 0 ]; then
        print_result 0 "Listado de entidades obtenido"
    else
        print_result 1 "Error al listar entidades"
    fi

    # 5. MARCO NORMATIVO
    print_section "5. MARCO NORMATIVO"
    
    echo -e "${YELLOW}Listando normas...${NC}"
    NORMAS_RESPONSE=$(curl -s -X GET "$BASE_URL/MarcoNormativo" \
      -H "Authorization: Bearer $TOKEN")
    echo "$NORMAS_RESPONSE" | jq '.' 2>/dev/null | head -30
    if [ $? -eq 0 ]; then
        print_result 0 "Listado de normas obtenido"
    else
        print_result 1 "Error al listar normas"
    fi

    # 6. COMPROMISOS
    print_section "6. COMPROMISOS GOBIERNO DIGITAL"
    
    echo -e "${YELLOW}Listando compromisos...${NC}"
    COMPROMISOS_RESPONSE=$(curl -s -X GET "$BASE_URL/CompromisoGobiernoDigital" \
      -H "Authorization: Bearer $TOKEN")
    echo "$COMPROMISOS_RESPONSE" | jq '.' 2>/dev/null | head -30
    if [ $? -eq 0 ]; then
        print_result 0 "Listado de compromisos obtenido"
    else
        print_result 1 "Error al listar compromisos"
    fi
else
    echo -e "${YELLOW}⚠ Saltando pruebas que requieren autenticación${NC}"
fi

# RESUMEN
print_section "RESUMEN"
echo "Las pruebas se completaron. Verifica los resultados arriba."
echo ""
echo "Para pruebas detalladas de CREATE/UPDATE/DELETE:"
echo "  1. Inicia sesión en http://localhost:5173"
echo "  2. Prueba crear/editar/eliminar registros desde la UI"
echo ""
