import shortener from "@/lib/shortener";
import { NextRequest, NextResponse } from "next/server";
import React from "react";

export async function POST(req: NextRequest) {
  const { url } = await req.json();
  const code = shortener(url);
  return NextResponse.json({ code });
}
