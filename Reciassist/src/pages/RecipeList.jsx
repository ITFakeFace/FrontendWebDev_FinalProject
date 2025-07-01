import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import recipes from '../services/data/recipes.json';
import SpaghettiImg from '../assets/food/images/spaghetti-bolognese.jpg';
import ChickenImg from '../assets/food/images/chicken-curry.jpg';
import VegetableSFryImg from '../assets/food/images/vegetable-stir-fry.png';
import GrillSalmonImg from '../assets/food/images/grilled-salmon.jpg';
import ChocoCake from '../assets/food/images/chocolate-cake.jpg';
import BeefTacos from '../assets/food/images/beef-tacos.jpg';

const RecipeList = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [selectedRecipeDetail, setSelectedRecipeDetail] = useState(null);

  const uniqueCategories = ['All', ...new Set(recipes.map((r) => r.category))];
  const uniqueLevels = ['All', ...new Set(recipes.map((r) => r.level))];

  const filteredRecipes = recipes.filter((recipe) => {
    const matchCategory = selectedCategory === 'All' || recipe.category === selectedCategory;
    const matchLevel = selectedLevel === 'All' || recipe.level === selectedLevel;
    const matchSearch = recipe.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchLevel && matchSearch;
  });

  const generateSlug = (title) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace spaces/symbols with -
    .replace(/^-+|-+$/g, '');     // Trim starting/ending hyphens
};

  const imageMap = {
    "spaghetti-bolognese": SpaghettiImg,
    "chicken-curry": ChickenImg,
    "vegetable-stir-fry": VegetableSFryImg,
    "grilled-salmon": GrillSalmonImg,
    "chocolate-cake": ChocoCake,
    "beef-tacos": BeefTacos,
  }

  return (
    <div className="p-6 max-w-6xl mx-auto"> {/* Limits width to ~1152px and centers content */}
      <h1 className="text-3xl font-bold mb-6 text-center">Recipe List</h1>

      {/* Filters */}
      <div className="flex flex-col md:flex-row flex-wrap gap-4 mb-6 justify-between">
        {/* Search */}
        <input
          type="text"
          placeholder="Search recipe..."
          className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Category Filter */}
        <select
          className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {uniqueCategories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        {/* Level Filter */}
        <select
          className="w-full md:w-[30%] px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedLevel}
          onChange={(e) => setSelectedLevel(e.target.value)}
        >
          {uniqueLevels.map((lvl) => (
            <option key={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

      {/* Recipe Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredRecipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
            onClick={() => navigate(`/recipe/${generateSlug(recipe.title)}`)}
            style={{ cursor: 'pointer' }}
          >
            <img
              src={imageMap[generateSlug(recipe.title)]}
              alt={recipe.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-1">{recipe.title}</h2>
              <p className="text-gray-500 text-sm mb-2">{recipe.category}</p>
              <div className="flex items-center justify-between">
                <span className="text-yellow-500 font-semibold">⭐ {recipe.rating}</span>
                <span className={`text-sm px-2 py-1 rounded-full ${
                  recipe.level === "Easy"
                    ? "bg-green-100 text-green-700"
                    : recipe.level === "Medium"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}>
                  {recipe.level}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filteredRecipes.length === 0 && (
          <p className="col-span-full text-center text-gray-500">No recipes found.</p>
        )}
      </div>
    </div>
  );
};

export default RecipeList;
