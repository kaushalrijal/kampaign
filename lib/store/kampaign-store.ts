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
    subject: string;
    htmlOutput: string;

    setContacts: (contacts: Record<string, string>[])=>void;
    setHeaders: (headers: string[])=>void;
    setCampaignName: (name:string) => void;
    setSubject: (subject: string) => void;
    setHtmlOutput: (body: string) => void;
    setAttachments: (attachments: FileItem[] | ((prev: FileItem[]) => FileItem[])) => void;
}

export const useKampaignStore = create<KampaignState>((set) => ({
    campaignName: "",
    contacts: [],
    headers: [],
    subject: "",
    htmlOutput: "",
    attachments: [],

    setContacts: (contacts: Record<string, string>[]) => set({contacts}),
    setHeaders: (headers: string[])=>set({headers}),
    setCampaignName: (name:string) => set({campaignName: name}),
    setSubject: (subject: string) => set({subject}),
    setHtmlOutput: (body: string) => set({htmlOutput: body}),
    setAttachments: (attachments) => 
      set((state) => ({
        attachments: typeof attachments === "function" 
          ? attachments(state.attachments)
          : attachments
      })),
}))