import { create } from "zustand"

type FavoritesState = {
  favoriteModels: Set<string>;
  addFavorite: (modelId: string) => void;
  removeFavorite: (modelId: string) => void;
  isFavorite: (modelId: string) => boolean;
};

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteModels: new Set(),

  addFavorite: (modelId) => {
    const current = new Set(get().favoriteModels);
    current.add(modelId);
    set({ favoriteModels: current });
  },

  removeFavorite: (modelId) => {
    const current = new Set(get().favoriteModels);
    current.delete(modelId);
    set({ favoriteModels: current });
  },

  isFavorite: (modelId) => {
    return get().favoriteModels.has(modelId);
  },
}));
