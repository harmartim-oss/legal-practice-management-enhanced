import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, FileText, Edit2, Eye } from 'lucide-react';
import { useFirmProfile } from '@/contexts/FirmContext';
import { generateBillOfCostsPDFWithFirm } from '@/lib/pdfGeneratorV2';
import { generateBillOfCostsDOCX } from '@/lib/docxGenerator';
import { toast } from 'sonner';

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

interface BillOfCostsPreviewEditorProps {
  timeEntries: TimeEntry[];
  clients: Client[];
  matters: Matter[];
  isOpen: boolean;
  onClose: () => void;
}

export function BillOfCostsPreviewEditor({
  timeEntries,
  clients,
  matters,
  isOpen,
  onClose
}: BillOfCostsPreviewEditorProps) {
  const { firmProfile } = useFirmProfile();
  const [billNumber, setBillNumber] = useState(
    `BOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
  );
  const [notes, setNotes] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState('preview');

  const client = clients.find(c => c.id === timeEntries[0]?.clientId);
  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      await generateBillOfCostsPDFWithFirm(timeEntries, clients, matters, firmProfile, billNumber);
      toast.success('Bill of Costs PDF downloaded successfully');
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
      await generateBillOfCostsDOCX(timeEntries, clients, matters, firmProfile, billNumber);
      toast.success('Bill of Costs DOCX downloaded successfully');
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
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Bill of Costs Preview & Editor
          </DialogTitle>
          <DialogDescription>
            Review and customize your bill of costs (Ontario Form 57A) before downloading
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
            {/* Bill of Costs Preview */}
            <div className="border rounded-lg p-8 bg-white space-y-6 max-h-[60vh] overflow-y-auto">
              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-3xl font-bold">BILL OF COSTS</h1>
                <p className="text-sm italic text-slate-600">
                  (Ontario Rules of Civil Procedure, Form 57A)
                </p>
              </div>

              {/* Lawyer Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">LAWYER:</h3>
                <div className="text-sm space-y-1">
                  <p>{firmProfile?.lawyerName}</p>
                  <p>{firmProfile?.firmName}</p>
                  <p>{firmProfile?.address}, {firmProfile?.city}, {firmProfile?.province} {firmProfile?.postalCode}</p>
                  <p>Phone: {firmProfile?.phone}</p>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-2">
                <h3 className="font-semibold">CLIENT:</h3>
                <div className="text-sm space-y-1">
                  <p>{client?.name}</p>
                  <p>{client?.address}</p>
                </div>
              </div>

              {/* Bill Details */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-semibold">BILL OF COSTS NUMBER:</span> {billNumber}
                </div>
                <div>
                  <span className="font-semibold">DATE:</span> {new Date().toLocaleDateString()}
                </div>
              </div>

              {/* Services Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white">
                      <th className="border p-2 text-left">Date</th>
                      <th className="border p-2 text-left">Matter</th>
                      <th className="border p-2 text-left">Description</th>
                      <th className="border p-2 text-right">Hours</th>
                      <th className="border p-2 text-right">Rate/hr</th>
                      <th className="border p-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timeEntries.map(entry => {
                      const matter = matters.find(m => m.id === entry.matterId);
                      const totalHours = entry.hours + entry.minutes / 60;
                      return (
                        <tr key={entry.id} className="border-b">
                          <td className="border p-2">{entry.date.toLocaleDateString()}</td>
                          <td className="border p-2">{matter?.name || 'General'}</td>
                          <td className="border p-2">{entry.description}</td>
                          <td className="border p-2 text-right">{totalHours.toFixed(2)}</td>
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
                    <span>TOTAL:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Compliance Notes */}
              <div className="border-t pt-4 text-xs text-slate-600 space-y-1">
                <p className="font-semibold">This bill of costs is prepared in accordance with:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Ontario Rules of Civil Procedure, Form 57A</li>
                  <li>Tariff A - Standard Fees</li>
                  <li>Rule 57.01 - Costs</li>
                </ul>
              </div>

              {/* Certification */}
              <div className="border-t pt-4 text-xs text-slate-600 space-y-1">
                <p>Prepared by: {firmProfile?.lawyerName}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 py-4">
            {/* Edit Form */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="bill-number">Bill of Costs Number</Label>
                <Input
                  id="bill-number"
                  value={billNumber}
                  onChange={(e) => setBillNumber(e.target.value)}
                  placeholder="BOC-2025-0001"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any additional notes or terms to the bill of costs..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
                <div className="font-medium mb-2">Bill of Costs Details:</div>
                <ul className="text-xs space-y-1">
                  <li>✓ {timeEntries.length} time entries</li>
                  <li>✓ Total billable hours: {(timeEntries.reduce((sum, e) => sum + e.hours + e.minutes / 60, 0)).toFixed(2)}h</li>
                  <li>✓ Subtotal: ${subtotal.toFixed(2)}</li>
                  <li>✓ Total with HST: ${total.toFixed(2)}</li>
                  <li>✓ Ontario Form 57A Compliant</li>
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
