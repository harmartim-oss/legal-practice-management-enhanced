import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Trash2, RotateCcw } from 'lucide-react';
import { getDraftsByType, deleteDraft, formatDraftTime, Draft } from '@/lib/draftManager';
import { toast } from 'sonner';

interface DraftRestorationProps {
  isOpen: boolean;
  onClose: () => void;
  onRestoreDraft: (draft: Draft) => void;
}

export function DraftRestoration({
  isOpen,
  onClose,
  onRestoreDraft
}: DraftRestorationProps) {
  const [invoiceDrafts, setInvoiceDrafts] = useState<Draft[]>([]);
  const [billDrafts, setBillDrafts] = useState<Draft[]>([]);
  const [coverLetterDrafts, setCoverLetterDrafts] = useState<Draft[]>([]);
  const [activeTab, setActiveTab] = useState('invoices');

  useEffect(() => {
    if (isOpen) {
      loadDrafts();
    }
  }, [isOpen]);

  const loadDrafts = () => {
    setInvoiceDrafts(getDraftsByType('invoice'));
    setBillDrafts(getDraftsByType('bill-of-costs'));
    setCoverLetterDrafts(getDraftsByType('cover-letter'));
  };

  const handleRestore = (draft: Draft) => {
    onRestoreDraft(draft);
    toast.success(`${draft.type === 'invoice' ? 'Invoice' : draft.type === 'bill-of-costs' ? 'Bill of Costs' : 'Cover Letter'} draft restored`);
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteDraft(id);
    loadDrafts();
    toast.success('Draft deleted');
  };

  const renderDraftList = (drafts: Draft[], type: string) => {
    if (drafts.length === 0) {
      return (
        <div className="text-center py-8 text-slate-500">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p>No {type} drafts found</p>
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {drafts.map(draft => (
          <div
            key={draft.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">
                    {draft.type === 'invoice' && `Invoice: ${(draft as any).invoiceNumber}`}
                    {draft.type === 'bill-of-costs' && `Bill of Costs: ${(draft as any).billNumber}`}
                    {draft.type === 'cover-letter' && 'Cover Letter'}
                  </p>
                  <p className="text-sm text-slate-500">
                    Saved {formatDraftTime(draft.savedAt)}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRestore(draft)}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Restore
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(draft.id)}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5" />
            Restore Drafts
          </DialogTitle>
          <DialogDescription>
            Restore previously saved drafts for invoices, bills of costs, and cover letters
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="invoices">
              Invoices ({invoiceDrafts.length})
            </TabsTrigger>
            <TabsTrigger value="bills">
              Bills ({billDrafts.length})
            </TabsTrigger>
            <TabsTrigger value="letters">
              Letters ({coverLetterDrafts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="invoices" className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {renderDraftList(invoiceDrafts, 'invoice')}
          </TabsContent>

          <TabsContent value="bills" className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {renderDraftList(billDrafts, 'bill of costs')}
          </TabsContent>

          <TabsContent value="letters" className="space-y-4 py-4 max-h-[400px] overflow-y-auto">
            {renderDraftList(coverLetterDrafts, 'cover letter')}
          </TabsContent>
        </Tabs>

        <div className="flex gap-2 justify-end border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
