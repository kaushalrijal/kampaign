import { getEnvSMTPConfig } from "@/lib/server/smtp-config";
import renderTemplate from "@/lib/template/render";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import path from "path";
import fs from "fs/promises";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  // parse form data
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
    campaignName
  } = JSON.parse(payloadRaw);

  const broadcastMeta = attachments.filter((a: any) => a.mode === "broadcast");

  const personalizedMeta = attachments.filter(
    (a: any) => a.mode === "personalized"
  );

  const files = formData.getAll("attachments") as File[];

  // get environment variables and test
  const env = getEnvSMTPConfig();
  if (!env) {
    return NextResponse.json(
      {
        success: false,
        message: "SMTP NOT CONFIGURED!",
      },
      { status: 400 }
    );
  }

  //  create temporary path
  const tempPath = path.join(process.cwd(), "tmp", crypto.randomUUID());
  await fs.mkdir(tempPath, { recursive: true });

  const fileMap = new Map<string, string>();

  for (const file of files) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(tempPath, `${crypto.randomUUID()}-${file.name}`);

    await fs.writeFile(filePath, buffer);

    fileMap.set(file.name, filePath);
  }

  // resolve broadcast attachments
  const broadcastAttachments = broadcastMeta
    .map((meta: any) => {
      const filePath = fileMap.get(meta.name);
      if (!filePath) return null;

      return {
        filename: meta.name,
        path: filePath,
      };
    })
    .filter(Boolean);

  console.log(broadcastAttachments);

  // create uuid for database
  const campaignId = crypto.randomUUID();
  const campaignSlug = `${slugify(campaignName)}-${campaignId.slice(0, 8)}`;
  
  // create transporter
  const transporter = await nodemailer.createTransport({
    host: env.HOST,
    port: env.PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: env.USER,
      pass: env.APP_PASSWORD,
    },
  });


  // MAINLOOP: Send email to each user in contacts
  for (const contact of contacts) {
    // render body and subject
    const eachBody = renderTemplate(htmlOutput, contact);
    const eachSubject = renderTemplate(subject, contact);

    // attach personalized attachments if any for each user
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

    console.log("------");
    console.log("TO: ", contact[recipientHeader]);
    console.log("SUBJECT: ", eachSubject);
    console.log("BODY: ", eachBody);
    console.log("FILES: ", attachmentsToSend);
    console.log("------");

    const sent = await transporter.sendMail({
      from: env.USER,
      to: contact[recipientHeader],
      subject: eachSubject,
      html: eachBody,
      attachments: attachmentsToSend,
    });

    console.log("Message Sent: ", sent.messageId);
  }

  await fs.rm(tempPath, { recursive: true, force: true });
  return NextResponse.json({ success: "success" });
}
