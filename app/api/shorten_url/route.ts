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
  const code = shortener(url);

  await registerUrl(url, code);

  return NextResponse.json({ code });
}
