import { create } from 'zustand';
import db from '../db/db';
import type { Campaign } from '../types';
import {
  fetchData,
  pushAllData,
  startPolling,
  type GistData,
} from '../lib/sync';

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
    const remote = await fetchData();
    if (remote) {
      await db.campaigns.clear();
      await db.campaigns.bulkAdd(remote.campaigns);
      set({ campaigns: remote.campaigns, loading: false });
    } else {
      const campaigns = await db.campaigns.orderBy('createdAt').reverse().toArray();
      set({ campaigns, loading: false });
    }
    startPolling((data: GistData) => {
      set({ campaigns: data.campaigns });
      db.campaigns.clear();
      db.campaigns.bulkAdd(data.campaigns);
    });
  },
  addCampaign: async (campaign) => {
    await db.campaigns.add(campaign);
    set({ campaigns: [campaign, ...get().campaigns] });
    await pushAllData();
  },
  updateCampaign: async (id, data) => {
    await db.campaigns.update(id, data);
    const campaigns = get().campaigns.map((c) =>
      c.id === id ? { ...c, ...data } : c
    );
    set({ campaigns });
    await pushAllData();
  },
  deleteCampaign: async (id) => {
    await db.campaigns.delete(id);
    set({ campaigns: get().campaigns.filter((c) => c.id !== id) });
    await pushAllData();
  },
}));
