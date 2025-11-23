#!/usr/bin/env python3
"""
Script to generate loadCumplimiento blocks for Com11-Com21
"""

compromisos = [
    {
        "number": "11",
        "name": "AportacionGeoPeru",
        "recordId": "com11RecordId",
        "setRecordId": "setCom11RecordId",
        "idField": "comagpEntId",
        "fields": """
              urlInformacionGeoespacial: data.urlInformacionGeoespacial || '',
              tipoInformacionPublicada: data.tipoInformacionPublicada || '',
              totalCapasPublicadas: data.totalCapasPublicadas || '',
              fechaUltimaActualizacionAgp: data.fechaUltimaActualizacionAgp ? data.fechaUltimaActualizacionAgp.split('T')[0] : '',
              responsableAgp: data.responsableAgp || '',
              cargoResponsableAgp: data.cargoResponsableAgp || '',
              correoResponsableAgp: data.correoResponsableAgp || '',
              telefonoResponsableAgp: data.telefonoResponsableAgp || '',
              numeroNormaAprobacionAgp: data.numeroNormaAprobacionAgp || '',
              fechaAprobacionAgp: data.fechaAprobacionAgp ? data.fechaAprobacionAgp.split('T')[0] : '',
              informacionInteroperable: data.informacionInteroperable || false,
              observacionAgp: data.observacionAgp || '',""",
        "pdfField": "rutaPdfAgp"
    },
    {
        "number": "12",
        "name": "ResponsableSoftwarePublico",
        "recordId": "com12RecordId",
        "setRecordId": "setCom12RecordId",
        "idField": "comrspEntId",
        "fields": """
              dniResponsableSp: data.dniResponsableSp || '',
              nombresResponsableSp: data.nombresResponsableSp || '',
              apellidosResponsableSp: data.apellidosResponsableSp || '',
              cargoResponsableSp: data.cargoResponsableSp || '',
              correoResponsableSp: data.correoResponsableSp || '',
              telefonoResponsableSp: data.telefonoResponsableSp || '',
              fechaDesignacionSp: data.fechaDesignacionSp ? data.fechaDesignacionSp.split('T')[0] : '',
              numeroResolucionSp: data.numeroResolucionSp || '',
              observacionSp: data.observacionSp || '',""",
        "pdfField": "rutaPdfSp"
    },
    {
        "number": "13",
        "name": "InteroperabilidadPIDE",
        "recordId": "com13RecordId",
        "setRecordId": "setCom13RecordId",
        "idField": "comipideEntId",
        "fields": """
              tipoIntegracionPide: data.tipoIntegracionPide || '',
              nombreServicioPide: data.nombreServicioPide || '',
              descripcionServicioPide: data.descripcionServicioPide || '',
              fechaInicioIntegracionPide: data.fechaInicioIntegracionPide ? data.fechaInicioIntegracionPide.split('T')[0] : '',
              urlServicioPide: data.urlServicioPide || '',
              responsableTecnicoPide: data.responsableTecnicoPide || '',
              cargoResponsablePide: data.cargoResponsablePide || '',
              correoResponsablePide: data.correoResponsablePide || '',
              telefonoResponsablePide: data.telefonoResponsablePide || '',
              convenioPide: data.convenioPide || '',
              fechaConvenioPide: data.fechaConvenioPide ? data.fechaConvenioPide.split('T')[0] : '',
              activoPide: data.activoPide || false,
              observacionPide: data.observacionPide || '',""",
        "pdfField": "rutaPdfPide"
    },
    {
        "number": "14",
        "name": "OficialSeguridadDigital",
        "recordId": "com14RecordId",
        "setRecordId": "setCom14RecordId",
        "idField": "comoscdEntId",
        "fields": """
              dniOscd: data.dniOscd || '',
              nombresOscd: data.nombresOscd || '',
              apellidosOscd: data.apellidosOscd || '',
              cargoOscd: data.cargoOscd || '',
              correoOscd: data.correoOscd || '',
              telefonoOscd: data.telefonoOscd || '',
              fechaDesignacionOscd: data.fechaDesignacionOscd ? data.fechaDesignacionOscd.split('T')[0] : '',
              numeroResolucionOscd: data.numeroResolucionOscd || '',
              comunicadaPcmOscd: data.comunicadaPcmOscd || false,
              observacionOscd: data.observacionOscd || '',""",
        "pdfField": "rutaPdfOscd"
    },
    {
        "number": "15",
        "name": "CSIRTInstitucional",
        "recordId": "com15RecordId",
        "setRecordId": "setCom15RecordId",
        "idField": "comcsirtEntId",
        "fields": """
              nombreCsirt: data.nombreCsirt || '',
              fechaConformacionCsirt: data.fechaConformacionCsirt ? data.fechaConformacionCsirt.split('T')[0] : '',
              numeroResolucionCsirt: data.numeroResolucionCsirt || '',
              responsableCsirt: data.responsableCsirt || '',
              cargoResponsableCsirt: data.cargoResponsableCsirt || '',
              correoResponsableCsirt: data.correoResponsableCsirt || '',
              telefonoResponsableCsirt: data.telefonoResponsableCsirt || '',
              protocoloCsirt: data.protocoloCsirt || false,
              comunicadaPcmCsirt: data.comunicadaPcmCsirt || false,
              observacionCsirt: data.observacionCsirt || '',""",
        "pdfField": "rutaPdfCsirt"
    },
    {
        "number": "16",
        "name": "SistemaGestionSeguridad",
        "recordId": "com16RecordId",
        "setRecordId": "setCom16RecordId",
        "idField": "comsgsiEntId",
        "fields": """
              responsableSgsi: data.responsableSgsi || '',
              cargoResponsableSgsi: data.cargoResponsableSgsi || '',
              correoResponsableSgsi: data.correoResponsableSgsi || '',
              telefonoResponsableSgsi: data.telefonoResponsableSgsi || '',
              estadoSgsi: data.estadoSgsi || '',
              versionNormaSgsi: data.versionNormaSgsi || '',
              alcanceSgsi: data.alcanceSgsi || '',
              fechaInicioSgsi: data.fechaInicioSgsi ? data.fechaInicioSgsi.split('T')[0] : '',
              fechaCertificacionSgsi: data.fechaCertificacionSgsi ? data.fechaCertificacionSgsi.split('T')[0] : '',
              entidadCertificadoraSgsi: data.entidadCertificadoraSgsi || '',
              observacionSgsi: data.observacionSgsi || '',""",
        "pdfField": "rutaPdfPoliticasSgsi",
        "pdfField2": "rutaPdfCertificacionSgsi"
    },
    {
        "number": "17",
        "name": "PlanTransicionIPv6",
        "recordId": "com17RecordId",
        "setRecordId": "setCom17RecordId",
        "idField": "comptipv6EntId",
        "fields": """
              responsablePtipv6: data.responsablePtipv6 || '',
              cargoResponsablePtipv6: data.cargoResponsablePtipv6 || '',
              correoResponsablePtipv6: data.correoResponsablePtipv6 || '',
              telefonoResponsablePtipv6: data.telefonoResponsablePtipv6 || '',
              estadoPlanPtipv6: data.estadoPlanPtipv6 || '',
              fechaFormulacionPtipv6: data.fechaFormulacionPtipv6 ? data.fechaFormulacionPtipv6.split('T')[0] : '',
              fechaAprobacionPtipv6: data.fechaAprobacionPtipv6 ? data.fechaAprobacionPtipv6.split('T')[0] : '',
              fechaInicioPtipv6: data.fechaInicioPtipv6 ? data.fechaInicioPtipv6.split('T')[0] : '',
              fechaFinEstimadaPtipv6: data.fechaFinEstimadaPtipv6 ? data.fechaFinEstimadaPtipv6.split('T')[0] : '',
              descripcionPtipv6: data.descripcionPtipv6 || '',
              observacionPtipv6: data.observacionPtipv6 || '',""",
        "pdfField": "rutaPdfPtipv6"
    },
    {
        "number": "18",
        "name": "AccesoPortalTransparencia",
        "recordId": "com18RecordId",
        "setRecordId": "setCom18RecordId",
        "idField": "comapteEntId",
        "fields": """
              responsableApte: data.responsableApte || '',
              cargoResponsableApte: data.cargoResponsableApte || '',
              correoResponsableApte: data.correoResponsableApte || '',
              telefonoResponsableApte: data.telefonoResponsableApte || '',
              oficioSolicitudApte: data.oficioSolicitudApte || '',
              fechaSolicitudApte: data.fechaSolicitudApte ? data.fechaSolicitudApte.split('T')[0] : '',
              fechaConcesionApte: data.fechaConcesionApte ? data.fechaConcesionApte.split('T')[0] : '',
              estadoAccesoApte: data.estadoAccesoApte || '',
              enlacePortalApte: data.enlacePortalApte || '',
              descripcionApte: data.descripcionApte || '',
              observacionApte: data.observacionApte || '',""",
        "pdfField": "rutaPdfApte"
    },
    {
        "number": "19",
        "name": "EncuestaNacionalGobDigital",
        "recordId": "com19RecordId",
        "setRecordId": "setCom19RecordId",
        "idField": "comenadEntId",
        "fields": """
              anioEnad: data.anioEnad || '',
              responsableEnad: data.responsableEnad || '',
              cargoResponsableEnad: data.cargoResponsableEnad || '',
              correoResponsableEnad: data.correoResponsableEnad || '',
              telefonoResponsableEnad: data.telefonoResponsableEnad || '',
              fechaEnvioEnad: data.fechaEnvioEnad ? data.fechaEnvioEnad.split('T')[0] : '',
              estadoEnad: data.estadoEnad || '',
              enlaceEnad: data.enlaceEnad || '',
              observacionEnad: data.observacionEnad || '',""",
        "pdfField": "rutaPdfEnad"
    },
    {
        "number": "20",
        "name": "DigitalizacionServiciosFacilita",
        "recordId": "com20RecordId",
        "setRecordId": "setCom20RecordId",
        "idField": "comdsfpEntId",
        "fields": """
              responsableDsfp: data.responsableDsfp || '',
              cargoResponsableDsfp: data.cargoResponsableDsfp || '',
              correoResponsableDsfp: data.correoResponsableDsfp || '',
              telefonoResponsableDsfp: data.telefonoResponsableDsfp || '',
              estadoImplementacionDsfp: data.estadoImplementacionDsfp || '',
              fechaInicioDsfp: data.fechaInicioDsfp ? data.fechaInicioDsfp.split('T')[0] : '',
              fechaUltimoAvanceDsfp: data.fechaUltimoAvanceDsfp ? data.fechaUltimoAvanceDsfp.split('T')[0] : '',
              totalServiciosDigitalizadosDsfp: data.totalServiciosDigitalizadosDsfp || '',
              observacionDsfp: data.observacionDsfp || '',""",
        "pdfField": "rutaPdfDsfp"
    },
    {
        "number": "21",
        "name": "OficialGobiernoDatos",
        "recordId": "com21RecordId",
        "setRecordId": "setCom21RecordId",
        "idField": "comogdEntId",
        "fields": """
              dniOgd: data.dniOgd || '',
              nombresOgd: data.nombresOgd || '',
              apellidosOgd: data.apellidosOgd || '',
              cargoOgd: data.cargoOgd || '',
              correoOgd: data.correoOgd || '',
              telefonoOgd: data.telefonoOgd || '',
              fechaDesignacionOgd: data.fechaDesignacionOgd ? data.fechaDesignacionOgd.split('T')[0] : '',
              numeroResolucionOgd: data.numeroResolucionOgd || '',
              comunicadaSgtdOgd: data.comunicadaSgtdOgd || false,
              observacionOgd: data.observacionOgd || '',""",
        "pdfField": "rutaPdfOgd"
    }
]

