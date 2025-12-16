import { create } from "zustand";

interface KampaignState {
    campaignName: string;
    setCampaignName: (name:string) => void;
}

export const useKampaignStore = create<KampaignState>((set) => ({
    campaignName: "",

    setCampaignName: (name:string) => set({campaignName: name}),
}))