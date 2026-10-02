export interface FootingInputs {
  // Proyecto
  projectName: string;
  footingCode: string;
  engineerName: string;
  date: string;
  normative: 'ACI 318-19' | 'NTE E.060';

  // Materiales
  fc: number; // Resistencia a compresión f'c en kg/cm² (ej: 210)
  fy: number; // Límite de fluencia Fy en kg/cm² (ej: 4200)
  rec: number; // Recubrimiento r en cm (ej: 7.5)

  // Suelo y Cimentación
  qa: number; // Capacidad portante admisible en kg/cm² (ej: 1.5)
  df: number; // Profundidad de desplante Df en m (ej: 1.0)
  gammaSuelo: number; // Peso específico del suelo en Tn/m³ (ej: 1.80)
  gammaConcreto: number; // Peso específico del concreto en Tn/m³ (ej: 2.40)
  sobrecarga: number; // Sobrecarga s/c sobre el terreno en Tn/m² (ej: 0.50)

  // Esfuerzos de Columna (Entrada directa CypeCAD)
  n: number; // Carga Axial Normal N en Tn (ej: 49.54)
  mxx: number; // Momento flector en el eje X (Mxx) en Tn.m (ej: 0.0)
  myy: number; // Momento flector en el eje Y (Myy) en Tn.m (ej: 0.0)

  // Compatibilidad anterior opcional
  pcm?: number;
  pcv?: number;
  mcm?: number;
  mcv?: number;

  // Geometría y Refuerzo de Columna
  bCol: number; // Lado de columna b en cm (ej: 20)
  tCol: number; // Lado de columna t en cm (ej: 20)
  dbCol: number; // Diámetro de varilla de columna en cm
  db_columna: number; // Diámetro de varilla de columna en cm (Ø 12, 16, 20, 25 mm)
  colBarKey?: string; // Selector de varilla de columna: '12mm' | '16mm' | '20mm' | '25mm'

  // Refuerzo Zapata (Métrico)
  barKey: string; // '10mm' | '12mm' | '16mm' | '20mm' | '25mm'

  // Parrilla Superior (Refuerzo Superior condicional por fuera de Kern)
  hasTopMesh?: boolean;
  topBarKeyL?: string;
  topDefineByL?: 'count' | 'spacing';
  topNBarsL?: number;
  topSpacingL?: number;
  topBarKeyB?: string;
  topDefineByB?: 'count' | 'spacing';
  topNBarsB?: number;
  topSpacingB?: number;

  // Modo de Dimensionamiento
  dimensionMode: 'auto' | 'manual';
  manualB: number; // en m
  manualL: number; // en m
  manualH: number; // en cm

  // Armado manual independiente por dirección
  manualBarKeyL: string; // '10mm' | '12mm' | '16mm' | '20mm' | '25mm'
  manualDefineByL?: 'count' | 'spacing';
  manualNBarsL: number;
  manualSpacingL?: number;
  manualBarKeyB: string; // '10mm' | '12mm' | '16mm' | '20mm' | '25mm'
  manualDefineByB?: 'count' | 'spacing';
  manualNBarsB: number;
  manualSpacingB?: number;
}

export interface RebarData {
  key: string;
  label: string;
  dbCm: number;
  areaCm2: number;
  weightKgM: number;
}

export interface FootingResults {
  // Cargas y Esfuerzos (CypeCAD)
  n: number; // Carga Axial Normal N en Tn
  mxx: number; // Momento flector Mxx en Tn.m
  myy: number; // Momento flector Myy en Tn.m
  ps: number; // Carga de servicio Tn (= N)
  pu: number; // Carga última Tn
  ms: number; // Momento de servicio en Tn.m
  msL: number; // Momento en L (Mxx) en Tn.m
  msB: number; // Momento en B (Myy) en Tn.m
  mu: number; // Momento último Tn.m
  excentricidad: number; // e en m (dirección crítica L)
  excentricidadL: number; // e_L = |Mxx| / N en m
  excentricidadB: number; // e_B = |Myy| / N en m
  eKernL: number; // L / 6 en m (límite del tercio central)
  eKernB: number; // B / 6 en m (límite del tercio central)
  isOutOfKern: boolean; // excentricidad supera el núcleo central (e > L/6 o e > B/6)
  isOutOfKernL: boolean; // excentricidad en L fuera del núcleo
  isOutOfKernB: boolean; // excentricidad en B fuera del núcleo
  requiresTopMesh: boolean; // true si está fuera del núcleo central (requiere parrilla superior)
  topMeshActive: boolean; // true si se calcula o habilita parrilla superior
  topSelectedBarL: RebarData;
  topSelectedBarB: RebarData;
  topNBarsL: number;
  topSpacingL: number;
  topAsProvidedL: number;
  topAsMinL: number; // As mín superior por temperatura/tracción en L (0.0018 * B * h) en cm²
  topAsReqL: number; // As requerido superior en L
  isTopSteelOkL: boolean;
  topNBarsB: number;
  topSpacingB: number;
  topAsProvidedB: number;
  topAsMinB: number; // As mín superior por temperatura/tracción en B (0.0018 * L * h) en cm²
  topAsReqB: number; // As requerido superior en B
  isTopSteelOkB: boolean;
  topAsMinPerMeter: number; // cm²/m (0.0018 * 100 * h)

