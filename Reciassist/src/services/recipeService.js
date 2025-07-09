import {
    blobToDataURL,
    dataURLtoBlob,
    getImageBlob,
    processEditorContentAndSaveImages,
    replaceImageSrcWithBase64,
    saveImageBlob
} from "../util/imageUtil.js";
import mockRecipes from "./datas/recipies.json";

const STORAGE_KEY = 'mockRecipes';

function loadRecipes() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveRecipes(recipes) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
}

const imageMap = import.meta.glob('/src/assets/**/*.{jpg,jpeg,png}', {
    eager: true,
    import: 'default'
});

async function fetchImageAsBlob(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    return await response.blob();
}

export async function bootstrapRecipes() {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) return;

    const initialized = await Promise.all(
        mockRecipes.map(async (r, i) => {
            let image = r.image;

            if (
                typeof image === 'string' &&
                !image.startsWith('data:') &&
                !image.startsWith('image://')
            ) {
                try {
                    const importedPath = imageMap[`/src${image}`]; // chuyển '/assets/food/...' thành '/src/assets/food/...'

                    if (!importedPath) throw new Error(`Ảnh ${image} không tìm thấy trong imageMap`);

                    const blob = await fetchImageAsBlob(importedPath);
                    const id = crypto.randomUUID();
                    await saveImageBlob(id, blob);
                    image = `image://${id}`;
                } catch (error) {
                    console.error(`❌ Không thể xử lý ảnh ${image}:`, error);
                }
            }

            const description = await processEditorContentAndSaveImages(r.description || "");

            const instructions = await Promise.all(
                (r.instructions || []).map(async (ins) => ({
                    ...ins,
                    description: await processEditorContentAndSaveImages(ins.description || "")
                }))
            );

            return {
                ...r,
                id: i + 1,
                image,
                description,
                instructions,
                status: 1,
            };
        })
    );

    saveRecipes(initialized);
}


export function getAllRawRecipes({onlyActive = false} = {}) {
    const recipes = loadRecipes();
    return onlyActive ? recipes.filter(r => r.status === 1) : recipes;
}

export async function getAllFormattedRecipes({onlyActive = false} = {}) {
    const recipes = loadRecipes();
    const filtered = onlyActive ? recipes.filter(r => r.status === 1) : recipes;

    const result = await Promise.all(
        filtered.map(recipe => fetchFromData(recipe))
    );

    return result;
}

export function getRawRecipeById(id) {
    return loadRecipes().find(r => r.id == id);
}

export async function getFormattedRecipeId(id) {
    var res = loadRecipes().find(r => r.id == id);
    return await fetchFromData(res);
}

export function createRecipe(recipeData) {
    const recipes = loadRecipes();
    const newId = recipes.length > 0 ? Math.max(...recipes.map(r => r.id)) + 1 : 1;

    const newRecipe = {
        ...recipeData,
        id: newId,
        status: 1,
    };

    recipes.push(newRecipe);
    saveRecipes(recipes);
    return newRecipe;
}

export function updateRecipe(id, updatedData) {
    const recipes = loadRecipes();
    const index = recipes.findIndex(r => r.id == id);
    if (index === -1) throw new Error('Recipe not found');

    recipes[index] = {
        ...recipes[index],
        ...updatedData,
    };

    saveRecipes(recipes);
    return recipes[index];
}

export function deleteRecipe(id) {
    let recipes = loadRecipes();
    recipes = recipes.filter(r => r.id !== id);
    saveRecipes(recipes);
}

export function disableRecipe(id) {
    const recipes = loadRecipes();
    const index = recipes.findIndex(r => r.id === id);
    if (index === -1) throw new Error('Recipe not found');

    recipes[index].status = 0;
    saveRecipes(recipes);
    return recipes[index];
}

/**
 * ✅ Giai đoạn lưu trữ (convert base64 → image://id)
 */
export async function fetchToData(recipe) {
    const clone = structuredClone(recipe);

    if (clone.image?.startsWith("data:image")) {
        const blob = dataURLtoBlob(clone.image);
        const id = crypto.randomUUID();
        await saveImageBlob(id, blob);
        clone.image = `image://${id}`;
    }

    clone.description = await processEditorContentAndSaveImages(clone.description || "");

    clone.instructions = await Promise.all(
        (clone.instructions || []).map(async (ins) => ({
            ...ins,
            description: await processEditorContentAndSaveImages(ins.description || "")
        }))
    );

    return clone;
}

/**
 * ✅ Giai đoạn render (convert image://id → base64)
 */
export async function fetchFromData(recipe) {
    const clone = structuredClone(recipe);

    if (clone.image?.startsWith("image://")) {
        const id = clone.image.replace("image://", "");
        const blob = await getImageBlob(id);
        if (blob) {
            clone.image = await blobToDataURL(blob); // ✅ hoặc dùng URL.createObjectURL(blob)
        }
    }

    clone.description = await replaceImageSrcWithBase64(clone.description || "");

    clone.instructions = await Promise.all(
        (clone.instructions || []).map(async (ins) => ({
            ...ins,
            description: await replaceImageSrcWithBase64(ins.description || "")
        }))
    );

    return clone;
}
