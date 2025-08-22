import MoodCalendar from "@/components/main-application/charts/MoodCalendar";
import { getAllMoodEntries } from "@/lib/actions/dailydiary.action";
import Image from "next/image";
import React from "react";

const MoodDiary = async () => {
  const { success, data } = await getAllMoodEntries();
  if (!success || !data) {
    throw new Error("Failed to fetch mood entries");
  }
  const moodDate = [data.moodDate].flat();
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
        <MoodCalendar moodDateData={moodDate} />
      </main>
    </div>
  );
};

export default MoodDiary;
