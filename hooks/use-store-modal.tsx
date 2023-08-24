import { create } from 'zustand'

interface useStoreModalStore {
    isOpen: boolean;
    isLoading: boolean;
    onOpen: () => void;
    onClose: () => void;
    onLoading: () => void;
    onFinished: () => void;
}

export const useStoreModal = create<useStoreModalStore>((set) => ({
    isOpen: false,
    isLoading: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    onLoading: () => set({isLoading: true}),
    onFinished: () => set({isLoading: false}),
}))