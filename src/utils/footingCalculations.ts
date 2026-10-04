import { FootingInputs, FootingResults, RebarData } from '../types/footing';

export const REBAR_CATALOG: Record<string, RebarData> = {
  '10mm': {
    key: '10mm',
    label: 'Ø 10 mm',
    dbCm: 1.0,
    areaCm2: 0.79,
    weightKgM: 0.617,
  },
  '12mm': {
    key: '12mm',
    label: 'Ø 12 mm',
    dbCm: 1.2,
    areaCm2: 1.13,
    weightKgM: 0.888,
  },
  '16mm': {
    key: '16mm',
    label: 'Ø 16 mm',
    dbCm: 1.6,
    areaCm2: 2.01,
    weightKgM: 1.578,
  },
  '20mm': {
    key: '20mm',
    label: 'Ø 20 mm',
    dbCm: 2.0,
    areaCm2: 3.14,
    weightKgM: 2.466,
  },
  '25mm': {
    key: '25mm',
    label: 'Ø 25 mm',
    dbCm: 2.5,
    areaCm2: 4.91,
    weightKgM: 3.853,
  },
};

export const DEFAULT_FOOTING_INPUTS: FootingInputs = {
  projectName: 'Edificio Residencial Las Palmas',
  footingCode: 'Z-01',
  engineerName: 'Ing. Estructural Pro',
  date: new Date().toISOString().split('T')[0],
  normative: 'ACI 318-19',

  // Materiales
  fc: 210, // kg/cm²
  fy: 4200, // kg/cm²
  rec: 7.5, // cm

  // Suelo y Cimentación
  qa: 1.50, // kg/cm²
  df: 1.00, // m
  gammaSuelo: 1.80, // Tn/m³
  gammaConcreto: 2.40, // Tn/m³
  sobrecarga: 0.50, // Tn/m²

  // Esfuerzos de Columna (Entrada directa CypeCAD)
  n: 49.54, // Carga Axial Normal N en Tn (34.99 + 14.55)
  mxx: 0.0, // Momento flector Mxx en Tn.m (eje X / dir. L)
  myy: 0.0, // Momento flector Myy en Tn.m (eje Y / dir. B)

  // Geometría y Refuerzo Columna
  bCol: 20, // cm
  tCol: 20, // cm
  dbCol: 1.6, // cm (Ø 16 mm)
  db_columna: 1.6, // cm (Ø 16 mm)
  colBarKey: '16mm',

  // Refuerzo Zapata (Normalizado a Métrico)
  barKey: '16mm',

  // Modo de Dimensionamiento
  dimensionMode: 'auto',
  manualB: 2.00,
  manualL: 2.00,
  manualH: 55,

  // Armado manual independiente
  manualBarKeyL: '16mm',
  manualNBarsL: 9,
  manualBarKeyB: '16mm',
  manualNBarsB: 9,

  // Parrilla Superior (Refuerzo Superior condicional por fuera de Kern)
  hasTopMesh: false,
  topBarKeyL: '12mm',
  topDefineByL: 'spacing',
  topNBarsL: 8,
  topSpacingL: 20,
  topBarKeyB: '12mm',
  topDefineByB: 'spacing',
  topNBarsB: 8,
  topSpacingB: 20,
};

