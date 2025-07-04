// InstructionsEditor.jsx
import {closestCenter, DndContext, KeyboardSensor, useSensor, useSensors} from "@dnd-kit/core";
import {arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy} from "@dnd-kit/sortable";
import {SortableInstructionRow} from "./SortableInstructionRow.jsx";
import {Button} from "primereact/button";
import MyPointerSensor from "./DnDKitCustomPointer.js";

export const InstructionsEditor = ({recipe, setRecipe}) => {
    const sensors = useSensors(
        useSensor(MyPointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleAddInstruction = () => {
        setRecipe((prev) => {
            const maxId = prev.instructions.length > 0
                ? Math.max(...prev.instructions.map((ins) => ins.id))
                : -1;
            const newId = maxId + 1;
            return {
                ...prev,
                instructions: [
                    ...prev.instructions,
                    {id: newId, name: null, description: ""}
                ]
            };
        });
    };

    const handleInstructionChange = (id, field, value) => {
        const updated = recipe.instructions.map((item) =>
            item.id === id ? {...item, [field]: value} : item
        );
        setRecipe((prev) => ({...prev, instructions: updated}));
    };

    const handleInstructionDelete = (idToDelete) => {
        setRecipe((prev) => ({
            ...prev,
            instructions: prev.instructions.filter((ins) => ins.id !== idToDelete)
        }));
    };

    const handleDragEnd = (event) => {
        const {active, over} = event;
        if (active.id !== over?.id) {
            const oldIndex = recipe.instructions.findIndex((item) => item.id === active.id);
            const newIndex = recipe.instructions.findIndex((item) => item.id === over?.id);
            const reordered = arrayMove(recipe.instructions, oldIndex, newIndex);
            setRecipe((prev) => ({...prev, instructions: reordered}));
        }
    };

    return (
        <div className="border-2 border-gray-600 mx-6 px-5 py-3 rounded-b-2xl flex flex-col gap-y-3">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                    items={recipe.instructions.map((ins) => ins.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="flex flex-col gap-y-3">
                        {recipe.instructions.map((instruction, index) => (
                            <SortableInstructionRow
                                key={instruction.id}
                                instruction={instruction}
                                index={index}
                                onChange={handleInstructionChange}
                                onDelete={handleInstructionDelete}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
            <Button
                onClick={handleAddInstruction}
                className="p-3 flex text-center items-center justify-center w-full border-2 border-dashed rounded-2xl text-gray-300 hover:text-gray-800 transition-all duration-500 ease-in-out"
            >
                <span>Click here to add new instruction</span>
            </Button>
        </div>
    );
};
