import { motion } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { Shield, ShieldCheck, LogOut } from 'lucide-react';
import SyncIndicator from '../common/SyncIndicator';

export default function Header() {
  const { role, logout } = useAuthStore();

  return (
    <header className="h-16 glass border-b border-[#2A2A2A] flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B0000] to-[#5C0000] flex items-center justify-center">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="font-semibold text-sm tracking-tight">APEX</span>
      </div>

      <div className="flex items-center gap-4">
        <SyncIndicator />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`badge ${role === 'admin' ? 'badge-admin' : 'badge-team'} flex items-center gap-1.5`}
        >
          {role === 'admin' ? (
            <ShieldCheck className="w-3 h-3" />
          ) : (
            <Shield className="w-3 h-3" />
          )}
          {role === 'admin' ? 'Administrator' : 'Team Member'}
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={logout}
          className="btn-secondary !p-2.5 !rounded-lg"
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
}
