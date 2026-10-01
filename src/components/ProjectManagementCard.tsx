import React from 'react';
import { FootingInputs, FootingResults } from '../types/footing';
import { CheckCircle2, AlertTriangle, Building2, Hash, User, BookOpen, Clock } from 'lucide-react';

interface ProjectManagementCardProps {
  inputs: FootingInputs;
  results: FootingResults;
  isVerified?: boolean;
  onChange: (patch: Partial<FootingInputs>) => void;
}

export const ProjectManagementCard: React.FC<ProjectManagementCardProps> = ({
  inputs,
  results,
  isVerified = false,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5 transition-all">
      {/* Encabezado de la Tarjeta */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#D2E3D8] text-[#183B2F] flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base sm:text-lg font-bold text-[#183B2F] font-heading tracking-wide">
                GESTIÓN DE ZAPATA POR PROYECTO
              </h2>
              <span className="px-2 py-0.5 text-xs font-semibold rounded bg-[#D2E3D8] text-[#183B2F] border border-[#A3D1B4]">
                AIST-318
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Datos de control técnico, trazabilidad de memoria de cálculo y estado de verificación
            </p>
          </div>
        </div>

        {/* Badge Dinámico de Estado */}
        <div className="flex items-center">
          {!results.isAreaOk ? (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-red-100 text-red-900 border border-red-400 shadow-xs animate-pulse">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                NO CUMPLE (Az &lt; Areq)
              </span>
            </div>
          ) : results.isAllOk ? (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-[#D2E3D8] text-[#183B2F] border border-[#A3D1B4] shadow-xs">
              <CheckCircle2 className="w-4 h-4 text-[#183B2F]" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                CONFORME / OK
              </span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-red-100 text-red-900 border border-red-300 shadow-xs">
              <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold tracking-wide">
                NO CUMPLE REQUERIMIENTOS
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Campos de Entrada en Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-4">
        {/* Nombre del Proyecto */}
        <div className="lg:col-span-2">
          <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-[#183B2F]" />
            <span>Nombre del Proyecto</span>
          </label>
          <input
            type="text"
            value={inputs.projectName}
            onChange={(e) => onChange({ projectName: e.target.value })}
            placeholder="Ej: Edificio Multifamiliar Los Álamos"
            className="w-full text-sm px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4838] focus:bg-white transition-colors"
          />
        </div>

        {/* Código de Zapata */}
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-[#183B2F]" />
            <span>Código de Zapata</span>
          </label>
          <input
            type="text"
            value={inputs.footingCode}
            onChange={(e) => onChange({ footingCode: e.target.value })}
            placeholder="Ej: Z-01"
            className="w-full text-sm font-semibold text-[#183B2F] px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4838] focus:bg-white transition-colors"
          />
        </div>

        {/* Ingeniero Responsable (Requerimiento 1) */}
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-[#183B2F]" />
            <span>Ingeniero Responsable</span>
          </label>
          <input
            type="text"
            value={inputs.engineerName}
            onChange={(e) => onChange({ engineerName: e.target.value })}
            placeholder="Ing. Estructural"
            className="w-full text-sm px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4838] focus:bg-white transition-colors"
          />
        </div>

        {/* Norma de Diseño */}
        <div>
          <label className="text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-[#183B2F]" />
            <span>Norma de Diseño</span>
          </label>
          <select
            value={inputs.normative}
            onChange={(e) => onChange({ normative: e.target.value as any })}
            className="w-full text-sm px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E4838] focus:bg-white transition-colors font-medium text-[#183B2F]"
          >
            <option value="ACI 318-19">ACI 318-19 (1.2D + 1.6L)</option>
            <option value="NTE E.060">NTE E.060 (1.4D + 1.7L)</option>
          </select>
        </div>
      </div>

      {/* Tira Resumen Rápida de Verificaciones */}
      <div className="mt-3.5 pt-3 border-t border-gray-100 flex flex-wrap items-center gap-2 text-xs">
        <span className="text-gray-500 font-medium">Estado de Verificaciones:</span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded font-semibold ${
            results.isSoilOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-100 text-red-700'
          }`}
        >
          Suelo (q_max ≤ qa): {results.isSoilOk ? 'OK' : 'EXCEDIDO'}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded font-semibold ${
            results.isFlexShearOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-100 text-red-700'
          }`}
        >
          Cortante 1 Vía (d): {results.isFlexShearOk ? 'OK' : 'EXCEDIDO'}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded font-semibold ${
            results.isPunzShearOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-red-100 text-red-700'
          }`}
        >
          Punzonamiento (bo): {results.isPunzShearOk ? 'OK' : 'EXCEDIDO'}
        </span>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded font-semibold ${
            results.isSpacingOk ? 'bg-[#D2E3D8] text-[#183B2F]' : 'bg-amber-100 text-amber-800'
          }`}
        >
          Espaciamiento Acero (S): {results.isSpacingOk ? 'OK' : 'AJUSTAR'}
        </span>
      </div>
    </div>
  );
};
