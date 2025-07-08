import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

const RecipeCard = ({ recipe, index, image, generateSlug, isFavorited, onToggleFavorite }) => {
  const navigate = useNavigate();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    onToggleFavorite(recipe.id);
  };

  return (
    <div
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${0.1 * index}s` }}
      onClick={() => navigate(`/recipe/${generateSlug(recipe.title)}`)}
    >
      <div className="relative overflow-hidden h-48">
        <img
          src={image}
          alt={recipe.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <button
          onClick={handleFavoriteClick}
          className={`absolute top-4 left-4 p-2 rounded-full transition-all duration-300 transform hover:scale-110 z-10 ${
            isFavorited 
              ? 'bg-red-500 text-white shadow-lg' 
              : 'bg-white/90 backdrop-blur-sm text-gray-400 hover:text-red-500'
          }`}
        >
          <Heart 
            size={20} 
            fill={isFavorited ? 'white' : 'none'}
            stroke={isFavorited ? 'white' : 'currentColor'}
            className="transition-all duration-300"
          />
        </button>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 transform translate-x-full group-hover:translate-x-0 transition-transform duration-500">
          <svg className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="text-sm font-semibold text-gray-800">{Array.isArray(recipe.ratings) && recipe.ratings.length > 0
              ? (
                  recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length
                ).toFixed(1)
              : 'N/A'}
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
            {recipe.category}
          </span>
          <div className="flex items-center gap-1 text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm">{recipe.cookingTime} min</span>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors duration-300">
          {recipe.title}
        </h2>

        <div className="flex items-center justify-between">
          <span className="text-yellow-500 font-semibold">
            ⭐ {Array.isArray(recipe.ratings) && recipe.ratings.length > 0
              ? (
                  recipe.ratings.reduce((sum, r) => sum + r.rating, 0) / recipe.ratings.length
                ).toFixed(1)
              : 'N/A'}
          </span>
          <span className={`text-sm px-3 py-1 rounded-full font-medium ${
            recipe.level === "Easy"
              ? "bg-green-100 text-green-700 group-hover:bg-green-200"
              : recipe.level === "Medium"
              ? "bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200"
              : "bg-red-100 text-red-700 group-hover:bg-red-200"
          }`}>
            {recipe.level}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 z-5">
        <button 
          className="bg-white text-orange-600 px-6 py-2 rounded-full font-semibold hover:bg-orange-50 transition-colors duration-300 transform translate-y-4 group-hover:translate-y-0"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/recipe/${generateSlug(recipe.title)}`);
          }}
        >
          View Recipe
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
