// type for imported data
export type ContactRow = Record<string, string>

export interface FileItem {
  file: File;
  id: string;
  mode: "broadcast" | "personalized";
}

export type Rule = {
  id: string;
  pattern: string;
}