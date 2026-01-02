import Dexie from "dexie";

export const db = new Dexie("KampaignDB");

db.version(1).stores({
  campaigns: "id, createdAt, completedAt",
});