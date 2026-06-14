import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import type { Task } from '../../types';
import { Edit3, Trash2, Clock, User } from 'lucide-react';
import { formatDate, getTaskStatusBadge, getTaskPriorityBadge } from '../../utils';

interface TaskCardProps {
  task: Task;
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="card p-4 group"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-medium text-white truncate flex-1">{task.title}</h4>
        <span className={`badge ${getTaskPriorityBadge(task.priority)} ml-2`}>
          {task.priority}
        </span>
      </div>

      <p className="text-xs text-[#666] line-clamp-2 mb-3">{task.description}</p>

      <div className="flex items-center gap-3 text-xs text-[#666] mb-3">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" />{task.assignedTo}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />{task.estimatedHours}h
        </span>
      </div>

      <div className="flex items-center justify-between">
        <span className={`badge ${getTaskStatusBadge(task.status)} text-[10px]`}>
          {task.status}
        </span>
        <span className="text-[10px] text-[#666]">{formatDate(task.dueDate)}</span>
      </div>

      {isAdmin && (
        <div className="flex items-center gap-2 mt-3 pt-2 border-t border-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(task)}
            className="text-[10px] text-[#666] hover:text-[#F4C430] transition-colors"
          >
            <Edit3 className="w-3 h-3" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(task.id)}
            className="text-[10px] text-[#666] hover:text-[#FF1744] transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
