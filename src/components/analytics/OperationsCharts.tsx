import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useWaitingStore } from '../../stores/waitingStore';
import { useOrgTaskStore } from '../../stores/orgTaskStore';
import { useFinanceStore } from '../../stores/financeStore';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-lg border border-[#2A2A2A] shadow-xl">
        <p className="text-xs text-[#A0A0A0]">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>{entry.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OperationsCharts() {
  const { items, tasks } = useWaitingStore();
  const { tasks: orgTasks } = useOrgTaskStore();
  const { orders } = useFinanceStore();

  const statusData = useMemo(() => {
    const statuses = ['pending', 'in-progress', 'completed'];
    return statuses.map((s) => ({
      name: s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1),
      count: items.filter((i) => i.status === s).length,
    }));
  }, [items]);

  const waitingTaskCompletion = useMemo(() => {
    const done = tasks.filter((t) => t.completed).length;
    const remaining = tasks.length - done;
    return [
      { name: 'Completed', count: done },
      { name: 'Pending', count: remaining },
    ];
  }, [tasks]);

  const orgTaskCompletion = useMemo(() => {
    const done = orgTasks.filter((t) => t.completed).length;
    const remaining = orgTasks.length - done;
    return [
      { name: 'Completed', count: done },
      { name: 'Pending', count: remaining },
    ];
  }, [orgTasks]);

  const amountByClient = useMemo(() => {
    return items.slice(0, 10).map((i) => ({
      name: i.clientName.length > 12 ? i.clientName.slice(0, 12) + '...' : i.clientName,
      amount: i.amount,
    }));
  }, [items]);

  const COLORS = ['#F4C430', '#2196F3', '#00C853'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Requests by Status</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={60}>
              {statusData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Waiting Task Completion</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={waitingTaskCompletion}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={90}
              dataKey="count" stroke="none"
            >
              {waitingTaskCompletion.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#00C853' : '#666'} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {waitingTaskCompletion.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? '#00C853' : '#666' }} />
              <span className="text-[10px] text-[#666]">{item.name} ({item.count})</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Org Task Completion</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={orgTaskCompletion}
              cx="50%" cy="50%"
              innerRadius={60} outerRadius={90}
              dataKey="count" stroke="none"
            >
              {orgTaskCompletion.map((_, i) => (
                <Cell key={i} fill={i === 0 ? '#CE93D8' : '#666'} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {orgTaskCompletion.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: i === 0 ? '#CE93D8' : '#666' }} />
              <span className="text-[10px] text-[#666]">{item.name} ({item.count})</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Request Amounts by Client</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={amountByClient.length > 0 ? amountByClient : [{ name: 'No requests', amount: 0 }]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis type="number" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#A0A0A0', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="amount" fill="#F4C430" radius={[0, 4, 4, 0]} fillOpacity={0.8} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
