import { create } from 'zustand';
import db from '../db/db';
import type { Task } from '../types';
import {
  fetchData,
  pushAllData,
  startPolling,
  type GistData,
} from '../lib/sync';

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
    const remote = await fetchData();
    if (remote) {
      await db.tasks.clear();
      await db.tasks.bulkAdd(remote.tasks);
      set({ tasks: remote.tasks, loading: false });
    } else {
      const tasks = await db.tasks.orderBy('createdAt').reverse().toArray();
      set({ tasks, loading: false });
    }
    startPolling((data: GistData) => {
      set({ tasks: data.tasks });
      db.tasks.clear();
      db.tasks.bulkAdd(data.tasks);
    });
  },
  addTask: async (task) => {
    await db.tasks.add(task);
    set({ tasks: [task, ...get().tasks] });
    await pushAllData();
  },
  updateTask: async (id, data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await db.tasks.update(id, payload);
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...payload } : t
    );
    set({ tasks });
    await pushAllData();
  },
  deleteTask: async (id) => {
    await db.tasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    await pushAllData();
  },
}));
