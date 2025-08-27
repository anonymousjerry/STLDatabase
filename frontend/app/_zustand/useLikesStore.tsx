import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type LikeState = {
  likedModels: Record<string, boolean>;
  likesCount: Record<string, number>;
  pendingLikes: Set<string>; // Track optimistic updates
  toggleLike: (modelId: string) => void;
  setLikeStatus: (modelId: string, liked: boolean, count: number) => void;
  clearPendingLikes: () => void;
  reset: () => void;
};

const initialState = {
  likedModels: {},
  likesCount: {},
  pendingLikes: new Set<string>(),
};

export const useLikesStore = create<LikeState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      toggleLike: (modelId: string) =>
        set((state) => {
          const liked = !state.likedModels[modelId];
          const currentCount = state.likesCount[modelId] ?? 0;
          const newPendingLikes = new Set(state.pendingLikes);
          newPendingLikes.add(modelId);

          return {
            likedModels: { ...state.likedModels, [modelId]: liked },
            likesCount: {
              ...state.likesCount,
              [modelId]: liked ? currentCount + 1 : Math.max(0, currentCount - 1),
            },
            pendingLikes: newPendingLikes,
          };
        }),

      setLikeStatus: (modelId: string, liked: boolean, count: number) =>
        set((state) => {
          const newPendingLikes = new Set(state.pendingLikes);
          newPendingLikes.delete(modelId);

          return {
            likedModels: { ...state.likedModels, [modelId]: liked },
            likesCount: { ...state.likesCount, [modelId]: count },
            pendingLikes: newPendingLikes,
          };
        }),

      clearPendingLikes: () =>
        set((state) => ({
          pendingLikes: new Set<string>(),
        })),

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
