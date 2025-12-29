import { create } from "zustand";
import { ContactRow, Rule } from "../types";
import { FileItem } from "../types";


interface KampaignState {
    campaignName: string;
    attachments: FileItem[];
    contacts: ContactRow[];
    headers: Array<string>;
    subject: string;
    htmlOutput: string;
    recipientHeader: string;
    customEnabled: boolean;
    rules: Rule[];

    setContacts: (contacts: ContactRow[])=>void;
    setHeaders: (headers: string[])=>void;
    setCampaignName: (name:string) => void;
    setSubject: (subject: string) => void;
    setHtmlOutput: (body: string) => void;
    setAttachments: (attachments: FileItem[] | ((prev: FileItem[]) => FileItem[])) => void;
    setRecipientHeader: (header: string) => void;
    setCustomEnabled: (enabled: boolean) => void;
    setRules: (rules: Rule[]) => void;
}

export const useKampaignStore = create<KampaignState>((set) => ({
    campaignName: "",
    contacts: [],
    headers: [],
    subject: "",
    htmlOutput: "",
    attachments: [],
    recipientHeader: "",
    customEnabled: false,
    rules: [],

    setContacts: (contacts: ContactRow[]) => set({contacts}),
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
    setRecipientHeader: (header: string) => set({recipientHeader: header}),
    setCustomEnabled: (enabled: boolean) => set({customEnabled: enabled}),
    setRules: (rules: Rule[]) => set({rules}),

}))