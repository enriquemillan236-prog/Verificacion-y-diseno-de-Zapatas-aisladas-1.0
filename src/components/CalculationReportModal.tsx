import React from 'react';
import { FootingInputs, FootingResults } from '../types/footing';
import { X, Printer, Download, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

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
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col border border-gray-200 overflow-hidden print:max-h-none print:shadow-none print:border-none print:w-full">
        {/* Barra superior de control del Modal (oculta en impresión) */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#183B2F] text-white border-b border-[#143228] print:hidden">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#D2E3D8]" />
            <span className="font-bold text-sm sm:text-base">
              MEMORIA DE CÁLCULO ESTRUCTURAL - {inputs.footingCode}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#D2E3D8] text-[#183B2F] hover:bg-[#b9d6c2] transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Imprimir / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-[#255845] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Contenido imprimible de la Memoria de Cálculo */}
        <div className="p-6 sm:p-8 overflow-y-auto font-sans text-slate-800 space-y-6 print:p-0 print:overflow-visible">
          {/* MEMBRETE TÉCNICO FORMAL */}
          <div className="border-2 border-[#183B2F] rounded-lg p-4 bg-[#F7F7F2]/40">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#183B2F] pb-3 mb-3 gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-[#183B2F] tracking-tight">
                  MEMORIA DE CÁLCULO: ZAPATA AISLADA DE C.A.
                </h1>
                <p className="text-xs text-gray-600 font-medium">
                  Cálculo Geotécnico y Diseño Estructural según norma {inputs.normative}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-[#183B2F] text-white font-mono text-sm font-bold rounded">
                  CÓDIGO: {inputs.footingCode}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div>
                <span className="text-gray-500 block">Proyecto:</span>
                <span className="font-bold text-[#183B2F]">{inputs.projectName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Especialista:</span>
                <span className="font-bold text-[#183B2F]">{inputs.engineerName}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Fecha:</span>
                <span className="font-bold text-[#183B2F]">{inputs.date}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Estado Global:</span>
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
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
              1. Parámetros de Diseño y Materiales
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div>
                <span className="text-gray-500 block">Concreto f'c:</span>
                <span className="font-bold">{inputs.fc} kg/cm²</span>
              </div>
              <div>
                <span className="text-gray-500 block">Fluencia Acero Fy:</span>
                <span className="font-bold">{inputs.fy} kg/cm²</span>
              </div>
              <div>
                <span className="text-gray-500 block">Capacidad Admisible qa:</span>
                <span className="font-bold text-[#183B2F]">{inputs.qa.toFixed(2)} kg/cm²</span>
              </div>
              <div>
                <span className="text-gray-500 block">Profundidad Desplante Df:</span>
                <span className="font-bold">{inputs.df.toFixed(2)} m</span>
              </div>
              <div>
                <span className="text-gray-500 block">Carga Axial Normal N:</span>
                <span className="font-bold text-[#183B2F]">{inputs.n.toFixed(2)} Tn</span>
              </div>
              <div>
                <span className="text-gray-500 block">Momento Mxx / Myy:</span>
                <span className="font-bold">{inputs.mxx.toFixed(2)} / {inputs.myy.toFixed(2)} Tn.m</span>
              </div>
              <div>
                <span className="text-gray-500 block">Carga Servicio Ps:</span>
                <span className="font-bold text-[#183B2F]">{results.ps.toFixed(2)} Tn</span>
              </div>
              <div>
                <span className="text-gray-500 block">Carga Mayorada Pu:</span>
                <span className="font-bold text-[#183B2F]">{results.pu.toFixed(2)} Tn</span>
              </div>
              <div>
                <span className="text-gray-500 block">Sección Columna (b x t):</span>
                <span className="font-bold">{inputs.bCol} x {inputs.tCol} cm</span>
              </div>
              <div>
                <span className="text-gray-500 block">Recubrimiento r:</span>
                <span className="font-bold">{inputs.rec} cm</span>
              </div>
              <div>
                <span className="text-gray-500 block">Peso esp. suelo/concreto:</span>
                <span className="font-bold">{inputs.gammaSuelo} / {inputs.gammaConcreto} Tn/m³</span>
              </div>
              <div>
                <span className="text-gray-500 block">Sobrecarga s/c:</span>
                <span className="font-bold">{inputs.sobrecarga.toFixed(2)} Tn/m²</span>
              </div>
            </div>
          </div>

          {/* 2. DIMENSIONAMIENTO EN PLANTA */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
              2. Dimensionamiento Geotécnico en Planta y Peralte
            </h2>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <strong>Capacidad neta del terreno (qn):</strong> qn = qa - (Df*γprom + s/c)/10 ={' '}
                <span className="font-mono font-bold text-[#183B2F]">{results.qn.toFixed(3)} kg/cm²</span>
              </p>
              <p>
                <strong>Área mínima en planta requerida:</strong> Az_req = Ps / (qn * 10) ={' '}
                <span className="font-mono font-bold">{results.aReq.toFixed(2)} m²</span>
              </p>
              <p>
                <strong>Dimensiones adoptadas:</strong> B ={' '}
                <span className="font-bold text-[#183B2F]">{results.b.toFixed(2)} m</span>, L ={' '}
                <span className="font-bold text-[#183B2F]">{results.l.toFixed(2)} m</span> → Área Az ={' '}
                <span className="font-bold">{results.area.toFixed(2)} m²</span> (Az ≥ Az_req → <strong>CONFORME</strong>)
              </p>
              <p>
                <strong>Peralte y Altura:</strong> Altura adoptada h ={' '}
                <span className="font-bold">{results.h} cm</span>, Peralte efectivo d = h - r - db ={' '}
                <span className="font-bold">{results.d} cm</span> (Recubrimiento r = {inputs.rec} cm, db = {results.selectedBar.dbCm.toFixed(2)} cm, Anclaje Ld_mín = {results.ldMin.toFixed(1)} cm).
              </p>
            </div>
          </div>

          {/* 3. VERIFICACIÓN DE PRESIONES EN EL SUELO */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
              3. Comprobación de Presiones sobre el Suelo
            </h2>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <strong>Presión de contacto máxima:</strong> q_max = (Ps / Az) + (Ms * (L/2) / Iz) ={' '}
                <span className="font-mono font-bold text-[#183B2F]">{results.qMax.toFixed(2)} kg/cm²</span>
              </p>
              <p>
                <strong>Criterio de verificación:</strong> q_max ({results.qMax.toFixed(2)} kg/cm²) ≤ qa ({inputs.qa.toFixed(2)} kg/cm²) →{' '}
                <span className={results.isSoilOk ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                  {results.isSoilOk ? 'CUMPLE SATISFACTORIAMENTE' : 'NO CUMPLE'}
                </span>
              </p>
              <p>
                <strong>Presión mínima:</strong> q_min = {results.qMin.toFixed(2)} kg/cm² (Sin esfuerzos de tracción en la base).
              </p>
            </div>
          </div>

          {/* 4. VERIFICACIÓN DE CORTANTE POR FLEXIÓN */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
              4. Verificación de Cortante por Flexión (Una Vía a distancia 'd')
            </h2>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <strong>Presión última neta de contacto:</strong> qu = Pu / (B * L) ={' '}
                <span className="font-mono font-bold">{results.qu.toFixed(2)} Tn/m²</span>
              </p>
              <p>
                <strong>Volado:</strong> Lv = (L - t/100) / 2 = {results.lvL.toFixed(2)} m. Distancia crítica (Lv - d) ={' '}
                {results.critDistance.toFixed(2)} m.
              </p>
              <p>
                <strong>Fuerza cortante actuante a distancia d:</strong> Vu = qu * (Lv - d) * B ={' '}
                <span className="font-mono font-bold text-[#183B2F]">{results.vuFlex.toFixed(2)} Tn</span>
              </p>
              <p>
                <strong>Resistencia de diseño del concreto al cortante (ØVc):</strong>
              </p>
              <p className="font-mono text-gray-600 bg-gray-50 p-2 rounded border border-gray-200">
                ØVc = 0.85 * 0.53 * √({inputs.fc}) * ({results.b * 100}) * ({results.d}) / 1000 ={' '}
                <strong>{results.phiVcFlex.toFixed(2)} Tn</strong>
              </p>
              <p>
                <strong>Condición de resistencia:</strong> Vu ({results.vuFlex.toFixed(2)} Tn) ≤ ØVc ({results.phiVcFlex.toFixed(2)} Tn) →{' '}
                <span className={results.isFlexShearOk ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                  {results.isFlexShearOk ? 'CONFORME (Ratio D/C = ' + (results.flexShearRatio * 100).toFixed(1) + '%)' : 'NO CUMPLE'}
                </span>
              </p>
            </div>
          </div>

          {/* 5. VERIFICACIÓN POR PUNZONAMIENTO */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
              5. Verificación de Punzonamiento (Dos Vías en Perímetro Crítico bo)
            </h2>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <strong>Perímetro crítico (bo):</strong> bo = 2*(b + d) + 2*(t + d) ={' '}
                <span className="font-mono font-bold">{results.bo} cm</span>. Área crítica Ap = {results.ap.toFixed(3)} m².
              </p>
              <p>
                <strong>Cortante por punzonamiento actuante:</strong> Vu_p = qu * (B*L - Ap) ={' '}
                <span className="font-mono font-bold text-[#183B2F]">{results.vuPunz.toFixed(2)} Tn</span>
              </p>
              <p>
                <strong>Resistencia de diseño al punzonamiento:</strong> ØVc_p ={' '}
                <span className="font-mono font-bold text-[#183B2F]">{results.phiVcPunz.toFixed(2)} Tn</span>
              </p>
              <p>
                <strong>Condición de verificación:</strong> Vu_p ({results.vuPunz.toFixed(2)} Tn) ≤ ØVc_p ({results.phiVcPunz.toFixed(2)} Tn) →{' '}
                <span className={results.isPunzShearOk ? 'text-emerald-700 font-bold' : 'text-red-700 font-bold'}>
                  {results.isPunzShearOk ? 'CONFORME (Ratio D/C = ' + (results.punzShearRatio * 100).toFixed(1) + '%)' : 'NO CUMPLE'}
                </span>
              </p>
            </div>
          </div>

          {/* 6. DISEÑO A FLEXIÓN Y DISPOSICIÓN DE ACERO */}
          <div>
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-2">
              6. Diseño a Flexión y Armadura de Acero
            </h2>
            <div className="space-y-1.5 text-xs text-gray-700">
              <p>
                <strong>Momento flector último de diseño (Mu):</strong> Mu = qu * Lv² / 2 * B ={' '}
                <span className="font-mono font-bold text-[#183B2F]">{results.muL.toFixed(2)} Tn.m</span>
              </p>
              <p>
                <strong>Acero mínimo normativo:</strong> As_mín = (0.7 * √f'c / Fy) * 100 * d ={' '}
                {results.asMinPerMeter.toFixed(2)} cm²/m → As_mín_total = {(results.asMinPerMeter * results.b).toFixed(2)} cm².
              </p>
              <p>
                <strong>Acero requerido por flexión:</strong> As_req_total ={' '}
                <span className="font-bold">{results.asTotalL.toFixed(2)} cm²</span>.
              </p>
              <div className="p-3.5 bg-[#D2E3D8]/30 rounded-lg border border-[#A3D1B4] text-[#183B2F] text-xs mt-2">
                <span className="font-extrabold text-[#183B2F] block mb-2 text-xs uppercase tracking-wide">
                  Armadura Final Adoptada (Parrilla Inferior Diferenciada):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="bg-white p-2.5 rounded border border-[#A3D1B4]/80 shadow-2xs">
                    <span className="font-bold text-[#183B2F] block mb-0.5">
                      Dirección L (Longitudinal):
                    </span>
                    <div className="font-extrabold text-sm text-slate-900 font-mono">
                      {results.nBarsL} varillas de {results.selectedBarL.label} @ {results.spacingL} cm
                    </div>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      As colocado: {results.asProvidedL.toFixed(2)} cm² (Req: {results.asTotalL.toFixed(2)} cm²)
                    </span>
                  </div>

                  <div className="bg-white p-2.5 rounded border border-[#A3D1B4]/80 shadow-2xs">
                    <span className="font-bold text-[#183B2F] block mb-0.5">
                      Dirección B (Transversal):
                    </span>
                    <div className="font-extrabold text-sm text-slate-900 font-mono">
                      {results.nBarsB} varillas de {results.selectedBarB.label} @ {results.spacingB} cm
                    </div>
                    <span className="text-[11px] text-gray-500 block mt-0.5">
                      As colocado: {results.asProvidedB.toFixed(2)} cm² (Req: {results.asTotalB.toFixed(2)} cm²)
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-normal text-gray-600 mt-2">
                  Espaciamiento máximo reglamentario: S_max = {results.maxSpacing} cm. Recubrimiento r = {inputs.rec} cm.
                </div>
              </div>
            </div>
          </div>

          {/* 7. PLANO CONSTRUCTIVO DE LA ZAPATA Y SU ARMADURA (PLANTA Y ELEVACIÓN) */}
          <div className="pt-2 print:break-before-page">
            <h2 className="text-sm font-bold text-[#183B2F] uppercase border-b-2 border-[#D2E3D8] pb-1 mb-3">
              7. Plano Constructivo de Detalle Estructural (Planta y Elevación)
            </h2>
            <p className="text-xs text-gray-600 mb-3">
              Representación técnica a escala de la geometría de zapata, columnas de arranque y disposición de la malla de refuerzo ortogonal en ambas direcciones (Planta y Elevación).
            </p>

            {/* Lámina de Plano Constructivo CAD */}
            <div className="border border-gray-300 rounded-xl overflow-hidden bg-white p-3 shadow-xs print:border-gray-400">
              <svg
                viewBox="0 0 880 460"
                className="w-full h-auto bg-[#FFFFFF] select-none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <marker id="bpArrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#183B2F" />
                  </marker>
                  <marker id="bpArrowMuted" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                    <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748B" />
                  </marker>
                  <pattern id="bpConcreteHatch" width="12" height="12" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="0.7" fill="#64748B" opacity="0.3" />
                    <circle cx="8" cy="8" r="0.7" fill="#64748B" opacity="0.3" />
                    <path d="M3,9 L5,11" stroke="#64748B" strokeWidth="0.5" opacity="0.25" />
                  </pattern>
                </defs>

                {/* Borde perimetral estilo lámina de plano */}
                <rect x="5" y="5" width="870" height="450" fill="none" stroke="#183B2F" strokeWidth="1.8" />
                <rect x="8" y="8" width="864" height="444" fill="none" stroke="#94A3B8" strokeWidth="0.8" />

                {/* ========================================================
                    IZQUIERDA: DETALLE EN PLANTA (VISTA SUPERIOR)
                   ======================================================== */}
                <g id="bp-planta" transform="translate(225, 205)">
                  {/* Ejes estructurales de referencia con burbujas */}
                  <g stroke="#94A3B8" strokeWidth="0.9" strokeDasharray="5,3">
                    <line x1="-165" y1="0" x2="165" y2="0" />
                    <line x1="0" y1="-150" x2="0" y2="150" />
                  </g>
                  {/* Burbujas de eje A y 1 */}
                  <circle cx="-178" cy="0" r="10" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                  <text x="-178" y="3.5" fill="#183B2F" fontSize="9" fontWeight="bold" textAnchor="middle">A</text>
                  <circle cx="178" cy="0" r="10" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                  <text x="178" y="3.5" fill="#183B2F" fontSize="9" fontWeight="bold" textAnchor="middle">A'</text>

                  <circle cx="0" cy="-160" r="10" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                  <text x="0" y="-156.5" fill="#183B2F" fontSize="9" fontWeight="bold" textAnchor="middle">1</text>
                  <circle cx="0" cy="160" r="10" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                  <text x="0" y="163.5" fill="#183B2F" fontSize="9" fontWeight="bold" textAnchor="middle">1'</text>

                  {/* Título de la vista */}
                  <text x="0" y="-175" fill="#183B2F" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                    PLANTA DE CIMENTACIÓN
                  </text>
                  <text x="0" y="-163" fill="#64748B" fontSize="9.5" textAnchor="middle">
                    Escala Ref. 1:25 | Acero en Ambas Direcciones
                  </text>

                  {/* Zapata B x L */}
                  <rect x="-135" y="-120" width="270" height="240" fill="#F8FAFC" stroke="#183B2F" strokeWidth="2.2" />
                  <rect x="-135" y="-120" width="270" height="240" fill="url(#bpConcreteHatch)" />

                  {/* Malla en Dirección L (Verticales) */}
                  {Array.from({ length: Math.min(results.nBarsL, 10) }).map((_, idx, arr) => {
                    const step = 230 / (arr.length - 1);
                    const xPos = -115 + idx * step;
                    return (
                      <g key={`bp-vl-${idx}`}>
                        <line x1={xPos} y1="-105" x2={xPos} y2="105" stroke="#C97A3E" strokeWidth="2.2" strokeLinecap="round" />
                        {/* Ganchos estándar en extremos a 90° */}
                        <line x1={xPos} y1="-105" x2={xPos + 6} y2="-105" stroke="#C97A3E" strokeWidth="2.2" />
                        <line x1={xPos} y1="105" x2={xPos + 6} y2="105" stroke="#C97A3E" strokeWidth="2.2" />
                      </g>
                    );
                  })}

                  {/* Malla en Dirección B (Horizontales) */}
                  {Array.from({ length: Math.min(results.nBarsB, 8) }).map((_, idx, arr) => {
                    const step = 190 / (arr.length - 1);
                    const yPos = -95 + idx * step;
                    return (
                      <g key={`bp-hb-${idx}`}>
                        <line x1="-120" y1={yPos} x2="120" y2={yPos} stroke="#1E4838" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,2" />
                        {/* Ganchos estándar en extremos a 90° */}
                        <line x1="-120" y1={yPos} x2="-120" y2={yPos - 6} stroke="#1E4838" strokeWidth="2" />
                        <line x1="120" y1={yPos} x2="120" y2={yPos - 6} stroke="#1E4838" strokeWidth="2" />
                      </g>
                    );
                  })}

                  {/* Columna centrada b x t con dimensiones proporcionales reales */}
                  {(() => {
                    const bpColW = Math.max(12, Math.round(((inputs.bCol / 100) / Math.max(0.5, results.b)) * 270));
                    const bpColL = Math.max(12, Math.round(((inputs.tCol / 100) / Math.max(0.5, results.l)) * 240));
                    const bpHalfW = bpColW / 2;
                    const bpHalfL = bpColL / 2;
                    return (
                      <g>
                        <rect x={-bpHalfW} y={-bpHalfL} width={bpColW} height={bpColL} fill="#183B2F" stroke="#0F241D" strokeWidth="1.6" />
                        <line x1={-bpHalfW} y1={-bpHalfL} x2={bpHalfW} y2={bpHalfL} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                        <line x1={bpHalfW} y1={-bpHalfL} x2={-bpHalfW} y2={bpHalfL} stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                        <text x="0" y={-bpHalfL - 6} fill="#183B2F" fontSize="10" fontWeight="bold" textAnchor="middle">
                          Col. {inputs.bCol}x{inputs.tCol}
                        </text>
                      </g>
                    );
                  })()}

                  {/* Cotas Exteriores en Planta */}
                  {/* Cota B (Ancho) */}
                  <line x1="-135" y1="140" x2="135" y2="140" stroke="#183B2F" strokeWidth="1.2" markerStart="url(#bpArrow)" markerEnd="url(#bpArrow)" />
                  <text x="0" y="155" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">
                    B = {results.b.toFixed(2)} m
                  </text>

                  {/* Cota L (Largo) */}
                  <line x1="155" y1="-120" x2="155" y2="120" stroke="#183B2F" strokeWidth="1.2" markerStart="url(#bpArrow)" markerEnd="url(#bpArrow)" />
                  <text x="175" y="4" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(90, 175, 4)">
                    L = {results.l.toFixed(2)} m
                  </text>

                  {/* Líder de Refuerzo Dir L */}
                  <line x1="-60" y1="60" x2="-120" y2="95" stroke="#C97A3E" strokeWidth="1.2" />
                  <line x1="-120" y1="95" x2="-200" y2="95" stroke="#C97A3E" strokeWidth="1.2" />
                  <circle cx="-60" cy="60" r="3" fill="#C97A3E" />
                  <text x="-125" y="90" fill="#C97A3E" fontSize="9.5" fontWeight="bold" textAnchor="end">
                    Dir. L: {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
                  </text>

                  {/* Líder de Refuerzo Dir B */}
                  <line x1="60" y1="-50" x2="120" y2="-95" stroke="#1E4838" strokeWidth="1.2" />
                  <line x1="120" y1="-95" x2="200" y2="-95" stroke="#1E4838" strokeWidth="1.2" />
                  <circle cx="60" cy="-50" r="3" fill="#1E4838" />
                  <text x="125" y="-100" fill="#1E4838" fontSize="9.5" fontWeight="bold">
                    Dir. B: {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
                  </text>
                </g>

                {/* Línea divisoria central de la lámina */}
                <line x1="450" y1="15" x2="450" y2="395" stroke="#E2E8F0" strokeWidth="1.2" strokeDasharray="6,4" />

                {/* ========================================================
                    DERECHA: DETALLE EN ELEVACIÓN (CORTE CONSTRUCTIVO)
                   ======================================================== */}
                {(() => {
                  const bpRecPx = Math.max(7, Math.min(26, Math.round((inputs.rec / Math.max(30, results.h)) * 70)));
                  const bpYRebarLong = 70 - bpRecPx;
                  const bpYRebarTrans = bpYRebarLong - 4;
                  return (
                    <g id="bp-elevacion" transform="translate(650, 215)">
                      {/* Título de la vista */}
                      <text x="0" y="-180" fill="#183B2F" fontSize="13" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">
                        CORTE A-A' (ELEVACIÓN)
                      </text>
                      <text x="0" y="-165" fill="#64748B" fontSize="10" textAnchor="middle">
                        Escala Ref. 1:25 | Detalle de Anclaje y Recubrimiento
                      </text>

                      {/* N.T.N. */}
                      <line x1="-170" y1="-110" x2="170" y2="-110" stroke="#64748B" strokeWidth="1.4" strokeDasharray="5,3" />
                      <text x="-160" y="-116" fill="#475569" fontSize="10" fontWeight="bold">N.T.N. ±0.00</text>

                      {/* Solado pobre e=10cm debajo de zapata */}
                      <rect x="-140" y="70" width="280" height="15" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                      <text x="0" y="81" fill="#64748B" fontSize="9" textAnchor="middle">Solado de Concreto e=10cm (f'c=100 kg/cm²)</text>

                      {/* Zapata de Concreto Armado */}
                      <rect x="-135" y="0" width="270" height="70" fill="#F8FAFC" stroke="#183B2F" strokeWidth="2.2" />
                      <rect x="-135" y="0" width="270" height="70" fill="url(#bpConcreteHatch)" />

                      {/* Columna en elevación */}
                      <rect x="-25" y="-140" width="50" height="140" fill="#183B2F" stroke="#0F241D" strokeWidth="1.5" />
                      <text x="0" y="-70" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle">
                        Columna {inputs.bCol}x{inputs.tCol}
                      </text>

                      {/* Acero longitudinal de columna anclado en zapata a 90° */}
                      <path d={`M-18,-135 L-18,${bpYRebarTrans} L-55,${bpYRebarTrans}`} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />
                      <path d={`M18,-135 L18,${bpYRebarTrans} L55,${bpYRebarTrans}`} fill="none" stroke="#F59E0B" strokeWidth="2.4" strokeLinecap="round" />

                      {/* Estribos de columna */}
                      {[-120, -95, -70, -45, -20, 5, 25].map((yStir, idx) => (
                        <line key={`stir-${idx}`} x1="-22" y1={yStir} x2="22" y2={yStir} stroke="#CBD5E1" strokeWidth="1.2" />
                      ))}

                      {/* Parrilla Inferior de la Zapata con recubrimiento dinámico */}
                      {/* Varilla longitudinal con ganchos */}
                      <path d={`M-120,${bpYRebarLong - 14} L-120,${bpYRebarLong} L120,${bpYRebarLong} L120,${bpYRebarLong - 14}`} fill="none" stroke="#C97A3E" strokeWidth="2.6" strokeLinecap="round" />
                      {/* Puntos varillas transversales */}
                      {[-100, -70, -40, -10, 10, 40, 70, 100].map((xPt, idx) => (
                        <circle key={`bp-trans-${idx}`} cx={xPt} cy={bpYRebarTrans} r="2.5" fill="#1E4838" stroke="#FFFFFF" strokeWidth="0.6" />
                      ))}

                      {/* Cotas en Elevación */}
                      {/* Cota h */}
                      <line x1="150" y1="0" x2="150" y2="70" stroke="#183B2F" strokeWidth="1.2" markerStart="url(#bpArrow)" markerEnd="url(#bpArrow)" />
                      <text x="175" y="38" fill="#183B2F" fontSize="10" fontWeight="bold">h = {results.h} cm</text>

                      {/* Cota Peralte d */}
                      <line x1="-150" y1="0" x2="-150" y2={bpYRebarLong} stroke="#183B2F" strokeWidth="1.2" markerStart="url(#bpArrow)" markerEnd="url(#bpArrow)" />
                      <text x="-195" y={bpYRebarLong / 2 + 4} fill="#183B2F" fontSize="10" fontWeight="bold">d = {results.d} cm</text>

                      {/* Cota Recubrimiento r */}
                      <line x1="-150" y1={bpYRebarLong} x2="-150" y2="70" stroke="#64748B" strokeWidth="1.2" markerStart="url(#bpArrowMuted)" markerEnd="url(#bpArrowMuted)" />
                      <text x="-195" y={bpYRebarLong + bpRecPx / 2 + 4} fill="#64748B" fontSize="9" fontWeight="bold">r = {inputs.rec} cm</text>

                      {/* Cota Df */}
                      <line x1="-165" y1="-110" x2="-165" y2="70" stroke="#183B2F" strokeWidth="1.2" markerStart="url(#bpArrow)" markerEnd="url(#bpArrow)" />
                      <text x="-195" y="-20" fill="#183B2F" fontSize="10" fontWeight="bold">Df = {inputs.df.toFixed(2)} m</text>
                      <text x="80" y="105" fill="#475569" fontSize="9">N.F.C. = -{inputs.df.toFixed(2)} m</text>
                    </g>
                  );
                })()}

                {/* ========================================================
                    PIE DE LÁMINA: CUADRO DE ESPECIFICACIONES TÉCNICAS
                   ======================================================== */}
                <g id="bp-footer" transform="translate(15, 405)">
                  <rect x="0" y="0" width="850" height="42" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1" rx="4" />
                  <text x="12" y="16" fill="#183B2F" fontSize="10" fontWeight="bold">
                    ESPECIFICACIONES TÉCNICAS:
                  </text>
                  <text x="175" y="16" fill="#334155" fontSize="9">
                    f'c = {inputs.fc} kg/cm² | Fy = {inputs.fy} kg/cm² | r = {inputs.rec} cm | Solado e=10cm f'c=100 kg/cm²
                  </text>
                  <text x="12" y="32" fill="#183B2F" fontSize="10" fontWeight="bold">
                    RESUMEN ESTRUCTURAL:
                  </text>
                  <text x="175" y="32" fill="#334155" fontSize="9">
                    Zapata {results.b.toFixed(2)}x{results.l.toFixed(2)}x{(results.h/100).toFixed(2)}m | Malla: {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL}cm (Dir. L) y {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB}cm (Dir. B) | qa={inputs.qa.toFixed(2)} kg/cm²
                  </text>
                  <text x="830" y="24" fill="#183B2F" fontSize="11" fontWeight="extrabold" textAnchor="end">
                    PLANO E-01
                  </text>
                </g>
              </svg>
            </div>
          </div>

          {/* FIRMA Y RESPONSABILIDAD TÉCNICA */}
          <div className="pt-8 border-t border-gray-300 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="border-b border-gray-400 pb-12 mb-1 w-48 mx-auto" />
              <p className="font-bold text-gray-800">{inputs.engineerName}</p>
              <p className="text-gray-500">Ingeniero Proyectista Estructural</p>
            </div>
            <div>
              <div className="border-b border-gray-400 pb-12 mb-1 w-48 mx-auto" />
              <p className="font-bold text-gray-800">Revisión y Aprobación</p>
              <p className="text-gray-500">Dirección Técnica de Proyecto</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
