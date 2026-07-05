import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    console.log("DB Connected!");

    return Response.json({ ok: true });
  } catch (error) {
    console.log("DB Failed!");
    return Response.json({ ok: false, error: String(error) }, { status: 500 });
  }
}
