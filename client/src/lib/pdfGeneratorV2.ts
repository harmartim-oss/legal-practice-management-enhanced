import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FirmProfile } from '@/contexts/FirmContext';

interface TimeEntry {
  id: string;
  clientId: string;
  matterId: string;
  description: string;
  hours: number;
  minutes: number;
  rate: number;
  date: Date;
  amount: number;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface Matter {
  id: string;
  clientId: string;
  name: string;
  description: string;
  rate: number;
  startDate: Date;
  status: 'active' | 'completed' | 'on-hold';
}

/**
 * Generate a professional invoice PDF with firm branding
 */
export async function generateInvoicePDFWithFirm(
  timeEntries: TimeEntry[],
  clients: Client[],
  matters: Matter[],
  firmProfile: FirmProfile | null,
  invoiceNumber: string = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Add logo if available
  if (firmProfile?.logoBase64) {
    try {
      doc.addImage(firmProfile.logoBase64, 'JPEG', 20, yPosition, 30, 30);
      yPosition += 35;
    } catch (error) {
      console.error('Failed to add logo:', error);
      yPosition += 5;
    }
  }

  // Header with firm info
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(firmProfile?.firmName || 'Law Firm', 20, yPosition);
  yPosition += 7;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const firmAddress = firmProfile
    ? `${firmProfile.address}, ${firmProfile.city}, ${firmProfile.province} ${firmProfile.postalCode}`
    : 'Address';
  
  doc.text(firmAddress, 20, yPosition);
  yPosition += 4;
  
  const contactInfo = firmProfile
    ? `Phone: ${firmProfile.phone} | Email: ${firmProfile.email}`
    : 'Contact Information';
  
  doc.text(contactInfo, 20, yPosition);
  
  if (firmProfile?.website) {
    yPosition += 4;
    doc.text(`Website: ${firmProfile.website}`, 20, yPosition);
  }
  
  yPosition += 10;

  // Title
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, yPosition);
  yPosition += 8;

  // Invoice details
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Invoice Number: ${invoiceNumber}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 8;

