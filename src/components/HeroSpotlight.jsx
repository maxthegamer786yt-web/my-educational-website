import React from 'react';
import { motion } from 'motion/react';
import { Play, Heart, Star, Users, Flame, Gamepad } from 'lucide-react';

export function HeroSpotlight({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) {
  if (!game) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0e051d] via-[#090314] to-[#040108] border border-purple-900/50 shadow-2xl shadow-purple-950/40"
    >
      {/* Ambient glowing purple backlight */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[360px]">
        {/* Left Column: Game Info */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 mb-3 tracking-wide uppercase font-mono">
              <span className="flex items-center gap-1 text-fuchsia-400">
                <Flame className="w-3.5 h-3.5 fill-fuchsia-400" /> Featured Game
              </span>
              <span aria-hidden="true" className="text-purple-900">·</span>
              <span className="text-purple-300">{game.category || 'Arcade'}</span>
              <span aria-hidden="true" className="text-purple-900">·</span>
              <span className="text-purple-400/80">Unblocked</span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3 [text-wrap:balance] font-['Outfit']">
              {game.title}
            </h1>

            <p className="text-sm sm:text-base text-purple-200/80 leading-relaxed max-w-xl mb-6">
              {game.description}
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-purple-300/70 mb-6 font-mono">
              <div className="flex items-center gap-1 text-fuchsia-300">
                <Star className="w-4 h-4 fill-fuchsia-400 text-fuchsia-400" />
                <span className="font-bold tabular-nums">{(game.rating || 5.0).toFixed(1)}</span>
                <span className="text-purple-400/60">/ 5.0</span>
              </div>
              <span aria-hidden="true" className="text-purple-900">·</span>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-purple-400" />
                <span className="tabular-nums">{(game.plays || 0).toLocaleString()} plays</span>
              </div>
              <span aria-hidden="true" className="text-purple-900">·</span>
              <span>By {game.author || 'Moksh'}</span>
            </div>

            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onPlay(game)}
                className="flex items-center gap-2 px-6 py-3 text-sm font-extrabold text-white bg-purple-600 hover:bg-purple-500 rounded-xl shadow-lg shadow-purple-900/50 hover:shadow-purple-700/60 transition-all cursor-pointer whitespace-nowrap"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Game</span>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => onToggleFavorite(game.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                  isFavorite
                    ? 'bg-fuchsia-950/60 border-fuchsia-700 text-fuchsia-300'
                    : 'bg-[#150a2b]/80 border-purple-900/80 text-purple-200 hover:text-white hover:bg-purple-950 hover:border-purple-700'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-fuchsia-400 text-fuchsia-400' : ''}`} />
                <span>{isFavorite ? 'Favorited' : 'Bookmark'}</span>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Preview */}
        <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full bg-[#05010a] overflow-hidden flex items-center justify-center border-t lg:border-t-0 lg:border-l border-purple-900/40">
          {game.thumbnail ? (
            <img
              src={game.thumbnail}
              alt={game.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#120524] to-[#05010a] text-purple-400/40">
              <Gamepad className="w-16 h-16 mb-2 opacity-60 text-purple-400" />
              <span className="text-xs font-mono uppercase tracking-widest text-purple-300/60">
                Instant Iframe Play
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0e051d] via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#0e051d] lg:via-transparent lg:to-transparent opacity-80" />
        </div>
      </div>
    </motion.div>
  );
}
