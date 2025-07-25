"use server";

import DailyDairy, { IDailyDairyDoc } from "@/database/dailyDairy.mode";
import action from "../action";
import handleError from "../errors";
import { getDailyDairyByDateSchema } from "../validation";
import { UnauthorizedError } from "../http-errors";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function getDailyDiaries(params: {
  date: Date;
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
    const dailyDairy = await DailyDairy.findOne({
      userId: user.id,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (!dailyDairy) {
      const newDailyDairy = new DailyDairy({
        userId: user.id,
        date: params.date,
      });
      await newDailyDairy.save();
      return {
        success: true,
        data: JSON.parse(JSON.stringify(newDailyDairy)),
        status: 200,
      };
    }

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
