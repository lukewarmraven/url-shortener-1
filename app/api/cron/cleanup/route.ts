import { connectDB } from "@/lib/db";
import Url from "@/model/model";

export async function GET() {
  await connectDB();

  const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
  const { deletedCount } = await Url.deleteMany({
    createdAt: { $lt: threeDaysAgo },
  });

  return Response.json({ deleted: deletedCount });
}
