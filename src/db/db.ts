import Dexie, { type Table } from 'dexie';
import type { WaitingItem, WaitingTask, OrgTask, Cost, Order, Campaign } from '../types';

class AppDatabase extends Dexie {
  waitingItems!: Table<WaitingItem, string>;
  waitingTasks!: Table<WaitingTask, string>;
  orgTasks!: Table<OrgTask, string>;
  costs!: Table<Cost, string>;
  orders!: Table<Order, string>;
  campaigns!: Table<Campaign, string>;

  constructor() {
    super('ApexOperationsDB');
    this.version(3).stores({
      waitingItems: 'id, status, createdAt',
      waitingTasks: 'id, waitingItemId, completed',
      orgTasks: 'id, priority, completed, createdAt',
      costs: 'id, category, date, createdAt',
      orders: 'id, client, date, createdAt',
      campaigns: 'id, platform, status, createdAt',
    });
  }
}

const db = new AppDatabase();

export default db;
