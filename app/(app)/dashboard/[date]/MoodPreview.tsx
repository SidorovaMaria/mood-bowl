import GradiudeCard from "@/components/main-application/cards/GradiudeCard";
import JournalCard from "@/components/main-application/cards/JournalCard";
import MeditationCard from "@/components/main-application/cards/MeditationCard";
import MoodCard from "@/components/main-application/cards/MoodCard";
import AddJournalModal from "@/components/main-application/modals/AddJournalModal";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { IJournalEntryDoc } from "@/database/journalEntry.model";
import { IUserDoc } from "@/database/user.model";
import { getDailyDiariesByDate } from "@/lib/actions/dailydiary.action";
import { getJournalEntries } from "@/lib/actions/journalEntry.action";
import { BookHeart, Leaf } from "lucide-react";
import React from "react";

const MoodPreview = async ({
  date,
  user,
}: {
  date: string;
  user: IUserDoc;
}) => {
  const {
    success,
    data: diaryData,
    error,
  } = await getDailyDiariesByDate({
    date: new Date(date),
  });
  const {
    success: successJournals,
    data: journalsData,
    error: errorJournals,
  } = await getJournalEntries({
    date: new Date(date),
  });
  if (!success || !diaryData) {
    throw new Error(error?.message || "Failed to fetch daily diary data");
  }
  if (!successJournals) {
    throw new Error(
      errorJournals?.message || "Failed to fetch journal entries"
    );
  }

  const { diary } = diaryData;

  const journals = journalsData?.journalEntries || [];
  return (
    <>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
        <MoodCard mood={diary.moodEntries.mood} />

        {user.mentalHealthGoals?.gratitudeEntriesPerDay !== 0 && (
          <GradiudeCard
            graditutes={diary.gratitudeEntries}
            gradituteGoal={user.mentalHealthGoals?.gratitudeEntriesPerDay || 0}
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
      <section className="w-full glass-effect rounded-xl p-4 flex flex-col gap-4">
        <h3 className="text-lg font-bold text-center ">
          <Leaf className="inline mr-2 size-5 fill-primary" />
          Journaling - Let Your Thoughts Breathe
          <Leaf className=" ml-2 inline size-5 fill-primary " />
        </h3>
        <AddJournalModal>
          <ButtonSlide
            text="New Note for You"
            className="w-fit mx-auto text-base font-baloo py-2 rounded-md"
            icon={BookHeart}
          />
        </AddJournalModal>
        {journals && journals.length > 0 ? (
          <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {journals.map((journal: IJournalEntryDoc) => (
              <JournalCard key={String(journal._id)} journal={journal} />
            ))}
          </ul>
        ) : (
          <p className="font-baloo font-bold text-lg  text-gradient w-full text-center">
            Today’s journal is still empty — let’s fill it with your thoughts..
          </p>
        )}
      </section>
    </>
  );
};

export default MoodPreview;
