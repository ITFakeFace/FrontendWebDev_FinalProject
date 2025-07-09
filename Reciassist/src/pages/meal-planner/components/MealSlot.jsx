import React, { useState, useCallback, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { ChefHat, Clock, X, Sparkles } from 'lucide-react';

const MealSlot = ({ title, date, mealType, recipes, onRemoveRecipe }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${date}|${mealType}`,
  });

  const getMealIcon = (type) => {
    switch (type) {
      case 'breakfast': return { icon: '🌅', gradient: 'from-orange-400 to-pink-400' };
      case 'lunch': return { icon: '☀️', gradient: 'from-yellow-400 to-orange-400' };
      case 'dinner': return { icon: '🌙', gradient: 'from-purple-400 to-blue-400' };
      default: return { icon: '🍽️', gradient: 'from-gray-400 to-gray-600' };
    }
  };

  const mealInfo = getMealIcon(mealType);

  return (
    <div
      ref={setNodeRef}
      className={`relative min-h-[140px] rounded-2xl transition-all duration-300 ${
        isOver 
          ? 'bg-gradient-to-br from-emerald-100 to-teal-100 border-2 border-emerald-400 border-dashed shadow-lg scale-105' 
          : 'bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 shadow-md hover:shadow-lg'
      }`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${mealInfo.gradient} flex items-center justify-center shadow-lg`}>
              <span className="text-lg">{mealInfo.icon}</span>
            </div>
            <div className="ml-3">
              <h4 className="font-bold text-gray-800 text-lg">{title}</h4>
              <p className="text-sm text-gray-500">{recipes.length} recipe{recipes.length !== 1 ? 's' : ''}</p>
            </div>
          </div>
          {isOver && (
            <div className="animate-bounce">
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <div key={recipe.id} className="group relative">
              <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <span className="font-semibold text-gray-800">{recipe.title}</span>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <span className="mr-3">{recipe.category}</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{recipe.cookTime}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveRecipe(date, mealType, recipe.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded-full hover:bg-red-100 text-red-500 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {recipes.length === 0 && (
            <div className="text-center py-6">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
                <ChefHat className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Drop your delicious recipes here!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default MealSlot;
