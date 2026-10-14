import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Heart, Star, Gamepad2 } from 'lucide-react';

export function GameCard({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) {
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col bg-[#0c0519]/90 border border-purple-900/40 rounded-xl overflow-hidden hover:border-purple-500/80 transition-colors duration-200 shadow-md shadow-black/60 hover:shadow-xl hover:shadow-purple-950/60"
    >
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/9] w-full bg-[#05010a] overflow-hidden">
        {game.thumbnail && !imgError ? (
          <img
            src={game.thumbnail}
            alt={game.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#120524] to-[#05010a] text-purple-400/40 group-hover:text-purple-300 transition-colors">
            <Gamepad2 className="w-10 h-10 mb-1 opacity-50" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-purple-400/60">
              {game.category || 'Arcade'}
            </span>
          </div>
        )}

        {/* Hover Overlay Play Trigger */}
        <div className="absolute inset-0 bg-[#05010a]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onPlay(game)}
            className="w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-950 hover:bg-purple-500 cursor-pointer"
            title={`Play ${game.title}`}
          >
            <Play className="w-5 h-5 fill-white translate-x-0.5" />
          </motion.button>
        </div>

        {/* Top-Right Favorite Control */}
        <div className="absolute top-2.5 right-2.5 z-10">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(game.id);
            }}
            className="p-1.5 rounded-lg bg-[#07020e]/80 backdrop-blur-sm text-purple-400 hover:text-fuchsia-400 hover:bg-purple-950 transition-colors cursor-pointer"
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart
              className={`w-4 h-4 ${isFavorite ? 'fill-fuchsia-500 text-fuchsia-500' : ''}`}
            />
          </motion.button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3
            onClick={() => onPlay(game)}
            className="text-base font-bold text-white group-hover:text-purple-300 transition-colors cursor-pointer truncate mb-1"
          >
            {game.title}
          </h3>

          <div className="flex items-center gap-2 text-xs text-purple-300/70 mb-2 font-mono">
            <span>{game.category || 'Arcade'}</span>
            <span aria-hidden="true" className="text-purple-900">·</span>
            <span className="flex items-center gap-1 text-fuchsia-300">
              <Star className="w-3 h-3 fill-fuchsia-400 text-fuchsia-400" />
              <span className="tabular-nums font-semibold">{(game.rating || 5.0).toFixed(1)}</span>
            </span>
            <span aria-hidden="true" className="text-purple-900">·</span>
            <span className="tabular-nums">{(game.plays || 0).toLocaleString()} plays</span>
          </div>

          <p className="text-xs text-purple-300/60 line-clamp-2 leading-relaxed">
            {game.description || 'Unblocked iframe game.'}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-purple-900/40 flex items-center justify-between">
          <span className="text-[11px] text-purple-400/50 truncate max-w-[130px]">
            {game.author || 'Moksh'}
          </span>
          <button
            onClick={() => onPlay(game)}
            className="px-3 py-1 text-xs font-bold text-purple-300 hover:text-white hover:bg-purple-900/40 rounded transition-colors cursor-pointer"
          >
            Play Game →
          </button>
        </div>
      </div>
    </motion.div>
  );
}
