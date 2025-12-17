import { getEnvSMTPConfig } from "@/lib/server/smtp-config";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function GET() {
  const params = getEnvSMTPConfig();

  if (!params) {
    return NextResponse.json({
      success: false,
      message: "SMTP NOT CONFIGURED!",
    });
  }

  const transporter = await nodemailer.createTransport({
    host: params.HOST,
    port: params.PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: params.USER,
      pass: params.APP_PASSWORD,
    },
  });
  
  const res = await transporter.verify();
  console.log(res)

  return NextResponse.json({ success: true, message: "SMTP IS WORKING" });
}
