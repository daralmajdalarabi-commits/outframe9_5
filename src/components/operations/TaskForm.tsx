import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Task, TaskStatus, TaskPriority } from '../../types';

interface TaskFormProps {
  initial?: Task | null;
  projectId: string;
  onSave: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'attachments' | 'comments'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function TaskForm({ initial, projectId, onSave, onCancel }: TaskFormProps) {
  const [form, setForm] = useState({
    title: initial?.title || '',
    description: initial?.description || '',
    assignedTo: initial?.assignedTo || '',
    startDate: initial?.startDate || '',
    dueDate: initial?.dueDate || '',
    priority: (initial?.priority || 'medium') as TaskPriority,
    status: (initial?.status || 'backlog') as TaskStatus,
    estimatedHours: initial?.estimatedHours || 0,
    notes: initial?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initial?.id ? { id: initial.id } : {}),
      projectId,
      ...form,
      estimatedHours: Number(form.estimatedHours),
    });
  };

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Title</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="input"
            placeholder="Task title"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
            placeholder="Task description"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Assigned To</label>
          <input
            required
            value={form.assignedTo}
            onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
            className="input"
            placeholder="Person name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Est. Hours</label>
          <input
            type="number"
            min={0}
            value={form.estimatedHours}
            onChange={(e) => setForm({ ...form, estimatedHours: Number(e.target.value) })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Start Date</label>
          <input
            type="date"
            required
            value={form.startDate}
            onChange={(e) => setForm({ ...form, startDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Due Date</label>
          <input
            type="date"
            required
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as TaskStatus })}
            className="input"
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="review">Review</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as TaskPriority })}
            className="input"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Notes</label>
          <textarea
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="input"
            placeholder="Internal notes..."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
        <button type="submit" className="btn-primary">
          {initial ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </motion.form>
  );
}
