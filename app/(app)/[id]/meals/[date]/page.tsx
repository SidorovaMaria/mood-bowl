import NutritionChart from "@/components/main-application/charts/NutritionChart";
import { AddFoodDrawer } from "@/components/main-application/drawer/AddFoodDrawer";
import NewFoodForm from "@/components/main-application/forms/newFoodForm";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { getFoodItems } from "@/lib/actions/fooitem.action";
import { getUser } from "@/lib/actions/user.actions";
import { getFormattedDate, getWeekdayDate } from "@/lib/utils";
import { CircleFadingPlus, Plus, Search, UserCircle } from "lucide-react";
import React from "react";

const MealsPage = async ({ params, searchParams }: RouteParams) => {
  const { date, id } = await params;
  const {
    success: successUser,
    data,
    error: errorUser,
  } = await getUser({ userId: id });
  if (!successUser || !data) {
    throw new Error(errorUser?.message || "Failed to fetch user data");
  }
  const { query } = await searchParams;
  const {
    success,
    data: foodsData,
    error,
  } = await getFoodItems({ query: query || "" });
  if (!success) {
    throw new Error(error?.message || "Failed to fetch food items");
  }

  return (
    <main>
      <div className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between max-sm:justify-center gap-10">
            <div className="flex flex-col items-start max-sm:items-center gap-1">
              <h1 className="text-3xl font-bold">Today&apos;s Meals</h1>
              <p className="px-1 text-foreground/80 mb-4">
                {getWeekdayDate(new Date())}{" "}
              </p>
              <AddFoodDrawer data={foodsData?.foodItems} />
            </div>
            <div className="md:flex-1 w-[400px] h-[300px]">
              <NutritionChart />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default MealsPage;
