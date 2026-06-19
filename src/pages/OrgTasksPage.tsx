import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOrgTaskStore } from '../stores/orgTaskStore';
import { useAuthStore } from '../stores/authStore';
import type { OrgTask } from '../types';
import { generateId } from '../utils';
import { Plus, Search, CheckCircle, XCircle } from 'lucide-react';
import Modal from '../components/common/Modal';
import Notification from '../components/common/Notification';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import OrgTaskCard from '../components/orgtasks/OrgTaskCard';
import OrgTaskForm from '../components/orgtasks/OrgTaskForm';

export default function OrgTasksPage() {
  const { tasks, loading, loadTasks, addTask, updateTask, deleteTask } = useOrgTaskStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState<OrgTask | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filtered = useMemo(() => {
    let result = tasks;
    if (filter === 'active') result = result.filter((t) => !t.completed);
    if (filter === 'completed') result = result.filter((t) => t.completed);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((t) => t.title.toLowerCase().includes(q) || t.assignedTo.toLowerCase().includes(q));
    }
    return result;
  }, [tasks, filter, search]);

  const handleSave = (data: any) => {
    if (data.id) {
      updateTask(data.id, data);
      notify('success', 'Task updated');
    } else {
      addTask({
        id: generateId(),
        ...data,
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      notify('success', 'Task added');
    }
    setModal(false);
    setEditing(null);
  };

  const handleToggle = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    updateTask(id, { completed: !task.completed });
    notify('success', task.completed ? 'Task reopened' : 'Task completed');
  };

  return (
    <div className="space-y-6">
      <Notification type={notification?.type || 'info'} message={notification?.message || ''} isVisible={!!notification} onClose={() => setNotification(null)} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Organization Tasks</h1>
          <p className="text-sm text-[#666] mt-1">Manage organizational tasks and assignments</p>
        </div>
        {isAdmin && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => { setEditing(null); setModal(true); }}
            className="btn-primary text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> New Task
          </motion.button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." className="input pl-10" />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-[#2A2A2A]">
          {(['all', 'active', 'completed'] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                filter === f ? 'bg-[#8B0000]/20 text-white border border-[#8B0000]/30' : 'text-[#666] hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'active' ? 'Active' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((task) => (
              <OrgTaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => { setEditing(t); setModal(true); }}
                onDelete={(id) => { deleteTask(id); notify('success', 'Task deleted'); }}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <EmptyState title="No tasks found" description="Add a new task or change your filters"
          action={isAdmin ? { label: 'New Task', onClick: () => { setEditing(null); setModal(true); } } : undefined}
        />
      )}

      <Modal isOpen={modal} onClose={() => { setModal(false); setEditing(null); }} title={editing ? 'Edit Task' : 'New Task'}>
        <OrgTaskForm initial={editing} onSave={handleSave} onCancel={() => { setModal(false); setEditing(null); }} />
      </Modal>
    </div>
  );
}
