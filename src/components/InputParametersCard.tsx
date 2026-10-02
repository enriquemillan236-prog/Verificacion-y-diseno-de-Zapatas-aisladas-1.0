import React from 'react';
import { FootingInputs, FootingResults } from '../types/footing';
import { REBAR_CATALOG } from '../utils/footingCalculations';
import {
  Layers,
  Mountain,
  Weight,
  Maximize2,
  Sliders,
  Sparkles,
  Info,
  ChevronDown,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

interface InputParametersCardProps {
  inputs: FootingInputs;
  results: FootingResults;
  onChange: (patch: Partial<FootingInputs>) => void;
  onApplyAutoDimensions: () => void;
}

export const InputParametersCard: React.FC<InputParametersCardProps> = ({
  inputs,
  results,
  onChange,
  onApplyAutoDimensions,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5 transition-all">
      {/* Título de la Tarjeta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#183B2F] text-[#D2E3D8] flex items-center justify-center font-bold">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-[#183B2F] font-heading">
              PARÁMETROS DE DISEÑO Y ENTRADA DE DATOS
            </h2>
            <p className="text-xs text-gray-500">
              Configura los materiales, mecánica de suelos, cargas axiales/momentos y geometría
            </p>
          </div>
        </div>

        {/* Switch Modo Dimensionamiento */}
        <div className="flex items-center bg-[#F7F7F2] p-1 rounded-lg border border-gray-200 shadow-2xs">
          <button
            type="button"
            onClick={onApplyAutoDimensions}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              inputs.dimensionMode === 'auto'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#183B2F]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto Óptimo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              onChange({
                dimensionMode: 'manual',
                manualB: results.b,
                manualL: results.l,
                manualH: results.h,
              });
            }}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
              inputs.dimensionMode === 'manual'
                ? 'bg-[#183B2F] text-white shadow-xs'
                : 'text-gray-600 hover:text-[#183B2F]'
            }`}
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Modo Manual (B x L x h)</span>
          </button>
        </div>
      </div>

      {/* Grid de 4 Secciones - Perfectamente Alineadas y Uniformes */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 mt-4">
        {/* ========================================================
            a) PROPIEDADES DE MATERIALES
           ======================================================== */}
        <div className="p-4 rounded-xl bg-[#F7F7F2]/80 border border-gray-200/90 flex flex-col justify-between h-full shadow-2xs">
          <div className="flex items-center justify-between text-sm font-bold text-[#183B2F] pb-2.5 mb-3.5 border-b border-gray-200 min-h-[38px]">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#1E4838] shrink-0" />
              <span className="font-heading tracking-tight text-xs sm:text-sm">a) Propiedades de Materiales</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0">
              f'c / Fy / r
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* 1. f'c */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Concreto f'c
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Resistencia</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="10"
                  min="140"
                  max="450"
                  value={inputs.fc}
                  onChange={(e) => onChange({ fc: Number(e.target.value) || 210 })}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-14 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">kg/cm²</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Norma: 210 o 280</span>
                <span className="text-[#183B2F] font-semibold">f'c = {inputs.fc}</span>
              </div>
            </div>

            {/* 2. Fy */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Fluencia Acero Fy
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Grado 60</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="100"
                  min="2800"
                  max="5000"
                  value={inputs.fy}
                  onChange={(e) => onChange({ fy: Number(e.target.value) || 4200 })}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-14 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">kg/cm²</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Norma: 4200 kg/cm²</span>
                <span className="text-[#183B2F] font-semibold">Fy = {inputs.fy}</span>
              </div>
            </div>

            {/* 3. Recubrimiento r */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Recubrimiento r
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Contacto suelo</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.5"
                  min="4"
                  max="15"
                  value={inputs.rec}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange({ rec: val === '' ? 0 : Number(val) });
                  }}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">cm</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Normativo: ≥ 7.5 cm</span>
                <span className="text-[#183B2F] font-semibold">r = {inputs.rec} cm</span>
              </div>
            </div>

            {/* 4. Peralte Efectivo d (Indicador resultante alineado) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Peralte Efectivo d
                </label>
                <span className="text-[10px] text-gray-400 font-mono">h - r - db</span>
              </div>
              <div className="h-9 px-2.5 bg-[#D2E3D8]/50 border border-[#A3D1B4] rounded-lg flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#183B2F]">d = {results.d} cm</span>
                <span className="text-[10px] font-bold text-[#183B2F] bg-white px-2 py-0.5 rounded shadow-2xs">
                  h = {results.h} cm
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Brazo mecánico dinámico</span>
                <span className="text-[#183B2F] font-semibold">db = {results.selectedBar.dbCm} cm</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            b) PARÁMETROS DEL SUELO Y CIMENTACIÓN
           ======================================================== */}
        <div className="p-4 rounded-xl bg-[#F7F7F2]/80 border border-gray-200/90 flex flex-col justify-between h-full shadow-2xs">
          <div className="flex items-center justify-between text-sm font-bold text-[#183B2F] pb-2.5 mb-3.5 border-b border-gray-200 min-h-[38px]">
            <div className="flex items-center space-x-2">
              <Mountain className="w-4 h-4 text-[#1E4838] shrink-0" />
              <span className="font-heading tracking-tight text-xs sm:text-sm">b) Parámetros del Suelo</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0">
              EMS / Apoyo
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* 1. qa */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Capacidad Portante qa
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Admisible</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  value={inputs.qa}
                  onChange={(e) => onChange({ qa: Number(e.target.value) || 1.5 })}
                  className="w-full h-9 text-sm font-bold text-[#183B2F] px-2.5 pr-14 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">kg/cm²</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Por Estudio de Suelos</span>
                <span className="text-[#183B2F] font-semibold">qa = {inputs.qa.toFixed(2)}</span>
              </div>
            </div>

            {/* 2. Df */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Prof. Desplante Df
                </label>
                <span className="text-[10px] text-gray-400 font-mono">0.10 - 10.0 m</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="10"
                  value={inputs.df}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val)) {
                      onChange({ df: Math.min(10, Math.max(0.1, Math.round(val * 100) / 100)) });
                    }
                  }}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-8 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">m</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Nivel de apoyo en base</span>
                <span className="text-[#183B2F] font-semibold">{Math.round(inputs.df * 100)} cm (±10cm)</span>
              </div>
            </div>

            {/* 3. γ Suelo */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Peso Esp. Suelo γ
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Densidad</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.05"
                  min="1.4"
                  max="2.4"
                  value={inputs.gammaSuelo}
                  onChange={(e) => onChange({ gammaSuelo: Number(e.target.value) || 1.8 })}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-14 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">Tn/m³</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Relleno / suelo estrato</span>
                <span className="text-[#183B2F] font-semibold">γ = {inputs.gammaSuelo} Tn/m³</span>
              </div>
            </div>

            {/* 4. Sobrecarga s/c */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Sobrecarga Terreno s/c
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Sobre piso</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={inputs.sobrecarga}
                  onChange={(e) => onChange({ sobrecarga: Number(e.target.value) || 0 })}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-14 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-medium pointer-events-none">Tn/m²</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Capacidad neta qn</span>
                <span className="text-[#183B2F] font-semibold">qn = {results.qn.toFixed(2)} kg/cm²</span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            c) CARGAS DE COLUMNA (CYPECAD)
           ======================================================== */}
        <div className="p-4 rounded-xl bg-[#F7F7F2]/80 border border-gray-200/90 flex flex-col justify-between h-full shadow-2xs">
          <div className="flex items-center justify-between text-sm font-bold text-[#183B2F] pb-2.5 mb-3.5 border-b border-gray-200 min-h-[38px]">
            <div className="flex items-center space-x-2">
              <Weight className="w-4 h-4 text-[#1E4838] shrink-0" />
              <span className="font-heading tracking-tight text-xs sm:text-sm">c) Cargas de Columna</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0">
              CypeCAD
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* 1. Carga Axial Normal (N) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Carga Axial Normal (N)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Servicio</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.5"
                  value={inputs.n}
                  onChange={(e) => onChange({ n: Number(e.target.value) || 0 })}
                  className="w-full h-9 text-sm font-bold text-[#183B2F] px-2.5 pr-10 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-semibold pointer-events-none">Tn</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Esfuerzo axial directo</span>
                <span className="text-[#183B2F] font-semibold">N = {results.n.toFixed(2)} Tn</span>
              </div>
            </div>

            {/* 2. Momento flector eje X (Mxx) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Momento flector eje X (Mxx)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Dir. L</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.mxx}
                  onChange={(e) => onChange({ mxx: Number(e.target.value) || 0 })}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-semibold pointer-events-none">Tn·m</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Flexión sobre eje X</span>
                <span className="text-[#183B2F] font-semibold">Mxx = {inputs.mxx.toFixed(2)}</span>
              </div>
            </div>

            {/* 3. Momento flector eje Y (Myy) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Momento flector eje Y (Myy)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Dir. B</span>
              </div>
              <div className="relative flex items-center h-9">
                <input
                  type="number"
                  step="0.1"
                  value={inputs.myy}
                  onChange={(e) => onChange({ myy: Number(e.target.value) || 0 })}
                  className="w-full h-9 text-sm font-semibold px-2.5 pr-12 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                />
                <span className="absolute right-2.5 text-[11px] text-gray-400 font-semibold pointer-events-none">Tn·m</span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Flexión sobre eje Y</span>
                <span className="text-[#183B2F] font-semibold">Myy = {inputs.myy.toFixed(2)}</span>
              </div>
            </div>

            {/* 4. Carga Mayorada Pu / Excentricidad (Indicador resultante alineado) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Carga Mayorada Pu / Excent.
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Combinación</span>
              </div>
              <div className="h-9 px-2.5 bg-[#EEDFA8]/35 border border-[#dfce88] rounded-lg flex items-center justify-between">
                <span className="text-sm font-extrabold text-[#3D3008]">Pu = {results.pu.toFixed(2)} Tn</span>
                <span className="text-[10px] font-bold text-[#3D3008] bg-white px-2 py-0.5 rounded shadow-2xs">
                  e = {results.excentricidad.toFixed(3)} m
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Tercio L/6 = {(results.l / 6).toFixed(3)} m</span>
                <span className={results.excentricidad <= results.l / 6 ? 'text-emerald-700 font-semibold' : 'text-amber-700 font-semibold'}>
                  {results.excentricidad <= results.l / 6 ? 'En Kern' : 'Fuera Kern'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            d) GEOMETRÍA DE COLUMNA Y REFUERZO
           ======================================================== */}
        <div className="p-4 rounded-xl bg-[#F7F7F2]/80 border border-gray-200/90 flex flex-col justify-between h-full shadow-2xs">
          <div className="flex items-center justify-between text-sm font-bold text-[#183B2F] pb-2.5 mb-3.5 border-b border-gray-200 min-h-[38px]">
            <div className="flex items-center space-x-2">
              <Maximize2 className="w-4 h-4 text-[#1E4838] shrink-0" />
              <span className="font-heading tracking-tight text-xs sm:text-sm">d) Columna y Refuerzo</span>
            </div>
            <span className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded border border-gray-200 shrink-0">
              b x t / Acero
            </span>
          </div>

          <div className="space-y-3.5 flex-1 flex flex-col justify-between">
            {/* 1. Sección Columna (b x t) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Sección Columna (b x t)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Dir. B x Dir. L</span>
              </div>
              <div className="grid grid-cols-2 gap-2 h-9">
                <div className="relative flex items-center h-9">
                  <input
                    type="number"
                    step="5"
                    min="15"
                    max="200"
                    value={inputs.bCol}
                    onChange={(e) => onChange({ bCol: Number(e.target.value) || 20 })}
                    className="w-full h-9 text-xs sm:text-sm font-bold text-[#183B2F] px-2.5 pr-7 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                    title="Ancho b (Dir. B)"
                  />
                  <span className="absolute right-2 text-[10px] text-gray-400 font-medium pointer-events-none">b cm</span>
                </div>
                <div className="relative flex items-center h-9">
                  <input
                    type="number"
                    step="5"
                    min="15"
                    max="200"
                    value={inputs.tCol}
                    onChange={(e) => onChange({ tCol: Number(e.target.value) || 20 })}
                    className="w-full h-9 text-xs sm:text-sm font-bold text-[#183B2F] px-2.5 pr-7 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none"
                    title="Largo t (Dir. L)"
                  />
                  <span className="absolute right-2 text-[10px] text-gray-400 font-medium pointer-events-none">t cm</span>
                </div>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Ancho b / Largo t</span>
                <span className="text-[#183B2F] font-semibold">{inputs.bCol} x {inputs.tCol} cm</span>
              </div>
            </div>

            {/* 2. Diámetro Varilla de Columna (db_columna) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Varilla Columna (db_columna)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Espigas / Dowels</span>
              </div>
              <div className="relative flex items-center h-9">
                <select
                  value={
                    inputs.colBarKey ||
                    (inputs.db_columna === 1.2 ? '12mm' :
                     inputs.db_columna === 2.0 ? '20mm' :
                     inputs.db_columna === 2.5 ? '25mm' : '16mm')
                  }
                  onChange={(e) => {
                    const key = e.target.value;
                    const dbVal = key === '12mm' ? 1.2 : key === '20mm' ? 2.0 : key === '25mm' ? 2.5 : 1.6;
                    onChange({
                      colBarKey: key,
                      db_columna: dbVal,
                      dbCol: dbVal,
                    });
                  }}
                  className="w-full h-9 text-xs sm:text-sm font-bold text-[#183B2F] px-2.5 pr-8 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="12mm">Ø 12 mm (db = 1.2 cm)</option>
                  <option value="16mm">Ø 16 mm (db = 1.6 cm)</option>
                  <option value="20mm">Ø 20 mm (db = 2.0 cm)</option>
                  <option value="25mm">Ø 25 mm (db = 2.5 cm)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none" />
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Diámetro de espiga de anclaje</span>
                <span className="text-[#183B2F] font-semibold">
                  db = {inputs.db_columna || inputs.dbCol || 1.6} cm
                </span>
              </div>
            </div>

            {/* 3. Selector de Diámetro de Varilla Zapata */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Varilla Zapata (Métrico)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">Malla inferior</span>
              </div>
              <div className="relative flex items-center h-9">
                <select
                  value={inputs.barKey}
                  onChange={(e) => onChange({ barKey: e.target.value })}
                  className="w-full h-9 text-xs sm:text-sm font-bold text-[#183B2F] px-2.5 pr-8 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1E4838] focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="10mm">Ø 10 mm (db = 1.0 cm)</option>
                  <option value="12mm">Ø 12 mm (db = 1.2 cm)</option>
                  <option value="16mm">Ø 16 mm (db = 1.6 cm)</option>
                  <option value="20mm">Ø 20 mm (db = 2.0 cm)</option>
                  <option value="25mm">Ø 25 mm (db = 2.5 cm)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 pointer-events-none" />
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Área barra: {results.selectedBar.areaCm2.toFixed(2)} cm²</span>
                <span className="text-[#183B2F] font-semibold">{results.selectedBar.key}</span>
              </div>
            </div>

            {/* 4. Anclaje de Columna Ld mín (Campo informativo de solo lectura y validación automática) */}
            <div className="flex flex-col justify-between">
              <div className="flex items-center justify-between mb-1 h-4">
                <label className="text-xs font-semibold text-gray-700 truncate">
                  Anclaje Columna (Ld mín)
                </label>
                <span className="text-[10px] text-gray-400 font-mono">ACI 318 / E.060</span>
              </div>
              <div
                className={`h-9 px-2.5 rounded-lg flex items-center justify-between border ${
                  results.isAnclajeOk
                    ? 'bg-[#D2E3D8]/50 border-[#A3D1B4] text-[#183B2F]'
                    : 'bg-red-50 border-red-300 text-red-700'
                }`}
              >
                <span className="text-sm font-extrabold font-mono">
                  Ld mín = {results.ldMin.toFixed(1)} cm
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded shadow-2xs ${
                    results.isAnclajeOk
                      ? 'bg-white text-emerald-800 border border-[#A3D1B4]'
                      : 'bg-red-100 text-red-800 border border-red-300'
                  }`}
                >
                  {results.isAnclajeOk ? '✓ Cumple' : '✕ Insuficiente'}
                </span>
              </div>
              <div className="flex items-center justify-between mt-1 h-4 text-[10px] text-gray-500 truncate">
                <span>Ld disp = {(results.h - inputs.rec).toFixed(1)} cm (h - r)</span>
                <span className={results.isAnclajeOk ? 'text-[#183B2F] font-semibold' : 'text-red-600 font-semibold'}>
                  {results.isAnclajeOk ? `h ≥ ${results.hMinAnclaje} cm` : `Aumentar h`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          PANEL DE CONTROL DE DIMENSIONES (MANUAL O AUTOMÁTICO)
         ======================================================== */}
      {inputs.dimensionMode === 'manual' ? (
        <div className="mt-4 p-4 bg-[#D2E3D8]/30 rounded-xl border border-[#A3D1B4] space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 pb-2 border-b border-[#A3D1B4]/50">
            <div className="flex items-center space-x-2 text-xs text-[#183B2F]">
              <Info className="w-4 h-4 text-[#1E4838] shrink-0" />
              <div>
                <span className="font-bold">Modo Manual Activado:</span> Define dimensiones geométricas en planta y configuración independiente de acero para Dirección L y B.
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* B */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-700">B:</span>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="10"
                  value={inputs.manualB}
                  onChange={(e) => onChange({ manualB: Number(e.target.value) || 2.0 })}
                  className="w-20 text-xs font-bold px-2 py-1 bg-white border border-gray-300 rounded shadow-2xs"
                />
                <span className="text-xs text-gray-500">m</span>
              </div>

              {/* L */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-700">L:</span>
                <input
                  type="number"
                  step="0.05"
                  min="0.5"
                  max="10"
                  value={inputs.manualL}
                  onChange={(e) => onChange({ manualL: Number(e.target.value) || 2.0 })}
                  className="w-20 text-xs font-bold px-2 py-1 bg-white border border-gray-300 rounded shadow-2xs"
                />
                <span className="text-xs text-gray-500">m</span>
              </div>

              {/* h */}
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-bold text-gray-700">h:</span>
                <input
                  type="number"
                  step="5"
                  min="25"
                  max="200"
                  value={inputs.manualH}
                  onChange={(e) => onChange({ manualH: Number(e.target.value) || 55 })}
                  className="w-20 text-xs font-bold px-2 py-1 bg-white border border-gray-300 rounded shadow-2xs"
                />
                <span className="text-xs text-gray-500">cm</span>
              </div>

              {/* Reset a Auto */}
              <button
                type="button"
                onClick={onApplyAutoDimensions}
                className="text-xs font-semibold px-2.5 py-1 bg-[#183B2F] text-white rounded hover:bg-[#255845] transition-colors cursor-pointer"
              >
                Reajustar a Óptimo
              </button>
            </div>
          </div>

          {/* VERIFICACIÓN ESTRICTA DEL ÁREA (Az >= Areq) */}
          {!results.isAreaOk ? (
            <div className="p-3 bg-red-50 border border-red-300 rounded-lg text-xs text-red-800 flex items-start gap-2.5 animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block text-red-900">
                  ERROR DE DIMENSIONAMIENTO: ÁREA ADOPTADA INSUFICIENTE ($A_z &lt; A_{'{'}req{'}'}$)
                </span>
                <span>
                  El área actual Az = {results.area.toFixed(2)} m² es menor al área mínima requerida por cargas Areq = {results.aReq.toFixed(2)} m². La zapata superará la capacidad portante admisible del suelo. Aumenta las dimensiones B o L.
                </span>
              </div>
            </div>
          ) : (
            <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-800 flex items-center justify-between">
              <span className="font-semibold">
                Área en planta suficiente: Az = {results.area.toFixed(2)} m² ≥ Areq = {results.aReq.toFixed(2)} m² (CONFORME)
              </span>
              <span className="text-[11px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded">
                Peralte d = {results.d} cm
              </span>
            </div>
          )}

          {/* REQUERIMIENTO 3: MODO MANUAL DE ARMADO CON SELECCIÓN INDEPENDIENTE */}
          <div className="pt-2">
            <div className="text-xs font-bold text-[#183B2F] mb-2 flex items-center justify-between">
              <span>Configuración Independiente de Armadura Manual:</span>
              <span className="text-[11px] text-gray-500 font-normal">
                Verificación normativa al pulsar "CALCULAR Y VERIFICAR ZAPATA"
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Dirección L */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Dirección L (Largo)</span>
                  <div className="flex items-center gap-1 bg-[#F7F7F2] p-0.5 rounded border border-gray-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => onChange({ manualDefineByL: 'count' })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.manualDefineByL !== 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      N° Varillas
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ manualDefineByL: 'spacing', manualSpacingL: results.spacingL })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.manualDefineByL === 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      Espaciamiento (s)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Diámetro de Varilla
                    </label>
                    <select
                      value={inputs.manualBarKeyL || inputs.barKey}
                      onChange={(e) => onChange({ manualBarKeyL: e.target.value })}
                      className="w-full text-xs font-bold text-[#183B2F] p-1.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-[#183B2F]"
                    >
                      <option value="10mm">Ø 10 mm (0.79 cm²)</option>
                      <option value="12mm">Ø 12 mm (1.13 cm²)</option>
                      <option value="16mm">Ø 16 mm (2.01 cm²)</option>
                      <option value="20mm">Ø 20 mm (3.14 cm²)</option>
                      <option value="25mm">Ø 25 mm (4.91 cm²)</option>
                    </select>
                  </div>
                  <div>
                    {inputs.manualDefineByL === 'spacing' ? (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Espaciamiento s (cm)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="7"
                          max="40"
                          value={inputs.manualSpacingL || results.spacingL}
                          onChange={(e) => onChange({ manualSpacingL: Math.max(7, Number(e.target.value) || 15) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Cantidad de Varillas
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="60"
                          value={inputs.manualNBarsL || 9}
                          onChange={(e) => onChange({ manualNBarsL: Math.max(2, Number(e.target.value) || 2) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 bg-[#F7F7F2] p-1.5 rounded">
                  <span>Espaciamiento: <strong>@ {results.spacingL} cm</strong> ({results.nBarsL} varillas)</span>
                  <span>As colocado: <strong>{results.asProvidedL.toFixed(2)} cm²</strong></span>
                </div>
              </div>

              {/* Dirección B */}
              <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800">Dirección B (Ancho)</span>
                  <div className="flex items-center gap-1 bg-[#F7F7F2] p-0.5 rounded border border-gray-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => onChange({ manualDefineByB: 'count' })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.manualDefineByB !== 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      N° Varillas
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ manualDefineByB: 'spacing', manualSpacingB: results.spacingB })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.manualDefineByB === 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      Espaciamiento (s)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Diámetro de Varilla
                    </label>
                    <select
                      value={inputs.manualBarKeyB || inputs.barKey}
                      onChange={(e) => onChange({ manualBarKeyB: e.target.value })}
                      className="w-full text-xs font-bold text-[#183B2F] p-1.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-[#183B2F]"
                    >
                      <option value="10mm">Ø 10 mm (0.79 cm²)</option>
                      <option value="12mm">Ø 12 mm (1.13 cm²)</option>
                      <option value="16mm">Ø 16 mm (2.01 cm²)</option>
                      <option value="20mm">Ø 20 mm (3.14 cm²)</option>
                      <option value="25mm">Ø 25 mm (4.91 cm²)</option>
                    </select>
                  </div>
                  <div>
                    {inputs.manualDefineByB === 'spacing' ? (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Espaciamiento s (cm)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="7"
                          max="40"
                          value={inputs.manualSpacingB || results.spacingB}
                          onChange={(e) => onChange({ manualSpacingB: Math.max(7, Number(e.target.value) || 15) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Cantidad de Varillas
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="60"
                          value={inputs.manualNBarsB || 9}
                          onChange={(e) => onChange({ manualNBarsB: Math.max(2, Number(e.target.value) || 2) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    )}
                  </div>
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500 bg-[#F7F7F2] p-1.5 rounded">
                  <span>Espaciamiento: <strong>@ {results.spacingB} cm</strong> ({results.nBarsB} varillas)</span>
                  <span>As colocado: <strong>{results.asProvidedB.toFixed(2)} cm²</strong></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 p-3.5 bg-[#D2E3D8]/25 rounded-xl border border-[#A3D1B4] flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-[#183B2F] gap-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#1E4838] shrink-0" />
            <div>
              <span className="font-bold">Modo Auto Óptimo Activo:</span>{' '}
              <span>
                Dimensiones calculadas automáticamente por capacidad neta (qn = {results.qn.toFixed(2)} kg/cm²) y área requerida (Az_req = {results.aReq.toFixed(2)} m²):{' '}
                <strong className="font-mono text-[#183B2F]">
                  B = {results.b.toFixed(2)} m &times; L = {results.l.toFixed(2)} m | h = {results.h} cm
                </strong>{' '}
                (Peralte d = {results.d} cm, Az = {results.area.toFixed(2)} m²).
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              onChange({
                dimensionMode: 'manual',
                manualB: results.b,
                manualL: results.l,
                manualH: results.h,
              });
            }}
            className="text-xs font-semibold px-3 py-1.5 bg-white border border-[#A3D1B4] text-[#183B2F] hover:bg-gray-50 rounded-lg shadow-2xs transition-colors shrink-0 cursor-pointer"
          >
            Liberar a Modo Manual
          </button>
        </div>
      )}

      {/* ========================================================
          CONFIGURACIÓN AUTOMATIZADA DE PARRILLA SUPERIOR (KERN)
          Se oculta y desactiva automáticamente si e <= L/6
         ======================================================== */}
      {results.isOutOfKern && (
        <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50/50 p-4 shadow-xs transition-all animate-fadeIn">
          {/* Encabezado del bloque de Parrilla Superior */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 pb-2.5 border-b border-amber-200">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-amber-600 text-white shadow-xs">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm text-[#183B2F]">
                    Parrilla Superior Obligatoria (Refuerzo por Tracción y Despegue)
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 animate-pulse">
                    ⚠️ Fuera del Kern (e &gt; L/6)
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-0.5">
                  Excentricidad excesiva (e = {results.excentricidadL.toFixed(3)} m &gt; L/6 = {results.eKernL.toFixed(3)} m). Se produce despegue de la base y momentos negativos: Se activa el cálculo formal de armadura superior.
                </p>
              </div>
            </div>

            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300 shrink-0 self-start sm:self-auto">
              Activa por Excentricidad
            </span>
          </div>

          {/* Sección de configuración de Parrilla Superior con As mín normativo */}
          <div className="pt-3 space-y-3">
            <div className="text-xs font-bold text-[#183B2F] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <span>Definición de Refuerzo Superior en Ambas Direcciones:</span>
              <span className="text-[11px] text-gray-600 font-medium">
                Cuantía mínima normativa ACI/NTE: <strong>As_mín = 0.0018 &middot; b &middot; h</strong> ({results.topAsMinPerMeter.toFixed(2)} cm²/m)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Dirección L Superior */}
              <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#C97A3E]"></span>
                    Parrilla Superior Dir. L (Largo)
                  </span>
                  <div className="flex items-center gap-1 bg-[#F7F7F2] p-0.5 rounded border border-gray-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => onChange({ topDefineByL: 'count' })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.topDefineByL !== 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      N° Varillas
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ topDefineByL: 'spacing', topSpacingL: results.topSpacingL })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.topDefineByL === 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      Espaciamiento (s)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Diámetro de Varilla
                    </label>
                    <select
                      value={inputs.topBarKeyL || '12mm'}
                      onChange={(e) => onChange({ topBarKeyL: e.target.value })}
                      className="w-full text-xs font-bold text-[#183B2F] p-1.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-[#183B2F]"
                    >
                      <option value="10mm">Ø 10 mm (0.79 cm²)</option>
                      <option value="12mm">Ø 12 mm (1.13 cm²)</option>
                      <option value="16mm">Ø 16 mm (2.01 cm²)</option>
                      <option value="20mm">Ø 20 mm (3.14 cm²)</option>
                      <option value="25mm">Ø 25 mm (4.91 cm²)</option>
                    </select>
                  </div>
                  <div>
                    {inputs.topDefineByL === 'spacing' ? (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Espaciamiento s (cm)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="7"
                          max="40"
                          value={inputs.topSpacingL || results.topSpacingL}
                          onChange={(e) => onChange({ topSpacingL: Math.max(7, Number(e.target.value) || 20) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Cantidad de Varillas
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="60"
                          value={inputs.topNBarsL || results.topNBarsL}
                          onChange={(e) => onChange({ topNBarsL: Math.max(2, Number(e.target.value) || 2) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Cálculo formal de As mín vs As provisto */}
                <div className="mt-2.5 p-2 bg-[#F7F7F2] rounded border border-gray-200 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      As mín. superior (0.0018&middot;B&middot;h):
                    </span>
                    <strong className="font-mono text-gray-800">
                      {results.topAsMinL.toFixed(2)} cm²
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">As colocado superior:</span>
                    <strong className="font-mono text-[#183B2F]">
                      {results.topAsProvidedL.toFixed(2)} cm²
                    </strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-500">
                      Espaciamiento: <strong>@ {results.topSpacingL} cm</strong> ({results.topNBarsL} varillas)
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        results.isTopSteelOkL
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {results.isTopSteelOkL ? '✓ As Conforme' : '⚠️ As Insuficiente'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Dirección B Superior */}
              <div className="bg-white p-3 rounded-lg border border-amber-200 shadow-2xs">
                <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-gray-100">
                  <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#1E4838]"></span>
                    Parrilla Superior Dir. B (Ancho)
                  </span>
                  <div className="flex items-center gap-1 bg-[#F7F7F2] p-0.5 rounded border border-gray-200 text-[10px]">
                    <button
                      type="button"
                      onClick={() => onChange({ topDefineByB: 'count' })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.topDefineByB !== 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      N° Varillas
                    </button>
                    <button
                      type="button"
                      onClick={() => onChange({ topDefineByB: 'spacing', topSpacingB: results.topSpacingB })}
                      className={`px-1.5 py-0.5 rounded font-semibold cursor-pointer ${
                        inputs.topDefineByB === 'spacing' ? 'bg-[#183B2F] text-white' : 'text-gray-600'
                      }`}
                    >
                      Espaciamiento (s)
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-medium text-gray-600 mb-1">
                      Diámetro de Varilla
                    </label>
                    <select
                      value={inputs.topBarKeyB || '12mm'}
                      onChange={(e) => onChange({ topBarKeyB: e.target.value })}
                      className="w-full text-xs font-bold text-[#183B2F] p-1.5 bg-white border border-gray-300 rounded-md focus:ring-1 focus:ring-[#183B2F]"
                    >
                      <option value="10mm">Ø 10 mm (0.79 cm²)</option>
                      <option value="12mm">Ø 12 mm (1.13 cm²)</option>
                      <option value="16mm">Ø 16 mm (2.01 cm²)</option>
                      <option value="20mm">Ø 20 mm (3.14 cm²)</option>
                      <option value="25mm">Ø 25 mm (4.91 cm²)</option>
                    </select>
                  </div>
                  <div>
                    {inputs.topDefineByB === 'spacing' ? (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Espaciamiento s (cm)
                        </label>
                        <input
                          type="number"
                          step="1"
                          min="7"
                          max="40"
                          value={inputs.topSpacingB || results.topSpacingB}
                          onChange={(e) => onChange({ topSpacingB: Math.max(7, Number(e.target.value) || 20) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    ) : (
                      <>
                        <label className="block text-[11px] font-medium text-gray-600 mb-1">
                          Cantidad de Varillas
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="60"
                          value={inputs.topNBarsB || results.topNBarsB}
                          onChange={(e) => onChange({ topNBarsB: Math.max(2, Number(e.target.value) || 2) })}
                          className="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded-md text-center focus:ring-1 focus:ring-[#183B2F]"
                        />
                      </>
                    )}
                  </div>
                </div>

                {/* Cálculo formal de As mín vs As provisto */}
                <div className="mt-2.5 p-2 bg-[#F7F7F2] rounded border border-gray-200 text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">
                      As mín. superior (0.0018&middot;L&middot;h):
                    </span>
                    <strong className="font-mono text-gray-800">
                      {results.topAsMinB.toFixed(2)} cm²
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">As colocado superior:</span>
                    <strong className="font-mono text-[#183B2F]">
                      {results.topAsProvidedB.toFixed(2)} cm²
                    </strong>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                    <span className="text-gray-500">
                      Espaciamiento: <strong>@ {results.topSpacingB} cm</strong> ({results.topNBarsB} varillas)
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        results.isTopSteelOkB
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {results.isTopSteelOkB ? '✓ As Conforme' : '⚠️ As Insuficiente'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
