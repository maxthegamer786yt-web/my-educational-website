import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Ghost, Check, ShieldAlert } from 'lucide-react';
import { CLOAK_PRESETS, applyTabCloak, getSavedTabCloak } from '../utils/cloaker.js';

export function TabCloakModal({ onClose, panicKey, setPanicKey }) {
  const currentCloak = getSavedTabCloak();
  const [selectedPreset, setSelectedPreset] = useState(currentCloak.presetId);
  const [isListeningForPanicKey, setIsListeningForPanicKey] = useState(false);

  const handleSelectPreset = (presetId) => {
    setSelectedPreset(presetId);
    applyTabCloak(presetId);
  };

  const handleRecordKey = (e) => {
    e.preventDefault();
    setPanicKey(e.key);
    localStorage.setItem('goon_panic_key', e.key);
    setIsListeningForPanicKey(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#0e051d] border border-purple-900/60 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl shadow-purple-950/80"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/50 bg-[#07020e]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-600/50 flex items-center justify-center">
              <Ghost className="w-4 h-4 text-purple-400" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white font-['Outfit']">
                Stealth Tab Cloaker
              </h2>
              <p className="text-[11px] text-purple-400/60">Disguise tab name &amp; icon</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-purple-300 mb-3 font-mono">
              Choose Tab Disguise
            </label>
            <div className="space-y-2">
              {CLOAK_PRESETS.map((preset) => {
                const isSelected = selectedPreset === preset.id;
                return (
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-purple-950/80 border-purple-500 text-white shadow-md shadow-purple-950'
                        : 'bg-[#06020c] border-purple-900/50 text-purple-200 hover:border-purple-700 hover:bg-[#0c0519]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={preset.icon}
                        alt=""
                        className="w-5 h-5 rounded object-contain shrink-0"
                      />
                      <div>
                        <div className="text-xs font-bold">{preset.name}</div>
                        <div className="text-[11px] text-purple-400/60 font-mono truncate max-w-[200px]">
                          {preset.title}
                        </div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-purple-400 shrink-0" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-800/60">
            <div className="flex items-center gap-2 mb-2 text-fuchsia-300 text-xs font-bold font-mono">
              <ShieldAlert className="w-4 h-4 text-fuchsia-400" />
              <span>Emergency Panic Key</span>
            </div>
            <p className="text-xs text-purple-200/80 mb-3">
              Press this key anywhere to immediately disguise the screen with an academic study screen.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsListeningForPanicKey(true)}
                onKeyDown={isListeningForPanicKey ? handleRecordKey : undefined}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  isListeningForPanicKey
                    ? 'bg-fuchsia-600 text-white border-fuchsia-400 animate-pulse'
                    : 'bg-[#06020c] text-white border-purple-800 hover:border-purple-600'
                }`}
              >
                {isListeningForPanicKey ? 'Press key now...' : `Key: [ ${panicKey} ]`}
              </button>
              <span className="text-[11px] text-purple-400/60">
                (Default: <code className="text-purple-300 font-mono">]</code>)
              </span>
            </div>
          </div>

          <div className="pt-2 flex justify-end border-t border-purple-900/50">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-md shadow-purple-950 cursor-pointer"
            >
              Done
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
