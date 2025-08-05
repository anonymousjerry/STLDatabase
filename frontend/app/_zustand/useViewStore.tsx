import { create } from "zustand";

type ViewsState = {
  ViewModels: Set<string>;
  ViewCounts: Record<string, number>;
  addView: (modelId: string, count: number) => void;
  isView: (modelId: string) => boolean;
};

export const useViewsStore = create<ViewsState>((set, get) => ({
  ViewModels: new Set(),
  ViewCounts: {},

  addView: (modelId, count) => {
    const current = new Set(get().ViewModels);
    const counts = { ...get().ViewCounts, [modelId]: count};
    current.add(modelId);
    set({ ViewModels: current, ViewCounts: counts });
  },

  isView: (modelId) => {
    return get().ViewModels.has(modelId);
  },
}));
