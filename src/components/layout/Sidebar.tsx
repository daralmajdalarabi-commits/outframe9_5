import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Clock,
  Wallet,
  Megaphone,
  BarChart3,
  Shield,
} from 'lucide-react';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: '#8B0000' },
  { to: '/waiting', icon: Clock, label: 'Waiting List', color: '#F4C430' },
  { to: '/finance', icon: Wallet, label: 'Finance', color: '#00C853' },
  { to: '/ads', icon: Megaphone, label: 'Marketing', color: '#2196F3' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics', color: '#CE93D8' },
];

export default function Sidebar() {
  return (
    <aside className="w-16 lg:w-64 glass border-r border-[#2A2A2A] flex flex-col h-full">
      <div className="h-16 flex items-center gap-3 px-4 lg:px-5 border-b border-[#2A2A2A]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8B0000] to-[#5C0000] flex items-center justify-center flex-shrink-0">
          <Shield className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-sm tracking-tight hidden lg:block">
          Apex<span className="text-[#8B0000]">Ops</span>
        </span>
      </div>

      <nav className="flex-1 py-4 px-2 lg:px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 lg:px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                isActive
                  ? 'bg-[#8B0000]/15 text-white border border-[#8B0000]/20'
                  : 'text-[#666] hover:text-white hover:bg-white/[0.03] border border-transparent'
              }`
            }
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <item.icon className="w-5 h-5 flex-shrink-0" />
            </motion.div>
            <span className="hidden lg:block">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 lg:p-4 border-t border-[#2A2A2A]">
        <div className="rounded-lg bg-gradient-to-br from-[#8B0000]/10 to-transparent p-3 hidden lg:block">
          <p className="text-[10px] text-[#666] uppercase tracking-widest">Platform</p>
          <p className="text-xs text-[#A0A0A0] mt-0.5">v2.0 Enterprise</p>
        </div>
      </div>
    </aside>
  );
}
