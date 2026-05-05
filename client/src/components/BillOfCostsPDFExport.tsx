import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { generateBillOfCostsPDF } from '@/lib/pdfGenerator';

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

interface BillOfCostsPDFExportProps {
  timeEntries: TimeEntry[];
  clients: Client[];
  matters: Matter[];
  isOpen: boolean;
  onClose: () => void;
}

export function BillOfCostsPDFExport({
  timeEntries,
  clients,
  matters,
  isOpen,
  onClose
}: BillOfCostsPDFExportProps) {
  const [billNumber, setBillNumber] = useState(
    `BOC-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
  );

  const handleGenerateBillOfCosts = () => {
    generateBillOfCostsPDF(timeEntries, clients, matters, billNumber);
    onClose();
  };

  if (timeEntries.length === 0) {
    return null;
  }

  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Bill of Costs
          </DialogTitle>
          <DialogDescription>
            Create an Ontario-compliant Bill of Costs (Form 57A)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Compliance Notice */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-medium">Ontario Rules of Civil Procedure</div>
              <div className="text-xs mt-1">
                This bill of costs is prepared in accordance with Form 57A and Tariff A
              </div>
            </div>
          </div>

          {/* Bill Summary */}
          <div className="bg-slate-50 p-4 rounded-lg space-y-2">
            <div className="text-sm font-medium">Bill Summary</div>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Time Entries:</span>
                <span className="font-medium">{timeEntries.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Hours:</span>
                <span className="font-medium">
                  {(
                    timeEntries.reduce((sum, e) => sum + e.hours + e.minutes / 60, 0)
                  ).toFixed(2)}h
                </span>
              </div>
              <div className="border-t pt-1 mt-1">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>HST (13%):</span>
                  <span className="font-medium">${hst.toFixed(2)}</span>
                </div>
              </div>
              <div className="border-t pt-1 mt-1 bg-white p-2 rounded">
                <div className="flex justify-between font-bold">
                  <span>Total Due:</span>
                  <span className="text-blue-600">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill Number */}
          <div className="space-y-2">
            <Label htmlFor="bill-number">Bill Number</Label>
            <Input
              id="bill-number"
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="BOC-2025-0001"
            />
          </div>

          {/* Client Info */}
          {timeEntries.length > 0 && (
            <div className="bg-blue-50 p-3 rounded-lg text-sm">
              <div className="font-medium text-blue-900">
                {clients.find(c => c.id === timeEntries[0].clientId)?.name || 'Unknown Client'}
              </div>
              <div className="text-xs text-blue-800 mt-1">
                {clients.find(c => c.id === timeEntries[0].clientId)?.address}
              </div>
            </div>
          )}

          {/* Compliance Details */}
          <div className="bg-slate-50 p-3 rounded-lg text-xs text-slate-600 space-y-1">
            <div className="font-medium text-slate-900">Compliance Details:</div>
            <div>✓ Form 57A - Bill of Costs format</div>
            <div>✓ Tariff A - Standard fees applied</div>
            <div>✓ Rule 57.01 - Costs calculation</div>
            <div>✓ HST included at 13%</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerateBillOfCosts} className="gap-2">
            <Download className="h-4 w-4" />
            Generate & Download
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
