import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Gamepad2, Ghost, Dices, Lock, ShieldCheck } from 'lucide-react';

export function Header({
  currentTab,
  setCurrentTab,
  favoritesCount,
  onOpenCloakModal,
  onRandomGame,
  onTriggerPanic,
  onLockArcade,
  isAdmin,
  onOpenAdminModal,
}) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="sticky top-0 z-40 bg-[#07020e]/90 backdrop-blur-md border-b border-purple-900/40 shadow-lg shadow-black/40"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Goon Arcade -moksh) */}
        <div className="flex items-center gap-2.5">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setCurrentTab('all')}
            className="flex items-center gap-2.5 text-left text-lg font-black tracking-tight text-white hover:text-purple-400 transition-colors whitespace-nowrap shrink-0 group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-950/80 border border-purple-600/50 flex items-center justify-center shadow-md shadow-purple-950/60 group-hover:border-purple-400 group-hover:shadow-purple-700/50 transition-all">
              <Gamepad2 className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-['Outfit'] tracking-wide bg-gradient-to-r from-purple-200 via-purple-300 to-fuchsia-300 bg-clip-text text-transparent">
              Goon Arcade <span className="text-purple-400 font-semibold text-sm tracking-normal">-moksh</span>
            </span>
          </motion.button>

          {isAdmin && (
            <span className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-purple-950 text-fuchsia-300 border border-purple-700/60">
              ADMIN
            </span>
          )}
        </div>

        {/* Zone 2: Concise Single-Line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-purple-200/80">
          <button
            onClick={() => setCurrentTab('all')}
            className={`transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'all'
                ? 'text-purple-400 font-bold drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                : 'hover:text-white'
            }`}
          >
            All Games
          </button>

          <button
            onClick={() => setCurrentTab('favorites')}
            className={`flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0 cursor-pointer ${
              currentTab === 'favorites'
                ? 'text-purple-400 font-bold drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]'
                : 'hover:text-white'
            }`}
          >
            <span>Favorites</span>
            {favoritesCount > 0 && (
              <span className="text-xs font-mono tabular-nums text-purple-400 bg-purple-950/80 px-1.5 py-0.2 rounded border border-purple-800/50">
                {favoritesCount}
              </span>
            )}
          </button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onOpenCloakModal}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Ghost className="w-4 h-4 text-purple-400" />
            <span>Stealth Cloak</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05, rotate: 15 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRandomGame}
            className="flex items-center gap-1.5 hover:text-white transition-colors whitespace-nowrap shrink-0 text-purple-300 hover:text-fuchsia-300 cursor-pointer"
          >
            <Dices className="w-4 h-4" />
            <span>Random</span>
          </motion.button>
        </nav>

        {/* Zone 3: Actions (Admin Console, Lock, & Panic Mode) */}
        <div className="flex items-center gap-2 shrink-0">
          {isAdmin && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenAdminModal}
              title="Open Admin Command Console"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/90 hover:bg-purple-900 border border-purple-600/70 text-fuchsia-300 text-xs font-bold transition-all shadow-md shadow-purple-950 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>Admin Panel</span>
            </motion.button>
          )}

          {onLockArcade && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onLockArcade}
              title="Lock Arcade"
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-900/50 border border-purple-800/50 rounded-lg transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" />
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            onClick={onTriggerPanic}
            title="Emergency Disguise (Hotkey: ])"
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-fuchsia-200 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/60 rounded-lg transition-all whitespace-nowrap shrink-0 shadow-md shadow-purple-950/80 cursor-pointer"
          >
            <ShieldAlert className="w-4 h-4 text-fuchsia-400" />
            <span>Panic Mode <span className="hidden sm:inline font-mono opacity-70 text-[11px]">[ ]</span></span>
          </motion.button>
        </div>
      </div>
    </motion.header>
  );
}
