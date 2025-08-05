import { IUserDoc } from "@/database/user.model";
import { getUser, getUserPreferences } from "@/lib/actions/user.actions";
import {
  getPreviosandNextDates,
  getRelativeDay,
  getTimeOfDay,
  getWeekdayDate,
} from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";

import { ChevronLeftCircle, ChevronRightCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import MoodPreview from "./MoodPreview";
import NutritionChart from "@/components/main-application/charts/NutritionChart";
import FoodPreview from "./FoodPreview";
import DayPicker from "@/components/MyUi/DayPicker";
import { auth } from "@/auth";

const DashBoard = async ({ params, searchParams }: RouteParams) => {
  const { date } = await params;
  const { query } = await searchParams;
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  const {
    success: successUser,
    data,
    error: errorUser,
  } = await getUser({ userId: session.user.id });
  if (!successUser || !data) {
    throw new Error(errorUser?.message || "Failed to fetch user data");
  }
  const { user } = data as { user: IUserDoc };
  const { prevDate, nextDate } = getPreviosandNextDates(date);
  const dayTime = getTimeOfDay();
  const {
    success,
    data: UserPreference,
    error,
  } = await getUserPreferences({
    userId: session.user.id,
  });
  if (!success || !UserPreference) {
    throw new Error("Preferences were not etted up");
  }

  return (
    <div className="-mt-26 relative rounded-b-4xl pt-26">
      <div className="fixed inset-0 overflow-hidden rounded-b-4xl -z-10">
        <div className="absolute inset-0 bg-background-light/50 -z-10" />
        <Image
          src="/images/dark-dashboard.jpg"
          fill
          priority
          alt="Calm Mood"
          className="object-cover brightness-50 -z-20"
        />
      </div>
      <main className="relative z-10 w-full p-6 text-foreground max-sm:px-4 container lg:max-w-6xl mx-auto">
        <div className="flex flex-col items-center w-full gap-2">
          <h1 className="text-[26px] font-bold capitalize">
            Good {dayTime}, {user.name}!
          </h1>

          <div className="flex items-center w-full justify-center gap-4">
            <Link href={`/${session.user.id}/dashboard/${prevDate}`}>
              <ChevronLeftCircle className="w-5 h-5 text-foreground/80" />
            </Link>
            <h1 className="text-2xl">
              <DayPicker>{getRelativeDay(new Date(date))}</DayPicker>
            </h1>
            <Link href={`/${session.user.id}/dashboard/${nextDate}`}>
              <ChevronRightCircle className="w-5 h-5 text-foreground/80" />
            </Link>
          </div>
          <p className=" text-foreground/80 w-full text-center">
            {getWeekdayDate(new Date(date))}
          </p>
        </div>
        <div className="space-y-12">
          {UserPreference.trackMeals && (
            <div>
              <h1 className="text-2xl font-baloo font-bold ">Tracking Meals</h1>
              <section>
                <FoodPreview date={date} query={query} dayTime={dayTime} />
              </section>
            </div>
          )}

          {UserPreference.trackMood && (
            <div>
              <h1 className="text-2xl font-baloo font-bold ">Tracking Mood</h1>
              <section className="flex flex-col gap-8 my-6">
                <MoodPreview user={user} date={date} />
              </section>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashBoard;
