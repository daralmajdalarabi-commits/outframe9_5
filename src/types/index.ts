export type UserRole = 'admin' | 'team';

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  code: string | null;
}

export type ProjectPriority = 'critical' | 'high' | 'medium' | 'low';
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'completed';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export interface Project {
  id: string;
  name: string;
  description: string;
  client: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  progress: number;
  priority: ProjectPriority;
  budget: number;
  teamMembers: string[];
  notes: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  assignedTo: string;
  startDate: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  estimatedHours: number;
  attachments: string[];
  comments: Comment[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Cost {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  notes: string;
  createdAt: string;
}

export interface Order {
  id: string;
  client: string;
  title: string;
  value: number;
  date: string;
  notes: string;
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  platform: 'facebook' | 'instagram' | 'google' | 'tiktok' | 'linkedin';
  launchDate: string;
  endDate: string;
  budget: number;
  spend: number;
  notes: string;
  objective: string;
  status: 'active' | 'paused' | 'completed' | 'draft';
  createdAt: string;
}

export type ViewType = 'kanban' | 'table' | 'timeline' | 'weekly' | 'calendar';
