import jsPDF from 'jspdf';

export const generateReportPDF = (report, imageUrl, t) => {
  if (!report || !imageUrl) return;

  // Create new PDF document with higher quality settings
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Enhanced professional color palette
  const colors = {
    primary: [0, 51, 102], // Deep professional blue
    secondary: [41, 128, 185], // Medical blue
    accent: [70, 130, 180], // Steel blue accent
    lightGray: [245, 245, 250], // Subtle background gray
    mediumGray: [200, 200, 210], // Border color
    gray: [100, 100, 110], // Text gray
    black: [20, 20, 30], // Rich black for main text
    badge: {
      bg: [0, 51, 102], // Badge background
      text: [255, 255, 255], // Badge text
    },
    bars: {
      low: [173, 216, 230], // Light blue for low probability
      medium: [100, 149, 237], // Medium blue
      high: [25, 25, 112], // Navy for high probability
    },
  };

  // Set default font
  doc.setFont('helvetica');

  // Add logo and header to each page
  const addLogoAndHeader = (pageNum) => {
    doc.setPage(pageNum);

    // Try to add logo - with better position and handling
    try {
      doc.addSvg('/public/logo-no-background.svg', 10, 8, 40, 15);
    } catch (e) {
      // Fallback text logo with professional styling
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('OCTSENSE', 15, 15);

      // Add a small accent line under the text logo
      doc.setDrawColor(...colors.secondary);
      doc.setLineWidth(0.5);
      doc.line(15, 17, 50, 17);
    }

    // Header separator line with gradient effect (two lines with different colors)
    doc.setLineWidth(0.75);
    doc.setDrawColor(...colors.secondary);
    doc.line(10, 28, pageWidth - 10, 28);
    doc.setLineWidth(0.25);
    doc.setDrawColor(...colors.mediumGray);
    doc.line(10, 29.5, pageWidth - 10, 29.5);

    // Page title with improved typography
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);

    const title =
      pageNum === 1 ? t('report.pdfTitle') : t('analysis.original_image');
    doc.text(title, pageWidth / 2, 20, { align: 'center' });
  };

  // Add footer to each page with enhanced design
  const addFooter = (pageNum, totalPages) => {
    doc.setPage(pageNum);

    // Footer separator line with subtle gradient effect
    doc.setLineWidth(0.25);
    doc.setDrawColor(...colors.mediumGray);
    doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
    doc.setLineWidth(0.5);
    doc.setDrawColor(...colors.secondary);
    doc.line(10, pageHeight - 14, pageWidth - 10, pageHeight - 14);

    // Footer text with improved layout
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray);

    const date = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    doc.text(`${t('analysis.generated_on')}: ${date}`, 10, pageHeight - 8);

    // Center logo text with small icon styling
    doc.setFont('helvetica', 'bold');
    doc.text('OCT', pageWidth / 2 - 7, pageHeight - 8);
    doc.setFont('helvetica', 'normal');
    doc.text('SENSE', pageWidth / 2 + 7, pageHeight - 8);

    // Page number
    doc.text(
      `${t('report.name')} ${pageNum}/${totalPages}`,
      pageWidth - 10,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  // PAGE 1 - Start with header
  addLogoAndHeader(1);

  // ========== Report Info Box ==========
  // Enhanced box styling with subtle shadow effect
  const boxTop = 35;
  const boxHeight = 55;
  const col1X = 15;
  const col2X = pageWidth / 2 + 5;
  const rowHeight = 8;

  // Box background with subtle shadow effect (layered rectangles)
  doc.setFillColor(...colors.mediumGray);
  doc.roundedRect(11, boxTop + 1, pageWidth - 22, boxHeight, 3, 3, 'F');
  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(10, boxTop, pageWidth - 20, boxHeight, 3, 3, 'F');

  // Column headers with improved styling
  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(t('analysis.patient_information'), col1X, boxTop + 8);

  // Added subtle separator between columns
  doc.setDrawColor(...colors.mediumGray);
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2, boxTop + 2, pageWidth / 2, boxTop + boxHeight - 2);

  doc.text(t('report.pdfTitle'), col2X, boxTop + 8);

  // Data lines with improved layout and styling
  const lines = [
    {
      label: t('analysis.patient_name'),
      value: report.patient_name || 'N/A',
      x: col1X,
    },
    {
      label: t('analysis.document_id'),
      value: report.document_id || 'N/A',
      x: col1X,
    },
    {
      label: t('analysis.eye_side'),
      value: report.eye_side || 'N/A',
      x: col1X,
    },
    {
      label: t('analysis.visual_acuity'),
      value: report.visual_acuity || 'N/A',
      x: col1X,
    },
    {
      label: t('report.id'),
      // Truncate the ID if it's too long to prevent overflow
      value: report.id
        ? report.id.length > 10
          ? report.id.substring(0, 10) + '...'
          : report.id
        : 'N/A',
      x: col2X,
    },
    {
      label: t('report.createdAt'),
      value: report.created_at?.split('T')[0] || 'N/A',
      x: col2X,
    },
    {
      label: t('report.predictedDiagnostic'),
      value:
        t(`diagnoses.${report.predicted_diagnostic}`) ||
        report.predicted_diagnostic ||
        'N/A',
      x: col2X,
      badge: true,
    },
  ];

  // Text settings for data display
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.black);
  doc.setFont('helvetica', 'normal');

  // Render each line with improved styling
  lines.forEach((item, idx) => {
    const y = boxTop + 16 + (idx % 4) * rowHeight;
    const offsetX = item.x === col1X ? 40 : 45;

    // Label for all items
    doc.setFont('helvetica', 'normal');
    doc.text(`${item.label}:`, item.x, y);

    if (item.badge) {
      // Enhanced diagnosis badge with better styling
      const diagWidth =
        doc.getStringUnitWidth(item.value) * doc.internal.getFontSize() * 0.35;

      // Create gradient effect for badge (two overlapping rectangles)
      const badgeHeight = 7;
      doc.setFillColor(...colors.primary);
      doc.roundedRect(
        item.x + offsetX - 5,
        y - 5,
        diagWidth + 10,
        badgeHeight,
        2,
        2,
        'F'
      );

      // Slight highlight on top of badge
      doc.setFillColor(
        colors.badge.bg[0] + 30,
        colors.badge.bg[1] + 30,
        colors.badge.bg[2] + 30
      );
      doc.roundedRect(
        item.x + offsetX - 5,
        y - 5,
        diagWidth + 10,
        badgeHeight / 2,
        2,
        2,
        'F'
      );

      // Badge text
      doc.setTextColor(...colors.badge.text);
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, item.x + offsetX, y);
      doc.setTextColor(...colors.black);
    } else {
      // Regular data line with improved separation
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, item.x + offsetX, y);
    }
  });

  // ========== Probabilities Section ==========
  let currentY = boxTop + boxHeight + 15;

  // Section header with subtle underline
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.text(t('report.probabilities'), 15, currentY);
  doc.setLineWidth(0.3);
  doc.setDrawColor(...colors.secondary);
  doc.line(15, currentY + 2, 65, currentY + 2);

  currentY += 10;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.black);

  // Enhanced probability bars with disease title on top and progress bar below
  if (report.probabilities) {
    Object.entries(report.probabilities).forEach(([diagnosis, prob]) => {
      const percent = (prob * 100).toFixed(1);
      const barMaxWidth = pageWidth - 50 - 40;
      const barWidth = prob * barMaxWidth;

      // Choose color based on probability
      let barColor =
        prob < 0.3
          ? colors.bars.low
          : prob < 0.6
          ? colors.bars.medium
          : colors.bars.high;

      // Disease title on top with improved typography
      doc.setFont('helvetica', 'bold');
      doc.text(`${t(`diagnoses.${diagnosis}`) || diagnosis}`, 15, currentY);
      doc.setFont('helvetica', 'normal');

      currentY += 5; // Move down for progress bar

      // Enhanced bar background with subtle shadow
      doc.setFillColor(...colors.mediumGray);
      doc.roundedRect(15, currentY - 3, barMaxWidth, 4, 2, 2, 'F');
      doc.setFillColor(...colors.lightGray);
      doc.roundedRect(15, currentY - 3, barMaxWidth, 4, 2, 2, 'F');

      // Progress bar with improved styling
      doc.setFillColor(...barColor);
      doc.roundedRect(15, currentY - 3, barWidth, 4, 2, 2, 'F');

      // Add subtle highlight to top of bar
      doc.setFillColor(
        barColor[0] + 40,
        barColor[1] + 40,
        barColor[2] + 40,
        0.5
      );
      doc.roundedRect(15, currentY - 3, barWidth, 2, 2, 2, 'F');

      // Percentage text with improved alignment
      doc.setFontSize(9);
      doc.setTextColor(...colors.black);
      doc.text(`${percent}%`, 15 + barMaxWidth + 5, currentY);

      currentY += 12; // More space between entries
    });
  } else {
    doc.text(
      t('report.noProbabilities') || 'No probability data available',
      15,
      currentY
    );
    currentY += 10;
  }

  // ========== Observations Section ==========
  currentY += 10;

  // Section header with subtle underline
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text(t('analysis.observations'), 15, currentY);
  doc.setLineWidth(0.3);
  doc.setDrawColor(...colors.secondary);
  doc.line(15, currentY + 2, 65, currentY + 2);

  // Create a box for observations
  const obsBoxTop = currentY + 5;
  const availableHeight = pageHeight - obsBoxTop - 45; // Leave space for disclaimer

  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(10, obsBoxTop, pageWidth - 20, availableHeight, 3, 3, 'F');

  // Observations text
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.black);
  const obsText = report.comments || t('report.noComment');
  const obsLines = doc.splitTextToSize(obsText, pageWidth - 40);
  doc.text(obsLines, 15, obsBoxTop + 10);

  // ========== Medical Disclaimer ==========
  doc.setFontSize(8);
  doc.setTextColor(...colors.gray);
  const disclaimer =
    t('pdf.disclaimer') ||
    'This document is automatically generated by OCTsense and does not constitute a certified medical diagnosis. Please consult a licensed ophthalmologist for interpretation and follow-up.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 30);

  // Add a more subtle box around the disclaimer
  const disclaimerY = pageHeight - 25;
  const disclaimerHeight = disclaimerLines.length * 3.5 + 5;

  // Use a much more subtle background for the disclaimer
  doc.setFillColor(250, 250, 252, 0.5); // Very light, almost white background
  doc.roundedRect(
    15,
    disclaimerY - 3,
    pageWidth - 30,
    disclaimerHeight,
    2,
    2,
    'F'
  );

  // Add disclaimer text
  // Add disclaimer text centered within the box
  doc.text(disclaimerLines, pageWidth / 2, disclaimerY, {
    align: 'center',
  });

  // ===== PAGE 2: OCT Image =====
  doc.addPage();
  addLogoAndHeader(2);

  // Add footer placeholders (filled after image loads)
  const totalPages = 2;
  addFooter(1, totalPages); // You can call this early as content is static
  addFooter(2, totalPages);

  // Load and embed OCT image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const ratio = img.width / img.height;
    let width = pageWidth - 40;
    let height = width / ratio;

    // Adjust to fit page if needed
    if (height > pageHeight - 80) {
      height = pageHeight - 80;
      width = height * ratio;
    }

    const x = (pageWidth - width) / 2;
    const y = 40;

    doc.addImage(img, 'JPEG', x, y, width, height);

    // Caption below image
    doc.setFontSize(9);
    doc.setTextColor(...colors.gray);
    const imageCaption = `${t('analysis.original_image')} - ${
      report.patient_name || ''
    } - ${report.eye_side || ''}`;
    doc.text(imageCaption, pageWidth / 2, y + height + 10, { align: 'center' });

    // Save final PDF
    const fileName = `OCT_Report_${report.id}_${(
      report.patient_name || 'patient'
    )
      .replace(/\s+/g, '_')
      .toLowerCase()}.pdf`;
    doc.save(fileName);
  };

  img.src = imageUrl;
};

