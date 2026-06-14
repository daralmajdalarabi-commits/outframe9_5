import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { useAdsStore } from '../../stores/adsStore';

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

export default function AdsCharts() {
  const { campaigns } = useAdsStore();

  const spendEvolution = useMemo(() => {
    const months: Record<string, number> = {};
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      months[key] = 0;
    }
    campaigns.forEach((c) => {
      const d = new Date(c.launchDate);
      const key = d.toLocaleString('default', { month: 'short', year: '2-digit' });
      if (months[key] !== undefined) months[key] += c.spend;
    });
    return Object.entries(months).map(([name, spend]) => ({ name, spend }));
  }, [campaigns]);

  const campaignPerformance = useMemo(() => {
    return campaigns.map((c) => ({
      name: c.name.length > 10 ? c.name.slice(0, 10) + '...' : c.name,
      spend: c.spend,
      budget: c.budget,
    }));
  }, [campaigns]);

  const weeklySpendTrend = useMemo(() => {
    const weeks: Record<string, number> = {};
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 7 * 24 * 60 * 60 * 1000);
      const key = `W${i + 1}`;
      weeks[key] = 0;
    }
    campaigns.forEach((c) => {
      const d = new Date(c.launchDate);
      const diffWeeks = Math.floor((now.getTime() - d.getTime()) / (7 * 24 * 60 * 60 * 1000));
      if (diffWeeks >= 0 && diffWeeks < 8) {
        weeks[`W${8 - diffWeeks}`] += c.spend;
      }
    });
    return Object.entries(weeks).map(([name, spend]) => ({ name, spend }));
  }, [campaigns]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5 lg:col-span-2"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Spend Evolution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={spendEvolution}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Area type="monotone" dataKey="spend" stroke="#8B0000" fill="#8B0000" fillOpacity={0.15} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Campaign Performance</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={campaignPerformance.length > 0 ? campaignPerformance : [{ name: 'No data', spend: 0, budget: 0 }]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis type="number" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#A0A0A0', fontSize: 11 }} axisLine={false} tickLine={false} width={80} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="budget" fill="#F4C430" radius={[0, 4, 4, 0]} fillOpacity={0.5} maxBarSize={20} />
            <Bar dataKey="spend" fill="#8B0000" radius={[0, 4, 4, 0]} fillOpacity={0.8} maxBarSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Weekly Spend Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={weeklySpendTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Line type="monotone" dataKey="spend" stroke="#2196F3" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
