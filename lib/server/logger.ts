/*
 * This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
 * If a copy of the MPL was not distributed with this file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
import fs from "fs/promises";
import path from "path";

interface RecipientLogEntry {
  campaignId: string;
  campaignSlug: string;
  recipient: string;
  status: "sent" | "failed";
  attachments: string[];
  error?: string;
  timestamp?: number;
}

const LOG_ROOT = path.join(process.cwd(), "logs", "campaigns");

export async function logRecipientResult(entry: RecipientLogEntry) {
  const {
    campaignSlug,
    campaignId,
    recipient,
    status,
    attachments,
    error,
  } = entry;

  // Ensure log directory exists
  await fs.mkdir(LOG_ROOT, { recursive: true });

  const logFilePath = path.join(LOG_ROOT, `${campaignSlug}.log`);

  const logLine = JSON.stringify({
    campaignId,
    recipient,
    status,
    attachments,
    error,
    timestamp: Date.now(),
  });

  // Append JSONL entry
  await fs.appendFile(logFilePath, logLine + "\n", "utf8");
}