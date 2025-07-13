import {useNavigate, useParams} from "react-router-dom";
import {useUserStore} from "../../context/AuthContext";
import {Panel} from "primereact/panel";
// import { InputText } from "primereact/inputtext";
import {useEffect, useRef, useState} from "react";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import {dataURLtoBlob, processEditorContentAndSaveImages, saveImageBlob} from "../../util/imageUtil";
import {IngredientsEditor} from "./IngredientEditor";
import {Calendar} from "primereact/calendar";
import {Rating} from "primereact/rating";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFire} from "@fortawesome/free-solid-svg-icons";
import {FileUpload} from "primereact/fileupload";
import {InstructionsEditor} from "./InstructionEditor.jsx";
import {MultiSelect} from "primereact/multiselect";
import {useToast} from "../../context/ToastStore.js";
import {classNames} from "primereact/utils";
import {createRecipe, getFormattedRecipeId, updateRecipe} from "../../services/recipeService.js";

const RecipeFormPage = () => {
    const {user} = useUserStore();

    let emptyRecipe = {
        id: null,
        name: "",
        description: "",
        image: null,
        accessTime: 0,
        ingredients: [],
        cookingTime: null,
        categories: [],
        servings: null,
        difficulty: null,
        status: 1,
        createBy: null,
        ratingScore: 0,
        instructions: [],
        nutrition: {
            calories: 0,
            carbohydrates: 0,
            fat: 0,
            protein: 0,
        },
        ratings: [],
        comments: [],
    };

    let emptyIngredient = {
        id: null,
        name: "",
        unit: "",
        quantity: null,
    };

    let emptyInstruction = {
        id: null,
        name: null,
        description: "",
    };

    let categories = [
        // meal time
        "Breakfast", "Brunch", "Lunch", "Dinner", "Supper", "Snack", "Dessert",
        // food type
        "Savory", "Sweet", "Soup", "Drink", "Dessert", "Fried", "Grilled", "Steamed", "Raw", "Baked", "Vegetarian", "Vegan", "Spicy", "Cold", "Hot", "Cake",
    ];

    const {id} = useParams();
    const [recipe, setRecipe] = useState(emptyRecipe);
    const basicInfoPanelRef = useRef(null);
    const nutritionInfoPanelRef = useRef(null);
    const ingredientsInfoPanelRef = useRef(null);
    const instructionsInfoPanelRef = useRef(null);
    const descriptionEditorRef = useRef(null);
    const {showToast} = useToast();
    const navigate = useNavigate();

    const PANEL_TRANSITIONS = {
        toggleable: {
            enterFromClass: 'max-h-0',
            enterActiveClass: 'overflow-hidden transition-all duration-500 ease-in-out',
            enterToClass: 'max-h-40	',
            leaveFromClass: 'max-h-40',
            leaveActiveClass: 'overflow-hidden transition-all duration-500 ease-in',
            leaveToClass: 'max-h-0'
        }
    };

    const TailwindPanel = {
        panel: {
            header: ({props}) => ({
                className: classNames(
                    'flex items-center justify-between', // flex and alignments
                    'border border-gray-300 bg-gray-100 text-gray-700 rounded-tl-lg rounded-tr-lg', // borders and colors
                    'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80', // Dark mode
                    {'p-5': !props.toggleable, 'py-3 px-5': props.toggleable} // condition
                )
            }),
            title: 'leading-none font-bold',
            toggler: {
                className: classNames(
                    'inline-flex items-center justify-center overflow-hidden relative no-underline', // alignments
                    'w-8 h-8 text-white dark:text-gray-900 border-0 bg-transparent rounded-full transition duration-200 ease-in-out', // widths, borders, and transitions
                    'hover:text-gray-900 hover:border-transparent hover:bg-gray-200 dark:hover:text-white/80 dark:hover:bg-gray-800/80 dark:focus:shadow-[inset_0_0_0_0.2rem_rgba(147,197,253,0.5)]', // hover
                    'focus:outline-none focus:outline-offset-0 focus:shadow-[0_0_0_0.2rem_rgba(191,219,254,1)]' // focus
                )
            },
            togglerIcon: 'inline-block',
            content: {
                className: classNames(
                    'bg-white text-gray-700 border-t-0 last:rounded-br-lg last:rounded-bl-lg bg-transparent',
                    'dark:bg-gray-900 dark:border-blue-900/40 dark:text-white/80' // Dark mode
                )
            },
            transition: PANEL_TRANSITIONS.toggleable
        }
    }

    const onRecipeChangeProps = (value, field) => {
        setRecipe(prev => ({
            ...prev,
            [field]: value
        }));
        setInvalid(`recipe-${field}`, false);
    }

    const onNutritionChangeProps = (value, field) => {
        setRecipe(prev => ({
            ...prev,
            nutrition: {
                ...prev.nutrition,
                [field]: value
            }
        }));
    };

    const onSelectRecipeImage = (e) => {
        const file = e.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            setRecipe((prev) => ({
                ...prev,
                image: event.target.result, // Lưu base64 vào recipe.image
            }));
        };
        reader.readAsDataURL(file);
    };

    const basicInfoPanelHeader = (option) => {
        return (
            <div className="bg-gray-600 flex flex-row justify-between rounded-full">
                <div className="left-box py-3 px-5 flex flex-row gap-5">
                    <span className="text-white text-xl font-semibold">Basic Information</span>
                </div>
                <div className="right-box py-3 px-5 flex flex-row gap-5">
          <span className="text-white flex items-center">
            {option.togglerElement}
          </span>
                </div>
            </div>
        );
    }

    const nutritionInfoPanelHeader = (option) => {
        return (
            <div className="bg-gray-600 flex flex-row justify-between rounded-full">
                <div className="left-box py-3 px-5 flex flex-row gap-5">
                    <span className="text-white text-xl font-semibold">Nutrition Details</span>
                </div>
                <div className="right-box py-3 px-5 flex flex-row gap-5">
          <span className="text-white flex items-center">
            {option.togglerElement}
          </span>
                </div>
            </div>
        );
    }

    const ingredientsInfoPanelHeader = (option) => {
        return (
            <div className="bg-gray-600 flex flex-row justify-between rounded-full">
                <div className="left-box py-3 px-5 flex flex-row gap-5">
                    <span className="text-white text-xl font-semibold">Ingredients</span>
                </div>
                <div className="right-box py-3 px-5 flex flex-row gap-5">
          <span className="text-white flex items-center">
            {option.togglerElement}
          </span>
                </div>
            </div>
        );
    }

    const instructionsInfoPanelHeader = (option) => {
        return (
            <div className="bg-gray-600 flex flex-row justify-between rounded-full">
                <div className="left-box py-3 px-5 flex flex-row gap-5">
                    <span className="text-white text-xl font-semibold">Instructions</span>
                </div>
                <div className="right-box py-3 px-5 flex flex-row gap-5">
          <span className="text-white flex items-center">
            {option.togglerElement}
          </span>
                </div>
            </div>
        );
    }

    const setInvalid = (elementOrId, isInvalid = true) => {
        const el = typeof elementOrId === "string" ? document.getElementById(elementOrId) : elementOrId;

        if (!el || !el.classList) {
            console.warn("setInvalid: element not found or invalid", elementOrId);
            return;
        }

        if (isInvalid) {
            el.classList.add("p-invalid");
        } else {
            el.classList.remove("p-invalid");
        }
    };

    const validateRecipe = () => {
        let isValid = true;

        // 🔹 Validate Name
        if (!recipe.name || recipe.name.trim() === "") {
            setInvalid("recipe-name", true);
            isValid = false;
        } else {
            setInvalid("recipe-name", false);
        }

        // 🔹 Validate Image
        if (!recipe.image) {
            setInvalid("recipe-image", true);
            isValid = false;
        } else {
            setInvalid("recipe-image", false);
        }

        // 🔹 Validate Categories
        if (!recipe.categories || recipe.categories.length === 0) {
            setInvalid("recipe-categories", true);
            isValid = false;
        } else {
            setInvalid("recipe-categories", false);
        }

        // 🔹 Validate Servings
        if (!recipe.cookingTime || recipe.cookingTime === "") {
            setInvalid("recipe-cookingTime", true);
            isValid = false;
        } else {
            setInvalid("recipe-cookingTime", false);
        }

        // 🔹 Validate Servings
        if (!recipe.servings || recipe.servings < 1) {
            setInvalid("recipe-servings", true);
            isValid = false;
        } else {
            setInvalid("recipe-servings", false);
        }

        // 🔹 Validate Difficulty
        if (recipe.difficulty == null || recipe.difficulty === 0) {
            setInvalid("recipe-difficulty", true);
            isValid = false;
        } else {
            setInvalid("recipe-difficulty", false);
        }

        // 🔹 Validate Description
        if (!recipe.description || recipe.description.trim() === "") {
            setInvalid("recipe-description", true);
            isValid = false;
        } else {
            setInvalid("recipe-description", false);
        }

        // 🔹 Validate Ingredients
        if (!recipe.ingredients || recipe.ingredients.length === 0) {
            setInvalid("ingredient-section", true);
            isValid = false;
        } else {
            const hasInvalid = recipe.ingredients.some(
                (ing) => !ing.name || !ing.unit || ing.quantity == null
            );
            setInvalid("ingredient-section", hasInvalid);
            if (hasInvalid) isValid = false;
        }

        // 🔹 Validate Instructions
        if (!recipe.instructions || recipe.instructions.length === 0) {
            setInvalid("instruction-section", true);
            isValid = false;
        } else {
            const hasInvalid = recipe.instructions.some(
                (ins) => !ins.description || ins.description.trim() === ""
            );
            setInvalid("instruction-section", hasInvalid);
            if (hasInvalid) isValid = false;
        }

        return isValid;
    };


    const saveRecipe = async () => {
        if (!validateRecipe()) {
            showToast("Please input required information!", "warn");
            return;
        }

        const _recipe = {...recipe};

        // ✅ Xử lý description (base64 -> image://id)
        _recipe.description = await processEditorContentAndSaveImages(_recipe.description || '');

        // ✅ Xử lý instructions
        _recipe.instructions = await Promise.all(
            (_recipe.instructions || []).map(async (ins) => ({
                ...ins,
                description: await processEditorContentAndSaveImages(ins.description || ''),
            }))
        );

        // ✅ Xử lý image chính nếu là base64
        if (_recipe.image?.startsWith("data:image")) {
            const blob = dataURLtoBlob(_recipe.image);
            const id = crypto.randomUUID();
            await saveImageBlob(id, blob);
            _recipe.image = `image://${id}`; // 👉 lưu lâu dài
        }

        _recipe.createBy = user.id;

        if (id != null) {
            updateRecipe(id, _recipe);
        } else {
            createRecipe(_recipe);
        }

        console.log("Recipe (original):", recipe);
        console.log("Recipe (processed):", _recipe);
        showToast("Success", "success");

        // TODO: Gửi lên server nếu cần
    };

    const loadRecipe = async (id) => {
        const rawRecipe = await getFormattedRecipeId(id);

        if (!rawRecipe) {
            console.warn("❌ Không tìm thấy recipe id:", id);
            return;
        }

        // Kiểm tra quyền truy cập
        setTimeout(() => {
            console.log(rawRecipe.createBy != user.id)
        }, 3000);
        if (user && rawRecipe.createBy != user.id) {
            showToast("You don't have permission to access this recipe", "warn");

            if (window.history.length > 1) {
                // navigate(-1);
            } else {
                // navigate("/recipies");
            }

            return;
        }

        const hydratedRecipe = {
            ...rawRecipe,
            cookingTime: rawRecipe.cookingTime ? new Date(rawRecipe.cookingTime) : null,
        };

        setRecipe(hydratedRecipe);
    };


    useEffect(() => {
        if (user == null) {
            navigate("/");
            showToast("Please Login to use this feature", "warn")
        }
    }, []);

    useEffect(() => {
        if (id != null) {
            loadRecipe(id);
        }
    }, []);

    return (
        <div className="container">
            <div className="flex flex-col gap-3 w-full border-0 mt-5">
                <Panel ref={basicInfoPanelRef} headerTemplate={basicInfoPanelHeader} toggleable className="w-full"
                       pt={TailwindPanel.panel}
                >
                    <div className="border-2 border-gray-600 mx-6 px-5 py-3 rounded-b-2xl flex flex-col gap-y-3">
                        <div className="flex w-full items-center">
                            <div className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Name:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <InputText
                                    id="recipe-name"
                                    value={recipe.name}
                                    onChange={(e) => onRecipeChangeProps(e.target.value, "name")}
                                    className="w-full !border-1 rounded-lg pl-3"
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Image:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <FileUpload
                                    mode="basic"
                                    accept="image/*"
                                    maxFileSize={5 * 1024 * 1024}
                                    onSelect={onSelectRecipeImage}
                                    auto
                                    chooseOptions={{
                                        className: "text-gray-600 hover:text-white bg-transparent hover:bg-gray-600 border-2 border-gray-600 w-fit px-10 py-2 rounded-2xl cursor-pointer "
                                    }}
                                />
                                {recipe.image && (
                                    <div className="mt-2 max-w-xs">
                                        <RecipeImagePreview imageBlob={recipe.image}/>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div
                                className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Categories:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <MultiSelect
                                    id="recipe-categories"
                                    value={recipe.categories}
                                    onChange={(e) => onRecipeChangeProps(e.value, "categories")}
                                    options={categories}
                                    filter placeholder="Select Categories"
                                    className="w-full md:w-20rem !border-1 rounded-lg pl-3 px-5 py-1 bg-transparent"
                                    pt={{
                                        item: {
                                            className: "flex flex-row gap-3 px-3 py-1 text-gray-800 dark:text-gray-300 bg-transparent dark:bg-gray-800"
                                        },
                                        checkbox: {
                                            box: {
                                                className: "border-1 border-gray-800",
                                            },
                                        },
                                        filterContainer: {
                                            className: "flex flex-row items-center justify-center gap-3 px-3 py-1 text-gray-800 dark:text-gray-300 bg-transparent dark:bg-gray-800 border-2 border-gray-800 dark:border-gray-300 rounded-lg"
                                        },
                                        filterIcon: {
                                            className: "hidden"
                                        },
                                        headerCheckbox: {
                                            className: "text-gray-800 dark:text-gray-300 bg-transparent dark:bg-gray-800 border-1 border-gray-800 rounded-lg"
                                        },
                                        headerCheckboxContainer: {
                                            className: "border-1 border-gray-800 rounded-lg"
                                        },
                                        header: {
                                            className: "flex flex-row gap-3 px-3 py-1 text-gray-800 dark:text-gray-300 bg-transparent dark:bg-gray-800 h-full"
                                        },
                                        emptyMessage: {
                                            className: "bg-transparent dark:bg-gray-800 text-gray-800 dark:text-gray-300 p-5"
                                        },
                                    }}
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Cooking
                                Time:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <Calendar
                                    id="recipe-cookingTime"
                                    value={recipe.cookingTime}
                                    onChange={(e) => onRecipeChangeProps(e.target.value, "cookingTime")}
                                    showIcon
                                    timeOnly icon={() => <i className="pi pi-clock"/>}
                                    className="w-full !border-1 rounded-lg pl-3 !text-lg px-5 py-1"
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Servings
                                (People/Meal):
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <InputNumber
                                    id="recipe-servings"
                                    value={recipe.servings}
                                    onChange={(e) => onRecipeChangeProps(e.value, "servings")}
                                    showButtons
                                    min={1} className="w-full !border-1 rounded-lg pl-3"
                                />
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div
                                className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Difficulty:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <Rating
                                    id="recipe-difficulty"
                                    value={recipe.difficulty}
                                    onChange={(e) => onRecipeChangeProps(e.value, "difficulty")}
                                    cancel={false}
                                    onIcon={<FontAwesomeIcon icon={faFire} size={"lg"} className="text-red-400"/>}
                                    offIcon={<FontAwesomeIcon icon={faFire} size={"lg"}/>}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <div className="text-lg font-semibold mb-2">Description:</div>
                            <div className="text-lg">
                                <Editor
                                    id="recipe-description"
                                    ref={descriptionEditorRef}
                                    value={recipe.description}
                                    onTextChange={(e) => {
                                        setRecipe((prev) => ({...prev, description: e.htmlValue}))
                                        setInvalid("recipe-description", false);
                                    }}
                                    style={{
                                        minHeight: 320,
                                    }}
                                    placeholder="Mô tả công thức (có thể chèn ảnh)..."
                                />
                            </div>
                        </div>
                    </div>
                </Panel>
                <Panel ref={nutritionInfoPanelRef} headerTemplate={nutritionInfoPanelHeader} toggleable
                       className="w-full" pt={TailwindPanel.panel}>
                    <div className="border-2 border-gray-600 mx-6 px-5 py-3 rounded-b-2xl flex flex-col gap-y-3">
                        <div className="flex w-full items-center">
                            <div
                                className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Calories:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <InputNumber value={recipe.nutrition.calories}
                                             onChange={(e) => onNutritionChangeProps(e.value, "calories")} min={0}
                                             mode={"decimal"} showButtons={true}
                                             className="w-full !border-1 rounded-lg pl-3"/>
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div
                                className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Carbonhydrates:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <InputNumber value={recipe.nutrition.carbohydrates}
                                             onChange={(e) => onNutritionChangeProps(e.value, "carbohydrates")} min={0}
                                             mode={"decimal"} showButtons={true}
                                             className="w-full !border-1 rounded-lg pl-3"/>
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Fat:</div>
                            <div className="flex-grow-10 text-lg">
                                <InputNumber value={recipe.nutrition.fat}
                                             onChange={(e) => onNutritionChangeProps(e.value, "fat")} min={0}
                                             mode={"decimal"} showButtons={true}
                                             className="w-full !border-1 rounded-lg pl-3"/>
                            </div>
                        </div>
                        <div className="flex w-full items-center">
                            <div className="w-full lg:max-w-1/5 max-w-4/15 flex-grow-2 text-lg font-semibold">Protein:
                            </div>
                            <div className="flex-grow-10 text-lg">
                                <InputNumber value={recipe.nutrition.protein}
                                             onChange={(e) => onNutritionChangeProps(e.value, "protein")} min={0}
                                             mode={"decimal"} showButtons={true}
                                             className="w-full !border-1 rounded-lg pl-3"/>
                            </div>
                        </div>
                    </div>
                </Panel>
                <Panel ref={ingredientsInfoPanelRef} headerTemplate={ingredientsInfoPanelHeader} toggleable
                       className="w-full" pt={TailwindPanel.panel}>
                    <IngredientsEditor
                        recipe={recipe}
                        setRecipe={setRecipe}
                    />
                </Panel>
                <Panel ref={instructionsInfoPanelRef} headerTemplate={instructionsInfoPanelHeader} toggleable
                       className="w-full" pt={TailwindPanel.panel}>
                    <InstructionsEditor
                        recipe={recipe}
                        setRecipe={setRecipe}
                    />
                </Panel>
                <div className="flex flex-row justify-center gap-10 mb-10">
                    <Button
                        onClick={() => saveRecipe()}
                        className="bg-gray-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl shadow-md transition duration-300 border-none"
                    >
                        {id == null ? "Create new Recipe" : "Update Recipe"}
                    </Button>

                    <Button
                        onClick={() => navigate(-1)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-2xl shadow-md transition duration-300 border border-gray-400"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </div>
    );
}
const RecipeImagePreview = ({imageBlob}) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        if (imageBlob instanceof Blob) {
            const url = URL.createObjectURL(imageBlob);
            setImageUrl(url);

            return () => {
                URL.revokeObjectURL(url); // ✅ Xóa khi unmount
            };
        } else if (typeof imageBlob === 'string') {
            setImageUrl(imageBlob); // base64 hoặc blob:url
        }
    }, [imageBlob]);

    if (!imageUrl) return null;

    return (
        <img
            id="recipe-image-preview"
            src={imageUrl}
            alt="Recipe preview"
            className="rounded-lg border shadow-md max-w-xs"
        />
    );
};
export default RecipeFormPage;