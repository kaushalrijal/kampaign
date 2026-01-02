export interface CampaignRecord {
  id: string;
  slug: string;
  name: string;
  subject: string;
  totalRecipients: number;
  sentCount: number;
  failedCount: number;
  logFile: string;
  createdAt: number;
  completedAt: number;
}