import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import recipes from '../../services/datas/recipies.json';
import SpaghettiImg from '../../assets/food/images/spaghetti-bolognese.jpg';
import ChickenImg from '../../assets/food/images/chicken-curry.jpg';
import VegetableSFryImg from '../../assets/food/images/vegetable-stir-fry.png';
import GrillSalmonImg from '../../assets/food/images/grilled-salmon.jpg';
import ChocoCake from '../../assets/food/images/chocolate-cake.jpg';
import BeefTacos from '../../assets/food/images/beef-tacos.jpg';
import RecipeCard from './components/RecipeCard';
import FilterBar from './components/FilterBar';
import EmptyState from './components/EmptyState';

const RecipeList = () => {
  const navigate = useNavigate();
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [favorites, setFavorites] = useState(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);

  // Extract unique categories from the categories array
  const uniqueCategories = ['All', ...new Set(recipes.flatMap(r => r.categories || []))];
  
  // Map difficulty numbers to level names
  const difficultyMap = {
    1: 'Easy',
    2: 'Medium',
    3: 'Hard'
  };
  
  const uniqueLevels = ['All', ...new Set(recipes.map(r => difficultyMap[r.difficulty] || 'Unknown'))];

  // Load favorites from localStorage on component mount
  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem('recipeFavorites');
      console.log('Raw localStorage data:', savedFavorites); // Debug log
      if (savedFavorites && savedFavorites !== 'null') {
        const favoritesArray = JSON.parse(savedFavorites);
        console.log('Parsed favorites array:', favoritesArray); // Debug log
        if (Array.isArray(favoritesArray)) {
          setFavorites(new Set(favoritesArray));
          console.log('Set favorites to:', new Set(favoritesArray)); // Debug log
        }
      }
    } catch (error) {
      console.error('Error loading favorites from localStorage:', error);
    } finally {
      setFavoritesLoaded(true);
    }
  }, []);

  // Save favorites to localStorage whenever favorites change
  useEffect(() => {
    if (!favoritesLoaded) return; // Don't save during initial load
    
    try {
      const favoritesArray = Array.from(favorites);
      console.log('Saving favorites to localStorage:', favoritesArray); // Debug log
      localStorage.setItem('recipeFavorites', JSON.stringify(favoritesArray));
    } catch (error) {
      console.error('Error saving favorites to localStorage:', error);
    }
  }, [favorites, favoritesLoaded]);

  const toggleFavorite = (recipeId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(recipeId)) {
        newFavorites.delete(recipeId);
      } else {
        newFavorites.add(recipeId);
      }
      return newFavorites;
    });
  };

  const generateSlug = (title) =>
    (title || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

  const imageMap = {
    "flan-cake": SpaghettiImg,
    "fried-rice": ChickenImg,
    "vietnamese-spring-rolls": VegetableSFryImg,
    "pho-bo": GrillSalmonImg,
    "grilled-pork-with-broken-rice": ChocoCake,
    "beef-tacos": BeefTacos,
  };

  const filteredRecipes = recipes.filter((recipe) => {
    // Check if recipe matches selected category
    const matchCategory = selectedCategory === 'All' || 
      (recipe.categories && recipe.categories.includes(selectedCategory));
    
    // Check if recipe matches selected difficulty level
    const recipeLevel = difficultyMap[recipe.difficulty] || 'Unknown';
    const matchLevel = selectedLevel === 'All' || recipeLevel === selectedLevel;
    
    // Check if recipe name matches search term (with null safety)
    const recipeName = recipe.name || '';
    const matchSearch = recipeName.toLowerCase().includes(search.toLowerCase());
    
    // Check if showing favorites only
    const matchFavorites = !showFavoritesOnly || favorites.has(recipe.id);
    
    return matchCategory && matchLevel && matchSearch && matchFavorites;
  });

  const handleClearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedLevel('All');
    setShowFavoritesOnly(false);
  };

  const clearAllFavorites = () => {
    setFavorites(new Set());
    try {
      localStorage.removeItem('recipeFavorites');
    } catch (error) {
      console.error('Error clearing favorites from localStorage:', error);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      <style>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
      
      <div className="p-6 max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Recipe Collection
          </h1>
          <p className="text-gray-600 text-lg">Discover amazing recipes from around the world</p>
        </div>

        <FilterBar
          search={search}
          selectedCategory={selectedCategory}
          selectedLevel={selectedLevel}
          showFavoritesOnly={showFavoritesOnly}
          categories={uniqueCategories}
          levels={uniqueLevels}
          onSearchChange={(e) => setSearch(e.target.value)}
          onCategoryChange={(e) => setSelectedCategory(e.target.value)}
          onLevelChange={(e) => setSelectedLevel(e.target.value)}
          onToggleFavoritesOnly={() => setShowFavoritesOnly(!showFavoritesOnly)}
          favoriteCount={favorites.size}
        />

        <div className="mb-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-center flex-wrap gap-4 mb-3">
            <p className="text-gray-600 text-lg">
              Found <span className="font-semibold text-orange-600">{filteredRecipes.length}</span> delicious recipes
              {showFavoritesOnly && favorites.size > 0 && (
                <span className="text-red-500 ml-2">
                  (showing favorites only)
                </span>
              )}
            </p>

            <button
              onClick={() => navigate('/recipe/form')}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3 rounded-full font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              + Add New Recipe
            </button>
          </div>
          {favorites.size > 0 && (
            <button
              onClick={clearAllFavorites}
              className="mt-2 text-sm text-red-500 hover:text-red-700 underline"
            >
              Clear all favorites ({favorites.size})
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredRecipes.length > 0 ? (
            filteredRecipes.map((recipe, index) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                index={index}
                image={imageMap[generateSlug(recipe.name)]}
                generateSlug={generateSlug}
                isFavorited={favorites.has(recipe.id)}
                onToggleFavorite={() => toggleFavorite(recipe.id)}
              />
            ))
          ) : (
            <EmptyState 
              onClear={handleClearFilters} 
              showFavoritesOnly={showFavoritesOnly}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeList;