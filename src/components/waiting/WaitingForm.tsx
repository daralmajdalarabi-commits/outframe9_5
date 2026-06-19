import { useState, useRef } from 'react';
import type { WaitingItem, Attachment } from '../../types';
import { generateId } from '../../utils';
import { Upload, X, Paperclip } from 'lucide-react';

interface Props {
  initial: WaitingItem | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function WaitingForm({ initial, onSave, onCancel }: Props) {
  const [clientName, setClientName] = useState(initial?.clientName || '');
  const [projectName, setProjectName] = useState(initial?.projectName || '');
  const [details, setDetails] = useState(initial?.details || '');
  const [date, setDate] = useState(initial?.date || new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState(initial?.amount?.toString() || '');
  const [attachments, setAttachments] = useState<Attachment[]>(initial?.attachments || []);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    for (const file of files) {
      const data = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      setAttachments((prev) => [...prev, { id: generateId(), name: file.name, type: file.type, data, size: file.size }]);
    }
    e.target.value = '';
  };

  const removeAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initial ? { id: initial.id, status: initial.status } : {}),
      clientName,
      projectName,
      details,
      date,
      amount: Number(amount),
      attachments,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#A0A0A0] mb-1.5">Client Name</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Client name" className="input h-10" required />
        </div>
        <div>
          <label className="block text-xs text-[#A0A0A0] mb-1.5">Project Name</label>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name" className="input h-10" required />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5">Details</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Request details..." className="input min-h-[80px] resize-y" rows={3} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-[#A0A0A0] mb-1.5">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input h-10" required />
        </div>
        <div>
          <label className="block text-xs text-[#A0A0A0] mb-1.5">Amount</label>
          <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" className="input h-10" min="0" required />
        </div>
      </div>

      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5">Attachments</label>
        <input ref={fileRef} type="file" multiple accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFile} className="hidden" />
        <div className="flex items-center gap-2 flex-wrap">
          {attachments.map((a) => (
            <div key={a.id} className="flex items-center gap-1.5 bg-white/[0.03] border border-[#2A2A2A] rounded-lg px-2.5 py-1.5 text-xs">
              <Paperclip className="w-3 h-3 text-[#666]" />
              <span className="text-[#A0A0A0] truncate max-w-[120px]">{a.name}</span>
              <button type="button" onClick={() => removeAttachment(a.id)} className="text-[#666] hover:text-[#FF1744]">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button type="button" onClick={() => fileRef.current?.click()} className="btn-secondary !p-2 !rounded-lg text-xs flex items-center gap-1">
            <Upload className="w-3.5 h-3.5" /> Upload
          </button>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">{initial ? 'Update' : 'Add'} Request</button>
      </div>
    </form>
  );
}
