import { connectDB } from "@/lib/db";
import Url from "@/model/model";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  await connectDB();
  const doc = await Url.findOne({ code });

  if (!doc) {
    return new Response("Not Found", { status: 404 });
  }

  await Url.updateOne(
    { code },
    {
      $inc: { clicks: 1 },
    },
  );

  return Response.redirect(doc.originalUrl, 302);
}
