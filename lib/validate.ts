import { useKampaignStore } from "./store/kampaign-store";

export type ValidationResult =
  | { ok: true, warnings: string[] }
  | { ok: false; warnings: string[]; errors: string[] };

export const validateContent = (): ValidationResult => {
  const { campaignName, subject, htmlOutput, contacts, recipientHeader, attachments } =
    useKampaignStore.getState();

  const warnings: string[] = [];
  const errors: string[] = [];
  if (!campaignName.trim()) warnings.push("No campaign name.");
  if (!subject.trim()) errors.push("Subject is required.");
  if (!htmlOutput.trim()) warnings.push("No email body.");
  if (!contacts.length) errors.push("At least one contact is required.");
  if (!recipientHeader.length) errors.push("Header with recipient email must be selected!.");
  if (!attachments.every((a) => a.file)) warnings.push("No files attached.");

  return errors.length ? { ok: false, errors, warnings } : { ok: true, warnings };
};