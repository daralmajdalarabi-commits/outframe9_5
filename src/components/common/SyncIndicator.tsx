import { useEffect, useState } from 'react';
import { useSyncStatus } from '../../lib/sync';
import { RefreshCw } from 'lucide-react';

export default function SyncIndicator() {
  const { isSyncing, lastSyncedAt } = useSyncStatus();
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (isSyncing) {
      setLabel('Syncing...');
      return;
    }
    if (!lastSyncedAt) {
      setLabel('');
      return;
    }
    const update = () => {
      const s = Math.floor((Date.now() - lastSyncedAt.getTime()) / 1000);
      setLabel(s < 5 ? 'Last synced: just now' : `Last synced: ${s}s ago`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [isSyncing, lastSyncedAt]);

  if (!label) return null;

  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-400">
      {isSyncing && <RefreshCw className="w-3 h-3 animate-spin" />}
      {label}
    </span>
  );
}
