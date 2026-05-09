import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, Edit2, FileText, Save } from 'lucide-react';
import { useFirmProfile } from '@/contexts/FirmContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { toast } from 'sonner';
import { saveDraft, generateDraftId, formatDraftTime, CoverLetterDraft } from '@/lib/draftManager';

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

interface RichTextCoverLetterEditorProps {
  timeEntries: TimeEntry[];
  clients: Client[];
  matters: Matter[];
  isOpen: boolean;
  onClose: () => void;
}

function generateDefaultCoverLetter(client: Client | undefined, matters: Matter[], firmProfile: any) {
  const defaultContent = `<p><strong>${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}</strong></p>
<p>&nbsp;</p>
<p><strong>${client?.name || 'Client Name'}</strong></p>
<p>${client?.address || 'Client Address'}</p>
<p>&nbsp;</p>
<p>Dear Sir or Madam:</p>
<p>&nbsp;</p>
<p><strong>Re: ${matters[0]?.name || 'Matter'}</strong></p>
<p>&nbsp;</p>
<p>Please find enclosed our account for professional services rendered in connection with the above-noted matter.</p>
<p>&nbsp;</p>
<p>We trust this account is satisfactory. If you have any questions regarding the charges, please do not hesitate to contact us.</p>
<p>&nbsp;</p>
<p>Payment is due within 30 days of the date of this letter.</p>
<p>&nbsp;</p>
<p>Yours truly,</p>
<p>&nbsp;</p>
<p>&nbsp;</p>
<p><strong>${firmProfile?.lawyerName || 'Lawyer Name'}</strong></p>
<p>${firmProfile?.firmName || 'Law Firm Name'}</p>
<p>${firmProfile?.phone || 'Phone'}</p>
<p>${firmProfile?.email || 'Email'}</p>`;
  return defaultContent;
}

export function RichTextCoverLetterEditor({
  timeEntries,
  clients,
  matters,
  isOpen,
  onClose
}: RichTextCoverLetterEditorProps) {
  const { firmProfile } = useFirmProfile();
  const client = clients.find(c => c.id === timeEntries[0]?.clientId);
  const [activeTab, setActiveTab] = useState('preview');
  const [coverLetterContent, setCoverLetterContent] = useState('<p>Loading...</p>');
  const [isExporting, setIsExporting] = useState(false);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const draftIdRef = useRef<string>(generateDraftId('cover-letter'));
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  const subtotal = timeEntries.reduce((sum, e) => sum + e.amount, 0);
  const hst = subtotal * 0.13;
  const total = subtotal + hst;

  // Initialize cover letter content when component mounts or when dependencies change
  useEffect(() => {
    setCoverLetterContent(generateDefaultCoverLetter(client, matters, firmProfile));
  }, [client, matters, firmProfile]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (!isOpen) return;

    const autoSave = () => {
      const draft: CoverLetterDraft = {
        id: draftIdRef.current,
        type: 'cover-letter',
        content: coverLetterContent,
        clientId: client?.id || '',
        timeEntryIds: timeEntries.map(e => e.id),
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
  }, [isOpen, coverLetterContent, timeEntries, client?.id]);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const { generateCoverLetterPDFWithFormatting } = await import('@/lib/pdfGeneratorV2');
      await generateCoverLetterPDFWithFormatting(
        coverLetterContent,
        firmProfile,
        client,
        subtotal,
        hst,
        total
      );
      toast.success('Cover letter PDF downloaded successfully');
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
      const { generateCoverLetterDOCXWithFormatting } = await import('@/lib/docxGenerator');
      await generateCoverLetterDOCXWithFormatting(
        coverLetterContent,
        firmProfile,
        client,
        subtotal,
        hst,
        total
      );
      toast.success('Cover letter DOCX downloaded successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to generate DOCX');
      console.error(error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveManually = () => {
    const draft: CoverLetterDraft = {
      id: draftIdRef.current,
      type: 'cover-letter',
      content: coverLetterContent,
      clientId: client?.id || '',
      timeEntryIds: timeEntries.map(e => e.id),
      savedAt: Date.now(),
      lastModified: Date.now()
    };
    saveDraft(draft);
    setLastSaved(Date.now());
    toast.success('Cover letter draft saved');
  };

  const handleReset = () => {
    setCoverLetterContent(generateDefaultCoverLetter(client, matters, firmProfile));
    toast.info('Cover letter reset to default');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <DialogTitle>Cover Letter Editor</DialogTitle>
            </div>
            {lastSaved && (
              <div className="text-xs text-slate-500">
                Saved {formatDraftTime(lastSaved)}
              </div>
            )}
          </div>
          <DialogDescription>
            Customize your cover letter with rich text formatting before exporting
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
              Rich Editor
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-4 py-4">
            {/* Cover Letter Preview */}
            <div className="border rounded-lg p-8 bg-white space-y-4 max-h-[60vh] overflow-y-auto prose prose-sm max-w-none">
              {/* Firm Logo and Header */}
              {firmProfile?.logoBase64 && (
                <div className="text-center mb-6">
                  <img 
                    src={firmProfile.logoBase64} 
                    alt={firmProfile.firmName} 
                    className="h-16 mx-auto mb-4"
                  />
                </div>
              )}

              {/* Firm Contact Info */}
              <div className="text-center text-sm text-slate-600 mb-6 pb-4 border-b">
                <p className="font-semibold">{firmProfile?.firmName}</p>
                <p>{firmProfile?.address}, {firmProfile?.city}, {firmProfile?.province}</p>
                <p>Phone: {firmProfile?.phone} | Email: {firmProfile?.email}</p>
              </div>

              {/* Cover Letter Content */}
              <div 
                className="text-slate-800 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: coverLetterContent }}
              />

              {/* Invoice Summary */}
              <div className="mt-8 pt-6 border-t">
                <h3 className="font-semibold mb-3">Invoice Summary:</h3>
                <table className="w-full text-sm">
                  <tbody>
                    <tr>
                      <td className="py-1">Subtotal:</td>
                      <td className="text-right font-medium">${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                      <td className="py-1">HST (13%):</td>
                      <td className="text-right font-medium">${hst.toFixed(2)}</td>
                    </tr>
                    <tr className="border-t">
                      <td className="py-2 font-bold">Total Due:</td>
                      <td className="text-right font-bold">${total.toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 py-4">
            {/* Rich Text Editor */}
            <div className="space-y-3">
              <div className="flex gap-2 justify-between items-center">
                <label className="text-sm font-medium">Cover Letter Content</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                  >
                    Reset to Default
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <ReactQuill
                  value={coverLetterContent}
                  onChange={setCoverLetterContent}
                  theme="snow"
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      [{ 'color': [] }, { 'background': [] }],
                      [{ 'font': [] }],
                      [{ 'size': ['small', false, 'large', 'huge'] }],
                      ['link'],
                      ['clean']
                    ]
                  }}
                  formats={[
                    'header',
                    'bold', 'italic', 'underline', 'strike',
                    'list', 'bullet',
                    'align',
                    'color', 'background',
                    'font',
                    'size',
                    'link'
                  ]}
                  style={{ height: '400px' }}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800">
                <div className="font-medium mb-2">Formatting Tips:</div>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Use headers for section titles and emphasis</li>
                  <li>Apply bold formatting to client names and matter details</li>
                  <li>Use bullet points for listing services or items</li>
                  <li>Adjust font size for better visual hierarchy</li>
                  <li>Use colors sparingly for professional appearance</li>
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
