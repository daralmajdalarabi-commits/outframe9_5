import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { formatDate } from '../../utils';

interface TimelineViewProps {
  tasks: Task[];
}

export default function TimelineView({ tasks }: TimelineViewProps) {
  const sorted = [...tasks].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

  if (sorted.length === 0) {
    return <div className="text-center py-12 text-sm text-[#666]">No tasks to display</div>;
  }

  const start = new Date(sorted[0].startDate);
  const end = new Date(sorted[sorted.length - 1].dueDate);
  const totalDays = Math.max((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24), 1);

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 text-xs text-[#666] mb-4 px-2">
        <span>{formatDate(sorted[0].startDate)}</span>
        <div className="flex-1 h-px bg-[#2A2A2A]" />
        <span>{formatDate(sorted[sorted.length - 1].dueDate)}</span>
      </div>
      {sorted.map((task, i) => {
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.dueDate);
        const left = ((taskStart.getTime() - start.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100;
        const width = Math.max(((taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24) / totalDays) * 100, 2);

        return (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="relative flex items-center gap-3 group"
          >
            <div className="w-32 text-right text-xs text-[#666] flex-shrink-0">
              {task.assignedTo}
            </div>
            <div className="flex-1 h-8 relative">
              <div className="absolute inset-0 rounded bg-white/[0.02]" />
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${width}%` }}
                transition={{ duration: 0.8, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-1 bottom-1 rounded-lg bg-gradient-to-r from-[#8B0000] to-[#F4C430] opacity-60 group-hover:opacity-100 transition-opacity cursor-pointer"
                style={{ left: `${left}%`, minWidth: '4px' }}
              >
                <div className="opacity-0 group-hover:opacity-100 transition-opacity px-2 py-0.5 text-[10px] text-white whitespace-nowrap font-medium">
                  {task.title}
                </div>
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
