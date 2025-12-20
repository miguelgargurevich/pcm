import PropTypes from 'prop-types';

/**
 * Componente para mostrar los datos del Compromiso 2: Constitución del Comité de Gobierno y TD
 * Se usa en la vista de evaluación para mostrar los datos en el panel izquierdo
 */
const EvaluacionCompromiso2 = ({ data, activeTab }) => {
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
  const datosGenerales = {
    numeroResolucion: data.urlDocPcm || data.nroResolucion || '',
    fechaConstitucion: data.fechaConstitucion || data.fecRegistro || '',
    estado: data.estado || '',
    estadoPcm: data.estadoPCM || data.estadoPcm || '',
    etapaFormulario: data.etapaFormulario || '',
    checkPrivacidad: data.checkPrivacidad || false,
    checkDdjj: data.checkDdjj || false
  };

  // Miembros del comité - pueden venir como miembros o Miembros (PascalCase desde .NET)
  const miembrosComite = (data.miembros || data.Miembros || []).map(m => ({
    miembroId: m.miembroId || m.MiembroId || m.comiteMiembrosId || m.ComiteMiembrosId,
    dni: m.dni || m.Dni || m.dniMiembro || m.DniMiembro || '',
    nombre: m.nombre || m.Nombre || m.nombreMiembro || m.NombreMiembro || '',
    apellidoPaterno: m.apellidoPaterno || m.ApellidoPaterno || m.apePatMiembro || m.ApePatMiembro || '',
    apellidoMaterno: m.apellidoMaterno || m.ApellidoMaterno || m.apeMatMiembro || m.ApeMatMiembro || '',
    cargo: m.cargo || m.Cargo || m.cargoMiembro || m.CargoMiembro || '',
    rol: m.rol || m.Rol || m.rolEnComite || m.RolEnComite || '',
    email: m.email || m.Email || m.emailMiembro || m.EmailMiembro || '',
    telefono: m.telefono || m.Telefono || m.telefMiembro || m.TelefMiembro || ''
  }));

  // Documentos normativos (si existen)
  const documentosNormativos = data.documentos || data.archivos || [];
  if (data.rutaPdfNormativa || data.urlDocPcm) {
    documentosNormativos.push({
      id: 1,
      nombre: 'Resolución de Constitución del Comité',
      url: data.rutaPdfNormativa || data.urlDocPcm,
      tipo: 'resolucion'
    });
  }

  // Datos de veracidad
  const datosVeracidad = {
    checkPrivacidad: data.checkPrivacidad || false,
    checkDdjj: data.checkDdjj || false,
    criteriosEvaluados: data.criteriosEvaluados || []
  };

  // Función para formatear el rol
  const formatRol = (rol) => {
    const roles = {
      'presidente': 'Presidente',
      'secretario': 'Secretario Técnico',
      'secretario_tecnico': 'Secretario Técnico',
      'miembro': 'Miembro',
      'asesor': 'Asesor'
    };
    return roles[rol?.toLowerCase()] || rol || '-';
  };

  return (
    <div className="space-y-4">
      {activeTab === 'general' && (
        <div className="space-y-6">
          {/* Estado del Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado del Formulario</label>
              <div className="bg-blue-50 rounded-lg p-3 text-blue-900 font-medium">
                {datosGenerales.estado || 'Sin estado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-lg p-3 text-purple-900 font-medium">
                {datosGenerales.etapaFormulario || 'Sin etapa'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado PCM</label>
              <div className="bg-green-50 rounded-lg p-3 text-green-900 font-medium">
                {datosGenerales.estadoPcm || 'Sin evaluar'}
              </div>
            </div>
          </div>

          {/* Datos del Comité */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Número de Resolución</label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
                {datosGenerales.numeroResolucion || '-'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Fecha de Constitución</label>
              <div className="bg-gray-50 rounded-lg p-3 text-gray-900">
                {datosGenerales.fechaConstitucion ? new Date(datosGenerales.fechaConstitucion).toLocaleDateString('es-PE') : '-'}
              </div>
            </div>
          </div>

          {/* Tabla de Miembros del Comité GTD */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-2">Miembros del Comité GTD</label>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">DNI</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombres</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cargo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {miembrosComite.length > 0 ? (
                    miembrosComite.map((miembro, index) => (
                      <tr key={`miembro-${miembro.miembroId || miembro.dni || index}`} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{miembro.dni}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {`${miembro.nombre} ${miembro.apellidoPaterno} ${miembro.apellidoMaterno}`.trim()}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{miembro.cargo || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            miembro.rol?.toLowerCase() === 'presidente' 
                              ? 'bg-blue-100 text-blue-800'
                              : miembro.rol?.toLowerCase()?.includes('secretario')
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {formatRol(miembro.rol)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">{miembro.email || '-'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-sm text-gray-500">
                        No hay miembros registrados en el comité
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {miembrosComite.length > 0 && (
              <p className="mt-2 text-xs text-gray-500">
                Total de miembros: {miembrosComite.length}
              </p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'normativa' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Documentos normativos relacionados con la constitución del Comité de Gobierno y Transformación Digital. 
            Haga clic en un documento para previsualizarlo.
          </p>
          
          {documentosNormativos.length > 0 ? (
            <div className="space-y-2">
              {documentosNormativos.map((doc, index) => (
                <div
                  key={`doc-${doc.id || index}`}
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
                      <p className="text-xs text-gray-500">PDF - {doc.tipo}</p>
                    </div>
                  </div>
                  <span className="text-primary text-sm font-medium">Ver PDF</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay documentos normativos cargados</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 mb-4">
            Validación de la información proporcionada por la entidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Política de Privacidad */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  datosVeracidad.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosVeracidad.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {datosVeracidad.checkPrivacidad 
                  ? 'La entidad aceptó la política de privacidad' 
                  : 'Pendiente de aceptación'}
              </p>
            </div>

            {/* Declaración Jurada */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Declaración Jurada</span>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  datosVeracidad.checkDdjj ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {datosVeracidad.checkDdjj ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {datosVeracidad.checkDdjj 
                  ? 'La entidad firmó la declaración jurada' 
                  : 'Pendiente de firma'}
              </p>
            </div>
          </div>

          {/* Miembros validados */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Miembros del comité:</strong> {miembrosComite.length} registrado(s)
            </p>
            {miembrosComite.length > 0 && (
              <ul className="mt-2 text-xs text-blue-600">
                {miembrosComite.map((m, i) => (
                  <li key={i}>• {formatRol(m.rol)}: {m.nombre} {m.apellidoPaterno} - DNI: {m.dni}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

EvaluacionCompromiso2.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired
};

export default EvaluacionCompromiso2;
