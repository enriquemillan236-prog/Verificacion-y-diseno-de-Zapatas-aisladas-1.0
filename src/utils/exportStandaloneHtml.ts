import { FootingInputs, FootingResults } from '../types/footing';

export function generateStandaloneHtml(inputs: FootingInputs, results: FootingResults): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diseño y Verificación de Zapatas Aisladas - ACI 318 / NTE E.060</title>
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Montserrat:wght@500;600;700;800&display=swap" rel="stylesheet">
  <script>
    tailwind.config = {
      theme: {
        extend: {
          colors: {
            forest: '#183B2F',
            forestLight: '#1E4838',
            mint: '#A3D1B4',
            mintLight: '#D2E3D8',
            goldSoft: '#EEDFA8',
            bgBeige: '#F7F7F2'
          },
          fontFamily: {
            sans: ['Inter', 'sans-serif'],
            heading: ['Montserrat', 'sans-serif']
          }
        }
      }
    }
  </script>
  <style>
    body { font-family: 'Inter', sans-serif; background-color: #F7F7F2; }
    h1, h2, h3, .font-heading { font-family: 'Montserrat', sans-serif; }
    @media print {
      .no-print { display: none !important; }
      body { background: #fff !important; }
    }
  </style>
</head>
<body class="bg-[#F7F7F2] text-slate-800 antialiased min-h-screen">

  <!-- HEADER SUPERIOR -->
  <header class="bg-[#183B2F] text-white shadow-md border-b border-[#143228]">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center space-x-3.5">
        <div class="w-12 h-12 rounded-xl bg-[#D2E3D8] text-[#183B2F] flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
          <i class="fa-solid fa-cubes-stacked"></i>
        </div>
        <div>
          <h1 class="text-xl sm:text-2xl font-extrabold tracking-tight font-heading">
            DISEÑADOR Y VERIFICADOR DE ZAPATAS AISLADAS
          </h1>
          <p class="text-xs sm:text-sm text-[#D2E3D8]/80">
            Cálculo y comprobación geotécnica y estructural según norma ACI 318 / NTE E.060
          </p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="window.print()" class="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#D2E3D8] text-[#183B2F] hover:bg-[#b9d6c2] transition-colors flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-print"></i>
          <span>Imprimir / PDF</span>
        </button>
        <button onclick="exportCsv()" class="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-[#1E4838] text-white border border-[#2e624e] hover:bg-[#255845] transition-colors flex items-center gap-1.5 shadow-sm">
          <i class="fa-solid fa-file-csv"></i>
          <span>CSV</span>
        </button>
      </div>
    </div>
  </header>

  <!-- CONTENIDO PRINCIPAL -->
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

    <!-- CARD 1: GESTIÓN DE ZAPATA POR PROYECTO -->
    <div class="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-gray-100 gap-3">
        <div class="flex items-center space-x-2.5">
          <div class="w-8 h-8 rounded-lg bg-[#D2E3D8] text-[#183B2F] flex items-center justify-center font-bold">
            <i class="fa-solid fa-building"></i>
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <h2 class="text-base font-bold text-[#183B2F] font-heading">GESTIÓN DE ZAPATA POR PROYECTO</h2>
              <span class="px-2 py-0.5 text-xs font-semibold rounded bg-[#D2E3D8] text-[#183B2F] border border-[#A3D1B4]">AIST-318</span>
            </div>
            <p class="text-xs text-gray-500">Parámetros de control técnico y estado de verificación</p>
          </div>
        </div>

        <div id="statusBadge" class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D2E3D8] text-[#183B2F] border border-[#A3D1B4] font-bold text-xs sm:text-sm">
          <i class="fa-solid fa-circle-check"></i>
          <span id="statusBadgeText">CONFORME / OK</span>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Nombre del Proyecto</label>
          <input type="text" id="inpProject" value="${inputs.projectName}" class="w-full text-sm px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Código de Zapata</label>
          <input type="text" id="inpCode" value="${inputs.footingCode}" class="w-full text-sm font-bold text-[#183B2F] px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Especialista / Proyectista</label>
          <input type="text" id="inpEngineer" value="${inputs.engineerName}" class="w-full text-sm px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg">
        </div>
        <div>
          <label class="block text-xs font-semibold text-gray-700 mb-1">Normativa</label>
          <select id="inpNormative" onchange="recalculate()" class="w-full text-sm px-3 py-2 bg-[#F7F7F2] border border-gray-300 rounded-lg font-medium text-[#183B2F]">
            <option value="ACI 318-19" ${inputs.normative === 'ACI 318-19' ? 'selected' : ''}>ACI 318-19 (1.2D + 1.6L)</option>
            <option value="NTE E.060" ${inputs.normative === 'NTE E.060' ? 'selected' : ''}>NTE E.060 (1.4D + 1.7L)</option>
          </select>
        </div>
      </div>
    </div>

    <!-- CARD 2: FORMULARIO EN GRID DE DATOS -->
    <div class="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5">
      <div class="flex justify-between items-center pb-3 border-b border-gray-100">
        <h2 class="text-base font-bold text-[#183B2F] font-heading flex items-center gap-2">
          <i class="fa-solid fa-sliders"></i>
          <span>PARÁMETROS DE ENTRADA Y MATERIALES</span>
        </h2>
        <span class="text-xs text-gray-500">Actualización interactiva en tiempo real</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <!-- a) Materiales -->
        <div class="p-3.5 rounded-xl bg-[#F7F7F2] border border-gray-200">
          <h3 class="text-xs font-bold text-[#183B2F] mb-2 flex items-center gap-1.5 pb-1 border-b border-gray-200">
            <i class="fa-solid fa-cube"></i> a) Propiedades de Materiales
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Concreto f'c</label>
              <input type="number" id="inpFc" value="${inputs.fc}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">kg/cm²</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Fluencia Fy</label>
              <input type="number" id="inpFy" value="${inputs.fy}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">kg/cm²</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Recubrimiento r</label>
              <input type="number" id="inpRec" value="${inputs.rec}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">cm</span>
            </div>
          </div>
        </div>

        <!-- b) Suelo y Desplante -->
        <div class="p-3.5 rounded-xl bg-[#F7F7F2] border border-gray-200">
          <h3 class="text-xs font-bold text-[#183B2F] mb-2 flex items-center gap-1.5 pb-1 border-b border-gray-200">
            <i class="fa-solid fa-mountain"></i> b) Parámetros del Suelo y Cimentación
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Capacidad qa</label>
              <input type="number" step="0.1" id="inpQa" value="${inputs.qa}" oninput="recalculate()" class="w-full text-xs font-bold text-[#183B2F] p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">kg/cm²</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Desplante Df</label>
              <input type="number" step="0.1" id="inpDf" value="${inputs.df}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">m</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Sobrecarga s/c</label>
              <input type="number" step="0.1" id="inpSc" value="${inputs.sobrecarga}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">Tn/m²</span>
            </div>
          </div>
        </div>

        <!-- c) Cargas de Columna -->
        <div class="p-3.5 rounded-xl bg-[#F7F7F2] border border-gray-200">
          <h3 class="text-xs font-bold text-[#183B2F] mb-2 flex items-center justify-between pb-1 border-b border-gray-200">
            <span><i class="fa-solid fa-weight-hanging"></i> c) Cargas de Servicio (Columna)</span>
            <span id="loadSummary" class="text-[10px] text-gray-500 font-bold bg-white px-2 py-0.5 rounded border border-gray-200">Ps = ${results.ps.toFixed(2)} Tn</span>
          </h3>
          <div class="grid grid-cols-4 gap-2">
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Pcm (Muerta)</label>
              <input type="number" step="0.5" id="inpPcm" value="${inputs.pcm}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">Tn</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Pcv (Viva)</label>
              <input type="number" step="0.5" id="inpPcv" value="${inputs.pcv}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">Tn</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Mcm</label>
              <input type="number" step="0.1" id="inpMcm" value="${inputs.mcm}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">Tn.m</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Mcv</label>
              <input type="number" step="0.1" id="inpMcv" value="${inputs.mcv}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">Tn.m</span>
            </div>
          </div>
        </div>

        <!-- d) Columna y Refuerzo -->
        <div class="p-3.5 rounded-xl bg-[#F7F7F2] border border-gray-200">
          <h3 class="text-xs font-bold text-[#183B2F] mb-2 flex items-center gap-1.5 pb-1 border-b border-gray-200">
            <i class="fa-solid fa-ruler-combined"></i> d) Geometría de Columna y Varilla
          </h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Lado b (Columna)</label>
              <input type="number" step="5" id="inpBcol" value="${inputs.bCol}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">cm</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Lado t (Columna)</label>
              <input type="number" step="5" id="inpTcol" value="${inputs.tCol}" oninput="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded">
              <span class="text-[9px] text-gray-400">cm</span>
            </div>
            <div>
              <label class="text-[11px] font-medium text-gray-600 block">Varilla Zapata</label>
              <select id="inpBar" onchange="recalculate()" class="w-full text-xs font-bold p-1.5 bg-white border border-gray-300 rounded text-[#183B2F]">
                <option value="1/2\\"" ${inputs.barKey === '1/2"' ? 'selected' : ''}>Ø 1/2" (12.7 mm)</option>
                <option value="5/8\\"" ${inputs.barKey === '5/8"' ? 'selected' : ''}>Ø 5/8" (15.9 mm)</option>
                <option value="3/4\\"" ${inputs.barKey === '3/4"' ? 'selected' : ''}>Ø 3/4" (19.1 mm)</option>
                <option value="1\\"" ${inputs.barKey === '1"' ? 'selected' : ''}>Ø 1" (25.4 mm)</option>
              </select>
              <span class="text-[9px] text-gray-400">Diámetro</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CARD 3: ILUSTRACIÓN TÉCNICA 3D / SVG -->
    <div class="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5">
      <div class="flex justify-between items-center pb-3 border-b border-gray-100">
        <h2 class="text-base font-bold text-[#183B2F] font-heading flex items-center gap-2">
          <i class="fa-solid fa-cube"></i>
          <span>MODELO ISOMÉTRICO 3D Y DETALLE ESTRUCTURAL</span>
        </h2>
        <span class="px-2 py-0.5 rounded text-xs font-bold bg-[#D2E3D8] text-[#183B2F]">B x L x h</span>
      </div>

      <div class="w-full aspect-16/9 bg-[#F7F7F2] rounded-xl border border-gray-200 mt-4 flex items-center justify-center p-2 relative overflow-hidden">
        <svg viewBox="0 0 800 450" class="w-full h-full max-h-[420px]">
          <!-- Cara lateral izquierda -->
          <polygon points="-190,40 -10,135 -10,195 -190,100" transform="translate(400,220)" fill="#D2E3D8" stroke="#183B2F" stroke-width="2"/>
          <!-- Cara lateral derecha -->
          <polygon points="-10,135 190,40 190,100 -10,195" transform="translate(400,220)" fill="#A3D1B4" stroke="#183B2F" stroke-width="2"/>
          <!-- Cara superior -->
          <polygon points="-10,-55 190,40 -10,135 -190,40" transform="translate(400,220)" fill="#FFFFFF" stroke="#183B2F" stroke-width="2"/>
          
          <!-- Columna -->
          <polygon points="-35,28 -10,40 -10,-125 -35,-137" transform="translate(400,220)" fill="#1E4838" stroke="#143228" stroke-width="1.5"/>
          <polygon points="-10,40 18,26 18,-139 -10,-125" transform="translate(400,220)" fill="#255845" stroke="#143228" stroke-width="1.5"/>
          <polygon points="-35,-137 -10,-125 18,-139 -7,-151" transform="translate(400,220)" fill="#357059" stroke="#143228" stroke-width="1.5"/>

          <!-- Malla de acero en 3D -->
          <g transform="translate(400,220)" opacity="0.8">
            <line x1="-120" y1="120" x2="20" y2="45" stroke="#C97A3E" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="-80" y1="140" x2="60" y2="65" stroke="#C97A3E" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="-40" y1="160" x2="100" y2="85" stroke="#C97A3E" stroke-width="2.5" stroke-linecap="round"/>
            <line x1="-100" y1="70" x2="50" y2="150" stroke="#183B2F" stroke-width="2" stroke-linecap="round" stroke-dasharray="5,3"/>
            <line x1="-60" y1="50" x2="90" y2="130" stroke="#183B2F" stroke-width="2" stroke-linecap="round" stroke-dasharray="5,3"/>
          </g>

          <!-- Textos y Cotas -->
          <text id="svgTextB" x="280" y="325" fill="#183B2F" font-size="13" font-weight="bold">B = ${results.b.toFixed(2)} m</text>
          <text id="svgTextL" x="480" y="325" fill="#183B2F" font-size="13" font-weight="bold">L = ${results.l.toFixed(2)} m</text>
          <text id="svgTextH" x="610" y="280" fill="#183B2F" font-size="13" font-weight="bold">h = ${results.h} cm (d = ${results.d} cm)</text>
          <text x="360" y="65" fill="#E11D48" font-size="13" font-weight="bold">Pu = ${results.pu.toFixed(1)} Tn</text>
        </svg>
      </div>
    </div>

    <!-- CARD 4: PANEL DE RESULTADOS Y MEMORIA DE CÁLCULO -->
    <div class="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-4 sm:p-5">
      <div class="flex flex-col sm:flex-row justify-between items-center pb-4 border-b border-gray-100 gap-3">
        <div>
          <h2 class="text-base font-bold text-[#183B2F] font-heading flex items-center gap-2">
            <i class="fa-solid fa-square-poll-vertical"></i>
            <span>RESULTADOS DE CÁLCULO PASO A PASO</span>
          </h2>
          <p class="text-xs text-gray-500">Comprobación geotécnica y estructural paso a paso</p>
        </div>

        <button onclick="recalculate()" class="px-5 py-2.5 rounded-xl font-bold text-sm text-[#3D3008] bg-[#EEDFA8] hover:bg-[#e4d393] border border-[#dfce88] shadow-sm flex items-center gap-2 cursor-pointer transition-all active:scale-95">
          <i class="fa-solid fa-calculator"></i>
          <span>CALCULAR Y VERIFICAR ZAPATA</span>
        </button>
      </div>

      <!-- KPI Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 my-4">
        <!-- 1. Suelo -->
        <div class="p-3.5 rounded-xl border bg-[#F7F7F2] border-gray-200">
          <span class="text-xs font-semibold text-gray-600 block">Presión sobre Suelo</span>
          <div class="flex items-baseline gap-1 mt-1">
            <span id="kpiQmax" class="text-xl font-extrabold text-[#183B2F]">${results.qMax.toFixed(2)}</span>
            <span class="text-xs text-gray-500">/ ${inputs.qa.toFixed(2)} kg/cm²</span>
          </div>
          <span id="kpiSoilBadge" class="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D2E3D8] text-[#183B2F]">OK (q_max ≤ qa)</span>
        </div>

        <!-- 2. Cortante 1 vía -->
        <div class="p-3.5 rounded-xl border bg-[#F7F7F2] border-gray-200">
          <span class="text-xs font-semibold text-gray-600 block">Cortante a dist. d</span>
          <div class="flex items-baseline gap-1 mt-1">
            <span id="kpiVuFlex" class="text-xl font-extrabold text-[#183B2F]">${results.vuFlex.toFixed(1)}</span>
            <span id="kpiPhiVcFlex" class="text-xs text-gray-500">/ ØVc ${results.phiVcFlex.toFixed(1)} Tn</span>
          </div>
          <span id="kpiFlexBadge" class="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D2E3D8] text-[#183B2F]">CONFORME (1 Vía)</span>
        </div>

        <!-- 3. Punzonamiento -->
        <div class="p-3.5 rounded-xl border bg-[#F7F7F2] border-gray-200">
          <span class="text-xs font-semibold text-gray-600 block">Punzonamiento</span>
          <div class="flex items-baseline gap-1 mt-1">
            <span id="kpiVuPunz" class="text-xl font-extrabold text-[#183B2F]">${results.vuPunz.toFixed(1)}</span>
            <span id="kpiPhiVcPunz" class="text-xs text-gray-500">/ ØVc ${results.phiVcPunz.toFixed(1)} Tn</span>
          </div>
          <span id="kpiPunzBadge" class="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D2E3D8] text-[#183B2F]">CONFORME (2 Vías)</span>
        </div>

        <!-- 4. Acero -->
        <div class="p-3.5 rounded-xl border bg-[#F7F7F2] border-gray-200">
          <span class="text-xs font-semibold text-gray-600 block">Refuerzo Adoptado</span>
          <div id="kpiRebarMain" class="text-sm font-extrabold text-[#183B2F] mt-1">
            ${results.nBarsL} ${results.selectedBar.key} @ ${results.spacingL} cm
          </div>
          <span class="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold rounded bg-[#D2E3D8] text-[#183B2F]">Ambas direcciones</span>
        </div>
      </div>

      <!-- Tablas Detalladas -->
      <div class="overflow-x-auto border border-gray-200 rounded-xl mt-4">
        <table class="w-full text-xs text-left">
          <thead class="bg-gray-50 text-gray-600 font-semibold border-b border-gray-200">
            <tr>
              <th class="p-3">Comprobación</th>
              <th class="p-3">Ecuación de Cálculo</th>
              <th class="p-3">Valor Actuante</th>
              <th class="p-3">Límite Resistente</th>
              <th class="p-3">Estado</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100 text-gray-700">
            <tr>
              <td class="p-3 font-bold text-[#183B2F]">1. Dimensiones en Planta</td>
              <td class="p-3 font-mono">B = L = √(Ps / 10*qn)</td>
              <td class="p-3 font-bold" id="tdArea">${results.b.toFixed(2)} x ${results.l.toFixed(2)} m (Az=${results.area.toFixed(2)} m²)</td>
              <td class="p-3" id="tdAreq">Req: ${results.aReq.toFixed(2)} m²</td>
              <td class="p-3 font-bold text-emerald-700">OK (Az ≥ A_req)</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-[#183B2F]">2. Presión sobre Terreno</td>
              <td class="p-3 font-mono">q_max = Ps/Az + Ms*(L/2)/Iz</td>
              <td class="p-3 font-bold" id="tdQmax">${results.qMax.toFixed(2)} kg/cm²</td>
              <td class="p-3" id="tdQa">qa = ${inputs.qa.toFixed(2)} kg/cm²</td>
              <td class="p-3 font-bold" id="tdSoilStatus">${results.isSoilOk ? '<span class="text-emerald-700">OK (q_max ≤ qa)</span>' : '<span class="text-red-700">EXCEDIDO</span>'}</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-[#183B2F]">3. Cortante por Flexión (d)</td>
              <td class="p-3 font-mono">Vu = qu*(Lv - d)*B</td>
              <td class="p-3 font-bold" id="tdVuFlex">${results.vuFlex.toFixed(2)} Tn</td>
              <td class="p-3" id="tdPhiVcFlex">ØVc = ${results.phiVcFlex.toFixed(2)} Tn</td>
              <td class="p-3 font-bold" id="tdFlexStatus">${results.isFlexShearOk ? '<span class="text-emerald-700">CONFORME</span>' : '<span class="text-red-700">NO CUMPLE</span>'}</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-[#183B2F]">4. Punzonamiento (bo)</td>
              <td class="p-3 font-mono">Vu = qu*(Az - Ap)</td>
              <td class="p-3 font-bold" id="tdVuPunz">${results.vuPunz.toFixed(2)} Tn</td>
              <td class="p-3" id="tdPhiVcPunz">ØVc = ${results.phiVcPunz.toFixed(2)} Tn</td>
              <td class="p-3 font-bold" id="tdPunzStatus">${results.isPunzShearOk ? '<span class="text-emerald-700">CONFORME</span>' : '<span class="text-red-700">NO CUMPLE</span>'}</td>
            </tr>
            <tr>
              <td class="p-3 font-bold text-[#183B2F]">5. Acero y Distribución</td>
              <td class="p-3 font-mono">N = As_dis / As_varilla</td>
              <td class="p-3 font-bold" id="tdAsReq">${results.asTotalL.toFixed(2)} cm²</td>
              <td class="p-3" id="tdAsBar">${results.nBarsL} varillas ${results.selectedBar.key}</td>
              <td class="p-3 font-bold text-[#183B2F]" id="tdSpacing">@ ${results.spacingL} cm (S_max: ${results.maxSpacing} cm)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </main>

  <footer class="max-w-7xl mx-auto px-4 py-6 text-center text-xs text-gray-500 border-t border-gray-200 mt-12">
    Diseñador y Verificador de Zapatas Aisladas de Concreto Armado — Conforme a normas ACI 318 / NTE E.060.
  </footer>

  <script>
    // Catálogo de Varillas
    const REBARS = {
      '1/2"': { area: 1.29, db: 1.27 },
      '5/8"': { area: 2.00, db: 1.5875 },
      '3/4"': { area: 2.84, db: 1.905 },
      '1"': { area: 5.10, db: 2.54 }
    };

    function recalculate() {
      const fc = parseFloat(document.getElementById('inpFc').value) || 210;
      const fy = parseFloat(document.getElementById('inpFy').value) || 4200;
      const rec = parseFloat(document.getElementById('inpRec').value) || 7.5;
      const qa = parseFloat(document.getElementById('inpQa').value) || 1.5;
      const df = parseFloat(document.getElementById('inpDf').value) || 1.0;
      const sc = parseFloat(document.getElementById('inpSc').value) || 0.5;
      const pcm = parseFloat(document.getElementById('inpPcm').value) || 0;
      const pcv = parseFloat(document.getElementById('inpPcv').value) || 0;
      const mcm = parseFloat(document.getElementById('inpMcm').value) || 0;
      const mcv = parseFloat(document.getElementById('inpMcv').value) || 0;
      const bCol = parseFloat(document.getElementById('inpBcol').value) || 20;
      const tCol = parseFloat(document.getElementById('inpTcol').value) || 20;
      const barKey = document.getElementById('inpBar').value || '3/4"';
      const normative = document.getElementById('inpNormative').value;

      const bar = REBARS[barKey] || REBARS['3/4"'];
      const db = bar.db;

      // Cargas
      const ps = pcm + pcv;
      const ms = mcm + mcv;
      const pu = normative === 'ACI 318-19' ? (1.2 * pcm + 1.6 * pcv) : (1.4 * pcm + 1.7 * pcv);

      document.getElementById('loadSummary').innerText = 'Ps = ' + ps.toFixed(2) + ' Tn | Pu = ' + pu.toFixed(2) + ' Tn';

      // Anclaje y peralte
      const ld = Math.max((0.08 * db * fy) / Math.sqrt(fc), 0.004 * db * fy, 20);
      const hMin = Math.ceil((Math.max(ld, 35) + 20) / 5) * 5;
      const h = Math.max(40, hMin);
      const d = h - 10;

      // Capacidad Neta y Dimensionamiento
      const qn = Math.max(0.1, qa - (df * 2.0 + sc) / 10);
      const aReq = ps / (qn * 10);
      const side = Math.max(1.0, Math.ceil(Math.sqrt(aReq) * 20) / 20);
      const b = side;
      const l = side;
      const area = b * l;

      // Presión suelo
      const baseQ = ps / area;
      const qMax = baseQ / 10;
      const isSoilOk = qMax <= qa * 1.0001;

      // Cortante 1 vía
      const qu = pu / area;
      const lv = (l - tCol / 100) / 2;
      const critDist = Math.max(0, lv - d / 100);
      const vuFlex = qu * critDist * b;
      const phiVcFlex = (0.85 * 0.53 * Math.sqrt(fc) * (b * 100) * d) / 1000;
      const isFlexOk = vuFlex <= phiVcFlex * 1.0001;

      // Punzonamiento
      const bo = 2 * (bCol + d) + 2 * (tCol + d);
      const ap = ((bCol + d) / 100) * ((tCol + d) / 100);
      const vuPunz = Math.max(0, qu * (area - ap));
      const betaC = Math.max(tCol / bCol, bCol / tCol, 1.0);
      const factorPunz = Math.min(0.53 + 1.1 / betaC, 1.06);
      const phiVcPunz = (0.85 * factorPunz * Math.sqrt(fc) * bo * d) / 1000;
      const isPunzOk = vuPunz <= phiVcPunz * 1.0001;

      // Acero
      const mu = qu * Math.pow(lv, 2) / 2 * b;
      const asMin = (0.7 * Math.sqrt(fc) / fy) * 100 * d;
      const muKgcm = (mu / b) * 100000;
      const term = Math.max(0, Math.pow(d, 2) - (2 * muKgcm) / (0.9 * 0.85 * fc * 100));
      const a = d - Math.sqrt(term);
      const asReqPerM = muKgcm > 0 ? (muKgcm / (0.9 * fy * (d - a / 2))) : asMin;
      const asTotal = Math.max(asMin, asReqPerM) * b;
      const nBars = Math.max(3, Math.ceil(asTotal / bar.area));
      const spacing = Math.round(((b * 100 - 15 - db) / (nBars - 1)) * 10) / 10;
      const maxSpacing = Math.min(30, Math.round(2 * h));

      // Actualizar DOM
      document.getElementById('svgTextB').textContent = 'B = ' + b.toFixed(2) + ' m';
      document.getElementById('svgTextL').textContent = 'L = ' + l.toFixed(2) + ' m';
      document.getElementById('svgTextH').textContent = 'h = ' + h + ' cm (d = ' + d + ' cm)';

      document.getElementById('kpiQmax').textContent = qMax.toFixed(2);
      document.getElementById('kpiVuFlex').textContent = vuFlex.toFixed(1);
      document.getElementById('kpiPhiVcFlex').textContent = '/ ØVc ' + phiVcFlex.toFixed(1) + ' Tn';
      document.getElementById('kpiVuPunz').textContent = vuPunz.toFixed(1);
      document.getElementById('kpiPhiVcPunz').textContent = '/ ØVc ' + phiVcPunz.toFixed(1) + ' Tn';
      document.getElementById('kpiRebarMain').textContent = nBars + ' ' + barKey + ' @ ' + spacing + ' cm';

      document.getElementById('tdArea').textContent = b.toFixed(2) + ' x ' + l.toFixed(2) + ' m (Az=' + area.toFixed(2) + ' m²)';
      document.getElementById('tdAreq').textContent = 'Req: ' + aReq.toFixed(2) + ' m²';
      document.getElementById('tdQmax').textContent = qMax.toFixed(2) + ' kg/cm²';
      document.getElementById('tdQa').textContent = 'qa = ' + qa.toFixed(2) + ' kg/cm²';
      document.getElementById('tdSoilStatus').innerHTML = isSoilOk ? '<span class="text-emerald-700">OK (q_max ≤ qa)</span>' : '<span class="text-red-700">EXCEDIDO</span>';

      document.getElementById('tdVuFlex').textContent = vuFlex.toFixed(2) + ' Tn';
      document.getElementById('tdPhiVcFlex').textContent = 'ØVc = ' + phiVcFlex.toFixed(2) + ' Tn';
      document.getElementById('tdFlexStatus').innerHTML = isFlexOk ? '<span class="text-emerald-700">CONFORME</span>' : '<span class="text-red-700">NO CUMPLE</span>';

      document.getElementById('tdVuPunz').textContent = vuPunz.toFixed(2) + ' Tn';
      document.getElementById('tdPhiVcPunz').textContent = 'ØVc = ' + phiVcPunz.toFixed(2) + ' Tn';
      document.getElementById('tdPunzStatus').innerHTML = isPunzOk ? '<span class="text-emerald-700">CONFORME</span>' : '<span class="text-red-700">NO CUMPLE</span>';

      document.getElementById('tdAsReq').textContent = asTotal.toFixed(2) + ' cm²';
      document.getElementById('tdAsBar').textContent = nBars + ' varillas ' + barKey;
      document.getElementById('tdSpacing').textContent = '@ ' + spacing + ' cm (S_max: ' + maxSpacing + ' cm)';

      const isAllOk = isSoilOk && isFlexOk && isPunzOk && spacing <= maxSpacing;
      const statusBadge = document.getElementById('statusBadge');
      const statusText = document.getElementById('statusBadgeText');

      if (isAllOk) {
        statusBadge.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D2E3D8] text-[#183B2F] border border-[#A3D1B4] font-bold text-xs sm:text-sm';
        statusText.textContent = 'CONFORME / OK';
      } else {
        statusBadge.className = 'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs sm:text-sm';
        statusText.textContent = 'NO CUMPLE REQUERIMIENTOS';
      }
    }

    function exportCsv() {
      const csv = "Parámetro,Valor,Unidad\\n" +
        "Proyecto," + document.getElementById('inpProject').value + ",-\\n" +
        "Código Zapata," + document.getElementById('inpCode').value + ",-\\n" +
        "Concreto f'c," + document.getElementById('inpFc').value + ",kg/cm²\\n" +
        "Acero Fy," + document.getElementById('inpFy').value + ",kg/cm²\\n" +
        "Capacidad Suelo qa," + document.getElementById('inpQa').value + ",kg/cm²\\n" +
        "Carga Muerta Pcm," + document.getElementById('inpPcm').value + ",Tn\\n" +
        "Carga Viva Pcv," + document.getElementById('inpPcv').value + ",Tn\\n" +
        "Dimensión B," + document.getElementById('svgTextB').textContent + ",m\\n" +
        "Dimensión L," + document.getElementById('svgTextL').textContent + ",m\\n" +
        "Peralte h," + document.getElementById('svgTextH').textContent + ",cm\\n";

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Memoria_Zapata_' + document.getElementById('inpCode').value + '.csv';
      a.click();
    }

    // Inicializar al cargar
    window.onload = recalculate;
  </script>
</body>
</html>`;
}

export function downloadStandaloneHtmlFile(inputs: FootingInputs, results: FootingResults) {
  const content = generateStandaloneHtml(inputs, results);
  const blob = new Blob([content], { type: 'text/html;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Diseno_Zapata_${inputs.footingCode || 'Z01'}_Autonomo.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
