"use server";

import action from "../action";
import { newJournalEntrySchema, updateJournalEntrySchema } from "../validation";
import handleError from "../errors";
import { UnauthorizedError } from "../http-errors";
import JournalEntry, { IJournalEntryDoc } from "@/database/journalEntry.model";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { format } from "date-fns";

export async function getJournalEntries(params: {
  date: Date;
}): Promise<ActionResponse<{ journalEntries: IJournalEntryDoc[] }>> {
  const validationResult = await action({
    params,
    schema: z.object({
      date: z.preprocess(
        (val) => {
          if (typeof val === "string") return new Date(val);
          return val;
        },
        z.date().refine((date) => !isNaN(date.getTime()), {
          message: "Invalid date format",
        })
      ),
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

    const journalEntries = await JournalEntry.find({
      userId: user.id,
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).lean();

    return {
      success: true,
      data: {
        journalEntries: JSON.parse(JSON.stringify(journalEntries)),
      },
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function createJournalEntry(
  params: newJournalEntryParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: newJournalEntrySchema,
    authorize: true,
  });
  if (!validationResult.session?.user) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  try {
    const { title, content, tags, moodAtEntry } = params;
    const journalEntry = await JournalEntry.create({
      userId: user.id,
      title,
      content,
      tags,
      moodAtEntry,
    });
    revalidatePath(
      `${user.id}/journal/${format(journalEntry.createdAt, "yyyy-MM-dd")}`
    );

    return {
      success: true,
      status: 201,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function updateJournalEntry(
  params: updateJournalEntryParams
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: updateJournalEntrySchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  const { journalId, title, content, tags, moodAtEntry } =
    validationResult.params!;
  try {
    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      journalId,
      {
        title,
        content,
        tags: tags || [],
        moodAtEntry,
        updatedAt: new Date(),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedEntry) {
      throw new Error("Journal entry not found");
    }
    revalidatePath(
      `${user.id}/journal/${format(updatedEntry.createdAt, "yyyy-MM-dd")}`
    );
    return {
      success: true,
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
export async function deleteJournalEntry(params: {
  journalId: string;
}): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: z.object({
      journalId: z.string().min(1, "Jounral Entry Id is required"),
    }),
    authorize: true,
  });
  const { user } = validationResult.session!;
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { journalId } = validationResult.params!;

  try {
    const journalToDelete = await JournalEntry.findOneAndDelete({
      _id: journalId,
    });

    revalidatePath(
      `${user.id}/journal/${format(journalToDelete.createdAt, "yyyy-MM-dd")}`
    );

    return {
      success: true,
      status: 200,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
