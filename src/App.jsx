import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './data/games.json';
import { Header } from './components/Header.jsx';
import { HeroSpotlight } from './components/HeroSpotlight.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { GameCard } from './components/GameCard.jsx';
import { GamePlayerModal } from './components/GamePlayerModal.jsx';
import { TabCloakModal } from './components/TabCloakModal.jsx';
import { PanicOverlay } from './components/PanicOverlay.jsx';
import { Footer } from './components/Footer.jsx';
import { AccessGate } from './components/AccessGate.jsx';
import { AdminPanelModal } from './components/AdminPanelModal.jsx';
import { applyTabCloak, getSavedTabCloak } from './utils/cloaker.js';
import { isDeviceAuthorized, lockArcade, isAdminUser } from './utils/accessManager.js';
import { Gamepad2 } from 'lucide-react';

const CATEGORIES = ['All', 'Casual', 'Action', 'Arcade', 'Puzzle', 'Sports', 'Shooter', 'Driving'];

export default function App() {
  // Remembered device check: requires 1-time code on first device use
  const [isUnlocked, setIsUnlocked] = useState(() => isDeviceAuthorized());

  // Admin status
  const [isAdmin, setIsAdmin] = useState(() => isAdminUser());
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Games loaded directly from games.json
  const games = Array.isArray(gamesData) ? gamesData : [];

  // Favorites stored in localStorage
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem('goon_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Navigation & Filter states
  const [currentTab, setCurrentTab] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Modals & Active Game states
  const [activeGame, setActiveGame] = useState(null);
  const [isCloakModalOpen, setIsCloakModalOpen] = useState(false);
  const [isPanicActive, setIsPanicActive] = useState(false);
  const [panicKey, setPanicKey] = useState(() => {
    return localStorage.getItem('goon_panic_key') || ']';
  });

  // Initialize Tab Cloak on mount
  useEffect(() => {
    const saved = getSavedTabCloak();
    applyTabCloak(saved.presetId, saved.customTitle, saved.customIcon);
  }, []);

  // Panic hotkey listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      const target = e.target;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (e.key === panicKey) {
        e.preventDefault();
        setIsPanicActive((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [panicKey]);

  // Lock arcade handler
  const handleLockArcade = () => {
    lockArcade();
    setIsUnlocked(false);
  };

  // Favorite toggle
  const toggleFavorite = (gameId) => {
    setFavorites((prev) => {
      const next = prev.includes(gameId)
        ? prev.filter((id) => id !== gameId)
        : [...prev, gameId];
      localStorage.setItem('goon_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Pick random game
  const handleRandomGame = () => {
    if (games.length === 0) return;
    const randomIndex = Math.floor(Math.random() * games.length);
    setActiveGame(games[randomIndex]);
  };

  // Featured spotlight game
  const spotlightGame = useMemo(() => {
    if (games.length === 0) return null;
    return games.find((g) => g.featured) || games[0] || null;
  }, [games]);

  // Filtered and sorted games
  const filteredGames = useMemo(() => {
    let result = [...games];

    if (currentTab === 'favorites') {
      result = result.filter((g) => favorites.includes(g.id));
    }

    if (activeCategory !== 'All') {
      result = result.filter(
        (g) => (g.category || '').toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (g) =>
          (g.title || '').toLowerCase().includes(q) ||
          (g.description || '').toLowerCase().includes(q) ||
          (g.category || '').toLowerCase().includes(q) ||
          (g.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'popular') return (b.plays || 0) - (a.plays || 0);
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'name') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    return result;
  }, [games, currentTab, activeCategory, searchQuery, sortBy, favorites]);

  // Render Access Gate on first start if not unlocked
  if (!isUnlocked) {
    return (
      <AccessGate
        onUnlocked={(adminAccess) => {
          setIsUnlocked(true);
          setIsAdmin(Boolean(adminAccess || isAdminUser()));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#05010a] text-purple-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      {/* Panic Disguise Screen */}
      {isPanicActive && (
        <PanicOverlay
          panicKey={panicKey}
          onDismiss={() => setIsPanicActive(false)}
        />
      )}

      {/* Top Bar Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        favoritesCount={favorites.length}
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        onRandomGame={handleRandomGame}
        onTriggerPanic={() => setIsPanicActive(true)}
        onLockArcade={handleLockArcade}
        isAdmin={isAdmin}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Spotlight (shown when at least 1 game exists) */}
        {currentTab === 'all' && !searchQuery && spotlightGame && (
          <section aria-label="Featured Game">
            <HeroSpotlight
              game={spotlightGame}
              onPlay={setActiveGame}
              isFavorite={favorites.includes(spotlightGame.id)}
              onToggleFavorite={toggleFavorite}
            />
          </section>
        )}

        {/* Catalog Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight font-['Outfit']">
                {currentTab === 'favorites' ? 'Bookmarked Favorites' : 'Arcade Games Library'}
              </h2>
              <p className="text-xs text-purple-300/60 mt-1">
                {filteredGames.length} game{filteredGames.length === 1 ? '' : 's'} available · Iframe embeds · No AI features
              </p>
            </div>
          </div>

          {/* Filter Bar */}
          {games.length > 0 && (
            <FilterBar
              categories={CATEGORIES}
              activeCategory={activeCategory}
              onSelectCategory={setActiveCategory}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          )}

          {/* Games Grid or Empty State */}
          {filteredGames.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              <AnimatePresence>
                {filteredGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onPlay={setActiveGame}
                    isFavorite={favorites.includes(game.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="py-20 sm:py-28 flex flex-col items-center justify-center text-center p-8 bg-gradient-to-b from-[#0c0519]/90 to-[#06020c]/90 border border-purple-900/50 rounded-2xl shadow-xl shadow-black/80"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-16 h-16 rounded-2xl bg-purple-950/80 border border-purple-600/50 flex items-center justify-center shadow-lg shadow-purple-950/80 mb-5"
              >
                <Gamepad2 className="w-9 h-9 text-purple-400" />
              </motion.div>

              <h3 className="text-xl sm:text-2xl font-black text-white mb-2 font-['Outfit']">
                {games.length === 0
                  ? 'Ready for Your Games'
                  : currentTab === 'favorites'
                  ? 'No favorites bookmarked'
                  : 'No games match your search'}
              </h3>

              <p className="text-sm text-purple-300/70 max-w-md leading-relaxed">
                {games.length === 0
                  ? 'Place your games inside src/data/games.json to automatically display them here with iframe embeds.'
                  : currentTab === 'favorites'
                  ? 'Click the heart icon on any game card to add it to your favorites.'
                  : `No results for "${searchQuery}". Reset your filters to browse all games.`}
              </p>
            </motion.div>
          )}
        </section>
      </main>

      {/* Active Game Player Modal */}
      <AnimatePresence>
        {activeGame && (
          <GamePlayerModal
            key="player-modal"
            game={activeGame}
            onClose={() => setActiveGame(null)}
            isFavorite={favorites.includes(activeGame.id)}
            onToggleFavorite={toggleFavorite}
            allGames={games}
            onSelectGame={setActiveGame}
          />
        )}
      </AnimatePresence>

      {/* Tab Cloak Modal */}
      <AnimatePresence>
        {isCloakModalOpen && (
          <TabCloakModal
            key="cloak-modal"
            onClose={() => setIsCloakModalOpen(false)}
            panicKey={panicKey}
            setPanicKey={setPanicKey}
          />
        )}
      </AnimatePresence>

      {/* Admin Panel Modal */}
      <AnimatePresence>
        {isAdminModalOpen && (
          <AdminPanelModal
            key="admin-modal"
            onClose={() => {
              setIsAdminModalOpen(false);
              setIsAdmin(isAdminUser());
            }}
          />
        )}
      </AnimatePresence>

      {/* Footer */}
      <Footer
        onOpenCloakModal={() => setIsCloakModalOpen(true)}
        totalGames={games.length}
      />
    </div>
  );
}
