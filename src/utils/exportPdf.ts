import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FootingInputs, FootingResults } from '../types/footing';

export interface ExportPdfOptions {
  filename?: string;
}

/**
 * Formatea números para presentación técnica limpia
 */
function fmt(val: number | undefined | null, decimals: number = 2): string {
  if (val === undefined || val === null || isNaN(val)) return '0.00';
  return Number(val).toFixed(decimals);
}

/**
 * Genera y descarga directamente la Memoria de Cálculo y Planos Técnicos en PDF
 * utilizando el motor nativo de vectores y tablas jsPDF + jspdf-autotable.
 *
 * Esta implementación:
 * 1. NUNCA congela el navegador (no usa html2canvas ni conversiones pesadas de DOM a imagen).
 * 2. Descarga directamente el archivo .pdf al disco en milisegundos.
 * 3. Funciona al 100% tanto en Google AI Studio como en pestañas independientes y navegadores móviles.
 */
export function generateFootingPdfReport(
  inputs: FootingInputs,
  results: FootingResults,
  options?: ExportPdfOptions
): boolean {
  try {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'letter', // 279.4 mm x 215.9 mm
    });

    const pageWidth = doc.internal.pageSize.getWidth(); // 279.4 mm
    const pageHeight = doc.internal.pageSize.getHeight(); // 215.9 mm
    const margin = 10;
    const contentWidth = pageWidth - margin * 2; // 259.4 mm

    const cleanProject = (inputs.projectName || 'Proyecto').trim();
    const cleanCode = (inputs.footingCode || 'Z-01').trim();
    const cleanEngineer = (inputs.engineerName || 'Ing. Responsable').trim();
    const dateStr = inputs.date || new Date().toLocaleDateString('es-ES');

    // =========================================================================
    // PÁGINA 1: MEMORIA DE CÁLCULO GEOTÉCNICA Y ESTRUCTURAL
    // =========================================================================

    // 1. BANNER SUPERIOR INSTITUCIONAL (#183B2F)
    doc.setFillColor(24, 59, 47);
    doc.rect(0, 0, pageWidth, 20, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12.5);
    doc.text('MEMORIA DE CÁLCULO ESTRUCTURAL Y GEOTÉCNICA: ZAPATA AISLADA', margin, 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(163, 209, 180); // #A3D1B4
    doc.text(
      `Norma Técnica: ${inputs.normative}  |  Diseño de Cimentaciones Superficiales de Concreto Armado`,
      margin,
      13.5
    );

    doc.setFontSize(7.5);
    doc.setTextColor(210, 227, 216); // #D2E3D8
    doc.text(
      `Proyecto: ${cleanProject}   |   Zapata: ${cleanCode}   |   Especialista: ${cleanEngineer}   |   Fecha: ${dateStr}`,
      margin,
      17.5
    );

    // Badge de Estado Global (Top Right)
    const isPass = results.isAllOk;
    if (isPass) {
      doc.setFillColor(34, 197, 94); // Green
      doc.roundedRect(pageWidth - margin - 35, 4.5, 35, 11, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('CONFORME / OK', pageWidth - margin - 17.5, 9.5, { align: 'center' });
      doc.setFontSize(6.2);
      doc.text('100% Verificado', pageWidth - margin - 17.5, 13.5, { align: 'center' });
    } else {
      doc.setFillColor(220, 38, 38); // Red
      doc.roundedRect(pageWidth - margin - 35, 4.5, 35, 11, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text('NO CONFORME', pageWidth - margin - 17.5, 9.5, { align: 'center' });
      doc.setFontSize(6.2);
      doc.text('Revisar Secciones', pageWidth - margin - 17.5, 13.5, { align: 'center' });
    }

    let currentY = 24;

    // 2. TABLA 1: PARÁMETROS GENERALES DE ENTRADA (GEOTECNIA, MATERIALES Y CARGAS)
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      head: [[
        'PARÁMETROS DEL SUELO',
        'MATERIALES Y RECUBRIMIENTO',
        'CARGAS ACTUANTES DE COLUMNA',
        'GEOMETRÍA DE COLUMNA',
      ]],
      body: [[
        `Capacidad Admisible (qa): ${fmt(inputs.qa, 2)} kg/cm²\nProfundidad Desplante (Df): ${fmt(inputs.df, 2)} m\nPeso Específico Suelo (γs): ${fmt(inputs.gammaSuelo, 2)} Tn/m³\nPeso Específico Concreto (γc): ${fmt(inputs.gammaConcreto, 2)} Tn/m³\nSobrecarga Terreno (s/c): ${fmt(inputs.sobrecarga, 2)} Tn/m²`,
        `Resistencia Concreto (f'c): ${fmt(inputs.fc, 0)} kg/cm²\nFluencia del Acero (fy): ${fmt(inputs.fy, 0)} kg/cm²\nRecubrimiento (r): ${fmt(inputs.rec, 1)} cm\nCapacidad Neta (qn): ${fmt(results.qn, 2)} kg/cm²`,
        `Carga Axial Normal (N / Ps): ${fmt(results.ps, 2)} Tn\nCarga Última Mayorada (Pu): ${fmt(results.pu, 2)} Tn\nMomento Mxx (dir L): ${fmt(results.mxx, 2)} Tn·m\nMomento Myy (dir B): ${fmt(results.myy, 2)} Tn·m`,
        `Sección Columna: ${inputs.bCol} x ${inputs.tCol} cm\nLado b: ${inputs.bCol} cm | Lado t: ${inputs.tCol} cm\nVarilla Columna: Ø ${inputs.colBarKey || '16mm'}\nLongitud Desarrollo (Ld): ${fmt(results.ldMin, 1)} cm`,
      ]],
      theme: 'grid',
      headStyles: {
        fillColor: [24, 59, 47],
        textColor: [255, 255, 255],
        fontSize: 7.2,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 6.5,
        textColor: [30, 41, 59],
        cellPadding: 2,
        lineColor: [203, 213, 225],
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    // 3. TABLA 2: RESULTADOS GEOTÉCNICOS Y PRESIONES DE CONTACTO
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      head: [[
        'DIMENSIONES ADOPTADAS',
        'ÁREA Y EXCENTRICIDAD',
        'PRESIONES DE CONTACTO EN SUELO',
        'VERIFICACIÓN GEOTÉCNICA',
      ]],
      body: [[
        `Ancho (B): ${fmt(results.b, 2)} m\nLargo (L): ${fmt(results.l, 2)} m\nPeralte Total (h): ${fmt(results.h, 0)} cm\nPeralte Efectivo (d): ${fmt(results.d, 1)} cm`,
        `Área Provista (Az): ${fmt(results.area, 2)} m²\nÁrea Mínima Requerida: ${fmt(results.aReq, 2)} m²\nExcentricidad e_L: ${fmt(results.excentricidadL, 3)} m (Kern: ${fmt(results.eKernL, 3)} m)\nExcentricidad e_B: ${fmt(results.excentricidadB, 3)} m (Kern: ${fmt(results.eKernB, 3)} m)`,
        `Presión Máxima (q_max): ${fmt(results.qMax, 2)} kg/cm²\nPresión Mínima (q_min): ${fmt(results.qMin, 2)} kg/cm²\nCapacidad Admisible (qa): ${fmt(inputs.qa, 2)} kg/cm²\nPresión Última Neta (qu): ${fmt(results.qu, 2)} Tn/m²`,
        `q_max / qa = ${fmt(results.qMaxRatio, 3)} (${fmt(results.qMaxRatio * 100, 1)}%)\nEstado Presión: ${results.isSoilOk ? 'CONFORME (q_max ≤ qa)' : 'EXCEDIDO'}\nEstado Tracción: ${results.qMin >= 0 ? 'Sin despegue (q_min ≥ 0)' : 'Requiere Parrilla Sup.'}\nAnclaje Disponible: ${fmt(results.ldDisponible, 1)} cm (${results.isAnclajeOk ? 'OK' : 'Revisar h'})`,
      ]],
      theme: 'grid',
      headStyles: {
        fillColor: [30, 72, 56],
        textColor: [255, 255, 255],
        fontSize: 7.2,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 6.5,
        textColor: [30, 41, 59],
        cellPadding: 2,
        lineColor: [203, 213, 225],
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 3) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = results.isSoilOk ? [21, 128, 61] : [185, 28, 28];
        }
      },
    });

    currentY = (doc as any).lastAutoTable.finalY + 4;

    // 4. TABLA 3: COMPROBACIONES ESTRUCTURALES NORMATIVAS (ACI 318 / NTE E.060)
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      head: [[
        'COMPROBACIÓN ESTRUCTURAL',
        'FUERZA ACTUANTE ÚLTIMA',
        'RESISTENCIA DE DISEÑO',
        'RATIO DCR',
        'CRITERIO NORMATIVO',
        'ESTADO',
      ]],
      body: [
        [
          'Cortante por Flexión (1 Vía a dist. d)',
          `Vu = ${fmt(results.vuFlex, 2)} Tn`,
          `ØVc = ${fmt(results.phiVcFlex, 2)} Tn`,
          `${fmt(results.flexShearRatio, 3)} (${fmt(results.flexShearRatio * 100, 1)}%)`,
          'Vu ≤ ØVc (0.53·√f\'c·b·d)',
          results.isFlexShearOk ? 'CUMPLE' : 'NO CUMPLE',
        ],
        [
          'Punzonamiento (2 Vías a dist. d/2)',
          `Vu = ${fmt(results.vuPunz, 2)} Tn`,
          `ØVc = ${fmt(results.phiVcPunz, 2)} Tn`,
          `${fmt(results.punzShearRatio, 3)} (${fmt(results.punzShearRatio * 100, 1)}%)`,
          `bo = ${fmt(results.bo, 1)} cm | Vu ≤ ØVc`,
          results.isPunzShearOk ? 'CUMPLE' : 'NO CUMPLE',
        ],
        [
          'Capacidad Portante del Suelo',
          `q_max = ${fmt(results.qMax, 2)} kg/cm²`,
          `qa = ${fmt(inputs.qa, 2)} kg/cm²`,
          `${fmt(results.qMaxRatio, 3)} (${fmt(results.qMaxRatio * 100, 1)}%)`,
          'q_max ≤ qa (Esfuerzo admisible)',
          results.isSoilOk ? 'CUMPLE' : 'NO CUMPLE',
        ],
        [
          'Longitud de Anclaje de Columna',
          `Ld_req = ${fmt(results.ldMin, 1)} cm`,
          `Ld_disp = ${fmt(results.ldDisponible, 1)} cm`,
          `${fmt(results.ldMin / Math.max(1, results.ldDisponible), 3)}`,
          'Ld_disp = h - r ≥ Ld_req',
          results.isAnclajeOk ? 'CUMPLE' : 'NO CUMPLE',
        ],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [24, 59, 47],
        textColor: [255, 255, 255],
        fontSize: 7.0,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 6.5,
        textColor: [30, 41, 59],
        cellPadding: 1.8,
      },
      columnStyles: {
        0: { cellWidth: 65, fontStyle: 'bold' },
        1: { cellWidth: 38, halign: 'right' },
        2: { cellWidth: 38, halign: 'right' },
        3: { cellWidth: 32, halign: 'center', fontStyle: 'bold' },
        4: { cellWidth: 56, fontStyle: 'italic', textColor: [71, 85, 105] },
        5: { cellWidth: contentWidth - (65 + 38 + 38 + 32 + 56), halign: 'center', fontStyle: 'bold' },
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 5) {
          const isRowPass = data.cell.raw === 'CUMPLE';
          data.cell.styles.textColor = isRowPass ? [21, 128, 61] : [185, 28, 28];
          data.cell.styles.fillColor = isRowPass ? [240, 253, 244] : [254, 242, 242];
        }
      },
    });

    // =========================================================================
    // PÁGINA 2: DISEÑO DE ACERO Y PLANOS TÉCNICOS CONSTRUCTIVOS
    // =========================================================================
    doc.addPage('letter', 'landscape');

    // 1. BANNER PÁGINA 2
    doc.setFillColor(24, 59, 47);
    doc.rect(0, 0, pageWidth, 16, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(11);
    doc.text(`PLANOS TÉCNICOS Y DESPIECE DE ACERO: ZAPATA ${cleanCode}`, margin, 7.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(210, 227, 216);
    doc.text(
      `Distribución de armadura inferior en dos direcciones | Dimensiones geométricas: B = ${fmt(results.b, 2)} m, L = ${fmt(results.l, 2)} m, h = ${fmt(results.h, 0)} cm`,
      margin,
      12.5
    );

    let page2Y = 20;

    // 2. TABLA DE DISEÑO DE ACERO A FLEXIÓN
    const barLabelL = results.selectedBarL?.label || inputs.barKey;
    const barLabelB = results.selectedBarB?.label || inputs.barKey;

    autoTable(doc, {
      startY: page2Y,
      margin: { left: margin, right: margin },
      tableWidth: contentWidth,
      head: [[
        'DIRECCIÓN DE FLEXIÓN',
        'MOMENTO ÚLTIMO (Mu)',
        'ACERO REQUERIDO (As_req)',
        'ACERO MÍNIMO (As_mín)',
        'ARMADURA COLOCADA',
        'ESPACIAMIENTO (s)',
        'ESTADO DE DISEÑO',
      ]],
      body: [
        [
          `Longitudinal (Dir. L, ancho B = ${fmt(results.b, 2)}m)`,
          `${fmt(results.muL, 2)} Tn·m`,
          `${fmt(results.asTotalL, 2)} cm² (${fmt(results.asReqPerMeterL, 2)} cm²/m)`,
          `${fmt(results.asMinPerMeter * results.b, 2)} cm²`,
          `${results.nBarsL} Ø ${barLabelL} (As = ${fmt(results.asProvidedL, 2)} cm²)`,
          `@ ${fmt(results.spacingL, 1)} cm (s_max = ${fmt(results.maxSpacing, 0)} cm)`,
          results.isSteelOkL ? 'CONFORME (As_prov ≥ As_req)' : 'INSUFICIENTE',
        ],
        [
          `Transversal (Dir. B, largo L = ${fmt(results.l, 2)}m)`,
          `${fmt(results.muB, 2)} Tn·m`,
          `${fmt(results.asTotalB, 2)} cm² (${fmt(results.asReqPerMeterB, 2)} cm²/m)`,
          `${fmt(results.asMinPerMeter * results.l, 2)} cm²`,
          `${results.nBarsB} Ø ${barLabelB} (As = ${fmt(results.asProvidedB, 2)} cm²)`,
          `@ ${fmt(results.spacingB, 1)} cm (s_max = ${fmt(results.maxSpacing, 0)} cm)`,
          results.isSteelOkB ? 'CONFORME (As_prov ≥ As_req)' : 'INSUFICIENTE',
        ],
      ],
      theme: 'grid',
      headStyles: {
        fillColor: [24, 59, 47],
        textColor: [255, 255, 255],
        fontSize: 7.0,
        fontStyle: 'bold',
        halign: 'center',
        cellPadding: 1.5,
      },
      bodyStyles: {
        fontSize: 6.5,
        textColor: [30, 41, 59],
        cellPadding: 2,
      },
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 6) {
          data.cell.styles.fontStyle = 'bold';
          data.cell.styles.textColor = data.cell.raw.toString().includes('CONFORME')
            ? [21, 128, 61]
            : [185, 28, 28];
        }
      },
    });

    const diagY = (doc as any).lastAutoTable.finalY + 4;
    const diagBoxH = 100;
    const halfW = (contentWidth - 6) / 2;

    // 3. DIBUJO CAD VECTORIAL 1: VISTA EN PLANTA (IZQUIERDA)
    const planX = margin;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(planX, diagY, halfW, diagBoxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0);
    doc.setTextColor(24, 59, 47);
    doc.text('LÁMINA 1: ESQUEMA TÉCNICO EN PLANTA (DISTRIBUCIÓN DE ACERO)', planX + 3.5, diagY + 6);

    // Dimensiones proporcionales en el recuadro
    const planAreaW = halfW - 20;
    const planAreaH = diagBoxH - 22;
    const scaleFooting = Math.min(planAreaW / (results.l || 1), planAreaH / (results.b || 1)) * 0.82;
    const drawFootingL = results.l * scaleFooting;
    const drawFootingB = results.b * scaleFooting;
    const footLeft = planX + (halfW - drawFootingL) / 2;
    const footTop = diagY + 12 + (planAreaH - drawFootingB) / 2;

    // Cuerpo zapata planta
    doc.setFillColor(237, 242, 247);
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.4);
    doc.rect(footLeft, footTop, drawFootingL, drawFootingB, 'FD');

    // Columna central en planta
    const colScaleW = (inputs.bCol / 100) * scaleFooting;
    const colScaleH = (inputs.tCol / 100) * scaleFooting;
    const colLeft = footLeft + (drawFootingL - colScaleW) / 2;
    const colTop = footTop + (drawFootingB - colScaleH) / 2;
    doc.setFillColor(30, 41, 59);
    doc.rect(colLeft, colTop, colScaleW, colScaleH, 'FD');

    // Rejilla de acero inferior (líneas verdes)
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.25);
    const nGridL = Math.min(results.nBarsL, 12);
    for (let i = 1; i <= nGridL; i++) {
      const lineY = footTop + (drawFootingB / (nGridL + 1)) * i;
      doc.line(footLeft + 2, lineY, footLeft + drawFootingL - 2, lineY);
    }
    const nGridB = Math.min(results.nBarsB, 12);
    for (let j = 1; j <= nGridB; j++) {
      const lineX = footLeft + (drawFootingL / (nGridB + 1)) * j;
      doc.line(lineX, footTop + 2, lineX, footTop + drawFootingB - 2);
    }

    // Cotas de texto en planta
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text(`L = ${fmt(results.l, 2)} m`, footLeft + drawFootingL / 2, footTop + drawFootingB + 4.5, { align: 'center' });
    doc.text(`B = ${fmt(results.b, 2)} m`, footLeft - 2.5, footTop + drawFootingB / 2, { align: 'right' });
    doc.text(`Col: ${inputs.bCol}x${inputs.tCol} cm`, colLeft + colScaleW / 2, colTop - 2, { align: 'center' });

    // Rótulos de varillas en planta
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(24, 59, 47);
    doc.text(`Dir L: ${results.nBarsL} Ø ${barLabelL} @ ${fmt(results.spacingL, 1)} cm`, planX + 3.5, diagY + diagBoxH - 6);
    doc.text(`Dir B: ${results.nBarsB} Ø ${barLabelB} @ ${fmt(results.spacingB, 1)} cm`, planX + 3.5, diagY + diagBoxH - 2.5);

    // 4. DIBUJO CAD VECTORIAL 2: VISTA EN CORTE Y DETALLE CONSTRUCTIVO (DERECHA)
    const secX = margin + halfW + 6;
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(secX, diagY, halfW, diagBoxH, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.0);
    doc.setTextColor(24, 59, 47);
    doc.text('LÁMINA 2: CORTE TÉCNICO Y DESPIECE DEL PERALTE (h, d, r)', secX + 3.5, diagY + 6);

    // Escala del corte
    const secFootL = halfW - 24;
    const secFootH = 22;
    const sLeft = secX + (halfW - secFootL) / 2;
    const sTop = diagY + 44;

    // Zapata en corte
    doc.setFillColor(237, 242, 247);
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.4);
    doc.rect(sLeft, sTop, secFootL, secFootH, 'FD');

    // Pedestal / Columna emergiendo
    const colPedW = Math.min(26, secFootL * 0.35);
    const colPedH = 26;
    const colPedLeft = sLeft + (secFootL - colPedW) / 2;
    const colPedTop = sTop - colPedH;
    doc.setFillColor(226, 232, 240);
    doc.rect(colPedLeft, colPedTop, colPedW, colPedH, 'FD');

    // Varilla inferior con ganchos laterales a 90° (línea roja gruesa)
    doc.setDrawColor(220, 38, 38);
    doc.setLineWidth(0.65);
    const rebarBottomY = sTop + secFootH - 3;
    const hookUpY = rebarBottomY - 12;
    // Línea horizontal
    doc.line(sLeft + 3, rebarBottomY, sLeft + secFootL - 3, rebarBottomY);
    // Gancho izquierdo
    doc.line(sLeft + 3, rebarBottomY, sLeft + 3, hookUpY);
    // Gancho derecho
    doc.line(sLeft + secFootL - 3, rebarBottomY, sLeft + secFootL - 3, hookUpY);

    // Puntos de armadura transversal sobre la varilla longitudinal
    doc.setFillColor(16, 185, 129);
    doc.setDrawColor(5, 150, 105);
    const nDots = 8;
    for (let k = 1; k <= nDots; k++) {
      const dotX = sLeft + (secFootL / (nDots + 1)) * k;
      doc.circle(dotX, rebarBottomY - 1.2, 0.8, 'FD');
    }

    // Terreno y Solado
    doc.setDrawColor(148, 163, 184);
    doc.setLineWidth(0.2);
    doc.line(secX + 4, sTop, sLeft, sTop);
    doc.line(sLeft + secFootL, sTop, secX + halfW - 4, sTop);
    // Línea de solado bajo zapata
    doc.setFillColor(203, 213, 225);
    doc.rect(sLeft - 1, sTop + secFootH, secFootL + 2, 2.5, 'FD');

    // Cotas de altura h, d, recubrimiento
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(30, 41, 59);
    doc.text(`h = ${fmt(results.h, 0)} cm`, sLeft + secFootL + 3, sTop + secFootH / 2);
    doc.text(`d = ${fmt(results.d, 1)} cm`, sLeft + secFootL + 3, sTop + secFootH / 2 + 4.5);
    doc.text(`Recubrimiento r = ${fmt(inputs.rec, 1)} cm`, sLeft + secFootL / 2, sTop + secFootH + 6, { align: 'center' });
    doc.text('Solado e = 10 cm (f\'c=100 kg/cm²)', sLeft + secFootL / 2, sTop + secFootH + 9.5, { align: 'center' });

    // Notas de especificación técnica al pie de Lámina 2
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.0);
    doc.setTextColor(71, 85, 105);
    doc.text(
      'NOTAS TÉCNICAS: Acero grado 60 (Fy = 4200 kg/cm²). Ganchos estándar a 90° con longitud mínima según ACI 318.',
      secX + 3.5,
      diagY + diagBoxH - 6
    );
    doc.text(
      'Vaciado de concreto f\'c sobre solado compactado. No vaciar directamente sobre el terreno natural.',
      secX + 3.5,
      diagY + diagBoxH - 2.5
    );

    // =========================================================================
    // PIE DE PÁGINA NUMERADO EN TODAS LAS PÁGINAS
    // =========================================================================
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let p = 1; p <= totalPages; p++) {
      doc.setPage(p);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(100, 116, 139);

      // Pie izquierdo
      doc.text(
        `Memoria de Cálculo Técnico — Zapata ${cleanCode} — Proyecto: ${cleanProject} — Norma: ${inputs.normative}`,
        margin,
        pageHeight - 4
      );

      // Pie derecho
      doc.text(
        `Página ${p} de ${totalPages}`,
        pageWidth - margin - 15,
        pageHeight - 4
      );
    }

    // =========================================================================
    // GUARDADO DIRECTO DEL ARCHIVO PDF EN EL NAVEGADOR
    // =========================================================================
    const rawOutName = options?.filename || `Memoria_Calculo_${cleanCode}_${cleanProject}.pdf`;
    const outFileName = rawOutName.endsWith('.pdf') ? rawOutName : `${rawOutName}.pdf`;

    doc.save(outFileName);
    return true;
  } catch (error) {
    console.error('Error al generar el reporte con jsPDF:', error);
    return false;
  }
}

/**
 * Función de compatibilidad con llamados anteriores
 */
export async function downloadReportPdf(
  elementId: string,
  options?: ExportPdfOptions,
  inputs?: FootingInputs,
  results?: FootingResults
): Promise<boolean> {
  if (inputs && results) {
    return generateFootingPdfReport(inputs, results, options);
  }
  // En caso de invocación directa sin inputs, buscar en el DOM o ventana
  console.warn('downloadReportPdf invocado sin inputs/results directos');
  return false;
}