export const generateSimplePDFReport = ({
  userData,
  imageFile,
  prediction,
  probabilities,
  t,
  comments,
}) => {
  if (!imageFile || !prediction || !probabilities) return;

  // Create new PDF document with higher quality settings
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    compress: true,
  });

  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;

  // Enhanced professional color palette
  const colors = {
    primary: [0, 51, 102], // Deep professional blue
    secondary: [41, 128, 185], // Medical blue
    accent: [70, 130, 180], // Steel blue accent
    lightGray: [245, 245, 250], // Subtle background gray
    mediumGray: [200, 200, 210], // Border color
    gray: [100, 100, 110], // Text gray
    black: [20, 20, 30], // Rich black for main text
    badge: {
      bg: [0, 51, 102], // Badge background
      text: [255, 255, 255], // Badge text
    },
    bars: {
      low: [173, 216, 230], // Light blue for low probability
      medium: [100, 149, 237], // Medium blue
      high: [25, 25, 112], // Navy for high probability
    },
  };

  // Set default font
  doc.setFont('helvetica');

  // Add logo and header to each page
  const addLogoAndHeader = (pageNum) => {
    doc.setPage(pageNum);

    // Try to add logo - with better position and handling
    try {
      doc.addSvg('/public/logo-no-background.svg', 10, 8, 40, 15);
    } catch (e) {
      // Fallback text logo with professional styling
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...colors.primary);
      doc.text('OCTSENSE', 15, 15);

      // Add a small accent line under the text logo
      doc.setDrawColor(...colors.secondary);
      doc.setLineWidth(0.5);
      doc.line(15, 17, 50, 17);
    }

    // Header separator line with gradient effect (two lines with different colors)
    doc.setLineWidth(0.75);
    doc.setDrawColor(...colors.secondary);
    doc.line(10, 28, pageWidth - 10, 28);
    doc.setLineWidth(0.25);
    doc.setDrawColor(...colors.mediumGray);
    doc.line(10, 29.5, pageWidth - 10, 29.5);

    // Page title with improved typography
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.setTextColor(...colors.primary);

    const title =
      pageNum === 1 ? t('report.pdfTitle') : t('analysis.original_image');
    doc.text(title, pageWidth / 2, 20, { align: 'center' });
  };

  // Add footer to each page with enhanced design
  const addFooter = (pageNum, totalPages) => {
    doc.setPage(pageNum);

    // Footer separator line with subtle gradient effect
    doc.setLineWidth(0.25);
    doc.setDrawColor(...colors.mediumGray);
    doc.line(10, pageHeight - 15, pageWidth - 10, pageHeight - 15);
    doc.setLineWidth(0.5);
    doc.setDrawColor(...colors.secondary);
    doc.line(10, pageHeight - 14, pageWidth - 10, pageHeight - 14);

    // Footer text with improved layout
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...colors.gray);

    const date = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    doc.text(`${t('analysis.generated_on')}: ${date}`, 10, pageHeight - 8);

    // Center logo text with small icon styling
    doc.setFont('helvetica', 'bold');
    doc.text('OCT', pageWidth / 2 - 7, pageHeight - 8);
    doc.setFont('helvetica', 'normal');
    doc.text('SENSE', pageWidth / 2 + 7, pageHeight - 8);

    // Page number
    doc.text(
      `${t('report.name')} ${pageNum}/${totalPages}`,
      pageWidth - 10,
      pageHeight - 8,
      { align: 'right' }
    );
  };

  // PAGE 1 - Start with header
  addLogoAndHeader(1);

  // ========== Report Info Box ==========
  // Enhanced box styling with subtle shadow effect
  const boxTop = 35;
  const boxHeight = 35;
  const col1X = 15;
  const col2X = pageWidth / 2 + 5;
  const rowHeight = 8;

  // Box background with subtle shadow effect (layered rectangles)
  doc.setFillColor(...colors.mediumGray);
  doc.roundedRect(11, boxTop + 1, pageWidth - 22, boxHeight, 3, 3, 'F');
  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(10, boxTop, pageWidth - 20, boxHeight, 3, 3, 'F');

  // Column headers with improved styling
  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  doc.text(t('analysis.patient_information'), col1X, boxTop + 8);

  // Added subtle separator between columns
  doc.setDrawColor(...colors.mediumGray);
  doc.setLineWidth(0.2);
  doc.line(pageWidth / 2, boxTop + 2, pageWidth / 2, boxTop + boxHeight - 2);

  doc.text(t('report.pdfTitle'), col2X, boxTop + 8);

  // Data lines with improved layout and styling
  const lines = [
    {
      label: t('pdf.patient_name'),
      value: userData.name || 'N/A',
      x: col1X,
    },
    {
      label: t('pdf.email'),
      value: userData.email || 'N/A',
      x: col1X,
    },
  ];

  // Add prediction at the top of the second column
  const diagLine = {
    label: t('report.predictedDiagnostic'),
    value: t(`diagnoses.${prediction}`) || prediction || 'N/A',
    x: col2X,
    badge: true,
    row: 0, // Force this to be in the first row
  };

  lines.push(diagLine);

  // Text settings for data display
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.black);
  doc.setFont('helvetica', 'normal');

  // Render each line with improved styling
  lines.forEach((item) => {
    // Calculate y position, with special handling for the diagnosis line
    const rowIdx =
      item.row !== undefined
        ? item.row
        : item.x === col1X
        ? lines.indexOf(item)
        : 0;
    const y = boxTop + 16 + rowIdx * rowHeight;
    const offsetX = item.x === col1X ? 40 : 45;

    // Label for all items
    doc.setFont('helvetica', 'normal');
    doc.text(`${item.label}:`, item.x, y);

    if (item.badge) {
      // Enhanced diagnosis badge with better styling
      const diagWidth =
        doc.getStringUnitWidth(item.value) * doc.internal.getFontSize() * 0.35;

      // Create gradient effect for badge (two overlapping rectangles)
      const badgeHeight = 7;
      doc.setFillColor(...colors.primary);
      doc.roundedRect(
        item.x + offsetX - 5,
        y - 5,
        diagWidth + 10,
        badgeHeight,
        2,
        2,
        'F'
      );

      // Slight highlight on top of badge - no alpha channel
      doc.setFillColor(
        Math.min(colors.badge.bg[0] + 30, 255),
        Math.min(colors.badge.bg[1] + 30, 255),
        Math.min(colors.badge.bg[2] + 30, 255)
      );
      doc.roundedRect(
        item.x + offsetX - 5,
        y - 5,
        diagWidth + 10,
        badgeHeight / 2,
        2,
        2,
        'F'
      );

      // Badge text
      doc.setTextColor(...colors.badge.text);
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, item.x + offsetX, y);
      doc.setTextColor(...colors.black);
    } else {
      // Regular data line with improved separation
      doc.setFont('helvetica', 'bold');
      doc.text(item.value, item.x + offsetX, y);
    }
  });

  // ========== Probabilities Section ==========
  // ========== Probabilities Section ==========
  let currentY = boxTop + boxHeight + 15;

  // Create box for probabilities section with same styling as report info box
  const probBoxTop = currentY;
  const probBoxHeight = Object.keys(probabilities).length * 18 + 25; // Height based on number of entries + padding

  // Box background with subtle shadow effect (layered rectangles) - same as report info box
  doc.setFillColor(...colors.mediumGray);
  doc.roundedRect(11, probBoxTop + 1, pageWidth - 22, probBoxHeight, 3, 3, 'F');
  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(10, probBoxTop, pageWidth - 20, probBoxHeight, 3, 3, 'F');

  // Section header with same styling as patient information
  doc.setFontSize(11);
  doc.setTextColor(...colors.primary);
  doc.setFont('helvetica', 'bold');
  const probSectionTitle =
    t('report.probabilities') || 'Diagnostic Probabilities';
  doc.text(probSectionTitle, 15, probBoxTop + 8);

  // Add subtle underline for section header - similar to patient info section
  doc.setLineWidth(0.3);
  doc.setDrawColor(...colors.secondary);
  doc.line(
    15,
    probBoxTop + 10,
    15 +
      doc.getStringUnitWidth(probSectionTitle) *
        doc.internal.getFontSize() *
        0.35,
    probBoxTop + 10
  );

  // Initialize position for probability bars
  currentY = probBoxTop + 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...colors.black);

  // Enhanced probability bars with disease title on top and progress bar below
  if (probabilities) {
    Object.entries(probabilities).forEach(([ix, data]) => {
      const name = data.name;
      const value = data.value;
      const prob = Number(value / 100);
      console.log(prob);
      if (isNaN(prob)) return;
      const percent = (prob * 100).toFixed(1);
      const barMaxWidth = pageWidth - 50 - 40;
      const barWidth = prob * barMaxWidth;

      // Choose color based on probability
      let barColor =
        prob < 0.3
          ? colors.bars.low
          : prob < 0.6
          ? colors.bars.medium
          : colors.bars.high;

      // Disease title on top with improved typography
      doc.setFont('helvetica', 'bold');
      doc.text(`${t(`diagnoses.${name}`) || name}`, 15, currentY);
      doc.setFont('helvetica', 'normal');

      currentY += 5; // Move down for progress bar

      // Enhanced bar background with subtle shadow
      doc.setFillColor(...colors.mediumGray);
      doc.roundedRect(15, currentY - 3, barMaxWidth, 4, 2, 2, 'F');
      doc.setFillColor(...colors.lightGray);
      doc.roundedRect(15, currentY - 3, barMaxWidth, 4, 2, 2, 'F');

      // Progress bar with improved styling
      doc.setFillColor(...barColor);
      doc.roundedRect(15, currentY - 3, barWidth, 4, 2, 2, 'F');

      // Add subtle highlight to top of bar - removed alpha channel
      doc.setFillColor(
        Math.min(barColor[0] + 40, 255),
        Math.min(barColor[1] + 40, 255),
        Math.min(barColor[2] + 40, 255)
      );
      doc.roundedRect(15, currentY - 3, barWidth, 2, 2, 2, 'F');

      // Percentage text with improved alignment
      doc.setFontSize(9);
      doc.setTextColor(...colors.black);
      doc.text(`${percent}%`, 15 + barMaxWidth + 5, currentY);

      currentY += 12; // More space between entries
    });
  } else {
    doc.text(
      t('report.noProbabilities') || 'No probability data available',
      15,
      currentY
    );
    currentY += 10;
  }

  // ========== Observations Section ==========
  currentY += 10;

  // Section header with subtle underline
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.primary);
  doc.text(t('analysis.description'), 15, currentY);
  doc.setLineWidth(0.3);
  doc.setDrawColor(...colors.secondary);
  doc.line(15, currentY + 2, 65, currentY + 2);

  // Create a box for observations
  const obsBoxTop = currentY + 5;
  const availableHeight = pageHeight - obsBoxTop - 45; // Leave space for disclaimer

  doc.setFillColor(...colors.lightGray);
  doc.roundedRect(10, obsBoxTop, pageWidth - 20, availableHeight, 3, 3, 'F');

  // Observations text
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...colors.black);
  const obsText = t(`diagnoses.description.${prediction}`, {
    defaultValue: t('analysis.no_description_available'),
  });
  const obsLines = doc.splitTextToSize(obsText, pageWidth - 40);
  doc.text(obsLines, 15, obsBoxTop + 10);

  // ========== Medical Disclaimer ==========
  doc.setFontSize(8);
  doc.setTextColor(...colors.gray);
  const disclaimer =
    t('pdf.disclaimer') ||
    'This document is automatically generated by OCTsense and does not constitute a certified medical diagnosis. Please consult a licensed ophthalmologist for interpretation and follow-up.';
  const disclaimerLines = doc.splitTextToSize(disclaimer, pageWidth - 30);

  // Add a more subtle box around the disclaimer
  const disclaimerY = pageHeight - 25;
  const disclaimerHeight = disclaimerLines.length * 3.5 + 5;

  // FIXED: Use a much more subtle background for the disclaimer - removed alpha value
  doc.setFillColor(250, 250, 252);
  doc.roundedRect(
    15,
    disclaimerY - 3,
    pageWidth - 30,
    disclaimerHeight,
    2,
    2,
    'F'
  );

  // Add disclaimer text centered within the box
  doc.text(disclaimerLines, pageWidth / 2, disclaimerY, {
    align: 'center',
  });

  // ===== PAGE 2: OCT Image =====
  doc.addPage();
  addLogoAndHeader(2);

  // Add footer placeholders (filled after image loads)
  const totalPages = 2;
  addFooter(1, totalPages); // You can call this early as content is static
  addFooter(2, totalPages);

  // Load and embed OCT image
  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const ratio = img.width / img.height;
    let width = pageWidth - 40;
    let height = width / ratio;

    // Adjust to fit page if needed
    if (height > pageHeight - 80) {
      height = pageHeight - 80;
      width = height * ratio;
    }

    const x = (pageWidth - width) / 2;
    const y = 40;

    doc.addImage(img, 'JPEG', x, y, width, height);

    // Caption below image
    doc.setFontSize(9);
    doc.setTextColor(...colors.gray);
    // Save final PDF
    const fileName = `OCT_Report.pdf`;
    doc.save(fileName);
  };

  const reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
  };
  reader.readAsDataURL(imageFile);
};
