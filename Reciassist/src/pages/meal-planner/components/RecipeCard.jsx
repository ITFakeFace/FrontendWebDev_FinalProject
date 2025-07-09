import React, { useState, useCallback, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import {Clock, Sparkles, Users } from 'lucide-react';
import SpaghettiImg from '../../../assets/food/images/spaghetti-bolognese.jpg';
import ChickenImg from '../../../assets/food/images/chicken-curry.jpg';
import VegetableSFryImg from '../../../assets/food/images/vegetable-stir-fry.png';
import GrillSalmonImg from '../../../assets/food/images/grilled-salmon.jpg';
import ChocoCake from '../../../assets/food/images/chocolate-cake.jpg';
import BeefTacos from '../../../assets/food/images/beef-tacos.jpg';

const imageMap = {
  "spaghetti-bolognese": SpaghettiImg,
  "chicken-curry": ChickenImg,
  "vegetable-stir-fry": VegetableSFryImg,
  "grilled-salmon": GrillSalmonImg,
  "chocolate-cake": ChocoCake,
  "beef-tacos": BeefTacos,
};

const RecipeCard = ({ recipe, isOverlay = false }) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: recipe.id,
  });

  const generateSlug = (title) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
  const imageMap = {
      "spaghetti-bolognese": SpaghettiImg,
      "chicken-curry": ChickenImg,
      "vegetable-stir-fry": VegetableSFryImg,
      "grilled-salmon": GrillSalmonImg,
      "chocolate-cake": ChocoCake,
      "beef-tacos": BeefTacos,
    };

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${recipe.color} p-4 cursor-move transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
        isDragging ? 'opacity-50 rotate-6' : ''
      } ${isOverlay ? 'rotate-3 scale-110 shadow-2xl' : 'shadow-lg'}`}
    >
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl"></div>
      <div className="relative z-10">
        <img
          src={imageMap[generateSlug(recipe.title)]}
          alt={recipe.title}
          className="w-full h-40 object-cover rounded-lg mb-3 shadow-md"
        />
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-white text-lg mb-1 group-hover:text-yellow-100 transition-colors">
              {recipe.title}
            </h4>
            <p className="text-white/80 text-sm font-medium">{recipe.category}</p>
          </div>
          <Sparkles className="w-5 h-5 text-white/60 group-hover:text-yellow-200 transition-colors" />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center text-white/80 text-xs">
              <Clock className="w-3 h-3 mr-1" />
              {recipe.cookTime}
            </div>
            <div className="flex items-center text-white/80 text-xs">
              <Users className="w-3 h-3 mr-1" />
              {recipe.servings}
            </div>
            <div className="mt-3 text-white/90 text-xs space-y-1">
              <div>🔥 Calories: {recipe.fullData?.nutritionalInfo?.calories}</div>
              <div>⭐ Rating: {recipe.fullData?.rating}</div>
              <div>🥗 Ingredients: {recipe.fullData?.ingredients?.slice(0, 3).join(', ')}{recipe.fullData?.ingredients?.length > 3 ? ', ...' : ''}</div>
            </div>
          </div>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
      </div>
      
      <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
      <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/10 rounded-full group-hover:scale-110 transition-transform"></div>
    </div>
  );
};

export default RecipeCard;