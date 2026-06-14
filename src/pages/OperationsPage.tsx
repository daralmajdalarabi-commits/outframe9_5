import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { useAuthStore } from '../stores/authStore';
import type { Project, Task, ViewType } from '../types';
import { generateId } from '../utils';
import { Plus, Columns, Table2, CalendarDays, Calendar, Search, List } from 'lucide-react';
import Modal from '../components/common/Modal';
import Notification from '../components/common/Notification';
import EmptyState from '../components/common/EmptyState';
import { CardSkeleton } from '../components/common/LoadingSkeleton';
import ProjectCard from '../components/operations/ProjectCard';
import ProjectForm from '../components/operations/ProjectForm';
import TaskForm from '../components/operations/TaskForm';
import KanbanBoard from '../components/operations/KanbanBoard';
import TableView from '../components/operations/TableView';
import TimelineView from '../components/operations/TimelineView';
import WeeklyView from '../components/operations/WeeklyView';
import CalendarView from '../components/operations/CalendarView';

const views: { id: ViewType; label: string; icon: any }[] = [
  { id: 'kanban', label: 'Kanban', icon: Columns },
  { id: 'table', label: 'Table', icon: Table2 },
  { id: 'timeline', label: 'Timeline', icon: List },
  { id: 'weekly', label: 'Weekly', icon: CalendarDays },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

export default function OperationsPage() {
  const { projects, loading: projLoading, loadProjects, addProject, updateProject, deleteProject } = useProjectStore();
  const { tasks, loadTasks, addTask, updateTask, deleteTask } = useTaskStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  const [view, setView] = useState<ViewType>('kanban');
  const [projectModal, setProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [taskModal, setTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [search, setSearch] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  useEffect(() => {
    loadProjects();
    loadTasks();
  }, []);

  const notify = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  const filteredProjects = useMemo(() => {
    if (!search) return projects;
    const q = search.toLowerCase();
    return projects.filter((p) => p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q));
  }, [projects, search]);

  const filteredTasks = useMemo(() => {
    let t = tasks;
    if (selectedProject) t = t.filter((task) => task.projectId === selectedProject);
    if (search) {
      const q = search.toLowerCase();
      t = t.filter((task) => task.title.toLowerCase().includes(q) || task.assignedTo.toLowerCase().includes(q));
    }
    return t;
  }, [tasks, selectedProject, search]);

  const handleSaveProject = (data: any) => {
    if (data.id) {
      updateProject(data.id, data);
      notify('success', 'Project updated successfully');
    } else {
      addProject({
        id: generateId(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      notify('success', 'Project created successfully');
    }
    setProjectModal(false);
    setEditingProject(null);
  };

  const handleSaveTask = (data: any) => {
    if (data.id) {
      updateTask(data.id, data);
      notify('success', 'Task updated successfully');
    } else {
      addTask({
        id: generateId(),
        ...data,
        attachments: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      notify('success', 'Task created successfully');
    }
    setTaskModal(false);
    setEditingTask(null);
  };

  return (
    <div className="space-y-6">
      <Notification
        type={notification?.type || 'info'}
        message={notification?.message || ''}
        isVisible={!!notification}
        onClose={() => setNotification(null)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Operations</h1>
          <p className="text-sm text-[#666] mt-1">Manage projects and tasks</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEditingTask(null); setTaskModal(true); }}
              className="btn-secondary text-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Task
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => { setEditingProject(null); setProjectModal(true); }}
              className="btn-primary text-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> New Project
            </motion.button>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects and tasks..."
            className="input pl-10"
          />
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg bg-white/[0.03] border border-[#2A2A2A]">
          {views.map((v) => {
            const Icon = v.icon;
            return (
              <button
                key={v.id}
                onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  view === v.id ? 'bg-[#8B0000]/20 text-white border border-[#8B0000]/30' : 'text-[#666] hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{v.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-1 flex-wrap">
        <button
          onClick={() => setSelectedProject('')}
          className={`badge cursor-pointer transition-all ${!selectedProject ? 'bg-[#8B0000]/20 text-white border-[#8B0000]/30' : 'bg-white/[0.03] text-[#666] border-[#2A2A2A]'}`}
        >
          All Tasks
        </button>
        {projects.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedProject(p.id)}
            className={`badge cursor-pointer transition-all ${selectedProject === p.id ? 'bg-[#8B0000]/20 text-white border-[#8B0000]/30' : 'bg-white/[0.03] text-[#666] border-[#2A2A2A]'}`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {(view === 'kanban' || view === 'table' || view === 'timeline' || view === 'weekly' || view === 'calendar') && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-white">Tasks</h2>
          {projLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
            </div>
          ) : (
            <>
              {view === 'kanban' && (
                <KanbanBoard tasks={filteredTasks} onEditTask={(t) => { setEditingTask(t); setTaskModal(true); }} onDeleteTask={(id) => { deleteTask(id); notify('success', 'Task deleted'); }} />
              )}
              {view === 'table' && (
                <div className="card p-4">
                  <TableView tasks={filteredTasks} onEdit={(t) => { setEditingTask(t); setTaskModal(true); }} onDelete={(id) => { deleteTask(id); notify('success', 'Task deleted'); }} />
                </div>
              )}
              {view === 'timeline' && (
                <div className="card p-4">
                  <TimelineView tasks={filteredTasks} />
                </div>
              )}
              {view === 'weekly' && <WeeklyView tasks={filteredTasks} />}
              {view === 'calendar' && (
                <div className="card p-4">
                  <CalendarView tasks={filteredTasks} />
                </div>
              )}
              {filteredTasks.length === 0 && view !== 'kanban' && (
                <EmptyState title="No tasks found" description="Create a task or change your filters" />
              )}
            </>
          )}
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-sm font-semibold text-white">Projects</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(p) => { setEditingProject(p); setProjectModal(true); }}
                onDelete={(id) => { deleteProject(id); notify('success', 'Project deleted'); }}
              />
            ))}
          </AnimatePresence>
        </div>
        {filteredProjects.length === 0 && (
          <EmptyState
            title="No projects yet"
            description="Create your first project to get started"
            action={isAdmin ? { label: 'Create Project', onClick: () => { setEditingProject(null); setProjectModal(true); } } : undefined}
          />
        )}
      </div>

      <Modal isOpen={projectModal} onClose={() => { setProjectModal(false); setEditingProject(null); }} title={editingProject ? 'Edit Project' : 'Create Project'}>
        <ProjectForm initial={editingProject} onSave={handleSaveProject} onCancel={() => { setProjectModal(false); setEditingProject(null); }} />
      </Modal>

      <Modal isOpen={taskModal} onClose={() => { setTaskModal(false); setEditingTask(null); }} title={editingTask ? 'Edit Task' : 'Create Task'}>
        <TaskForm
          initial={editingTask}
          projectId={selectedProject || projects[0]?.id || ''}
          onSave={handleSaveTask}
          onCancel={() => { setTaskModal(false); setEditingTask(null); }}
        />
      </Modal>
    </div>
  );
}
