import { useEffect } from 'react';
import { useFinanceStore } from '../stores/financeStore';
import FinanceKPIs from '../components/finance/FinanceKPIs';
import CostsSection from '../components/finance/CostsSection';
import OrdersSection from '../components/finance/OrdersSection';
import { KPISkeleton } from '../components/common/LoadingSkeleton';

export default function FinancePage() {
  const { loadCosts, loadOrders, loading } = useFinanceStore();

  useEffect(() => {
    loadCosts();
    loadOrders();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
        <p className="text-sm text-[#666] mt-1">Track revenue, costs, and profitability</p>
      </div>

      {loading ? <KPISkeleton /> : <FinanceKPIs />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <CostsSection />
        </div>
        <div className="card p-5">
          <OrdersSection />
        </div>
      </div>
    </div>
  );
}
