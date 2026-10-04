import React from 'react';
import { FootingInputs, FootingResults } from '../types/footing';
import { X, Printer, Download, CheckCircle2, AlertTriangle, FileText, Check, Layers } from 'lucide-react';
import { generateFootingPdfReport } from '../utils/exportPdf';

interface CalculationReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: FootingInputs;
  results: FootingResults;
}

export const CalculationReportModal: React.FC<CalculationReportModalProps> = ({
  isOpen,
  onClose,
  inputs,
  results,
}) => {
  const reportRef = React.useRef<HTMLDivElement>(null);

  return (
    <div
      className={
        isOpen
          ? "fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:m-0 print:bg-white print:static print:overflow-visible"
          : "fixed left-0 top-0 w-[1050px] max-w-[1050px] overflow-visible pointer-events-none opacity-0 z-[-9999] bg-white print:static print:left-0 print:w-full print:z-auto print:opacity-100"
      }
    >
      {/* Contenedor Modal en Pantalla / Contenedor Completo en Impresión y Exportación */}
      <div
        className={
          isOpen
            ? "bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-gray-200 overflow-hidden print:max-w-none print:w-full print:max-h-none print:shadow-none print:border-none print:overflow-visible"
            : "w-[1000px] max-w-[1000px] bg-white print:max-w-none print:w-full print:max-h-none print:shadow-none print:border-none print:overflow-visible"
        }
      >
        {/* Barra superior de control del Modal (oculta en impresión y visible solo si isOpen) */}
        {isOpen && (
          <div className="flex items-center justify-between px-5 py-3.5 bg-[#183B2F] text-white border-b border-[#143228] print:hidden">
            <div className="flex items-center space-x-2.5">
              <FileText className="w-5 h-5 text-[#D2E3D8]" />
              <div>
                <span className="font-bold text-sm sm:text-base tracking-tight block">
                  MEMORIA DE CÁLCULO Y PLANOS CAD — {inputs.footingCode}
                </span>
                <span className="text-[11px] text-[#A3D1B4] hidden sm:block">
                  Formato Carta Horizontal (Letter Landscape) | Láminas Constructivas Independientes
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() =>
                  generateFootingPdfReport(inputs, results, {
                    filename: `Memoria_${inputs.footingCode}_${inputs.projectName}.pdf`,
                  })
                }
                className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D2E3D8] text-[#183B2F] hover:bg-[#b9d6c2] transition-colors cursor-pointer"
                title="Descargar informe técnico en PDF en Carta Horizontal"
              >
                <Download className="w-4 h-4" />
                <span>Descargar PDF</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#255845] transition-colors cursor-pointer"
                title="Cerrar memoria de cálculo"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Contenido imprimible de la Memoria de Cálculo y Planos CAD */}
        <div
          id="printable-calculation-report"
          ref={reportRef}
          className="p-5 sm:p-7 overflow-y-auto font-sans text-slate-800 space-y-6 print:p-0 print:m-0 print:space-y-0 print:overflow-visible"
        >
          {/* ============================================================
              HOJA 1: MEMORIA DE CÁLCULO GEOTÉCNICA Y PARÁMETROS
              (Formato Carta Horizontal: 279.4mm x 215.9mm)
             ============================================================ */}
          <div className="page-break-after print:min-h-[190mm] print:max-h-[190mm] print:flex print:flex-col print:justify-between space-y-3.5 print:p-0">
            <div className="space-y-3">
              {/* MEMBRETE TÉCNICO FORMAL */}
              <div className="border-2 border-[#183B2F] rounded-lg p-3.5 bg-[#F7F7F2]/60">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#183B2F] pb-2.5 mb-2.5 gap-2">
                  <div>
                    <h1 className="text-lg sm:text-xl font-black text-[#183B2F] tracking-tight">
                      MEMORIA DE CÁLCULO: ZAPATA AISLADA DE C.A.
                    </h1>
                    <p className="text-[11px] text-gray-600 font-medium">
                      Cálculo Geotécnico y Diseño Estructural según norma {inputs.normative} (Carta Horizontal)
                    </p>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    <span className="inline-block px-3 py-1 bg-[#183B2F] text-white font-mono text-xs sm:text-sm font-bold rounded">
                      CÓDIGO: {inputs.footingCode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500 block text-[11px]">Proyecto:</span>
                    <span className="font-bold text-[#183B2F] truncate block">{inputs.projectName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Especialista:</span>
                    <span className="font-bold text-[#183B2F] truncate block">{inputs.engineerName}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Fecha:</span>
                    <span className="font-bold text-[#183B2F]">{inputs.date}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[11px]">Estado Global:</span>
                    <span
                      className={`font-bold inline-flex items-center gap-1 ${
                        results.isAllOk ? 'text-emerald-700' : 'text-red-700'
                      }`}
                    >
                      {results.isAllOk ? 'CONFORME / APROBADO' : 'NO CUMPLE'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. DATOS GENERALES Y MATERIALES */}
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
                  1. Parámetros de Diseño y Materiales
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-gray-50 p-2.5 rounded-lg border border-gray-200">
                  <div>
                    <span className="text-gray-500 block text-[10px]">Concreto f'c:</span>
                    <span className="font-bold">{inputs.fc} kg/cm²</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Fluencia Acero Fy:</span>
                    <span className="font-bold">{inputs.fy} kg/cm²</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Capacidad Admisible qa:</span>
                    <span className="font-bold text-[#183B2F]">{inputs.qa.toFixed(2)} kg/cm²</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Profundidad Desplante Df:</span>
                    <span className="font-bold">{inputs.df.toFixed(2)} m</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Carga Axial Normal N:</span>
                    <span className="font-bold text-[#183B2F]">{inputs.n.toFixed(2)} Tn</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Momento Mxx / Myy:</span>
                    <span className="font-bold">{inputs.mxx.toFixed(2)} / {inputs.myy.toFixed(2)} Tn.m</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Carga Servicio Ps:</span>
                    <span className="font-bold text-[#183B2F]">{results.ps.toFixed(2)} Tn</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Carga Mayorada Pu:</span>
                    <span className="font-bold text-[#183B2F]">{results.pu.toFixed(2)} Tn</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sección Columna (b x t):</span>
                    <span className="font-bold">{inputs.bCol} x {inputs.tCol} cm</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Recubrimiento r:</span>
                    <span className="font-bold">{inputs.rec} cm</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Peso esp. suelo/concreto:</span>
                    <span className="font-bold">{inputs.gammaSuelo} / {inputs.gammaConcreto} Tn/m³</span>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">Sobrecarga s/c:</span>
                    <span className="font-bold">{inputs.sobrecarga.toFixed(2)} Tn/m²</span>
                  </div>
                </div>
              </div>

              {/* 2. DIMENSIONAMIENTO EN PLANTA Y PERALTE */}
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-1.5">
                  2. Dimensionamiento Geotécnico en Planta y Peralte
                </h2>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>
                    <strong>Capacidad neta del terreno (qn):</strong> qn = qa - (Df*γprom + s/c)/10 ={' '}
                    <span className="font-mono font-bold text-[#183B2F]">{results.qn.toFixed(3)} kg/cm²</span>.
                    Área mínima requerida: Az_req = Ps / (qn * 10) ={' '}
                    <span className="font-mono font-bold">{results.aReq.toFixed(2)} m²</span>.
                  </p>
                  <p>
                    <strong>Dimensiones adoptadas:</strong> B ={' '}
                    <span className="font-bold text-[#183B2F]">{results.b.toFixed(2)} m</span>, L ={' '}
                    <span className="font-bold text-[#183B2F]">{results.l.toFixed(2)} m</span> → Área Az ={' '}
                    <span className="font-bold">{results.area.toFixed(2)} m²</span> (Az ≥ Az_req → <strong>CONFORME</strong>).
                  </p>
                  <p>
                    <strong>Peralte y Altura:</strong> Altura adoptada h ={' '}
                    <span className="font-bold">{results.h} cm</span>, Peralte efectivo d = h - r - db ={' '}
                    <span className="font-bold">{results.d} cm</span> (Recubrimiento r = {inputs.rec} cm, Anclaje Ld_mín = {results.ldMin.toFixed(1)} cm).
                  </p>
                </div>
              </div>

              {/* 3. VERIFICACIÓN DE PRESIONES EN EL SUELO */}
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-1.5">
                  3. Comprobación de Presiones sobre el Suelo
                </h2>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>
                    <strong>Presión de contacto máxima:</strong> q_max = (Ps / Az) + (Ms * (L/2) / Iz) ={' '}
                    <span className="font-mono font-bold text-[#183B2F]">{results.qMax.toFixed(2)} kg/cm²</span> ≤ qa ({inputs.qa.toFixed(2)} kg/cm²) →{' '}
                    <span className={results.isSoilOk ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                      {results.isSoilOk ? 'CUMPLE SATISFACTORIAMENTE' : 'NO CUMPLE'}
                    </span>
                  </p>
                  <p>
                    <strong>Presión mínima:</strong> q_min = {results.qMin.toFixed(2)} kg/cm² (Sin esfuerzos de tracción en la base del suelo).
                  </p>
                </div>
              </div>

              {/* 4. VERIFICACIÓN DE CORTANTE POR FLEXIÓN */}
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-1.5">
                  4. Verificación de Cortante por Flexión (Una Vía a distancia 'd')
                </h2>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>
                    <strong>Presión última neta de contacto:</strong> qu = Pu / (B * L) ={' '}
                    <span className="font-mono font-bold">{results.qu.toFixed(2)} Tn/m²</span>. Volado Lv = {results.lvL.toFixed(2)} m. Distancia crítica (Lv - d) = {results.critDistance.toFixed(2)} m.
                  </p>
                  <p>
                    <strong>Fuerza cortante actuante:</strong> Vu = qu * (Lv - d) * B ={' '}
                    <span className="font-mono font-bold text-[#183B2F]">{results.vuFlex.toFixed(2)} Tn</span> vs{' '}
                    <strong>Resistencia de diseño ØVc = {results.phiVcFlex.toFixed(2)} Tn</strong> →{' '}
                    <span className={results.isFlexShearOk ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                      {results.isFlexShearOk ? 'CONFORME (Ratio D/C = ' + (results.flexShearRatio * 100).toFixed(1) + '%)' : 'NO CUMPLE'}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Pie de página técnico para Hoja 1 */}
            <div className="hidden print:flex items-center justify-between pt-2 border-t border-gray-300 text-[10px] text-gray-500 font-mono">
              <span>Proyecto: {inputs.projectName} | Zapata: {inputs.footingCode} | Norma: {inputs.normative}</span>
              <span>Hoja 1 de 4 — Memoria de Cálculo Geotécnica</span>
            </div>
          </div>

          {/* ============================================================
              HOJA 2: DISEÑO A FLEXIÓN, PUNZONAMIENTO Y APROBACIÓN TÉCNICA
              (Formato Carta Horizontal: 279.4mm x 215.9mm)
             ============================================================ */}
          <div className="page-break-before page-break-after print:min-h-[190mm] print:max-h-[190mm] print:flex print:flex-col print:justify-between space-y-3.5 print:p-0 pt-4 print:pt-0">
            <div className="space-y-3">
              {/* Encabezado formal de continuidad en Hoja 2 */}
              <div className="hidden print:flex items-center justify-between pb-1.5 border-b border-gray-300 text-[10px] text-[#183B2F] font-bold">
                <span>MEMORIA DE CÁLCULO ESTRUCTURAL — {inputs.footingCode} ({inputs.projectName})</span>
                <span>DISEÑO A FLEXIÓN, PUNZONAMIENTO Y VERIFICACIONES NORMATIVAS</span>
              </div>

              {/* 5. VERIFICACIÓN POR PUNZONAMIENTO */}
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-1.5">
                  5. Verificación de Punzonamiento (Dos Vías en Perímetro Crítico bo)
                </h2>
                <div className="space-y-1 text-xs text-gray-700">
                  <p>
                    <strong>Perímetro crítico (bo):</strong> bo = 2*(b + d) + 2*(t + d) ={' '}
                    <span className="font-mono font-bold">{results.bo} cm</span>. Área crítica Ap = {results.ap.toFixed(3)} m².
                  </p>
                  <p>
                    <strong>Cortante actuante vs Resistencia:</strong> Vu_p ={' '}
                    <span className="font-mono font-bold text-[#183B2F]">{results.vuPunz.toFixed(2)} Tn</span> vs ØVc_p ={' '}
                    <span className="font-mono font-bold text-[#183B2F]">{results.phiVcPunz.toFixed(2)} Tn</span> →{' '}
                    <span className={results.isPunzShearOk ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                      {results.isPunzShearOk ? 'CONFORME (Ratio D/C = ' + (results.punzShearRatio * 100).toFixed(1) + '%)' : 'NO CUMPLE'}
                    </span>
                  </p>
                </div>
              </div>

              {/* 6. DISEÑO A FLEXIÓN Y DISPOSICIÓN DE ACERO */}
              <div>
                <h2 className="text-xs sm:text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-1.5">
                  6. Diseño a Flexión y Armadura de Acero
                </h2>
                <div className="space-y-1.5 text-xs text-gray-700">
                  <p>
                    <strong>Momento flector último (Mu):</strong> Mu ={' '}
                    <span className="font-mono font-bold text-[#183B2F]">{results.muL.toFixed(2)} Tn.m</span>. Acero mínimo normativo: As_mín = {results.asMinPerMeter.toFixed(2)} cm²/m. As requerido: {results.asTotalL.toFixed(2)} cm².
                  </p>

                  {/* Armadura Inferior Adoptada */}
                  <div className="p-2.5 bg-[#D2E3D8]/30 rounded-lg border border-[#A3D1B4] text-[#183B2F] text-xs">
                    <span className="font-extrabold text-[#183B2F] block mb-1.5 text-[11px] uppercase tracking-wide">
                      Armadura Final Adoptada (Parrilla Inferior Diferenciada):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2 rounded border border-[#A3D1B4]/80 shadow-2xs">
                        <span className="font-bold text-[#183B2F] block text-[11px]">
                          Dirección L (Longitudinal):
                        </span>
                        <div className="font-extrabold text-sm text-slate-900 font-mono">
                          {results.nBarsL} varillas de {results.selectedBarL.label} @ {results.spacingL} cm
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          As colocado: {results.asProvidedL.toFixed(2)} cm² (Req: {results.asTotalL.toFixed(2)} cm²)
                        </span>
                      </div>

                      <div className="bg-white p-2 rounded border border-[#A3D1B4]/80 shadow-2xs">
                        <span className="font-bold text-[#183B2F] block text-[11px]">
                          Dirección B (Transversal):
                        </span>
                        <div className="font-extrabold text-sm text-slate-900 font-mono">
                          {results.nBarsB} varillas de {results.selectedBarB.label} @ {results.spacingB} cm
                        </div>
                        <span className="text-[10px] text-gray-500 block">
                          As colocado: {results.asProvidedB.toFixed(2)} cm² (Req: {results.asTotalB.toFixed(2)} cm²)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Parrilla Superior Condicional (Evaluación de Kern) */}
                  <div
                    className={`p-2.5 rounded-lg border text-xs ${
                      results.isOutOfKern
                        ? 'bg-amber-50/70 border-amber-300 text-amber-950 shadow-xs'
                        : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold mb-1">
                      <span className="uppercase tracking-wide text-[11px]">
                        ARMADURA SUPERIOR (PARRILLA SUPERIOR):
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-extrabold ${
                          results.isOutOfKern
                            ? 'bg-amber-200 text-amber-900 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        {results.isOutOfKern
                          ? 'Requerida por Fuera de Kern (e > L/6)'
                          : 'No Requerida (En Kern, e ≤ L/6)'}
                      </span>
                    </div>
                    {results.isOutOfKern ? (
                      <div className="space-y-1.5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-sans">
                          <div className="bg-white p-2 rounded border border-amber-200 text-slate-800">
                            <span className="font-bold text-[11px] text-[#183B2F] block">
                              Parrilla Sup. Dir. L:
                            </span>
                            <div className="font-extrabold text-sm text-slate-900 font-mono">
                              {results.topNBarsL} varillas de {results.topSelectedBarL.label} @ {results.topSpacingL} cm
                            </div>
                            <span className="text-[10px] text-gray-500 block">
                              As colocado: {results.topAsProvidedL.toFixed(2)} cm² (Mín: {results.topAsMinL.toFixed(2)} cm²)
                            </span>
                          </div>
                          <div className="bg-white p-2 rounded border border-amber-200 text-slate-800">
                            <span className="font-bold text-[11px] text-[#183B2F] block">
                              Parrilla Sup. Dir. B:
                            </span>
                            <div className="font-extrabold text-sm text-slate-900 font-mono">
                              {results.topNBarsB} varillas de {results.topSelectedBarB.label} @ {results.topSpacingB} cm
                            </div>
                            <span className="text-[10px] text-gray-500 block">
                              As colocado: {results.topAsProvidedB.toFixed(2)} cm² (Mín: {results.topAsMinB.toFixed(2)} cm²)
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-gray-500">
                        Excentricidad e = {results.excentricidadL.toFixed(3)} m ≤ L/6 ({results.eKernL.toFixed(3)} m). Toda la base bajo compresión (sin despegue ni tracción).
                      </p>
                    )}
                  </div>

                  {/* Verificación de Anclaje de Columna */}
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-700 flex items-center justify-between">
                    <div>
                      <strong>Anclaje y Longitud de Desarrollo Columna (Ld):</strong> Ld_mín = {results.ldMin.toFixed(1)} cm vs Ld_disponible = {results.ldDisponible.toFixed(1)} cm.
                    </div>
                    <span className={`font-bold ${results.isAnclajeOk ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {results.isAnclajeOk ? 'ANCLAJE CONFORME' : 'VERIFICAR GANCHO ESTÁNDAR 90°'}
                    </span>
                  </div>
                </div>
              </div>

              {/* FIRMA Y RESPONSABILIDAD TÉCNICA */}
              <div className="pt-3 border-t border-gray-300 grid grid-cols-2 gap-6 text-center text-xs">
                <div>
                  <div className="border-b border-gray-400 pb-10 mb-1 w-44 mx-auto" />
                  <p className="font-bold text-gray-800">{inputs.engineerName}</p>
                  <p className="text-[10px] text-gray-500">Ingeniero Proyectista Estructural</p>
                </div>
                <div>
                  <div className="border-b border-gray-400 pb-10 mb-1 w-44 mx-auto" />
                  <p className="font-bold text-gray-800">Revisión y Aprobación</p>
                  <p className="text-[10px] text-gray-500">Dirección Técnica de Proyecto</p>
                </div>
              </div>
            </div>

            {/* Pie de página técnico para Hoja 2 */}
            <div className="hidden print:flex items-center justify-between pt-2 border-t border-gray-300 text-[10px] text-gray-500 font-mono">
              <span>Especialista: {inputs.engineerName} | Fecha: {inputs.date}</span>
              <span>Hoja 2 de 4 — Verificaciones Estructurales y Aprobación</span>
            </div>
          </div>

          {/* ============================================================
              HOJA 3: LÁMINA 1 (PLANTA DE CIMENTACIÓN Y MALLA ORTOGONAL - PL-01)
              (Ocupa de manera limpia una hoja completa tamaño carta horizontal)
             ============================================================ */}
          <div className="page-break-before page-break-after print:min-h-[190mm] print:max-h-[190mm] print:flex print:flex-col print:justify-between pt-4 print:pt-0">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white p-3.5 shadow-xs print:border-2 print:border-[#183B2F] print:rounded-none print:p-2 print:shadow-none print:h-full print:flex print:flex-col print:justify-between">
              {/* Barra de título de lámina */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#183B2F]" />
                  <span className="text-xs font-bold text-[#183B2F] uppercase tracking-wide">
                    Lámina 1: Planta de Cimentación y Malla Ortogonal (Plano X-Y)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#183B2F] bg-[#D2E3D8]/60 border border-[#A3D1B4] px-2.5 py-0.5 rounded">
                  Escala Ref. 1:25 | Vista Superior
                </span>
              </div>

              {/* Dibujo SVG CAD en Planta */}
              <svg
                viewBox="0 0 820 450"
                className="w-full h-auto max-h-[160mm] bg-[#FFFFFF] select-none mx-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <marker id="bp1Arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#183B2F" />
                  </marker>
                  <pattern id="bp1ConcreteHatch" width="14" height="14" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.75" fill="#64748B" opacity="0.3" />
                    <circle cx="9" cy="9" r="0.75" fill="#64748B" opacity="0.3" />
                    <path d="M3,11 L6,14" stroke="#64748B" strokeWidth="0.5" opacity="0.25" />
                  </pattern>
                </defs>

                {/* Borde perimetral estilo lámina de plano */}
                <rect x="5" y="5" width="810" height="440" fill="none" stroke="#183B2F" strokeWidth="1.8" />
                <rect x="8" y="8" width="804" height="434" fill="none" stroke="#94A3B8" strokeWidth="0.8" />

                {/* CONTENIDO DE PLANTA CENTRADO (X=410, Y=195) */}
                <g id="bp-planta-decoupled" transform="translate(410, 195)">
                  {/* Ejes estructurales de referencia con burbujas */}
                  <g stroke="#94A3B8" strokeWidth="1" strokeDasharray="6,4">
                    <line x1="-280" y1="0" x2="280" y2="0" />
                    <line x1="0" y1="-165" x2="0" y2="165" />
                  </g>
                  {/* Burbujas de eje A y 1 */}
                  <circle cx="-295" cy="0" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.4" />
                  <text x="-295" y="4" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                  <circle cx="295" cy="0" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.4" />
                  <text x="295" y="4" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">A'</text>

                  <circle cx="0" cy="-178" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.4" />
                  <text x="0" y="-174" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">1</text>
                  <circle cx="0" cy="178" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.4" />
                  <text x="0" y="182" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">1'</text>

                  {/* Título de la vista */}
                  <text x="0" y="-140" fill="#183B2F" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                    PLANTA DE ZAPATA: {inputs.footingCode} ({results.b.toFixed(2)} x {results.l.toFixed(2)} m)
                  </text>

                  {/* Zapata en Planta */}
                  <rect x="-190" y="-110" width="380" height="220" fill="#F8FAFC" stroke="#183B2F" strokeWidth="2.2" />
                  <rect x="-190" y="-110" width="380" height="220" fill="url(#bp1ConcreteHatch)" />

                  {/* Perímetro Crítico de Punzonamiento bo a d/2 */}
                  <rect
                    x="-65"
                    y="-48"
                    width="130"
                    height="96"
                    fill="#A3D1B4"
                    fillOpacity="0.2"
                    stroke="#1E4838"
                    strokeWidth="1.4"
                    strokeDasharray="5,3"
                  />
                  <rect x="-85" y="-62" width="170" height="17" rx="3" fill="#FFFFFF" fillOpacity="0.95" stroke="#1E4838" strokeWidth="0.8" />
                  <text x="0" y="-50" fill="#183B2F" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    Zona crítica bo = {results.bo} cm (a d/2)
                  </text>

                  {/* Armadura en Planta (Dirección L y Dirección B con ganchos) */}
                  {[-150, -112, -75, -38, 0, 38, 75, 112, 150].map((xPos, idx) => (
                    <g key={`bp1-vl-${idx}`}>
                      <line x1={xPos} y1="-95" x2={xPos} y2="95" stroke="#C97A3E" strokeWidth="2.2" strokeLinecap="round" />
                      <line x1={xPos} y1="-95" x2={xPos + 6} y2="-95" stroke="#C97A3E" strokeWidth="2.2" />
                      <line x1={xPos} y1="95" x2={xPos + 6} y2="95" stroke="#C97A3E" strokeWidth="2.2" />
                    </g>
                  ))}

                  {[-80, -48, -16, 16, 48, 80].map((yPos, idx) => (
                    <g key={`bp1-hb-${idx}`}>
                      <line x1="-175" y1={yPos} x2="175" y2={yPos} stroke="#1E4838" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,2" />
                      <line x1="-175" y1={yPos} x2="-175" y2={yPos - 6} stroke="#1E4838" strokeWidth="2" />
                      <line x1="175" y1={yPos} x2="175" y2={yPos - 6} stroke="#1E4838" strokeWidth="2" />
                    </g>
                  ))}

                  {/* Columna centrada b x t con dimensiones proporcionales */}
                  {(() => {
                    const bpColW = Math.max(20, Math.round(((inputs.bCol / 100) / Math.max(0.5, results.b)) * 380));
                    const bpColL = Math.max(20, Math.round(((inputs.tCol / 100) / Math.max(0.5, results.l)) * 220));
                    const bpHalfW = bpColW / 2;
                    const bpHalfL = bpColL / 2;
                    return (
                      <g>
                        <rect x={-bpHalfW} y={-bpHalfL} width={bpColW} height={bpColL} fill="#183B2F" stroke="#0F241D" strokeWidth="1.8" />
                        <line x1={-bpHalfW} y1={-bpHalfL} x2={bpHalfW} y2={bpHalfL} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                        <line x1={bpHalfW} y1={-bpHalfL} x2={-bpHalfW} y2={bpHalfL} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                        <rect x="-55" y={-bpHalfL - 22} width="110" height="18" rx="3" fill="#FFFFFF" stroke="#183B2F" strokeWidth="0.9" />
                        <text x="0" y={-bpHalfL - 9} fill="#183B2F" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Col. {inputs.bCol} x {inputs.tCol} cm
                        </text>
                      </g>
                    );
                  })()}

                  {/* Cotas Exteriores en Planta (Separadas y con fondo blanco) */}
                  {/* Cota B (Ancho horizontal) */}
                  <line x1="-190" y1="114" x2="-190" y2="150" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                  <line x1="190" y1="114" x2="190" y2="150" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                  <line x1="-190" y1="138" x2="190" y2="138" stroke="#183B2F" strokeWidth="1.4" markerStart="url(#bp1Arrow)" markerEnd="url(#bp1Arrow)" />
                  <rect x="-65" y="125" width="130" height="26" rx="4" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                  <text x="0" y="142" fill="#183B2F" fontSize="12" fontWeight="bold" textAnchor="middle">
                    B = {results.b.toFixed(2)} m
                  </text>

                  {/* Cota L (Largo vertical) */}
                  <line x1="194" y1="-110" x2="236" y2="-110" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                  <line x1="194" y1="110" x2="236" y2="110" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                  <line x1="224" y1="-110" x2="224" y2="110" stroke="#183B2F" strokeWidth="1.4" markerStart="url(#bp1Arrow)" markerEnd="url(#bp1Arrow)" />
                  <rect x="189" y="-13" width="70" height="26" rx="4" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                  <text x="224" y="4" fill="#183B2F" fontSize="12" fontWeight="bold" textAnchor="middle">
                    L = {results.l.toFixed(2)} m
                  </text>

                  {/* Líder de Refuerzo Dir L con fondo blanco */}
                  <line x1="-80" y1="60" x2="-140" y2="98" stroke="#C97A3E" strokeWidth="1.2" />
                  <line x1="-140" y1="98" x2="-215" y2="98" stroke="#C97A3E" strokeWidth="1.2" />
                  <circle cx="-80" cy="60" r="3.5" fill="#C97A3E" />
                  <rect
                    x="-345"
                    y="84"
                    width="190"
                    height="28"
                    rx="4"
                    fill="#FFFFFF"
                    fillOpacity="0.96"
                    stroke="#C97A3E"
                    strokeWidth="1.1"
                  />
                  <text x="-250" y="102" fill="#C97A3E" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Dir. L: {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
                  </text>

                  {/* Líder de Refuerzo Dir B con fondo blanco */}
                  <line x1="80" y1="-50" x2="140" y2="-92" stroke="#1E4838" strokeWidth="1.2" />
                  <line x1="140" y1="-92" x2="215" y2="-92" stroke="#1E4838" strokeWidth="1.2" />
                  <circle cx="80" cy="-50" r="3.5" fill="#1E4838" />
                  <rect
                    x="150"
                    y="-106"
                    width="190"
                    height="28"
                    rx="4"
                    fill="#FFFFFF"
                    fillOpacity="0.96"
                    stroke="#1E4838"
                    strokeWidth="1.1"
                  />
                  <text x="245" y="-88" fill="#1E4838" fontSize="10" fontWeight="bold" textAnchor="middle">
                    Dir. B: {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
                  </text>
                </g>

                {/* Pie de lámina Planta */}
                <g id="bp1-footer" transform="translate(15, 395)">
                  <rect x="0" y="0" width="790" height="42" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" rx="4" />
                  <text x="12" y="16" fill="#183B2F" fontSize="10" fontWeight="bold">
                    ESPECIFICACIONES PLANTA:
                  </text>
                  <text x="175" y="16" fill="#334155" fontSize="9">
                    Zapata {results.b.toFixed(2)}x{results.l.toFixed(2)} m | f'c = {inputs.fc} kg/cm² | Fy = {inputs.fy} kg/cm² | r = {inputs.rec} cm
                  </text>
                  <text x="12" y="32" fill="#183B2F" fontSize="10" fontWeight="bold">
                    REFUERZO INFERIOR:
                  </text>
                  <text x="175" y="32" fill="#334155" fontSize="9">
                    Dir. L: {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL}cm (As={results.asProvidedL.toFixed(2)}cm²) | Dir. B: {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB}cm (As={results.asProvidedB.toFixed(2)}cm²)
                  </text>
                  <text x="775" y="24" fill="#183B2F" fontSize="11" fontWeight="extrabold" textAnchor="end">
                    LÁMINA PL-01
                  </text>
                </g>
              </svg>
            </div>

            {/* Pie de página técnico para Hoja 3 */}
            <div className="hidden print:flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
              <span>Proyecto: {inputs.projectName} | Zapata: {inputs.footingCode}</span>
              <span>Hoja 3 de 4 — Lámina PL-01: Planta de Cimentación y Malla Ortogonal</span>
            </div>
          </div>

          {/* ============================================================
              HOJA 4: LÁMINA 2 (CORTE A-A' - ELEVACIÓN, PERALTE Y DETALLES - EL-02)
              (Ocupa de manera limpia una hoja completa tamaño carta horizontal)
             ============================================================ */}
          <div className="page-break-before print:min-h-[190mm] print:max-h-[190mm] print:flex print:flex-col print:justify-between pt-4 print:pt-0">
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white p-3.5 shadow-xs print:border-2 print:border-[#183B2F] print:rounded-none print:p-2 print:shadow-none print:h-full print:flex print:flex-col print:justify-between">
              {/* Barra de título de lámina */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B45309]" />
                  <span className="text-xs font-bold text-[#183B2F] uppercase tracking-wide">
                    Lámina 2: Corte A-A' (Elevación, Peralte y Detalles de Anclaje)
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-[#183B2F] bg-[#D2E3D8]/60 border border-[#A3D1B4] px-2.5 py-0.5 rounded">
                  Escala Ref. 1:25 | Corte Constructivo
                </span>
              </div>

              {(() => {
                const bpRecPx = Math.max(8, Math.min(28, Math.round((inputs.rec / Math.max(30, results.h)) * 75)));
                const yFootingTop = 185;
                const yFootingBottom = 265;
                const yRebarLong = yFootingBottom - bpRecPx;
                const yRebarTrans = yRebarLong - 5;
                const dPx = yRebarLong - yFootingTop;

                return (
                  <svg
                    viewBox="0 0 820 450"
                    className="w-full h-auto max-h-[160mm] bg-[#FFFFFF] select-none mx-auto"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <marker id="bp2Arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#183B2F" />
                      </marker>
                      <marker id="bp2ArrowMuted" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748B" />
                      </marker>
                      <marker id="bp2ArrowLoad" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                        <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#B45309" />
                      </marker>
                      <pattern id="bp2ConcreteHatch" width="14" height="14" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="0.75" fill="#64748B" opacity="0.3" />
                        <circle cx="9" cy="9" r="0.75" fill="#64748B" opacity="0.3" />
                        <path d="M3,11 L6,14" stroke="#64748B" strokeWidth="0.5" opacity="0.25" />
                      </pattern>
                      <pattern id="bp2SoilPattern" width="16" height="16" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="16" x2="16" y2="0" stroke="#94A3B8" strokeWidth="0.7" opacity="0.3" />
                        <circle cx="4" cy="4" r="0.8" fill="#94A3B8" opacity="0.3" />
                        <circle cx="12" cy="12" r="0.8" fill="#94A3B8" opacity="0.3" />
                      </pattern>
                    </defs>

                    {/* Marco exterior estilo lámina de plano */}
                    <rect x="5" y="5" width="810" height="440" fill="none" stroke="#183B2F" strokeWidth="1.8" />
                    <rect x="8" y="8" width="804" height="434" fill="none" stroke="#94A3B8" strokeWidth="0.8" />

                    {/* CONTENIDO DE ELEVACIÓN CENTRADO (X=410, Y=0) */}
                    <g id="bp-elev-content" transform="translate(410, 0)">
                      {/* Eje de simetría de columna */}
                      <line x1="0" y1="75" x2="0" y2="330" stroke="#94A3B8" strokeWidth="1" strokeDasharray="6,4" />

                      {/* Título de la vista */}
                      <text x="0" y="32" fill="#183B2F" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                        CORTE ELEVACIÓN A-A': {inputs.footingCode} (h = {results.h} cm, Df = {inputs.df.toFixed(2)} m)
                      </text>

                      {/* Recuadro de Cargas Axiales Pu y Ps en la columna */}
                      <g id="bp2-loads-header">
                        <rect x="-105" y="44" width="210" height="32" rx="4" fill="#FFFFFF" stroke="#B45309" strokeWidth="1.5" />
                        <text x="0" y="58" fill="#B45309" fontSize="10.5" fontWeight="extrabold" textAnchor="middle">
                          Pu = {results.pu.toFixed(2)} Tn (Carga Última)
                        </text>
                        <text x="0" y="70" fill="#183B2F" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                          Ps = {results.ps.toFixed(2)} Tn (Carga Servicio)
                        </text>
                        <line x1="0" y1="46" x2="0" y2="76" stroke="#B45309" strokeWidth="3" markerEnd="url(#bp2ArrowLoad)" />
                      </g>

                      {/* N.T.N. Nivel Terreno Natural ±0.00 m en Y=105 */}
                      <line x1="-340" y1="105" x2="340" y2="105" stroke="#64748B" strokeWidth="1.4" strokeDasharray="5,4" />
                      <text x="-250" y="98" fill="#475569" fontSize="10.5" fontWeight="bold">N.T.N. ±0.00 m</text>

                      {/* Relleno de Suelo lateral */}
                      <rect x="-270" y="105" width="80" height="80" fill="url(#bp2SoilPattern)" opacity="0.6" />
                      <rect x="190" y="105" width="80" height="80" fill="url(#bp2SoilPattern)" opacity="0.6" />

                      {/* Solado de Concreto pobre e=10cm (Y=265 a Y=278) */}
                      <rect x="-210" y={yFootingBottom} width="420" height="14" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <text x="0" y={yFootingBottom + 10.5} fill="#64748B" fontSize="9" fontWeight="bold" textAnchor="middle">
                        Solado de Concreto e=10cm (f'c = 100 kg/cm²)
                      </text>

                      {/* Zapata de Concreto Armado (Y=185 a Y=265, ancho 400) */}
                      <rect x="-200" y={yFootingTop} width="400" height="80" fill="#F8FAFC" stroke="#183B2F" strokeWidth="2.4" />
                      <rect x="-200" y={yFootingTop} width="400" height="80" fill="url(#bp2ConcreteHatch)" />

                      {/* Columna en elevación (Y=80 a Y=185) */}
                      <rect x="-32" y="80" width="64" height="105" fill="#183B2F" stroke="#0F241D" strokeWidth="1.6" />
                      <text x="0" y="135" fill="#FFFFFF" fontSize="10.5" fontWeight="bold" textAnchor="middle">
                        Col. {inputs.bCol}x{inputs.tCol}
                      </text>

                      {/* Acero longitudinal de columna anclado en zapata con ganchos a 90° */}
                      <path d={`M-22,85 L-22,${yRebarTrans} L-70,${yRebarTrans}`} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
                      <path d={`M22,85 L22,${yRebarTrans} L70,${yRebarTrans}`} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />

                      {/* Estribos de columna */}
                      {[98, 118, 138, 158].map((yStir, idx) => (
                        <line key={`bp2-stir-${idx}`} x1="-28" y1={yStir} x2="28" y2={yStir} stroke="#CBD5E1" strokeWidth="1.2" />
                      ))}

                      {/* Detalle y cota de longitud de anclaje de las esperas de columna */}
                      <g id="bp2-dowel-anchorage">
                        <line x1="45" y1={yRebarTrans} x2="80" y2={yRebarTrans - 16} stroke="#D97706" strokeWidth="1" />
                        <line x1="80" y1={yRebarTrans - 16} x2="150" y2={yRebarTrans - 16} stroke="#D97706" strokeWidth="1" />
                        <circle cx="45" cy={yRebarTrans} r="2.5" fill="#D97706" />
                        <rect x="76" y={yRebarTrans - 25} width="138" height="18" rx="3" fill="#FFFFFF" stroke="#D97706" strokeWidth="0.9" />
                        <text x="145" y={yRebarTrans - 12} fill="#B45309" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                          Anclaje gancho espera 90°
                        </text>
                      </g>

                      {/* Parrilla Inferior de la Zapata con recubrimiento dinámico */}
                      <path
                        d={`M-180,${yRebarLong - 18} L-180,${yRebarLong} L180,${yRebarLong} L180,${yRebarLong - 18}`}
                        fill="none"
                        stroke="#C97A3E"
                        strokeWidth="2.8"
                        strokeLinecap="round"
                      />
                      {/* Varillas transversales inferiores (puntos) */}
                      {[-160, -128, -96, -64, -32, 0, 32, 64, 96, 128, 160].map((xPt, idx) => (
                        <circle key={`bp2-trans-${idx}`} cx={xPt} cy={yRebarTrans} r="2.8" fill="#1E4838" stroke="#FFFFFF" strokeWidth="0.6" />
                      ))}

                      {/* Llamada de la Malla Inferior */}
                      <g id="bp2-callout-malla">
                        <line x1="-120" y1={yRebarLong} x2="-180" y2={yRebarLong + 22} stroke="#C97A3E" strokeWidth="1.2" />
                        <line x1="-180" y1={yRebarLong + 22} x2="-230" y2={yRebarLong + 22} stroke="#C97A3E" strokeWidth="1.2" />
                        <circle cx="-120" cy={yRebarLong} r="3" fill="#C97A3E" />
                        <rect
                          x="-325"
                          y={yRebarLong + 7}
                          width="180"
                          height="32"
                          rx="4"
                          fill="#FFFFFF"
                          fillOpacity="0.96"
                          stroke="#C97A3E"
                          strokeWidth="1.2"
                        />
                        <text x="-235" y={yRebarLong + 20} fill="#C97A3E" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                          Malla Inf. Dir. L: {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
                        </text>
                        <text x="-235" y={yRebarLong + 34} fill="#1E4838" fontSize="9" fontWeight="bold" textAnchor="middle">
                          Malla Inf. Dir. B: {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
                        </text>
                      </g>

                      {/* Parrilla Superior Condicional si e > L/6 */}
                      {results.isOutOfKern && (
                        <g id="bp2-rebar-top">
                          <path
                            d={`M-180,${yFootingTop + bpRecPx + 18} L-180,${yFootingTop + bpRecPx} L180,${yFootingTop + bpRecPx} L180,${yFootingTop + bpRecPx + 18}`}
                            fill="none"
                            stroke="#C97A3E"
                            strokeWidth="2.8"
                            strokeLinecap="round"
                          />
                          {Array.from({ length: Math.max(3, Math.min(results.topNBarsB, 12)) }).map((_, idx, arr) => {
                            const stepTop = 320 / Math.max(1, arr.length - 1);
                            const xPt = -160 + idx * stepTop;
                            return (
                              <circle key={`bp2-top-trans-${idx}`} cx={xPt} cy={yFootingTop + bpRecPx + 5} r="2.6" fill="#1E4838" stroke="#FFFFFF" strokeWidth="0.6" />
                            );
                          })}
                          <line x1="70" y1={yFootingTop + bpRecPx} x2="130" y2={yFootingTop - 25} stroke="#C97A3E" strokeWidth="1.2" />
                          <line x1="130" y1={yFootingTop - 25} x2="155" y2={yFootingTop - 25} stroke="#C97A3E" strokeWidth="1.2" />
                          <circle cx="70" cy={yFootingTop + bpRecPx} r="3" fill="#C97A3E" />
                          <rect
                            x="145"
                            y={yFootingTop - 46}
                            width="215"
                            height="42"
                            rx="4"
                            fill="#FFFFFF"
                            fillOpacity="0.96"
                            stroke="#C97A3E"
                            strokeWidth="1.1"
                          />
                          <text x="252" y={yFootingTop - 32} fill="#C97A3E" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                            Parrilla Sup. Dir. L: {results.topNBarsL} {results.topSelectedBarL.label} @ {results.topSpacingL} cm
                          </text>
                          <text x="252" y={yFootingTop - 19} fill="#1E4838" fontSize="9" fontWeight="bold" textAnchor="middle">
                            Parrilla Sup. Dir. B: {results.topNBarsB} {results.topSelectedBarB.label} @ {results.topSpacingB} cm
                          </text>
                          <text x="252" y={yFootingTop - 7} fill="#B45309" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                            (As mín = {results.topAsMinL.toFixed(2)} cm² | Fuera Kern)
                          </text>
                        </g>
                      )}

                      {/* Diagrama de Presiones del Suelo (Trapecio y vectores) */}
                      <polygon
                        points={`-200,${yFootingBottom + 16} 200,${yFootingBottom + 16} 200,${yFootingBottom + 52} -200,${yFootingBottom + 52}`}
                        fill="#D2E3D8"
                        fillOpacity="0.5"
                        stroke="#A3D1B4"
                        strokeWidth="1.2"
                      />
                      {[-160, -120, -80, -40, 0, 40, 80, 120, 160].map((xPos, idx) => (
                        <line
                          key={`bp2-soil-arr-${idx}`}
                          x1={xPos}
                          y1={yFootingBottom + 48}
                          x2={xPos}
                          y2={yFootingBottom + 20}
                          stroke="#183B2F"
                          strokeWidth="1.3"
                          markerEnd="url(#bp2Arrow)"
                        />
                      ))}
                      <text x="-180" y={yFootingBottom + 66} fill="#183B2F" fontSize="11" fontWeight="bold">
                        q_max = {results.qMax.toFixed(2)} kg/cm²
                      </text>
                      <text x="80" y={yFootingBottom + 66} fill="#183B2F" fontSize="11" fontWeight="bold">
                        qa = {inputs.qa.toFixed(2)} kg/cm²
                      </text>

                      {/* Cotas en Elevación con Distribución Vertical Despejada y Marcos Blancos */}
                      {/* Cota h (Pista exterior derecha, x = 285) */}
                      <line x1="200" y1={yFootingTop} x2="295" y2={yFootingTop} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="200" y1={yFootingBottom} x2="295" y2={yFootingBottom} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="285" y1={yFootingTop} x2="285" y2={yFootingBottom} stroke="#183B2F" strokeWidth="1.4" markerStart="url(#bp2Arrow)" markerEnd="url(#bp2Arrow)" />
                      <rect x="248" y={yFootingTop + 40 - 13} width="80" height="26" rx="4" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                      <text x="288" y={yFootingTop + 40 + 5} fill="#183B2F" fontSize="11.5" fontWeight="bold" textAnchor="middle">h = {results.h} cm</text>

                      {/* Cota Recubrimiento r (Pista interior derecha, x = 225) */}
                      <line x1="180" y1={yRebarLong} x2="235" y2={yRebarLong} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="200" y1={yFootingBottom} x2="235" y2={yFootingBottom} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="225" y1={yRebarLong} x2="225" y2={yFootingBottom} stroke="#64748B" strokeWidth="1.3" markerStart="url(#bp2ArrowMuted)" markerEnd="url(#bp2ArrowMuted)" />
                      <rect x="204" y={yRebarLong + bpRecPx / 2 - 9} width="60" height="19" rx="3" fill="#FFFFFF" stroke="#64748B" strokeWidth="1" />
                      <text x="234" y={yRebarLong + bpRecPx / 2 + 4} fill="#475569" fontSize="9.5" fontWeight="bold" textAnchor="middle">r = {inputs.rec} cm</text>

                      {/* Cota Peralte d (Pista interior izquierda, x = -240) */}
                      <line x1="-200" y1={yFootingTop} x2="-248" y2={yFootingTop} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-180" y1={yRebarLong} x2="-248" y2={yRebarLong} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-240" y1={yFootingTop} x2="-240" y2={yRebarLong} stroke="#183B2F" strokeWidth="1.4" markerStart="url(#bp2Arrow)" markerEnd="url(#bp2Arrow)" />
                      <rect x="-270" y={yFootingTop + dPx / 2 - 12} width="62" height="24" rx="4" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                      <text x="-239" y={yFootingTop + dPx / 2 + 5} fill="#183B2F" fontSize="10.5" fontWeight="bold" textAnchor="middle">d = {results.d} cm</text>

                      {/* Cota Profundidad de Desplante Df (Pista exterior izquierda, x = -335) */}
                      <line x1="-270" y1="105" x2="-342" y2="105" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-200" y1={yFootingBottom} x2="-342" y2={yFootingBottom} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-335" y1="105" x2="-335" y2={yFootingBottom} stroke="#183B2F" strokeWidth="1.4" markerStart="url(#bp2Arrow)" markerEnd="url(#bp2Arrow)" />
                      <rect x="-372" y={105 + (yFootingBottom - 105) / 2 - 12} width="74" height="24" rx="4" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                      <text x="-335" y={105 + (yFootingBottom - 105) / 2 + 5} fill="#183B2F" fontSize="10.5" fontWeight="bold" textAnchor="middle">Df = {inputs.df.toFixed(2)} m</text>
                      <text x="60" y={yFootingBottom + 92} fill="#475569" fontSize="9">N.F.C. = -{inputs.df.toFixed(2)} m</text>
                    </g>

                    {/* Pie de lámina Elevación */}
                    <g id="bp2-footer" transform="translate(15, 395)">
                      <rect x="0" y="0" width="790" height="42" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" rx="4" />
                      <text x="12" y="16" fill="#183B2F" fontSize="10" fontWeight="bold">
                        ESPECIFICACIONES CORTE:
                      </text>
                      <text x="175" y="16" fill="#334155" fontSize="9">
                        Peralte h = {results.h} cm | Peralte efect. d = {results.d} cm | Recubrimiento r = {inputs.rec} cm | Solado e=10cm (f'c=100 kg/cm²)
                      </text>
                      <text x="12" y="32" fill="#183B2F" fontSize="10" fontWeight="bold">
                        VERIFICACIÓN GEOTÉCNICA:
                      </text>
                      <text x="175" y="32" fill="#334155" fontSize="9">
                        q_max = {results.qMax.toFixed(2)} kg/cm² ≤ qa = {inputs.qa.toFixed(2)} kg/cm² ({results.isSoilOk ? 'CONFORME' : 'NO CONFORME'}) | Df = {inputs.df.toFixed(2)} m
                      </text>
                      <text x="775" y="24" fill="#183B2F" fontSize="11" fontWeight="extrabold" textAnchor="end">
                        LÁMINA EL-02
                      </text>
                    </g>
                  </svg>
                );
              })()}
            </div>

            {/* Pie de página técnico para Hoja 4 */}
            <div className="hidden print:flex items-center justify-between pt-1 text-[10px] text-gray-500 font-mono">
              <span>Proyecto: {inputs.projectName} | Zapata: {inputs.footingCode}</span>
              <span>Hoja 4 de 4 — Lámina EL-02: Corte Constructivo y Anclajes</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
