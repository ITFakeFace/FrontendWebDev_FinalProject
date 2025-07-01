// 👇 Một hàng sortable
import {defaultAnimateLayoutChanges, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {FloatLabel} from "primereact/floatlabel";
import {InputText} from "primereact/inputtext";
import {InputNumber} from "primereact/inputnumber";
import {Button} from "primereact/button";
import React, {useState} from "react";

export const SortableIngredientRow = React.memo(({ingredient, onChange, onDelete}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: ingredient.id,
        disabled: isEditing && true,
        animateLayoutChanges: args => {
            defaultAnimateLayoutChanges({isSorting: true})
        }
    });

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition
    };

    const handleDeleteClick = () => {
        setIsDeleting(true); // 👈 bắt đầu animation
        setTimeout(() => {
            onDelete(ingredient.id); // 👈 thực sự xóa sau animation
        }, 300); // 👈 delay khớp với `duration-300`
    };

    const onFocus = () => {
        setIsEditing(true);
    }

    const onUnFocus = () => {
        setIsEditing(false);
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group flex flex-row gap-5 items-center p-2 rounded-2xl border-2 border-dashed border-transparent overflow-hidden transition-[opacity,scale] duration-500 ease-in-out  ${isDeleting ? 'opacity-0 scale-95' : 'hover:border-gray-300 cursor-grab'}`}
        >
            <FloatLabel className="grow-8">
                <InputText
                    id={`ingredientName-${ingredient.id}`}
                    value={ingredient.name}
                    onChange={(e) => onChange(ingredient.id, 'name', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    onFocus={onFocus}
                    onBlur={onUnFocus}
                />
                <label htmlFor={`ingredientName-${ingredient.id}`} className="!h-full">Ingredient Name</label>
            </FloatLabel>

            <FloatLabel className="grow-3">
                <InputText
                    id={`ingredientUnit-${ingredient.id}`}
                    value={ingredient.unit}
                    onChange={(e) => onChange(ingredient.id, 'unit', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    disabled={false}
                    onFocus={onFocus}
                    onBlur={onUnFocus}
                />
                <label htmlFor={`ingredientUnit-${ingredient.id}`}>Unit</label>
            </FloatLabel>

            <FloatLabel className="grow-2 flex items-center">
                <InputNumber
                    id={`ingredientQuantity-${ingredient.id}`}
                    value={ingredient.quantity}
                    onValueChange={(e) => onChange(ingredient.id, 'quantity', e.value)}
                    mode="decimal" showButtons min={0}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
                <label htmlFor={`ingredientQuantity-${ingredient.id}`}>Quantity</label>
            </FloatLabel>

            <Button
                className="grow-1 text-gray-300 group-hover:text-red-600 flex items-center justify-center transition-all duration-300 ease-in-out"
                onClick={handleDeleteClick}
            >
                <i className="pi pi-trash text-lg" onClick={handleDeleteClick}/>
            </Button>
        </div>
    );
});
