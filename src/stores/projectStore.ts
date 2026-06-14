import { create } from 'zustand';
import db from '../db/db';
import type { Project } from '../types';
import {
  fetchData,
  pushAllData,
  startPolling,
  type GistData,
} from '../lib/sync';

interface ProjectStore {
  projects: Project[];
  loading: boolean;
  loadProjects: () => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  loading: true,
  loadProjects: async () => {
    set({ loading: true });
    const remote = await fetchData();
    if (remote) {
      await db.projects.clear();
      await db.projects.bulkAdd(remote.projects);
      set({ projects: remote.projects, loading: false });
    } else {
      const projects = await db.projects.orderBy('createdAt').reverse().toArray();
      set({ projects, loading: false });
    }
    startPolling((data: GistData) => {
      set({ projects: data.projects });
      db.projects.clear();
      db.projects.bulkAdd(data.projects);
    });
  },
  addProject: async (project) => {
    await db.projects.add(project);
    set({ projects: [project, ...get().projects] });
    await pushAllData();
  },
  updateProject: async (id, data) => {
    const payload = { ...data, updatedAt: new Date().toISOString() };
    await db.projects.update(id, payload);
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...payload } : p
    );
    set({ projects });
    await pushAllData();
  },
  deleteProject: async (id) => {
    await db.projects.delete(id);
    await db.tasks.where('projectId').equals(id).delete();
    set({ projects: get().projects.filter((p) => p.id !== id) });
    await pushAllData();
  },
}));
