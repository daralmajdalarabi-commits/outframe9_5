import { useState } from 'react';
import type { OrgTask } from '../../types';

interface Props {
  initial: OrgTask | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function OrgTaskForm({ initial, onSave, onCancel }: Props) {
  const [title, setTitle] = useState(initial?.title || '');
  const [details, setDetails] = useState(initial?.details || '');
  const [assignedTo, setAssignedTo] = useState(initial?.assignedTo || '');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>(initial?.priority || 'medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !assignedTo.trim()) return;
    onSave({
      ...(initial ? { id: initial.id, completed: initial.completed } : {}),
      title,
      details,
      assignedTo,
      priority,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5">Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className="input h-10" required />
      </div>

      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5">Assigned To</label>
        <input value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} placeholder="Person name" className="input h-10" required />
      </div>

      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5">Priority</label>
        <select value={priority} onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high' | 'critical')} className="input h-10">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      <div>
        <label className="block text-xs text-[#A0A0A0] mb-1.5">Details</label>
        <textarea value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Task details..." className="input min-h-[80px] resize-y" rows={3} />
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
        <button type="submit" className="btn-primary text-sm">{initial ? 'Update' : 'Add'} Task</button>
      </div>
    </form>
  );
}
