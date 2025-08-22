"use server";

import DailyDiary, { IDailyDiaryDoc } from "@/database/dailydiary.model";
import action from "../action";
import handleError from "../errors";
import mongoose, { Types } from "mongoose";
import {
  getDailyDiaryByDateSchema,
  UpdateMeditationSchema,
} from "../validation";
import { UnauthorizedError } from "../http-errors";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import User from "@/database/user.model";

export async function getDailyDiariesByDate(params: {
  date: Date;
}): Promise<ActionResponse<{ diary: IDailyDiaryDoc }>> {
  const validationResult = await action({
    params,
    schema: getDailyDiaryByDateSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const dailyDiary = await DailyDiary.findOneAndUpdate(
      {
        userId: user.id,
        date: { $gte: startOfDay, $lte: endOfDay },
      },
      {
        $setOnInsert: {
          userId: user.id,
          date: startOfDay,
        },
      },
      {
        new: true, // return the updated/new document
        upsert: true, // create if not found
      }
    );

    return {
      success: true,
      data: { diary: JSON.parse(JSON.stringify(dailyDiary)) },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateDailyMood(params: {
  date: Date;
  mood: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: getDailyDiaryByDateSchema.extend({
      mood: z.string().min(1, "Mood is required"),
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    await DailyDiary.findOneAndUpdate(
      { userId: user.id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $set: { "moodEntries.mood": params.mood } },
      { new: true, upsert: true }
    );
    revalidatePath(`${user.id}/mood/${params.date}`);

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function addGratitude(params: {
  date: Date;
  message: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: z.object({
      date: z.date(),
      message: z.string().min(1, "Gratitude message is required"),
    }),
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    await DailyDiary.findOneAndUpdate(
      { userId: user.id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $push: { gratitudeEntries: { message: params.message } } },
      { new: true, upsert: true }
    );

    revalidatePath(`${user.id}/mood/${params.date}`);

    return {
      success: true,
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteGratitude(params: {
  date: Date;
  message: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: z.object({
      date: z.date(),
      message: z.string().min(1, "Gratitude message is required"),
    }),
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    await DailyDiary.findOneAndUpdate(
      { userId: user.id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $pull: { gratitudeEntries: { message: params.message } } },
      { new: true }
    );

    revalidatePath(`${user.id}/mood/${params.date}`);

    return {
      success: true,

      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateMeditation(params: {
  date: Date;
  minutesCompleted: number;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateMeditationSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);
    const existingDiary = await DailyDiary.findOne({
      userId: user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    const userGoal = await User.findById(user.id).select(
      "mentalHealthGoals.meditationMinutesPerDay"
    );
    const totalMeditationMinutes = existingDiary
      ? existingDiary.meditation.minutesCompleted + params.minutesCompleted
      : params.minutesCompleted;
    const completed = userGoal >= totalMeditationMinutes;
    await DailyDiary.findOneAndUpdate(
      { userId: user.id, date: { $gte: startOfDay, $lte: endOfDay } },
      {
        $set: {
          "meditation.minutesCompleted": totalMeditationMinutes,
          "meditation.completed": completed,
        },
      },
      { new: true }
    );
    revalidatePath(`${user.id}/mood/${params.date}`);
    return {
      success: true,
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getAllMoodEntries(): Promise<
  ActionResponse<{ moodDate: { mood: string; date: string } }>
> {
  const validationResult = await action({
    schema: z.object({}),
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  try {
    const diaries = await DailyDiary.find({ userId: user.id }).select(
      "moodEntries date"
    );
    const moodEntries = await DailyDiary.aggregate<{
      date: string;
      mood: string | number | null;
    }>([
      { $match: { userId: new Types.ObjectId(user.id) } },
      {
        $project: {
          id: "$_id",
          date: { $dateToString: { date: "$date", format: "%Y-%m-%d" } },
          mood: {
            $ifNull: [
              "$moodEntries.mood",
              { $ifNull: ["$moodEntries.score", null] },
            ],
          },
        },
      },
      { $match: { mood: { $ne: null } } },
    ]);
    return {
      data: {
        moodDate: JSON.parse(JSON.stringify(moodEntries)),
      },
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