  // Client information
  if (timeEntries.length > 0) {
    const firstEntry = timeEntries[0];
    const client = clients.find(c => c.id === firstEntry.clientId);
    
    if (client) {
      doc.setFont('helvetica', 'bold');
      doc.text('BILL TO:', 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.text(client.name, 20, yPosition);
      yPosition += 5;
      doc.text(client.address, 20, yPosition);
      yPosition += 5;
      doc.text(`Phone: ${client.phone}`, 20, yPosition);
      yPosition += 5;
      doc.text(`Email: ${client.email}`, 20, yPosition);
      yPosition += 8;
    }
  }

  // Table of services
  const tableData: any[] = [];
  
  timeEntries.forEach(entry => {
    const matter = matters.find(m => m.id === entry.matterId);
    tableData.push([
      entry.date.toLocaleDateString(),
      matter?.name || 'General',
      entry.description,
      `${entry.hours}h ${entry.minutes}m`,
      `$${entry.rate.toFixed(2)}`,
      `$${entry.amount.toFixed(2)}`
    ]);
  });

  // Calculate totals
  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  (doc as any).autoTable({
    head: [['Date', 'Matter', 'Description', 'Time', 'Rate', 'Amount']],
    body: tableData,
    startY: yPosition,
    margin: 20,
    theme: 'grid',
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Summary section
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const summaryX = pageWidth - 80;
  doc.text('Subtotal:', summaryX, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 5;

  doc.text('HST (13%):', summaryX, yPosition);
  doc.text(`$${hst.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('Total Due:', summaryX, yPosition);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;

  // Footer
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('Payment is due within 30 days of invoice date.', 20, pageHeight - 20);
  
  if (firmProfile?.licenseNumber) {
    doc.text(`Law Society License: ${firmProfile.licenseNumber}`, 20, pageHeight - 15);
  }

  // Save the PDF
  doc.save(`Invoice-${invoiceNumber}.pdf`);
}

/**
 * Generate an Ontario-compliant Bill of Costs PDF with firm branding
 */
export async function generateBillOfCostsPDFWithFirm(
  timeEntries: TimeEntry[],
  clients: Client[],
  matters: Matter[],
  firmProfile: FirmProfile | null,
  billNumber: string = `BOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // Add logo if available
  if (firmProfile?.logoBase64) {
    try {
      doc.addImage(firmProfile.logoBase64, 'JPEG', 20, yPosition, 30, 30);
      yPosition += 35;
    } catch (error) {
      console.error('Failed to add logo:', error);
      yPosition += 5;
    }
  }

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('BILL OF COSTS', 20, yPosition);
  yPosition += 10;

  // Form reference
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('(Ontario Rules of Civil Procedure, Form 57A)', 20, yPosition);
  yPosition += 8;

  // Lawyer information
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('LAWYER:', 20, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'normal');
  doc.text(firmProfile?.lawyerName || 'Lawyer Name', 20, yPosition);
  yPosition += 5;
  doc.text(firmProfile?.firmName || 'Law Firm', 20, yPosition);
  yPosition += 5;
  
  const firmAddress = firmProfile
    ? `${firmProfile.address}, ${firmProfile.city}, ${firmProfile.province} ${firmProfile.postalCode}`
    : 'Address';
  
  doc.text(firmAddress, 20, yPosition);
  yPosition += 5;
  doc.text(`Phone: ${firmProfile?.phone || 'Phone'}`, 20, yPosition);
  yPosition += 8;

  // Client information
  if (timeEntries.length > 0) {
    const firstEntry = timeEntries[0];
    const client = clients.find(c => c.id === firstEntry.clientId);
    
    if (client) {
      doc.setFont('helvetica', 'bold');
      doc.text('CLIENT:', 20, yPosition);
      yPosition += 5;
      
      doc.setFont('helvetica', 'normal');
      doc.text(client.name, 20, yPosition);
      yPosition += 5;
      doc.text(client.address, 20, yPosition);
      yPosition += 8;
    }
  }

  // Bill details
  doc.setFont('helvetica', 'bold');
  doc.text('BILL OF COSTS NUMBER:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(billNumber, 80, yPosition);
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  doc.text('DATE:', 20, yPosition);
  doc.setFont('helvetica', 'normal');
  doc.text(new Date().toLocaleDateString(), 80, yPosition);
  yPosition += 10;

  // Services table
  const tableData: any[] = [];
  
  timeEntries.forEach(entry => {
    const matter = matters.find(m => m.id === entry.matterId);
    const totalHours = entry.hours + entry.minutes / 60;
    tableData.push([
      entry.date.toLocaleDateString(),
      matter?.name || 'General',
      entry.description,
      totalHours.toFixed(2),
      `$${entry.rate.toFixed(2)}`,
      `$${entry.amount.toFixed(2)}`
    ]);
  });

  // Calculate totals
  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  (doc as any).autoTable({
    head: [['Date', 'Matter', 'Description', 'Hours', 'Rate/hr', 'Amount']],
    body: tableData,
    startY: yPosition,
    margin: 20,
    theme: 'grid',
    headStyles: {
      fillColor: [51, 51, 51],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      3: { halign: 'right' },
      4: { halign: 'right' },
      5: { halign: 'right' }
    }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 10;

  // Summary section
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  
  const summaryX = pageWidth - 80;
  doc.text('Subtotal:', summaryX, yPosition);
  doc.text(`$${subtotal.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 5;

  doc.text('HST (13%):', summaryX, yPosition);
  doc.text(`$${hst.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 5;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('TOTAL:', summaryX, yPosition);
  doc.text(`$${total.toFixed(2)}`, pageWidth - 20, yPosition, { align: 'right' });
  yPosition += 10;

  // Compliance notes
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.text('This bill of costs is prepared in accordance with:', 20, yPosition);
  yPosition += 4;
  doc.text('• Ontario Rules of Civil Procedure, Form 57A', 25, yPosition);
  yPosition += 4;
  doc.text('• Tariff A - Standard Fees', 25, yPosition);
  yPosition += 4;
  doc.text('• Rule 57.01 - Costs', 25, yPosition);
  yPosition += 8;

  // Certification
  doc.text('Prepared by: ' + (firmProfile?.lawyerName || 'Lawyer Name'), 20, yPosition);
  yPosition += 5;
  doc.text('Date: ' + new Date().toLocaleDateString(), 20, yPosition);

  // Save the PDF
  doc.save(`BillOfCosts-${billNumber}.pdf`);
}

/**
 * Generate a professional cover letter with firm logo
 */
export async function generateCoverLetterPDFWithFirm(
  clientName: string,
  matterDescription: string,
  invoiceNumber: string,
  firmProfile: FirmProfile | null
): Promise<void> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Add logo if available
  if (firmProfile?.logoBase64) {
    try {
      doc.addImage(firmProfile.logoBase64, 'JPEG', 20, yPosition, 40, 40);
      yPosition += 45;
    } catch (error) {
      console.error('Failed to add logo:', error);
      yPosition += 5;
    }
  }

  // Firm header
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(firmProfile?.firmName || 'Law Firm', 20, yPosition);
  yPosition += 6;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  
  const firmAddress = firmProfile
    ? `${firmProfile.address}, ${firmProfile.city}, ${firmProfile.province} ${firmProfile.postalCode}`
    : 'Address';
  
  doc.text(firmAddress, 20, yPosition);
  yPosition += 4;
  
  const contactInfo = firmProfile
    ? `Phone: ${firmProfile.phone} | Email: ${firmProfile.email}`
    : 'Contact Information';
  
  doc.text(contactInfo, 20, yPosition);
  yPosition += 12;

  // Date
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;

  // Recipient
  doc.text(clientName, 20, yPosition);
  yPosition += 10;

  // Salutation
  doc.setFont('helvetica', 'normal');
  doc.text('Dear ' + clientName.split(' ')[0] + ',', 20, yPosition);
  yPosition += 10;

  // Body
  const bodyText = `Please find enclosed our invoice for professional legal services rendered in connection with ${matterDescription}.

The invoice details the time spent on your matter, including all work performed by our office. All charges are in accordance with our agreed rate schedule.

If you have any questions regarding this invoice or require any clarification on the services provided, please do not hesitate to contact us.

Payment is due within 30 days of the invoice date. We accept payment by cheque, bank transfer, or credit card.

Thank you for entrusting us with your legal matters. We appreciate your business and look forward to continuing to serve your needs.`;

  const lines = doc.splitTextToSize(bodyText, pageWidth - 40);
  doc.text(lines, 20, yPosition);
  yPosition += lines.length * 5 + 10;

  // Closing
  doc.text('Sincerely,', 20, yPosition);
  yPosition += 15;
  doc.text(firmProfile?.lawyerName || 'Lawyer Name', 20, yPosition);
  yPosition += 4;
  doc.text(firmProfile?.firmName || 'Law Firm', 20, yPosition);

  if (firmProfile?.licenseNumber) {
    yPosition += 4;
    doc.setFontSize(8);
    doc.text(`Law Society License: ${firmProfile.licenseNumber}`, 20, yPosition);
  }

  // Save the PDF
  doc.save(`CoverLetter-${invoiceNumber}.pdf`);
}
