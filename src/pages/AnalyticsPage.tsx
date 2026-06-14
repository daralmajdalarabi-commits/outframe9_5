import { useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';
import { useTaskStore } from '../stores/taskStore';
import { useFinanceStore } from '../stores/financeStore';
import { useAdsStore } from '../stores/adsStore';
import OperationsCharts from '../components/analytics/OperationsCharts';
import FinanceCharts from '../components/analytics/FinanceCharts';
import AdsCharts from '../components/analytics/AdsCharts';

export default function AnalyticsPage() {
  const { loadProjects } = useProjectStore();
  const { loadTasks } = useTaskStore();
  const { loadCosts, loadOrders } = useFinanceStore();
  const { loadCampaigns } = useAdsStore();

  useEffect(() => {
    loadProjects();
    loadTasks();
    loadCosts();
    loadOrders();
    loadCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-sm text-[#666] mt-1">Data-driven insights across all operations</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#8B0000]" />
          Operations
        </h2>
        <OperationsCharts />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00C853]" />
          Finance
        </h2>
        <FinanceCharts />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2196F3]" />
          Advertising
        </h2>
        <AdsCharts />
      </div>
    </div>
  );
}
