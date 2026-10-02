/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { FootingInputs, FootingResults } from './types/footing';
import {
  DEFAULT_FOOTING_INPUTS,
  calculateFooting,
} from './utils/footingCalculations';
import { Header } from './components/Header';
import { ProjectManagementCard } from './components/ProjectManagementCard';
import { InputParametersCard } from './components/InputParametersCard';
import { TechnicalFootingSVG } from './components/TechnicalFootingSVG';
import { ResultsPanel } from './components/ResultsPanel';
import { CalculationReportModal } from './components/CalculationReportModal';
import { exportFootingCsv } from './utils/exportCsv';
import { downloadReportPdf } from './utils/exportPdf';
import heroImage1 from './assets/images/zapata_concreto_portada_limpia_1790797895690.jpg';
import heroImage2 from './assets/images/zapata_armado_obra_1790805955879.jpg';
import heroImage3 from './assets/images/zapata_vaciado_concreto_1790805966764.jpg';
import heroImage4 from './assets/images/zapata_curada_obra_1790805979177.jpg';

const HERO_IMAGES = [
  { src: heroImage1 },
  { src: heroImage2 },
  { src: heroImage3 },
  { src: heroImage4 },
];

export default function App() {
  const [inputs, setInputs] = useState<FootingInputs>(DEFAULT_FOOTING_INPUTS);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  // Cambio interactivo al pasar el mouse por encima de la portada
  const handleHeroMouseEnter = () => {
    setHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
  };

  // Cálculo en tiempo real de todos los estados geotécnicos y estructurales
  const results: FootingResults = useMemo(() => {
    return calculateFooting(inputs);
  }, [inputs]);

  // Manejo de actualización de campos
  const handleInputChange = (patch: Partial<FootingInputs>) => {
    setInputs((prev) => {
      const next = { ...prev, ...patch };
      // Si el modo es 'auto', sincronizar manualB, manualL, manualH con el cálculo óptimo
      if (next.dimensionMode === 'auto') {
        const optimal = calculateFooting(next);
        next.manualB = optimal.b;
        next.manualL = optimal.l;
        next.manualH = optimal.h;
      }
      return next;
    });
  };

  // Reajuste a dimensiones óptimas automáticas
  const handleApplyAutoDimensions = () => {
    const optimal = calculateFooting({ ...inputs, dimensionMode: 'auto' });
    setInputs((prev) => ({
      ...prev,
      dimensionMode: 'auto',
      manualB: optimal.b,
      manualL: optimal.l,
      manualH: optimal.h,
    }));
    showToast(`Dimensionamiento óptimo aplicado: B = ${optimal.b.toFixed(2)} m, L = ${optimal.l.toFixed(2)} m, h = ${optimal.h} cm`);
  };

  // Restablecer valores de la plantilla Excel original
  const handleResetDefaults = () => {
    setInputs(DEFAULT_FOOTING_INPUTS);
    showToast('Valores restablecidos a los de la plantilla Excel base');
  };

  // Feedback toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Exportar a CSV
  const handleExportCsv = () => {
    exportFootingCsv(inputs, results);
    showToast('Archivo CSV generado y descargado con éxito');
  };

  // Descarga directa y automática del archivo PDF completo (diseño, verificaciones y planos) en el cliente
  const handleDownloadPdf = async () => {
    const cleanProject = (inputs.projectName || 'Proyecto').trim().replace(/\s+/g, '_');
    const cleanCode = (inputs.footingCode || 'Z1').trim().replace(/\s+/g, '_');
    const filename = `Memoria_Calculo_${cleanCode}_${cleanProject}_Horizontal.pdf`;

    showToast('Generando y descargando archivo PDF...');

    try {
      const success = await downloadReportPdf('printable-calculation-report', {
        filename,
      });

      if (success) {
        showToast('Archivo PDF descargado con éxito');
      } else {
        showToast('No se pudo generar la descarga directa del PDF');
      }
    } catch (err) {
      console.error('Error al procesar descarga de PDF:', err);
      showToast('Error al generar la descarga del PDF');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F7F2] text-slate-800 flex flex-col font-sans">
      {/* Toast Notificación */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#183B2F] text-white px-4 py-2.5 rounded-xl shadow-lg border border-[#A3D1B4]/40 text-xs sm:text-sm font-semibold flex items-center space-x-2 animate-bounce">
          <i className="fa-solid fa-circle-check text-[#A3D1B4]"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER SUPERIOR */}
      <Header
        inputs={inputs}
        results={results}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onDownloadPdf={handleDownloadPdf}
        onExportCsv={handleExportCsv}
        onResetDefaults={handleResetDefaults}
      />

      {/* CUERPO PRINCIPAL DE LA APLICACIÓN */}
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* PANEL SUPERIOR DE GESTIÓN (CARD 1) */}
        <ProjectManagementCard
          inputs={inputs}
          results={results}
          onChange={handleInputChange}
        />

        {/* 2. PORTADA FOTOGRÁFICA INTERACTIVA LIMPIA (CAMBIO AL PASAR EL MOUSE) */}
        <div
          onMouseEnter={handleHeroMouseEnter}
          className="relative w-full rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB] bg-slate-900 group cursor-pointer select-none"
          title="Pasa el mouse sobre la portada para alternar entre las fotografías reales de zapata en obra"
        >
          <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden bg-slate-950">
            {/* Renderizado de las 4 imágenes con fundido suave (crossfade) */}
            {HERO_IMAGES.map((img, idx) => (
              <img
                key={idx}
                src={img.src}
                alt={`Zapata en obra ${idx + 1}`}
                referrerPolicy="no-referrer"
                className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-700 ease-in-out transform group-hover:scale-102 ${
                  heroIndex === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-98 z-0 pointer-events-none'
                }`}
                loading={idx === 0 ? 'eager' : 'lazy'}
              />
            ))}

            {/* Controles de flecha previa y siguiente en hover */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHeroIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs border border-white/20 cursor-pointer shadow-md"
              aria-label="Imagen anterior"
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHeroIndex((prev) => (prev - 1 + HERO_IMAGES.length) % HERO_IMAGES.length);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-black/40 hover:bg-black/75 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-xs border border-white/20 cursor-pointer shadow-md"
              aria-label="Siguiente imagen"
            >
              <i className="fa-solid fa-chevron-right text-xs"></i>
            </button>

            {/* Indicadores / Puntos de navegación discretos */}
            <div className="absolute bottom-3 right-3 z-30 flex items-center space-x-1.5 bg-black/35 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-white/10">
              {HERO_IMAGES.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setHeroIndex(dotIdx);
                  }}
                  className={`transition-all rounded-full cursor-pointer ${
                    heroIndex === dotIdx
                      ? 'w-5 h-1.5 bg-[#A3D1B4]'
                      : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Ver imagen ${dotIdx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 3. PARÁMETROS DE DISEÑO Y ENTRADA DE DATOS (EN TODO EL LARGO DE LA PÁGINA) */}
        <div className="w-full">
          <InputParametersCard
            inputs={inputs}
            results={results}
            onChange={handleInputChange}
            onApplyAutoDimensions={handleApplyAutoDimensions}
          />
        </div>

        {/* 4. ESQUEMA TÉCNICO Y MODELO 3D (A TODO EL LARGO DE LA PÁGINA CON LETRAS MÁS GRANDES) */}
        <div className="w-full">
          <TechnicalFootingSVG
            inputs={inputs}
            results={results}
          />
        </div>

        {/* 5. PANEL DE RESULTADOS Y MEMORIA DE CÁLCULO */}
        <ResultsPanel
          inputs={inputs}
          results={results}
          onRecalculate={() => showToast('Zapata calculada y verificada según normativa')}
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      </main>

      {/* PIE DE PÁGINA PROFESIONAL */}
      <footer className="bg-white border-t border-gray-200 mt-12 py-6 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-[#183B2F] text-white flex items-center justify-center font-bold text-[10px]">
              Z
            </div>
            <span className="font-semibold text-gray-700">
              Diseño y Verificación de Zapatas Aisladas de Concreto Armado
            </span>
          </div>
          <div className="text-center sm:text-right">
            <span>Normas Técnicas de Referencia: ACI 318-19 & NTE E.060 / E.050 Suelos y Cimentaciones</span>
          </div>
        </div>
      </footer>

      {/* MODAL Y REPORTE IMPRIMIBLE DE MEMORIA DE CÁLCULO */}
      <CalculationReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        inputs={inputs}
        results={results}
      />
    </div>
  );
}
