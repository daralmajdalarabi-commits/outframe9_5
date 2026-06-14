import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

export default function DashboardLayout() {
  return (
    <div className="flex h-screen bg-[#0D0D0D]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 overflow-y-auto p-4 lg:p-6"
        >
          <Outlet />
        </motion.main>
      </div>
    </div>
  );
}
