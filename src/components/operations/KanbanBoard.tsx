import type { Task } from '../../types';
import TaskCard from './TaskCard';

const columns = [
  { id: 'backlog', label: 'Backlog', color: '#A0A0A0' },
  { id: 'todo', label: 'To Do', color: '#2196F3' },
  { id: 'in-progress', label: 'In Progress', color: '#F4C430' },
  { id: 'review', label: 'Review', color: '#CE93D8' },
  { id: 'completed', label: 'Completed', color: '#00C853' },
];

interface KanbanBoardProps {
  tasks: Task[];
  onEditTask: (t: Task) => void;
  onDeleteTask: (id: string) => void;
}

export default function KanbanBoard({ tasks, onEditTask, onDeleteTask }: KanbanBoardProps) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 min-h-[400px]">
      {columns.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="flex-1 min-w-[220px]">
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
              <span className="text-xs font-medium text-[#A0A0A0] uppercase tracking-wider">
                {col.label}
              </span>
              <span className="text-xs text-[#666] ml-auto">{colTasks.length}</span>
            </div>
            <div className="space-y-2">
              {colTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                />
              ))}
              {colTasks.length === 0 && (
                <div className="card p-4 flex items-center justify-center">
                  <p className="text-xs text-[#666]">No tasks</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
