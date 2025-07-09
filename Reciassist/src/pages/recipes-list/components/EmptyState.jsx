import React from 'react';

const EmptyState = ({ onClear, showFavoritesOnly }) => (
  <div className="col-span-full text-center py-16 animate-fade-in-up">
    <div className="text-6xl mb-4">
      {showFavoritesOnly ? '💔' : '🍽️'}
    </div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">
      {showFavoritesOnly ? 'No favorite recipes yet' : 'No recipes found'}
    </h3>
    <p className="text-gray-600 mb-6">
      {showFavoritesOnly 
        ? 'Start adding recipes to your favorites by clicking the heart icon!' 
        : 'Try adjusting your search or filters'}
    </p>
    <button
      onClick={onClear}
      className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors duration-300 font-semibold"
    >
      {showFavoritesOnly ? 'Show All Recipes' : 'Clear Filters'}
    </button>
  </div>
);

export default EmptyState;
