import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Edit2, Eye, Save } from 'lucide-react';
import { useFirmProfile } from '@/contexts/FirmContext';
import { generateInvoicePDFWithFirm } from '@/lib/pdfGeneratorV2';
import { generateInvoiceDOCX } from '@/lib/docxGenerator';
import { toast } from 'sonner';
import { saveDraft, generateDraftId, formatDraftTime, InvoiceDraft } from '@/lib/draftManager';

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

interface InvoicePreviewEditorProps {
  timeEntries: TimeEntry[];
  clients: Client[];
  matters: Matter[];
  isOpen: boolean;
  onClose: () => void;
}

export function InvoicePreviewEditor({
  timeEntries,
  clients,
  matters,
  isOpen,
  onClose
}: InvoicePreviewEditorProps) {
  const { firmProfile } = useFirmProfile();
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
  );
  const [notes, setNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const draftIdRef = useRef<string>(generateDraftId('invoice'));
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const client = clients.find(c => c.id === timeEntries[0]?.clientId);
  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isOpen) return;

    const autoSave = () => {
      const draft: InvoiceDraft = {
        id: draftIdRef.current,
        type: 'invoice',
        invoiceNumber,
        additionalNotes: notes,
        timeEntryIds: timeEntries.map(e => e.id),
        clientId: client?.id || '',
        savedAt: Date.now(),
        lastModified: Date.now()
      };
      saveDraft(draft);
      setLastSaved(Date.now());
    };

    // Save immediately when dialog opens
    autoSave();

    // Set up auto-save interval
    autoSaveTimerRef.current = setInterval(autoSave, 30000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearInterval(autoSaveTimerRef.current);
      }
    };
  }, [isOpen, invoiceNumber, notes, timeEntries, client?.id]);

  const handleSaveManually = () => {
    const draft: InvoiceDraft = {
      id: draftIdRef.current,
      type: 'invoice',
      invoiceNumber,
      additionalNotes: notes,
      timeEntryIds: timeEntries.map(e => e.id),
      clientId: client?.id || '',
      savedAt: Date.now(),
      lastModified: Date.now()
    };
    saveDraft(draft);
    setLastSaved(Date.now());
    toast.success('Invoice draft saved');
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateInvoicePDFWithFirm(timeEntries, clients, matters, firmProfile, invoiceNumber);
      toast.success('Invoice PDF downloaded successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportDOCX = async () => {
    setIsExporting(true);
    try {
      await generateInvoiceDOCX(timeEntries, clients, matters, firmProfile, invoiceNumber);
      toast.success('Invoice DOCX downloaded successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to generate DOCX');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle>Invoice Preview & Editor</DialogTitle>
            </div>
            {lastSaved && (
              <div className="text-xs text-slate-500">
                Saved {formatDraftTime(lastSaved)}
              </div>
            )}
          </div>
          <DialogDescription>
            Review and customize your invoice before downloading
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preview" className="gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="edit" className="gap-2">
              <Edit2 className="h-4 w-4" />
              Edit
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4 py-4">
            {/* Invoice Preview */}
            <div className="border rounded-lg p-8 bg-white space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Header */}
              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold">{firmProfile?.firmName || 'Law Firm'}</h1>
                <p className="text-sm text-slate-600">
                  {firmProfile?.address}, {firmProfile?.city}, {firmProfile?.province} {firmProfile?.postalCode}
                </p>
                <p className="text-sm text-slate-600">
                  Phone: {firmProfile?.phone} | Email: {firmProfile?.email}
                </p>
              </div>

              {/* Title and Details */}
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-center">INVOICE</h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-semibold">Invoice Number:</span> {invoiceNumber}
                  </div>
                  <div>
                    <span className="font-semibold">Date:</span> {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Bill To */}
              <div className="space-y-2">
                <h3 className="font-semibold">BILL TO:</h3>
                <div className="text-sm space-y-1">
                  <p>{client?.name}</p>
                  <p>{client?.address}</p>
                  <p>Phone: {client?.phone}</p>
                  <p>Email: {client?.email}</p>
                </div>
              </div>

              {/* Services Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-blue-600 text-white">
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left">Matter</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-right">Time</th>
                      <th className="border p-2 text-right">Rate</th>
                      <th className="border p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeEntries.map(entry => {
                      const matter = matters.find(m => m.id === entry.matterId);
                      return (
                        <tr key={entry.id} className="border-b">
                          <td className="border p-2">{entry.date.toLocaleDateString()}</td>
                          <td className="border p-2">{matter?.name || 'General'}</td>
                          <td className="border p-2">{entry.description}</td>
                          <td className="border p-2 text-right">{entry.hours}h {entry.minutes}m</td>
                          <td className="border p-2 text-right">${entry.rate.toFixed(2)}</td>
                          <td className="border p-2 text-right">${entry.amount.toFixed(2)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold">Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-semibold">HST (13%):</span>
                    <span>${hst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 font-bold text-base">
                    <span>Total Due:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t pt-4 text-xs text-slate-600 space-y-1">
                <p>Payment is due within 30 days of invoice date.</p>
                {firmProfile?.licenseNumber && (
                  <p>Law Society License: {firmProfile.licenseNumber}</p>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 py-4">
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="invoice-number">Invoice Number</Label>
                <Input
                  id="invoice-number"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  placeholder="INV-2025-0001"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or terms to the invoice..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
                <div className="font-medium mb-2">Invoice Details:</div>
                <ul className="text-xs space-y-1">
                  <li>✓ {timeEntries.length} time entries</li>
                  <li>✓ Total billable hours: {(timeEntries.reduce((sum, e) => sum + e.hours + e.minutes / 60, 0)).toFixed(2)}h</li>
                  <li>✓ Subtotal: ${subtotal.toFixed(2)}</li>
                  <li>✓ Total with HST: ${total.toFixed(2)}</li>
                </ul>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Actions */}
        <div className="flex gap-2 justify-end border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveManually}
            variant="outline"
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button
            onClick={handleExportPDF}
            disabled={isExporting}
            className="gap-2"
            variant="outline"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Download PDF'}
          </Button>
          <Button
            onClick={handleExportDOCX}
            disabled={isExporting}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Exporting...' : 'Download DOCX'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
