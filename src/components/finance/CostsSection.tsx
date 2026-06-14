import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../../stores/financeStore';
import { useAuthStore } from '../../stores/authStore';
import type { Cost } from '../../types';
import { generateId, formatDate } from '../../utils';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import Modal from '../common/Modal';

export default function CostsSection() {
  const { costs, addCost, updateCost, deleteCost } = useFinanceStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cost | null>(null);
  const [form, setForm] = useState({ title: '', amount: 0, category: '', date: '', notes: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ title: '', amount: 0, category: '', date: new Date().toISOString().split('T')[0], notes: '' });
    setModalOpen(true);
  };

  const openEdit = (cost: Cost) => {
    setEditing(cost);
    setForm({ title: cost.title, amount: cost.amount, category: cost.category, date: cost.date, notes: cost.notes });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateCost(editing.id, form);
    } else {
      addCost({ id: generateId(), ...form, amount: Number(form.amount), createdAt: new Date().toISOString() });
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Costs</h3>
        {isAdmin && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate} className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Cost
          </motion.button>
        )}
      </div>

      <div className="space-y-2">
        {costs.map((cost, i) => (
          <motion.div
            key={cost.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="card p-4 flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-white font-medium">{cost.title}</p>
              <div className="flex items-center gap-3 text-xs text-[#666] mt-0.5">
                <span className="badge !px-2 !py-0.5 text-[10px]" style={{ background: 'rgba(255,23,68,0.1)', color: '#FF1744', border: '1px solid rgba(255,23,68,0.2)' }}>
                  {cost.category}
                </span>
                <span>{formatDate(cost.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#FF1744]">-${cost.amount.toLocaleString()}</span>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(cost)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#F4C430]"><Edit3 className="w-3 h-3" /></button>
                  <button onClick={() => deleteCost(cost.id)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#FF1744]"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {costs.length === 0 && <p className="text-center text-sm text-[#666] py-8">No costs recorded</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Cost' : 'Add Cost'}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Cost title" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Amount ($)</label>
            <input type="number" min={0} value={form.amount} onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })} className="input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Category</label>
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input" placeholder="e.g. Software, Labor" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Date</label>
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="input" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" placeholder="Optional notes" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editing ? 'Update' : 'Add'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
