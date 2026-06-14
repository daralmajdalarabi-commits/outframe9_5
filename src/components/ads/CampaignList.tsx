import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdsStore } from '../../stores/adsStore';
import { useAuthStore } from '../../stores/authStore';
import type { Campaign } from '../../types';
import { generateId, formatDate } from '../../utils';
import { Plus, Trash2, Edit3 } from 'lucide-react';
import Modal from '../common/Modal';

export default function CampaignList() {
  const { campaigns, addCampaign, updateCampaign, deleteCampaign } = useAdsStore();
  const role = useAuthStore((s) => s.role);
  const isAdmin = role === 'admin';

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState({
    name: '', platform: 'facebook' as Campaign['platform'], launchDate: '', endDate: '',
    budget: 0, spend: 0, notes: '', objective: '', status: 'draft' as Campaign['status'],
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', platform: 'facebook', launchDate: new Date().toISOString().split('T')[0], endDate: '', budget: 0, spend: 0, notes: '', objective: '', status: 'draft' });
    setModalOpen(true);
  };

  const openEdit = (c: Campaign) => {
    setEditing(c);
    setForm({ name: c.name, platform: c.platform, launchDate: c.launchDate, endDate: c.endDate, budget: c.budget, spend: c.spend, notes: c.notes, objective: c.objective, status: c.status });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (editing) {
      updateCampaign(editing.id, { ...form, budget: Number(form.budget), spend: Number(form.spend) });
    } else {
      addCampaign({ id: generateId(), ...form, budget: Number(form.budget), spend: Number(form.spend), createdAt: new Date().toISOString() });
    }
    setModalOpen(false);
  };

  const totalSpend = campaigns.reduce((s, c) => s + c.spend, 0);
  const activeCampaigns = campaigns.filter((c) => c.status === 'active').length;

  const getStatusColor = (status: string) => {
    const map: Record<string, string> = {
      active: '#00C853', paused: '#F4C430', completed: '#A0A0A0', draft: '#666',
    };
    return map[status] || '#666';
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card p-5">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Total Spend</p>
          <p className="text-2xl font-bold text-white">${totalSpend.toLocaleString()}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="card p-5">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Active Campaigns</p>
          <p className="text-2xl font-bold text-[#00C853]">{activeCampaigns}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Total Campaigns</p>
          <p className="text-2xl font-bold text-white">{campaigns.length}</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-5">
          <p className="text-xs text-[#666] uppercase tracking-wider mb-1">Avg. Spend</p>
          <p className="text-2xl font-bold text-[#F4C430]">
            ${campaigns.length > 0 ? (totalSpend / campaigns.length).toLocaleString(undefined, { maximumFractionDigits: 0 }) : '0'}
          </p>
        </motion.div>
      </div>

      <div className="space-y-2">
        {campaigns.map((campaign, i) => (
          <motion.div
            key={campaign.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="card p-4 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-white">{campaign.name}</h4>
                  <span className="badge text-[10px] !px-2 !py-0.5" style={{ background: `${getStatusColor(campaign.status)}15`, color: getStatusColor(campaign.status), border: `1px solid ${getStatusColor(campaign.status)}30` }}>
                    {campaign.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#666] mt-1">
                  <span className="capitalize">{campaign.platform}</span>
                  <span>{campaign.objective || 'No objective'}</span>
                  <span>{formatDate(campaign.launchDate)} - {campaign.endDate ? formatDate(campaign.endDate) : 'Ongoing'}</span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">${campaign.spend.toLocaleString()}</p>
                  <p className="text-[10px] text-[#666]">of ${campaign.budget.toLocaleString()} budget</p>
                </div>
                {isAdmin && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(campaign)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#F4C430]"><Edit3 className="w-3 h-3" /></button>
                    <button onClick={() => deleteCampaign(campaign.id)} className="p-1.5 rounded hover:bg-white/5 text-[#666] hover:text-[#FF1744]"><Trash2 className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${campaign.budget > 0 ? Math.min((campaign.spend / campaign.budget) * 100, 100) : 0}%` }}
                className="h-full rounded-full bg-gradient-to-r from-[#8B0000] to-[#F4C430]"
              />
            </div>
          </motion.div>
        ))}
        {campaigns.length === 0 && <p className="text-center text-sm text-[#666] py-8">No campaigns created</p>}
      </div>

      {isAdmin && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={openCreate}
          className="btn-primary mt-4 flex items-center gap-2 mx-auto"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </motion.button>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Edit Campaign' : 'Create Campaign'}>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Campaign Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input" placeholder="Campaign name" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Platform</label>
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value as Campaign['platform'] })} className="input">
              <option value="facebook">Facebook Ads</option>
              <option value="instagram">Instagram Ads</option>
              <option value="google">Google Ads</option>
              <option value="tiktok">TikTok Ads</option>
              <option value="linkedin">LinkedIn Ads</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Launch Date</label>
              <input type="date" value={form.launchDate} onChange={(e) => setForm({ ...form, launchDate: e.target.value })} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Budget ($)</label>
              <input type="number" min={0} value={form.budget} onChange={(e) => setForm({ ...form, budget: Number(e.target.value) })} className="input" />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Spend ($)</label>
              <input type="number" min={0} value={form.spend} onChange={(e) => setForm({ ...form, spend: Number(e.target.value) })} className="input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Objective</label>
            <input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} className="input" placeholder="e.g. Brand Awareness, Conversions" />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Campaign['status'] })} className="input">
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[#A0A0A0] mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="input" placeholder="Optional notes" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setModalOpen(false)} className="btn-secondary">Cancel</button>
            <button onClick={handleSave} className="btn-primary">{editing ? 'Update' : 'Create'}</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
