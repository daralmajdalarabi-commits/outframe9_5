import { motion } from 'framer-motion';
import type { Task } from '../../types';
import { getTaskStatusBadge } from '../../utils';

interface WeeklyViewProps {
  tasks: Task[];
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function getWeekDays() {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return DAYS.map((_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export default function WeeklyView({ tasks }: WeeklyViewProps) {
  const weekDays = getWeekDays();

  return (
    <div className="grid grid-cols-7 gap-2 min-h-[400px]">
      {weekDays.map((day, i) => {
        const dayTasks = tasks.filter((t) => {
          const due = t.dueDate;
          const start = t.startDate;
          return due === day || start === day;
        });

        return (
          <div key={day} className="card p-3">
            <div className="text-center mb-3">
              <p className="text-[10px] text-[#666] uppercase">{DAYS[i].slice(0, 3)}</p>
              <p className="text-lg font-semibold text-white">{new Date(day).getDate()}</p>
            </div>
            <div className="space-y-1.5">
              {dayTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-2 rounded-lg bg-white/[0.03] border border-[#2A2A2A]"
                >
                  <p className="text-[10px] text-white truncate">{task.title}</p>
                  <span className={`badge ${getTaskStatusBadge(task.status)} text-[8px] !px-1.5 !py-0.5 mt-1`}>
                    {task.status}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
