import { Mood, MOODS_LIST } from "@/constants";

import { Document, model, models, Schema, Types } from "mongoose";

export interface IDailyDiary {
  userId: Types.ObjectId;
  date: Date;
  moodEntries: {
    note?: string;
    mood: Mood;
  };

  journals: [Types.ObjectId];
  meditation: {
    minutes: number;
    minutesCompleted?: number;
    completed: boolean;
  };
  gratitudeEntries: {
    message?: string;
  }[];
}
export interface IDailyDiaryDoc extends IDailyDiary, Document {}
const DailyDiarySchema = new Schema<IDailyDiary>(
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
    journals: [
      {
        type: Schema.Types.ObjectId,
        ref: "JournalEntry",
        required: false,
      },
    ],
    meditation: {
      minutes: { type: Number, required: true, default: 0 },
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

const DailyDiary =
  models?.DailyDiary || model<IDailyDiary>("DailyDiary", DailyDiarySchema);
export default DailyDiary;
