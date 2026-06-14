import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { Edit3, Trash2, User } from 'lucide-react';
import { formatDate, getTaskStatusBadge, getTaskPriorityBadge } from '../../utils';
import { useAuthStore } from '../../stores/authStore';

interface TableViewProps {
  tasks: Task[];
  onEdit: (t: Task) => void;
  onDelete: (id: string) => void;
}

export default function TableView({ tasks, onEdit, onDelete }: TableViewProps) {
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#2A2A2A]">
            <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Title</th>
            <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Assigned</th>
            <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Status</th>
            <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Priority</th>
            <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Due Date</th>
            <th className="text-left text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Hours</th>
            {isAdmin && <th className="text-right text-xs font-medium text-[#666] uppercase tracking-wider pb-3 px-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, i) => (
            <motion.tr
              key={task.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="border-b border-[#2A2A2A]/50 hover:bg-white/[0.02] transition-colors group"
            >
              <td className="py-3 px-3">
                <span className="text-sm text-white">{task.title}</span>
              </td>
              <td className="py-3 px-3">
                <span className="text-sm text-[#A0A0A0] flex items-center gap-1.5">
                  <User className="w-3 h-3" />{task.assignedTo}
                </span>
              </td>
              <td className="py-3 px-3">
                <span className={`badge ${getTaskStatusBadge(task.status)}`}>{task.status}</span>
              </td>
              <td className="py-3 px-3">
                <span className={`badge ${getTaskPriorityBadge(task.priority)}`}>{task.priority}</span>
              </td>
              <td className="py-3 px-3 text-sm text-[#A0A0A0]">{formatDate(task.dueDate)}</td>
              <td className="py-3 px-3 text-sm text-[#A0A0A0]">{task.estimatedHours}h</td>
              {isAdmin && (
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => onEdit(task)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#F4C430] transition-colors">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onDelete(task.id)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#FF1744] transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              )}
            </motion.tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="text-center py-12 text-sm text-[#666]">No tasks found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
