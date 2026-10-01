import React, { useState } from 'react';
import { FootingInputs, FootingResults } from '../types/footing';
import { SoilPressureDistributionChart } from './SoilPressureDistributionChart';
import {
  Calculator,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Activity,
  Compass,
  Layers,
  ArrowRight,
  FileSpreadsheet
} from 'lucide-react';

interface ResultsPanelProps {
  inputs: FootingInputs;
  results: FootingResults;
  onRecalculate: () => void;
  onOpenReportModal: () => void;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  inputs,
  results,
  onRecalculate,
  onOpenReportModal,
}) => {
  const [activeStep, setActiveStep] = useState<number | 'all'>('all');
  const [calculatedPulse, setCalculatedPulse] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);

  const handleCalculateClick = () => {
    setHasCalculated(true);
    onRecalculate();
    setCalculatedPulse(true);
    setTimeout(() => setCalculatedPulse(false), 800);
  };

  const toggleStep = (step: number) => {
    if (activeStep === step) {
      setActiveStep('all');
    } else {
      setActiveStep(step);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5 transition-all">
      {/* Botón de Acción Principal y Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-base sm:text-lg font-bold text-[#183B2F] font-heading">
              RESULTADOS Y MEMORIA DE CÁLCULO NORMATIVA
            </h2>
            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#D2E3D8] text-[#183B2F]">
              Paso a Paso
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Comprobación detallada según especificaciones de la plantilla de cálculo estructural
          </p>
        </div>

        {/* BOTÓN DESTACADO DE CÁLCULO (Amarillo Dorado Suave #EEDFA8) */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCalculateClick}
            className={`flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm text-[#3D3008] bg-[#EEDFA8] hover:bg-[#e6d494] shadow-sm hover:shadow transition-all active:scale-95 cursor-pointer border border-[#dfce88] ${
              calculatedPulse ? 'ring-4 ring-[#D2E3D8] scale-102' : ''
            }`}
          >
            <Calculator className={`w-4 h-4 text-[#3D3008] ${calculatedPulse ? 'animate-spin' : ''}`} />
            <span>CALCULAR Y VERIFICAR ZAPATA</span>
          </button>
        </div>
      </div>

      {!hasCalculated ? (
        /* Estado previo al cálculo */
        <div className="my-6 p-8 rounded-xl bg-[#F7F7F2] border border-dashed border-gray-300 text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-[#EEDFA8] text-[#3D3008] flex items-center justify-center mb-3 shadow-xs">
            <Calculator className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#183B2F] font-heading mb-1">
            Resultados pendientes de cálculo
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto mb-4">
            Presione el botón <strong className="text-[#183B2F]">"CALCULAR Y VERIFICAR ZAPATA"</strong> para obtener las dimensiones, espesor y peralte, armadura en L y armadura en B, junto con las verificaciones geotécnicas y estructurales completas.
          </p>
          <button
            type="button"
            onClick={handleCalculateClick}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl font-bold text-sm text-[#3D3008] bg-[#EEDFA8] hover:bg-[#e6d494] shadow-sm transition-all active:scale-95 cursor-pointer border border-[#dfce88]"
          >
            <Calculator className="w-4 h-4 text-[#3D3008]" />
            <span>CALCULAR Y VERIFICAR ZAPATA</span>
          </button>
        </div>
      ) : (
        <>
          {/* CUADROS PRINCIPALES DE GEOMETRÍA Y ARMADURAS DEBAJO DEL BOTÓN */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
            {/* 1. Dimensiones Planta */}
            <div className={`p-3.5 rounded-xl text-center shadow-xs transition-all ${
              !results.isAreaOk ? 'bg-red-50 border-2 border-red-500' : 'bg-[#F7F7F2] border border-gray-200'
            }`}>
              <span className="text-gray-500 block text-xs font-semibold">Dimensiones Planta</span>
              <span className={`font-extrabold text-base sm:text-lg block mt-1 ${
                !results.isAreaOk ? 'text-red-700' : 'text-[#183B2F]'
              }`}>
                {results.b.toFixed(2)} x {results.l.toFixed(2)} m
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">
                Az = {results.area.toFixed(2)} m² (Req: {results.aReq.toFixed(2)} m²)
              </span>
              {!results.isAreaOk ? (
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded bg-red-600 text-white animate-pulse">
                  NO CUMPLE (Az &lt; Areq)
                </span>
              ) : (
                <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D2E3D8] text-[#183B2F]">
                  OK (Az ≥ Areq)
                </span>
              )}
            </div>

            {/* 2. Espesor y Peralte */}
            <div className="bg-[#F7F7F2] border border-gray-200 p-3.5 rounded-xl text-center shadow-xs">
              <span className="text-gray-500 block text-xs font-semibold">Espesor y Peralte</span>
              <span className="font-extrabold text-[#183B2F] text-base sm:text-lg block mt-1">
                h = {results.h} cm | d = {results.d} cm
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">
                Recubrimiento r = {inputs.rec} cm
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D2E3D8] text-[#183B2F]">
                d = h - r - db
              </span>
            </div>

            {/* 3. Armadura en L */}
            <div className={`p-3.5 rounded-xl text-center shadow-xs transition-all ${
              !results.isSteelOkL ? 'bg-amber-50 border-2 border-amber-400' : 'bg-[#F7F7F2] border border-gray-200'
            }`}>
              <span className="text-gray-500 block text-xs font-semibold">Armadura en L</span>
              <span className="font-extrabold text-[#183B2F] text-base sm:text-lg block mt-1">
                {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">
                As: {results.asProvidedL.toFixed(2)} cm² / Req: {results.asTotalL.toFixed(2)} cm²
              </span>
              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${
                results.isSteelOkL ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-amber-500 text-white'
              }`}>
                {results.isSteelOkL ? 'As CONFORME' : 'As INSUFICIENTE'}
              </span>
            </div>

            {/* 4. Armadura en B */}
            <div className={`p-3.5 rounded-xl text-center shadow-xs transition-all ${
              !results.isSteelOkB ? 'bg-amber-50 border-2 border-amber-400' : 'bg-[#F7F7F2] border border-gray-200'
            }`}>
              <span className="text-gray-500 block text-xs font-semibold">Armadura en B</span>
              <span className="font-extrabold text-[#183B2F] text-base sm:text-lg block mt-1">
                {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
              </span>
              <span className="text-[11px] text-gray-500 block mt-0.5 font-medium">
                As: {results.asProvidedB.toFixed(2)} cm² / Req: {results.asTotalB.toFixed(2)} cm²
              </span>
              <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold rounded ${
                results.isSteelOkB ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-amber-500 text-white'
              }`}>
                {results.isSteelOkB ? 'As CONFORME' : 'As INSUFICIENTE'}
              </span>
            </div>
          </div>

          {/* ========================================================
              RESUMEN EJECUTIVO (4 TARJETAS KPI DE VERIFICACIÓN)
             ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 my-4">
        {/* KPI 1: Presión sobre el Suelo */}
        <div className="p-3.5 rounded-xl border bg-[#F7F7F2]/80 border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span className="font-semibold flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-[#183B2F]" />
              Presión en Suelo
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                results.isSoilOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-100 text-red-700'
              }`}
            >
              {results.isSoilOk ? 'OK' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-[#183B2F]">
              {results.qMax.toFixed(2)}
            </span>
            <span className="text-xs text-gray-500">/ {inputs.qa.toFixed(2)} kg/cm²</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                results.qMaxRatio <= 1.0 ? 'bg-[#183B2F]' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(results.qMaxRatio * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            Utilización: {(results.qMaxRatio * 100).toFixed(1)}%
          </span>
        </div>

        {/* KPI 2: Cortante por Flexión (1 Vía) */}
        <div className="p-3.5 rounded-xl border bg-[#F7F7F2]/80 border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span className="font-semibold flex items-center gap-1">
              <Activity className="w-3.5 h-3.5 text-[#183B2F]" />
              Cortante a dist. 'd'
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                results.isFlexShearOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-100 text-red-700'
              }`}
            >
              {results.isFlexShearOk ? 'CONFORME' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-[#183B2F]">
              {results.vuFlex.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">/ ØVc {results.phiVcFlex.toFixed(1)} Tn</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                results.flexShearRatio <= 1.0 ? 'bg-[#183B2F]' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(results.flexShearRatio * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            Ratio Vu/ØVc: {(results.flexShearRatio * 100).toFixed(1)}%
          </span>
        </div>

        {/* KPI 3: Punzonamiento (2 Vías) */}
        <div className="p-3.5 rounded-xl border bg-[#F7F7F2]/80 border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span className="font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#183B2F]" />
              Punzonamiento
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                results.isPunzShearOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-100 text-red-700'
              }`}
            >
              {results.isPunzShearOk ? 'CONFORME' : 'NO CUMPLE'}
            </span>
          </div>
          <div className="flex items-baseline space-x-1">
            <span className="text-xl font-extrabold text-[#183B2F]">
              {results.vuPunz.toFixed(1)}
            </span>
            <span className="text-xs text-gray-500">/ ØVc {results.phiVcPunz.toFixed(1)} Tn</span>
          </div>
          <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                results.punzShearRatio <= 1.0 ? 'bg-[#183B2F]' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(results.punzShearRatio * 100, 100)}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500 mt-1 block">
            Ratio Vu/ØVc: {(results.punzShearRatio * 100).toFixed(1)}%
          </span>
        </div>

        {/* KPI 4: Acero de Refuerzo */}
        <div className="p-3.5 rounded-xl border bg-[#F7F7F2]/80 border-gray-200 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1.5">
            <span className="font-semibold flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-[#183B2F]" />
              Armadura Zapata
            </span>
            <span
              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                results.isSteelOkL && results.isSteelOkB && results.isSpacingOk
                  ? 'bg-[#D2E3D8] text-[#183B2F]'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {results.isSteelOkL && results.isSteelOkB && results.isSpacingOk ? 'OK' : 'VERIFICAR'}
            </span>
          </div>

          {/* Dos bloques independientes para Dirección L y Dirección B */}
          <div className="space-y-1.5">
            {/* Dirección L */}
            <div className="flex items-center justify-between text-xs bg-white/90 px-2.5 py-1 rounded border border-gray-200/80">
              <span className="font-bold text-[#183B2F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#C97A3E]"></span>
                Dir. L:
              </span>
              <span className="font-mono font-extrabold text-[#183B2F] text-[11px] sm:text-xs">
                {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
              </span>
            </div>

            {/* Dirección B */}
            <div className="flex items-center justify-between text-xs bg-white/90 px-2.5 py-1 rounded border border-gray-200/80">
              <span className="font-bold text-[#183B2F] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#1E4838]"></span>
                Dir. B:
              </span>
              <span className="font-mono font-extrabold text-[#183B2F] text-[11px] sm:text-xs">
                {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-gray-500 mt-2 pt-1 border-t border-gray-200/60">
            <span>As: {results.asProvidedL.toFixed(1)} / {results.asProvidedB.toFixed(1)} cm²</span>
            <span>S ≤ {results.maxSpacing} cm</span>
          </div>
        </div>
      </div>

      {/* ========================================================
          DETALLE PASO A PASO EN TABLAS ESTILIZADAS
         ======================================================== */}
      <div className="space-y-4 mt-6">
        {/* PASO 1: DIMENSIONAMIENTO EN PLANTA */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleStep(1)}
            className="w-full bg-[#F7F7F2] px-4 py-3 text-left font-bold text-sm text-[#183B2F] flex items-center justify-between hover:bg-[#ecece5] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#183B2F] text-[#D2E3D8] text-xs flex items-center justify-center font-extrabold">
                1
              </span>
              <span>1. Dimensionamiento en Planta y Peralte (B, L, h, d, Az)</span>
            </div>
            {activeStep === 1 || activeStep === 'all' ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {(activeStep === 1 || activeStep === 'all') && (
            <div className="p-4 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium bg-gray-50">
                    <th className="p-2.5">Parámetro</th>
                    <th className="p-2.5">Fórmula / Referencia</th>
                    <th className="p-2.5">Valor de Cálculo</th>
                    <th className="p-2.5">Unidad</th>
                    <th className="p-2.5">Estado / Criterio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Carga de Servicio (Ps)</td>
                    <td className="p-2.5 font-mono text-gray-500">Ps = Pcm + Pcv</td>
                    <td className="p-2.5 font-bold">{results.ps.toFixed(2)}</td>
                    <td className="p-2.5">Tn</td>
                    <td className="p-2.5 text-gray-600">Servicio para suelo</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Capacidad Neta (qn)</td>
                    <td className="p-2.5 font-mono text-gray-500">qn = qa - (Df*γprom + s/c)/10</td>
                    <td className="p-2.5 font-bold">{results.qn.toFixed(3)}</td>
                    <td className="p-2.5">kg/cm²</td>
                    <td className="p-2.5 text-gray-600">Descontando sobrecarga</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Área Requerida (Az_req)</td>
                    <td className="p-2.5 font-mono text-gray-500">A = Ps / (qn * 10)</td>
                    <td className="p-2.5 font-bold">{results.aReq.toFixed(2)}</td>
                    <td className="p-2.5">m²</td>
                    <td className="p-2.5 text-gray-600">Superficie mínima</td>
                  </tr>
                  <tr className={!results.isAreaOk ? 'bg-red-50' : 'bg-[#D2E3D8]/20'}>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Dimensiones en Planta Adoptadas</td>
                    <td className="p-2.5 font-mono text-gray-500">B = {results.b.toFixed(2)} m, L = {results.l.toFixed(2)} m</td>
                    <td className="p-2.5 font-bold text-[#183B2F]">{results.area.toFixed(2)} (B x L)</td>
                    <td className="p-2.5">m²</td>
                    <td className={`p-2.5 font-bold ${!results.isAreaOk ? 'text-red-700' : 'text-emerald-800'}`}>
                      {!results.isAreaOk
                        ? `NO CUMPLE: Az (${results.area.toFixed(2)} m²) < A_req (${results.aReq.toFixed(2)} m²)`
                        : `Az (${results.area.toFixed(2)} m²) ≥ A_req (${results.aReq.toFixed(2)} m²) OK`}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Altura h y Peralte d</td>
                    <td className="p-2.5 font-mono text-gray-500">d = h - r - db ({results.h} - {inputs.rec} - {results.selectedBar.dbCm.toFixed(2)})</td>
                    <td className="p-2.5 font-bold">h = {results.h}, d = {results.d}</td>
                    <td className="p-2.5">cm</td>
                    <td className="p-2.5 text-gray-600">Recubrimiento r={inputs.rec} cm | Ld={results.ldMin.toFixed(1)} cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PASO 2: VERIFICACIÓN DE PRESIÓN SOBRE SUELO */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleStep(2)}
            className="w-full bg-[#F7F7F2] px-4 py-3 text-left font-bold text-sm text-[#183B2F] flex items-center justify-between hover:bg-[#ecece5] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#183B2F] text-[#D2E3D8] text-xs flex items-center justify-center font-extrabold">
                2
              </span>
              <span>2. Verificación de Presión sobre Suelo (q_max ≤ qa)</span>
            </div>
            {activeStep === 2 || activeStep === 'all' ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {(activeStep === 2 || activeStep === 'all') && (
            <div className="p-4 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium bg-gray-50">
                    <th className="p-2.5">Comprobación</th>
                    <th className="p-2.5">Fórmula Normativa</th>
                    <th className="p-2.5">Presión Calculada</th>
                    <th className="p-2.5">Límite Admisible</th>
                    <th className="p-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Presión Máxima (q_max)</td>
                    <td className="p-2.5 font-mono text-gray-500">q = (Ps/Az) + (Ms*(L/2)/Iz)</td>
                    <td className="p-2.5 font-bold text-sm text-[#183B2F]">{results.qMax.toFixed(2)} kg/cm²</td>
                    <td className="p-2.5 font-semibold">qa = {inputs.qa.toFixed(2)} kg/cm²</td>
                    <td className="p-2.5">
                      {results.isSoilOk ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CONFORME (q_max ≤ qa)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> NO CUMPLE (Sobreesfuerzo)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Presión Mínima (q_min)</td>
                    <td className="p-2.5 font-mono text-gray-500">q = (Ps/Az) - (Ms*(L/2)/Iz)</td>
                    <td className="p-2.5 font-bold">{results.qMin.toFixed(2)} kg/cm²</td>
                    <td className="p-2.5 font-semibold">≥ 0.00 (Sin tracciones)</td>
                    <td className="p-2.5 text-gray-600">
                      {results.qMin >= 0 ? 'Compresión total en la base' : 'Zona con levantamiento parcial'}
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Excentricidad de la Carga (e)</td>
                    <td className="p-2.5 font-mono text-gray-500">e = Ms / Ps</td>
                    <td className="p-2.5 font-bold">{results.excentricidad.toFixed(3)} m</td>
                    <td className="p-2.5 font-semibold">L/6 = {(results.l / 6).toFixed(3)} m</td>
                    <td className="p-2.5 text-gray-600">
                      {results.excentricidad <= results.l / 6 ? 'Dentro del tercio central (Kern)' : 'Fuera del tercio central'}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Gráfico interactivo integrado de presiones con Recharts */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <SoilPressureDistributionChart
                  inputs={inputs}
                  results={results}
                  isEmbedded={true}
                />
              </div>
            </div>
          )}
        </div>

        {/* PASO 3: VERIFICACIÓN DE CORTANTE POR FLEXIÓN (1 VÍA) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleStep(3)}
            className="w-full bg-[#F7F7F2] px-4 py-3 text-left font-bold text-sm text-[#183B2F] flex items-center justify-between hover:bg-[#ecece5] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#183B2F] text-[#D2E3D8] text-xs flex items-center justify-center font-extrabold">
                3
              </span>
              <span>3. Verificación de Cortante por Flexión a distancia 'd' (Vu ≤ ØVc)</span>
            </div>
            {activeStep === 3 || activeStep === 'all' ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {(activeStep === 3 || activeStep === 'all') && (
            <div className="p-4 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium bg-gray-50">
                    <th className="p-2.5">Variable</th>
                    <th className="p-2.5">Ecuación</th>
                    <th className="p-2.5">Actuante (Vu)</th>
                    <th className="p-2.5">Resistencia de Diseño (ØVc)</th>
                    <th className="p-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Presión Última de Contacto (qu)</td>
                    <td className="p-2.5 font-mono text-gray-500">qu = Pu / (B * L)</td>
                    <td className="p-2.5 font-bold" colSpan={2}>{results.qu.toFixed(2)} Tn/m² (Pu = {results.pu.toFixed(2)} Tn)</td>
                    <td className="p-2.5 text-gray-500">Carga mayorada</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Volado y Distancia Crítica</td>
                    <td className="p-2.5 font-mono text-gray-500">Lv = (L-t)/2, X_crit = Lv - d</td>
                    <td className="p-2.5 font-bold" colSpan={2}>
                      Lv = {results.lvL.toFixed(2)} m | X_crit = {results.critDistance.toFixed(2)} m
                    </td>
                    <td className="p-2.5 text-gray-500">A distancia 'd' de cara</td>
                  </tr>
                  <tr className="bg-[#D2E3D8]/20">
                    <td className="p-2.5 font-semibold text-[#183B2F]">Cortante a distancia d</td>
                    <td className="p-2.5 font-mono text-gray-500">ØVc = 0.85*0.53*√f'c*b*d / 1000</td>
                    <td className="p-2.5 font-extrabold text-[#183B2F] text-sm">Vu = {results.vuFlex.toFixed(2)} Tn</td>
                    <td className="p-2.5 font-extrabold text-[#183B2F] text-sm">ØVc = {results.phiVcFlex.toFixed(2)} Tn</td>
                    <td className="p-2.5">
                      {results.isFlexShearOk ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CONFORME (Vu ≤ ØVc)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> NO CUMPLE (Aumentar h)
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PASO 4: VERIFICACIÓN DE PUNZONAMIENTO (2 VÍAS) */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleStep(4)}
            className="w-full bg-[#F7F7F2] px-4 py-3 text-left font-bold text-sm text-[#183B2F] flex items-center justify-between hover:bg-[#ecece5] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#183B2F] text-[#D2E3D8] text-xs flex items-center justify-center font-extrabold">
                4
              </span>
              <span>4. Verificación de Punzonamiento en Dos Vías (Vu_punz ≤ ØVc_punz)</span>
            </div>
            {activeStep === 4 || activeStep === 'all' ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {(activeStep === 4 || activeStep === 'all') && (
            <div className="p-4 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium bg-gray-50">
                    <th className="p-2.5">Parámetro</th>
                    <th className="p-2.5">Fórmula de Cálculo</th>
                    <th className="p-2.5">Actuante</th>
                    <th className="p-2.5">Capaz (Diseño)</th>
                    <th className="p-2.5">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-2.5 font-semibold text-[#183B2F]">Perímetro y Área Crítica (bo, Ap)</td>
                    <td className="p-2.5 font-mono text-gray-500">bo = 2*(b+d) + 2*(t+d)</td>
                    <td className="p-2.5 font-bold" colSpan={2}>
                      bo = {results.bo} cm | Ap = {results.ap.toFixed(3)} m²
                    </td>
                    <td className="p-2.5 text-gray-500">A distancia d/2</td>
                  </tr>
                  <tr className="bg-[#D2E3D8]/20">
                    <td className="p-2.5 font-semibold text-[#183B2F]">Resistencia a Punzonamiento</td>
                    <td className="p-2.5 font-mono text-gray-500">ØVc = 0.85*(0.53 + 1.1/β)*√f'c*bo*d</td>
                    <td className="p-2.5 font-extrabold text-[#183B2F] text-sm">Vu = {results.vuPunz.toFixed(2)} Tn</td>
                    <td className="p-2.5 font-extrabold text-[#183B2F] text-sm">ØVc = {results.phiVcPunz.toFixed(2)} Tn</td>
                    <td className="p-2.5">
                      {results.isPunzShearOk ? (
                        <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CONFORME (Vu ≤ ØVc)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 font-bold text-red-700 bg-red-50 px-2 py-0.5 rounded">
                          <XCircle className="w-3.5 h-3.5" /> NO CUMPLE (Aumentar h)
                        </span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* PASO 5: DISEÑO A FLEXIÓN Y ACERO */}
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleStep(5)}
            className="w-full bg-[#F7F7F2] px-4 py-3 text-left font-bold text-sm text-[#183B2F] flex items-center justify-between hover:bg-[#ecece5] transition-colors"
          >
            <div className="flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-[#183B2F] text-[#D2E3D8] text-xs flex items-center justify-center font-extrabold">
                5
              </span>
              <span>5. Diseño a Flexión y Refuerzo de Acero (Mu, As_mínimo, As_req, N°, S)</span>
            </div>
            {activeStep === 5 || activeStep === 'all' ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>

          {(activeStep === 5 || activeStep === 'all') && (
            <div className="p-4 bg-white overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500 font-medium bg-gray-50">
                    <th className="p-2.5">Dirección</th>
                    <th className="p-2.5">Momento Mu (Tn.m)</th>
                    <th className="p-2.5">As Mínimo (cm²)</th>
                    <th className="p-2.5">As Requerido (cm²)</th>
                    <th className="p-2.5">Varillas Asignadas</th>
                    <th className="p-2.5">Espaciamiento S</th>
                    <th className="p-2.5">Verificación S ≤ S_max</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr className="bg-white">
                    <td className="p-2.5 font-bold text-[#183B2F] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C97A3E]"></span>
                      Dirección L (Longitudinal)
                    </td>
                    <td className="p-2.5 font-semibold">{results.muL.toFixed(2)}</td>
                    <td className="p-2.5">{(results.asMinPerMeter * results.b).toFixed(2)}</td>
                    <td className="p-2.5 font-bold text-[#183B2F]">{results.asTotalL.toFixed(2)}</td>
                    <td className="p-2.5 font-bold text-[#183B2F]">
                      {results.nBarsL} {results.selectedBarL.label}
                    </td>
                    <td className="p-2.5 font-bold text-sm text-[#183B2F]">@ {results.spacingL} cm</td>
                    <td className="p-2.5">
                      {results.spacingL <= results.maxSpacing ? (
                        <span className="font-semibold text-emerald-700">S ≤ {results.maxSpacing} cm OK</span>
                      ) : (
                        <span className="font-semibold text-amber-700">Excede S_max ({results.maxSpacing} cm)</span>
                      )}
                    </td>
                  </tr>
                  <tr className="bg-gray-50/60">
                    <td className="p-2.5 font-bold text-[#183B2F] flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#1E4838]"></span>
                      Dirección B (Transversal)
                    </td>
                    <td className="p-2.5 font-semibold">{results.muB.toFixed(2)}</td>
                    <td className="p-2.5">{(results.asMinPerMeter * results.l).toFixed(2)}</td>
                    <td className="p-2.5 font-bold text-[#183B2F]">{results.asTotalB.toFixed(2)}</td>
                    <td className="p-2.5 font-bold text-[#183B2F]">
                      {results.nBarsB} {results.selectedBarB.label}
                    </td>
                    <td className="p-2.5 font-bold text-sm text-[#183B2F]">@ {results.spacingB} cm</td>
                    <td className="p-2.5">
                      {results.spacingB <= results.maxSpacing ? (
                        <span className="font-semibold text-emerald-700">S ≤ {results.maxSpacing} cm OK</span>
                      ) : (
                        <span className="font-semibold text-amber-700">Excede S_max ({results.maxSpacing} cm)</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Caja de especificación para planos constructivos */}
              <div className="mt-3 p-3.5 bg-[#D2E3D8]/30 rounded-xl border border-[#A3D1B4] flex flex-col md:flex-row md:items-center md:justify-between text-xs gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-[#183B2F] tracking-wide uppercase text-[11px]">
                      5. ESPECIFICACIÓN PARA PLANO CONSTRUCTIVO:
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium">
                      (Recubrimiento r = {inputs.rec} cm)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {/* Refuerzo Dir L */}
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-[#A3D1B4] shadow-2xs flex items-center justify-between">
                      <span className="font-bold text-[#183B2F] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C97A3E]"></span>
                        Parrilla Inferior Dir. L:
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 text-xs">
                        {results.nBarsL} {results.selectedBarL.label} @ {results.spacingL} cm
                      </span>
                    </div>

                    {/* Refuerzo Dir B */}
                    <div className="bg-white px-3 py-1.5 rounded-lg border border-[#A3D1B4] shadow-2xs flex items-center justify-between">
                      <span className="font-bold text-[#183B2F] flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#1E4838]"></span>
                        Parrilla Inferior Dir. B:
                      </span>
                      <span className="font-mono font-extrabold text-slate-900 text-xs">
                        {results.nBarsB} {results.selectedBarB.label} @ {results.spacingB} cm
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onOpenReportModal}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#183B2F] hover:underline self-end md:self-center shrink-0"
                >
                  <span>Ver en Memoria Completa</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================
          ALERTAS Y RECOMENDACIONES DE INGENIERÍA
         ======================================================== */}
      {results.recommendations.length > 0 && (
        <div className="mt-5 p-4 rounded-xl border bg-[#F7F7F2] border-gray-200">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#183B2F] mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>DIAGNÓSTICO Y RECOMENDACIONES DE INGENIERÍA ESTRUCTURAL:</span>
          </div>
          <ul className="space-y-1.5 text-xs text-gray-700 pl-5 list-disc">
            {results.recommendations.map((rec, index) => (
              <li key={index} className="leading-relaxed">
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
        </>
      )}
    </div>
  );
};
