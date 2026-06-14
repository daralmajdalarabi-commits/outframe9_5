import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../stores/authStore';
import { Shield, KeyRound, Lock, Users } from 'lucide-react';
import AmbientBackground from '../three/AmbientBackground';

export default function AccessCodeEntry() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const success = login(code);
    if (!success) {
      setError('Invalid access code. Please try again.');
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0D0D0D]">
      <AmbientBackground />
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B0000]/5 via-transparent to-[#F4C430]/5" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#8B0000]/10 rounded-full blur-[120px] animate-pulse-glow" />
      <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-[#F4C430]/5 rounded-full blur-[100px] animate-pulse-glow" style={{ animationDelay: '1.5s' }} />

      <AnimatePresence mode="wait">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-md mx-4"
        >
          <div className="card p-1 glow-border">
            <div className="bg-[#0D0D0D] rounded-[15px] p-8 sm:p-10">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex flex-col items-center text-center mb-8"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8B0000]/30 to-[#8B0000]/10 border border-[#8B0000]/30 flex items-center justify-center mb-5">
                  <Shield className="w-8 h-8 text-[#8B0000]" />
                </div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Apex Operations
                </h1>
                <p className="text-[#A0A0A0] text-sm">
                  Enter your access code to continue
                </p>
              </motion.div>

              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#666]" />
                  <input
                    type="password"
                    value={code}
                    onChange={(e) => { setCode(e.target.value); setError(''); }}
                    placeholder="Access code"
                    className="input pl-11 h-12 text-base tracking-widest"
                    autoFocus
                    disabled={isLoading}
                  />
                </div>

                <AnimatePresence>
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="text-[#FF1744] text-sm flex items-center gap-2"
                    >
                      <Lock className="w-3.5 h-3.5" />
                      {error}
                    </motion.p>
                  )}
                </AnimatePresence>

                <button
                  type="submit"
                  disabled={isLoading || !code.trim()}
                  className="btn-primary w-full h-12 text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                      Verifying
                    </span>
                  ) : (
                    'Access Platform'
                  )}
                </button>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-6 pt-6 border-t border-[#2A2A2A]"
              >
                <div className="flex items-center justify-center gap-4 text-xs text-[#666]">
                  <div className="flex items-center gap-1.5">
                    <Shield className="w-3 h-3" />
                    <span>Admin Access</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3 h-3" />
                    <span>Team Access</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
