import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWaitingStore } from '../stores/waitingStore';
import { useFinanceStore } from '../stores/financeStore';
import { useAuthStore } from '../stores/authStore';
import type { WaitingItem } from '../types';
import { generateId } from '../utils';
import { Plus, Search, Clock, CheckCircle, Loader } from 'lucide-react';
import Modal from '../components/common/Modal';
import Notification from '../components/common/Notification';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import WaitingCard from '../components/waiting/WaitingCard';
import WaitingForm from '../components/waiting/WaitingForm';
import WaitingTasks from '../components/waiting/WaitingTasks';

const tabs = [
  { id: 'all', label: 'All', icon: null },
  { id: 'pending', label: 'Pending', icon: Clock },
  { id: 'in-progress', label: 'In Progress', icon: Loader },
  { id: 'completed', label: 'Completed', icon: CheckCircle },
];

export default function WaitingPage() {
  const { items, tasks, loading, loadItems, addItem, updateItem, deleteItem } = useWaitingStore();
  const { addOrder } = useFinanceStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  const [tab, setTab] = useState('all');
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<WaitingItem | null>(null);
  const [detailItem, setDetailItem] = useState<WaitingItem | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadItems();
  }, []);

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = useMemo(() => {
    let result = items;
    if (tab !== 'all') result = result.filter((i) => i.status === tab);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.clientName.toLowerCase().includes(q) || i.projectName.toLowerCase().includes(q));
    }
    result.sort((a, b) => {
      const order = { 'in-progress': 0, 'pending': 1, 'completed': 2 };
      return (order[a.status] ?? 1) - (order[b.status] ?? 1);
    });
    return result;
  }, [items, tab, search]);

  const handleSave = (data: any) => {
    if (data.id) {
      updateItem(data.id, data);
      notify('success', 'Request updated');
    } else {
      addItem({
        id: generateId(),
        ...data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      notify('success', 'Request added to waiting list');
    }
    setModal(false);
    setEditing(null);
  };

  const toggleComplete = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    if (item.status === 'completed') {
      updateItem(id, { status: 'in-progress' });
      notify('success', 'Request reverted to In Progress');
    } else {
      updateItem(id, { status: 'completed' });
      addOrder({
        id: generateId(),
        client: item.clientName,
        title: item.projectName,
        value: item.amount,
        date: new Date().toISOString().split('T')[0],
        notes: `Auto-generated from completed waiting request: ${item.details}`,
        createdAt: new Date().toISOString(),
      });
      notify('success', `Request completed: ${item.amount.toLocaleString()} added to orders`);
    }
  };

  return (
    <div className="space-y-6">
      <Notification type={notification?.type || 'info'} message={notification?.message || ''} isVisible={!!notification} onClose={() => setNotification(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Waiting List</h1>
          <p className="text-sm text-[#666] mt-1">Manage client requests and assignments</p>
        </div>
        {isAdmin && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setEditing(null); setModal(true); }}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Request
          </motion.button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search clients and projects..." className="input pl-10" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-[#2A2A2A]">
          {tabs.map((t) => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  tab === t.id ? 'bg-[#8B0000]/20 text-white border border-[#8B0000]/30' : 'text-[#666] hover:text-white'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <WaitingCard
                key={item.id}
                item={item}
                tasks={tasks}
                onEdit={(i) => { setEditing(i); setModal(true); }}
                onDelete={(id) => { deleteItem(id); notify('success', 'Request deleted'); }}
                onOpen={(i) => setDetailItem(i)}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState title="No requests found" description="Add a new client request or change your filters"
          action={isAdmin ? { label: 'New Request', onClick: () => { setEditing(null); setModal(true); } } : undefined}
        />
      )}

      <Modal isOpen={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? 'Edit Request' : 'New Request'}>
        <WaitingForm initial={editing} onSave={handleSave} onCancel={() => { setModal(false); setEditing(null); }} />
      </Modal>

      <Modal isOpen={!!detailItem} onClose={() => setDetailItem(null)} title={detailItem?.clientName || ''}>
        {detailItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge text-xs ${
                detailItem.status === 'completed' ? 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/30' :
                detailItem.status === 'in-progress' ? 'bg-[#2196F3]/15 text-[#2196F3] border-[#2196F3]/30' :
                'bg-[#F4C430]/15 text-[#F4C430] border-[#F4C430]/30'
              }`}>
                {detailItem.status === 'in-progress' ? 'In Progress' : detailItem.status === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-[#666]">Client:</span> <span className="text-white">{detailItem.clientName}</span></div>
              <div><span className="text-[#666]">Project:</span> <span className="text-white">{detailItem.projectName}</span></div>
              <div><span className="text-[#666]">Amount:</span> <span className="text-[#00C853] font-semibold">{detailItem.amount.toLocaleString()}</span></div>
              <div><span className="text-[#666]">Date:</span> <span className="text-white">{new Date(detailItem.date).toLocaleDateString()}</span></div>
            </div>
            {detailItem.details && (
              <div><span className="text-xs text-[#666]">Details:</span><p className="text-sm text-[#A0A0A0] mt-1">{detailItem.details}</p></div>
            )}
            {detailItem.attachments.length > 0 && (
              <div>
                <span className="text-xs text-[#666]">Attachments ({detailItem.attachments.length}):</span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {detailItem.attachments.map((a) => (
                    a.type.startsWith('image/') ? (
                      <a key={a.id} href={a.data} target="_blank" rel="noopener noreferrer" className="block rounded-lg overflow-hidden border border-[#2A2A2A] hover:border-[#8B0000]/30 transition-colors">
                        <img src={a.data} alt={a.name} className="w-full h-24 object-cover" />
                        <p className="text-[10px] text-[#666] text-center py-1 truncate px-1">{a.name}</p>
                      </a>
                    ) : (
                      <a key={a.id} href={a.data} download={a.name} className="flex items-center gap-1.5 bg-white/[0.03] border border-[#2A2A2A] rounded-lg p-2 text-xs text-[#A0A0A0] hover:border-[#8B0000]/30 transition-colors">
                        <span className="truncate">{a.name}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
            <WaitingTasks item={detailItem} />
            {isAdmin && (
              <div className="flex justify-end gap-2 pt-3 border-t border-[#2A2A2A]">
                <button
                  onClick={() => { toggleComplete(detailItem.id); setDetailItem(null); }}
                  className={`btn-primary text-sm flex items-center gap-1.5 ${
                    detailItem.status === 'completed' ? '!bg-[#2196F3]/20 !text-[#2196F3] !border-[#2196F3]/30' : ''
                  }`}
                >
                  {detailItem.status === 'completed' ? 'Revert to In Progress' : 'Mark Completed'}
                </button>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
