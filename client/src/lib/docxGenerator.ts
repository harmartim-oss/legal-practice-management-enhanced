import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  AlignmentType,
  VerticalAlign,
  convertInchesToTwip,
} from 'docx';
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
 * Generate a professional invoice DOCX document
 */
export async function generateInvoiceDOCX(
  timeEntries: TimeEntry[],
  clients: Client[],
  matters: Matter[],
  firmProfile: FirmProfile | null,
  invoiceNumber: string = `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
): Promise<void> {
  const client = clients.find(c => c.id === timeEntries[0]?.clientId);
  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Date', bold: true })] })],
          shading: { fill: '2980B9', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Matter', bold: true })] })],
          shading: { fill: '2980B9', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })],
          shading: { fill: '2980B9', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Time', bold: true })] })],
          shading: { fill: '2980B9', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Rate', bold: true })] })],
          shading: { fill: '2980B9', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Amount', bold: true })] })],
          shading: { fill: '2980B9', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
      ],
    }),
  ];

  timeEntries.forEach(entry => {
    const matter = matters.find(m => m.id === entry.matterId);
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(entry.date.toLocaleDateString())],
          }),
          new TableCell({
            children: [new Paragraph(matter?.name || 'General')],
          }),
          new TableCell({
            children: [new Paragraph(entry.description)],
          }),
          new TableCell({
            children: [new Paragraph(`${entry.hours}h ${entry.minutes}m`)],
          }),
          new TableCell({
            children: [new Paragraph(`$${entry.rate.toFixed(2)}`)],
          }),
          new TableCell({
            children: [new Paragraph(`$${entry.amount.toFixed(2)}`)],
          }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        children: [
          // Header with firm info
          new Paragraph({
            children: [new TextRun({ text: firmProfile?.firmName || 'Law Firm', bold: true, size: 64 })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `${firmProfile?.address}, ${firmProfile?.city}, ${firmProfile?.province} ${firmProfile?.postalCode}`,
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `Phone: ${firmProfile?.phone} | Email: ${firmProfile?.email}`,
            spacing: { after: 200 },
          }),

          // Invoice title
          new Paragraph({
            children: [new TextRun({ text: 'INVOICE', bold: true, size: 56 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),

          // Invoice details
          new Paragraph({
            text: `Invoice Number: ${invoiceNumber}`,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Date: ${new Date().toLocaleDateString()}`,
            spacing: { after: 200 },
          }),

          // Bill to section
          new Paragraph({
            children: [new TextRun({ text: 'BILL TO:', bold: true, size: 22 })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: client?.name || 'Client',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: client?.address || 'Address',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `Phone: ${client?.phone || 'Phone'}`,
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `Email: ${client?.email || 'Email'}`,
            spacing: { after: 200 },
          }),

          // Services table
          new Table({
            width: { size: 100, type: 'pct' },
            rows: tableRows,
          }),

          // Summary section
          new Paragraph({
            text: '',
            spacing: { after: 200 },
          }),
          new Table({
            width: { size: 50, type: 'pct' },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Subtotal:', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `$${subtotal.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'HST (13%):', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `$${hst.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Total Due:', bold: true, size: 48 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: `$${total.toFixed(2)}`, bold: true, size: 48 })] })],
                  }),
                ],
              }),
            ],
          }),

          // Footer
          new Paragraph({
            text: '',
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'Payment is due within 30 days of invoice date.', italics: true, size: 20 })],
          }),
          ...(firmProfile?.licenseNumber
            ? [
                new Paragraph({
                  children: [new TextRun({ text: `Law Society License: ${firmProfile.licenseNumber}`, italics: true, size: 20 })],
                }),
              ]
            : []),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Invoice-${invoiceNumber}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Generate a professional Bill of Costs DOCX document (Ontario Form 57A)
 */
