import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWaitingStore } from '../stores/waitingStore';
import { useOrgTaskStore } from '../stores/orgTaskStore';
import { useFinanceStore } from '../stores/financeStore';
import { useAdsStore } from '../stores/adsStore';
import { Clock, CheckCircle, TrendingUp, Megaphone, ListChecks } from 'lucide-react';

export default function DashboardPage() {
  const { items, tasks, loadItems } = useWaitingStore();
  const { tasks: orgTasks, loadTasks: loadOrgTasks } = useOrgTaskStore();
  const { costs, orders, loadCosts, loadOrders } = useFinanceStore();
  const { campaigns, loadCampaigns } = useAdsStore();

  useEffect(() => {
    loadItems();
    loadOrgTasks();
    loadCosts();
    loadOrders();
    loadCampaigns();
  }, []);

  const totalRevenue = orders.reduce((s: number, o: any) => s + o.value, 0);
  const totalCosts = costs.reduce((s: number, c: any) => s + c.amount, 0);
  const netProfit = totalRevenue - totalCosts;
  const pendingItems = items.filter((i: any) => i.status !== 'completed').length;
  const completedTasks = tasks.filter((t: any) => t.completed).length;
  const orgTasksDone = orgTasks.filter((t: any) => t.completed).length;
  const totalSpend = campaigns.reduce((s: number, c: any) => s + c.spend, 0);

  const stats = [
    { label: 'Pending Requests', value: pendingItems, icon: Clock, color: '#F4C430', desc: `${items.length} total` },
    { label: 'Waiting Tasks Done', value: completedTasks, icon: CheckCircle, color: '#00C853', desc: `${tasks.length} total` },
    { label: 'Org Tasks Done', value: orgTasksDone, icon: ListChecks, color: '#CE93D8', desc: `${orgTasks.length} total` },
    { label: 'Ad Spend', value: `$${totalSpend.toLocaleString()}`, icon: Megaphone, color: '#F4C430', desc: `${campaigns.length} campaigns` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#666] mt-1">Executive overview of your operations</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#666] uppercase tracking-wider">{stat.label}</span>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15`, border: `1px solid ${stat.color}30` }}>
                  <Icon className="w-4.5 h-4.5" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-[#666] mt-1">{stat.desc}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-3">Recent Requests</h3>
          <div className="space-y-2">
            {items.slice(0, 5).map((i: any) => (
              <div key={i.id} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]/50 last:border-0">
                <div>
                  <p className="text-sm text-white">{i.clientName}</p>
                  <p className="text-xs text-[#666]">{i.projectName}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge text-[10px] ${
                    i.status === 'completed' ? 'bg-[#00C853]/15 text-[#00C853] border-[#00C853]/30' :
                    i.status === 'in-progress' ? 'bg-[#2196F3]/15 text-[#2196F3] border-[#2196F3]/30' :
                    'bg-[#F4C430]/15 text-[#F4C430] border-[#F4C430]/30'
                  }`}>
                    {i.status === 'completed' ? 'Done' : i.status === 'in-progress' ? 'Active' : 'Pending'}
                  </span>
                  <span className="text-xs text-[#666]">${i.amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-sm text-[#666] text-center py-4">No requests yet</p>}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-3">Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A0A0A0]">Total Revenue</span>
              <span className="text-sm font-semibold text-[#00C853]">+${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A0A0A0]">Total Costs</span>
              <span className="text-sm font-semibold text-[#FF1744]">-${totalCosts.toLocaleString()}</span>
            </div>
            <div className="h-px bg-[#2A2A2A]" />
            <div className="flex items-center justify-between">
              <span className="text-sm text-white font-medium">Net Profit</span>
              <span className={`text-sm font-bold ${netProfit >= 0 ? 'text-[#00C853]' : 'text-[#FF1744]'}`}>
                {netProfit >= 0 ? '+' : '-'}${Math.abs(netProfit).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A0A0A0]">Active Campaigns</span>
              <span className="text-sm font-semibold text-white">{campaigns.filter((c: any) => c.status === 'active').length}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A0A0A0]">Total Orders</span>
              <span className="text-sm font-semibold text-white">{orders.length}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
