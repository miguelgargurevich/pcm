#!/usr/bin/env python3
"""
Script to generate UI forms for Com11-Com21
Author: Generated for PCM Project
"""

compromisos = [
    {
        "id": 11,
        "title": "Aportación de Información Geoespacial al Proyecto GeoPerú",
        "fields": [
            {"name": "urlInformacionGeoespacial", "label": "URL de información geoespacial", "type": "url", "required": True},
            {"name": "tipoInformacion", "label": "Tipo de información", "type": "text", "required": True},
            {"name": "totalCapas", "label": "Total de capas", "type": "number", "required": True},
            {"name": "fechaActualizacion", "label": "Fecha de actualización", "type": "date", "required": True},
            {"name": "nombreResponsable", "label": "Nombre del responsable", "type": "text", "required": True, "section": "Responsable Técnico"},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "normaAprobacion", "label": "Norma de aprobación", "type": "text", "required": True, "section": "Información Normativa"},
            {"name": "fechaAprobacionNorma", "label": "Fecha de aprobación", "type": "date", "required": False},
            {"name": "interoperable", "label": "¿Es interoperable?", "type": "checkbox", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfAportacion"
    },
    {
        "id": 12,
        "title": "Delegado de Protección de Datos Personales",
        "fields": [
            {"name": "dniDelegado", "label": "DNI", "type": "text", "required": True, "maxLength": 8},
            {"name": "nombresDelegado", "label": "Nombres", "type": "text", "required": True},
            {"name": "apellidoPaternoDelegado", "label": "Apellido paterno", "type": "text", "required": True},
            {"name": "apellidoMaternoDelegado", "label": "Apellido materno", "type": "text", "required": True},
            {"name": "cargoDelegado", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoDelegado", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoDelegado", "label": "Teléfono", "type": "text", "required": False},
            {"name": "fechaDesignacion", "label": "Fecha de designación", "type": "date", "required": True},
            {"name": "resolucionDesignacion", "label": "Resolución de designación", "type": "text", "required": True},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfResolucion"
    },
    {
        "id": 13,
        "title": "Integración a Plataforma de Interoperabilidad del Estado (PIDE)",
        "fields": [
            {"name": "tipoIntegracion", "label": "Tipo de integración", "type": "select", "required": True, "options": ["Proveedor", "Consumidor", "Ambos"]},
            {"name": "nombreServicio", "label": "Nombre del servicio", "type": "text", "required": True},
            {"name": "descripcionServicio", "label": "Descripción del servicio", "type": "textarea", "required": False},
            {"name": "fechaInicioIntegracion", "label": "Fecha de inicio", "type": "date", "required": True},
            {"name": "urlServicio", "label": "URL del servicio", "type": "url", "required": False},
            {"name": "responsableTecnico", "label": "Nombre del responsable técnico", "type": "text", "required": True, "section": "Responsable Técnico"},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "convenioMarco", "label": "Convenio marco", "type": "text", "required": True, "section": "Información del Convenio"},
            {"name": "fechaConvenio", "label": "Fecha del convenio", "type": "date", "required": False},
            {"name": "servicioActivo", "label": "¿Servicio activo?", "type": "checkbox", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfConvenio"
    },
    {
        "id": 14,
        "title": "Oficial de Seguridad de la Información",
        "fields": [
            {"name": "dniOficial", "label": "DNI", "type": "text", "required": True, "maxLength": 8},
            {"name": "nombresOficial", "label": "Nombres", "type": "text", "required": True},
            {"name": "apellidoPaternoOficial", "label": "Apellido paterno", "type": "text", "required": True},
            {"name": "apellidoMaternoOficial", "label": "Apellido materno", "type": "text", "required": True},
            {"name": "cargoOficial", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoOficial", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoOficial", "label": "Teléfono", "type": "text", "required": False},
            {"name": "fechaDesignacion", "label": "Fecha de designación", "type": "date", "required": True},
            {"name": "resolucionDesignacion", "label": "Resolución de designación", "type": "text", "required": True},
            {"name": "comunicadaPcm", "label": "¿Comunicada a la PCM?", "type": "checkbox", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfResolucion"
    },
    {
        "id": 15,
        "title": "CSIRT Institucional",
        "fields": [
            {"name": "nombreCsirt", "label": "Nombre del CSIRT", "type": "text", "required": True},
            {"name": "fechaConformacion", "label": "Fecha de conformación", "type": "date", "required": True},
            {"name": "resolucionConformacion", "label": "Resolución de conformación", "type": "text", "required": True},
            {"name": "responsableCsirt", "label": "Nombre del responsable", "type": "text", "required": True, "section": "Responsable del CSIRT"},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "protocoloGestionIncidentes", "label": "¿Cuenta con protocolo de gestión de incidentes?", "type": "checkbox", "required": False},
            {"name": "comunicadaPcm", "label": "¿Comunicada a la PCM?", "type": "checkbox", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfResolucion"
    },
    {
        "id": 16,
        "title": "Sistema de Gestión de Seguridad de la Información (SGSI)",
        "fields": [
            {"name": "responsableSgsi", "label": "Nombre del responsable", "type": "text", "required": True},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "estadoImplementacion", "label": "Estado de implementación", "type": "select", "required": True, "options": ["En planificación", "En implementación", "Implementado", "Certificado"]},
            {"name": "versionNorma", "label": "Versión de la norma ISO", "type": "text", "required": True},
            {"name": "alcanceSgsi", "label": "Alcance del SGSI", "type": "textarea", "required": False},
            {"name": "fechaInicio", "label": "Fecha de inicio", "type": "date", "required": True},
            {"name": "certificacionObtenida", "label": "¿Certificación obtenida?", "type": "checkbox", "required": False, "section": "Certificación"},
            {"name": "entidadCertificadora", "label": "Entidad certificadora", "type": "text", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfSgsi",
        "secondPdf": "pdfCertificacion"
    },
    {
        "id": 17,
        "title": "Plan de Continuidad Operativa",
        "fields": [
            {"name": "responsablePlan", "label": "Nombre del responsable", "type": "text", "required": True},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "estadoPlan", "label": "Estado del plan", "type": "select", "required": True, "options": ["En formulación", "Formulado", "Aprobado", "En implementación", "Implementado"]},
            {"name": "fechaFormulacion", "label": "Fecha de formulación", "type": "date", "required": True},
            {"name": "fechaAprobacion", "label": "Fecha de aprobación", "type": "date", "required": False},
            {"name": "fechaInicio", "label": "Fecha de inicio de implementación", "type": "date", "required": False},
            {"name": "fechaFin", "label": "Fecha de fin prevista", "type": "date", "required": False},
            {"name": "descripcionPlan", "label": "Descripción del plan", "type": "textarea", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfPlan"
    },
    {
        "id": 18,
        "title": "Acceso al Portal de Transparencia Estándar (PTE)",
        "fields": [
            {"name": "responsableAcceso", "label": "Nombre del responsable", "type": "text", "required": True},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "numeroOficio", "label": "Número de oficio", "type": "text", "required": True},
            {"name": "fechaSolicitud", "label": "Fecha de solicitud", "type": "date", "required": True},
            {"name": "fechaConcesion", "label": "Fecha de concesión", "type": "date", "required": False},
            {"name": "estadoAcceso", "label": "Estado del acceso", "type": "select", "required": True, "options": ["Solicitado", "En proceso", "Concedido", "Denegado"]},
            {"name": "enlacePortal", "label": "Enlace al portal", "type": "url", "required": False},
            {"name": "descripcion", "label": "Descripción", "type": "textarea", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfOficio"
    },
    {
        "id": 19,
        "title": "Encuesta Nacional de Gobierno Digital",
        "fields": [
            {"name": "anioEncuesta", "label": "Año de la encuesta", "type": "number", "required": True},
            {"name": "responsableEncuesta", "label": "Nombre del responsable", "type": "text", "required": True},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "fechaEnvio", "label": "Fecha de envío", "type": "date", "required": True},
            {"name": "estadoEncuesta", "label": "Estado de la encuesta", "type": "select", "required": True, "options": ["No iniciada", "En proceso", "Completada", "Enviada"]},
            {"name": "enlaceEncuesta", "label": "Enlace a la encuesta", "type": "url", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfReporte"
    },
    {
        "id": 20,
        "title": "Digitalización de Servicios y Trámites",
        "fields": [
            {"name": "responsableDigitalizacion", "label": "Nombre del responsable", "type": "text", "required": True},
            {"name": "cargoResponsable", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoResponsable", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoResponsable", "label": "Teléfono", "type": "text", "required": False},
            {"name": "estadoImplementacion", "label": "Estado de implementación", "type": "select", "required": True, "options": ["No iniciado", "En planificación", "En implementación", "Implementado"]},
            {"name": "fechaInicio", "label": "Fecha de inicio", "type": "date", "required": True},
            {"name": "ultimoAvance", "label": "Último avance reportado", "type": "date", "required": False},
            {"name": "totalServicios", "label": "Total de servicios digitalizados", "type": "number", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfReporte"
    },
    {
        "id": 21,
        "title": "Oficial de Gobierno de Datos (OGD)",
        "fields": [
            {"name": "dniOficial", "label": "DNI", "type": "text", "required": True, "maxLength": 8},
            {"name": "nombresOficial", "label": "Nombres", "type": "text", "required": True},
            {"name": "apellidoPaternoOficial", "label": "Apellido paterno", "type": "text", "required": True},
            {"name": "apellidoMaternoOficial", "label": "Apellido materno", "type": "text", "required": True},
            {"name": "cargoOficial", "label": "Cargo", "type": "text", "required": True},
            {"name": "correoOficial", "label": "Correo electrónico", "type": "email", "required": True},
            {"name": "telefonoOficial", "label": "Teléfono", "type": "text", "required": False},
            {"name": "fechaDesignacion", "label": "Fecha de designación", "type": "date", "required": True},
            {"name": "resolucionDesignacion", "label": "Resolución de designación", "type": "text", "required": True},
            {"name": "comunicadaSgtd", "label": "¿Comunicada a la SGTD?", "type": "checkbox", "required": False},
            {"name": "observaciones", "label": "Observaciones", "type": "textarea", "required": False},
        ],
        "pdf": "pdfResolucion"
    }
]

def generate_field(field, comp_id):
    """Generate JSX for a single field"""
    name = field["name"]
    label = field["label"]
    field_type = field["type"]
    required = field.get("required", False)
    
    # Start section if specified
    section_html = ""
    if "section" in field:
        section_html = f'''
                  {{/* Separador */}}
                  <div className="md:col-span-2 border-t border-gray-200 my-2">
                    <h3 className="text-sm font-medium text-gray-700 mt-4 mb-3">{field["section"]}</h3>
                  </div>

'''
    
    required_mark = '<span className="text-red-500">*</span>' if required else ''
    col_span = 'md:col-span-2' if field_type in ['textarea', 'url'] else ''
    
    if field_type == 'text':
        max_length = field.get('maxLength', '')
        max_attr = f'maxLength="{max_length}"' if max_length else ''
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <input
                      type="text"
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      {max_attr}
                      className={{`input-field ${{errores.{name} ? 'border-red-500' : ''}}`}}
                      placeholder="{label}"
                      disabled={{viewMode}}
                    />
                    {{errores.{name} && (
                      <p className="text-red-500 text-xs mt-1">{{errores.{name}}}</p>
                    )}}
                  </div>
'''
    
    elif field_type == 'email':
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <input
                      type="email"
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      className={{`input-field ${{errores.{name} ? 'border-red-500' : ''}}`}}
                      placeholder="{label}"
                      disabled={{viewMode}}
                    />
                    {{errores.{name} && (
                      <p className="text-red-500 text-xs mt-1">{{errores.{name}}}</p>
                    )}}
                  </div>
'''
    
    elif field_type == 'url':
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <input
                      type="url"
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      className={{`input-field ${{errores.{name} ? 'border-red-500' : ''}}`}}
                      placeholder="https://..."
                      disabled={{viewMode}}
                    />
                    {{errores.{name} && (
                      <p className="text-red-500 text-xs mt-1">{{errores.{name}}}</p>
                    )}}
                  </div>
'''
    
    elif field_type == 'number':
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <input
                      type="number"
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      min="0"
                      className={{`input-field ${{errores.{name} ? 'border-red-500' : ''}}`}}
                      placeholder="0"
                      disabled={{viewMode}}
                    />
                    {{errores.{name} && (
                      <p className="text-red-500 text-xs mt-1">{{errores.{name}}}</p>
                    )}}
                  </div>
'''
    
    elif field_type == 'date':
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <input
                      type="date"
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      className={{`input-field ${{errores.{name} ? 'border-red-500' : ''}}`}}
                      disabled={{viewMode}}
                    />
                    {{errores.{name} && (
                      <p className="text-red-500 text-xs mt-1">{{errores.{name}}}</p>
                    )}}
                  </div>
'''
    
    elif field_type == 'select':
        options = field.get('options', [])
        options_html = '\n'.join([f'                        <option value="{opt}">{opt}</option>' for opt in options])
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <select
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      className={{`input-field ${{errores.{name} ? 'border-red-500' : ''}}`}}
                      disabled={{viewMode}}
                    >
                      <option value="">Seleccione...</option>
{options_html}
                    </select>
                    {{errores.{name} && (
                      <p className="text-red-500 text-xs mt-1">{{errores.{name}}}</p>
                    )}}
                  </div>
'''
    
    elif field_type == 'checkbox':
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="{col_span}">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                      <input
                        type="checkbox"
                        name="{name}"
                        checked={{formData.{name} || false}}
                        onChange={{handleInputChange}}
                        className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                        disabled={{viewMode}}
                      />
                      {label}
                    </label>
                  </div>
'''
    
    elif field_type == 'textarea':
        return f'''{section_html}                  {{/* {label} */}}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {label} {required_mark}
                    </label>
                    <textarea
                      name="{name}"
                      value={{formData.{name}}}
                      onChange={{handleInputChange}}
                      maxLength="1000"
                      rows="3"
                      className="input-field"
                      placeholder="{label}..."
                      disabled={{viewMode}}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {{formData.{name}?.length || 0}} / 1000 caracteres
                    </p>
                  </div>
'''
    
    return ""

def generate_form(comp):
    """Generate complete form for a compromiso"""
    comp_id = comp["id"]
    title = comp["title"]
    fields_html = "\n".join([generate_field(f, comp_id) for f in comp["fields"]])
    pdf_field = comp["pdf"]
    
    # PDF upload section
    pdf_section = f'''
                  {{/* Documento de evidencia (PDF) */}}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de evidencia (PDF)
                    </label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 flex items-center justify-center px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors">
                        <Upload className="w-5 h-5 mr-2 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {{formData.documentoFile ? formData.documentoFile.name : 'Seleccionar archivo'}}
                        </span>
                        <input
                          type="file"
                          accept=".pdf"
                          onChange={{handleFileChange}}
                          className="hidden"
                          disabled={{viewMode}}
                        />
                      </label>
                      {{pdfUrl && (
                        <button
                          type="button"
                          onClick={{() => {{
                            setDocumentoActualUrl(pdfUrl);
                            setShowPdfViewer(true);
                          }}}}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Ver PDF
                        </button>
                      )}}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Suba el documento de evidencia en formato PDF (máximo 10 MB)
                    </p>
                  </div>'''
    
    form_html = f'''            ) : parseInt(formData.compromisoId) === {comp_id} ? (
              // COMPROMISO {comp_id}: {title}
              <>
                <h2 className="text-base font-semibold text-gray-800 mb-3">Paso 1: {title}</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
{fields_html}{pdf_section}
                </div>
              </>'''
    
    return form_html

# Generate all forms
output = []
for comp in compromisos:
    output.append(generate_form(comp))

# Write to file
output_text = "\n".join(output)
with open('/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/ui_forms_com11_21.txt', 'w', encoding='utf-8') as f:
    f.write(output_text)

print(f"✅ Generated UI forms for Com11-Com{compromisos[-1]['id']}")
print(f"📄 Saved to: ui_forms_com11_21.txt")
print(f"📏 Total lines: {len(output_text.splitlines())}")
