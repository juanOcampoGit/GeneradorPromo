import type { ImageFile } from '../types';

// Let TypeScript know about the global jsPDF object from the CDN
declare const jspdf: any;

export const generatePdf = async (adText: string, images: ImageFile[]): Promise<void> => {
  const { jsPDF } = jspdf;
  const doc = new jsPDF({
    orientation: 'p', // portrait
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  const contentWidth = pageWidth - margin * 2;

  // --- Title Page ---
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(13, 71, 161); // Primary Dark
  doc.text('Anuncio de Propiedad', pageWidth / 2, pageHeight / 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(66, 66, 66); // Neutral Dark
  const generationDate = `Generado el: ${new Date().toLocaleDateString()}`;
  doc.text(generationDate, pageWidth / 2, (pageHeight / 4) + 10, { align: 'center' });

  // --- Ad Text Page ---
  doc.addPage();
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(13, 71, 161);
  doc.text('Descripción del Inmueble', margin, margin + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(66, 66, 66);
  const splitText = doc.splitTextToSize(adText, contentWidth);
  doc.text(splitText, margin, margin + 20);

  // --- Image Pages ---
  for (const image of images) {
    doc.addPage();
    
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(image.file.name, margin, margin);
    
    const img = new Image();
    img.src = image.base64;
    await new Promise(resolve => img.onload = resolve);

    const imgProps = doc.getImageProperties(image.base64);
    const imgWidth = imgProps.width;
    const imgHeight = imgProps.height;
    
    const aspectRatio = imgWidth / imgHeight;

    let displayWidth = contentWidth;
    let displayHeight = displayWidth / aspectRatio;

    const maxDisplayHeight = pageHeight - margin * 3; // Leave space for margin and title

    if (displayHeight > maxDisplayHeight) {
      displayHeight = maxDisplayHeight;
      displayWidth = displayHeight * aspectRatio;
    }
    
    const x = (pageWidth - displayWidth) / 2;
    const y = margin + 15;

    doc.addImage(image.base64, imgProps.fileType, x, y, displayWidth, displayHeight);
  }

  // --- Save ---
  doc.save('anuncio-inmobiliario.pdf');
};