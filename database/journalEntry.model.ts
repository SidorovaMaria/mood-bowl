import { Mood, MOODS_LIST } from "@/constants";
import { Document, model, models, Schema, Types } from "mongoose";

export interface IJournalEntry {
  userId: Types.ObjectId;
  date: Date;
  title: string;
  content: string;
  tags?: string[];
  moodAtEntry?: Mood;
}

export interface IJournalEntryDoc extends IJournalEntry, Document {}

const JournalEntrySchema = new Schema<IJournalEntry>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: {
      type: Date,
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
