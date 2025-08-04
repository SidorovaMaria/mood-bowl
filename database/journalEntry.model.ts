import { Mood, MOODS_LIST } from "@/constants";
import { Document, model, models, Schema, Types } from "mongoose";

export interface IJournalEntry {
  userId: Types.ObjectId;
  title: string;
  content: string;
  tags?: string[];
  moodAtEntry?: Mood | null;
}

export interface IJournalEntryDoc extends IJournalEntry, Document {
  createdAt: Date;
  updatedAt: Date;
}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    moodAtEntry: {
      type: String,
      enum: MOODS_LIST,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);
const JournalEntry =
  models?.JournalEntry ||
  model<IJournalEntry>("JournalEntry", JournalEntrySchema);

export default JournalEntry;
