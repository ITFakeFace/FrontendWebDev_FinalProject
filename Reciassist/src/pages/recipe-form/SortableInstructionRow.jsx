// SortableInstructionRow.jsx
import {defaultAnimateLayoutChanges, useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {InputText} from "primereact/inputtext";
import {Editor} from "primereact/editor";
import {Button} from "primereact/button";
import React, {useState} from "react";

export const SortableInstructionRow = React.memo(({instruction, onChange, onDelete, index}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({
        id: instruction.id,
        disabled: isEditing,
        animateLayoutChanges: args => defaultAnimateLayoutChanges({isSorting: true})
    });

    const onFocus = () => {
        setIsEditing(true);
    }

    const onUnFocus = () => {
        setIsEditing(false);
    }

    const style = {
        transform: transform ? CSS.Transform.toString(transform) : undefined,
        transition
    };

    const handleDeleteClick = () => {
        setIsDeleting(true);
        setTimeout(() => onDelete(instruction.id), 300);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`group flex flex-col gap-2 p-3 rounded-2xl border-2 border-dashed border-transparent overflow-hidden transition-[opacity,scale] duration-500 ease-in-out ${isDeleting ? 'opacity-0 scale-95' : 'hover:border-gray-300 cursor-grab'}`}
        >
            <div className="flex items-center gap-4">
                <span className="font-semibold">Step {index + 1}:</span>
                <InputText
                    id={`instructionName-${instruction.id}`}
                    value={instruction.name || ''}
                    onChange={(e) => onChange(instruction.id, 'name', e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg px-3 py-2"
                    onFocus={onFocus}
                    onBlur={onUnFocus}
                />
                <Button
                    className="text-gray-300 group-hover:text-red-600 transition-all duration-300 px-3"
                    onClick={handleDeleteClick}
                >
                    <i className="pi pi-trash text-lg"/>
                </Button>
            </div>
            <Editor
                id={`instructionDescription-${instruction.id}`}
                value={instruction.description}
                onTextChange={(e) => onChange(instruction.id, 'description', e.htmlValue)}
                style={{minHeight: '150px'}}
                placeholder="Step description..."
                className="p-editor-container"
                onFocus={onFocus}
                onBlur={onUnFocus}
            />
        </div>
    );
});