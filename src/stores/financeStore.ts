import { create } from 'zustand';
import db from '../db/db';
import type { Cost, Order } from '../types';
import {
  fetchData,
  pushAllData,
  startPolling,
  type GistData,
} from '../lib/sync';

interface FinanceStore {
  costs: Cost[];
  orders: Order[];
  loading: boolean;
  loadCosts: () => Promise<void>;
  loadOrders: () => Promise<void>;
  addCost: (cost: Cost) => Promise<void>;
  updateCost: (id: string, data: Partial<Cost>) => Promise<void>;
  deleteCost: (id: string) => Promise<void>;
  addOrder: (order: Order) => Promise<void>;
  updateOrder: (id: string, data: Partial<Order>) => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
}

export const useFinanceStore = create<FinanceStore>((set, get) => ({
  costs: [],
  orders: [],
  loading: true,
  loadCosts: async () => {
    const remote = await fetchData();
    if (remote) {
      await db.costs.clear();
      await db.costs.bulkAdd(remote.costs);
      set({ costs: remote.costs });
    } else {
      const costs = await db.costs.orderBy('date').reverse().toArray();
      set({ costs });
    }
    startPolling((data: GistData) => {
      set({ costs: data.costs, orders: data.orders });
      db.costs.clear();
      db.costs.bulkAdd(data.costs);
      db.orders.clear();
      db.orders.bulkAdd(data.orders);
    });
  },
  loadOrders: async () => {
    const remote = await fetchData();
    if (remote) {
      await db.orders.clear();
      await db.orders.bulkAdd(remote.orders);
      set({ orders: remote.orders, loading: false });
    } else {
      const orders = await db.orders.orderBy('date').reverse().toArray();
      set({ orders, loading: false });
    }
  },
  addCost: async (cost) => {
    await db.costs.add(cost);
    set({ costs: [cost, ...get().costs] });
    await pushAllData();
  },
  updateCost: async (id, data) => {
    await db.costs.update(id, data);
    const costs = get().costs.map((c) => (c.id === id ? { ...c, ...data } : c));
    set({ costs });
    await pushAllData();
  },
  deleteCost: async (id) => {
    await db.costs.delete(id);
    set({ costs: get().costs.filter((c) => c.id !== id) });
    await pushAllData();
  },
  addOrder: async (order) => {
    await db.orders.add(order);
    set({ orders: [order, ...get().orders] });
    await pushAllData();
  },
  updateOrder: async (id, data) => {
    await db.orders.update(id, data);
    const orders = get().orders.map((o) => (o.id === id ? { ...o, ...data } : o));
    set({ orders });
    await pushAllData();
  },
  deleteOrder: async (id) => {
    await db.orders.delete(id);
    set({ orders: get().orders.filter((o) => o.id !== id) });
    await pushAllData();
  },
}));
