import PropTypes from 'prop-types';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente para mostrar los datos del Compromiso 1: Designación del Líder Digital
 * Se usa en la vista de evaluación para mostrar los datos en el panel izquierdo
 */
const EvaluacionCompromiso1 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  // Función para ver documento
  const handleVerDocumento = (url) => {
    if (url) {
      if (onVerDocumento) {
        onVerDocumento(url);
      } else {
        window.open(url, '_blank');
      }
    }
  };

  // Si no hay datos, mostrar mensaje
  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
        <p className="text-sm mt-2">La entidad aún no ha enviado información.</p>
      </div>
    );
  }

  // Mapear datos de la API al formato esperado
  // Los nombres de propiedades vienen en camelCase desde la API .NET
  const datosGenerales = {
    dniLider: data.dniLider || '',
    nombres: data.nombreLider || '',
    apellidoPaterno: data.apePatLider || '',
    apellidoMaterno: data.apeMatLider || '',
    cargo: data.cargoLider || '',
    email: data.emailLider || '',
    telefono: data.telefonoLider || '',
    fechaDesignacion: data.fecIniLider || data.fecRegistro || '',
    numeroResolucion: data.urlDocPcm || '',
    estado: data.estado || '',
    etapaFormulario: data.etapaFormulario || '',
    rolLider: data.rolLider || ''
  };

  // Documentos normativos (si existen)
  const documentosNormativos = data.documentos || data.archivos || [];
  if (data.rutaPdfNormativa || data.urlDocPcm) {
    documentosNormativos.push({
      id: 1,
      nombre: 'Resolución de Designación',
      url: data.rutaPdfNormativa || data.urlDocPcm,
      tipo: 'resolucion'
    });
  }

  // Datos de veracidad (checks del paso 3)
  const datosVeracidad = {
    checkPrivacidad: data.checkPrivacidad ?? data.check_privacidad ?? false,
    checkDdjj: data.checkDdjj ?? data.check_ddjj ?? false
  };

  return (
    <div className="space-y-4">
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Estado del Formulario */}
          <div className="md:col-span-2 flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado del Formulario</label>
              <div className="bg-blue-50 rounded-md p-3 text-sm text-blue-900 font-medium">
                {datosGenerales.estado || 'Sin estado'}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-md p-3 text-sm text-purple-900 font-medium">
                {datosGenerales.etapaFormulario || 'Sin etapa'}
              </div>
            </div>
          </div>

          {/* DNI del Líder */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">DNI del Líder</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.dniLider || '-'}
            </div>
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nombres</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.nombres || '-'}
            </div>
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Apellido Paterno</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.apellidoPaterno || '-'}
            </div>
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Apellido Materno</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.apellidoMaterno || '-'}
            </div>
          </div>

          {/* Cargo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">Cargo</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.cargo || '-'}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.email || '-'}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.telefono || '-'}
            </div>
          </div>

          {/* Fecha de Designación */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Designación</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.fechaDesignacion ? new Date(datosGenerales.fechaDesignacion).toLocaleDateString('es-PE') : '-'}
            </div>
          </div>

          {/* Número de Resolución */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Número de Resolución</label>
            <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-900">
              {datosGenerales.numeroResolucion || '-'}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="space-y-4">
          {/* Lista de Verificación - Criterios de Evaluación */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Lista de Verificación</h3>
            {criterios && criterios.length > 0 ? (
              <div className="space-y-1.5">
                {criterios.map((criterio) => (
                  <div
                    key={criterio.criterioEvaluacionId}
                    className={`flex items-start gap-3 p-3 rounded-md border ${
                      criterio.cumple 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {criterio.cumple ? (
                      <CheckCircle size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${criterio.cumple ? 'text-green-800' : 'text-gray-700'}`}>
                      {criterio.descripcion}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-md">
                <p className="text-sm">No hay criterios de evaluación definidos para este compromiso</p>
              </div>
            )}
          </div>

          {/* Archivos Adjuntos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-2">Archivos Adjuntos</h3>
            {documentosNormativos.length > 0 ? (
              <div className="space-y-1.5">
                {documentosNormativos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100 cursor-pointer transition-colors"
                    onClick={() => handleVerDocumento(doc.url)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
                        <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.nombre}</p>
                        <p className="text-[10px] text-gray-500">Documento PDF</p>
                      </div>
                    </div>
                    <span className="text-primary text-sm font-medium hover:underline">Ver</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 text-gray-500 bg-gray-50 rounded-md">
                <p className="text-sm">No hay documentos adjuntos</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Declaraciones y aceptaciones del paso 3 del formulario
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Política de Privacidad */}
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                  datosVeracidad.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosVeracidad.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">
                {datosVeracidad.checkPrivacidad 
                  ? 'El usuario ha aceptado la política de privacidad' 
                  : 'Pendiente de aceptación'}
              </p>
            </div>

            {/* Declaración Jurada */}
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Declaración Jurada</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                  datosVeracidad.checkDdjj ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosVeracidad.checkDdjj ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
              <p className="text-[10px] text-gray-500">
                {datosVeracidad.checkDdjj 
                  ? 'El usuario ha aceptado la declaración jurada' 
                  : 'Pendiente de aceptación'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EvaluacionCompromiso1.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};

export default EvaluacionCompromiso1;
