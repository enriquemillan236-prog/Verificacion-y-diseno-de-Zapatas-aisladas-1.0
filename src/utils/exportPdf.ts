import html2pdf from 'html2pdf.js';

export interface ExportPdfOptions {
  filename?: string;
  margin?: [number, number, number, number];
}

/**
 * Genera y descarga directamente un archivo PDF en formato Carta Horizontal (Letter Landscape)
 * apuntando de forma exacta al contenedor de la memoria de cálculo, optimizando el uso de memoria
 * y ejecutando de forma asíncrona mediante promesas para no bloquear el hilo de React.
 */
export async function downloadReportPdf(
  elementId: string,
  options?: ExportPdfOptions
): Promise<boolean> {
  // 1. Selección exacta del DOM del contenedor específico de la memoria de cálculo
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.error(`Contenedor específico con ID "${elementId}" no encontrado en el DOM.`);
    return false;
  }

  // 2. Dar respiro al hilo principal de React para asegurar que el indicador visual se pinte
  await new Promise((resolve) => setTimeout(resolve, 100));

  const rawFilename = options?.filename || 'Memoria_Calculo_Horizontal.pdf';
  const filename = rawFilename.endsWith('.pdf') ? rawFilename : `${rawFilename}.pdf`;

  // 3. Configuración optimizada en memoria (scale: 1 o 1.2) para evitar congelamiento de la pestaña
  const opt = {
    margin: options?.margin || ([6, 8, 6, 8] as [number, number, number, number]),
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.92 },
    html2canvas: {
      scale: 1.2, // Optimización de memoria para evitar saturación de canvas
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      allowTaint: true,
      letterRendering: true,
      scrollX: 0,
      scrollY: 0,
    },
    jsPDF: {
      unit: 'mm',
      format: 'letter',
      orientation: 'landscape' as const,
      compress: true,
    },
    pagebreak: {
      mode: ['css', 'legacy'],
      before: '.page-break-before',
      after: '.page-break-after',
      avoid: '.page-break-inside-avoid',
    },
  };

    // Asegurar que el contenedor sea visible para html2canvas durante la captura
    const parentContainer = targetElement.closest('.fixed') as HTMLElement | null;
    const prevOpacity = parentContainer ? parentContainer.style.opacity : '';
    const prevPointerEvents = parentContainer ? parentContainer.style.pointerEvents : '';
    if (parentContainer) {
      parentContainer.style.opacity = '1';
    }

    const h2pModule: any = (html2pdf as any)?.default || html2pdf;
    const generator =
      typeof h2pModule === 'function'
        ? h2pModule()
        : typeof h2pModule?.default === 'function'
        ? h2pModule.default()
        : null;

    if (!generator) {
      throw new Error('No se pudo inicializar el motor de html2pdf.js en el entorno actual.');
    }

    await new Promise<void>((resolve, reject) => {
      // Temporizador de seguridad para evitar que la UI se bloquee indefinidamente
      const timeoutId = setTimeout(() => {
        reject(new Error('La generación del PDF excedió el tiempo máximo de espera (20s).'));
      }, 20000);

      generator
        .set(opt)
        .from(targetElement)
        .save()
        .then(() => {
          clearTimeout(timeoutId);
          resolve();
        })
        .catch((err: any) => {
          clearTimeout(timeoutId);
          reject(err);
        })
        .finally(() => {
          if (parentContainer) {
            parentContainer.style.opacity = prevOpacity;
            parentContainer.style.pointerEvents = prevPointerEvents;
          }
        });
    });

    return true;
  } catch (error) {
    console.error('Error al generar y descargar PDF directamente:', error);
    return false;
  }
}
