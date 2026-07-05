import mongoose from "mongoose";

export type IUrl = {
  originalUrl: string;
  code: string;
  clicks: number;
  createdAt: Date;
  updatedAt: Date;
};

export const urlSchema = new mongoose.Schema<IUrl>(
  {
    originalUrl: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);
