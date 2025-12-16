import { create } from "zustand";

interface FileItem {
  file: File;
  id: string;
}

interface KampaignState {
    campaignName: string;
    attachments: FileItem[];
    contacts: Record<string, string>[];
    headers: Array<string>;

    setContacts: (contacts: Record<string, string>[])=>void;
    setHeaders: (headers: string[])=>void;
    setCampaignName: (name:string) => void;
}

export const useKampaignStore = create<KampaignState>((set) => ({
    campaignName: "",
    attachments: [],
    contacts: [],
    headers: [],

    setContacts: (contacts: Record<string, string>[]) => set({contacts}),
    setHeaders: (headers: string[])=>set({headers}),
    setCampaignName: (name:string) => set({campaignName: name}),
}))