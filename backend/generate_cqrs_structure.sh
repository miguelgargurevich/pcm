#!/bin/bash

# Script para generar automáticamente las estructuras CQRS para compromisos 11-21

BASE_APP_DIR="/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/backend/PCM.Application/Features"
BASE_INFRA_DIR="/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/backend/PCM.Infrastructure/Handlers"

# Definir compromisos con sus nombres y campos clave
declare -A compromisos
compromisos=(
    ["11"]="Com11AportacionGeoPeru|ComagpEntId|com11_agp|Agp"
    ["12"]="Com12ResponsableSoftwarePublico|ComrspEntId|com12_rsp|Rsp"
    ["13"]="Com13InteroperabilidadPIDE|ComipideEntId|com13_ipide|Ipide"
    ["14"]="Com14OficialSeguridadDigital|ComoscdEntId|com14_oscd|Oscd"
    ["15"]="Com15CSIRTInstitucional|ComcsirtEntId|com15_csirt|Csirt"
    ["16"]="Com16SistemaGestionSeguridad|ComsgsiEntId|com16_sgsi|Sgsi"
    ["17"]="Com17PlanTransicionIPv6|Comptipv6EntId|com17_ptipv6|Ptipv6"
    ["18"]="Com18AccesoPortalTransparencia|ComapteEntId|com18_apte|Apte"
    ["19"]="Com19EncuestaNacionalGobDigital|ComenadEntId|com19_enad|Enad"
    ["20"]="Com20DigitalizacionServiciosFacilita|ComdsfpEntId|com20_dsfp|Dsfp"
    ["21"]="Com21OficialGobiernoDatos|ComogdEntId|com21_ogd|Ogd"
)

echo "Generando estructuras CQRS para compromisos 11-21..."

for num in {11..21}; do
    IFS='|' read -r class_name pk_name table_name suffix <<< "${compromisos[$num]}"
    
    echo "Procesando $class_name..."
    
    # Crear directorios
    mkdir -p "$BASE_APP_DIR/$class_name/Commands/Create$class_name"
    mkdir -p "$BASE_APP_DIR/$class_name/Commands/Update$class_name"
    mkdir -p "$BASE_APP_DIR/$class_name/Queries/Get$class_name"
    mkdir -p "$BASE_INFRA_DIR/$class_name"
    
done

echo "Estructura de directorios creada exitosamente!"
