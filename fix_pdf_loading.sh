#!/bin/bash

# Script para agregar la lógica de carga de PDFs de Paso 2 en todos los compromisos restantes

FILE="/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/frontend/src/pages/CumplimientoNormativoDetalle.jsx"

# Backup del archivo
cp "$FILE" "$FILE.backup"

# Com11: rutaPdfAgp
sed -i '' '/if (data.rutaPdfAgp) {/{
n
s/console.log/console.log/
a\
            }\
            \
            // Intentar cargar también datos de Paso 2 (cumplimiento_normativo) si existen\
            try {\
              const cumplimientoResponse = await cumplimientoService.getAll({ \
                compromisoId: 11, \
                entidadId: user.entidadId \
              });\
              if (cumplimientoResponse.isSuccess || cumplimientoResponse.success) {\
                const cumplimientoList = cumplimientoResponse.data || [];\
                const cumplimientoData = Array.isArray(cumplimientoList) ? cumplimientoList[0] : cumplimientoList;\
                if (cumplimientoData) {\
                  console.log("📄 Datos de cumplimiento (Paso 2) encontrados:", cumplimientoData);\
                  if (cumplimientoData.criteriosEvaluados && Array.isArray(cumplimientoData.criteriosEvaluados)) {\
                    setFormData(prev => ({ ...prev, criteriosEvaluados: cumplimientoData.criteriosEvaluados }));\
                  }\
                  if (cumplimientoData.documentoUrl) {\
                    console.log("📄 Cargando PDF normativo (Paso 2) desde:", cumplimientoData.documentoUrl);\
                    setPdfUrlPaso2(cumplimientoData.documentoUrl);\
                  }\
                }\
              }\
            } catch (error) {\
              console.log("ℹ️ No hay datos de cumplimiento (Paso 2) aún:", error.message);
}' "$FILE"

echo "✅ Cambios aplicados. Revisa el archivo."
