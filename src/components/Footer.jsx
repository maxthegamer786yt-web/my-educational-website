import React from 'react';
import { Gamepad2, ShieldCheck, Ghost } from 'lucide-react';

export function Footer({ onOpenCloakModal, totalGames }) {
  return (
    <footer className="mt-20 border-t border-purple-900/40 bg-[#06020c] text-purple-300/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-950 border border-purple-700/60 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <span className="text-sm font-black text-white tracking-wider font-['Outfit']">
                Goon Arcade <span className="text-purple-400 font-semibold text-xs">-moksh</span>
              </span>
              <p className="text-xs text-purple-400/60">
                100% Client-Side Iframe Arcade · Zero AI Features
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs text-purple-300/80">
            <button
              onClick={onOpenCloakModal}
              className="hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Ghost className="w-3.5 h-3.5 text-purple-400" />
              <span>Tab Cloaker</span>
            </button>
            <span className="text-purple-900">·</span>
            <span className="font-mono tabular-nums text-purple-300">
              {totalGames} Games Loaded
            </span>
            <span className="text-purple-900">·</span>
            <span className="flex items-center gap-1 text-fuchsia-400">
              <ShieldCheck className="w-3.5 h-3.5" /> Unblocked
            </span>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-purple-950/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-purple-400/50">
          <div>
            Built with pure HTML5, CSS, and JavaScript. Powered by games.json.
          </div>
          <div>
            Goon Arcade -moksh
          </div>
        </div>
      </div>
    </footer>
  );
}
