import { FootingInputs, FootingResults } from '../types/footing';

export function exportFootingCsv(inputs: FootingInputs, results: FootingResults) {
  const rows = [
    ['MEMORIA DE CÁLCULO - DISEÑO DE ZAPATA AISLADA', ''],
    ['Proyecto', inputs.projectName],
    ['Código de Zapata', inputs.footingCode],
    ['Especialista / Proyectista', inputs.engineerName],
    ['Fecha', inputs.date],
    ['Normativa Aplicada', inputs.normative],
    ['', ''],
    ['1. PROPIEDADES DE MATERIALES', ''],
    ['Resistencia Concreto f\'c (kg/cm²)', inputs.fc],
    ['Fluencia del Acero Fy (kg/cm²)', inputs.fy],
    ['Recubrimiento libre r (cm)', inputs.rec],
    ['', ''],
    ['2. PARÁMETROS GEOTÉCNICOS', ''],
    ['Capacidad Portante Admisible qa (kg/cm²)', inputs.qa],
    ['Profundidad de Desplante Df (m)', inputs.df],
    ['Peso Específico Suelo (Tn/m³)', inputs.gammaSuelo],
    ['Peso Específico Concreto (Tn/m³)', inputs.gammaConcreto],
    ['Sobrecarga Terreno (Tn/m²)', inputs.sobrecarga],
    ['Capacidad Neta Terreno qn (kg/cm²)', results.qn.toFixed(3)],
    ['Área Requerida Mínima Az_req (m²)', results.aReq.toFixed(2)],
    ['', ''],
    ['3. ESFUERZOS DE COLUMNA (CYPECAD)', ''],
    ['Carga Axial Normal N (Tn)', inputs.n],
    ['Momento Flector Mxx (Tn.m)', inputs.mxx],
    ['Momento Flector Myy (Tn.m)', inputs.myy],
    ['Carga de Servicio Ps (Tn)', results.ps.toFixed(2)],
    ['Carga Mayorada Pu (Tn)', results.pu.toFixed(2)],
    ['Momento Mayorado Mu (Tn.m)', results.mu.toFixed(2)],
    ['', ''],
    ['4. GEOMETRÍA ADOPTADA', ''],
    ['Ancho Zapata B (m)', results.b.toFixed(2)],
    ['Largo Zapata L (m)', results.l.toFixed(2)],
    ['Altura Zapata h (cm)', results.h],
    ['Peralte Efectivo d (cm)', results.d],
    ['Área Adoptada Az (m²)', results.area.toFixed(2)],
    ['Lado Columna b (cm)', inputs.bCol],
    ['Lado Columna t (cm)', inputs.tCol],
    ['', ''],
    ['5. COMPROBACIONES DE SEGURIDAD', ''],
    ['Presión Máxima Suelo q_max (kg/cm²)', results.qMax.toFixed(3)],
    ['Estado Presión Suelo', results.isSoilOk ? 'OK (CONFORME)' : 'NO CUMPLE'],
    ['Cortante por Flexión Vu (Tn)', results.vuFlex.toFixed(2)],
    ['Resistencia a Cortante ØVc (Tn)', results.phiVcFlex.toFixed(2)],
    ['Ratio Vu / ØVc Cortante', (results.flexShearRatio * 100).toFixed(1) + '%'],
    ['Estado Cortante', results.isFlexShearOk ? 'CONFORME' : 'NO CUMPLE'],
    ['Cortante por Punzonamiento Vu_p (Tn)', results.vuPunz.toFixed(2)],
    ['Resistencia Punzonamiento ØVc_p (Tn)', results.phiVcPunz.toFixed(2)],
    ['Ratio Punzonamiento', (results.punzShearRatio * 100).toFixed(1) + '%'],
    ['Estado Punzonamiento', results.isPunzShearOk ? 'CONFORME' : 'NO CUMPLE'],
    ['', ''],
    ['6. DISEÑO DE ACERO DE REFUERZO', ''],
    ['Varilla Seleccionada', results.selectedBar.label],
    ['Refuerzo en Dirección L', `${results.nBarsL} ${results.selectedBar.key} @ ${results.spacingL} cm`],
    ['Refuerzo en Dirección B', `${results.nBarsB} ${results.selectedBar.key} @ ${results.spacingB} cm`],
    ['Espaciamiento Máximo Normativo S_max (cm)', results.maxSpacing],
    ['Estado Espaciamiento', results.isSpacingOk ? 'CONFORME' : 'AJUSTAR'],
    ['', ''],
    ['DIAGNÓSTICO GENERAL', results.statusText],
  ];

  const csvContent =
    'data:text/csv;charset=utf-8,' +
    rows.map((e) => e.map((val) => `"${val}"`).join(',')).join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Memoria_Zapata_${inputs.footingCode || 'Z01'}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