export async function generateBillOfCostsDOCX(
  timeEntries: TimeEntry[],
  clients: Client[],
  matters: Matter[],
  firmProfile: FirmProfile | null,
  billNumber: string = `BOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
): Promise<void> {
  const client = clients.find(c => c.id === timeEntries[0]?.clientId);
  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  const tableRows: TableRow[] = [
    new TableRow({
      children: [
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Date', bold: true })] })],
          shading: { fill: '333333', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Matter', bold: true })] })],
          shading: { fill: '333333', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Description', bold: true })] })],
          shading: { fill: '333333', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Hours', bold: true })] })],
          shading: { fill: '333333', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Rate/hr', bold: true })] })],
          shading: { fill: '333333', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
        new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text: 'Amount', bold: true })] })],
          shading: { fill: '333333', color: 'FFFFFF' },
          verticalAlign: VerticalAlign.CENTER,
        }),
      ],
    }),
  ];

  timeEntries.forEach(entry => {
    const matter = matters.find(m => m.id === entry.matterId);
    const totalHours = entry.hours + entry.minutes / 60;
    tableRows.push(
      new TableRow({
        children: [
          new TableCell({
            children: [new Paragraph(entry.date.toLocaleDateString())],
          }),
          new TableCell({
            children: [new Paragraph(matter?.name || 'General')],
          }),
          new TableCell({
            children: [new Paragraph(entry.description)],
          }),
          new TableCell({
            children: [new Paragraph(`${totalHours.toFixed(2)}`)],
          }),
          new TableCell({
            children: [new Paragraph(`$${entry.rate.toFixed(2)}`)],
          }),
          new TableCell({
            children: [new Paragraph(`$${entry.amount.toFixed(2)}`)],
          }),
        ],
      })
    );
  });

  const doc = new Document({
    sections: [
      {
        children: [
          // Header
          new Paragraph({
            children: [new TextRun({ text: 'BILL OF COSTS', bold: true, size: 72 })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            children: [new TextRun({ text: '(Ontario Rules of Civil Procedure, Form 57A)', italics: true, size: 22 })],
            spacing: { after: 200 },
          }),

          // Lawyer information
          new Paragraph({
            children: [new TextRun({ text: 'LAWYER:', bold: true, size: 22 })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: firmProfile?.lawyerName || 'Lawyer Name',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: firmProfile?.firmName || 'Law Firm',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `${firmProfile?.address}, ${firmProfile?.city}, ${firmProfile?.province} ${firmProfile?.postalCode}`,
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `Phone: ${firmProfile?.phone || 'Phone'}`,
            spacing: { after: 200 },
          }),

          // Client information
          new Paragraph({
            children: [new TextRun({ text: 'CLIENT:', bold: true, size: 22 })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: client?.name || 'Client',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: client?.address || 'Address',
            spacing: { after: 200 },
          }),

          // Bill details
          new Table({
            width: { size: 100, type: 'pct' },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'BILL OF COSTS NUMBER:', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph(billNumber)],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'DATE:', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph(new Date().toLocaleDateString())],
                  }),
                ],
              }),
            ],
          }),

          new Paragraph({
            text: '',
            spacing: { after: 200 },
          }),

          // Services table
          new Table({
            width: { size: 100, type: 'pct' },
            rows: tableRows,
          }),

          // Summary section
          new Paragraph({
            text: '',
            spacing: { after: 200 },
          }),
          new Table({
            width: { size: 50, type: 'pct' },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'Subtotal:', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `$${subtotal.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'HST (13%):', bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: `$${hst.toFixed(2)}`, alignment: AlignmentType.RIGHT })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: 'TOTAL:', bold: true, size: 48 })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: `$${total.toFixed(2)}`, bold: true, size: 48 })] })],
                  }),
                ],
              }),
            ],
          }),

          // Compliance notes
          new Paragraph({
            text: '',
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: 'This bill of costs is prepared in accordance with:', bold: true, size: 22 })],
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: '• Ontario Rules of Civil Procedure, Form 57A',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: '• Tariff A - Standard Fees',
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: '• Rule 57.01 - Costs',
            spacing: { after: 200 },
          }),

          // Certification
          new Paragraph({
            text: `Prepared by: ${firmProfile?.lawyerName || 'Lawyer Name'}`,
            spacing: { after: 50 },
          }),
          new Paragraph({
            text: `Date: ${new Date().toLocaleDateString()}`,
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `BillOfCosts-${billNumber}.docx`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
