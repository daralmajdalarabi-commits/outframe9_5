import { create } from 'zustand';
import db from '../db/db';
import type { WaitingItem, WaitingTask } from '../types';
import {
  fetchData,
  pushAllData,
  startPolling,
  type GistData,
} from '../lib/sync';

interface WaitingStore {
  items: WaitingItem[];
  tasks: WaitingTask[];
  loading: boolean;
  loadItems: () => Promise<void>;
  addItem: (item: WaitingItem) => Promise<void>;
  updateItem: (id: string, data: Partial<WaitingItem>) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  addTask: (task: WaitingTask) => Promise<void>;
  updateTask: (id: string, data: Partial<WaitingTask>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useWaitingStore = create<WaitingStore>((set, get) => ({
  items: [],
  tasks: [],
  loading: true,
  loadItems: async () => {
    set({ loading: true });
    const remote = await fetchData();
    if (remote) {
      await db.waitingItems.clear();
      await db.waitingItems.bulkAdd(remote.waitingItems);
      await db.waitingTasks.clear();
      await db.waitingTasks.bulkAdd(remote.waitingTasks);
      set({ items: remote.waitingItems, tasks: remote.waitingTasks, loading: false });
    } else {
      const items = await db.waitingItems.orderBy('createdAt').reverse().toArray();
      const tasks = await db.waitingTasks.toArray();
      set({ items, tasks, loading: false });
    }
    startPolling((data: GistData) => {
      set({ items: data.waitingItems, tasks: data.waitingTasks });
      db.waitingItems.clear();
      db.waitingItems.bulkAdd(data.waitingItems);
      db.waitingTasks.clear();
      db.waitingTasks.bulkAdd(data.waitingTasks);
    });
  },
  addItem: async (item) => {
    await db.waitingItems.add(item);
    set({ items: [item, ...get().items] });
    await pushAllData();
  },
  updateItem: async (id, data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await db.waitingItems.update(id, payload);
    const items = get().items.map((i) =>
      i.id === id ? { ...i, ...payload } : i
    );
    set({ items });
    await pushAllData();
  },
  deleteItem: async (id) => {
    await db.waitingItems.delete(id);
    await db.waitingTasks.where('waitingItemId').equals(id).delete();
    set({
      items: get().items.filter((i) => i.id !== id),
      tasks: get().tasks.filter((t) => t.waitingItemId !== id),
    });
    await pushAllData();
  },
  addTask: async (task) => {
    await db.waitingTasks.add(task);
    set({ tasks: [...get().tasks, task] });
    await pushAllData();
  },
  updateTask: async (id, data) => {
    await db.waitingTasks.update(id, data);
    const tasks = get().tasks.map((t) =>
      t.id === id ? { ...t, ...data } : t
    );
    set({ tasks });
    await pushAllData();
  },
  deleteTask: async (id) => {
    await db.waitingTasks.delete(id);
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    await pushAllData();
  },
}));
