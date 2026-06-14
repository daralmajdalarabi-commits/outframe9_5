import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useProjectStore } from '../../stores/projectStore';
import { useTaskStore } from '../../stores/taskStore';

const ChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload?.length) {
    return (
      <div className="glass px-3 py-2 rounded-lg border border-[#2A2A2A] shadow-xl">
        <p className="text-xs text-[#A0A0A0]">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-semibold" style={{ color: entry.color }}>{entry.value}{entry.name === '%' ? '%' : ''}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function OperationsCharts() {
  const { projects } = useProjectStore();
  const { tasks } = useTaskStore();

  const projectProgressData = useMemo(() => {
    return projects.slice(0, 10).map((p) => ({
      name: p.name.length > 12 ? p.name.slice(0, 12) + '...' : p.name,
      progress: p.progress,
    }));
  }, [projects]);

  const taskCompletionData = useMemo(() => {
    const statuses = ['backlog', 'todo', 'in-progress', 'review', 'completed'];
    return statuses.map((s) => ({
      name: s.charAt(0).toUpperCase() + s.slice(1),
      count: tasks.filter((t) => t.status === s).length,
    }));
  }, [tasks]);

  const teamWorkloadData = useMemo(() => {
    const workload: Record<string, number> = {};
    tasks.forEach((t) => {
      if (t.status !== 'completed') {
        workload[t.assignedTo] = (workload[t.assignedTo] || 0) + t.estimatedHours;
      }
    });
    return Object.entries(workload).map(([name, hours]) => ({ name, hours }));
  }, [tasks]);

  const COLORS = ['#FF1744', '#FF9800', '#F4C430', '#CE93D8', '#00C853'];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-5"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Project Progress</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={projectProgressData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis dataKey="name" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="progress" fill="#8B0000" radius={[4, 4, 0, 0]} maxBarSize={40}>
              {projectProgressData.map((_, i) => (
                <Cell key={i} fill={i % 2 === 0 ? '#8B0000' : '#F4C430'} fillOpacity={0.8} />
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
        <h3 className="text-sm font-semibold text-white mb-4">Task Completion Rate</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={taskCompletionData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              dataKey="count"
              stroke="none"
            >
              {taskCompletionData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} fillOpacity={0.8} />
              ))}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex justify-center gap-4 mt-2">
          {taskCompletionData.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
              <span className="text-[10px] text-[#666]">{item.name}</span>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card p-5 lg:col-span-2"
      >
        <h3 className="text-sm font-semibold text-white mb-4">Team Workload (Active Hours)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={teamWorkloadData.length > 0 ? teamWorkloadData : [{ name: 'No tasks', hours: 0 }]} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
            <XAxis type="number" tick={{ fill: '#666', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis dataKey="name" type="category" tick={{ fill: '#A0A0A0', fontSize: 11 }} axisLine={false} tickLine={false} width={100} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="hours" fill="#F4C430" radius={[0, 4, 4, 0]} fillOpacity={0.8} maxBarSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
