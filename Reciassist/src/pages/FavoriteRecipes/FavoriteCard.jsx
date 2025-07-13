import React, { useState, useRef, useEffect } from 'react';
import { Rating } from 'primereact/rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as regularHeart } from '@fortawesome/free-regular-svg-icons';
import ShareButtons from './ShareButtons';
import '../FavoriteRecipes/FavoriteCard.css';
import { Link } from 'react-router-dom';

const FavoriteCard = ({ recipe, layout, isFav, onFavoriteToggled }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const confirmRef = useRef(null);

  const heartIcon = isFav ? solidHeart : regularHeart;

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (isFav) {
      setShowConfirm(true);
    } else {
      // Animation when adding to favorites
      setJustAdded(true);
      setTimeout(() => setJustAdded(false), 600);
      onFavoriteToggled(recipe.id);
    }
  };

  const confirmRemove = () => {
    setIsAnimating(true);
    setIsRemoving(true);
    setTimeout(() => {
      setIsAnimating(false);
      setShowConfirm(false);
      onFavoriteToggled(recipe.id);
      // Reset removing state after animation
      setTimeout(() => setIsRemoving(false), 300);
    }, 600);
  };

  const cancelRemove = () => setShowConfirm(false);

  // Detect click outside of confirm box
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (confirmRef.current && !confirmRef.current.contains(event.target)) {
        setShowConfirm(false);
      }
    };

    if (showConfirm) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showConfirm]);

  const HeartButton = () => (
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={handleHeartClick}
        className={`text-red-500 text-xl relative heart-icon transform transition-all duration-300 hover:scale-110 ${
          isAnimating ? 'break-heart' : ''
        } ${justAdded ? 'animate-bounce scale-125' : ''}`}
      >
        <FontAwesomeIcon icon={heartIcon} />
      </button>

      {showConfirm && (
        <div
          ref={confirmRef}
          className="absolute top-8 right-0 bg-white border p-2 shadow-lg rounded-lg z-50 w-56 animate-slideIn"
        >
          <p className="text-sm mb-2">Remove this recipe from your favorites?</p>
          <div className="flex justify-end gap-2">
            <button
              onClick={cancelRemove}
              className="px-2 py-1 text-sm bg-gray-200 rounded hover:bg-gray-300 transform transition-all duration-200 hover:scale-105"
            >
              Cancel
            </button>
            <button
              onClick={confirmRemove}
              className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 transform transition-all duration-200 hover:scale-105"
            >
              Yes, remove
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // List layout
  if (layout === 'list') {
    return (
      <div className={`flex items-center border p-4 rounded-lg bg-white shadow-sm mb-2 relative transform transition-all duration-300 hover:shadow-md hover:scale-[1.02] ${
        isRemoving ? 'animate-fadeOut' : 'animate-fadeIn'
      }`}>
        <Link to={`/recipe/${recipe.slug}`} className="flex-1 flex gap-4 items-center">
          <div className="overflow-hidden rounded-lg">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-24 h-24 object-cover rounded-lg mr-4 transform transition-transform duration-300 hover:scale-110" 
            />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold transform transition-colors duration-200 hover:text-blue-600">{recipe.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{recipe.category}</p>
            <div className="flex items-center justify-between">
              <Rating value={recipe.rating} readOnly cancel={false} />
              <span className="text-sm bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full transform transition-all duration-200 hover:bg-yellow-200">
                {recipe.level}
              </span>
            </div>
          </div>
        </Link>
        <HeartButton />
        <ShareButtons url={`http://localhost:5173/recipe/${recipe.slug}`} />
      </div>
    );
  }

  // Grid layout
  return (
    <div className={`bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 h-full relative transform hover:scale-[1.02] hover:-translate-y-1 ${
      isRemoving ? 'animate-fadeOut' : 'animate-fadeIn'
    }`}>
      <Link to={`/recipe/${recipe.slug}`} className="block hover:opacity-90 transition-opacity duration-300">
        <div className="overflow-hidden">
          <img 
            src={recipe.image} 
            alt={recipe.title} 
            className="w-full h-48 object-cover transform transition-transform duration-300 hover:scale-110" 
          />
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-1 transform transition-colors duration-200 hover:text-blue-600">{recipe.title}</h2>
          <p className="text-gray-500 text-sm mb-2">{recipe.category}</p>
          <div className="flex items-center justify-between">
            <span className="text-yellow-500 font-semibold flex items-center gap-1">
              <span className="animate-pulse">⭐</span> {recipe.rating}
            </span>
            <span
              className={`text-sm px-2 py-1 rounded-full transform transition-all duration-200 hover:scale-105 ${
                recipe.level === 'Easy'
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : recipe.level === 'Medium'
                  ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
              }`}
            >
              {recipe.level}
            </span>
          </div>
        </div>
      </Link>
      <HeartButton />
      <ShareButtons url={`http://localhost:5173/recipe/${recipe.slug}`} />
    </div>
  );
};

export default FavoriteCard;