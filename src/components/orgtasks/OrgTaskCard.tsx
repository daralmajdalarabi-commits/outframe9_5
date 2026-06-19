import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import type { OrgTask } from '../../types';
import { User, AlertCircle, CheckCircle, Circle, Trash2 } from 'lucide-react';

interface Props {
  task: OrgTask;
  onToggle: (id: string) => void;
  onEdit: (task: OrgTask) => void;
  onDelete: (id: string) => void;
}

const priorityConfig = {
  low: { label: 'Low', color: '#666' },
  medium: { label: 'Medium', color: '#F4C430' },
  high: { label: 'High', color: '#FF9800' },
  critical: { label: 'Critical', color: '#FF1744' },
};

export default function OrgTaskCard({ task, onToggle, onEdit, onDelete }: Props) {
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';
  const pc = priorityConfig[task.priority];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`card p-4 border-l-4 transition-all ${task.completed ? 'border-l-[#00C853] opacity-70' : 'border-l-transparent'}`}
    >
      <div className="flex items-start gap-3">
        {isAdmin && (
          <button onClick={() => onToggle(task.id)} className="mt-0.5 flex-shrink-0">
            {task.completed ? (
              <CheckCircle className="w-5 h-5 text-[#00C853]" />
            ) : (
              <Circle className="w-5 h-5 text-[#666]" />
            )}
          </button>
        )}

        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit(task)}>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className={`text-sm font-semibold ${task.completed ? 'text-[#666] line-through' : 'text-white'}`}>{task.title}</h3>
            <span className="badge text-[10px]" style={{ background: `${pc.color}20`, color: pc.color, border: `1px solid ${pc.color}30` }}>
              <AlertCircle className="w-3 h-3 mr-0.5 inline" />
              {pc.label}
            </span>
          </div>
          {task.details && (
            <p className="text-xs text-[#666] mt-1 line-clamp-2">{task.details}</p>
          )}
          <div className="flex items-center gap-3 mt-2 text-[10px] text-[#666]">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> {task.assignedTo}
            </span>
            <span>{new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {isAdmin && (
          <button onClick={() => onDelete(task.id)} className="text-[#666] hover:text-[#FF1744] transition-colors flex-shrink-0">
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}
