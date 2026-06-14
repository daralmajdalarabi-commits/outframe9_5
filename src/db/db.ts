import Dexie, { type Table } from 'dexie';
import type { Project, Task, Cost, Order, Campaign } from '../types';

class AppDatabase extends Dexie {
  projects!: Table<Project, string>;
  tasks!: Table<Task, string>;
  costs!: Table<Cost, string>;
  orders!: Table<Order, string>;
  campaigns!: Table<Campaign, string>;

  constructor() {
    super('ApexOperationsDB');
    this.version(1).stores({
      projects: 'id, status, priority, createdAt',
      tasks: 'id, projectId, status, priority, assignedTo',
      costs: 'id, category, date, createdAt',
      orders: 'id, client, date, createdAt',
      campaigns: 'id, platform, status, createdAt',
    });
  }
}

const db = new AppDatabase();

export default db;
