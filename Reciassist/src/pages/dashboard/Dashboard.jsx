import React, { useState } from 'react';
import { User, Clock, Users, Star, ChefHat, TrendingUp, Heart, MessageCircle } from 'lucide-react';
import recipesData from '../../services/datas/recipies.json';
import { useUserStore } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, logout } = useUserStore();
  const isSignedIn = !!user;
  const navigate = useNavigate();

  // Add custom CSS animations
  const customStyles = `
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slide-up {
      from { opacity: 0; transform: translateY(30px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .animate-fade-in {
      animation: fade-in 0.6s ease-out;
    }
    
    .animate-slide-up {
      animation: slide-up 0.8s ease-out;
    }
  `;

  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = customStyles;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 1: return 'text-green-500';
      case 2: return 'text-yellow-500';
      case 3: return 'text-orange-500';
      case 4: return 'text-red-500';
      case 5: return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const getDifficultyText = (difficulty) => {
    switch(difficulty) {
      case 1: return 'Easy';
      case 2: return 'Medium';
      case 3: return 'Hard';
      case 4: return 'Expert';
      case 5: return 'Master';
      default: return 'Unknown';
    }
  };

  const RecipeCard = ({ recipe }) => (
    <div className="group relative bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-700 hover:-translate-y-3 hover:rotate-1 border border-white/20 overflow-hidden animate-slide-up">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent transform -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      <div className="relative p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors duration-500">{recipe.name}</h3>
            <p className="text-gray-300 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: recipe.description }}></p>
          </div>
          <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-500 px-3 py-1 rounded-full shadow-lg animate-bounce">
            <Star className="w-4 h-4 text-white fill-current" />
            <span className="text-sm font-medium text-white">{recipe.ratingScore}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {recipe.categories.map((category, index) => (
            <span key={index} className="px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-xs font-medium hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 cursor-pointer">
              {category}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-gray-300 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 hover:text-cyan-300 transition-colors duration-300">
              <Clock className="w-4 h-4" />
              <span>{recipe.cookingDuration} min</span>
            </div>
            <div className="flex items-center space-x-1 hover:text-cyan-300 transition-colors duration-300">
              <Users className="w-4 h-4" />
              <span>{recipe.servings} servings</span>
            </div>
          </div>
          <div className={`font-medium ${getDifficultyColor(recipe.difficulty)} animate-pulse`}>
            {getDifficultyText(recipe.difficulty)}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2 mb-4 p-3 bg-black/20 backdrop-blur-md rounded-lg border border-white/10">
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-lg font-bold text-white group-hover:text-cyan-300">{recipe.nutrition.calories}</div>
            <div className="text-xs text-gray-400">Calories</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-lg font-bold text-white group-hover:text-cyan-300">{recipe.nutrition.protein}g</div>
            <div className="text-xs text-gray-400">Protein</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-lg font-bold text-white group-hover:text-cyan-300">{recipe.nutrition.carbohydrates}g</div>
            <div className="text-xs text-gray-400">Carbs</div>
          </div>
          <div className="text-center group hover:scale-110 transition-transform duration-300">
            <div className="text-lg font-bold text-white group-hover:text-cyan-300">{recipe.nutrition.fat}g</div>
            <div className="text-xs text-gray-400">Fat</div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">{recipe.comments.length} comments</span>
          </div>
          <button className="flex items-center space-x-1 text-pink-400 hover:text-pink-300 transition-all duration-300 transform hover:scale-110">
            <Heart className="w-4 h-4 hover:fill-current transition-all duration-300" />
            <span className="text-sm">Save</span>
          </button>
        </div>
      </div>
    </div>
  );

  const StatsCard = ({ icon: Icon, title, value, change, color }) => (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500 hover:-translate-y-2 hover:rotate-1 border border-white/20 group animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white group-hover:text-cyan-300 transition-colors duration-300">{value}</p>
          {change && (
            <div className="flex items-center space-x-1 mt-2 animate-pulse">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm text-green-400">+{change}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full ${color} bg-opacity-30 backdrop-blur-sm border border-white/20 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 text-white group-hover:animate-pulse`} />
        </div>
      </div>
    </div>
  );

  const totalRecipes = recipesData.length;
  const avgRating = (recipesData.reduce((sum, recipe) => sum + recipe.ratingScore, 0) / totalRecipes).toFixed(1);
  const totalComments = recipesData.reduce((sum, recipe) => sum + recipe.comments.length, 0);

  return (
    <div className="min-h-screen w-full overflow-x-hidden overflow-y-auto bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-20 animate-bounce" style={{animationDuration: '3s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full opacity-10 animate-spin" style={{animationDuration: '20s'}}></div>
      </div>
      <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl shadow-lg animate-pulse">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-pulse">
                Recipe Dashboard
              </h1>
              <p className="text-gray-300">Discover and manage your favorite recipes</p>
            </div>
          </div>
          
          <button 
            onClick={() => {
                if (user) {
                logout(); // real logout from context
                } else {
                navigate('/sign-in'); // go to login page
                }
            }}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-500 transform hover:scale-110 hover:rotate-1 ${
                user
                ? 'bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 text-white shadow-2xl hover:shadow-green-500/25 animate-pulse'
                : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 shadow-lg hover:shadow-xl'
            }`}
            >
            <User className="w-5 h-5" />
            <span className="font-medium">
                {user ? 'Sign Out' : 'Sign In'}
            </span>
          </button>
        </div>

        {/* Main Content */}
        <div className={`grid gap-6 ${isSignedIn ? 'lg:grid-cols-3' : 'lg:grid-cols-2'}`}>
          
          {/* Left Column - Recipe Cards */}
          <div className={`${isSignedIn ? 'lg:col-span-2' : 'lg:col-span-1'} space-y-6`}>
            <div className="flex items-center justify-between animate-slide-up">
              <h2 className="text-2xl font-bold text-white">Featured Recipes</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-300">
                <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-white animate-pulse">{totalRecipes} recipes</span>
              </div>
            </div>
            
            <div className="grid gap-6">
              {recipesData.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>

          {/* Right Column - Stats and Activity */}
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white animate-pulse">Statistics</h2>
              <div className="grid gap-4">
                <StatsCard 
                  icon={ChefHat} 
                  title="Total Recipes" 
                  value={totalRecipes}
                  change="12"
                  color="bg-blue-500"
                />
                <StatsCard 
                  icon={Star} 
                  title="Average Rating" 
                  value={avgRating}
                  change="5"
                  color="bg-yellow-500"
                />
                <StatsCard 
                  icon={MessageCircle} 
                  title="Total Comments" 
                  value={totalComments}
                  change="8"
                  color="bg-green-500"
                />
              </div>
            </div>

            {/* User Activity (Only when signed in) */}
            {isSignedIn && (
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
                  <span>Your Activity</span>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-ping"></div>
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 bg-black/20 backdrop-blur-md rounded-lg hover:bg-black/30 transition-all duration-300 transform hover:scale-105 group">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-300">Reviewed "Flan Cake"</p>
                      <p className="text-xs text-gray-400">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/20 backdrop-blur-md rounded-lg hover:bg-black/30 transition-all duration-300 transform hover:scale-105 group">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-300">Saved "Pho Bo"</p>
                      <p className="text-xs text-gray-400">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-black/20 backdrop-blur-md rounded-lg hover:bg-black/30 transition-all duration-300 transform hover:scale-105 group">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-sm font-medium text-white group-hover:text-cyan-300">Added comment on "Fried Rice"</p>
                      <p className="text-xs text-gray-400">2 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Popular Categories */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-4">Popular Categories</h3>
              <div className="space-y-3">
                {['Dessert', 'Traditional', 'Healthy', 'Lunch', 'Soup'].map((category, index) => (
                  <div key={category} className="flex items-center justify-between p-3 bg-black/20 backdrop-blur-md rounded-lg hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300 transform hover:scale-105 group cursor-pointer">
                    <span className="text-sm font-medium text-white group-hover:text-cyan-300">{category}</span>
                    <span className="text-xs text-gray-400 bg-gradient-to-r from-blue-500 to-purple-600 px-2 py-1 rounded-full text-white">{Math.floor(Math.random() * 20) + 5} recipes</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;