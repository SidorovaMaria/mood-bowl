"use server";

import action from "../action";
import { newJournalEntrySchema } from "../validation";
import handleError from "../errors";
import { UnauthorizedError } from "../http-errors";
import JournalEntry, { IJournalEntryDoc } from "@/database/journalEntry.model";
import DailyDiary from "@/database/dailydiary.model";
import { revalidatePath } from "next/cache";

export async function createJournalEntry(
  params: newJournalEntryParams
): Promise<ActionResponse<{ journal: IJournalEntryDoc }>> {
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
    const { date, title, content, tags, moodAtEntry } = params;
    const journalEntry = await JournalEntry.create({
      userId: user.id,
      date,
      title,
      content,
      tags,
      moodAtEntry,
    });
    await DailyDiary.findOneAndUpdate(
      { userId: user.id, date },
      { $push: { journals: journalEntry._id } },
      { new: true, upsert: true }
    );
    revalidatePath(`${user.id}/mood/${params.date}`);

    return {
      success: true,
      data: {
        journal: JSON.parse(JSON.stringify(journalEntry)),
      },
      status: 201,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
