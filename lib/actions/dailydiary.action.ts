"use server";

import DailyDiary, { IDailyDiaryDoc } from "@/database/dailydiary.model";
import action from "../action";
import handleError from "../errors";
import {
  getDailyDiaryByDateSchema,
  UpdateMeditationSchema,
} from "../validation";
import { UnauthorizedError } from "../http-errors";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function getDailyDiaries(params: {
  date: Date;
  meditationMinutes: number;
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
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      {
        $set: {
          "meditation.minutes": params.meditationMinutes, // Ensure meditation minutes are set
          date: params.date, // Ensure date is set if new
        },
      },
      { new: true, upsert: true }
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
  console.log("Update Meditation Params:", params);
  try {
    const startOfDay = new Date(params.date);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(params.date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const existingDiary = await DailyDiary.findOne({
      userId: user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (!existingDiary) {
      throw new Error("Daily diary not found");
    }
    const totalMeditationMinutes =
      (existingDiary.meditation.minutesCompleted || 0) +
      params.minutesCompleted;
    const completed =
      totalMeditationMinutes >= existingDiary.meditation.minutes;
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
