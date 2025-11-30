/**
 * Templates HTML para el contenido específico del Paso 1 de cada compromiso
 */

const emailTemplates = {
  /**
   * Genera el HTML del Paso 1 para Compromiso 1: Líder GTD
   */
  com1Paso1Html(data) {
    return `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">DNI</div>
          <div class="info-value">${data.nroDni || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Nombres</div>
          <div class="info-value">${data.nombres || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Apellido Paterno</div>
          <div class="info-value">${data.apellidoPaterno || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Apellido Materno</div>
          <div class="info-value">${data.apellidoMaterno || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Correo Electrónico</div>
          <div class="info-value">${data.correoElectronico || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Teléfono</div>
          <div class="info-value">${data.telefono || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Rol</div>
          <div class="info-value">${data.rol || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Cargo</div>
          <div class="info-value">${data.cargo || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Fecha de Inicio</div>
          <div class="info-value">${data.fechaInicio || '-'}</div>
        </div>
      </div>
    `;
  },

  /**
   * Compromiso 2: Comité GTD
   */
  com2Paso1Html(data) {
    const miembrosHtml = data.miembros?.map((m, i) => `
      <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-bottom: 10px;">
        <strong>Miembro ${i + 1}:</strong> ${m.nombre} ${m.apellidoPaterno} ${m.apellidoMaterno}<br>
        <small>DNI: ${m.dni} | Rol: ${m.rol} | Email: ${m.email}</small>
      </div>
    `).join('') || '<p>Sin miembros registrados</p>';

    return `
      <div>
        <h4 style="margin-bottom: 15px;">Miembros del Comité:</h4>
        ${miembrosHtml}
      </div>
    `;
  },

   /**
   * Compromiso 3: Estrategia GobPe
   */
  com3Paso1Html() {
    return `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Información</div>
          <div class="info-value">Estrategia de Gobierno Electrónico en gob.pe</div>
        </div>
      </div>
    `;
  },
 

  /**
   * Compromiso 4: Incorporar TD en el PEI
   */
  com4Paso1Html(data) {
    return `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Año Inicio PEI</div>
          <div class="info-value">${data.anioInicio || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Año Fin PEI</div>
          <div class="info-value">${data.anioFin || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Fecha de Aprobación</div>
          <div class="info-value">${data.fechaAprobacion || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Alineado con PGD</div>
          <div class="info-value">${data.alineadoPgd ? 'Sí' : 'No'}</div>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <div class="info-label">Objetivo Estratégico</div>
        <p style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 8px;">
          ${data.objetivoEstrategico || '-'}
        </p>
      </div>
      <div style="margin-top: 15px;">
        <div class="info-label">Descripción de Incorporación</div>
        <p style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 8px;">
          ${data.descripcionIncorporacion || '-'}
        </p>
      </div>
    `;
  },

  /**
   * Compromiso 5: Estrategia Digital
   */
  com5Paso1Html(data) {
    return `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Nombre de la Estrategia</div>
          <div class="info-value">${data.nombreEstrategia || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Periodo</div>
          <div class="info-value">${data.anioInicio || '-'} - ${data.anioFin || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Fecha de Aprobación</div>
          <div class="info-value">${data.fechaAprobacion || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Estado de Implementación</div>
          <div class="info-value">${data.estadoImplementacion || '-'}</div>
        </div>
        <div class="info-item">
          <div class="info-label">Alineado con PGD</div>
          <div class="info-value">${data.alineadoPgd ? 'Sí' : 'No'}</div>
        </div>
      </div>
      <div style="margin-top: 15px;">
        <div class="info-label">Objetivos Estratégicos</div>
        <p style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 8px;">
          ${data.objetivosEstrategicos || '-'}
        </p>
      </div>
      <div style="margin-top: 15px;">
        <div class="info-label">Líneas de Acción</div>
        <p style="background-color: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 8px;">
          ${data.lineasAccion || '-'}
        </p>
      </div>
    `;
  },

  /**
   * Compromisos 6-21: Template genérico para compromisos restantes
   */
  genericPaso1Html(compromisoId, compromisoNombre, data) {
    // Construir HTML dinámicamente basado en los campos disponibles
    const fields = [];
    
    // Lista de campos comunes que pueden aparecer
    const commonFields = [
      { key: 'urlPortalGobPe', label: 'URL Portal GOB.PE' },
      { key: 'fechaMigracion', label: 'Fecha de Migración' },
      { key: 'nombreResponsable', label: 'Responsable' },
      { key: 'correoResponsable', label: 'Correo Responsable' },
      { key: 'telefonoResponsable', label: 'Teléfono' },
      { key: 'urlMpd', label: 'URL MPD' },
      { key: 'urlTupa', label: 'URL TUPA' },
      { key: 'numeroResolucion', label: 'Número de Resolución' },
      { key: 'fechaAprobacion', label: 'Fecha de Aprobación' },
      { key: 'observaciones', label: 'Observaciones' }
    ];

    commonFields.forEach(({ key, label }) => {
      if (data[key]) {
        fields.push(`
          <div class="info-item">
            <div class="info-label">${label}</div>
            <div class="info-value">${data[key]}</div>
          </div>
        `);
      }
    });

    return `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Compromiso</div>
          <div class="info-value">${compromisoNombre}</div>
        </div>
        ${fields.join('')}
      </div>
    `;
  },

  /**
   * Genera HTML para Paso 2 (común para todos)
   */
  paso2Html(data) {
    const criteriosHtml = data.criteriosEvaluados?.map((c, i) => `
      <div style="display: flex; align-items: center; padding: 10px; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 8px;">
        <span style="color: ${c.cumple ? '#28a745' : '#dc3545'}; font-size: 18px; margin-right: 10px;">
          ${c.cumple ? '✓' : '✗'}
        </span>
        <span>Criterio ${i + 1}: ${c.cumple ? 'Cumple' : 'No cumple'}</span>
      </div>
    `).join('') || '<p>Sin criterios evaluados</p>';

    return `
      <div>
        <div class="info-item" style="margin-bottom: 15px;">
          <div class="info-label">Documento Normativo</div>
          <div class="info-value">${data.documentoUrl ? '✓ Documento cargado' : 'Sin documento'}</div>
        </div>
        <h4 style="margin: 15px 0;">Criterios de Evaluación:</h4>
        ${criteriosHtml}
      </div>
    `;
  },

  /**
   * Genera HTML para Paso 3 (común para todos)
   */
  paso3Html(data) {
    return `
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">Política de Privacidad</div>
          <div class="info-value">
            <span style="color: ${data.aceptaPoliticaPrivacidad ? '#28a745' : '#dc3545'};">
              ${data.aceptaPoliticaPrivacidad ? '✓ Aceptada' : '✗ No aceptada'}
            </span>
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">Declaración Jurada</div>
          <div class="info-value">
            <span style="color: ${data.aceptaDeclaracionJurada ? '#28a745' : '#dc3545'};">
              ${data.aceptaDeclaracionJurada ? '✓ Aceptada' : '✗ No aceptada'}
            </span>
          </div>
        </div>
      </div>
      <div style="margin-top: 20px; padding: 15px; background-color: #e7f3ff; border-left: 4px solid #2196F3; border-radius: 4px;">
        <p style="margin: 0; color: #1976D2;">
          <strong>Confirmación:</strong> El responsable ha verificado y confirmado la veracidad de toda la información proporcionada en este registro de cumplimiento normativo.
        </p>
      </div>
    `;
  },

  /**
   * Método principal para obtener el HTML del Paso 1 según el compromiso
   */
  getPaso1Html(compromisoId, compromisoNombre, data) {
    switch (compromisoId) {
      case 1:
        return this.com1Paso1Html(data);
      case 2:
        return this.com2Paso1Html(data);
      case 3:
        return this.com3Paso1Html(data);
      case 4:
        return this.com4Paso1Html(data);
      case 5:
        return this.com5Paso1Html(data);
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
      case 14:
      case 15:
      case 16:
      case 17:
      case 18:
      case 19:
      case 20:
      case 21:
        return this.genericPaso1Html(compromisoId, compromisoNombre, data);
      default:
        return '<p>Información del compromiso no disponible</p>';
    }
  }
};

export default emailTemplates;
