import { create } from "zustand"

type LikeState = {
  likedModels: Record<string, boolean>;
  likesCount: Record<string, number>;
  toggleLike: (modelId: string) => void;
};

export const useLikesStore = create<LikeState>((set) => ({
  likedModels: {},
  likesCount: {},
  toggleLike: (modelId) =>
    set((state) => {
      const liked = !state.likedModels[modelId];
      const currentCount = state.likesCount[modelId] ?? 0;

      return {
        likedModels: { ...state.likedModels, [modelId]: liked },
        likesCount: {
          ...state.likesCount,
          [modelId]: liked ? currentCount + 1 : Math.max(0, currentCount - 1),
        },
      };
    }),
}));
