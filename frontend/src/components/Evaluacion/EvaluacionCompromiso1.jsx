import PropTypes from 'prop-types';
import { CheckCircle, XCircle } from 'lucide-react';

/**
 * Componente para mostrar los datos del Compromiso 1: Designación del Líder Digital
 * Se usa en la vista de evaluación para mostrar los datos en el panel izquierdo
 */
const EvaluacionCompromiso1 = ({ data, activeTab, criterios = [] }) => {
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

  // Datos de veracidad
  const datosVeracidad = {
    reniecValidado: data.reniecValidado || data.reniec_validado || false,
    cargoValidado: data.cargoValidado || data.cargo_validado || false,
    fechaValidacion: data.fechaValidacion || data.fecha_validacion || '',
    observacionesVeracidad: data.observacionesVeracidad || data.observaciones_veracidad || ''
  };

  return (
    <div className="space-y-4">
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Estado del Formulario */}
          <div className="md:col-span-2 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado del Formulario</label>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-900 font-medium">
                {datosGenerales.estado || 'Sin estado'}
              </div>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-lg p-3 text-purple-900 font-medium">
                {datosGenerales.etapaFormulario || 'Sin etapa'}
              </div>
            </div>
          </div>

          {/* DNI del Líder */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">DNI del Líder</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.dniLider || '-'}
            </div>
          </div>

          {/* Nombres */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Nombres</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.nombres || '-'}
            </div>
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Apellido Paterno</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.apellidoPaterno || '-'}
            </div>
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Apellido Materno</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.apellidoMaterno || '-'}
            </div>
          </div>

          {/* Cargo */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">Cargo</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.cargo || '-'}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.email || '-'}
            </div>
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Teléfono</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.telefono || '-'}
            </div>
          </div>

          {/* Fecha de Designación */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Designación</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.fechaDesignacion ? new Date(datosGenerales.fechaDesignacion).toLocaleDateString('es-PE') : '-'}
            </div>
          </div>

          {/* Número de Resolución */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">Número de Resolución</label>
            <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
              {datosGenerales.numeroResolucion || '-'}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="space-y-6">
          {/* Lista de Verificación - Criterios de Evaluación */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Lista de Verificación</h3>
            {criterios && criterios.length > 0 ? (
              <div className="space-y-2">
                {criterios.map((criterio) => (
                  <div
                    key={criterio.criterioEvaluacionId}
                    className={`flex items-start gap-3 p-3 rounded-lg border ${
                      criterio.cumple 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {criterio.cumple ? (
                      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={20} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    )}
                    <span className={`text-sm ${criterio.cumple ? 'text-green-800' : 'text-gray-700'}`}>
                      {criterio.descripcion}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <p className="text-sm">No hay criterios de evaluación definidos para este compromiso</p>
              </div>
            )}
          </div>

          {/* Archivos Adjuntos */}
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Archivos Adjuntos</h3>
            {documentosNormativos.length > 0 ? (
              <div className="space-y-2">
                {documentosNormativos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.nombre}</p>
                        <p className="text-xs text-gray-500">Documento PDF</p>
                      </div>
                    </div>
                    <span className="text-primary text-sm font-medium">Ver</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500 bg-gray-50 rounded-lg">
                <p className="text-sm">No hay documentos adjuntos</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Verificación de datos con fuentes oficiales (RENIEC, SUNAT, etc.)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Validación RENIEC */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Validación RENIEC</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  datosVeracidad.reniecValidado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosVeracidad.reniecValidado ? 'Validado' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {datosVeracidad.reniecValidado 
                  ? 'Los datos del DNI coinciden con RENIEC' 
                  : 'Pendiente de verificación con RENIEC'}
              </p>
            </div>

            {/* Validación de Cargo */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Validación de Cargo</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  datosVeracidad.cargoValidado ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosVeracidad.cargoValidado ? 'Validado' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {datosVeracidad.cargoValidado 
                  ? 'El cargo corresponde a la estructura de la entidad' 
                  : 'Pendiente de verificación del cargo'}
              </p>
            </div>
          </div>

          {datosVeracidad.fechaValidacion && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-700">
                <strong>Última validación:</strong> {new Date(datosVeracidad.fechaValidacion).toLocaleDateString('es-PE')}
              </p>
            </div>
          )}

          {datosVeracidad.observacionesVeracidad && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Observaciones:</strong> {datosVeracidad.observacionesVeracidad}
              </p>
            </div>
          )}
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
  }))
};

export default EvaluacionCompromiso1;
