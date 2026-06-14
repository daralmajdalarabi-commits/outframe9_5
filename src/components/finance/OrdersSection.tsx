import { useState } from 'react';
import { motion } from 'framer-motion';
import { useFinanceStore } from '../../stores/financeStore';
import { useAuthStore } from '../../stores/authStore';
import type { Order } from '../../types';
import { generateId, formatDate } from '../../utils';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import Modal from '../common/Modal';

export default function OrdersSection() {
  const { orders, addOrder, updateOrder, deleteOrder } = useFinanceStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Order | null>(null);
  const [form, setForm] = useState({ client: '', title: '', value: 0, date: '', notes: '' });

  const openCreate = () => {
    setEditing(null);
    setForm({ client: '', title: '', value: 0, date: new Date().toISOString().split('T')[0], notes: '' });
    setModalOpen(true);
  };

  const openEdit = (order: Order) => {
    setEditing(order);
    setForm({ client: order.client, title: order.title, value: order.value, date: order.date, notes: order.notes });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateOrder(editing.id, form);
    } else {
      addOrder({ id: generateId(), ...form, value: Number(form.value), createdAt: new Date().toISOString() });
    }
    setModalOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-white">Orders</h3>
        {isAdmin && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={openCreate} className="btn-primary !py-1.5 !px-3 text-xs flex items-center gap-1">
            <Plus className="w-3 h-3" /> Add Order
          </motion.button>
        )}
      </div>

      <div className="space-y-2">
        {orders.map((order, i) => (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="card p-4 flex items-center justify-between group"
          >
            <div>
              <p className="text-sm text-white font-medium">{order.title}</p>
              <div className="flex items-center gap-3 text-xs text-[#666] mt-0.5">
                <span>{order.client}</span>
                <span>{formatDate(order.date)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[#00C853]">+${order.value.toLocaleString()}</span>
              {isAdmin && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(order)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#F4C430]"><Edit3 className="w-3 h-3" /></button>
                  <button onClick={() => deleteOrder(order.id)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#FF1744]"><Trash2 className="w-3 h-3" /></button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
        {orders.length === 0 && <p className="text-center text-sm text-[#666] py-8">No orders recorded</p>}
      </div>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Order' : 'Add Order'}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Client</label>
            <input value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className="input" placeholder="Client name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Order Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input" placeholder="Order title" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Value ($)</label>
            <input type="number" min={0} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} className="input" />
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
