import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import FavoriteCard from './FavoriteCard.jsx';
import { getFavorites, toggleFavorite, isFavorite } from '../../services/favoriteService';
import SkeletonCard from './SkeletonCard';
import recipes from '../../services/data/recipes.json';

import SpaghettiImg from '../../assets/food/images/spaghetti-bolognese.jpg';
import ChickenImg from '../../assets/food/images/chicken-curry.jpg';
import VegetableSFryImg from '../../assets/food/images/vegetable-stir-fry.png';
import GrillSalmonImg from '../../assets/food/images/grilled-salmon.jpg';
import ChocoCake from '../../assets/food/images/chocolate-cake.jpg';
import BeefTacos from '../../assets/food/images/beef-tacos.jpg';

const imageMap = {
  'spaghetti-bolognese': SpaghettiImg,
  'chicken-curry': ChickenImg,
  'vegetable-stir-fry': VegetableSFryImg,
  'grilled-salmon': GrillSalmonImg,
  'chocolate-cake': ChocoCake,
  'beef-tacos': BeefTacos,
};

const slugify = (title) =>
  title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

const sortOptions = [
  { label: 'Newest', value: 'Newest' },
  { label: 'Oldest', value: 'Oldest' },
  { label: 'Alphabetical: A-Z', value: 'A-Z' },
  { label: 'Alphabetical: Z-A', value: 'Z-A' }
];

const FavoriteRecipes = () => {
  const [layout, setLayout] = useState('grid');
  const [sortOption, setSortOption] = useState('Newest');
  const [favoriteList, setFavoriteList] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();

  const loadFavorites = () => {
  
  setTimeout(() => {
    const favIds = getFavorites();
    const matched = recipes
    .filter(r => favIds.includes(r.id))
    .map(r => ({
      ...r,
      image: imageMap[slugify(r.title)], 
      slug: slugify(r.title),
      rating: Array.isArray(r.ratings) && r.ratings.length > 0
        ? (r.ratings.reduce((sum, obj) => sum + obj.rating, 0) / r.ratings.length).toFixed(1)
        : 'N/A'
    }));
      setFavoriteList(matched);
      setLoading(false);
    }, 800);
  };


  useEffect(() => {
    setLoading(true); 
    loadFavorites();
  }, []);

  const onFavoriteToggled = (recipeId) => {
    const wasFav = isFavorite(recipeId);
    toggleFavorite(recipeId);
    loadFavorites();
    toast.current?.show({
      severity: wasFav ? 'warn' : 'success',
      summary: wasFav ? 'Removed' : 'Added',
      detail: wasFav ? 'Recipe removed from favorites' : 'Recipe added to favorites',
      life: 2000
    });
  };

  const sortFavorites = (items, option) => {
    switch (option) {
      case 'Newest': return [...items];
      case 'Oldest': return [...items].reverse();
      case 'A-Z': return [...items].sort((a, b) => a.title.localeCompare(b.title));
      case 'Z-A': return [...items].sort((a, b) => b.title.localeCompare(a.title));
      default: return items;
    }
  };
  const [loading, setLoading] = useState(true);
  const sortedList = sortFavorites(favoriteList, sortOption);

  const itemTemplate = (recipe, layout) => (
    <FavoriteCard
      recipe={recipe}
      layout={layout}
      isFav={isFavorite(recipe.id)}
      onFavoriteToggled={onFavoriteToggled}
    />
  );

  const listTemplate = (data, layout) => {
    if (layout === 'grid') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.map((item, index) => (
            <div key={index}>{itemTemplate(item, layout)}</div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="flex flex-col w-full">
          {data.map((item, index) => (
            <div key={index}>{itemTemplate(item, layout)}</div>
          ))}
        </div>
      );
    }
  };

  const header = () => (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center px-2 gap-4 mb-6">
      <div className="flex items-center gap-2">
        <i className="pi pi-filter text-gray-600"></i>
        <Dropdown
          value={sortOption}
          options={sortOptions}
          onChange={(e) => setSortOption(e.value)}
          className="w-44"
        />
      </div>
      <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value)} />
    </div>
  );

  return (
    <div className="px-6 py-8 w-full max-w-screen-xl mx-auto">
      <Toast ref={toast} />
      <button
        onClick={() => navigate(-1)}
        className="mb-4 bg-blue-100 text-blue-700 px-4 py-2 rounded hover:bg-blue-200"
      >
        ← Back
      </button>

      <h2 className="text-2xl font-bold mb-3">Favorite Recipes</h2>
      <p className="text-gray-600 mb-4">You have {sortedList.length} favorite recipe{sortedList.length !== 1 && 's'}.</p>

      {loading ? (
      <div className={`grid ${layout === 'grid' ? 'grid-cols-1 md:grid-cols-2 gap-6' : 'flex flex-col'}`}>
        {[...Array(4)].map((_, i) => (
          <SkeletonCard key={i} layout={layout} />
        ))}
      </div>
    ) : sortedList.length === 0 ? (
      <div className="text-center text-gray-500 mt-10 text-lg">
        You have no favorite recipes yet. Start exploring and add some!
      </div>
    ) : (
      <DataView
        value={sortedList}
        layout={layout}
        itemTemplate={itemTemplate}
        listTemplate={listTemplate}
        header={header()}
        paginator
        rows={6}
  />
    )}
    </div>
  );
};

export default FavoriteRecipes;
