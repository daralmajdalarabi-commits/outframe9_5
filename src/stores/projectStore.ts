import { create } from 'zustand';
import db from '../db/db';
import type { Project } from '../types';

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
    const projects = await db.projects.orderBy('createdAt').reverse().toArray();
    set({ projects, loading: false });
  },
  addProject: async (project) => {
    await db.projects.add(project);
    set({ projects: [project, ...get().projects] });
  },
  updateProject: async (id, data) => {
    await db.projects.update(id, { ...data, updatedAt: new Date().toISOString() });
    const projects = get().projects.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    );
    set({ projects });
  },
  deleteProject: async (id) => {
    await db.projects.delete(id);
    await db.tasks.where('projectId').equals(id).delete();
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },
}));
