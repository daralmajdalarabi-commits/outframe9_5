import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { useFinanceStore } from '../stores/financeStore';
import { useAdsStore } from '../stores/adsStore';
import { Briefcase, Megaphone, TrendingUp, Target } from 'lucide-react';

export default function DashboardPage() {
  const { projects, loadProjects } = useProjectStore();
  const { tasks, loadTasks } = useTaskStore();
  const { costs, orders, loadCosts, loadOrders } = useFinanceStore();
  const { campaigns, loadCampaigns } = useAdsStore();

  useEffect(() => {
    loadProjects();
    loadTasks();
    loadCosts();
    loadOrders();
    loadCampaigns();
  }, []);

  const totalRevenue = orders.reduce((s: number, o: any) => s + o.value, 0);
  const totalCosts = costs.reduce((s: number, c: any) => s + c.amount, 0);
  const netProfit = totalRevenue - totalCosts;
  const activeProjects = projects.filter((p: any) => p.status === 'active').length;
  const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
  const totalSpend = campaigns.reduce((s: number, c: any) => s + c.spend, 0);

  const stats = [
    { label: 'Active Projects', value: activeProjects, icon: Briefcase, color: '#8B0000', desc: `${projects.length} total` },
    { label: 'Tasks Completed', value: completedTasks, icon: Target, color: '#00C853', desc: `${tasks.length} total tasks` },
    { label: 'Net Profit', value: `$${netProfit.toLocaleString()}`, icon: TrendingUp, color: netProfit >= 0 ? '#00C853' : '#FF1744', desc: `${((netProfit / (totalRevenue || 1)) * 100).toFixed(1)}% margin` },
    { label: 'Ad Spend', value: `$${totalSpend.toLocaleString()}`, icon: Megaphone, color: '#F4C430', desc: `${campaigns.length} campaigns` },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-[#666] mt-1">Executive overview of your operations</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <h3 className="text-sm font-semibold text-white mb-3">Recent Projects</h3>
          <div className="space-y-2">
            {projects.slice(0, 5).map((p: any) => (
              <div key={p.id} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]/50 last:border-0">
                <div>
                  <p className="text-sm text-white">{p.name}</p>
                  <p className="text-xs text-[#666]">{p.client}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#F4C430]" style={{ width: `${p.progress}%` }} />
                  </div>
                  <span className="text-xs text-[#666] w-8 text-right">{p.progress}%</span>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-sm text-[#666] text-center py-4">No projects yet</p>}
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
