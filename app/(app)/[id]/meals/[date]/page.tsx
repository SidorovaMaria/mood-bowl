import { auth } from "@/auth";
import NewFoodForm from "@/components/main-application/forms/newFoodForm";
import { getUser } from "@/lib/actions/user.actions";
import { getFormattedDate, getWeekdayDate } from "@/lib/utils";
import { CircleFadingPlus, UserCircle } from "lucide-react";
import React from "react";

const MealsPage = async ({ params }: RouteParams) => {
  const { date, id } = await params;
  const { success, data, error } = await getUser({ userId: id });
  if (!success || !data) {
    throw new Error(error?.message || "Failed to fetch user data");
  }

  return (
    <main>
      <div className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <h1>Todays Meals</h1>
          <p>{getWeekdayDate(new Date())} </p>
        </div>
        <NewFoodForm />
      </div>
    </main>
  );
};

export default MealsPage;
