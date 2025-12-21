import { useState } from 'react';
import PropTypes from 'prop-types';
import { Target, Users, Server, Shield, FolderKanban, ChevronRight } from 'lucide-react';
import CriteriosEvaluacionList from './CriteriosEvaluacionList';

/**
 * Componente para mostrar los datos del Compromiso 3: Elaboración del Plan de Gobierno Digital
 * Es el más complejo porque tiene múltiples tabs internos para mostrar todos los datos relacionados
 */
const EvaluacionCompromiso3 = ({ data, activeTab, criterios = [], onVerDocumento }) => {
  // Sub-tabs para la pestaña General
  const [activeSubTab, setActiveSubTab] = useState('objetivos-pei');
  // Sub-tabs para Situación Actual
  const [activeSituacionTab, setActiveSituacionTab] = useState('estructura-ti');

  if (!data) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay datos registrados para este compromiso</p>
        <p className="text-sm mt-2">La entidad aún no ha enviado información del Plan de Gobierno Digital.</p>
      </div>
    );
  }

  // Mapear objetivos por tipo
  const objetivosPEI = (data.objetivos || []).filter(o => o.tipoObj === 'E' || o.tipoObj === 'e');
  const objetivosGD = (data.objetivos || []).filter(o => o.tipoObj === 'G' || o.tipoObj === 'g');
  
  // Datos de inventarios
  const personalTI = data.personalTI || data.PersonalTI || [];
  const inventarioSoftware = data.inventariosSoftware || data.InventariosSoftware || [];
  const inventarioSistemas = data.inventariosSistemas || data.InventariosSistemas || [];
  const inventarioRed = data.inventariosRed || data.InventariosRed || [];
  const inventarioServidores = data.inventariosServidores || data.InventariosServidores || [];
  const seguridadInfo = data.seguridadInfo || data.SeguridadInfo || null;
  const proyectos = data.proyectos || data.Proyectos || [];

  // Documentos normativos
  const documentos = [];
  if (data.rutaPdfNormativa) {
    documentos.push({
      id: 1,
      nombre: 'Documento Normativo',
      url: data.rutaPdfNormativa,
      tipo: 'normativa'
    });
  }

  // Sub-tabs de la pestaña General
  const subTabs = [
    { id: 'objetivos-pei', label: 'Objetivos Estratégicos (PEI)' },
    { id: 'objetivos-gd', label: 'Objetivos de Gobierno Digital' },
    { id: 'situacion-actual', label: 'Situación Actual' },
    { id: 'proyectos', label: 'Portafolio de Proyectos' }
  ];

  // Sub-tabs de Situación Actual
  const situacionTabs = [
    { id: 'estructura-ti', label: '3.1. Estructura TI', count: personalTI.length },
    { id: 'software', label: '3.2. Inv. Software', count: inventarioSoftware.length },
    { id: 'sistemas', label: '3.3. Inv. Sistemas', count: inventarioSistemas.length },
    { id: 'red', label: '3.4. Inv. Equipos Red', count: inventarioRed.length },
    { id: 'servidores', label: '3.5. Inv. Servidores', count: inventarioServidores.length },
    { id: 'seguridad', label: '3.6. Seguridad Info', count: seguridadInfo ? 1 : 0 }
  ];

  // Renderizar Objetivos (PEI o GD)
  const renderObjetivos = (objetivos, tipo) => {
    if (objetivos.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Target size={48} className="mx-auto mb-4 text-gray-300" />
          <p>No hay objetivos {tipo === 'PEI' ? 'estratégicos' : 'de gobierno digital'} registrados</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">
          {tipo === 'PEI' ? 'Objetivos Estratégicos (PEI)' : 'Objetivos de Gobierno Digital'}
        </h4>
        {objetivos.map((obj, index) => (
          <div key={obj.objEntId || index} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-700 font-bold text-sm">
                {obj.numeracionObj || `OE.${String(index + 1).padStart(2, '0')}`}
              </span>
              <div className="flex-1">
                <p className="text-gray-900 font-medium">{obj.descripcionObjetivo || '-'}</p>
                {obj.acciones && obj.acciones.length > 0 && (
                  <div className="mt-2 pl-4 border-l-2 border-blue-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">Acciones:</p>
                    {obj.acciones.map((acc, accIndex) => (
                      <div key={acc.accObjEntId || accIndex} className="flex items-center gap-3 text-sm text-gray-600">
                        <ChevronRight size={12} className="text-blue-400" />
                        <span className="font-medium text-blue-600">{acc.numeracionAcc}</span>
                        <span>{acc.descripcionAccion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                obj.activo !== false ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {obj.activo !== false ? 'Activo' : 'Inactivo'}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Renderizar Estructura TI (Personal)
  const renderEstructuraTI = () => (
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <div className="bg-gray-50 rounded-md p-2">
          <label className="text-[10px] text-gray-500">Ubicación Área TI</label>
          <p className="font-medium text-gray-900">{data.ubicacionAreaTi || '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <label className="text-[10px] text-gray-500">Dependencia</label>
          <p className="font-medium text-gray-900">{data.dependenciaAreaTi || '-'}</p>
        </div>
        <div className="bg-gray-50 rounded-md p-2">
          <label className="text-[10px] text-gray-500">Costo Anual TI</label>
          <p className="font-medium text-gray-900">
            {data.costoAnualTi ? `S/ ${Number(data.costoAnualTi).toLocaleString('es-PE')}` : '-'}
          </p>
        </div>
      </div>

      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Users size={16} className="text-purple-600" />
        Personal de TI ({personalTI.length})
      </h4>
      
      {personalTI.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">DNI</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Nombre</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Cargo</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Rol</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Especialidad</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Email</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {personalTI.map((p, i) => (
                <tr key={p.personalId || i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{p.dni || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{p.nombrePersona || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{p.cargo || '-'}</td>
                  <td className="px-3 py-2 text-sm">
                    <span className="px-2 py-0.5 text-[10px] rounded-full bg-purple-100 text-purple-800">
                      {p.rol || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600">{p.especialidad || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{p.emailPersonal || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No hay personal TI registrado</p>
      )}
    </div>
  );

  // Renderizar Inventario Software
  const renderInventarioSoftware = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Inventario de Software ({inventarioSoftware.length})</h4>
      {inventarioSoftware.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Código</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Producto</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Versión</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Instalaciones</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Licencias</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Costo</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventarioSoftware.map((s, i) => (
                <tr key={s.invSoftId || i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{s.codProducto || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{s.nombreProducto || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.version || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.tipoSoftware || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{s.cantidadInstalaciones || 0}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{s.cantidadLicencias || 0}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">
                    {s.costoLicencias ? `S/ ${Number(s.costoLicencias).toLocaleString('es-PE')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No hay software registrado</p>
      )}
    </div>
  );

  // Renderizar Inventario Sistemas
  const renderInventarioSistemas = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Inventario de Sistemas ({inventarioSistemas.length})</h4>
      {inventarioSistemas.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Código</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Sistema</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Descripción</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Lenguaje</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">BD</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventarioSistemas.map((s, i) => (
                <tr key={s.invSiId || i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{s.codigo || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900">{s.nombreSistema || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.descripcion || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.tipoSistema || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.lenguajeProgramacion || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.baseDatos || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No hay sistemas registrados</p>
      )}
    </div>
  );

  // Renderizar Inventario Red
  const renderInventarioRed = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700">Inventario de Equipos de Red ({inventarioRed.length})</h4>
      {inventarioRed.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Tipo Equipo</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Cantidad</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Puertos Op.</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Puertos Inop.</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Total Puertos</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Costo Mant.</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventarioRed.map((r, i) => (
                <tr key={r.invRedId || i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{r.tipoEquipo || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{r.cantidad || 0}</td>
                  <td className="px-3 py-2 text-sm text-green-600 text-right">{r.puertosOperativos || 0}</td>
                  <td className="px-3 py-2 text-sm text-red-600 text-right">{r.puertosInoperativos || 0}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{r.totalPuertos || 0}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">
                    {r.costoMantenimientoAnual ? `S/ ${Number(r.costoMantenimientoAnual).toLocaleString('es-PE')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No hay equipos de red registrados</p>
      )}
    </div>
  );

  // Renderizar Inventario Servidores
  const renderInventarioServidores = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Server size={16} className="text-orange-600" />
        Inventario de Servidores ({inventarioServidores.length})
      </h4>
      {inventarioServidores.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Equipo</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Tipo</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase">CPU</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">RAM (GB)</th>
                <th className="px-3 py-2 text-right text-sm font-medium text-gray-500 uppercase">Costo Mant.</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inventarioServidores.map((s, i) => (
                <tr key={s.invSrvId || i} className="hover:bg-gray-50">
                  <td className="px-3 py-2 text-sm text-gray-900">{s.nombreEquipo || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-600">{s.tipoEquipo || '-'}</td>
                  <td className="px-3 py-2 text-sm">
                    <span className={`px-2 py-0.5 text-[10px] rounded-full ${
                      s.estado?.toLowerCase() === 'operativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {s.estado || '-'}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600">
                    {s.marcaCpu} {s.modeloCpu} {s.velocidadGhz ? `@ ${s.velocidadGhz} GHz` : ''}
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">{s.memoriaGb || '-'}</td>
                  <td className="px-3 py-2 text-sm text-gray-900 text-right">
                    {s.costoMantenimientoAnual ? `S/ ${Number(s.costoMantenimientoAnual).toLocaleString('es-PE')}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No hay servidores registrados</p>
      )}
    </div>
  );

  // Renderizar Seguridad de la Información
  const renderSeguridadInfo = () => {
    if (!seguridadInfo) {
      return <p className="text-center py-4 text-gray-500">No hay información de seguridad registrada</p>;
    }

    const criterios = [
      { key: 'planSgsi', label: 'Plan SGSI', value: seguridadInfo.planSgsi },
      { key: 'comiteSeguridad', label: 'Comité de Seguridad', value: seguridadInfo.comiteSeguridad },
      { key: 'oficialSeguridadEnOrganigrama', label: 'Oficial de Seguridad en Organigrama', value: seguridadInfo.oficialSeguridadEnOrganigrama },
      { key: 'politicaSeguridad', label: 'Política de Seguridad', value: seguridadInfo.politicaSeguridad },
      { key: 'inventarioActivos', label: 'Inventario de Activos', value: seguridadInfo.inventarioActivos },
      { key: 'analisisRiesgos', label: 'Análisis de Riesgos', value: seguridadInfo.analisisRiesgos },
      { key: 'metodologiaRiesgos', label: 'Metodología de Riesgos', value: seguridadInfo.metodologiaRiesgos },
      { key: 'planContinuidad', label: 'Plan de Continuidad', value: seguridadInfo.planContinuidad },
      { key: 'programaAuditorias', label: 'Programa de Auditorías', value: seguridadInfo.programaAuditorias },
      { key: 'informesDireccion', label: 'Informes a Dirección', value: seguridadInfo.informesDireccion },
      { key: 'certificacionIso27001', label: 'Certificación ISO 27001', value: seguridadInfo.certificacionIso27001 }
    ];

    return (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Shield size={16} className="text-green-600" />
          Seguridad de la Información
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {criterios.map(c => (
            <div key={c.key} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-white text-sm ${
                c.value ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {c.value ? '✓' : ''}
              </span>
              <span className={`text-sm ${c.value ? 'text-gray-900' : 'text-gray-500'}`}>{c.label}</span>
            </div>
          ))}
        </div>
        
        {seguridadInfo.capacitaciones && seguridadInfo.capacitaciones.length > 0 && (
          <div className="mt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Capacitaciones en Seguridad</h5>
            <div className="space-y-2">
              {seguridadInfo.capacitaciones.map((cap, i) => (
                <div key={cap.capsegId || i} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm text-gray-900">{cap.curso}</span>
                  <span className="text-sm font-medium text-blue-600">{cap.cantidadPersonas} personas</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Renderizar Portafolio de Proyectos
  const renderProyectos = () => (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <FolderKanban size={16} className="text-indigo-600" />
        Portafolio de Proyectos ({proyectos.length})
      </h4>
      {proyectos.length > 0 ? (
        <div className="space-y-3">
          {proyectos.map((p, i) => (
            <div key={p.proyEntId || i} className="bg-white border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded">
                      {p.numeracionProy || `P${String(i + 1).padStart(2, '0')}`}
                    </span>
                    <h5 className="font-medium text-gray-900">{p.nombre || '-'}</h5>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{p.alcance || '-'}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                    <div>
                      <span className="text-gray-500">Tipo:</span>
                      <span className="ml-1 text-gray-900">{p.tipoProy || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Área:</span>
                      <span className="ml-1 text-gray-900">{p.areaProy || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Etapa:</span>
                      <span className="ml-1 text-gray-900">{p.etapaProyecto || '-'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Ámbito:</span>
                      <span className="ml-1 text-gray-900">{p.ambitoProyecto || '-'}</span>
                    </div>
                  </div>
                  {(p.fecIniProg || p.fecFinProg) && (
                    <div className="mt-2 text-[10px] text-gray-500">
                      Programado: {p.fecIniProg ? new Date(p.fecIniProg).toLocaleDateString('es-PE') : '-'} - 
                      {p.fecFinProg ? new Date(p.fecFinProg).toLocaleDateString('es-PE') : '-'}
                    </div>
                  )}
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                  p.estadoProyecto ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                }`}>
                  {p.estadoProyecto ? 'Activo' : 'Inactivo'}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center py-4 text-gray-500">No hay proyectos registrados</p>
      )}
    </div>
  );

  // Renderizar contenido de Situación Actual según el tab activo
  const renderSituacionActualContent = () => {
    switch (activeSituacionTab) {
      case 'estructura-ti': return renderEstructuraTI();
      case 'software': return renderInventarioSoftware();
      case 'sistemas': return renderInventarioSistemas();
      case 'red': return renderInventarioRed();
      case 'servidores': return renderInventarioServidores();
      case 'seguridad': return renderSeguridadInfo();
      default: return null;
    }
  };

  return (
    <div className="space-y-3">
      {activeTab === 'general' && (
        <div className="space-y-3">
          {/* Estados del Formulario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Estado del Formulario</label>
              <div className="bg-blue-50 rounded-md p-3 text-sm text-blue-900 font-medium">
                {data.estado || 'Sin estado'}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Etapa</label>
              <div className="bg-purple-50 rounded-md p-3 text-sm text-purple-900 font-medium">
                {data.etapaFormulario || 'Sin etapa'}
              </div>
            </div>
          </div>

          {/* Sub-tabs del Compromiso 3 */}
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap gap-2" aria-label="Sub-tabs">
              {subTabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
                  className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeSubTab === tab.id
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Contenido según el sub-tab activo */}
          <div className="pt-4">
            {activeSubTab === 'objetivos-pei' && renderObjetivos(objetivosPEI, 'PEI')}
            {activeSubTab === 'objetivos-gd' && renderObjetivos(objetivosGD, 'GD')}
            {activeSubTab === 'situacion-actual' && (
              <div className="flex gap-4">
                {/* Tabs verticales de Situación Actual - Lado izquierdo */}
                <div className="flex-shrink-0 w-48">
                  <div className="flex flex-col gap-1 bg-gray-100 p-3 rounded-lg">
                    {situacionTabs.map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSituacionTab(tab.id)}
                        className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left ${
                          activeSituacionTab === tab.id
                            ? 'bg-white text-primary shadow-sm border-l-4 border-primary'
                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                      >
                        <span>{tab.label}</span>
                        {tab.count > 0 && (
                          <span className={`ml-2 px-1.5 py-0.5 text-sm rounded-full ${
                            activeSituacionTab === tab.id
                              ? 'bg-primary/10 text-primary'
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {tab.count}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Contenido - Lado derecho */}
                <div className="flex-1 min-w-0">
                  {renderSituacionActualContent()}
                </div>
              </div>
            )}
            {activeSubTab === 'proyectos' && renderProyectos()}
          </div>
        </div>
      )}

      {activeTab === 'normativa' && (
        <CriteriosEvaluacionList 
          criterios={criterios} 
          documentos={documentos}
          onVerDocumento={onVerDocumento}
        />
      )}

      {activeTab === 'veracidad' && (
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Validación de la información proporcionada por la entidad.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Política de Privacidad</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                  data.checkPrivacidad ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.checkPrivacidad ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
            </div>
            <div className="p-3 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Declaración Jurada</span>
                <span className={`px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                  data.checkDdjj ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {data.checkDdjj ? 'Aceptada' : 'Pendiente'}
                </span>
              </div>
            </div>
          </div>

          {/* Resumen de datos registrados */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 mb-3">Resumen de información registrada</h5>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{objetivosPEI.length}</div>
                <div className="text-sm text-blue-600">Objetivos PEI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{objetivosGD.length}</div>
                <div className="text-sm text-blue-600">Objetivos GD</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{personalTI.length}</div>
                <div className="text-sm text-blue-600">Personal TI</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-700">{proyectos.length}</div>
                <div className="text-sm text-blue-600">Proyectos</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

EvaluacionCompromiso3.propTypes = {
  data: PropTypes.object,
  activeTab: PropTypes.string.isRequired,
  criterios: PropTypes.arrayOf(PropTypes.shape({
    criterioEvaluacionId: PropTypes.number,
    descripcion: PropTypes.string,
    cumple: PropTypes.bool
  })),
  onVerDocumento: PropTypes.func
};

export default EvaluacionCompromiso3;
