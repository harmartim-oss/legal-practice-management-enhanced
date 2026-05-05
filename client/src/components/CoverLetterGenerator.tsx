import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, AlertCircle } from 'lucide-react';
import { useFirmProfile } from '@/contexts/FirmContext';
import { generateCoverLetterPDFWithFirm } from '@/lib/pdfGeneratorV2';
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

interface CoverLetterGeneratorProps {
  timeEntries: TimeEntry[];
  clients: Client[];
  matters: Matter[];
  isOpen: boolean;
  onClose: () => void;
}

export function CoverLetterGenerator({
  timeEntries,
  clients,
  matters,
  isOpen,
  onClose
}: CoverLetterGeneratorProps) {
  const { firmProfile } = useFirmProfile();
  const [invoiceNumber, setInvoiceNumber] = useState(
    `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000)}`
  );
  const [clientName, setClientName] = useState('');
  const [matterDescription, setMatterDescription] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Pre-fill from first time entry if available
  React.useEffect(() => {
    if (timeEntries.length > 0 && isOpen) {
      const firstEntry = timeEntries[0];
      const client = clients.find(c => c.id === firstEntry.clientId);
      const matter = matters.find(m => m.id === firstEntry.matterId);
      
      if (client && !clientName) {
        setClientName(client.name);
      }
      if (matter && !matterDescription) {
        setMatterDescription(matter.name);
      }
    }
  }, [isOpen, timeEntries, clients, matters, clientName, matterDescription]);

  const handleGenerate = async () => {
    if (!clientName || !matterDescription) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!firmProfile) {
      toast.error('Please create a firm profile first');
      return;
    }

    setIsGenerating(true);
    try {
      await generateCoverLetterPDFWithFirm(
        clientName,
        matterDescription,
        invoiceNumber,
        firmProfile
      );
      toast.success('Cover letter generated and downloaded');
      onClose();
    } catch (error) {
      toast.error('Failed to generate cover letter');
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!firmProfile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate Cover Letter
            </DialogTitle>
          </DialogHeader>
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <div className="font-medium">Firm Profile Required</div>
              <div className="text-xs mt-1">
                Please create a firm profile first to generate cover letters with your branding.
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end border-t pt-4">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Generate Cover Letter
          </DialogTitle>
          <DialogDescription>
            Create a professional cover letter with your firm branding and logo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Firm Info Preview */}
          <div className="bg-slate-50 p-4 rounded-lg border">
            <div className="text-sm font-medium mb-3">Your Firm Information</div>
            <div className="flex gap-4">
              {firmProfile.logoBase64 && (
                <div className="w-16 h-16 border rounded flex items-center justify-center bg-white">
                  <img
                    src={firmProfile.logoBase64}
                    alt="Firm logo"
                    className="w-full h-full object-contain p-1"
                  />
                </div>
              )}
              <div className="text-xs space-y-1">
                <div className="font-medium text-slate-900">{firmProfile.firmName}</div>
                <div className="text-slate-600">{firmProfile.lawyerName}</div>
                <div className="text-slate-600">{firmProfile.email}</div>
                <div className="text-slate-600">{firmProfile.phone}</div>
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

          {/* Client Name */}
          <div className="space-y-2">
            <Label htmlFor="client-name">Client Name *</Label>
            <Input
              id="client-name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g., ABC Corporation"
            />
          </div>

          {/* Matter Description */}
          <div className="space-y-2">
            <Label htmlFor="matter-description">Matter Description *</Label>
            <Input
              id="matter-description"
              value={matterDescription}
              onChange={(e) => setMatterDescription(e.target.value)}
              placeholder="e.g., Commercial Lease Review"
            />
          </div>

          {/* Custom Message (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="custom-message">Additional Message (Optional)</Label>
            <Textarea
              id="custom-message"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              placeholder="Add any additional message to include in the cover letter..."
              rows={3}
            />
          </div>

          {/* Preview Info */}
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
            <div className="font-medium mb-2">Cover Letter Will Include:</div>
            <ul className="text-xs space-y-1">
              <li>✓ Your firm logo and branding</li>
              <li>✓ Complete firm contact information</li>
              <li>✓ Professional letter formatting</li>
              <li>✓ Client and matter details</li>
              <li>✓ Law Society license information</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleGenerate}
            disabled={isGenerating || !clientName || !matterDescription}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate & Download'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
