import { getEnvSMTPConfig } from "@/lib/server/smtp-config";
import renderTemplate from "@/lib/template/render";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs/promises";
import { slugify } from "@/lib/utils";
import { logRecipientResult } from "@/lib/server/logger";

export async function POST(req: Request) {
  const formData = await req.formData();

  const payloadRaw = formData.get("payload");
  if (!payloadRaw || typeof payloadRaw !== "string") {
    return NextResponse.json(
      { success: false, message: "Invalid payload" },
      { status: 400 }
    );
  }

  const {
    contacts,
    htmlOutput,
    subject,
    recipientHeader,
    customEnabled,
    rules,
    attachments,
    campaignName,
  } = JSON.parse(payloadRaw);

  const campaignId = crypto.randomUUID();
  const campaignSlug = `${slugify(campaignName)}-${campaignId.slice(0, 8)}`;

  const broadcastMeta = attachments.filter((a: any) => a.mode === "broadcast");

  const files = formData.getAll("attachments") as File[];

  const env = getEnvSMTPConfig();
  if (!env) {
    return NextResponse.json(
      { success: false, message: "SMTP NOT CONFIGURED!" },
      { status: 400 }
    );
  }

  // Create temp directory
  const tempPath = path.join(process.cwd(), "tmp", crypto.randomUUID());
  await fs.mkdir(tempPath, { recursive: true });

  // Write files to disk and map names → paths
  const fileMap = new Map<string, string>();

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tempPath, `${crypto.randomUUID()}-${file.name}`);
    await fs.writeFile(filePath, buffer);
    fileMap.set(file.name, filePath);
  }

  // Resolve broadcast attachments
  const broadcastAttachments = broadcastMeta
    .map((meta: any) => {
      const filePath = fileMap.get(meta.name);
      if (!filePath) return null;
      return { filename: meta.name, path: filePath };
    })
    .filter(Boolean) as { filename: string; path: string }[];

  const transporter = nodemailer.createTransport({
    host: env.HOST,
    port: env.PORT,
    secure: false,
    auth: {
      user: env.USER,
      pass: env.APP_PASSWORD,
    },
  });

  let sentCount = 0;
  let failedCount = 0;

  // ======================
  // MAIN SEND LOOP
  // ======================
  for (const contact of contacts) {
    const recipient = contact[recipientHeader];

    const eachBody = renderTemplate(htmlOutput, contact);
    const eachSubject = renderTemplate(subject, contact);

    let attachmentsToSend = [...broadcastAttachments];

    if (customEnabled) {
      for (const rule of rules) {
        const expectedName = renderTemplate(rule.pattern, contact);
        const filePath = fileMap.get(expectedName);

        if (filePath) {
          attachmentsToSend.push({
            filename: expectedName,
            path: filePath,
          });
        }
      }
    }

    try {
      const info = await transporter.sendMail({
        from: env.USER,
        to: recipient,
        subject: eachSubject,
        html: eachBody,
        attachments: attachmentsToSend,
      });

      if (info.rejected.includes(recipient)) {
        failedCount++;

        await logRecipientResult({
          campaignId,
          campaignSlug,
          recipient,
          status: "failed",
          attachments: attachmentsToSend.map(a => a.filename),
          error: info.response,
        });
      } else {
        sentCount++;

        await logRecipientResult({
          campaignId,
          campaignSlug,
          recipient,
          status: "sent",
          attachments: attachmentsToSend.map(a => a.filename),
        });
      }
    } catch (err: any) {
      failedCount++;

      await logRecipientResult({
        campaignId,
        campaignSlug,
        recipient,
        status: "failed",
        attachments: attachmentsToSend.map(a => a.filename),
        error: err?.message ?? "Unknown error",
      });
    }
  }

  await fs.rm(tempPath, { recursive: true, force: true });

  return NextResponse.json({
    success: true,
    campaignId,
    campaignSlug,
    sentCount,
    failedCount,
    completedAt: Date.now(),
    logFile: `logs/campaigns/${campaignSlug}.log`,
    senderEmail: env.USER,
  });
}