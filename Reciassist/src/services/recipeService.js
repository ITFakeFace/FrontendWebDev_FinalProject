const STORAGE_KEY = 'mockRecipes';

// Lấy danh sách từ localStorage
function loadRecipes() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

// Lưu danh sách vào localStorage
function saveRecipes(recipes) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

// Khởi tạo nếu chưa có
export function bootstrapRecipes(mockRecipes = []) {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const initialized = mockRecipes.map((r, i) => ({
      ...r,
      id: i + 1,
      status: 1, // active mặc định
    }));
    saveRecipes(initialized);
  }
}

// Lấy tất cả (optionally filter active)
export function getAllRecipes({ onlyActive = false } = {}) {
  const recipes = loadRecipes();
  return onlyActive ? recipes.filter(r => r.status === 1) : recipes;
}

// Lấy 1 recipe theo id
export function getRecipeById(id) {
  return loadRecipes().find(r => r.id === id);
}

// Tạo mới
export function createRecipe(recipeData, createdByUserId) {
  const recipes = loadRecipes();
  const newId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;

  const newRecipe = {
    ...recipeData,
    id: newId,
    status: 1,
    createdBy: createdByUserId, // thêm user id ở đây
  };

  recipes.push(newRecipe);
  saveRecipes(recipes);
  return newRecipe;
}


// Cập nhật
export function updateRecipe(id, updatedData) {
  const recipes = loadRecipes();
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Recipe not found');

  recipes[index] = {
    ...recipes[index],
    ...updatedData,
  };

  saveRecipes(recipes);
  return recipes[index];
}

// Xoá hoàn toàn (delete vĩnh viễn)
export function deleteRecipe(id) {
  let recipes = loadRecipes();
  recipes = recipes.filter(r => r.id !== id);
  saveRecipes(recipes);
}

// Disable recipe (chuyển status về 0)
export function disableRecipe(id) {
  const recipes = loadRecipes();
  const index = recipes.findIndex(r => r.id === id);
  if (index === -1) throw new Error('Recipe not found');

  recipes[index].status = 0;
  saveRecipes(recipes);
  return recipes[index];
}
