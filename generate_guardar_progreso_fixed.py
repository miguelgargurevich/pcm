#!/usr/bin/env python3
"""
Script to generate guardarProgreso blocks for Com11-Com21 - FIXED VERSION
Uses correct pattern from Com4-Com10
"""

compromisos = [
    {
        "id": 11,
        "service": "com11AportacionGeoPeruService",
        "recordIdState": "com11RecordId",
        "setRecordId": "setCom11RecordId",
        "responseIdField": "id",
        "pdfField": "pdfAportacion"
    },
    {
        "id": 12,
        "service": "com12DelegadoProteccionDatosService",
        "recordIdState": "com12RecordId",
        "setRecordId": "setCom12RecordId",
        "responseIdField": "id",
        "pdfField": "pdfResolucion"
    },
    {
        "id": 13,
        "service": "com13IntegracionPlataformaService",
        "recordIdState": "com13RecordId",
        "setRecordId": "setCom13RecordId",
        "responseIdField": "id",
        "pdfField": "pdfConvenio"
    },
    {
        "id": 14,
        "service": "com14OficialSeguridadInfoService",
        "recordIdState": "com14RecordId",
        "setRecordId": "setCom14RecordId",
        "responseIdField": "id",
        "pdfField": "pdfResolucion"
    },
    {
        "id": 15,
        "service": "com15CsirtService",
        "recordIdState": "com15RecordId",
        "setRecordId": "setCom15RecordId",
        "responseIdField": "id",
        "pdfField": "pdfResolucion"
    },
    {
        "id": 16,
        "service": "com16SgsiService",
        "recordIdState": "com16RecordId",
        "setRecordId": "setCom16RecordId",
        "responseIdField": "id",
        "pdfField": "pdfSgsi",
        "secondPdfField": "pdfCertificacion"
    },
    {
        "id": 17,
        "service": "com17PlanContinuidadService",
        "recordIdState": "com17RecordId",
        "setRecordId": "setCom17RecordId",
        "responseIdField": "id",
        "pdfField": "pdfPlan"
    },
    {
        "id": 18,
        "service": "com18PagoLineasService",
        "recordIdState": "com18RecordId",
        "setRecordId": "setCom18RecordId",
        "responseIdField": "id",
        "pdfField": "pdfOficio"
    },
    {
        "id": 19,
        "service": "com19AperturaDatosService",
        "recordIdState": "com19RecordId",
        "setRecordId": "setCom19RecordId",
        "responseIdField": "id",
        "pdfField": "pdfReporte"
    },
    {
        "id": 20,
        "service": "com20DigitalizacionTramitesService",
        "recordIdState": "com20RecordId",
        "setRecordId": "setCom20RecordId",
        "responseIdField": "id",
        "pdfField": "pdfReporte"
    },
    {
        "id": 21,
        "service": "com21OficialGobiernoDatosService",
        "recordIdState": "com21RecordId",
        "setRecordId": "setCom21RecordId",
        "responseIdField": "id",
        "pdfField": "pdfResolucion"
    }
]

output = []

for comp in compromisos:
    comp_id = comp["id"]
    service = comp["service"]
    recordIdState = comp["recordIdState"]
    setRecordId = comp["setRecordId"]
    responseIdField = comp["responseIdField"]
    pdfField = comp["pdfField"]
    has_second_pdf = "secondPdfField" in comp
    
    block = f"""
      // COMPROMISO {comp_id}
      else if (parseInt(formData.compromisoId) === {comp_id}) {{
        console.log('🚀 Preparando datos para Com{comp_id}');
        
        const com{comp_id}Data = {{
          compromisoId: {comp_id},
          entidadId: user.entidadId,
          {pdfField}: documentoUrl || null,"""
    
    # Add second PDF field if needed (Com16)
    if has_second_pdf:
        secondPdfField = comp["secondPdfField"]
        block += f"""
          {secondPdfField}: documentoUrl || null,  // TODO: handle second PDF"""
    
    block += f"""
          criteriosEvaluados: formData.criteriosEvaluados ? JSON.stringify(formData.criteriosEvaluados) : null,
          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,
          checkDdjj: formData.aceptaDeclaracionJurada || false,
          usuarioRegistra: user.usuarioId,
          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',
          ...formData
        }};
        
        console.log('Datos Com{comp_id} a enviar:', com{comp_id}Data);
        
        if ({recordIdState}) {{
          console.log('Actualizando registro existente Com{comp_id}:', {recordIdState});
          response = await {service}.update({recordIdState}, com{comp_id}Data);
        }} else {{
          console.log('Creando nuevo registro Com{comp_id}');
          response = await {service}.create(com{comp_id}Data);
          console.log('Respuesta create Com{comp_id}:', response);
          if (response.isSuccess && response.data) {{
            console.log('ID del nuevo registro Com{comp_id}:', response.data.{responseIdField});
            {setRecordId}(response.data.{responseIdField});
          }}
        }}
        
        console.log('Respuesta final Com{comp_id}:', response);
        
        // Actualizar estado local con datos guardados
        if (response.isSuccess && response.data) {{
          console.log('✅ Actualizando estado local Com{comp_id}');
          
          if (response.data.{pdfField}) {{
            setPdfUrl(response.data.{pdfField});
            if (blobUrlToRevoke) {{
              console.log('🧹 Revocando blob URL antiguo:', blobUrlToRevoke);
              URL.revokeObjectURL(blobUrlToRevoke);
            }}
          }}
          
          if (response.data.criteriosEvaluados) {{
            try {{
              const criteriosParsed = JSON.parse(response.data.criteriosEvaluados);
              setFormData(prev => ({{ ...prev, criteriosEvaluados: criteriosParsed }}));
            }} catch (e) {{
              console.error('❌ Error al parsear criterios:', e);
            }}
          }}
        }}
      }}"""
    
    output.append(block)

# Write to file
output_text = "\n".join(output)
with open('/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/guardar_progreso_com11_21_fixed.txt', 'w', encoding='utf-8') as f:
    f.write(output_text)

print(f"✅ Generated FIXED guardarProgreso blocks for Com11-Com{compromisos[-1]['id']}")
print(f"📄 Saved to: guardar_progreso_com11_21_fixed.txt")
print(f"📏 Total lines: {len(output_text.splitlines())}")
