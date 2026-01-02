import Dexie from "dexie";

export const db = new Dexie("Kampaign");

db.version(1).stores({
  campaigns: "id, createdAt, completedAt",
});