import React, { useState, useCallback, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import { CalendarDays, ChefHat, Clock, X, Sparkles, Star, Users, Utensils } from 'lucide-react';
import rawRecipes from '../../services/datas/recipies.json';
import Calendar from './components/Calendar';
import RecipeCard from './components/RecipeCard';
import MealSlot from './components/MealSlot';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

const MealPlanner = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const colorMap = [
    'from-red-400 to-red-600',
    'from-yellow-400 to-orange-500',
    'from-pink-400 to-pink-600',
    'from-green-400 to-green-600',
    'from-purple-400 to-purple-600',
    'from-emerald-400 to-emerald-600',
    'from-amber-400 to-amber-600',
    'from-blue-400 to-blue-600'
  ];

  const getDifficultyLabel = (value) => {
  switch (value) {
    case 1: return 'Easy';
    case 2: return 'Medium';
    case 3: return 'Hard';
    default: return 'Unknown';
  }
};

  const convertCookingTime = (isoTime) => {
    try {
      const date = new Date(isoTime);
      const now = new Date();
      const diff = Math.abs(now - date); // in ms
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min`;
    } catch {
      return 'N/A';
    }
  };

  const mapRecipes = (recipes) => {
    return recipes.map((r, idx) => ({
      id: r.id.toString(),
      title: r.name || 'Untitled',
      category: r.categories?.[0] || 'Uncategorized',
      cookTime: `${r.cookingDuration} min`,
      difficulty: getDifficultyLabel(r.difficulty),
      servings: r.servings || 1,
      color: colorMap[idx % colorMap.length],
      image: r.image,
      fullData: r
    }));
  };

  const [recipes] = useState(() => mapRecipes(rawRecipes));

  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [sortOption, setSortOption] = useState('None');

  const filteredAndSortedRecipes = recipes
    .filter((r) => difficultyFilter === 'All' || r.difficulty === difficultyFilter)
    .sort((a, b) => {
      const timeA = parseInt(a.cookTime);
      const timeB = parseInt(b.cookTime);
      if (sortOption === 'TimeAsc') return timeA - timeB;
      if (sortOption === 'TimeDesc') return timeB - timeA;
      return 0;
    });

  const [mealPlan, setMealPlan] = useState(() => {
    const saved = localStorage.getItem('mealPlan');
    return saved ? JSON.parse(saved) : {};
  });
  const [activeId, setActiveId] = useState(null);

  useEffect(() => {
    localStorage.setItem('mealPlan', JSON.stringify(mealPlan));
  }, [mealPlan]);

  const formatDate = (date) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const [date, mealType] = over.id.split('|');
    const recipe = recipes.find((r) => r.id === active.id);
    
    if (!recipe) return;

    setMealPlan((prev) => {
      const updated = { ...prev };
      if (!updated[date]) {
        updated[date] = { breakfast: [], lunch: [], dinner: [] };
      }
      
      if (!updated[date][mealType]) {
        updated[date][mealType] = [];
      }
      
      if (!updated[date][mealType].some((r) => r.id === recipe.id)) {
        updated[date][mealType] = [...updated[date][mealType], recipe];
      }
      
      return updated;
    });
  };

  const handleRemoveRecipe = useCallback((date, mealType, recipeId) => {
    setMealPlan((prev) => {
      const updated = { ...prev };
      if (!updated[date] || !updated[date][mealType]) {
        return prev;
      }
      
      return {
        ...updated,
        [date]: {
          ...updated[date],
          [mealType]: updated[date][mealType].filter((r) => r.id !== recipeId),
        },
      };
    });
  }, []);

  const activeRecipe = activeId ? recipes.find((r) => r.id === activeId) : null;
  const currentDateStr = formatDate(selectedDate);
  const todayMealPlan = mealPlan[currentDateStr] || { breakfast: [], lunch: [], dinner: [] };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full shadow-2xl mb-6">
            <Utensils className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-4">
            Meal Planner
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create your perfect meal schedule with style and ease. Drag, drop, and organize your culinary adventures!
          </p>
        </div>

        {/* Calendar */}
        <Calendar
          currentDate={selectedDate}
          onDateChange={setSelectedDate}
          mealPlan={mealPlan}
        />

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          {/* Daily Meal Planning */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Daily Meal Plan
                </h3>
                <p className="text-gray-500">
                  {selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {MEAL_TYPES.map((mealType) => (
                <MealSlot
                  key={mealType}
                  title={mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  date={currentDateStr}
                  mealType={mealType}
                  recipes={todayMealPlan[mealType]}
                  onRemoveRecipe={handleRemoveRecipe}
                />
              ))}
            </div>
          </div>

          {/* Recipe Library */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Recipe Collection</h3>
                <p className="text-gray-500">Drag your favorite recipes to create perfect meals</p>
              </div>
            </div>
            <div className="flex justify-between items-center mb-6">
              <div>
                <label className="mr-2 text-gray-600 font-medium">Difficulty:</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option>All</option>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div>
                <label className="mr-2 text-gray-600 font-medium">Sort by:</label>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="None">None</option>
                  <option value="TimeAsc">Cooking Time ↑</option>
                  <option value="TimeDesc">Cooking Time ↓</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedRecipes.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeRecipe && <RecipeCard recipe={activeRecipe} isOverlay />}
          </DragOverlay>
        </DndContext>

        {/* Meal Plan Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <CalendarDays className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">Meal Plan Overview</h3>
              <p className="text-gray-500">Your complete meal planning history</p>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {Object.entries(mealPlan).length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Utensils className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500 text-lg">No meals planned yet!</p>
                <p className="text-gray-400 text-sm mt-2">Start by dragging recipes to your calendar above</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(mealPlan)
                  .sort(([a], [b]) => new Date(a) - new Date(b))
                  .map(([date, dayPlan]) => {
                    const totalRecipes = Object.values(dayPlan).reduce((total, meals) => total + (Array.isArray(meals) ? meals.length : 0), 0);
                    if (totalRecipes === 0) return null;
                    
                    return (
                      <div key={date} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
                        <h4 className="font-bold text-gray-800 text-lg mb-4 flex items-center">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mr-3">
                            <CalendarDays className="w-4 h-4 text-white" />
                          </div>
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {MEAL_TYPES.map((mealType) => (
                            <div key={mealType} className="bg-white rounded-lg p-4 shadow-sm">
                              <h5 className="font-bold text-gray-700 mb-2 capitalize flex items-center">
                                <span className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full mr-2"></span>
                                {mealType}
                              </h5>
                              {dayPlan[mealType] && dayPlan[mealType].length > 0 ? (
                                <ul className="space-y-2">
                                  {dayPlan[mealType].map((recipe) => (
                                    <li key={recipe.id} className="flex items-center text-gray-700">
                                      <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                      {recipe.title}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-400 text-sm">No meals planned</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealPlanner;