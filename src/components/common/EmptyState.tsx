import { motion } from 'framer-motion';
import { FolderOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-[#2A2A2A] flex items-center justify-center mb-4">
        <FolderOpen className="w-7 h-7 text-[#666]" />
      </div>
      <h3 className="text-lg font-semibold text-[#A0A0A0] mb-1">{title}</h3>
      <p className="text-sm text-[#666] text-center max-w-sm mb-6">{description}</p>
      {action && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="btn-primary"
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}
