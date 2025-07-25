import { Mood, MOODS_LIST } from "@/constants";

import { Document, model, models, Schema, Types } from "mongoose";

export interface IDailyDairy {
  userId: Types.ObjectId;
  date: Date;
  moodEntries: {
    note?: string;
    mood: Mood;
  };

  journal: {
    title?: string;
    content?: string;
    time?: Date;
  };
  meditation: {
    minutes: number;
    minutesCompleted?: number;
    completed: boolean;
  };
  gratitudeEntries: {
    message?: string;
  }[];
}
export interface IDailyDairyDoc extends IDailyDairy, Document {}
const DailyDairySchema = new Schema<IDailyDairy>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    date: { type: Date, required: true, index: true },
    moodEntries: {
      mood: {
        type: String,
        enum: MOODS_LIST,
        default: null,
      },
      note: { type: String, required: false },
    },
    journal: {
      title: { type: String, required: false },
      content: { type: String, required: false },
      time: { type: Date, rquired: false },
    },
    meditation: {
      minutes: { type: Number, required: false },
      minutesCompleted: { type: Number, default: 0 },
      completed: { type: Boolean, default: false },
    },
    gratitudeEntries: [
      {
        message: { type: String, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const DailyDairy =
  models?.DailyDairy || model<IDailyDairy>("DailyDairy", DailyDairySchema);
export default DailyDairy;
