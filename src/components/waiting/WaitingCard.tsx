import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import type { WaitingItem, WaitingTask } from '../../types';
import { Clock, CheckCircle, Circle, User, DollarSign, Calendar, Paperclip } from 'lucide-react';

interface Props {
  item: WaitingItem;
  tasks: WaitingTask[];
  onEdit: (item: WaitingItem) => void;
  onDelete: (id: string) => void;
  onComplete: (id: string) => void;
  onOpen: (item: WaitingItem) => void;
}

const statusConfig = {
  'pending': { label: 'Pending', color: '#F4C430', bg: 'rgba(244,196,48,0.15)' },
  'in-progress': { label: 'In Progress', color: '#2196F3', bg: 'rgba(33,150,243,0.15)' },
  'completed': { label: 'Completed', color: '#00C853', bg: 'rgba(0,200,83,0.15)' },
};

export default function WaitingCard({ item, tasks, onEdit, onDelete, onComplete, onOpen }: Props) {
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';
  const itemTasks = tasks.filter((t) => t.waitingItemId === item.id);
  const doneTasks = itemTasks.filter((t) => t.completed).length;
  const cfg = statusConfig[item.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-4 cursor-pointer group"
      onClick={() => onOpen(item)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white text-sm truncate">{item.clientName}</h3>
          <p className="text-xs text-[#A0A0A0] truncate">{item.projectName}</p>
        </div>
        <div className="flex items-center gap-1 ml-2">
          {item.status !== 'completed' && isAdmin && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onComplete(item.id); }}
              className="w-7 h-7 rounded-lg bg-[#00C853]/10 border border-[#00C853]/20 flex items-center justify-center hover:bg-[#00C853]/20 transition-colors"
              title="Mark completed"
            >
              <CheckCircle className="w-3.5 h-3.5 text-[#00C853]" />
            </motion.button>
          )}
        </div>
      </div>

      {item.details && (
        <p className="text-xs text-[#666] mb-3 line-clamp-2">{item.details}</p>
      )}

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span className="badge text-[10px]" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30` }}>
          {cfg.label}
        </span>
        {item.attachments.length > 0 && (
          <span className="badge bg-white/[0.03] text-[#A0A0A0] border-[#2A2A2A] text-[10px] flex items-center gap-1">
            <Paperclip className="w-3 h-3" />
            {item.attachments.length}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs text-[#666]">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <DollarSign className="w-3 h-3" />
            {item.amount.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />
          {doneTasks}/{itemTasks.length}
        </span>
      </div>
    </motion.div>
  );
}
