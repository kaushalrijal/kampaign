import { db } from "./db";
import { CampaignRecord } from "./types";

export async function saveCampaign(record: CampaignRecord) {
  await db.table<CampaignRecord>("campaigns").put(record);
}

export async function getAllCampaigns(): Promise<CampaignRecord[]> {
  return db.table<CampaignRecord>("campaigns")
    .orderBy("createdAt")
    .reverse()
    .toArray();
}

export async function getCampaignById(id: string) {
  return db.table<CampaignRecord>("campaigns").get(id);
}