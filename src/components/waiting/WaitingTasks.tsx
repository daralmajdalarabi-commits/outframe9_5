import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { useWaitingStore } from '../../stores/waitingStore';
import type { WaitingTask, WaitingItem } from '../../types';
import { generateId } from '../../utils';
import { Plus, CheckCircle, Circle, Trash2, User, Edit3 } from 'lucide-react';

interface Props {
  item: WaitingItem;
}

export default function WaitingTasks({ item }: Props) {
  const { tasks, addTask, updateTask, deleteTask } = useWaitingStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';
  const [showForm, setShowForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDetails, setTaskDetails] = useState('');
  const [taskPerson, setTaskPerson] = useState('');

  const itemTasks = tasks.filter((t) => t.waitingItemId === item.id);

  const handleAdd = () => {
    if (!taskTitle.trim() || !taskPerson.trim()) return;
    addTask({
      id: generateId(),
      waitingItemId: item.id,
      title: taskTitle,
      details: taskDetails,
      assignedTo: taskPerson,
      completed: false,
      createdAt: new Date().toISOString(),
    });
    setTaskTitle('');
    setTaskDetails('');
    setTaskPerson('');
    setShowForm(false);
  };

  const toggleTask = (task: WaitingTask) => {
    updateTask(task.id, { completed: !task.completed });
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-white">Tasks ({itemTasks.length})</h4>
        {isAdmin && (
          <button onClick={() => setShowForm(!showForm)} className="btn-secondary !p-1.5 !rounded-lg text-xs flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        )}
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
            <input value={taskTitle} onChange={(e) => setTaskTitle(e.target.value)} placeholder="Task title" className="input h-9 text-sm" />
            <textarea value={taskDetails} onChange={(e) => setTaskDetails(e.target.value)} placeholder="Task details..." className="input min-h-[60px] text-sm resize-y" rows={2} />
            <div className="flex gap-2">
              <input value={taskPerson} onChange={(e) => setTaskPerson(e.target.value)} placeholder="Assigned to" className="input h-9 text-sm flex-1" />
              <button onClick={handleAdd} className="btn-primary text-xs px-3">Add</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-xs px-3">Cancel</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-1.5">
        {itemTasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-start gap-2 p-2.5 rounded-lg border transition-all ${
              task.completed ? 'bg-[#00C853]/5 border-[#00C853]/15' : 'bg-white/[0.02] border-[#2A2A2A]'
            }`}
          >
            {isAdmin ? (
              <button onClick={() => toggleTask(task)} className="mt-0.5 flex-shrink-0">
                {task.completed ? (
                  <CheckCircle className="w-4 h-4 text-[#00C853]" />
                ) : (
                  <Circle className="w-4 h-4 text-[#666]" />
                )}
              </button>
            ) : (
              task.completed ? <CheckCircle className="w-4 h-4 text-[#00C853] mt-0.5 flex-shrink-0" /> : <Circle className="w-4 h-4 text-[#666] mt-0.5 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className={`flex items-center gap-2 ${task.completed ? 'text-[#666] line-through' : 'text-white'}`}>
                <Edit3 className="w-3 h-3 text-[#8B0000]" />
                <span className="text-xs font-medium">{task.title}</span>
              </div>
              {task.details && (
                <p className={`text-[10px] mt-0.5 ${task.completed ? 'text-[#666]' : 'text-[#A0A0A0]'}`}>{task.details}</p>
              )}
              <span className="text-[10px] text-[#666] flex items-center gap-1 mt-1">
                <User className="w-3 h-3" /> {task.assignedTo}
              </span>
            </div>
            {isAdmin && (
              <button onClick={() => deleteTask(task.id)} className="text-[#666] hover:text-[#FF1744] transition-colors flex-shrink-0">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </motion.div>
        ))}
        {itemTasks.length === 0 && (
          <p className="text-xs text-[#666] text-center py-3">No tasks yet</p>
        )}
      </div>
    </div>
  );
}
