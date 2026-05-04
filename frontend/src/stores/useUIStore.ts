import { create } from "zustand";

interface UIStore {
	isLibraryOpen: boolean;
	setIsLibraryOpen: (isOpen: boolean) => void;
	toggleLibrary: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
	isLibraryOpen: false,
	setIsLibraryOpen: (isOpen) => set({ isLibraryOpen: isOpen }),
	toggleLibrary: () => set((state) => ({ isLibraryOpen: !state.isLibraryOpen })),
}));
