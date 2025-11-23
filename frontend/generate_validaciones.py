#!/usr/bin/env python3
"""
Script to generate validarPaso blocks for Com11-Com21
"""

validaciones = [
    {
        "number": "11",
        "name": "AportacionGeoPeru",
        "validations": """
        if (!formData.urlInformacionGeoespacial || formData.urlInformacionGeoespacial.trim() === '') {
          nuevosErrores.urlInformacionGeoespacial = 'Ingrese la URL de la información geoespacial';
        } else if (!/^https?:\\/\\/.+/.test(formData.urlInformacionGeoespacial)) {
          nuevosErrores.urlInformacionGeoespacial = 'Ingrese una URL válida';
        }
        if (!formData.tipoInformacionPublicada || formData.tipoInformacionPublicada.trim() === '') {
          nuevosErrores.tipoInformacionPublicada = 'Seleccione el tipo de información publicada';
        }
        if (!formData.totalCapasPublicadas || formData.totalCapasPublicadas === '') {
          nuevosErrores.totalCapasPublicadas = 'Ingrese el total de capas publicadas';
        } else if (parseInt(formData.totalCapasPublicadas) < 0) {
          nuevosErrores.totalCapasPublicadas = 'El total debe ser un número positivo';
        }
        if (!formData.fechaUltimaActualizacionAgp) {
          nuevosErrores.fechaUltimaActualizacionAgp = 'Seleccione la fecha de última actualización';
        }
        if (!formData.responsableAgp || formData.responsableAgp.trim() === '') {
          nuevosErrores.responsableAgp = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableAgp || formData.cargoResponsableAgp.trim() === '') {
          nuevosErrores.cargoResponsableAgp = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableAgp || formData.correoResponsableAgp.trim() === '') {
          nuevosErrores.correoResponsableAgp = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableAgp)) {
          nuevosErrores.correoResponsableAgp = 'Ingrese un correo válido';
        }
        if (!formData.numeroNormaAprobacionAgp || formData.numeroNormaAprobacionAgp.trim() === '') {
          nuevosErrores.numeroNormaAprobacionAgp = 'Ingrese el número de norma de aprobación';
        }
        if (!formData.fechaAprobacionAgp) {
          nuevosErrores.fechaAprobacionAgp = 'Seleccione la fecha de aprobación';
        }"""
    },
    {
        "number": "12",
        "name": "ResponsableSoftwarePublico",
        "validations": """
        if (!formData.dniResponsableSp || formData.dniResponsableSp.trim() === '') {
          nuevosErrores.dniResponsableSp = 'Ingrese el DNI del responsable';
        } else if (!/^\\d{8}$/.test(formData.dniResponsableSp)) {
          nuevosErrores.dniResponsableSp = 'El DNI debe tener 8 dígitos';
        }
        if (!formData.nombresResponsableSp || formData.nombresResponsableSp.trim() === '') {
          nuevosErrores.nombresResponsableSp = 'Ingrese los nombres del responsable';
        }
        if (!formData.apellidosResponsableSp || formData.apellidosResponsableSp.trim() === '') {
          nuevosErrores.apellidosResponsableSp = 'Ingrese los apellidos del responsable';
        }
        if (!formData.cargoResponsableSp || formData.cargoResponsableSp.trim() === '') {
          nuevosErrores.cargoResponsableSp = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableSp || formData.correoResponsableSp.trim() === '') {
          nuevosErrores.correoResponsableSp = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableSp)) {
          nuevosErrores.correoResponsableSp = 'Ingrese un correo válido';
        }
        if (!formData.fechaDesignacionSp) {
          nuevosErrores.fechaDesignacionSp = 'Seleccione la fecha de designación';
        }
        if (!formData.numeroResolucionSp || formData.numeroResolucionSp.trim() === '') {
          nuevosErrores.numeroResolucionSp = 'Ingrese el número de resolución';
        }"""
    },
    {
        "number": "13",
        "name": "InteroperabilidadPIDE",
        "validations": """
        if (!formData.tipoIntegracionPide || formData.tipoIntegracionPide.trim() === '') {
          nuevosErrores.tipoIntegracionPide = 'Seleccione el tipo de integración';
        }
        if (!formData.nombreServicioPide || formData.nombreServicioPide.trim() === '') {
          nuevosErrores.nombreServicioPide = 'Ingrese el nombre del servicio';
        }
        if (!formData.fechaInicioIntegracionPide) {
          nuevosErrores.fechaInicioIntegracionPide = 'Seleccione la fecha de inicio de integración';
        }
        if (formData.urlServicioPide && !/^https?:\\/\\/.+/.test(formData.urlServicioPide)) {
          nuevosErrores.urlServicioPide = 'Ingrese una URL válida';
        }
        if (!formData.responsableTecnicoPide || formData.responsableTecnicoPide.trim() === '') {
          nuevosErrores.responsableTecnicoPide = 'Ingrese el nombre del responsable técnico';
        }
        if (!formData.correoResponsablePide || formData.correoResponsablePide.trim() === '') {
          nuevosErrores.correoResponsablePide = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsablePide)) {
          nuevosErrores.correoResponsablePide = 'Ingrese un correo válido';
        }
        if (!formData.convenioPide || formData.convenioPide.trim() === '') {
          nuevosErrores.convenioPide = 'Ingrese el nombre del convenio';
        }"""
    },
    {
        "number": "14",
        "name": "OficialSeguridadDigital",
        "validations": """
        if (!formData.dniOscd || formData.dniOscd.trim() === '') {
          nuevosErrores.dniOscd = 'Ingrese el DNI del oficial';
        } else if (!/^\\d{8}$/.test(formData.dniOscd)) {
          nuevosErrores.dniOscd = 'El DNI debe tener 8 dígitos';
        }
        if (!formData.nombresOscd || formData.nombresOscd.trim() === '') {
          nuevosErrores.nombresOscd = 'Ingrese los nombres del oficial';
        }
        if (!formData.apellidosOscd || formData.apellidosOscd.trim() === '') {
          nuevosErrores.apellidosOscd = 'Ingrese los apellidos del oficial';
        }
        if (!formData.cargoOscd || formData.cargoOscd.trim() === '') {
          nuevosErrores.cargoOscd = 'Ingrese el cargo del oficial';
        }
        if (!formData.correoOscd || formData.correoOscd.trim() === '') {
          nuevosErrores.correoOscd = 'Ingrese el correo del oficial';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoOscd)) {
          nuevosErrores.correoOscd = 'Ingrese un correo válido';
        }
        if (!formData.fechaDesignacionOscd) {
          nuevosErrores.fechaDesignacionOscd = 'Seleccione la fecha de designación';
        }
        if (!formData.numeroResolucionOscd || formData.numeroResolucionOscd.trim() === '') {
          nuevosErrores.numeroResolucionOscd = 'Ingrese el número de resolución';
        }"""
    },
    {
        "number": "15",
        "name": "CSIRTInstitucional",
        "validations": """
        if (!formData.nombreCsirt || formData.nombreCsirt.trim() === '') {
          nuevosErrores.nombreCsirt = 'Ingrese el nombre del CSIRT';
        }
        if (!formData.fechaConformacionCsirt) {
          nuevosErrores.fechaConformacionCsirt = 'Seleccione la fecha de conformación';
        }
        if (!formData.numeroResolucionCsirt || formData.numeroResolucionCsirt.trim() === '') {
          nuevosErrores.numeroResolucionCsirt = 'Ingrese el número de resolución';
        }
        if (!formData.responsableCsirt || formData.responsableCsirt.trim() === '') {
          nuevosErrores.responsableCsirt = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableCsirt || formData.cargoResponsableCsirt.trim() === '') {
          nuevosErrores.cargoResponsableCsirt = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableCsirt || formData.correoResponsableCsirt.trim() === '') {
          nuevosErrores.correoResponsableCsirt = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableCsirt)) {
          nuevosErrores.correoResponsableCsirt = 'Ingrese un correo válido';
        }"""
    },
    {
        "number": "16",
        "name": "SistemaGestionSeguridad",
        "validations": """
        if (!formData.responsableSgsi || formData.responsableSgsi.trim() === '') {
          nuevosErrores.responsableSgsi = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableSgsi || formData.cargoResponsableSgsi.trim() === '') {
          nuevosErrores.cargoResponsableSgsi = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableSgsi || formData.correoResponsableSgsi.trim() === '') {
          nuevosErrores.correoResponsableSgsi = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableSgsi)) {
          nuevosErrores.correoResponsableSgsi = 'Ingrese un correo válido';
        }
        if (!formData.estadoSgsi || formData.estadoSgsi.trim() === '') {
          nuevosErrores.estadoSgsi = 'Seleccione el estado del SGSI';
        }
        if (!formData.versionNormaSgsi || formData.versionNormaSgsi.trim() === '') {
          nuevosErrores.versionNormaSgsi = 'Seleccione la versión de la norma';
        }
        if (!formData.fechaInicioSgsi) {
          nuevosErrores.fechaInicioSgsi = 'Seleccione la fecha de inicio';
        }"""
    },
    {
        "number": "17",
        "name": "PlanTransicionIPv6",
        "validations": """
        if (!formData.responsablePtipv6 || formData.responsablePtipv6.trim() === '') {
          nuevosErrores.responsablePtipv6 = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsablePtipv6 || formData.cargoResponsablePtipv6.trim() === '') {
          nuevosErrores.cargoResponsablePtipv6 = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsablePtipv6 || formData.correoResponsablePtipv6.trim() === '') {
          nuevosErrores.correoResponsablePtipv6 = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsablePtipv6)) {
          nuevosErrores.correoResponsablePtipv6 = 'Ingrese un correo válido';
        }
        if (!formData.estadoPlanPtipv6 || formData.estadoPlanPtipv6.trim() === '') {
          nuevosErrores.estadoPlanPtipv6 = 'Seleccione el estado del plan';
        }
        if (!formData.fechaFormulacionPtipv6) {
          nuevosErrores.fechaFormulacionPtipv6 = 'Seleccione la fecha de formulación';
        }"""
    },
    {
        "number": "18",
        "name": "AccesoPortalTransparencia",
        "validations": """
        if (!formData.responsableApte || formData.responsableApte.trim() === '') {
          nuevosErrores.responsableApte = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableApte || formData.cargoResponsableApte.trim() === '') {
          nuevosErrores.cargoResponsableApte = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableApte || formData.correoResponsableApte.trim() === '') {
          nuevosErrores.correoResponsableApte = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableApte)) {
          nuevosErrores.correoResponsableApte = 'Ingrese un correo válido';
        }
        if (!formData.oficioSolicitudApte || formData.oficioSolicitudApte.trim() === '') {
          nuevosErrores.oficioSolicitudApte = 'Ingrese el número de oficio de solicitud';
        }
        if (!formData.fechaSolicitudApte) {
          nuevosErrores.fechaSolicitudApte = 'Seleccione la fecha de solicitud';
        }
        if (!formData.estadoAccesoApte || formData.estadoAccesoApte.trim() === '') {
          nuevosErrores.estadoAccesoApte = 'Seleccione el estado del acceso';
        }"""
    },
    {
        "number": "19",
        "name": "EncuestaNacionalGobDigital",
        "validations": """
        if (!formData.anioEnad || formData.anioEnad.trim() === '') {
          nuevosErrores.anioEnad = 'Seleccione el año de la encuesta';
        }
        if (!formData.responsableEnad || formData.responsableEnad.trim() === '') {
          nuevosErrores.responsableEnad = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableEnad || formData.cargoResponsableEnad.trim() === '') {
          nuevosErrores.cargoResponsableEnad = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableEnad || formData.correoResponsableEnad.trim() === '') {
          nuevosErrores.correoResponsableEnad = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableEnad)) {
          nuevosErrores.correoResponsableEnad = 'Ingrese un correo válido';
        }
        if (!formData.fechaEnvioEnad) {
          nuevosErrores.fechaEnvioEnad = 'Seleccione la fecha de envío';
        }
        if (!formData.estadoEnad || formData.estadoEnad.trim() === '') {
          nuevosErrores.estadoEnad = 'Seleccione el estado';
        }"""
    },
    {
        "number": "20",
        "name": "DigitalizacionServiciosFacilita",
        "validations": """
        if (!formData.responsableDsfp || formData.responsableDsfp.trim() === '') {
          nuevosErrores.responsableDsfp = 'Ingrese el nombre del responsable';
        }
        if (!formData.cargoResponsableDsfp || formData.cargoResponsableDsfp.trim() === '') {
          nuevosErrores.cargoResponsableDsfp = 'Ingrese el cargo del responsable';
        }
        if (!formData.correoResponsableDsfp || formData.correoResponsableDsfp.trim() === '') {
          nuevosErrores.correoResponsableDsfp = 'Ingrese el correo del responsable';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoResponsableDsfp)) {
          nuevosErrores.correoResponsableDsfp = 'Ingrese un correo válido';
        }
        if (!formData.estadoImplementacionDsfp || formData.estadoImplementacionDsfp.trim() === '') {
          nuevosErrores.estadoImplementacionDsfp = 'Seleccione el estado de implementación';
        }
        if (!formData.fechaInicioDsfp) {
          nuevosErrores.fechaInicioDsfp = 'Seleccione la fecha de inicio';
        }
        if (!formData.totalServiciosDigitalizadosDsfp || formData.totalServiciosDigitalizadosDsfp === '') {
          nuevosErrores.totalServiciosDigitalizadosDsfp = 'Ingrese el total de servicios digitalizados';
        } else if (parseInt(formData.totalServiciosDigitalizadosDsfp) < 0) {
          nuevosErrores.totalServiciosDigitalizadosDsfp = 'El total debe ser un número positivo';
        }"""
    },
    {
        "number": "21",
        "name": "OficialGobiernoDatos",
        "validations": """
        if (!formData.dniOgd || formData.dniOgd.trim() === '') {
          nuevosErrores.dniOgd = 'Ingrese el DNI del oficial';
        } else if (!/^\\d{8}$/.test(formData.dniOgd)) {
          nuevosErrores.dniOgd = 'El DNI debe tener 8 dígitos';
        }
        if (!formData.nombresOgd || formData.nombresOgd.trim() === '') {
          nuevosErrores.nombresOgd = 'Ingrese los nombres del oficial';
        }
        if (!formData.apellidosOgd || formData.apellidosOgd.trim() === '') {
          nuevosErrores.apellidosOgd = 'Ingrese los apellidos del oficial';
        }
        if (!formData.cargoOgd || formData.cargoOgd.trim() === '') {
          nuevosErrores.cargoOgd = 'Ingrese el cargo del oficial';
        }
        if (!formData.correoOgd || formData.correoOgd.trim() === '') {
          nuevosErrores.correoOgd = 'Ingrese el correo del oficial';
        } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formData.correoOgd)) {
          nuevosErrores.correoOgd = 'Ingrese un correo válido';
        }
        if (!formData.fechaDesignacionOgd) {
          nuevosErrores.fechaDesignacionOgd = 'Seleccione la fecha de designación';
        }
        if (!formData.numeroResolucionOgd || formData.numeroResolucionOgd.trim() === '') {
          nuevosErrores.numeroResolucionOgd = 'Ingrese el número de resolución';
        }"""
    }
]

def generate_validacion_block(val):
    return f"""      // Validación específica para Compromiso {val['number']} ({val['name']})
      else if (parseInt(formData.compromisoId) === {val['number']}) {{
{val['validations']}
      }}"""

def main():
    output = ""
    for val in validaciones:
        output += generate_validacion_block(val) + "\n"
    
    # Write to a file for easy copying
    with open('/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/frontend/validaciones_com11_21.txt', 'w', encoding='utf-8') as f:
        f.write(output)
    
    print("✅ Generated validarPaso blocks for Com11-Com21")
    print("📄 Saved to: validaciones_com11_21.txt")

if __name__ == "__main__":
    main()
