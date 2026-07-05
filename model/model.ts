import mongoose from "mongoose";
import { IUrl, urlSchema } from "./schema";

const Url = mongoose.models.Url || mongoose.model<IUrl>("Url", urlSchema);

export default Url;
