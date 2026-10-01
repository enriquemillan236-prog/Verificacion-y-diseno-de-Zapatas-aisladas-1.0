import React, { useState } from 'react';
import { FootingInputs, FootingResults } from '../types/footing';
import { Box, Layers, Eye, Download, Check, Sliders } from 'lucide-react';

interface TechnicalFootingSVGProps {
  inputs: FootingInputs;
  results: FootingResults;
}

export const TechnicalFootingSVG: React.FC<TechnicalFootingSVGProps> = ({
  inputs,
  results,
}) => {
  const [viewMode, setViewMode] = useState<'plan' | 'elevation'>('plan');
  const [showRebar, setShowRebar] = useState(true);
  const [showDimensions, setShowDimensions] = useState(true);
  const [copied, setCopied] = useState(false);

  // Colores corporativos según guía
  const cForest = '#183B2F'; // Verde Bosque Oscuro
  const cForestMid = '#1E4838';
  const cMint = '#A3D1B4'; // Verde Menta
  const cMintLight = '#D2E3D8';
  const cGold = '#EEDFA8'; // Amarillo Dorado
  const cRebar = '#C97A3E'; // Acero corrugado

  // Escala dinámica del recubrimiento "r" y peralte "d" según la altura h
  // h de zapata gráfica = 80 px (desde y=270 hasta y=350)
  const footingH = Math.max(30, results.h);
  const recPx = Math.max(8, Math.min(36, Math.round((inputs.rec / footingH) * 80)));
  const yFootingTop = 270;
  const yFootingBottom = 350; // 270 + 80
  const yRebarLong = yFootingBottom - recPx; // posición Y de la armadura longitudinal
  const yRebarTrans = yRebarLong - 5; // posición Y de las varillas transversales
  const dPx = yRebarLong - yFootingTop; // peralte gráfico efectivo

  // Escala geométrica para la Vista en Planta (Plano X-Y)
  // Eje X = Dimensión B (Ancho de la zapata, horizontal)
  // Eje Y = Dimensión L (Largo de la zapata, vertical)
  const maxFootingDim = Math.max(results.b, results.l, 0.5);
  const planScale = 320 / maxFootingDim; // px por metro

  const footingW = Math.round(results.b * planScale);
  const footingL = Math.round(results.l * planScale);
  const halfW = footingW / 2;
  const halfL = footingL / 2;

  // Dimensiones proporcionales reales de la columna en Planta
  // Ancho b en Dir. B (Eje X, horizontal): inputs.bCol en cm -> metros
  // Largo t en Dir. L (Eje Y, vertical): inputs.tCol en cm -> metros
  const colWidthPx = Math.max(14, Math.round((inputs.bCol / 100) * planScale));
  const colLengthPx = Math.max(14, Math.round((inputs.tCol / 100) * planScale));
  const colHalfW = colWidthPx / 2;
  const colHalfL = colLengthPx / 2;

  // Perímetro crítico de punzonamiento bo a d/2 alrededor de la columna
  const boWidthPx = Math.max(colWidthPx + 12, Math.round(((inputs.bCol + results.d) / 100) * planScale));
  const boLengthPx = Math.max(colLengthPx + 12, Math.round(((inputs.tCol + results.d) / 100) * planScale));
  const boHalfW = boWidthPx / 2;
  const boHalfL = boLengthPx / 2;

  // Función para copiar SVG
  const handleCopySvg = () => {
    const svgEl = document.getElementById('footing-technical-svg');
    if (svgEl) {
      navigator.clipboard.writeText(svgEl.outerHTML);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5 transition-all">
      {/* Encabezado del Visor Técnico */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#183B2F] text-[#D2E3D8] flex items-center justify-center font-bold">
            <Box className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-[#183B2F] font-heading">
                ESQUEMA TÉCNICO: PLANTA Y CORTE ELEVACIÓN
              </h2>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-[#D2E3D8] text-[#183B2F]">
                Planos Estructurales
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Visualización técnica a escala con cotas B, L, h, d(r), cargas completas Pu/Ps y armadura ortogonal
            </p>
          </div>
        </div>

        {/* Controles de Vista y Opciones */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Pestañas de Vista (Planta y Corte Elevación) */}
          <div className="flex items-center bg-[#F7F7F2] p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => setViewMode('plan')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'plan'
                  ? 'bg-[#183B2F] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-[#183B2F]'
              }`}
            >
              Planta (X-Y)
            </button>
            <button
              onClick={() => setViewMode('elevation')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                viewMode === 'elevation'
                  ? 'bg-[#183B2F] text-white shadow-2xs'
                  : 'text-gray-600 hover:text-[#183B2F]'
              }`}
            >
              Corte Elevación
            </button>
          </div>

          {/* Toggle Malla */}
          <button
            onClick={() => setShowRebar(!showRebar)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              showRebar
                ? 'bg-[#D2E3D8] border-[#A3D1B4] text-[#183B2F]'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
            title="Alternar visibilidad del acero de refuerzo"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Parrilla</span>
          </button>

          {/* Toggle Cotas */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`p-1.5 rounded-lg border text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer ${
              showDimensions
                ? 'bg-[#D2E3D8] border-[#A3D1B4] text-[#183B2F]'
                : 'bg-white border-gray-200 text-gray-400'
            }`}
            title="Alternar visualización de cotas y etiquetas"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Cotas</span>
          </button>

          {/* Copiar SVG */}
          <button
            onClick={handleCopySvg}
            className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            title="Copiar código SVG al portapapeles"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Download className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copiado' : 'SVG'}</span>
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: LIENZO SVG + PANEL LATERAL INDEPENDIENTE */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-4">
        {/* LIENZO GRÁFICO SVG LIMPIO (3 columnas en pantallas grandes) */}
        <div className="lg:col-span-3 relative w-full bg-[#FAFAF8] rounded-xl border border-gray-200 overflow-hidden flex items-center justify-center p-2 min-h-[460px] sm:min-h-[500px]">
          <svg
            id="footing-technical-svg"
            viewBox="0 0 800 490"
            className="w-full h-auto max-h-[500px] select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Definiciones de Gradientes, Patrones y Marcadores */}
            <defs>
              <linearGradient id="gradLeftFace" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1E4838" />
                <stop offset="100%" stopColor="#143228" />
              </linearGradient>

              <pattern id="concreteHatch" width="16" height="16" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="0.75" fill="#183B2F" opacity="0.3" />
                <circle cx="10" cy="8" r="1" fill="#183B2F" opacity="0.35" />
                <path d="M 0 16 L 16 0 M 0 8 L 8 0 M 8 16 L 16 8" stroke="#183B2F" strokeWidth="0.5" opacity="0.15" />
              </pattern>

              <pattern id="soilPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <line x1="0" y1="20" x2="20" y2="0" stroke="#94A3B8" strokeWidth="0.8" opacity="0.3" />
                <circle cx="5" cy="5" r="1" fill="#94A3B8" opacity="0.4" />
                <circle cx="15" cy="15" r="1.2" fill="#94A3B8" opacity="0.4" />
              </pattern>

              {/* Marcadores de flechas para cotas */}
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#183B2F" />
              </marker>
              <marker id="arrowMuted" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#64748B" />
              </marker>
              <marker id="arrowLoadPu" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#B45309" />
              </marker>
            </defs>

            {/* ============================================================
                1. VISTA EN PLANTA (CORTE X-Y)
               ============================================================ */}
            {viewMode === 'plan' && (
              <g id="view-plan" transform="translate(400, 240)">
                {/* Cuadrícula de referencia de ejes estructurales */}
                <g stroke="#94A3B8" strokeWidth="1" strokeDasharray="6,4">
                  <line x1="-220" y1="0" x2="220" y2="0" />
                  <line x1="0" y1="-210" x2="0" y2="210" />
                </g>
                {/* Burbujas de ejes */}
                <circle cx="-235" cy="0" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.5" />
                <text x="-235" y="4" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">A</text>
                <circle cx="235" cy="0" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.5" />
                <text x="235" y="4" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">A'</text>

                <circle cx="0" cy="-225" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.5" />
                <text x="0" y="-221" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">1</text>
                <circle cx="0" cy="225" r="12" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.5" />
                <text x="0" y="229" fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">1'</text>

                {/* Sombra de la zapata */}
                <rect x={-halfW - 6} y={-halfL - 6} width={footingW + 12} height={footingL + 12} rx="4" fill="#000000" opacity="0.05" />

                {/* Zapata en Planta */}
                <rect
                  x={-halfW}
                  y={-halfL}
                  width={footingW}
                  height={footingL}
                  fill="#F8FAFC"
                  stroke="#183B2F"
                  strokeWidth="2.5"
                />
                <rect
                  x={-halfW}
                  y={-halfL}
                  width={footingW}
                  height={footingL}
                  fill="url(#concreteHatch)"
                />

                {/* Perímetro Crítico de Punzonamiento bo a d/2 */}
                <rect
                  x={-boHalfW}
                  y={-boHalfL}
                  width={boWidthPx}
                  height={boLengthPx}
                  fill="#A3D1B4"
                  fillOpacity="0.25"
                  stroke="#1E4838"
                  strokeWidth="1.6"
                  strokeDasharray="5,4"
                />
                <text x="0" y={-boHalfL - 7} fill="#183B2F" fontSize="11" fontWeight="bold" textAnchor="middle">
                  Zona Crítica bo = {results.bo} cm (a d/2)
                </text>

                {/* Parrilla de Refuerzo Inferior */}
                {showRebar && (
                  <g id="rebar-plan">
                    {/* Barras longitudinales (Dirección L) */}
                    {Array.from({ length: Math.min(results.nBarsL, 10) }).map((_, idx, arr) => {
                      const step = (footingW - 40) / (arr.length - 1);
                      const xPos = -(footingW - 40) / 2 + idx * step;
                      return (
                        <g key={`rebar-l-${idx}`}>
                          <line
                            x1={xPos}
                            y1={-halfL + 20}
                            x2={xPos}
                            y2={halfL - 20}
                            stroke={cRebar}
                            strokeWidth="2.4"
                            strokeLinecap="round"
                          />
                          {/* Ganchos a 90° en los extremos */}
                          <line x1={xPos} y1={-halfL + 20} x2={xPos + 8} y2={-halfL + 20} stroke={cRebar} strokeWidth="2.4" />
                          <line x1={xPos} y1={halfL - 20} x2={xPos + 8} y2={halfL - 20} stroke={cRebar} strokeWidth="2.4" />
                        </g>
                      );
                    })}

                    {/* Barras transversales (Dirección B) */}
                    {Array.from({ length: Math.min(results.nBarsB, 10) }).map((_, idx, arr) => {
                      const step = (footingL - 40) / (arr.length - 1);
                      const yPos = -(footingL - 40) / 2 + idx * step;
                      return (
                        <g key={`rebar-b-${idx}`}>
                          <line
                            x1={-halfW + 20}
                            y1={yPos}
                            x2={halfW - 20}
                            y2={yPos}
                            stroke="#1E4838"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                            strokeDasharray="6,2"
                          />
                          {/* Ganchos a 90° en los extremos */}
                          <line x1={-halfW + 20} y1={yPos} x2={-halfW + 20} y2={yPos - 8} stroke="#1E4838" strokeWidth="2.2" />
                          <line x1={halfW - 20} y1={yPos} x2={halfW - 20} y2={yPos - 8} stroke="#1E4838" strokeWidth="2.2" />
                        </g>
                      );
                    })}

                    {/* Llamada de texto con flecha para armadura L */}
                    <line x1="-80" y1="80" x2="-160" y2="120" stroke={cRebar} strokeWidth="1.4" />
                    <line x1="-160" y1="120" x2="-230" y2="120" stroke={cRebar} strokeWidth="1.4" />
                    <circle cx="-80" cy="80" r="3.5" fill={cRebar} />
                    <text x="-165" y="114" fill={cRebar} fontSize="11" fontWeight="bold" textAnchor="end">
                      Dir. L: {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
                    </text>

                    {/* Llamada de texto con flecha para armadura B */}
                    <line x1="80" y1="-70" x2="160" y2="-120" stroke="#1E4838" strokeWidth="1.4" />
                    <line x1="160" y1="-120" x2="230" y2="-120" stroke="#1E4838" strokeWidth="1.4" />
                    <circle cx="80" cy="-70" r="3.5" fill="#1E4838" />
                    <text x="165" y="-125" fill="#1E4838" fontSize="11" fontWeight="bold">
                      Dir. B: {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
                    </text>
                  </g>
                )}

                {/* Columna centrada con dimensiones proporcionales reales (b x t) */}
                <rect
                  x={-colHalfW}
                  y={-colHalfL}
                  width={colWidthPx}
                  height={colLengthPx}
                  fill="#183B2F"
                  stroke="#0F241D"
                  strokeWidth="2"
                />
                {/* Rayado cruzado de columna proporcional */}
                <line x1={-colHalfW} y1={-colHalfL} x2={colHalfW} y2={colHalfL} stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
                <line x1={colHalfW} y1={-colHalfL} x2={-colHalfW} y2={colHalfL} stroke="#FFFFFF" strokeWidth="1" opacity="0.6" />
                <text x="0" y={-colHalfL - 8} fill="#183B2F" fontSize="12" fontWeight="bold" textAnchor="middle">
                  Col. {inputs.bCol} x {inputs.tCol} cm
                </text>

                {/* COTAS EN PLANTA */}
                {showDimensions && (
                  <g id="dims-plan">
                    {/* Cota Dimensión B (Horizontal) */}
                    <line x1={-halfW} y1={halfL + 18} x2={halfW} y2={halfL + 18} stroke="#183B2F" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <rect x="-65" y={halfL + 5} width="130" height="26" rx="5" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                    <text x="0" y={halfL + 23} fill="#183B2F" fontSize="13" fontWeight="bold" textAnchor="middle">
                      B = {results.b.toFixed(2)} m
                    </text>

                    {/* Cota Dimensión L (Vertical) */}
                    <line x1={halfW + 18} y1={-halfL} x2={halfW + 18} y2={halfL} stroke="#183B2F" strokeWidth="1.5" markerStart="url(#arrow)" markerEnd="url(#arrow)" />
                    <rect x={halfW + 28} y="-13" width="120" height="26" rx="5" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                    <text x={halfW + 88} y="5" fill="#183B2F" fontSize="13" fontWeight="bold" textAnchor="middle">
                      L = {results.l.toFixed(2)} m
                    </text>
                  </g>
                )}
              </g>
            )}

            {/* ============================================================
                2. CORTE EN ELEVACIÓN (X-Z / Y-Z)
                Desplazado hacia abajo para que el vector de carga Pu y Ps
                queden 100% visibles, legibles y con margen superior despejado.
               ============================================================ */}
            {viewMode === 'elevation' && (
              <g id="view-elevation">
                {/* MARGEN SUPERIOR COMPLETAMENTE DESPEJADO: Cargas Axiales Pu y Ps en Y=35 a Y=88 */}
                <g id="cargas-columna-elevacion" transform="translate(400, 35)">
                  {/* Recuadro contenedor de Cargas Pu y Ps */}
                  <rect
                    x="-120"
                    y="0"
                    width="240"
                    height="54"
                    rx="8"
                    fill="#FFFFFF"
                    stroke="#B45309"
                    strokeWidth="2"
                    filter="drop-shadow(0 3px 6px rgba(0,0,0,0.08))"
                  />
                  {/* Carga Última de Diseño Pu */}
                  <text x="0" y="22" fill="#B45309" fontSize="13" fontWeight="extrabold" textAnchor="middle">
                    Pu = {results.pu.toFixed(2)} Tn (Carga Última)
                  </text>
                  {/* Carga de Servicio Ps */}
                  <text x="0" y="42" fill="#183B2F" fontSize="12" fontWeight="bold" textAnchor="middle">
                    Ps = {results.ps.toFixed(2)} Tn (Carga Servicio)
                  </text>

                  {/* Vector de carga descendente */}
                  <line
                    x1="0"
                    y1="56"
                    x2="0"
                    y2="100"
                    stroke="#B45309"
                    strokeWidth="3.8"
                    markerEnd="url(#arrowLoadPu)"
                  />
                </g>

                {/* Centro geométrico de la elevación (X=400) */}
                <g transform="translate(400, 0)">
                  {/* Nivel de terreno natural (N.T.N. ±0.00 m) en Y=180 */}
                  <line x1="-365" y1="180" x2="310" y2="180" stroke="#64748B" strokeWidth="1.5" strokeDasharray="5,4" />
                  <text x="-285" y="172" fill="#475569" fontSize="12" fontWeight="bold">N.T.N. ±0.00 m</text>

                  {/* Relleno de Suelo lateral */}
                  <rect x="-290" y="180" width="90" height="90" fill="url(#soilPattern)" opacity="0.5" />
                  <rect x="200" y="180" width="90" height="90" fill="url(#soilPattern)" opacity="0.5" />

                  {/* Solado de concreto pobre debajo de la zapata */}
                  <rect x="-200" y={yFootingBottom} width="400" height="15" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
                  <text x="0" y={yFootingBottom + 11} fill="#64748B" fontSize="9.5" fontWeight="bold" textAnchor="middle">
                    Solado e=10cm (f'c = 100 kg/cm²)
                  </text>

                  {/* Zapata aislada en elevación (yFootingTop=270 a yFootingBottom=350) */}
                  <rect
                    x="-200"
                    y={yFootingTop}
                    width="400"
                    height="80"
                    fill="url(#gradLeftFace)"
                    stroke="#183B2F"
                    strokeWidth="2.5"
                  />
                  <rect
                    x="-200"
                    y={yFootingTop}
                    width="400"
                    height="80"
                    fill="url(#concreteHatch)"
                    opacity="0.35"
                  />

                  {/* Columna en elevación (desde Y=145 hasta Y=270) */}
                  <rect
                    x="-35"
                    y="145"
                    width="70"
                    height="125"
                    fill="#183B2F"
                    stroke="#0F241D"
                    strokeWidth="1.8"
                  />
                  <text x="0" y="210" fill="#FFFFFF" fontSize="13" fontWeight="bold" textAnchor="middle">
                    Columna {inputs.bCol}x{inputs.tCol}
                  </text>

                  {/* Acero longitudinal de columna con ganchos a 90° anclados sobre la parrilla */}
                  <g stroke="#F59E0B" strokeWidth="2.6" fill="none">
                    <path d={`M-24,150 L-24,${yRebarTrans} L-75,${yRebarTrans}`} strokeLinecap="round" />
                    <path d={`M24,150 L24,${yRebarTrans} L75,${yRebarTrans}`} strokeLinecap="round" />
                  </g>

                  {/* Parrilla Inferior de la Zapata (Dinamizada con recubrimiento r y peralte d) */}
                  {showRebar && (
                    <g id="rebar-elevation">
                      {/* Varilla longitudinal con ganchos que se desplaza con r */}
                      <path
                        d={`M-180,${yRebarLong - 20} L-180,${yRebarLong} L180,${yRebarLong} L180,${yRebarLong - 20}`}
                        fill="none"
                        stroke={cRebar}
                        strokeWidth="3.4"
                        strokeLinecap="round"
                      />
                      {/* Círculos de varillas transversales repartidas sobre la parrilla */}
                      {[-150, -110, -70, -30, 10, 50, 90, 130, 160].map((xPos, idx) => (
                        <circle
                          key={`trans-bar-${idx}`}
                          cx={xPos}
                          cy={yRebarTrans}
                          r="3.2"
                          fill="#1E4838"
                          stroke="#FFFFFF"
                          strokeWidth="0.8"
                        />
                      ))}
                    </g>
                  )}

                  {/* Diagrama de Presiones del Suelo (Trapecio con vectores) */}
                  <polygon
                    points={`-200,${yFootingBottom + 16} 200,${yFootingBottom + 16} 200,${yFootingBottom + 56} -200,${yFootingBottom + 56}`}
                    fill="#D2E3D8"
                    fillOpacity="0.5"
                    stroke="#A3D1B4"
                    strokeWidth="1.2"
                  />
                  {/* Flechas de reacción de suelo */}
                  {[-170, -130, -90, -50, -10, 30, 70, 110, 150].map((xPos, idx) => (
                    <line
                      key={`soil-arrow-${idx}`}
                      x1={xPos}
                      y1={yFootingBottom + 52}
                      x2={xPos}
                      y2={yFootingBottom + 20}
                      stroke="#183B2F"
                      strokeWidth="1.3"
                      markerEnd="url(#arrow)"
                    />
                  ))}
                  <text x="-180" y={yFootingBottom + 70} fill="#183B2F" fontSize="12" fontWeight="bold">
                    q_max = {results.qMax.toFixed(2)} kg/cm²
                  </text>
                  <text x="80" y={yFootingBottom + 70} fill="#183B2F" fontSize="12" fontWeight="bold">
                    qa = {inputs.qa.toFixed(2)} kg/cm²
                  </text>

                  {/* COTAS EN ELEVACIÓN (Dinamizadas con h, d y r, con Df a la izquierda despejada) */}
                  {showDimensions && (
                    <g id="dims-elevation">
                      {/* Cota Altura Total h */}
                      <line
                        x1="220"
                        y1={yFootingTop}
                        x2="220"
                        y2={yFootingBottom}
                        stroke="#183B2F"
                        strokeWidth="1.5"
                        markerStart="url(#arrow)"
                        markerEnd="url(#arrow)"
                      />
                      <rect x="230" y={yFootingTop + 28} width="95" height="24" rx="5" fill="#FFFFFF" stroke="#183B2F" strokeWidth="1.2" />
                      <text x="277" y={yFootingTop + 44} fill="#183B2F" fontSize="12" fontWeight="bold" textAnchor="middle">
                        h = {results.h} cm
                      </text>

                      {/* Líneas auxiliares de referencia para d y r */}
                      <line x1="-200" y1={yFootingTop} x2="-225" y2={yFootingTop} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-180" y1={yRebarLong} x2="-225" y2={yRebarLong} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-200" y1={yFootingBottom} x2="-225" y2={yFootingBottom} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />

                      {/* Cota Peralte Efectivo d (dinámico: desde borde superior hasta la armadura) */}
                      <line
                        x1="-218"
                        y1={yFootingTop}
                        x2="-218"
                        y2={yRebarLong}
                        stroke="#183B2F"
                        strokeWidth="1.5"
                        markerStart="url(#arrow)"
                        markerEnd="url(#arrow)"
                      />
                      <rect
                        x="-278"
                        y={yFootingTop + dPx / 2 - 12}
                        width="56"
                        height="24"
                        rx="4"
                        fill="#FFFFFF"
                        stroke="#183B2F"
                        strokeWidth="1.2"
                      />
                      <text
                        x="-250"
                        y={yFootingTop + dPx / 2 + 5}
                        fill="#183B2F"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        d = {results.d}
                      </text>

                      {/* Cota Recubrimiento r (dinámico: desde la armadura hasta el fondo de la zapata) */}
                      <line
                        x1="-218"
                        y1={yRebarLong}
                        x2="-218"
                        y2={yFootingBottom}
                        stroke="#64748B"
                        strokeWidth="1.5"
                        markerStart="url(#arrowMuted)"
                        markerEnd="url(#arrowMuted)"
                      />
                      <rect
                        x="-278"
                        y={yRebarLong + recPx / 2 - 10}
                        width="56"
                        height="20"
                        rx="4"
                        fill="#FFFFFF"
                        stroke="#64748B"
                        strokeWidth="1"
                      />
                      <text
                        x="-250"
                        y={yRebarLong + recPx / 2 + 4}
                        fill="#475569"
                        fontSize="10.5"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        r = {inputs.rec}
                      </text>

                      {/* Cota Profundidad de Desplante Df (A la izquierda, completamente despejada de d y r) */}
                      <line x1="-310" y1="180" x2="-356" y2="180" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line x1="-200" y1={yFootingBottom} x2="-356" y2={yFootingBottom} stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3,2" />
                      <line
                        x1="-350"
                        y1="180"
                        x2="-350"
                        y2={yFootingBottom}
                        stroke="#183B2F"
                        strokeWidth="1.5"
                        markerStart="url(#arrow)"
                        markerEnd="url(#arrow)"
                      />
                      <rect
                        x="-390"
                        y={180 + (yFootingBottom - 180) / 2 - 12}
                        width="78"
                        height="24"
                        rx="5"
                        fill="#FFFFFF"
                        stroke="#183B2F"
                        strokeWidth="1.2"
                      />
                      <text
                        x="-351"
                        y={180 + (yFootingBottom - 180) / 2 + 5}
                        fill="#183B2F"
                        fontSize="11"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        Df = {inputs.df.toFixed(2)} m
                      </text>
                    </g>
                  )}
                </g>
              </g>
            )}
          </svg>
        </div>

        {/* PANEL LATERAL DERECHO INDEPENDIENTE: LEYENDA TÉCNICA */}
        <div className="lg:col-span-1 bg-[#F7F7F2] rounded-xl border border-gray-200 p-4 flex flex-col justify-between space-y-3.5">
          <div>
            {/* Encabezado de la Leyenda */}
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-200">
              <h3 className="text-xs font-bold text-[#183B2F] uppercase tracking-wider font-heading flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#1E4838]" />
                <span>Leyenda Técnica</span>
              </h3>
              <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200">
                Normativa
              </span>
            </div>

            {/* Elementos de la Leyenda */}
            <div className="space-y-2.5 mt-3 text-xs">
              {/* 1. Concreto */}
              <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#183B2F] shrink-0" />
                  <span className="font-bold text-gray-800">Concreto Estructural</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 pl-5">
                  f'c = <strong className="text-[#183B2F]">{inputs.fc} kg/cm²</strong>
                </p>
              </div>

              {/* 2. Acero */}
              <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-[#C97A3E] shrink-0" />
                  <span className="font-bold text-gray-800">Acero de Refuerzo</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 pl-5">
                  Fy <strong className="text-[#183B2F]">{inputs.fy} kg/cm²</strong> ({results.selectedBar.key})
                </p>
              </div>

              {/* 3. Recubrimiento & Peralte */}
              <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-slate-600 shrink-0" />
                  <span className="font-bold text-gray-800">Recubrimiento & Peralte</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 pl-5">
                  r = <strong className="text-[#183B2F]">{inputs.rec} cm</strong> | d = <strong className="text-[#183B2F]">{results.d} cm</strong>
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5 pl-5">
                  d = h - r - db (dinámico)
                </p>
              </div>

              {/* 4. Zona Crítica */}
              <div className="p-2.5 bg-white rounded-lg border border-gray-200 shadow-2xs">
                <div className="flex items-center space-x-2">
                  <span className="w-3.5 h-3.5 rounded bg-[#A3D1B4] border border-[#183B2F] shrink-0" />
                  <span className="font-bold text-gray-800">Zona Crítica Punz.</span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1 pl-5">
                  Perímetro bo = <strong className="text-[#183B2F]">{results.bo} cm</strong> (a d/2)
                </p>
              </div>
            </div>
          </div>

          {/* Resumen inferior de Cargas de diseño y servicio */}
          <div className="pt-2 border-t border-gray-200 text-[11px] text-gray-600 bg-white/70 p-2.5 rounded-lg border border-gray-200/80">
            <div className="flex justify-between items-center">
              <span>Carga de Diseño (Pu):</span>
              <strong className="text-[#B45309] font-mono">{results.pu.toFixed(2)} Tn</strong>
            </div>
            <div className="flex justify-between items-center mt-1">
              <span>Carga de Servicio (Ps):</span>
              <strong className="text-[#183B2F] font-mono">{results.ps.toFixed(2)} Tn</strong>
            </div>
            <div className="flex justify-between items-center mt-1 pt-1 border-t border-gray-100">
              <span>Presión Máx. (q_max):</span>
              <strong className={results.isSoilOk ? 'text-emerald-700' : 'text-red-700'}>
                {results.qMax.toFixed(2)} kg/cm²
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
