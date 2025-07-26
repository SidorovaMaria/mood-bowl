"use server";

import DailyDairy, { IDailyDairyDoc } from "@/database/dailyDairy.mode";
import action from "../action";
import handleError from "../errors";
import {
  getDailyDairyByDateSchema,
  UpdateMeditationSchema,
} from "../validation";
import { UnauthorizedError } from "../http-errors";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { min } from "date-fns";
import { th } from "date-fns/locale";

export async function getDailyDiaries(params: {
  date: Date;
  meditationMinutes: number;
}): Promise<ActionResponse<{ dairy: IDailyDairyDoc }>> {
  const validationResult = await action({
    params,
    schema: getDailyDairyByDateSchema,
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
    const dailyDairy = await DailyDairy.findOneAndUpdate(
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
      data: { dairy: JSON.parse(JSON.stringify(dailyDairy)) },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateDailyMood(params: {
  date: Date;
  mood: string;
}): Promise<ActionResponse<{ dairy: IDailyDairyDoc }>> {
  const validationResult = await action({
    params,
    schema: getDailyDairyByDateSchema.extend({
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
    await DailyDairy.findOneAndUpdate(
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
}): Promise<ActionResponse<{ dairy: IDailyDairyDoc }>> {
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

    const dailyDairy = await DailyDairy.findOneAndUpdate(
      { userId: user.id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $push: { gratitudeEntries: { message: params.message } } },
      { new: true, upsert: true }
    );

    revalidatePath(`${user.id}/mood/${params.date}`);

    return {
      success: true,
      data: { dairy: JSON.parse(JSON.stringify(dailyDairy)) },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteGratitude(params: {
  date: Date;
  message: string;
}): Promise<ActionResponse<{ dairy: IDailyDairyDoc }>> {
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

    const dailyDairy = await DailyDairy.findOneAndUpdate(
      { userId: user.id, date: { $gte: startOfDay, $lte: endOfDay } },
      { $pull: { gratitudeEntries: { message: params.message } } },
      { new: true }
    );

    revalidatePath(`${user.id}/mood/${params.date}`);

    return {
      success: true,
      data: { dairy: JSON.parse(JSON.stringify(dailyDairy)) },
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

    const existingDairy = await DailyDairy.findOne({
      userId: user.id,
      date: { $gte: startOfDay, $lte: endOfDay },
    });
    if (!existingDairy) {
      throw new Error("Daily dairy not found");
    }
    const totalMeditationMinutes =
      (existingDairy.meditation.minutesCompleted || 0) +
      params.minutesCompleted;
    const completed =
      totalMeditationMinutes >= existingDairy.meditation.minutes;
    await DailyDairy.findOneAndUpdate(
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
