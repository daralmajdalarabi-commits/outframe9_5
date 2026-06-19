export type UserRole = 'admin' | 'team';

export interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  code: string | null;
}

export interface WaitingItem {
  id: string;
  clientName: string;
  projectName: string;
  details: string;
  attachments: Attachment[];
  date: string;
  amount: number;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface WaitingTask {
  id: string;
  waitingItemId: string;
  title: string;
  details: string;
  assignedTo: string;
  completed: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  data: string;
  size: number;
}

export interface OrgTask {
  id: string;
  title: string;
  details: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  completed: boolean;
  createdAt: string;
  updatedAt: string;
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
