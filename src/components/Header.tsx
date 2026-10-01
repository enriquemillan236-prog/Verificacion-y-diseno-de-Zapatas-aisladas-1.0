import React from 'react';
import { FileText, Download, RotateCcw } from 'lucide-react';
import { FootingInputs, FootingResults } from '../types/footing';

interface HeaderProps {
  inputs: FootingInputs;
  results: FootingResults;
  onOpenReportModal: () => void;
  onExportCsv: () => void;
  onResetDefaults: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  inputs,
  results,
  onOpenReportModal,
  onExportCsv,
  onResetDefaults,
}) => {
  return (
    <header className="bg-[#183B2F] text-white shadow-md border-b border-[#143228]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Logo y Título Principal */}
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#D2E3D8] text-[#183B2F] flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
              <i className="fa-solid fa-cubes-stacked text-xl"></i>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white font-heading">
                  DISEÑADOR Y VERIFICADOR DE ZAPATAS AISLADAS
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-[#A3D1B4]/25 text-[#D2E3D8] border border-[#A3D1B4]/30">
                  PRO v2.5
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#D2E3D8]/80 mt-0.5">
                Cálculo y comprobación geotécnica y estructural según norma ACI 318 / NTE E.060
              </p>
            </div>
          </div>

          {/* Botones de Acción Superior */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            {/* Ver Memoria */}
            <button
              onClick={onOpenReportModal}
              className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#D2E3D8] text-[#183B2F] hover:bg-[#b9d6c2] transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D2E3D8]"
              title="Abrir memoria de cálculo formal para imprimir o PDF"
            >
              <FileText className="w-4 h-4 text-[#183B2F]" />
              <span>Memoria de Cálculo</span>
            </button>

            {/* Exportar CSV */}
            <button
              onClick={onExportCsv}
              className="inline-flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg bg-[#1E4838] text-white border border-[#2e624e] hover:bg-[#255845] transition-colors shadow-sm focus:outline-none"
              title="Exportar datos y resultados en formato CSV / Excel"
            >
              <Download className="w-3.5 h-3.5 text-[#D2E3D8]" />
              <span>CSV</span>
            </button>

            {/* Restablecer */}
            <button
              onClick={onResetDefaults}
              className="inline-flex items-center justify-center p-2 rounded-lg bg-[#1E4838] text-[#D2E3D8] hover:text-white hover:bg-[#255845] transition-colors"
              title="Restablecer valores de plantilla Excel inicial"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
