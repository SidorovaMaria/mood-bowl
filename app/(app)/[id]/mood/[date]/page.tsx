import GradiudeCard from "@/components/main-application/cards/GradiudeCard";
import MeditationCard from "@/components/main-application/cards/MeditationCard";
import MoodCard from "@/components/main-application/cards/MoodCard";
import AddJournalModal from "@/components/main-application/modals/AddJournalModal";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { IJournalEntry, IJournalEntryDoc } from "@/database/journalEntry.model";
import { IUserDoc } from "@/database/user.model";
import { getDailyDiaries } from "@/lib/actions/dailydiary.action";
import { getUser } from "@/lib/actions/user.actions";
import { getRelativeDay, getWeekdayDate } from "@/lib/utils";
import { BookHeart, Leaf } from "lucide-react";

import Image from "next/image";

import React from "react";

const MoodDahboard = async ({ params }: RouteParams) => {
  const { date, id } = await params;
  const {
    success: successUser,
    data,
    error: errorUser,
  } = await getUser({ userId: id });
  if (!successUser || !data) {
    throw new Error(errorUser?.message || "Failed to fetch user data");
  }
  const {
    success,
    data: diaryData,
    error,
  } = await getDailyDiaries({
    date: new Date(date),
    meditationMinutes:
      data.user.mentalHealthGoals?.meditationMinutesPerDay || 0,
  });
  if (!success || !diaryData) {
    throw new Error(error?.message || "Failed to fetch daily diary data");
  }
  const { user } = data as { user: IUserDoc };
  const { diary } = diaryData;
  const journals = diary.journals as unknown as IJournalEntryDoc[];

  console.log("Diary Data:", diary);

  return (
    <div className="-mt-26 relative rounded-b-4xl pt-26">
      <div className="fixed inset-0 overflow-hidden rounded-b-4xl -z-10">
        <div className="absolute inset-0 bg-background-light/50 -z-10" />
        <Image
          src="/images/dark-mood.jpg"
          fill
          priority
          alt="Calm Mood"
          className="object-cover brightness-50 -z-20"
        />
      </div>
      <main className="relative z-10 w-full p-6 text-foreground max-sm:px-4 container lg:max-w-6xl mx-auto">
        {/* User Information */}
        <section className="flex flex-col items-start gap-2">
          <h1 className="text-3xl font-baloo font-bold">Hi, {user.name}!</h1>
          <h2 className="text-sm ">{getWeekdayDate(date)}</h2>
        </section>
        {/* Mood & Gratitude & Meditation */}
        <section className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-3 my-8 gap-4 ">
          <MoodCard mood={diary.moodEntries.mood} />

          {user.mentalHealthGoals?.gratitudeEntriesPerDay !== 0 && (
            <GradiudeCard
              graditutes={diary.gratitudeEntries}
              gradituteGoal={
                user.mentalHealthGoals?.gratitudeEntriesPerDay || 0
              }
            />
          )}
          <div className="md:col-span-2 lg:col-span-1 md:mx-auto lg:mx-0">
            {user.mentalHealthGoals?.meditationMinutesPerDay !== 0 && (
              <MeditationCard
                meditation={diary.meditation}
                goal={user.mentalHealthGoals?.meditationMinutesPerDay || 0}
              />
            )}
          </div>
        </section>
        {/* Journaling */}
        <section className="w-full glass-effect rounded-xl p-4 flex flex-col gap-4">
          <h3 className="text-lg font-bold text-center ">
            <Leaf className="inline mr-2 size-5 fill-primary" />
            Journaling - Let Your Thoughts Breathe
            <Leaf className=" ml-2 inline size-5 fill-primary " />
          </h3>
          <AddJournalModal>
            <ButtonSlide
              text="New Note for You"
              className="w-fit mx-auto text-sm border-primary hover:border-transparent"
              icon={BookHeart}
            />
          </AddJournalModal>
          {journals.length > 0 ? (
            <ul>
              {journals.map((journal) =>
                typeof journal === "object" && journal !== null ? (
                  <li key={String(journal._id)}>{journal.title}</li>
                ) : null
              )}
            </ul>
          ) : (
            <p className="font-baloo font-bold text-lg  text-gradient w-full text-center">
              Today’s journal is still empty — let’s fill it with your
              thoughts..
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default MoodDahboard;
