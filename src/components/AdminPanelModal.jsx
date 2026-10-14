import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShieldCheck,
  KeyRound,
  Plus,
  Copy,
  Check,
  Trash2,
  Lock,
  Unlock,
  AlertTriangle,
  RefreshCw,
  Sliders
} from 'lucide-react';
import {
  getValidCodes,
  getUsedCodes,
  generateBatchCodes,
  revokeCode,
  getAdminCode,
  setAdminCode,
  isLockdownActive,
  setLockdown,
} from '../utils/accessManager.js';

export function AdminPanelModal({ onClose }) {
  const [validCodes, setValidCodes] = useState(() => getValidCodes());
  const [usedCodes, setUsedCodes] = useState(() => getUsedCodes());
  const [adminCode, setLocalAdminCode] = useState(() => getAdminCode());
  const [newAdminInput, setNewAdminInput] = useState('');
  const [lockdown, setLocalLockdown] = useState(() => isLockdownActive());
  const [copiedCode, setCopiedCode] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');

  // Generate batch codes
  const handleGenerate = (count = 5, prefix = 'GOON') => {
    const generated = generateBatchCodes(count, prefix);
    setValidCodes(getValidCodes());
    setStatusMessage(`Generated ${count} new one-time codes!`);
    setTimeout(() => setStatusMessage(''), 3000);
  };

  // Copy code to clipboard
  const handleCopy = (codeText) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCode(codeText);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Copy all active codes
  const handleCopyAllActive = () => {
    if (validCodes.length === 0) return;
    navigator.clipboard.writeText(validCodes.join('\n'));
    setCopiedCode('ALL');
    setStatusMessage(`Copied all ${validCodes.length} active codes to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
      setStatusMessage('');
    }, 2500);
  };

  // Revoke code
  const handleRevoke = (c) => {
    const updated = revokeCode(c);
    setValidCodes(updated);
  };

  // Toggle lockdown
  const handleToggleLockdown = () => {
    const next = !lockdown;
    setLocalLockdown(next);
    setLockdown(next);
    setStatusMessage(next ? 'Arcade is now in LOCKDOWN mode! Only Admin can access.' : 'Arcade lockdown disabled. Normal user codes active.');
    setTimeout(() => setStatusMessage(''), 3500);
  };

  // Update admin key
  const handleUpdateAdminCode = (e) => {
    e.preventDefault();
    if (!newAdminInput.trim()) return;
    setAdminCode(newAdminInput.trim());
    setLocalAdminCode(newAdminInput.trim().toUpperCase());
    setNewAdminInput('');
    setStatusMessage('Master Admin Code successfully updated!');
    setTimeout(() => setStatusMessage(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 15 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-[#0e051d] border border-purple-800/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl shadow-purple-950/80 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-900/50 bg-[#07020e]/90">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950 border border-purple-500/60 flex items-center justify-center shadow-lg shadow-purple-950">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-white font-['Outfit']">
                  Admin Command Console
                </h2>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-purple-950 text-fuchsia-300 border border-purple-700/60 uppercase">
                  Owner Access
                </span>
              </div>
              <p className="text-[11px] text-purple-400/60 font-mono">
                Manage one-time codes, device authorization, &amp; arcade security
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-purple-300 hover:text-white rounded-lg hover:bg-purple-950 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {statusMessage && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 text-xs bg-purple-950/80 border border-purple-600/70 text-purple-200 rounded-xl font-mono flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{statusMessage}</span>
            </motion.div>
          )}

          {/* Quick Actions & Code Generator */}
          <div className="bg-[#080212] border border-purple-900/60 rounded-xl p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-purple-400" />
                  <span>Generate New 1-Time User Codes</span>
                </h3>
                <p className="text-[11px] text-purple-400/60">
                  Instantly creates fresh codes that expire immediately after one use.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleGenerate(5, 'GOON')}
                  className="px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-md shadow-purple-950"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+5 Codes</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleGenerate(10, 'MOKSH')}
                  className="px-3 py-1.5 text-xs font-bold bg-[#14082b] hover:bg-purple-950 text-purple-200 border border-purple-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-purple-400" />
                  <span>+10 Codes</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Active Available Codes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-purple-300 font-mono uppercase tracking-wide">
                Available 1-Time Codes ({validCodes.length})
              </span>
              {validCodes.length > 0 && (
                <button
                  onClick={handleCopyAllActive}
                  className="text-purple-400 hover:text-white flex items-center gap-1 font-mono transition-colors cursor-pointer"
                >
                  {copiedCode === 'ALL' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>Copy All Codes</span>
                </button>
              )}
            </div>

            {validCodes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {validCodes.map((codeItem) => (
                  <div
                    key={codeItem}
                    className="flex items-center justify-between p-2.5 rounded-lg bg-[#06020c] border border-purple-900/50 hover:border-purple-700/60 transition-colors font-mono text-xs"
                  >
                    <span className="text-white font-bold tracking-wider">{codeItem}</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(codeItem)}
                        title="Copy code"
                        className="p-1 text-purple-400 hover:text-white rounded hover:bg-purple-950 transition-colors cursor-pointer"
                      >
                        {copiedCode === codeItem ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleRevoke(codeItem)}
                        title="Revoke / Delete code"
                        className="p-1 text-purple-400 hover:text-rose-400 rounded hover:bg-rose-950/60 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#06020c] border border-purple-900/40 text-center text-xs text-purple-400/60 font-mono">
                No active codes left. Click "+5 Codes" above to generate a new batch!
              </div>
            )}
          </div>

          {/* Used / Burned Codes History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-300 font-mono uppercase tracking-wide">
              Used / Expired Codes History ({usedCodes.length})
            </h4>
            {usedCodes.length > 0 ? (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {usedCodes.map((usedItem, idx) => {
                  const codeStr = typeof usedItem === 'string' ? usedItem : usedItem.code;
                  const dateStr = typeof usedItem === 'object' && usedItem.usedAt
                    ? new Date(usedItem.usedAt).toLocaleDateString() + ' ' + new Date(usedItem.usedAt).toLocaleTimeString()
                    : 'Claimed';
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-[#05010a] border border-purple-950 text-xs font-mono"
                    >
                      <span className="text-purple-400/50 line-through tracking-wider">{codeStr}</span>
                      <span className="text-[10px] text-purple-400/40">{dateStr}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-3 rounded-lg bg-[#06020c] border border-purple-900/30 text-center text-[11px] text-purple-400/50 font-mono">
                No codes have been redeemed yet.
              </div>
            )}
          </div>

          {/* Master Admin Settings & Security Controls */}
          <div className="pt-4 border-t border-purple-900/50 space-y-4">
            <h4 className="text-xs font-bold text-fuchsia-300 font-mono uppercase tracking-wide flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Admin Security &amp; Master Settings</span>
            </h4>

            {/* Lockdown Switch */}
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#140628] border border-purple-800/60">
              <div>
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  {lockdown ? <Lock className="w-3.5 h-3.5 text-rose-400" /> : <Unlock className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>Arcade Lockdown Mode</span>
                </div>
                <div className="text-[11px] text-purple-300/60">
                  {lockdown
                    ? 'Active: All user logins blocked. Only Master Admin can enter.'
                    : 'Disabled: Standard 1-time user codes are accepted.'}
                </div>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleToggleLockdown}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  lockdown
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950'
                    : 'bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700'
                }`}
              >
                {lockdown ? 'Disable Lockdown' : 'Enable Lockdown'}
              </motion.button>
            </div>

            {/* Admin Key Display & Update */}
            <div className="p-3.5 rounded-xl bg-[#080212] border border-purple-900/60 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-purple-300 font-mono">Current Master Admin Code:</span>
                <span className="font-mono font-bold text-fuchsia-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-700/60">
                  {adminCode}
                </span>
              </div>

              <form onSubmit={handleUpdateAdminCode} className="flex gap-2">
                <input
                  type="text"
                  value={newAdminInput}
                  onChange={(e) => setNewAdminInput(e.target.value)}
                  placeholder="Set New Master Admin Code"
                  className="flex-1 px-3 py-1.5 text-xs bg-[#05010a] border border-purple-900/70 rounded-lg text-white font-mono placeholder-purple-400/30 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors cursor-pointer"
                >
                  Update Key
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 px-6 bg-[#07020e]/90 border-t border-purple-900/50 flex justify-end">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors shadow-md shadow-purple-950 cursor-pointer"
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
