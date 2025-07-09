import React from 'react';
import { Heart } from 'lucide-react';

const FilterBar = ({
  search,
  selectedCategory,
  selectedLevel,
  showFavoritesOnly,
  categories,
  levels,
  onSearchChange,
  onCategoryChange,
  onLevelChange,
  onToggleFavoritesOnly,
  favoriteCount
}) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-between">
        <div className="relative w-full md:w-[30%]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search recipes..."
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <div className="relative w-full md:w-[30%]">
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
            value={selectedCategory}
            onChange={onCategoryChange}
          >
            {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="relative w-full md:w-[30%]">
          <select
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
            value={selectedLevel}
            onChange={onLevelChange}
          >
            {levels.map((lvl) => <option key={lvl} value={lvl}>{lvl}</option>)}
          </select>
        </div>
      </div>
      
      {/* Favorites Filter */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFavoritesOnly}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
            showFavoritesOnly
              ? 'bg-red-500 text-white shadow-lg'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <Heart 
            size={16} 
            fill={showFavoritesOnly ? 'currentColor' : 'none'}
            className="transition-colors duration-300"
          />
          Show Favorites Only
        </button>
        {favoriteCount > 0 && (
          <span className="text-sm text-gray-600">
            {favoriteCount} favorite{favoriteCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  </div>
);

export default FilterBar;