  // Dimensiones adoptadas
  b: number; // Ancho B en m
  l: number; // Largo L en m
  h: number; // Altura h en cm
  d: number; // Peralte efectivo d en cm
  area: number; // B * L en m²
  isAreaOk: boolean; // Az >= Areq estricto

  // Geotecnia y Presiones
  gammaProm: number; // Tn/m³
  qn: number; // Capacidad neta en kg/cm²
  aReq: number; // Área requerida en m²
  qMax: number; // Presión máxima en kg/cm²
  qMin: number; // Presión mínima en kg/cm²
  qMaxRatio: number; // qMax / qa
  isSoilOk: boolean;
  soilStatusMsg: string;

  // Anclaje de columna (ACI 318 / NTE E.060)
  ldMin: number; // Longitud de desarrollo requerida en cm
  hMinAnclaje: number; // Altura mínima recomendada por anclaje en cm
  isAnclajeOk: boolean; // Validación automática de longitud de anclaje disponible vs mínima
  ldDisponible: number; // Longitud vertical disponible en zapata (h - rec) en cm
  anclajeStatusMsg: string; // Mensaje descriptivo de verificación de anclaje

  // Cortante por Flexión (1 vía)
  qu: number; // Presión última neta de contacto en Tn/m²
  lvL: number; // Volado en dirección L en m
  lvB: number; // Volado en dirección B en m
  vuFlex: number; // Cortante último actuante a distancia d en Tn
  critDistance: number; // Distancia crítica desde el borde en m
  phiVcFlex: number; // Resistencia de diseño al corte ØVc en Tn
  flexShearRatio: number; // Vu / ØVc
  isFlexShearOk: boolean;

  // Punzonamiento (2 vías)
  bo: number; // Perímetro crítico en cm
  ap: number; // Área crítica de punzonamiento en m²
  vuPunz: number; // Cortante por punzonamiento actuante en Tn
  phiVcPunz: number; // Resistencia al punzonamiento ØVc en Tn
  punzShearRatio: number; // Vu / ØVc
  isPunzShearOk: boolean;

  // Diseño de Acero a Flexión
  muL: number; // Momento de diseño en L en Tn.m
  muB: number; // Momento de diseño en B en Tn.m
  asMinPerMeter: number; // cm²/m
  asReqPerMeterL: number; // cm²/m
  asReqPerMeterB: number; // cm²/m
  asTotalL: number; // cm² total requerido para ancho B
  asTotalB: number; // cm² total requerido para largo L
  
  // Detalle de varillas
  selectedBar: RebarData;
  selectedBarL: RebarData;
  selectedBarB: RebarData;
  nBarsL: number; // Número de varillas en dir L
  spacingL: number; // Espaciamiento s en cm
  asProvidedL: number; // Acero colocado en L (cm²)
  isSteelOkL: boolean; // asProvidedL >= asTotalL
  nBarsB: number; // Número de varillas en dir B
  spacingB: number; // Espaciamiento s en cm
  asProvidedB: number; // Acero colocado en B (cm²)
  isSteelOkB: boolean; // asProvidedB >= asTotalB
  isSteelOk: boolean;
  maxSpacing: number; // Espaciamiento máximo normativo en cm (min(2h, 30cm))
  isSpacingOk: boolean;

  // Diagnóstico Global
  isAllOk: boolean;
  statusText: string;
  recommendations: string[];
}
