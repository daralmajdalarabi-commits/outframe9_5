import { create } from 'zustand';
import db from '../db/db';
import type { Task } from '../types';

interface TaskStore {
  tasks: Task[];
  loading: boolean;
  loadTasks: () => Promise<void>;
  addTask: (task: Task) => Promise<void>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTaskStore = create<TaskStore>((set, get) => ({
  tasks: [],
  loading: true,
  loadTasks: async () => {
    set({ loading: true });
    const tasks = await db.tasks.orderBy('createdAt').reverse().toArray();
    set({ tasks, loading: false });
  },
  addTask: async (task) => {
    await db.tasks.add(task);
    set({ tasks: [task, ...get().tasks] });
  },
  updateTask: async (id, data) => {
    await db.tasks.update(id, { ...data, updatedAt: new Date().toISOString() });
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...data, updatedAt: new Date().toISOString() } : t
    );
    set({ tasks });
  },
  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
  },
}));
