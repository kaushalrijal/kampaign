import renderTemplate from "@/lib/template/render";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json()
    const {contacts, htmlOutput, subject} = body
    for(const contact of contacts){
        const eachBody = renderTemplate(htmlOutput, contact);
        const eachSubject = renderTemplate(subject, contact);

        console.log("------")
        console.log('SUBJECT: ', eachSubject)
        console.log('BODY: ', eachBody)
        console.log("------")
    }
    return NextResponse.json({success: "success"})
}