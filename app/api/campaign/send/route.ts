import { getEnvSMTPConfig } from "@/lib/server/smtp-config";
import renderTemplate from "@/lib/template/render";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

  const { contacts, htmlOutput, subject, recipientHeader } = JSON.parse(payloadRaw);

  const files = formData.getAll("attachments") as File[];

  // get environment variables and test
  const env = getEnvSMTPConfig();
  if (!env) {
    return NextResponse.json({
      success: false,
      message: "SMTP NOT CONFIGURED!",
    }, {status: 400});
  }

//   // create transporter
//   const transporter = await nodemailer.createTransport({
//     host: env.HOST,
//     port: env.PORT,
//     secure: false, // true for 465, false for other ports
//     auth: {
//       user: env.USER,
//       pass: env.APP_PASSWORD,
//     },
//   });

  for (const contact of contacts) {
    const eachBody = renderTemplate(htmlOutput, contact);
    const eachSubject = renderTemplate(subject, contact);

    console.log("------");
    console.log("TO: ", contact[recipientHeader]);
    console.log("SUBJECT: ", eachSubject);
    console.log("BODY: ", eachBody);
    console.log("FILES: ", files);
    console.log("------");

    // const sent = await transporter.sendMail({
    //   from: env.USER,
    //   to: contact[recipientHeader],
    //   subject: eachSubject,
    //   html: eachBody,
    // });

    // console.log("Message Sent: ", sent.messageId);
  }

  console.log(files);
  return NextResponse.json({ success: "success" });
}
