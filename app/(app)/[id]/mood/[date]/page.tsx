import GradiudeCard from "@/components/main-application/cards/GradiudeCard";
import MeditationCard from "@/components/main-application/cards/MeditationCard";
import MoodCard from "@/components/main-application/cards/MoodCard";
import { IUserDoc } from "@/database/user.model";
import { getDailyDiaries } from "@/lib/actions/dailydairy.action";
import { getUser } from "@/lib/actions/user.actions";
import { getRelativeDay, getWeekdayDate } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
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
    data: dairyData,
    error,
  } = await getDailyDiaries({
    date: new Date(date),
    meditationMinutes:
      data.user.mentalHealthGoals?.meditationMinutesPerDay || 0,
  });
  if (!success || !dairyData) {
    return <div>Loading...</div>;
  }
  const { user } = data as { user: IUserDoc };
  const { dairy } = dairyData!;
  console.log("Dairy Data:", dairy, user);

  return (
    <main className="-mt-26">
      {/* Mood Log and Date */}
      <div className="relative rounded-b-4xl pt-26">
        <div className="fixed inset-0 overflow-hidden rounded-b-4xl">
          <div className="absolute inset-0 bg-background-light/50 -z-10" />
          <Image
            src="/images/dark-mood.jpg"
            fill
            priority
            alt="Calm Mood"
            className="object-cover brightness-50 -z-20"
          />
        </div>

        {/* Foreground content (sharp, not blurred) */}
        <div className="relative z-10 w-full p-6 text-foreground max-sm:px-4 container lg:max-w-6xl mx-auto">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-3xl font-baloo font-bold">Hi, {user.name}!</h1>
            <h2 className="text-sm ">{getWeekdayDate(date)}</h2>
          </div>
          <div className="grid grid-cols-1 justify-center md:grid-cols-2 lg:grid-cols-[1fr_2fr] my-8 gap-4">
            <MoodCard mood={dairy.moodEntries.mood} />
            <div className="md:ml-auto space-y-4">
              {user.mentalHealthGoals?.gratitudeEntriesPerDay !== 0 && (
                <GradiudeCard
                  graditutes={dairy.gratitudeEntries}
                  gradituteGoal={
                    user.mentalHealthGoals?.gratitudeEntriesPerDay || 0
                  }
                />
              )}
              {user.mentalHealthGoals?.meditationMinutesPerDay !== 0 && (
                <MeditationCard
                  meditation={dairy.meditation}
                  goal={user.mentalHealthGoals?.meditationMinutesPerDay || 0}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MoodDahboard;
