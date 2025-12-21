import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
    console.log("yeehaw")
    const body = await req.json()
    console.log(body)
    return NextResponse.json({success: "success"})
}