import { create } from 'zustand';
import db from '../db/db';
import type { Campaign } from '../types';

interface AdsStore {
  campaigns: Campaign[];
  loading: boolean;
  loadCampaigns: () => Promise<void>;
  addCampaign: (campaign: Campaign) => Promise<void>;
  updateCampaign: (id: string, data: Partial<Campaign>) => Promise<void>;
  deleteCampaign: (id: string) => Promise<void>;
}

export const useAdsStore = create<AdsStore>((set, get) => ({
  campaigns: [],
  loading: true,
  loadCampaigns: async () => {
    set({ loading: true });
    const campaigns = await db.campaigns.orderBy('createdAt').reverse().toArray();
    set({ campaigns, loading: false });
  },
  addCampaign: async (campaign) => {
    await db.campaigns.add(campaign);
    set({ campaigns: [campaign, ...get().campaigns] });
  },
  updateCampaign: async (id, data) => {
    await db.campaigns.update(id, data);
    const campaigns = get().campaigns.map((c) =>
      c.id === id ? { ...c, ...data } : c
    );
    set({ campaigns });
  },
  deleteCampaign: async (id) => {
    await db.campaigns.delete(id);
    set({ campaigns: get().campaigns.filter((c) => c.id !== id) });
  },
}));
