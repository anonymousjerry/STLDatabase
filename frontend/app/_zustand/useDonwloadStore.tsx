import { create } from "zustand";

type DownloadsState = {
  DownloadModels: Set<string>;
  DownloadCounts: Record<string, number>;
  addDownload: (modelId: string, count: number) => void;
  isDownload: (modelId: string) => boolean;
};

export const useDownloadsStore = create<DownloadsState>((set, get) => ({
  DownloadModels: new Set(),
  DownloadCounts: {},

  addDownload: (modelId, count) => {
    const current = new Set(get().DownloadModels);
    const counts = { ...get().DownloadCounts, [modelId]: count};
    current.add(modelId);
    set({ DownloadModels: current, DownloadCounts: counts });
  },

  isDownload: (modelId) => {
    return get().DownloadModels.has(modelId);
  },

}));
