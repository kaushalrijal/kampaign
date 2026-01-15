export interface CampaignRecord {
  id: string;
  slug: string;
  name: string;
  subject: string;
  senderEmail?: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  logFile: string;
  createdAt: number;
  completedAt: number;
  htmlOutput?: string;
  attachments?: CampaignAttachment[];
  attachmentRules?: CampaignAttachmentRule[];
}

export interface CampaignAttachment {
  id: string;
  fileName: string;
  bytes: number;
  type: "broadcast" | "personalized";
  rule?: string;
}

export interface CampaignAttachmentRule {
  id: string;
  rule: string;
}
