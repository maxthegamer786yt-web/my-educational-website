import React from 'react';
import { motion } from 'motion/react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export function FilterBar({
  categories,
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-2 border-b border-purple-900/40">
      {/* Category Filter Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
        {categories.map((category) => {
          const isActive = activeCategory === category;
          return (
            <motion.button
              key={category}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectCategory(category)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md shadow-purple-900/50'
                  : 'bg-[#0d0519] text-purple-200/80 hover:text-white hover:bg-purple-950/80 border border-purple-900/50'
              }`}
            >
              {category}
            </motion.button>
          );
        })}
      </div>

      {/* Search and Sort Toolbar */}
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search games or tags..."
            className="w-full pl-9 pr-8 py-1.5 text-xs bg-[#0d0519] border border-purple-900/60 rounded-lg text-purple-100 placeholder-purple-400/40 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="appearance-none pl-3 pr-8 py-1.5 text-xs bg-[#0d0519] border border-purple-900/60 rounded-lg text-purple-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="popular">Most Played</option>
            <option value="rating">Top Rated</option>
            <option value="name">Alphabetical</option>
          </select>
          <SlidersHorizontal className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
