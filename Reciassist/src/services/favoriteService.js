const FAVORITE_KEY = 'recipeFavorites';

export const getFavorites = () => {
  const stored = localStorage.getItem(FAVORITE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (recipeId) => {
  const favorites = getFavorites();
  if (!favorites.includes(recipeId)) {
    favorites.push(recipeId);
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (recipeId) => {
  const favorites = getFavorites().filter((id) => id !== recipeId);
  localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
};

export const isFavorite = (recipeId) => {
  return getFavorites().includes(recipeId);
};

export const toggleFavorite = (recipeId) => {
  isFavorite(recipeId) ? removeFavorite(recipeId) : addFavorite(recipeId);
};
