import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type LikeState = {
  likedModels: Record<string, boolean>;
  likesCount: Record<string, number>;
  toggleLike: (modelId: string) => void;
  setLikeStatus: (modelId: string, liked: boolean, count: number) => void;
  reset: () => void;
};

const initialState = {
  likedModels: {},
  likesCount: {},
};

export const useLikesStore = create<LikeState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleLike: (modelId: string) =>
        set((state) => {
          const currentLiked = state.likedModels[modelId] ?? false;
          const liked = !currentLiked;
          const currentCount = state.likesCount[modelId] ?? 0;

          return {
            likedModels: { ...state.likedModels, [modelId]: liked },
            likesCount: {
              ...state.likesCount,
              [modelId]: liked ? currentCount + 1 : Math.max(0, currentCount - 1),
            },
          };
        }),

      setLikeStatus: (modelId: string, liked: boolean, count: number) =>
        set((state) => {
          return {
            likedModels: { ...state.likedModels, [modelId]: liked },
            likesCount: { ...state.likesCount, [modelId]: count },
          };
        }),

      reset: () => set(initialState),
    }),
    {
      name: "likes-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        likedModels: state.likedModels,
        likesCount: state.likesCount,
      }),
    }
  )
);
