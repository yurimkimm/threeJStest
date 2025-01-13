import { create } from "zustand";

import PocketBase from "pocketbase";
import { setCurrentStack } from "three/tsl";

export const pb = new PocketBase("http://127.0.0.1:8090");
pb.autoCancellation(false);

export const useConfiguratorStore = create((set) => ({
  categories: [],
  currentCategory: null,
  assets: [],
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    // you can also fetch all records at once via getFullList
    const categories = await pb.collection("CustomizationGroups").getFullList({
      sort: "+position",
    });
    const assets = await pb.collection("CustomizationGroups").getFullList({
      sort: "-created",
    });
    categories.forEach((category) => {
      category.assets = assets.filter((asset) => asset.group === category.id);
    });

    set({ categories, currentCategory: categories[0], assets });
  },
  setCurrentCategory: (category) => set({ currentCategory: category }),
}));