def generate_load_block(comp):
    pdf_field2_logic = ""
    if "pdfField2" in comp:
        pdf_field2_logic = f"""
            // Si hay segundo documento guardado
            if (data.{comp['pdfField2']}) {{
              console.log('📄 Cargando segundo PDF guardado desde:', data.{comp['pdfField2']});
              setPdfUrl2(data.{comp['pdfField2']});
            }}"""
    
    return f"""
      // COMPROMISO {comp['number']}: {comp['name']}
      if (compromisoId === {comp['number']} && user?.entidadId) {{
        console.log('📞 Llamando getByEntidad con:', {comp['number']}, user.entidadId);
        const response = await com{comp['number']}{comp['name']}Service.getByEntidad({comp['number']}, user.entidadId);
        console.log('📦 Respuesta de getByEntidad:', response);
        
        if (response.isSuccess) {{
          const data = response.data;
          console.log('📄 Datos recibidos:', data);
          
          if (data) {{
            {comp['setRecordId']}(data.{comp['idField']});
            
            // Parsear criterios evaluados desde JSON
            let criteriosParsed = [];
            if (data.criteriosEvaluados) {{
              try {{
                criteriosParsed = JSON.parse(data.criteriosEvaluados);
                console.log('✅ Criterios cargados:', criteriosParsed);
              }} catch (e) {{
                console.error('❌ Error al parsear criterios:', e);
              }}
            }}
            
            setFormData({{
              compromisoId: '{comp['number']}',
{comp['fields']}
              documentoFile: null,
              criteriosEvaluados: criteriosParsed,
              aceptaPoliticaPrivacidad: data.checkPrivacidad || false,
              aceptaDeclaracionJurada: data.checkDdjj || false,
              estado: data.estado === 'bandeja' ? 1 : data.estado === 'sin_reportar' ? 2 : 3
            }});
            
            setHaVistoPolitica(data.checkPrivacidad);
            setHaVistoDeclaracion(data.checkDdjj);
            
            // Si hay documento guardado, establecer la URL para vista previa
            if (data.{comp['pdfField']}) {{
              console.log('📄 Cargando PDF guardado desde:', data.{comp['pdfField']});
              setPdfUrl(data.{comp['pdfField']});
            }}{pdf_field2_logic}
          }} else {{
            // No existe registro, inicializar
            setFormData(prev => ({{ ...prev, compromisoId: '{comp['number']}' }}));
          }}
          setLoading(false);
          return;
        }}
      }}
"""

def main():
    output = ""
    for comp in compromisos:
        output += generate_load_block(comp)
    
    # Write to a file for easy copying
    with open('/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/frontend/load_cumplimiento_com11_21.txt', 'w', encoding='utf-8') as f:
        f.write(output)
    
    print("✅ Generated loadCumplimiento blocks for Com11-Com21")
    print("📄 Saved to: load_cumplimiento_com11_21.txt")

if __name__ == "__main__":
    main()
