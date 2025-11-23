#!/usr/bin/env python3
"""
Script para generar servicios frontend para compromisos 11-21
"""
import os

BASE_DIR = "/Users/miguelfernandezgargurevich/Library/Mobile Documents/com~apple~CloudDocs/Personal/Proyectos/repositorios/PCM/frontend/src/services"

COMPROMISOS = {
    11: {"name": "Com11AportacionGeoPeru", "file": "com11AportacionGeoPeruService", "endpoint": "Com11AportacionGeoPeru"},
    12: {"name": "Com12ResponsableSoftwarePublico", "file": "com12ResponsableSoftwarePublicoService", "endpoint": "Com12ResponsableSoftwarePublico"},
    13: {"name": "Com13InteroperabilidadPIDE", "file": "com13InteroperabilidadPIDEService", "endpoint": "Com13InteroperabilidadPIDE"},
    14: {"name": "Com14OficialSeguridadDigital", "file": "com14OficialSeguridadDigitalService", "endpoint": "Com14OficialSeguridadDigital"},
    15: {"name": "Com15CSIRTInstitucional", "file": "com15CSIRTInstitucionalService", "endpoint": "Com15CSIRTInstitucional"},
    16: {"name": "Com16SistemaGestionSeguridad", "file": "com16SistemaGestionSeguridadService", "endpoint": "Com16SistemaGestionSeguridad"},
    17: {"name": "Com17PlanTransicionIPv6", "file": "com17PlanTransicionIPv6Service", "endpoint": "Com17PlanTransicionIPv6"},
    18: {"name": "Com18AccesoPortalTransparencia", "file": "com18AccesoPortalTransparenciaService", "endpoint": "Com18AccesoPortalTransparencia"},
    19: {"name": "Com19EncuestaNacionalGobDigital", "file": "com19EncuestaNacionalGobDigitalService", "endpoint": "Com19EncuestaNacionalGobDigital"},
    20: {"name": "Com20DigitalizacionServiciosFacilita", "file": "com20DigitalizacionServiciosFacilitaService", "endpoint": "Com20DigitalizacionServiciosFacilita"},
    21: {"name": "Com21OficialGobiernoDatos", "file": "com21OficialGobiernoDatosService", "endpoint": "Com21OficialGobiernoDatos"},
}

def generate_service(num, info):
    """Genera servicio frontend"""
    file_name = info["file"]
    endpoint = info["endpoint"]
    name = info["name"]
    
    content = f'''import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5158/api';

const getAuthHeader = () => ({{
  headers: {{
    'Authorization': `Bearer ${{localStorage.getItem('token')}}`
  }}
}});

const {file_name} = {{
  getByEntidad: async (compromisoId, entidadId) => {{
    try {{
      console.log(`Buscando {name} para compromiso ${{compromisoId}} y entidad ${{entidadId}}`);
      const response = await axios.get(
        `${{API_URL}}/{endpoint}/${{compromisoId}}/entidad/${{entidadId}}`,
        getAuthHeader()
      );
      console.log('{name} encontrado:', response.data);
      return {{ isSuccess: true, data: response.data }};
    }} catch (error) {{
      if (error.response?.status === 404) {{
        console.log('No se encontró {name}, retornando null');
        return {{ isSuccess: true, data: null }};
      }}
      console.error('Error al obtener {name}:', error);
      return {{ 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al obtener datos' 
      }};
    }}
  }},

  create: async (data) => {{
    try {{
      console.log('Creando {name}:', data);
      const response = await axios.post(
        `${{API_URL}}/{endpoint}`,
        data,
        getAuthHeader()
      );
      console.log('{name} creado exitosamente:', response.data);
      return {{ isSuccess: true, data: response.data }};
    }} catch (error) {{
      console.error('Error al crear {name}:', error);
      return {{ 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al crear registro' 
      }};
    }}
  }},

  update: async (id, data) => {{
    try {{
      console.log(`Actualizando {name} con ID ${{id}}:`, data);
      const response = await axios.put(
        `${{API_URL}}/{endpoint}/${{id}}`,
        data,
        getAuthHeader()
      );
      console.log('{name} actualizado exitosamente:', response.data);
      return {{ isSuccess: true, data: response.data }};
    }} catch (error) {{
      console.error('Error al actualizar {name}:', error);
      return {{ 
        isSuccess: false, 
        message: error.response?.data?.message || 'Error al actualizar registro' 
      }};
    }}
  }}
}};

export default {file_name};
'''
    
    path = f"{BASE_DIR}/{file_name}.js"
    with open(path, 'w') as f:
        f.write(content)
    print(f"✓ Created {file_name}.js")

print("=== Generando servicios frontend para Com11-Com21 ===\n")

for num, info in COMPROMISOS.items():
    print(f"Procesando Com{num}...")
    generate_service(num, info)

print("\n=== ¡Servicios frontend generados! ===")
