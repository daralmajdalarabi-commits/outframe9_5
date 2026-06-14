import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useFinanceStore } from '../../stores/financeStore';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-lg border border-[#2A2A2A] shadow-xl">
        <p className="text-xs text-[#A0A0A0]">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>${Number(entry.value).toLocaleString()}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function FinanceCharts() {
  const { costs, orders } = useFinanceStore();

  const revenueVsCosts = useMemo(() => {
    const months: Record<string, { revenue: number; costs: number }> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = { revenue: 0, costs: 0 };
    }
    orders.forEach((o) => {
      const d = new Date(o.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (months[key]) months[key].revenue += o.value;
    });
    costs.forEach((c) => {
      const d = new Date(c.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (months[key]) months[key].costs += c.amount;
    });
    return Object.entries(months).map(([name, data]) => ({ name, ...data }));
  }, [costs, orders]);

  const weeklyProfit = useMemo(() => {
    const weeks: Record<string, number> = {};
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const key = `W${i + 1}`;
      weeks[key] = 0;
    }
    const allItems = [
      ...orders.map((o) => ({ date: o.date, value: o.value })),
      ...costs.map((c) => ({ date: c.date, value: -c.amount })),
    ];
    allItems.forEach((item) => {
      const itemDate = new Date(item.date);
      const diffWeeks = Math.floor((now.getTime() - itemDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks >= 0 && diffWeeks < 8) {
        weeks[`W${8 - diffWeeks}`] += item.value;
      }
    });
    return Object.entries(weeks).map(([name, profit]) => ({ name, profit }));
  }, [costs, orders]);

  const monthlyProfit = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }
    orders.forEach((o) => {
      const d = new Date(o.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (months[key] !== undefined) months[key] += o.value;
    });
    costs.forEach((c) => {
      const d = new Date(c.date);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (months[key] !== undefined) months[key] -= c.amount;
    });
    return Object.entries(months).map(([name, profit]) => ({ name, profit }));
  }, [costs, orders]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 lg:col-span-2"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Revenue vs Costs</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueVsCosts}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="revenue" fill="#00C853" radius={[4, 4, 0, 0]} maxBarSize={30} fillOpacity={0.8} />
            <Bar dataKey="costs" fill="#FF1744" radius={[4, 4, 0, 0]} maxBarSize={30} fillOpacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Weekly Profit</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={weeklyProfit}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="profit" stroke="#00C853" fill="#00C853" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Monthly Profit Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={monthlyProfit}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="profit" stroke="#F4C430" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
