import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import type { Project } from '../../types';
import { Edit3, Trash2, Calendar, DollarSign } from 'lucide-react';
import { formatDate, getStatusBadge, getPriorityBadge } from '../../utils';

interface ProjectCardProps {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
}

export default function ProjectCard({ project, onEdit, onDelete }: ProjectCardProps) {
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      className="card p-5 group cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-white truncate">{project.name}</h3>
          <p className="text-xs text-[#666] mt-0.5">{project.client}</p>
        </div>
        <div className="flex items-center gap-1.5 ml-2">
          <span className={`badge ${getPriorityBadge(project.priority)}`}>
            {project.priority}
          </span>
        </div>
      </div>

      <p className="text-sm text-[#A0A0A0] line-clamp-2 mb-4">{project.description}</p>

      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-xs text-[#666]">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${project.progress}%` }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#F4C430]"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-xs text-[#666]">
        <span className={`badge ${getStatusBadge(project.status)}`}>
          {project.status}
        </span>
        <span className="flex items-center gap-1">
          <DollarSign className="w-3 h-3" />${project.budget.toLocaleString()}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" />{formatDate(project.endDate)}
        </span>
      </div>

      {isAdmin && (
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#2A2A2A] opacity-0 group-hover:opacity-100 transition-opacity">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(project)}
            className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#F4C430] transition-colors px-2 py-1 rounded-md hover:bg-white/[0.03]"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(project.id)}
            className="flex items-center gap-1.5 text-xs text-[#666] hover:text-[#FF1744] transition-colors px-2 py-1 rounded-md hover:bg-white/[0.03]"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </motion.button>
        </div>
      )}
    </motion.div>
  );
}
