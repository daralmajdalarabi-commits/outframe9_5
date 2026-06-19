import { create } from 'zustand';
import db from '../db/db';
import type { OrgTask } from '../types';
import {
  fetchData,
  pushAllData,
  startPolling,
  type GistData,
} from '../lib/sync';

interface OrgTaskStore {
  tasks: OrgTask[];
  loading: boolean;
  loadTasks: () => Promise<void>;
  addTask: (task: OrgTask) => Promise<void>;
  updateTask: (id: string, data: Partial<OrgTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useOrgTaskStore = create<OrgTaskStore>((set, get) => ({
  tasks: [],
  loading: true,
  loadTasks: async () => {
    set({ loading: true });
    const remote = await fetchData();
    if (remote) {
      await db.orgTasks.clear();
      await db.orgTasks.bulkAdd(remote.orgTasks);
      set({ tasks: remote.orgTasks, loading: false });
    } else {
      const tasks = await db.orgTasks.orderBy('createdAt').reverse().toArray();
      set({ tasks, loading: false });
    }
    startPolling((data: GistData) => {
      set({ tasks: data.orgTasks });
      db.orgTasks.clear();
      db.orgTasks.bulkAdd(data.orgTasks);
    });
  },
  addTask: async (task) => {
    await db.orgTasks.add(task);
    set({ tasks: [task, ...get().tasks] });
    await pushAllData();
  },
  updateTask: async (id, data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await db.orgTasks.update(id, payload);
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...payload } : t
    );
    set({ tasks });
    await pushAllData();
  },
  deleteTask: async (id) => {
    await db.orgTasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    await pushAllData();
  },
}));
