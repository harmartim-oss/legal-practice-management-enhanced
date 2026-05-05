import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText } from 'lucide-react';
import { generateInvoicePDF, generateCoverLetterPDF } from '@/lib/pdfGenerator';

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

interface InvoicePDFExportProps {
  timeEntries: TimeEntry[];
  clients: Client[];
  matters: Matter[];
  isOpen: boolean;
  onClose: () => void;
}

export function InvoicePDFExport({
  timeEntries,
  clients,
  matters,
  isOpen,
  onClose
}: InvoicePDFExportProps) {
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
  );
  const [includeCoverLetter, setIncludeCoverLetter] = useState(true);

  const handleGenerateInvoice = () => {
    generateInvoicePDF(timeEntries, clients, matters, invoiceNumber);
    
    if (includeCoverLetter) {
      const firstEntry = timeEntries[0];
      const client = clients.find(c => c.id === firstEntry.clientId);
      const matter = matters.find(m => m.id === firstEntry.matterId);
      
      if (client && matter) {
        generateCoverLetterPDF(client.name, matter.name, invoiceNumber);
      }
    }
    
    onClose();
  };

  if (timeEntries.length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Invoice PDF
          </DialogTitle>
          <DialogDescription>
            Create a professional invoice for your time entries
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Invoice Summary */}
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium">Invoice Summary</div>
            <div className="text-xs text-slate-600">
              <div>Time Entries: {timeEntries.length}</div>
              <div>
                Total Hours: {(
                  timeEntries.reduce((sum, e) => sum + e.hours + e.minutes / 60, 0)
                ).toFixed(2)}h
              </div>
              <div>
                Subtotal: ${(
                  timeEntries.reduce((sum, e) => sum + e.amount, 0)
                ).toFixed(2)}
              </div>
              <div>
                HST (13%): ${(
                  timeEntries.reduce((sum, e) => sum + e.amount, 0) * 0.13
                ).toFixed(2)}
              </div>
              <div className="font-medium pt-2 border-t">
                Total: ${(
                  timeEntries.reduce((sum, e) => sum + e.amount, 0) * 1.13
                ).toFixed(2)}
              </div>
            </div>
          </div>

          {/* Invoice Number */}
          <div className="space-y-2">
            <Label htmlFor="invoice-number">Invoice Number</Label>
            <Input
              id="invoice-number"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              placeholder="INV-2025-0001"
            />
          </div>

          {/* Include Cover Letter */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="cover-letter"
              checked={includeCoverLetter}
              onChange={(e) => setIncludeCoverLetter(e.target.checked)}
              className="w-4 h-4 rounded border-slate-300"
            />
            <Label htmlFor="cover-letter" className="cursor-pointer">
              Include cover letter with invoice
            </Label>
          </div>

          {/* Client Info */}
          {timeEntries.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <div className="font-medium text-blue-900">
                {clients.find(c => c.id === timeEntries[0].clientId)?.name || 'Unknown Client'}
              </div>
              <div className="text-xs text-blue-800 mt-1">
                {clients.find(c => c.id === timeEntries[0].clientId)?.email}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerateInvoice} className="gap-2">
            <Download className="h-4 w-4" />
            Generate & Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
