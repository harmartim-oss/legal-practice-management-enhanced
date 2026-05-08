// This component is now replaced by RichTextCoverLetterEditor
// Kept for backward compatibility
import { RichTextCoverLetterEditor } from './RichTextCoverLetterEditor';

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
  // Delegate to the new rich text editor
  return (
    <RichTextCoverLetterEditor
      timeEntries={timeEntries}
      clients={clients}
      matters={matters}
      isOpen={isOpen}
      onClose={onClose}
    />
  );
}
