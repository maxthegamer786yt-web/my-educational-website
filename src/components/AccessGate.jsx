import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, KeyRound, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';
import { verifyAndConsumeCode } from '../utils/accessManager.js';

export function AccessGate({ onUnlocked }) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [shake, setShake] = useState(false);

  // Play subtle unlock chime on success
  const playUnlockSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, audioCtx.currentTime + 0.2); // G5
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    } catch (e) {}
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (!code.trim()) {
      setError('Please enter your 1-time access code.');
      return;
    }

    const res = verifyAndConsumeCode(code);

    if (res.success) {
      setError('');
      setIsSuccess(true);
      playUnlockSound();
      setTimeout(() => {
        onUnlocked(res.isAdmin);
      }, 700);
    } else {
      setError(res.message);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#05010a] text-purple-100 flex items-center justify-center p-4 overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 15 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          x: shake ? [-10, 10, -8, 8, -4, 4, 0] : 0
        }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="relative w-full max-w-md bg-gradient-to-b from-[#0f0622] via-[#0b0419] to-[#06020e] border border-purple-800/60 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-purple-950/80 text-center"
      >
        {/* Animated Icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            animate={{ scale: isSuccess ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.4 }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-xl ${
              isSuccess
                ? 'bg-emerald-950/80 border-emerald-500/80 text-emerald-400 shadow-emerald-950/60'
                : 'bg-purple-950/80 border-purple-600/60 text-purple-400 shadow-purple-950/60'
            }`}
          >
            {isSuccess ? (
              <Unlock className="w-8 h-8" />
            ) : (
              <Lock className="w-8 h-8" />
            )}
          </motion.div>
        </div>

        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-['Outfit'] mb-2">
          Goon Arcade <span className="text-purple-400 font-semibold text-lg tracking-normal">-moksh</span>
        </h1>
        <p className="text-xs text-purple-300/70 mb-6 font-mono">
          Single-Use Access Pass Required
        </p>

        {/* Passcode Form */}
        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-purple-400/60 pointer-events-none" />
              <input
                type="text"
                autoFocus
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError('');
                }}
                placeholder="ENTER 1-TIME PASSCODE"
                className="w-full pl-10 pr-4 py-3 bg-[#05010a] border border-purple-800/80 rounded-xl text-center font-mono text-sm sm:text-base font-bold text-white placeholder-purple-400/30 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/40 uppercase tracking-widest transition-all"
              />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="p-3 text-xs bg-rose-950/70 border border-rose-800/80 text-rose-300 rounded-xl flex items-center gap-2 text-left"
              >
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span className="leading-snug">{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3.5 px-6 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-900/60 transition-all cursor-pointer"
          >
            <span>{isSuccess ? 'Access Granted...' : 'Unlock Arcade'}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </form>

        {/* Security & One-Time Note */}
        <div className="mt-8 pt-6 border-t border-purple-900/40 text-[11px] text-purple-400/60 flex items-center justify-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Single-use code · Your device is remembered permanently</span>
        </div>
      </motion.div>
    </div>
  );
}
