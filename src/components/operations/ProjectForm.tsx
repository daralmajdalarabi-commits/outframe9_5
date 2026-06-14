import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Project, ProjectPriority, ProjectStatus } from '../../types';

interface ProjectFormProps {
  initial?: Project | null;
  onSave: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }) => void;
  onCancel: () => void;
}

export default function ProjectForm({ initial, onSave, onCancel }: ProjectFormProps) {
  const [form, setForm] = useState({
    name: initial?.name || '',
    description: initial?.description || '',
    client: initial?.client || '',
    startDate: initial?.startDate || '',
    endDate: initial?.endDate || '',
    status: (initial?.status || 'planning') as ProjectStatus,
    progress: initial?.progress || 0,
    priority: (initial?.priority || 'medium') as ProjectPriority,
    budget: initial?.budget || 0,
    teamMembers: initial?.teamMembers?.join(', ') || '',
    notes: initial?.notes || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...(initial?.id ? { id: initial.id } : {}),
      ...form,
      budget: Number(form.budget),
      progress: Number(form.progress),
      teamMembers: form.teamMembers.split(',').map((s) => s.trim()).filter(Boolean),
      attachments: initial?.attachments || [],
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
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Project Name</label>
          <input
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input"
            placeholder="Enter project name"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="input"
            placeholder="Project description"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Client</label>
          <input
            required
            value={form.client}
            onChange={(e) => setForm({ ...form, client: e.target.value })}
            className="input"
            placeholder="Client name"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Budget ($)</label>
          <input
            type="number"
            required
            min={0}
            value={form.budget}
            onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })}
            className="input"
            placeholder="0"
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
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">End Date</label>
          <input
            type="date"
            required
            value={form.endDate}
            onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            className="input"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
            className="input"
          >
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Priority</label>
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as ProjectPriority })}
            className="input"
          >
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Progress (%)</label>
          <input
            type="range"
            min={0}
            max={100}
            value={form.progress}
            onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
            className="w-full accent-[#8B0000]"
          />
          <span className="text-xs text-[#666]">{form.progress}%</span>
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Team Members (comma separated)</label>
          <input
            value={form.teamMembers}
            onChange={(e) => setForm({ ...form, teamMembers: e.target.value })}
            className="input"
            placeholder="John, Jane, Bob"
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-[#A0A0A0] mb-1.5">Internal Notes</label>
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
          {initial ? 'Update Project' : 'Create Project'}
        </button>
      </div>
    </motion.form>
  );
}
