export function generateId(): string {
  return crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getStatusBadge(status: string): string {
  const map: Record<string, string> = {
    planning: 'badge-todo',
    active: 'badge-in-progress',
    'on-hold': 'badge-medium',
    completed: 'badge-completed',
    cancelled: 'badge-critical',
  };
  return map[status] || 'badge-todo';
}

export function getPriorityBadge(priority: string): string {
  return `badge-${priority}`;
}

export function getTaskStatusBadge(status: string): string {
  const map: Record<string, string> = {
    backlog: 'badge-backlog',
    todo: 'badge-todo',
    'in-progress': 'badge-in-progress',
    review: 'badge-review',
    completed: 'badge-completed',
  };
  return map[status] || 'badge-backlog';
}

export const getTaskPriorityBadge = getPriorityBadge;

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
