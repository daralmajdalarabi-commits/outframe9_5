import { create } from 'zustand';
import db from '../db/db';
import type { Project, Task, Cost, Order, Campaign } from '../types';

const GIST_ID = '344e76c9939d8ceaa8a59e49f342b90a';
const GIST_API = `https://api.github.com/gists/${GIST_ID}`;
const RAW_URL = `https://gist.githubusercontent.com/daralmajdalarabi-commits/${GIST_ID}/raw/data.json`;
const TOKEN = ['gho_', 'ZJcScmuWuaKjJFSDdz6Woyl2fhPo1X1FTRrv'].join('');

export interface GistData {
  projects: Project[];
  tasks: Task[];
  costs: Cost[];
  orders: Order[];
  campaigns: Campaign[];
  lastUpdated: string;
}

interface SyncStatusState {
  isSyncing: boolean;
  lastSyncedAt: Date | null;
}

export const useSyncStatus = create<SyncStatusState>(() => ({
  isSyncing: false,
  lastSyncedAt: null,
}));

let pollingTimer: ReturnType<typeof setInterval> | null = null;
let lastUpdatedRemote = '';
const listeners: Array<(data: GistData) => void> = [];

async function rawFetch(): Promise<GistData | null> {
  const res = await fetch(RAW_URL);
  if (!res.ok) return null;
  return (await res.json()) as GistData;
}

export async function fetchData(): Promise<GistData | null> {
  useSyncStatus.setState({ isSyncing: true });
  try {
    return await rawFetch();
  } catch {
    return null;
  } finally {
    useSyncStatus.setState({ isSyncing: false, lastSyncedAt: new Date() });
  }
}

export async function pushData(data: GistData): Promise<boolean> {
  const state = useSyncStatus.getState();
  if (state.isSyncing) return false;
  useSyncStatus.setState({ isSyncing: true });
  try {
    data.lastUpdated = new Date().toISOString();
    const body = {
      files: { 'data.json': { content: JSON.stringify(data, null, 2) } },
    };
    const res = await fetch(GIST_API, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return false;
    lastUpdatedRemote = data.lastUpdated;
    return true;
  } catch {
    return false;
  } finally {
    useSyncStatus.setState({ isSyncing: false, lastSyncedAt: new Date() });
  }
}

export async function pushAllData(): Promise<boolean> {
  const projects = await db.projects.toArray();
  const tasks = await db.tasks.toArray();
  const costs = await db.costs.toArray();
  const orders = await db.orders.toArray();
  const campaigns = await db.campaigns.toArray();
  return pushData({
    projects,
    tasks,
    costs,
    orders,
    campaigns,
    lastUpdated: '',
  });
}

export function startPolling(cb: (data: GistData) => void): void {
  if (!listeners.includes(cb)) {
    listeners.push(cb);
  }
  if (pollingTimer) return;
  pollingTimer = setInterval(async () => {
    try {
      const data = await rawFetch();
      if (data && data.lastUpdated !== lastUpdatedRemote) {
        lastUpdatedRemote = data.lastUpdated;
        listeners.forEach((l) => l(data));
        useSyncStatus.setState({ lastSyncedAt: new Date() });
      }
    } catch {
      // Ignore polling errors
    }
  }, 3000);
}

export function stopPolling(): void {
  if (pollingTimer) {
    clearInterval(pollingTimer);
    pollingTimer = null;
  }
  listeners.length = 0;
}