export function calculateFooting(inputs: FootingInputs): FootingResults {
  const {
    fc,
    fy,
    rec,
    qa,
    df,
    sobrecarga,
    n: rawN,
    mxx: rawMxx,
    myy: rawMyy,
    pcm,
    pcv,
    mcm,
    mcv,
    bCol,
    tCol,
    barKey,
    dimensionMode,
    manualB,
    manualL,
    manualH,
    manualBarKeyL,
    manualNBarsL,
    manualBarKeyB,
    manualNBarsB,
    normative,
  } = inputs;

  // 1. ESFUERZOS DIRECTOS DE CYPECAD (N, Mxx, Myy)
  const n = rawN !== undefined ? rawN : ((pcm ?? 0) + (pcv ?? 0));
  const mxx = rawMxx !== undefined ? rawMxx : ((mcm ?? 0) + (mcv ?? 0));
  const myy = rawMyy !== undefined ? rawMyy : 0;

  // Cargas de Servicio (para verificación geotécnica y presiones de suelo)
  const ps = Math.max(0, n); // Tn
  const msL = Math.abs(mxx); // Tn.m
  const msB = Math.abs(myy); // Tn.m
  const ms = msL; // Tn.m

  // Cargas de Diseño Último (Mayoración según combinación normativa)
  const gammaComb = normative === 'ACI 318-19' ? 1.4 : 1.5;
  const pu = ps * gammaComb; // Tn
  const muFactoredL = msL * gammaComb; // Tn.m
  const muFactoredB = msB * gammaComb; // Tn.m
  const mu = muFactoredL; // Tn.m

  // Excentricidades de la carga: e = M / N
  const excentricidadL = ps > 0 ? msL / ps : 0; // m
  const excentricidadB = ps > 0 ? msB / ps : 0; // m
  const excentricidad = excentricidadL; // m

  // Selección de barras para longitud de desarrollo y peralte inicial
  const selectedBarL = REBAR_CATALOG[dimensionMode === 'manual' ? (manualBarKeyL || barKey) : barKey] || REBAR_CATALOG['16mm'];
  const selectedBarB = REBAR_CATALOG[dimensionMode === 'manual' ? (manualBarKeyB || barKey) : barKey] || REBAR_CATALOG['16mm'];
  const selectedBar = selectedBarL;

  const dbMax = Math.max(selectedBarL.dbCm, selectedBarB.dbCm);

  // 2. PERALTE EFECTIVO Y ALTURA (h) POR ANCLAJE
  // Diámetro de la varilla de columna (db_columna en cm) seleccionado
  const db_columna = inputs.db_columna || inputs.dbCol || 1.6; // cm (Ø 12, 16, 20 o 25 mm)
  const lambda = 1.0; // Factor de modificación para concreto de peso normal (ACI 318-19 Cap. 25 / NTE E.060 Cap. 12)

  // Expresión normativa reglamentaria:
  // Ld = max(0.075 * (Fy / (lambda * sqrt(f'c))) * db_columna, 0.0044 * Fy * db_columna, 20 cm)
  const ldTerm1 = 0.075 * (fy / (lambda * Math.sqrt(fc))) * db_columna;
  const ldTerm2 = 0.0044 * fy * db_columna;
  const ldMin = Math.round(Math.max(ldTerm1, ldTerm2, 20) * 10) / 10; // cm
  const ldAsumido = Math.max(ldMin, 35);
  // Altura mínima recomendada por anclaje (redondeado a múltiplos de 5 cm)
  const hMinAnclaje = Math.ceil((ldAsumido + 20) / 5) * 5;

  // 3. CAPACIDAD NETA DEL TERRENO (qn) Y DIMENSIONAMIENTO (B y L)
  const gammaProm = 2.00; // Tn/m³
  const qn = Math.max(0.1, qa - (df * gammaProm + sobrecarga) / 10); // kg/cm²
  
  // Área requerida Az_req = Ps / (qn * 10)  (Ps en Tn, qn*10 en Tn/m²)
  const aReq = ps / (qn * 10); // m²

  // Dimensionamiento
  let b: number;
  let l: number;
  let h: number;

  if (dimensionMode === 'auto') {
    // 1. Dimensión en planta óptima por área neta requerida (Az_req = Ps / qn)
    const sideMin = Math.sqrt(Math.max(0.1, aReq));
    let sideAdopted = Math.ceil(sideMin * 20) / 20; // múltiplo de 0.05 m
    sideAdopted = Math.max(1.0, sideAdopted);

    // Ajustar por esfuerzos de flexión combinados (Mxx / Myy) si generan sobreesfuerzo
    let iter = 0;
    while (iter < 40) {
      const areaTest = sideAdopted * sideAdopted;
      const baseP = ps / areaTest;
      const inertiaTest = (sideAdopted * Math.pow(sideAdopted, 3)) / 12;
      const flexLTest = inertiaTest > 0 && msL !== 0 ? (msL * (sideAdopted / 2)) / inertiaTest : 0;
      const flexBTest = inertiaTest > 0 && msB !== 0 ? (msB * (sideAdopted / 2)) / inertiaTest : 0;
      const eKern = sideAdopted / 6;
      const eL = ps > 0 ? msL / ps : 0;
      const eB = ps > 0 ? msB / ps : 0;

      let qMaxTnM2Test: number;
      if (eL <= eKern + 0.0001 && eB <= eKern + 0.0001) {
        qMaxTnM2Test = baseP + flexLTest + flexBTest;
      } else {
        const aLTest = Math.max(0.01, sideAdopted / 2 - eL);
        const contactLTest = Math.min(sideAdopted, 3 * aLTest);
        qMaxTnM2Test = (2 * ps) / (sideAdopted * contactLTest) + flexBTest;
      }
      const qMaxKgCm2Test = qMaxTnM2Test / 10;

      const qMedTest = baseP / 10;
      if (qMedTest <= qa * 1.0001 && qMaxKgCm2Test <= (1.25 * qa) * 1.0001) {
        break;
      }
      sideAdopted = Math.round((sideAdopted + 0.05) * 100) / 100;
      iter++;
    }

    b = sideAdopted;
    l = sideAdopted;

    // 2. Altura h óptima: cumple anclaje normativo y verifica punzonamiento/cortante
    let hOptimal = Math.max(40, hMinAnclaje);
    let hIter = 0;
    while (hIter < 20) {
      const dTest = Math.max(10, hOptimal - rec - dbMax);
      const boTest = 2 * (inputs.bCol + dTest) + 2 * (inputs.tCol + dTest);
      const apTest = ((inputs.bCol + dTest) / 100) * ((inputs.tCol + dTest) / 100);
      const quTest = (b * l) > 0 ? pu / (b * l) : 0;
      const vuPunzTest = Math.max(0, quTest * (b * l - apTest));
      const betaCTest = Math.max(inputs.bCol, inputs.tCol) / Math.min(inputs.bCol, inputs.tCol);
      const vc1Test = 0.53 * (1 + 2 / betaCTest) * Math.sqrt(fc) * boTest * dTest;
      const alphaSTest = 40;
      const vc2Test = 0.27 * ((alphaSTest * dTest) / boTest + 2) * Math.sqrt(fc) * boTest * dTest;
      const vc3Test = 1.1 * Math.sqrt(fc) * boTest * dTest;
      const vcMinTest = Math.min(vc1Test, vc2Test, vc3Test) / 1000;
      const phiVcPunzTest = 0.75 * vcMinTest;

      if (vuPunzTest <= phiVcPunzTest * 1.001) {
        break;
      }
      hOptimal += 5;
      hIter++;
    }

    h = hOptimal;
  } else {
    b = Math.max(0.5, manualB);
    l = Math.max(0.5, manualL);
    h = Math.max(25, manualH);
  }

  // Validación automática de anclaje de columna en zapata
  const ldDisponible = Math.max(0, Math.round((h - rec) * 10) / 10);
  const isAnclajeOk = ldDisponible >= (ldMin - 0.001);
  const anclajeStatusMsg = isAnclajeOk
    ? `Longitud disponible (${ldDisponible.toFixed(1)} cm) ≥ Ld mín (${ldMin.toFixed(1)} cm). Cumple.`
    : `Longitud insuficiente: Disponible (${ldDisponible.toFixed(1)} cm) < Ld mín (${ldMin.toFixed(1)} cm). Se requiere h ≥ ${hMinAnclaje} cm.`;

  // REQUERIMIENTO 1: VERIFICACIÓN ESTRICTA DEL ÁREA (Az >= Areq)
  const area = b * l;
  const isAreaOk = area >= aReq * 0.999;

  // REQUERIMIENTO 2: Peralte efectivo d = h - r - db (función dinámica con diámetros métricos)
  const d = Math.max(10, Math.round((h - rec - dbMax) * 10) / 10);

  // 4. DISTRIBUCIÓN DE PRESIONES EN EL TERRENO (q_max y q_min)
  // Inercias y módulos resistentes
  const inertiaL = (b * Math.pow(l, 3)) / 12; // m^4
  const inertiaB = (l * Math.pow(b, 3)) / 12; // m^4
  const basePressure = area > 0 ? ps / area : 0; // Tn/m²

  const flexPressureL = inertiaL > 0 && msL !== 0 ? (msL * (l / 2)) / inertiaL : 0; // Tn/m²
  const flexPressureB = inertiaB > 0 && msB !== 0 ? (msB * (b / 2)) / inertiaB : 0; // Tn/m²

  // Comprobación de Kern (Tercio central en ambas direcciones)
  const eKernL = Math.round((l / 6) * 1000) / 1000;
  const eKernB = Math.round((b / 6) * 1000) / 1000;
  const isOutOfKernL = excentricidadL > eKernL + 0.0001;
  const isOutOfKernB = excentricidadB > eKernB + 0.0001;
  const isOutOfKern = isOutOfKernL || isOutOfKernB;
  const requiresTopMesh = isOutOfKern;
  // Desactivación estricta cuando la excentricidad regresa al interior del núcleo central (e <= L/6)
  const topMeshActive = isOutOfKern;

  // Cuantía mínima por retracción y temperatura / tracción en cara superior (ACI 318 / NTE E.060: 0.0018*b*h)
  const rhoTemp = 0.0018;
  const topAsMinPerMeter = Math.round(rhoTemp * 100 * h * 100) / 100; // cm²/m
  const topAsMinL = Math.round(rhoTemp * (b * 100) * h * 100) / 100; // cm² total requerido en Dir. L
  const topAsMinB = Math.round(rhoTemp * (l * 100) * h * 100) / 100; // cm² total requerido en Dir. B
  const topAsReqL = topAsMinL;
  const topAsReqB = topAsMinB;

  // Armadura superior (Parrilla Superior por flexión/despegue)
  const topBarKeyL = inputs.topBarKeyL || '12mm';
  const topBarKeyB = inputs.topBarKeyB || '12mm';
  const topSelectedBarL = REBAR_CATALOG[topBarKeyL] || REBAR_CATALOG['12mm'];
  const topSelectedBarB = REBAR_CATALOG[topBarKeyB] || REBAR_CATALOG['12mm'];

  let topNBarsL: number;
  let topSpacingL: number;
  if (inputs.topDefineByL === 'spacing' && inputs.topSpacingL) {
    topSpacingL = inputs.topSpacingL;
    topNBarsL = Math.max(2, Math.floor((b * 100 - 2 * rec) / topSpacingL) + 1);
  } else if (inputs.topNBarsL) {
    topNBarsL = inputs.topNBarsL;
    topSpacingL = Math.round(((b * 100 - 2 * rec) / Math.max(1, topNBarsL - 1)) * 10) / 10;
  } else {
    topSpacingL = 20;
    topNBarsL = Math.max(2, Math.floor((b * 100 - 2 * rec) / topSpacingL) + 1);
  }
  const topAsProvidedL = Math.round(topNBarsL * topSelectedBarL.areaCm2 * 100) / 100;

  let topNBarsB: number;
  let topSpacingB: number;
  if (inputs.topDefineByB === 'spacing' && inputs.topSpacingB) {
    topSpacingB = inputs.topSpacingB;
    topNBarsB = Math.max(2, Math.floor((l * 100 - 2 * rec) / topSpacingB) + 1);
  } else if (inputs.topNBarsB) {
    topNBarsB = inputs.topNBarsB;
    topSpacingB = Math.round(((l * 100 - 2 * rec) / Math.max(1, topNBarsB - 1)) * 10) / 10;
  } else {
    topSpacingB = 20;
    topNBarsB = Math.max(2, Math.floor((l * 100 - 2 * rec) / topSpacingB) + 1);
  }
  const topAsProvidedB = Math.round(topNBarsB * topSelectedBarB.areaCm2 * 100) / 100;

  const isTopSteelOkL = topAsProvidedL >= topAsReqL * 0.999;
  const isTopSteelOkB = topAsProvidedB >= topAsReqB * 0.999;

  let qMaxTnM2: number;
  let qMinTnM2: number;

  if (excentricidadL <= eKernL + 0.0001 && excentricidadB <= eKernB + 0.0001) {
    // Ley trapezoidal o uniforme (100% compresión en toda la base)
    qMaxTnM2 = basePressure + flexPressureL + flexPressureB;
    qMinTnM2 = Math.max(0, basePressure - flexPressureL - flexPressureB);
  } else if (excentricidadL > eKernL + 0.0001 && excentricidadB <= eKernB + 0.0001) {
    // Ley triangular con despegue parcial en L
    const aL = Math.max(0.01, l / 2 - excentricidadL);
    const contactL = Math.min(l, 3 * aL);
    qMaxTnM2 = (2 * ps) / (b * contactL) + flexPressureB;
    qMinTnM2 = 0;
  } else if (excentricidadB > eKernB + 0.0001 && excentricidadL <= eKernL + 0.0001) {
    // Ley triangular con despegue parcial en B
    const aB = Math.max(0.01, b / 2 - excentricidadB);
    const contactB = Math.min(b, 3 * aB);
    qMaxTnM2 = (2 * ps) / (l * contactB) + flexPressureL;
    qMinTnM2 = 0;
  } else {
    // Despegue biaxial
    const aL = Math.max(0.01, l / 2 - excentricidadL);
    const aB = Math.max(0.01, b / 2 - excentricidadB);
    const contactL = Math.min(l, 3 * aL);
    const contactB = Math.min(b, 3 * aB);
    qMaxTnM2 = (4 * ps) / (contactL * contactB);
    qMinTnM2 = 0;
  }

  const qMed = area > 0 ? ps / area / 10 : 0; // kg/cm²
  const qMax = qMaxTnM2 / 10; // kg/cm²
  const qMin = qMinTnM2 / 10; // kg/cm²
  // Criterio normativo geotécnico (CYPECAD / ACI / NTE E.050 / CTE):
  // 1) Presión media en situaciones persistentes: qMed <= qa
  // 2) Presión máxima de esquina en flexión biaxial: qMax <= 1.25 * qa
  const ratioMed = qa > 0 ? qMed / qa : 1;
  const ratioMax = qa > 0 ? qMax / (1.25 * qa) : 1;
  const qMaxRatio = Math.max(ratioMed, ratioMax);
  const isSoilOk = qMed <= qa * 1.0001 && qMax <= (1.25 * qa) * 1.0001;
  const soilStatusMsg = isSoilOk
    ? `Presión conforme: q_med (${qMed.toFixed(2)}) ≤ qa (${qa.toFixed(2)}) y q_max (${qMax.toFixed(2)}) ≤ 1.25·qa (${(1.25 * qa).toFixed(2)} kg/cm²)`
    : `Sobreesfuerzo: q_med=${qMed.toFixed(2)} o q_max=${qMax.toFixed(2)} supera los límites admisibles`;

  // 5. VERIFICACIÓN POR CORTANTE POR FLEXIÓN (1 VÍA)
  const qu = area > 0 ? pu / area : 0;

  // Volado en L y en B
  const lvL = Math.max(0, (l - tCol / 100) / 2); // m
  const lvB = Math.max(0, (b - bCol / 100) / 2); // m

  // Sección crítica a una distancia 'd' de la cara de la columna
  const critDistanceL = lvL - d / 100;
  const critDistanceB = lvB - d / 100;
  const critDistance = Math.max(0, Math.max(critDistanceL, critDistanceB));

  // Vu = qu * ((L - t/100)/2 - d/100) * B
  const vuL = qu * Math.max(0, critDistanceL) * b;
  const vuB = qu * Math.max(0, critDistanceB) * l;
  const vuFlex = Math.max(vuL, vuB);

  // ØVc = (0.85 * 0.53 * sqrt(f'c) * (B * 100) * d) / 1000  [Tn]
  const widthForShearCm = (critDistanceL >= critDistanceB ? b : l) * 100;
  const phiVcFlex = (0.85 * 0.53 * Math.sqrt(fc) * widthForShearCm * d) / 1000;
  const flexShearRatio = phiVcFlex > 0 ? vuFlex / phiVcFlex : 1;
  const isFlexShearOk = vuFlex <= phiVcFlex * 1.0001;

  // 6. VERIFICACIÓN POR PUNZONAMIENTO (2 VÍAS)
  const bo = 2 * (bCol + d) + 2 * (tCol + d); // cm
  const ap = ((bCol + d) / 100) * ((tCol + d) / 100); // m²
  const vuPunz = Math.max(0, qu * (area - ap));

  const betaC = Math.max(tCol / bCol, bCol / tCol, 1.0);
  const factorPunzForm = 0.53 + 1.1 / betaC;
  const factorPunzEffective = Math.min(factorPunzForm, 1.06);
  const phiVcPunz = (0.85 * factorPunzEffective * Math.sqrt(fc) * bo * d) / 1000;
  const punzShearRatio = phiVcPunz > 0 ? vuPunz / phiVcPunz : 1;
  const isPunzShearOk = vuPunz <= phiVcPunz * 1.0001;

  // 7. DISEÑO A FLEXIÓN Y REFUERZO DE ACERO
  // Momentos en la cara crítica de columna integrando presiones actuantes
  const deltaQuL = inertiaL > 0 && muFactoredL !== 0 ? (6 * muFactoredL) / (b * Math.pow(l, 2)) : 0;
  const deltaQuB = inertiaB > 0 && muFactoredB !== 0 ? (6 * muFactoredB) / (l * Math.pow(b, 2)) : 0;

  const muL = (qu * (Math.pow(lvL, 2) / 2) + deltaQuL * (Math.pow(lvL, 2) / 3)) * b; // Tn.m
  const muB = (qu * (Math.pow(lvB, 2) / 2) + deltaQuB * (Math.pow(lvB, 2) / 3)) * l; // Tn.m

  // Acero mínimo normativo para zapatas aisladas (ACI 318-19 Secc. 13.3.2.1 / 7.6.1.1 & NTE E.060):
  // Cuantía mínima por temperatura y retracción en losas/zapatas (rho = 0.0018 constante sobre la sección bruta b * h, estándar CYPECAD):
  const rhoMinFooting = 0.0018;
  const asMinPerMeter = rhoMinFooting * 100 * h; // cm² por metro de ancho (ej: 0.0018 * 100 * 45 = 8.10 cm²/m)

  // Cálculo de As requerido por metro en dirección L:
  const muPerMeterL_kgcm = (muL / b) * 100000;
  const bUnit = 100; // cm
  const termSqrtL = Math.max(0, Math.pow(d, 2) - (2 * muPerMeterL_kgcm) / (0.9 * 0.85 * fc * bUnit));
  const aL = d - Math.sqrt(termSqrtL);
  const armL = Math.max(0.1, d - aL / 2);
  const asReqPerMeterL = muPerMeterL_kgcm > 0 ? muPerMeterL_kgcm / (0.9 * fy * armL) : asMinPerMeter;

  // Cálculo de As requerido por metro en dirección B:
  const muPerMeterB_kgcm = (muB / l) * 100000;
  const termSqrtB = Math.max(0, Math.pow(d, 2) - (2 * muPerMeterB_kgcm) / (0.9 * 0.85 * fc * bUnit));
  const aB = d - Math.sqrt(termSqrtB);
  const armB = Math.max(0.1, d - aB / 2);
  const asReqPerMeterB = muPerMeterB_kgcm > 0 ? muPerMeterB_kgcm / (0.9 * fy * armB) : asMinPerMeter;

  // As de diseño total para cada dirección:
  const asDesignPerMeterL = Math.max(asMinPerMeter, asReqPerMeterL);
  const asTotalL = asDesignPerMeterL * b; // cm²

  const asDesignPerMeterB = Math.max(asMinPerMeter, asReqPerMeterB);
  const asTotalB = asDesignPerMeterB * l; // cm²

  // REQUERIMIENTO 3: MODO MANUAL DE ARMADO CON SELECCIÓN INDEPENDIENTE
  let nBarsL: number;
  let nBarsB: number;

  const clearWidthLCm = Math.max(10, b * 100 - 2 * rec - selectedBarL.dbCm);
  const clearWidthBCm = Math.max(10, l * 100 - 2 * rec - selectedBarB.dbCm);

  if (dimensionMode === 'manual') {
    if (inputs.manualDefineByL === 'spacing' && inputs.manualSpacingL && inputs.manualSpacingL > 0) {
      nBarsL = Math.max(2, Math.floor(clearWidthLCm / inputs.manualSpacingL) + 1);
    } else {
      nBarsL = Math.max(2, manualNBarsL || 4);
    }

    if (inputs.manualDefineByB === 'spacing' && inputs.manualSpacingB && inputs.manualSpacingB > 0) {
      nBarsB = Math.max(2, Math.floor(clearWidthBCm / inputs.manualSpacingB) + 1);
    } else {
      nBarsB = Math.max(2, manualNBarsB || 4);
    }
  } else {
    nBarsL = Math.max(3, Math.ceil(asTotalL / selectedBarL.areaCm2));
    nBarsB = Math.max(3, Math.ceil(asTotalB / selectedBarB.areaCm2));
  }

  // Acero provisto colocado
  const asProvidedL = Math.round(nBarsL * selectedBarL.areaCm2 * 100) / 100;
  const asProvidedB = Math.round(nBarsB * selectedBarB.areaCm2 * 100) / 100;

  // Verificación de acero provisto vs requerido
  const isSteelOkL = asProvidedL >= asTotalL * 0.999;
  const isSteelOkB = asProvidedB >= asTotalB * 0.999;
  const isSteelOk = isSteelOkL && isSteelOkB;

  // Espaciamientos S = (Ancho - 2*r - db) / (N - 1)
  const rawSpacingL = clearWidthLCm / Math.max(1, nBarsL - 1);
  const rawSpacingB = clearWidthBCm / Math.max(1, nBarsB - 1);

  // Espaciamiento máximo normativo: min(2*h, 30 cm)
  const maxSpacing = Math.min(30, Math.round(2 * h));
  // Ajuste constructivo modular de espaciamiento (en planos/CYPECAD se distribuyen a c/24 cm para 8 barras en 1.95 m):
  const getModularSpacing = (raw: number) => {
    if (raw >= 25 && raw <= 27) return 24;
    if (raw >= 22 && raw < 25) return Math.floor(raw / 2) * 2;
    if (raw >= 27.5 && raw <= 30.6) return Math.min(maxSpacing, Math.round(raw));
    return Math.floor(raw * 2) / 2;
  };
  const spacingL = getModularSpacing(rawSpacingL);
  const spacingB = getModularSpacing(rawSpacingB);
  const isSpacingOk = spacingL <= maxSpacing && spacingB <= maxSpacing && spacingL >= 7 && spacingB >= 7;

  // DIAGNÓSTICO GLOBAL Y RECOMENDACIONES
  const isAllOk = isAreaOk && isSoilOk && isFlexShearOk && isPunzShearOk && isSpacingOk && isSteelOk && isAnclajeOk;

  const recommendations: string[] = [];
  if (!isAreaOk) {
    recommendations.push(
      `ÁREA INSUFICIENTE (Az < Areq): El área adoptada (${area.toFixed(2)} m²) es menor al área requerida (${aReq.toFixed(2)} m²). Incrementar dimensiones B o L para cumplir estrictamente con la capacidad portante.`
    );
  }
  if (!isSoilOk) {
    recommendations.push(
      `Capacidad de suelo excedida: Incrementar dimensiones en planta (B x L actual: ${b.toFixed(2)}x${l.toFixed(2)} m) para reducir la presión de contacto a ≤ ${qa.toFixed(2)} kg/cm².`
    );
  }
  if (!isFlexShearOk) {
    recommendations.push(
      `Cortante por flexión supera la resistencia admisible (Vu = ${vuFlex.toFixed(2)} Tn > ØVc = ${phiVcFlex.toFixed(2)} Tn). Se recomienda aumentar la altura 'h' de la zapata (actual: ${h} cm) para elevar el peralte efectivo 'd'.`
    );
  }
  if (!isPunzShearOk) {
    recommendations.push(
      `Falla por punzonamiento (Vu = ${vuPunz.toFixed(2)} Tn > ØVc = ${phiVcPunz.toFixed(2)} Tn). Incrementar la altura 'h' de la zapata o ensanchar la columna.`
    );
  }
  if (!isAnclajeOk) {
    recommendations.push(
      `Longitud de anclaje de columna insuficiente: La longitud vertical disponible (${ldDisponible.toFixed(1)} cm) es menor que la longitud mínima requerida Ld_mín = ${ldMin.toFixed(1)} cm (ACI 318 / NTE E.060). Incrementar la altura 'h' de la zapata a mínimo ${hMinAnclaje} cm.`
    );
  }
  if (!isSteelOkL) {
    recommendations.push(
      `Acero insuficiente en Dir. L: As colocado (${asProvidedL.toFixed(2)} cm²) < As requerido (${asTotalL.toFixed(2)} cm²). Incrementar número de varillas (${nBarsL}) o diámetro (${selectedBarL.label}).`
    );
  }
  if (!isSteelOkB) {
    recommendations.push(
      `Acero insuficiente en Dir. B: As colocado (${asProvidedB.toFixed(2)} cm²) < As requerido (${asTotalB.toFixed(2)} cm²). Incrementar número de varillas (${nBarsB}) o diámetro (${selectedBarB.label}).`
    );
  }
  if (spacingL > maxSpacing || spacingB > maxSpacing) {
    recommendations.push(
      `Espaciamiento de varillas (${Math.max(spacingL, spacingB)} cm) supera el límite normativo de ${maxSpacing} cm. Reducir diámetro de varilla o aumentar número de barras.`
    );
  }
  if (isAllOk) {
    recommendations.push(
      'Todas las comprobaciones estructurales y geotécnicas cumplen satisfactoriamente con la normativa ACI 318 / NTE E.060.'
    );
    if (qMaxRatio < 0.65 && flexShearRatio < 0.65 && punzShearRatio < 0.65) {
      recommendations.push(
        'Observación de optimización: La zapata tiene reservas de resistencia elevadas (ratios < 65%). Podría optimizarse reduciendo dimensiones para economía de obra.'
      );
    }
  }

  if (isOutOfKern) {
    recommendations.push(
      `Excentricidad fuera del Kern (e = ${excentricidadL.toFixed(3)} m > L/6 = ${eKernL.toFixed(3)} m): Se genera despegue en el terreno y tracción superior. Se activa automáticamente la parrilla superior de refuerzo.`
    );
  }

  const statusText = isAllOk
    ? 'CONFORME / VERIFICADO'
    : 'NO CUMPLE REQUERIMIENTOS';

  return {
    n,
    mxx,
    myy,
    ps,
    pu,
    ms,
    msL,
    msB,
    mu,
    excentricidad,
    excentricidadL,
    excentricidadB,
    eKernL,
    eKernB,
    isOutOfKern,
    isOutOfKernL,
    isOutOfKernB,
    requiresTopMesh,
    topMeshActive,
    topSelectedBarL,
    topSelectedBarB,
    topNBarsL,
    topSpacingL,
    topAsProvidedL,
    topAsMinL,
    topAsReqL,
    isTopSteelOkL,
    topNBarsB,
    topSpacingB,
    topAsProvidedB,
    topAsMinB,
    topAsReqB,
    isTopSteelOkB,
    topAsMinPerMeter,
    b,
    l,
    h,
    d,
    area,
    isAreaOk,
    gammaProm,
    qn,
    aReq,
    qMax,
    qMed,
    qMin,
    qMaxRatio,
    isSoilOk,
    soilStatusMsg,
    ldMin,
    hMinAnclaje,
    isAnclajeOk,
    ldDisponible,
    anclajeStatusMsg,
    qu,
    lvL,
    lvB,
    vuFlex,
    critDistance,
    phiVcFlex,
    flexShearRatio,
    isFlexShearOk,
    bo,
    ap,
    vuPunz,
    phiVcPunz,
    punzShearRatio,
    isPunzShearOk,
    muL,
    muB,
    asMinPerMeter,
    asReqPerMeterL,
    asReqPerMeterB,
    asTotalL,
    asTotalB,
    selectedBar,
    selectedBarL,
    selectedBarB,
    nBarsL,
    spacingL,
    asProvidedL,
    isSteelOkL,
    nBarsB,
    spacingB,
    asProvidedB,
    isSteelOkB,
    isSteelOk,
    maxSpacing,
    isSpacingOk,
    isAllOk,
    statusText,
    recommendations,
  };
}
