import { useEffect } from 'react';
import { useAdsStore } from '../stores/adsStore';
import CampaignList from '../components/ads/CampaignList';
import { CardSkeleton } from '../components/common/LoadingSkeleton';

export default function AdsPage() {
  const { loadCampaigns, loading } = useAdsStore();

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Marketing</h1>
        <p className="text-sm text-[#666] mt-1">Manage advertising campaigns across platforms</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <CampaignList />
      )}
    </div>
  );
}
