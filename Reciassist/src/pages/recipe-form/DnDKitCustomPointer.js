import {PointerSensor} from "@dnd-kit/core";

export default class MyPointerSensor extends PointerSensor {
    static activators = [
        {
            eventName: "onPointerDown",
            handler: ({nativeEvent: event}) => {
                if (
                    !event.isPrimary ||
                    event.button !== 0 ||
                    isInteractiveElement(event.target)
                ) {
                    return false;
                }

                return true;
            },
        },
    ];
}

function isInteractiveElement(element) {
    const interactiveElements = [
        "button",
        "input",
        "textarea",
        "select",
        "option",
    ];

    if (interactiveElements.includes(element.tagName.toLowerCase())) {
        return true;
    }

    // ✅ Nếu là phần tử bên trong PrimeReact Editor
    if (
        element.closest(".p-editor-container") ||
        element.closest(".p-editor-content")
    ) {
        return true;
    }

    return false;
}