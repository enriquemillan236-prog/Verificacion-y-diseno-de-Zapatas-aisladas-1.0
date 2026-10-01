import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { FootingInputs, FootingResults } from '../types/footing';
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  Compass,
  BarChart3,
  TrendingUp,
  Layers,
  ArrowRight,
  HelpCircle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface SoilPressureDistributionChartProps {
  inputs: FootingInputs;
  results: FootingResults;
  className?: string;
  isEmbedded?: boolean;
}

type DirectionMode = 'L' | 'B';
type LoadCase = 'service' | 'ultimate';
type ChartView = 'continuous' | 'bars';
type UnitType = 'kg/cm2' | 'Tn/m2' | 'kPa';

export const SoilPressureDistributionChart: React.FC<SoilPressureDistributionChartProps> = ({
  inputs,
  results,
  className = '',
  isEmbedded = false,
}) => {
  const [direction, setDirection] = useState<DirectionMode>('L');
  const [loadCase, setLoadCase] = useState<LoadCase>('service');
  const [chartView, setChartView] = useState<ChartView>('continuous');
  const [unit, setUnit] = useState<UnitType>('kg/cm2');
  const [showHelp, setShowHelp] = useState(false);

  // Dimensiones según dirección
  const lengthDim = direction === 'L' ? results.l : results.b;
  const widthDim = direction === 'L' ? results.b : results.l;

  // Cargas y momentos
  const P = loadCase === 'service' ? results.ps : results.pu;
  // Momento: si dirección L, momento Mxx; si dirección B, momento Myy
  const M = direction === 'L'
    ? (loadCase === 'service' ? results.mxx : results.muL)
    : (loadCase === 'service' ? results.myy : results.muB);

  // Factores de conversión desde kg/cm²
  const unitFactor = useMemo(() => {
    switch (unit) {
      case 'Tn/m2':
        return 10.0; // 1 kg/cm² = 10 Tn/m²
      case 'kPa':
        return 98.0665; // 1 kg/cm² = 98.0665 kPa
      case 'kg/cm2':
      default:
        return 1.0;
    }
  }, [unit]);

  const unitLabel = useMemo(() => {
    switch (unit) {
      case 'Tn/m2':
        return 'Tn/m²';
      case 'kPa':
        return 'kPa';
      case 'kg/cm2':
      default:
        return 'kg/cm²';
    }
  }, [unit]);

  // Capacidad admisible y neta en la unidad seleccionada
  const qaVal = inputs.qa * unitFactor;
  const qnVal = results.qn * unitFactor;

  // Cálculo mecánico de presiones basado en los esfuerzos combinados N, Mxx y Myy
  const analysis = useMemo(() => {
    const area = results.b * results.l;
    if (area <= 0 || P <= 0) {
      return {
        e: 0,
        eKern: lengthDim / 6,
        isWithinKern: true,
        qMaxKgCm2: 0,
        qMinKgCm2: 0,
        qAvgKgCm2: 0,
        contactLength: lengthDim,
        contactPercentage: 100,
        dataPoints: [],
      };
    }

    // Momento longitudinal y transversal según la dirección seleccionada
    const M_long = direction === 'L'
      ? (loadCase === 'service' ? results.mxx : (results.muL || results.mu))
      : (loadCase === 'service' ? results.myy : (results.muB || results.mu));

    const M_trans = direction === 'L'
      ? (loadCase === 'service' ? results.myy : (results.muB || results.mu))
      : (loadCase === 'service' ? results.mxx : (results.muL || results.mu));

    const e = P > 0 ? Math.abs(M_long / P) : 0;
    const eKern = lengthDim / 6;
    const isWithinKern = e <= eKern + 0.0001;

    let qMaxKgCm2: number;
    let qMinKgCm2: number;
    let contactLength = lengthDim;

    if (loadCase === 'service') {
      // El pico máximo reportado en la tabla de resultados (Q_MAX) coincide exactamente
      qMaxKgCm2 = results.qMax;
      qMinKgCm2 = results.qMin;
      if (!isWithinKern) {
        const a = Math.max(0.01, lengthDim / 2 - e);
        contactLength = Math.min(lengthDim, 3 * a);
      }
    } else {
      // Estado último mayorado con Pu y Mu combinados
      const baseUlt = P / area;
      const inertiaLong = (widthDim * Math.pow(lengthDim, 3)) / 12;
      const inertiaTrans = (lengthDim * Math.pow(widthDim, 3)) / 12;
      const flexLong = inertiaLong > 0 && M_long !== 0 ? (Math.abs(M_long) * (lengthDim / 2)) / inertiaLong : 0;
      const flexTrans = inertiaTrans > 0 && M_trans !== 0 ? (Math.abs(M_trans) * (widthDim / 2)) / inertiaTrans : 0;

      if (isWithinKern) {
        qMaxKgCm2 = (baseUlt + flexLong + flexTrans) / 10;
        qMinKgCm2 = Math.max(0, (baseUlt - flexLong - flexTrans) / 10);
      } else {
        const a = Math.max(0.01, lengthDim / 2 - e);
        contactLength = Math.min(lengthDim, 3 * a);
        qMaxKgCm2 = ((2 * P) / (widthDim * contactLength) + flexTrans) / 10;
        qMinKgCm2 = 0;
      }
    }

    const qAvgKgCm2 = (P / area) / 10;
    const contactPercentage = Math.min(100, (contactLength / lengthDim) * 100);

    // Gradiente de flexión longitudinal en la unidad seleccionada (kg/cm²)
    const flexSlopeTnM2 = (6 * Math.abs(M_long)) / (widthDim * Math.pow(lengthDim, 2));
    const flexSlopeKgCm2 = flexSlopeTnM2 / 10;

    // Muestreo continuo a lo largo de la base (25 puntos)
    const numPoints = 25;
    const halfL = lengthDim / 2;
    const dataPoints = [];

    for (let i = 0; i < numPoints; i++) {
      const x = -halfL + (i * lengthDim) / (numPoints - 1);
      let qPointKgCm2 = 0;

      if (isWithinKern) {
        // Distribución trapezoidal / uniforme sobre la tira crítica más solicitada
        if (flexSlopeKgCm2 > 0) {
          // Varía linealmente con x alcanzando exactamente qMaxKgCm2 en el borde crítico (+halfL si M_long >= 0)
          const normX = M_long >= 0 ? (x / halfL) : (-x / halfL); // de -1 a +1
          qPointKgCm2 = Math.max(0, qMaxKgCm2 - (1 - normX) * flexSlopeKgCm2);
        } else {
          // Sin momento longitudinal: presión uniforme igual a qMaxKgCm2
          qPointKgCm2 = qMaxKgCm2;
        }
      } else {
        // En levantamiento triangular
        const xStart = M_long >= 0 ? (halfL - contactLength) : (-halfL + contactLength);
        if (M_long >= 0) {
          if (x >= xStart) {
            const fraction = Math.min(1, Math.max(0, (x - xStart) / contactLength));
            qPointKgCm2 = qMaxKgCm2 * fraction;
          } else {
            qPointKgCm2 = 0;
          }
        } else {
          if (x <= xStart) {
            const fraction = Math.min(1, Math.max(0, (xStart - x) / contactLength));
            qPointKgCm2 = qMaxKgCm2 * fraction;
          } else {
            qPointKgCm2 = 0;
          }
        }
      }

      // Asegurar que el punto en el extremo crítico coincida exactamente con qMaxKgCm2
      if ((M_long >= 0 && i === numPoints - 1) || (M_long < 0 && i === 0)) {
        qPointKgCm2 = qMaxKgCm2;
      }

      const qVal = qPointKgCm2 * unitFactor;

      dataPoints.push({
        pos: `${x >= 0 ? '+' : ''}${x.toFixed(2)} m`,
        xVal: Number(x.toFixed(2)),
        distBorde: Number((x + halfL).toFixed(2)),
        presionActuante: Number(qVal.toFixed(3)),
        capacidadAdmisible: Number(qaVal.toFixed(3)),
        capacidadNeta: Number(qnVal.toFixed(3)),
        sobreesfuerzo: qVal > qaVal ? Number((qVal - qaVal).toFixed(3)) : 0,
      });
    }

    return {
      e,
      eKern,
      isWithinKern,
      qMaxKgCm2,
      qMinKgCm2,
      qAvgKgCm2,
      contactLength,
      contactPercentage,
      dataPoints,
    };
  }, [lengthDim, widthDim, P, direction, loadCase, results, unitFactor, qaVal, qnVal]);

  const qMaxDisp = analysis.qMaxKgCm2 * unitFactor;
  const qMinDisp = analysis.qMinKgCm2 * unitFactor;
  const qAvgDisp = analysis.qAvgKgCm2 * unitFactor;

  // Verificación geotécnica (en servicio)
  const isOk = loadCase === 'service' ? analysis.qMaxKgCm2 <= inputs.qa * 1.0001 : true;
  const ratio = inputs.qa > 0 ? (analysis.qMaxKgCm2 / inputs.qa) * 100 : 0;
  const safetyFactor = analysis.qMaxKgCm2 > 0 ? inputs.qa / analysis.qMaxKgCm2 : 999;

  // Datos para gráfico de barras comparativo
  const barChartData = [
    {
      name: 'q_mínima',
      label: 'Presión Mínima',
      valor: Number(qMinDisp.toFixed(3)),
      limite: Number(qaVal.toFixed(3)),
      color: '#10B981',
      tipo: 'Presión en Borde',
    },
    {
      name: 'q_promedio',
      label: 'Presión Media (P/A)',
      valor: Number(qAvgDisp.toFixed(3)),
      limite: Number(qaVal.toFixed(3)),
      color: '#0D9488',
      tipo: 'Presión Media',
    },
    {
      name: 'q_máxima',
      label: 'Presión Máxima',
      valor: Number(qMaxDisp.toFixed(3)),
      limite: Number(qaVal.toFixed(3)),
      color: isOk ? '#183B2F' : '#DC2626',
      tipo: 'Presión Crítica',
    },
    {
      name: 'q_neta',
      label: 'Capacidad Neta (qn)',
      valor: Number(qnVal.toFixed(3)),
      limite: Number(qaVal.toFixed(3)),
      color: '#0284C7',
      tipo: 'Resistencia Suelo',
    },
    {
      name: 'q_admisible',
      label: 'Capacidad Admisible (qa)',
      valor: Number(qaVal.toFixed(3)),
      limite: Number(qaVal.toFixed(3)),
      color: '#B45309',
      tipo: 'Límite de Falla / FS',
    },
  ];

  // Tooltip personalizado para el perfil continuo
  const CustomContinuousTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      const qAct = item.presionActuante;
      const margin = qaVal - qAct;
      const isExceeded = qAct > qaVal;

      return (
        <div className="bg-white p-3.5 rounded-xl shadow-xl border border-gray-200 text-xs font-sans min-w-[220px]">
          <div className="border-b border-gray-100 pb-2 mb-2">
            <span className="font-extrabold text-[#183B2F] block">
              Posición: {item.pos}
            </span>
            <span className="text-[11px] text-gray-500">
              Distancia desde borde izq.: {item.distBorde} m
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#183B2F] inline-block" />
                Presión Actuante q:
              </span>
              <span className={`font-bold font-mono ${isExceeded ? 'text-red-600' : 'text-[#183B2F]'}`}>
                {qAct.toFixed(3)} {unitLabel}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B45309] inline-block" />
                Cap. Admisible qa:
              </span>
              <span className="font-bold font-mono text-[#B45309]">
                {qaVal.toFixed(3)} {unitLabel}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#0284C7] inline-block" />
                Cap. Neta qn:
              </span>
              <span className="font-bold font-mono text-[#0284C7]">
                {qnVal.toFixed(3)} {unitLabel}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500 font-semibold">Margen de Seguridad:</span>
              <span
                className={`font-bold font-mono ${
                  margin >= 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {margin >= 0 ? `+${margin.toFixed(3)}` : margin.toFixed(3)} {unitLabel}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  // Tooltip personalizado para barras
  const CustomBarTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl shadow-lg border border-gray-200 text-xs font-sans min-w-[190px]">
          <span className="font-bold text-[#183B2F] block mb-1">{data.label}</span>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Valor:</span>
            <span className="font-bold font-mono text-sm text-[#183B2F]">
              {data.valor.toFixed(3)} {unitLabel}
            </span>
          </div>
          <div className="flex justify-between items-center py-0.5">
            <span className="text-gray-500">Categoría:</span>
            <span className="text-gray-700 font-medium">{data.tipo}</span>
          </div>
          {data.name.startsWith('q_') && data.name !== 'q_admisible' && (
            <div className="mt-1.5 pt-1.5 border-t border-gray-100 flex justify-between items-center">
              <span className="text-gray-500">% respecto a qa:</span>
              <span
                className={`font-bold font-mono ${
                  data.valor <= qaVal ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                {((data.valor / (qaVal || 1)) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  const yMaxDomain = Math.ceil(Math.max(qMaxDisp, qaVal, qnVal) * 1.35 * 10) / 10;

  return (
    <div
      className={`${
        isEmbedded
          ? 'bg-[#F7F7F2]/50 rounded-xl border border-gray-200 p-3.5 sm:p-4 mt-3'
          : 'bg-white rounded-2xl shadow-sm border border-[#E5E7EB] p-4 sm:p-6'
      } transition-all ${className}`}
    >
      {/* 1. ENCABEZADO Y BADGES DE ESTADO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div className="flex items-start sm:items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#183B2F] text-white flex items-center justify-center font-bold shadow-xs shrink-0">
            <Activity className="w-5 h-5 text-[#A3D1B4]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base sm:text-lg font-bold text-[#183B2F] font-heading tracking-tight">
                DIAGRAMA DE PRESIONES BAJO LA ZAPATA
              </h3>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#D2E3D8] text-[#183B2F]">
                Recharts DataViz
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Distribución de tensiones de contacto en el terreno q(x) vs Capacidad Admisible qa y Neta qn
            </p>
          </div>
        </div>

        {/* Badges de Verificación Geotécnica */}
        <div className="flex flex-wrap items-center gap-2">
          {loadCase === 'service' ? (
            isOk ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#D2E3D8] text-[#183B2F] border border-[#A3D1B4]">
                <ShieldCheck className="w-4 h-4 text-[#183B2F]" />
                <span>q_max ≤ qa ({ratio.toFixed(1)}% de utilización)</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Sobreesfuerzo: {ratio.toFixed(1)}% de qa (Falla)</span>
              </span>
            )
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              <Activity className="w-4 h-4 text-amber-700" />
              <span>Estado Último Mayorado (Pu = {results.pu.toFixed(1)} Tn)</span>
            </span>
          )}

          {/* Badge de Tercio Central / Kern */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border ${
              analysis.isWithinKern
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-amber-50 text-amber-800 border-amber-300'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>
              {analysis.isWithinKern
                ? 'Tercio Central OK (100% compresión)'
                : `Despegue parcial (${analysis.contactPercentage.toFixed(0)}% contacto)`}
            </span>
          </span>

          <button
            type="button"
            onClick={() => setShowHelp(!showHelp)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            title="Ayuda técnica sobre el diagrama de presiones"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* GUÍA RÁPIDA / AYUDA DESPLEGABLE */}
      {showHelp && (
        <div className="mt-3 p-3.5 bg-[#F7F7F2] rounded-xl border border-gray-200 text-xs text-gray-700 space-y-1.5 animate-fadeIn">
          <p className="font-bold text-[#183B2F] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#183B2F]" />
            Criterio Geotécnico de Verificación (ACI 318 & NTE E.050):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-600">
            <li>
              <strong>Presión Admisible (qa):</strong> Es el límite superior del suelo determinado en el EMS. La presión máxima actuante en servicio <strong>q_max no debe superar qa</strong> (Factor de Seguridad &ge; 1.0).
            </li>
            <li>
              <strong>Capacidad Neta (qn):</strong> Capacidad portante efectiva restando el peso del relleno de suelo y la sobrecarga superficial (qn = qa - &gamma;*Df - s/c).
            </li>
            <li>
              <strong>Tercio Central (Kern limit):</strong> Si la excentricidad e &le; L/6, toda la zapata se mantiene en compresión. Si e &gt; L/6, se produce despegue por incapacidad del suelo de soportar tracción.
            </li>
          </ul>
        </div>
      )}

      {/* 2. BARRA DE HERRAMIENTAS INTERACTIVA */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-4 p-2.5 bg-[#F7F7F2] rounded-xl border border-gray-200 text-xs">
        {/* Selector de Dirección */}
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-gray-600 mr-1 hidden sm:inline">Dirección:</span>
          <button
            type="button"
            onClick={() => setDirection('L')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              direction === 'L'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Eje L (Largo = {results.l.toFixed(2)} m)
          </button>
          <button
            type="button"
            onClick={() => setDirection('B')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              direction === 'B'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            Eje B (Ancho = {results.b.toFixed(2)} m)
          </button>
        </div>

        {/* Selector de Estado de Carga */}
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-gray-600 mr-1 hidden sm:inline">Carga:</span>
          <button
            type="button"
            onClick={() => setLoadCase('service')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              loadCase === 'service'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            title="Carga de Servicio para Geotecnia"
          >
            Servicio (Ps)
          </button>
          <button
            type="button"
            onClick={() => setLoadCase('ultimate')}
            className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              loadCase === 'ultimate'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            title="Carga Última Mayorada para Diseño Estructural"
          >
            Última (Pu)
          </button>
        </div>

        {/* Selector de Tipo de Gráfico */}
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={() => setChartView('continuous')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              chartView === 'continuous'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Perfil 2D</span>
          </button>
          <button
            type="button"
            onClick={() => setChartView('bars')}
            className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
              chartView === 'bars'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Barras</span>
          </button>
        </div>

        {/* Selector de Unidades */}
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-gray-500 mr-1">Unidad:</span>
          {(['kg/cm2', 'Tn/m2', 'kPa'] as UnitType[]).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => setUnit(u)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all cursor-pointer ${
                unit === u
                  ? 'bg-[#183B2F] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {u === 'kg/cm2' ? 'kg/cm²' : u === 'Tn/m2' ? 'Tn/m²' : 'kPa'}
            </button>
          ))}
        </div>
      </div>

      {/* 3. VISUALIZACIÓN RECHARTS */}
      <div className="mt-4">
        {chartView === 'continuous' ? (
          <div className="h-72 sm:h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={analysis.dataPoints}
                margin={{ top: 20, right: 30, bottom: 20, left: 15 }}
              >
                <defs>
                  <linearGradient id="presionGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={isOk ? '#183B2F' : '#DC2626'}
                      stopOpacity={0.45}
                    />
                    <stop
                      offset="95%"
                      stopColor={isOk ? '#A3D1B4' : '#FCA5A5'}
                      stopOpacity={0.08}
                    />
                  </linearGradient>
                  <linearGradient id="sobreesfuerzoGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.15} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="pos"
                  tick={{ fontSize: 11, fill: '#4B5563' }}
                  label={{
                    value: `Posición relativa al eje central de la zapata (${direction === 'L' ? 'L' : 'B'} = ${lengthDim.toFixed(2)} m)`,
                    position: 'insideBottom',
                    offset: -12,
                    fontSize: 11,
                    fill: '#6B7280',
                  }}
                />
                <YAxis
                  domain={[0, yMaxDomain]}
                  tick={{ fontSize: 11, fill: '#4B5563' }}
                  label={{
                    value: `Presión (${unitLabel})`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 0,
                    fontSize: 11,
                    fill: '#6B7280',
                  }}
                />
                <Tooltip content={<CustomContinuousTooltip />} />
                <Legend
                  verticalAlign="top"
                  height={36}
                  formatter={(value) => {
                    if (value === 'presionActuante') return <span className="text-xs font-bold text-gray-700">Presión Actuante q(x)</span>;
                    if (value === 'capacidadAdmisible') return <span className="text-xs font-bold text-[#B45309]">Capacidad Admisible qa</span>;
                    if (value === 'capacidadNeta') return <span className="text-xs font-bold text-[#0284C7]">Capacidad Neta qn</span>;
                    return value;
                  }}
                />
                {/* Línea de Capacidad Admisible (qa) */}
                <ReferenceLine
                  y={qaVal}
                  stroke="#B45309"
                  strokeDasharray="6 4"
                  strokeWidth={2}
                  label={{
                    value: `qa = ${qaVal.toFixed(2)} ${unitLabel}`,
                    fill: '#B45309',
                    position: 'insideTopRight',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                />
                {/* Línea de Capacidad Neta (qn) */}
                <ReferenceLine
                  y={qnVal}
                  stroke="#0284C7"
                  strokeDasharray="3 3"
                  strokeWidth={1.5}
                  label={{
                    value: `qn = ${qnVal.toFixed(2)} ${unitLabel}`,
                    fill: '#0284C7',
                    position: 'insideBottomRight',
                    fontSize: 10,
                    fontWeight: 'bold',
                  }}
                />
                {/* Eje neutro / centro */}
                <ReferenceLine
                  x={`${0 >= 0 ? '+' : ''}${(0).toFixed(2)} m`}
                  stroke="#9CA3AF"
                  strokeDasharray="2 2"
                  label={{
                    value: 'Eje Columna',
                    fill: '#6B7280',
                    position: 'insideTopLeft',
                    fontSize: 9,
                  }}
                />
                {/* Área de la presión actuante */}
                <Area
                  type="monotone"
                  dataKey="presionActuante"
                  stroke={isOk ? '#183B2F' : '#DC2626'}
                  strokeWidth={2.8}
                  fillOpacity={1}
                  fill="url(#presionGradient)"
                  name="presionActuante"
                  activeDot={{ r: 5, fill: isOk ? '#183B2F' : '#DC2626', stroke: '#fff', strokeWidth: 2 }}
                />
                {/* Líneas guía auxiliares */}
                <Line
                  type="monotone"
                  dataKey="capacidadAdmisible"
                  stroke="#B45309"
                  strokeWidth={1.8}
                  strokeDasharray="5 5"
                  dot={false}
                  name="capacidadAdmisible"
                />
                <Line
                  type="monotone"
                  dataKey="capacidadNeta"
                  stroke="#0284C7"
                  strokeWidth={1.4}
                  strokeDasharray="3 3"
                  dot={false}
                  name="capacidadNeta"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        ) : (
          /* Gráfico de Barras Comparativo */
          <div className="h-72 sm:h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barChartData}
                margin={{ top: 20, right: 30, bottom: 20, left: 15 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#4B5563' }}
                />
                <YAxis
                  domain={[0, yMaxDomain]}
                  tick={{ fontSize: 11, fill: '#4B5563' }}
                  label={{
                    value: `Presión (${unitLabel})`,
                    angle: -90,
                    position: 'insideLeft',
                    offset: 0,
                    fontSize: 11,
                    fill: '#6B7280',
                  }}
                />
                <Tooltip content={<CustomBarTooltip />} />
                <ReferenceLine
                  y={qaVal}
                  stroke="#B45309"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  label={{
                    value: `Límite Admisible qa = ${qaVal.toFixed(2)} ${unitLabel}`,
                    fill: '#B45309',
                    position: 'top',
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                />
                <Bar dataKey="valor" radius={[6, 6, 0, 0]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 4. TARJETAS DE INDICADORES CLAVE */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-gray-200 text-xs">
        {/* q_max */}
        <div className="bg-[#F7F7F2] p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[10px] uppercase font-bold">Presión Máxima (q_max)</span>
            {isOk ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <XCircle className="w-3.5 h-3.5 text-red-600" />
            )}
          </div>
          <span
            className={`text-lg font-extrabold block font-mono ${
              isOk ? 'text-[#183B2F]' : 'text-red-600'
            }`}
          >
            {qMaxDisp.toFixed(3)}{' '}
            <span className="text-xs font-normal text-gray-500">{unitLabel}</span>
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Borde crítico (+{(lengthDim / 2).toFixed(2)} m)
          </span>
        </div>

        {/* q_min */}
        <div className="bg-[#F7F7F2] p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[10px] uppercase font-bold">Presión Mínima (q_min)</span>
            <Compass className="w-3.5 h-3.5 text-[#183B2F]" />
          </div>
          <span className="text-lg font-extrabold block font-mono text-[#183B2F]">
            {qMinDisp.toFixed(3)}{' '}
            <span className="text-xs font-normal text-gray-500">{unitLabel}</span>
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            {analysis.qMinKgCm2 > 0 ? 'Sin tracciones (compresión)' : 'Zona en despegue (0.00)'}
          </span>
        </div>

        {/* qa y qn */}
        <div className="bg-[#F7F7F2] p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[10px] uppercase font-bold">Capacidades del Terreno</span>
            <ShieldCheck className="w-3.5 h-3.5 text-[#B45309]" />
          </div>
          <span className="text-lg font-extrabold block font-mono text-[#B45309]">
            {qaVal.toFixed(3)}{' '}
            <span className="text-xs font-normal text-gray-500">{unitLabel}</span>
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Capacidad neta: {qnVal.toFixed(3)} {unitLabel}
          </span>
        </div>

        {/* Factor de Seguridad / Ratio */}
        <div className="bg-[#F7F7F2] p-3 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 mb-0.5">
            <span className="text-[10px] uppercase font-bold">Factor de Seguridad</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                isOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-200 text-red-800'
              }`}
            >
              {isOk ? 'Adecuado' : 'Falla'}
            </span>
          </div>
          <span
            className={`text-lg font-extrabold block font-mono ${
              isOk ? 'text-emerald-700' : 'text-red-600'
            }`}
          >
            FS = {safetyFactor.toFixed(2)}
          </span>
          <span className="text-[10px] text-gray-500 block mt-0.5">
            Utilización: {ratio.toFixed(1)}% de qa
          </span>
        </div>
      </div>

      {/* 5. DIAGNÓSTICO ESTRUCTURAL Y GEOTÉCNICO */}
      <div className="mt-3.5 p-3 rounded-xl bg-[#F7F7F2]/60 border border-gray-200 text-xs text-gray-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 rounded-full bg-[#183B2F] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
            i
          </div>
          <div>
            <span className="font-bold text-[#183B2F]">Comportamiento Geotécnico: </span>
            <span>
              {analysis.isWithinKern ? (
                <>
                  Excentricidad e = {analysis.e.toFixed(3)} m &le; L/6 ({(analysis.eKern).toFixed(3)} m).
                  Distribución trapezoidal con compresión plena en la base (100% área en contacto).
                </>
              ) : (
                <>
                  Excentricidad e = {analysis.e.toFixed(3)} m &gt; L/6 ({(analysis.eKern).toFixed(3)} m).
                  Distribución triangular con despegue parcial. Longitud efectiva en compresión: {analysis.contactLength.toFixed(2)} m ({analysis.contactPercentage.toFixed(0)}%).
                </>
              )}
            </span>
          </div>
        </div>

        {!isOk && (
          <div className="text-red-700 font-bold shrink-0 bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
            <span>Acción: Incrementar {direction === 'L' ? 'L' : 'B'} en planta</span>
          </div>
        )}
      </div>
    </div>
  );
};
