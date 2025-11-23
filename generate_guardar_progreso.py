#!/usr/bin/env python3
"""
Script to generate guardarProgreso blocks for Com11-Com21
Author: Generated for PCM Project
"""

compromisos = [
    {
        "id": 11,
        "service": "com11AportacionGeoPeruService",
        "pdf_field": "pdfAportacion",
        "second_pdf": False
    },
    {
        "id": 12,
        "service": "com12DelegadoProteccionDatosService",
        "pdf_field": "pdfResolucion",
        "second_pdf": False
    },
    {
        "id": 13,
        "service": "com13IntegracionPlataformaService",
        "pdf_field": "pdfConvenio",
        "second_pdf": False
    },
    {
        "id": 14,
        "service": "com14OficialSeguridadInfoService",
        "pdf_field": "pdfResolucion",
        "second_pdf": False
    },
    {
        "id": 15,
        "service": "com15CsirtService",
        "pdf_field": "pdfResolucion",
        "second_pdf": False
    },
    {
        "id": 16,
        "service": "com16SgsiService",
        "pdf_field": "pdfSgsi",
        "second_pdf": True,
        "second_pdf_field": "pdfCertificacion"
    },
    {
        "id": 17,
        "service": "com17PlanContinuidadService",
        "pdf_field": "pdfPlan",
        "second_pdf": False
    },
    {
        "id": 18,
        "service": "com18PagoLineasService",
        "pdf_field": "pdfOficio",
        "second_pdf": False
    },
    {
        "id": 19,
        "service": "com19AperturaDatosService",
        "pdf_field": "pdfReporte",
        "second_pdf": False
    },
    {
        "id": 20,
        "service": "com20DigitalizacionTramitesService",
        "pdf_field": "pdfReporte",
        "second_pdf": False
    },
    {
        "id": 21,
        "service": "com21OficialGobiernoDatosService",
        "pdf_field": "pdfResolucion",
        "second_pdf": False
    }
]

output = []

for comp in compromisos:
    comp_id = comp["id"]
    service = comp["service"]
    pdf_field = comp["pdf_field"]
    second_pdf = comp["second_pdf"]
    
    block = f"""
      // Com{comp_id} - guardarProgreso
      else if (parseInt(formData.compromisoId) === {comp_id}) {{
        console.log('guardarProgreso Com{comp_id}:', formData.recordId{comp_id});
        
        // Upload PDF if needed
        let {pdf_field}Url = formData.{pdf_field} || null;
        if (pdfUrl && pdfUrl.startsWith('blob:')) {{
          const pdfFile = await fetch(pdfUrl).then(r => r.blob());
          {pdf_field}Url = await uploadPDF(pdfFile, `com{comp_id}_${{entidadId}}_${{Date.now()}}.pdf`);
          URL.revokeObjectURL(pdfUrl);
          setPdfUrl(null);
        }}
"""
    
    # Add second PDF handling for Com16
    if second_pdf:
        second_pdf_field = comp["second_pdf_field"]
        block += f"""
        // Upload second PDF for Com{comp_id}
        let {second_pdf_field}Url = formData.{second_pdf_field} || null;
        if (pdfUrl2 && pdfUrl2.startsWith('blob:')) {{
          const pdfFile2 = await fetch(pdfUrl2).then(r => r.blob());
          {second_pdf_field}Url = await uploadPDF(pdfFile2, `com{comp_id}_cert_${{entidadId}}_${{Date.now()}}.pdf`);
          URL.revokeObjectURL(pdfUrl2);
          setPdfUrl2(null);
        }}
"""
    
    block += f"""
        const dataCom{comp_id} = {{
          entidadId,
          ...formData,
          {pdf_field}: {pdf_field}Url"""
    
    if second_pdf:
        block += f""",
          {second_pdf_field}: {second_pdf_field}Url"""
    
    block += f"""
        }};

        if (formData.recordId{comp_id}) {{
          // Update existing
          const updatedRecord = await {service}.update(formData.recordId{comp_id}, dataCom{comp_id});
          console.log('Com{comp_id} updated:', updatedRecord);
        }} else {{
          // Create new
          const newRecord = await {service}.create(dataCom{comp_id});
          console.log('Com{comp_id} created:', newRecord);
          setFormData(prev => ({{ ...prev, recordId{comp_id}: newRecord.id }}));
        }}

        // Update criteriosEvaluados
        const criteriosActuales = typeof compromisoSeleccionado.criteriosEvaluados === 'string'
          ? JSON.parse(compromisoSeleccionado.criteriosEvaluados)
          : compromisoSeleccionado.criteriosEvaluados || {{}};
        criteriosActuales[pasoActual] = true;

        await updateCriteriosEvaluados(
          compromisoSeleccionado.id,
          JSON.stringify(criteriosActuales)
        );
      }}"""
    
    output.append(block)

# Write to file
output_text = "\n".join(output)
with open('/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/guardar_progreso_com11_21.txt', 'w', encoding='utf-8') as f:
    f.write(output_text)

print(f"✅ Generated guardarProgreso blocks for Com11-Com{compromisos[-1]['id']}")
print(f"📄 Saved to: guardar_progreso_com11_21.txt")
print(f"📏 Total lines: {len(output_text.splitlines())}")
