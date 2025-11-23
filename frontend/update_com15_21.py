#!/usr/bin/env python3
"""
Script para generar las actualizaciones de Com15-21 en el frontend
"""

# Definir los campos SQL para cada compromiso
com_fields = {
    15: {
        'name': 'CSIRTInstitucional',
        'pk': 'comcsirtEntId',
        'fields': [
            ('fechaConformacion', 'date'),
            ('numeroResolucion', 'text'),
            ('descripcionFunciones', 'textarea'),
            ('integrantesEquipo', 'textarea'),
            ('procedimientosRespuesta', 'textarea'),
            ('incidentesAtendidos', 'number'),
            ('fechaActualizacion', 'date')
        ],
        'title': 'CSIRT Institucional'
    },
    16: {
        'name': 'SistemaGestionSeguridad',
        'pk': 'comsgsiEntId',
        'fields': [
            ('fechaCertificacion', 'date'),
            ('numeroCertificado', 'text'),
            ('organismoCertificador', 'text'),
            ('alcanceCertificacion', 'textarea'),
            ('fechaVigencia', 'date'),
            ('metodologiaImplementada', 'textarea'),
            ('auditorias', 'textarea')
        ],
        'title': 'Sistema de Gestión de Seguridad de la Información'
    },
    17: {
        'name': 'PlanTransicionIPv6',
        'pk': 'comptipv6EntId',
        'fields': [
            ('fechaElaboracion', 'date'),
            ('numeroDocumento', 'text'),
            ('archivoPlan', 'file'),
            ('descripcion', 'textarea'),
            ('fasesImplementacion', 'textarea'),
            ('recursosNecesarios', 'textarea'),
            ('fechaObjetivo', 'date'),
            ('responsable', 'text')
        ],
        'title': 'Plan de Transición a IPv6'
    },
    18: {
        'name': 'AccesoPortalTransparencia',
        'pk': 'comsapteEntId',
        'fields': [
            ('urlPortal', 'text'),
            ('fechaUltimaActualizacion', 'date'),
            ('seccionesDisponibles', 'textarea'),
            ('formatosPublicacion', 'textarea'),
            ('accesibilidadCumplida', 'checkbox'),
            ('certificacionAccesibilidad', 'text'),
            ('observaciones', 'textarea')
        ],
        'title': 'Acceso al Portal de Transparencia'
    },
    19: {
        'name': 'EncuestaNacionalGobDigital',
        'pk': 'comrenadEntId',
        'fields': [
            ('fechaParticipacion', 'date'),
            ('numeroEncuestados', 'number'),
            ('resultadosObtenidos', 'textarea'),
            ('accionesImplementadas', 'textarea'),
            ('documentoResultados', 'file'),
            ('fechaSeguimiento', 'date'),
            ('responsable', 'text')
        ],
        'title': 'Encuesta Nacional de Gobierno Digital'
    },
    20: {
        'name': 'DigitalizacionServiciosFacilita',
        'pk': 'comdsfpeEntId',
        'fields': [
            ('serviciosDigitalizados', 'number'),
            ('serviciosTotal', 'number'),
            ('porcentajeDigitalizacion', 'number'),
            ('ciudadanosImpactados', 'number'),
            ('descripcionServicios', 'textarea'),
            ('beneficiosObtenidos', 'textarea'),
            ('fechaReporte', 'date')
        ],
        'title': 'Digitalización de Servicios Facilita Perú'
    },
    21: {
        'name': 'OficialGobiernoDatos',
        'pk': 'comdogdEntId',
        'fields': [
            ('fechaDesignacion', 'date'),
            ('numeroResolucion', 'text'),
            ('archivoResolucion', 'file'),
            ('descripcionFunciones', 'textarea'),
            ('iniciativasDatos', 'textarea'),
            ('conjuntosDatosPublicados', 'number'),
            ('fechaReporte', 'date'),
            ('responsable', 'text')
        ],
        'title': 'Oficial de Gobierno de Datos'
    }
}

# Generar validaciones para cada compromiso
def generate_validation(com_id, fields):
    validations = []
    for field_name, field_type in fields:
        if field_type in ['date', 'text', 'textarea']:
            if field_name in ['descripcion', 'numeroResolucion', 'numeroDocumento', 'responsable', 'fechaConformacion', 'fechaCertificacion', 'fechaElaboracion', 'urlPortal', 'fechaParticipacion', 'fechaDesignacion']:
                validations.append(f"        if (!formData.{field_name}" + (" || formData." + field_name + ".trim() === ''" if field_type != 'date' else "") + ") {")
                validations.append(f"          nuevosErrores.{field_name} = '" + ("Seleccione la fecha" if field_type == 'date' else "Ingrese " + field_name.replace('_', ' ')) + "';")
                validations.append("        }")
    
    return "\n".join(validations)

# Generar código de validación para todos los compromisos
print("=== VALIDACIONES (validarPaso) ===\n")
for com_id in range(15, 22):
    info = com_fields[com_id]
    print(f"      // Validación específica para Compromiso {com_id} ({info['name']})")
    print(f"      else if (parseInt(formData.compromisoId) === {com_id}) {{")
    print(generate_validation(com_id, info['fields']))
    print("      }")
    print()

print("\n=== ESTRUCTURA GUARDAR PROGRESO ===\n")
for com_id in range(15, 22):
    info = com_fields[com_id]
    print(f"      // COMPROMISO {com_id}")
    print(f"      else if (parseInt(formData.compromisoId) === {com_id}) {{")
    print(f"        const com{com_id}Data = {{")
    print(f"          compromisoId: {com_id},")
    print("          entidadId: user.entidadId,")
    
    for field_name, field_type in info['fields']:
        if field_type == 'file':
            print(f"          {field_name}: documentoUrl || formData.{field_name} || null,")
        elif field_type == 'number':
            print(f"          {field_name}: formData.{field_name} ? parseInt(formData.{field_name}) : null,")
        elif field_type == 'checkbox':
            print(f"          {field_name}: formData.{field_name} || false,")
        else:
            print(f"          {field_name}: formData.{field_name} || null,")
    
    print("          checkPrivacidad: formData.aceptaPoliticaPrivacidad || false,")
    print("          checkDdjj: formData.aceptaDeclaracionJurada || false,")
    print("          usuarioRegistra: user.usuarioId,")
    print("          etapaFormulario: pasoActual === 1 ? 'paso1' : pasoActual === 2 ? 'paso2' : 'paso3',")
    print("          estado: 'bandeja'")
    print("        };")
    print(f"        if (com{com_id}RecordId) {{")
    print(f"          response = await com{com_id}{info['name']}Service.update(com{com_id}RecordId, com{com_id}Data);")
    print("        } else {")
    print(f"          response = await com{com_id}{info['name']}Service.create(com{com_id}Data);")
    print("          if (response.isSuccess && response.data) {")
    print(f"            setCom{com_id}RecordId(response.data.{info['pk']});")
    print("          }")
    print("        }")
    print("      }")
    print()

print("\n=== RESUMEN DE CAMPOS SQL ===\n")
for com_id in range(15, 22):
    info = com_fields[com_id]
    fields_list = [f[0] for f in info['fields']]
    print(f"Com{com_id} ({info['name']}): {', '.join(fields_list)}")
    print(f"PK: {info['pk']}\n")
