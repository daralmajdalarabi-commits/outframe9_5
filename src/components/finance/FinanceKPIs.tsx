import { motion } from 'framer-motion';
import { useFinanceStore } from '../../stores/financeStore';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';

export default function FinanceKPIs() {
  const { costs, orders } = useFinanceStore();

  const totalRevenue = orders.reduce((sum, o) => sum + o.value, 0);
  const totalCosts = costs.reduce((sum, c) => sum + c.amount, 0);
  const netProfit = totalRevenue - totalCosts;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const getMonthly = () => {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    const monthlyRevenue = orders
      .filter((o) => {
        const d = new Date(o.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((s, o) => s + o.value, 0);
    const monthlyCosts = costs
      .filter((c) => {
        const d = new Date(c.date);
        return d.getMonth() === month && d.getFullYear() === year;
      })
      .reduce((s, c) => s + c.amount, 0);
    return monthlyRevenue - monthlyCosts;
  };

  const getWeekly = () => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyRevenue = orders
      .filter((o) => new Date(o.date) >= weekAgo)
      .reduce((s, o) => s + o.value, 0);
    const weeklyCosts = costs
      .filter((c) => new Date(c.date) >= weekAgo)
      .reduce((s, c) => s + c.amount, 0);
    return weeklyRevenue - weeklyCosts;
  };

  const monthlyProfit = getMonthly();
  const weeklyProfit = getWeekly();

  const kpis = [
    { label: 'Total Revenue', value: totalRevenue, icon: DollarSign, color: '#00C853', prefix: '$' },
    { label: 'Total Costs', value: totalCosts, icon: Wallet, color: '#FF1744', prefix: '$' },
    { label: 'Net Profit', value: netProfit, icon: netProfit >= 0 ? TrendingUp : TrendingDown, color: netProfit >= 0 ? '#00C853' : '#FF1744', prefix: '$' },
    { label: 'Profit Margin', value: profitMargin, icon: Percent, color: profitMargin >= 0 ? '#00C853' : '#FF1744', suffix: '%' },
  ];

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <motion.div
              key={kpi.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-[#666] uppercase tracking-wider">{kpi.label}</span>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${kpi.color}15`, border: `1px solid ${kpi.color}30` }}>
                  <Icon className="w-4 h-4" style={{ color: kpi.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {kpi.prefix || ''}{typeof kpi.value === 'number' ? kpi.value.toLocaleString(undefined, { maximumFractionDigits: 2 }) : kpi.value}{kpi.suffix || ''}
              </p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4" style={{ color: monthlyProfit >= 0 ? '#00C853' : '#FF1744' }} />
            <span className="text-xs text-[#666]">Monthly Profit</span>
          </div>
          <p className="text-xl font-bold" style={{ color: monthlyProfit >= 0 ? '#00C853' : '#FF1744' }}>
            ${monthlyProfit.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="card p-5"
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingDown className="w-4 h-4" style={{ color: weeklyProfit >= 0 ? '#00C853' : '#FF1744' }} />
            <span className="text-xs text-[#666]">Weekly Profit</span>
          </div>
          <p className="text-xl font-bold" style={{ color: weeklyProfit >= 0 ? '#00C853' : '#FF1744' }}>
            ${weeklyProfit.toLocaleString()}
          </p>
        </motion.div>
      </div>
    </>
  );
}
