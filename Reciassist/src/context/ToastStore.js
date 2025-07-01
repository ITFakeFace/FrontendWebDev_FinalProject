// toastStore.js
import {create} from 'zustand';

export const useToast = create((set, get) => ({
    toastRef: null,

    setToastRef: (ref) => set({toastRef: ref}),

    showToast: (message, severity = 'info', position = 'top-right', life = 3000) => {
        const {toastRef} = get();
        if (!toastRef) return;

        toastRef.current?.show({
            severity,
            summary: '',
            detail: message,
            life,
            group: position,
        });
    },
}));
