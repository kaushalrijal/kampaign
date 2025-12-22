import { getEnvSMTPConfig } from "@/lib/server/smtp-config";
import renderTemplate from "@/lib/template/render";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
    // get request body
    const body = await req.json()
    const {contacts, htmlOutput, subject,recipientHeader, attachments } = body

    // get environment variables and test
    const env = getEnvSMTPConfig();
    if(!env){
        return NextResponse.json({success: false, message:"SMTP NOT CONFIGURED!"})
    }

    // create transporter
    
    
    
    for(const contact of contacts){
        const eachBody = renderTemplate(htmlOutput, contact);
        const eachSubject = renderTemplate(subject, contact);

        console.log("------")
        console.log('TO: ', contact[recipientHeader])
        console.log('SUBJECT: ', eachSubject)
        console.log('BODY: ', eachBody)
        console.log('FILES: ', attachments)
        console.log("------")

        const sent = await 
    }
    return NextResponse.json({success: "success"})
}