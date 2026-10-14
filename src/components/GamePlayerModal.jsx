import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Maximize2,
  Minimize2,
  RotateCw,
  Heart,
  Share2,
  Tv,
  Check,
  Keyboard,
  ExternalLink
} from 'lucide-react';

export function GamePlayerModal({
  game,
  onClose,
  isFavorite,
  onToggleFavorite,
  allGames,
  onSelectGame,
}) {
  const containerRef = useRef(null);
  const iframeRef = useRef(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTheater, setIsTheater] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = game.iframeUrl;
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const relatedGames = (allGames || [])
    .filter((g) => g.id !== game.id)
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex flex-col items-center justify-start p-2 sm:p-4 md:p-6"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className={`w-full transition-all duration-300 flex flex-col my-auto ${
          isTheater ? 'max-w-7xl' : 'max-w-5xl'
        }`}
      >
        {/* Top Header of the Player */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0d051a] border-x border-t border-purple-900/50 rounded-t-xl">
          <div className="flex items-center gap-3 truncate pr-4">
            <h2 className="text-base sm:text-lg font-black text-white truncate font-['Outfit']">
              {game.title}
            </h2>
            <div className="hidden sm:flex items-center gap-2 text-xs text-purple-300/70 font-mono">
              <span aria-hidden="true" className="text-purple-900">·</span>
              <span>{game.category}</span>
              <span aria-hidden="true" className="text-purple-900">·</span>
              <span className="text-fuchsia-400">★ {(game.rating || 5.0).toFixed(1)}</span>
            </div>
          </div>

          {/* Action Toolbar */}
          <div className="flex items-center gap-1.5 shrink-0">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleReload}
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer"
              title="Restart Game"
            >
              <RotateCw className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsTheater(!isTheater)}
              className={`p-2 rounded-lg transition-colors hidden md:block cursor-pointer ${
                isTheater
                  ? 'text-fuchsia-300 bg-fuchsia-950/60'
                  : 'text-purple-300 hover:text-white hover:bg-purple-900/50'
              }`}
              title={isTheater ? 'Default view' : 'Theater mode'}
            >
              <Tv className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleFullscreen}
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onToggleFavorite(game.id)}
              className={`p-2 rounded-lg transition-colors cursor-pointer ${
                isFavorite
                  ? 'text-fuchsia-400 bg-fuchsia-950/60'
                  : 'text-purple-300 hover:text-fuchsia-400 hover:bg-purple-900/50'
              }`}
              title="Bookmark game"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-fuchsia-500' : ''}`} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleShare}
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer"
              title="Copy link"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </motion.button>

            <a
              href={game.iframeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 text-purple-300 hover:text-white hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer"
              title="Open standalone in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>

            <div className="h-4 w-[1px] bg-purple-900/60 mx-1" />

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 text-purple-300 hover:text-rose-400 hover:bg-purple-900/50 rounded-lg transition-colors cursor-pointer"
              title="Close Player [Esc]"
            >
              <X className="w-5 h-5" />
            </motion.button>
          </div>
        </div>

        {game.id === 'gta-v' && (
          <div className="bg-purple-950/80 border-x border-b border-purple-800/60 px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <span className="text-purple-200">
              ⚡ WebAssembly requires isolated memory. If the embed displays an isolation notice:
            </span>
            <button
              onClick={() => window.open(game.iframeUrl, '_blank')}
              className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-md shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Launch GTA V in Fullscreen Window</span>
            </button>
          </div>
        )}

        {/* The Game Iframe Viewport */}
        <div
          ref={containerRef}
          className="relative w-full aspect-[16/10] sm:aspect-[16/9] bg-black border-x border-purple-900/50 overflow-hidden flex items-center justify-center shadow-2xl"
        >
          <iframe
            ref={iframeRef}
            id={game.iframeId || "innerFrame"}
            name={game.iframeName || "innerFrame"}
            src={game.iframeUrl?.startsWith('/') && !game.iframeUrl?.startsWith('//') ? '.' + game.iframeUrl : game.iframeUrl}
            title={game.title}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; gamepad; clipboard-read; clipboard-write; focus-without-user-activation *"
            allowFullScreen
          />
        </div>

        {/* Bottom Details & Controls Panel */}
        <div className="bg-[#0c0519] border-x border-b border-purple-900/50 rounded-b-xl p-4 sm:p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                About The Game
              </h3>
              <p className="text-sm text-purple-200/80 leading-relaxed">
                {game.description || 'Custom added iframe game.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-purple-300/60 pt-2 font-mono">
                <span>Category: {game.category || 'Arcade'}</span>
                <span aria-hidden="true" className="text-purple-900">·</span>
                <span>Developer: {game.author || 'Moksh'}</span>
                <span aria-hidden="true" className="text-purple-900">·</span>
                <span className="tabular-nums">{(game.plays || 0).toLocaleString()} plays</span>
              </div>
            </div>

            <div className="md:col-span-5 bg-[#06020c]/80 border border-purple-900/40 rounded-xl p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-fuchsia-400 mb-3 font-mono">
                <Keyboard className="w-4 h-4" />
                <span>Controls &amp; Inputs</span>
              </div>
              <ul className="space-y-2 text-xs text-purple-200/80">
                {(game.controls && game.controls.length > 0
                  ? game.controls
                  : ['Standard keyboard and mouse controls']
                ).map((ctrl, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-purple-400 font-bold shrink-0">›</span>
                    <span className="leading-snug">{ctrl}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {relatedGames.length > 0 && (
            <div className="pt-4 border-t border-purple-900/40">
              <h3 className="text-xs font-bold uppercase tracking-wider text-purple-400/80 mb-3 font-mono">
                More Arcade Games
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedGames.map((item) => (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    key={item.id}
                    onClick={() => onSelectGame(item)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-[#07020e]/60 hover:bg-purple-950/60 border border-purple-900/40 text-left transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded bg-[#120524] shrink-0 overflow-hidden flex items-center justify-center">
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-bold text-purple-400">👾</span>
                      )}
                    </div>
                    <div className="truncate">
                      <div className="text-xs font-bold text-white group-hover:text-purple-300 truncate">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-purple-400/60 font-mono">
                        {item.category}
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
