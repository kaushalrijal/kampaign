import { useKampaignStore } from "./store/kampaign-store";
import type { ContactRow, FileItem } from "./types";

export type ValidationResult =
  | { ok: true, warnings: string[] }
  | { ok: false; warnings: string[]; errors: string[] };

export type ValidationInput = {
  campaignName: string;
  subject: string;
  htmlOutput: string;
  contacts: ContactRow[];
  recipientHeader: string;
  attachments: FileItem[];
};

export const validateContent = (input?: ValidationInput): ValidationResult => {
  const state = useKampaignStore.getState();
  const {
    campaignName,
    subject,
    htmlOutput,
    contacts,
    recipientHeader,
    attachments,
  } = input ?? state;

  const warnings: string[] = [];
  const errors: string[] = [];
  if (!campaignName.trim()) warnings.push("No campaign name.");
  if (!subject.trim()) errors.push("Subject is required.");
  if (!htmlOutput.trim()) warnings.push("No email body.");
  if (!contacts.length) errors.push("At least one contact is required.");
  if (!recipientHeader.length) errors.push("Header with recipient email must be selected!.");
  if (!attachments.length) warnings.push("No files attached.");
  else if (!attachments.every((a) => a.file))
    warnings.push("Some attachments are missing files.");

  return errors.length ? { ok: false, errors, warnings } : { ok: true, warnings };
};