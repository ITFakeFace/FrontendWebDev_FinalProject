// 👇 Editor tổng thể
import {closestCenter, DndContext, KeyboardSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableIngredientRow} from "./SortableIngredientRow";
import {Button} from "primereact/button";
import MyPointerSensor from "./DnDKitCustomPointer.js";

export const IngredientsEditor = ({recipe, setRecipe}) => {
    const sensors = useSensors(
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddIngredient = () => {
        setRecipe((prev) => {
            const maxId = prev.ingredients.length > 0
                ? Math.max(...prev.ingredients.map((ing) => ing.id))
                : -1;
            const newId = maxId + 1;

            return {
                ...prev,
                ingredients: [
                    ...prev.ingredients,
                    {id: newId, name: '', unit: '', quantity: null,}
                ]
            };
        });
    };

    const handleIngredientChange = (id, field, value) => {
        const updated = recipe.ingredients.map((item) =>
            item.id === id ? {...item, [field]: value} : item
        );
        setRecipe((prev) => ({...prev, ingredients: updated}));
    };

    const handleIngredientDelete = (idToDelete) => {
        setRecipe((prev) => ({
            ...prev,
            ingredients: prev.ingredients.filter((ingredient) => ingredient.id !== idToDelete)
        }));
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex = recipe.ingredients.findIndex((item) => item.id === active.id);
            const newIndex = recipe.ingredients.findIndex((item) => item.id === over?.id);
            const reordered = arrayMove(recipe.ingredients, oldIndex, newIndex);
            setRecipe((prev) => ({...prev, ingredients: reordered}));
        }
    };

    return (
        <div className="border-2 border-gray-600 mx-6 px-5 py-3 rounded-b-2xl flex flex-col gap-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={recipe.ingredients.map((ing) => ing.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-y-3">
                        {recipe.ingredients.map((ingredient) => (
                            <SortableIngredientRow
                                key={ingredient.id}
                                id={ingredient.id}
                                ingredient={ingredient}
                                onChange={handleIngredientChange}
                                onDelete={handleIngredientDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Button
                onClick={handleAddIngredient}
                className="p-3 flex text-center items-center justify-center w-full border-2 border-dashed rounded-2xl text-gray-300 hover:text-gray-800 transition-all duration-500 ease-in-out"
            >
                <span>Click here to add new ingredients</span>
            </Button>
        </div>
    );
};
