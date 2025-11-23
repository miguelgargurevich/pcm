// Template para insertar después de cada setPdfUrl para compromisos 11-21
const template = (compromisoId) => `
            
            // Intentar cargar también datos de Paso 2 (cumplimiento_normativo) si existen
            try {
              const cumplimientoResponse = await cumplimientoService.getAll({ 
                compromisoId: ${compromisoId}, 
                entidadId: user.entidadId 
              });
              if (cumplimientoResponse.isSuccess || cumplimientoResponse.success) {
                const cumplimientoList = cumplimientoResponse.data || [];
                const cumplimientoData = Array.isArray(cumplimientoList) ? cumplimientoList[0] : cumplimientoList;
                if (cumplimientoData) {
                  console.log('📄 Datos de cumplimiento (Paso 2) encontrados:', cumplimientoData);
                  if (cumplimientoData.criteriosEvaluados && Array.isArray(cumplimientoData.criteriosEvaluados)) {
                    setFormData(prev => ({ ...prev, criteriosEvaluados: cumplimientoData.criteriosEvaluados }));
                  }
                  if (cumplimientoData.documentoUrl) {
                    console.log('📄 Cargando PDF normativo (Paso 2) desde:', cumplimientoData.documentoUrl);
                    setPdfUrlPaso2(cumplimientoData.documentoUrl);
                  }
                }
              }
            } catch (error) {
              console.log('ℹ️ No hay datos de cumplimiento (Paso 2) aún:', error.message);
            }`;

// Com11: archivoPlan (línea 926)
// Com12: archivoDocumento (línea 970)
// Com13: archivoPlan (línea 1015)
// Com14: archivoDocumento (línea 1059)
// Com15: no tiene PDF en paso 1
// Com16: no tiene PDF en paso 1
// Com17: rutaPdfPtipv6 (línea 1209)
// Com18: rutaPdfApte (línea 1263)
// Com19: rutaPdfEnad (línea 1316)
// Com20: rutaPdfDsfp (línea 1368)
// Com21: rutaPdfOgd (línea 1422)
