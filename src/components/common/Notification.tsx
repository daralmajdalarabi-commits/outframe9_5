import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

interface NotificationProps {
  type: 'success' | 'error' | 'info';
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const config = {
  success: { icon: CheckCircle, color: '#00C853', bg: 'rgba(0,200,83,0.1)', border: 'rgba(0,200,83,0.3)' },
  error: { icon: AlertCircle, color: '#FF1744', bg: 'rgba(255,23,68,0.1)', border: 'rgba(255,23,68,0.3)' },
  info: { icon: Info, color: '#2196F3', bg: 'rgba(33,150,243,0.1)', border: 'rgba(33,150,243,0.3)' },
};

export default function Notification({ type, message, isVisible, onClose }: NotificationProps) {
  if (!isVisible) return null;
  const cfg = config[type];
  const Icon = cfg.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -20, x: '-50%' }}
      className="fixed top-4 left-1/2 z-[100]"
    >
      <div
        className="flex items-center gap-3 px-5 py-3 rounded-xl backdrop-blur-xl border shadow-2xl min-w-[320px]"
        style={{ background: cfg.bg, borderColor: cfg.border }}
      >
        <Icon className="w-5 h-5 flex-shrink-0" style={{ color: cfg.color }} />
        <p className="text-sm text-white flex-1">{message}</p>
        <button onClick={onClose} className="text-white/40 hover:text-white transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
