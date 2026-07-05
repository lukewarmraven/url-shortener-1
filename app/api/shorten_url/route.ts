import { connectDB } from "@/lib/db";
import shortener from "@/lib/shortener";
import Url from "@/model/model";
import { NextRequest, NextResponse } from "next/server";

const registerUrl = async (url: string, code: string) => {
  await connectDB();
  await Url.create({
    originalUrl: url,
    code,
  });
};

export async function POST(req: NextRequest) {
  const { url } = await req.json();

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const code = shortener();

  await registerUrl(url, code);

  return NextResponse.json({ code });
}
