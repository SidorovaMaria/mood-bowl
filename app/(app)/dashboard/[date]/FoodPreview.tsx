import MealItemCard from "@/components/main-application/cards/MealItemCard";
import NutritionChart from "@/components/main-application/charts/NutritionChart";
import AddFood from "@/components/main-application/drawer/AddFood";

import { DailyNutritionInfo, MealTypeColors } from "@/constants";

import {
  getMealItems,
  getNutritionByDate,
} from "@/lib/actions/mealitem.action";
import { AlertCircleIcon } from "lucide-react";
import React from "react";

const FoodPreview = async ({
  date,
  query,
  dayTime,
}: {
  date: string;
  query: string;
  dayTime: "morning" | "evening" | "afternoon";
}) => {
  const {
    success: nutritionSuccess,
    data: nutritionData,
    error: nutritionError,
  } = await getNutritionByDate({ date: new Date(date) });
  if (!nutritionSuccess) {
    throw new Error(
      nutritionError?.message || "Failed to fetch nutrition data"
    );
  }
  const DailyNutrition = DailyNutritionInfo.map(({ name, key, fill }) => ({
    name,
    value: nutritionData?.nutrition[key] || 0,
    fill,
  }));
  const DailyCaloriesbyMealType = Array.isArray(nutritionData?.kcalbyMealType)
    ? nutritionData.kcalbyMealType.map((item) => ({
        name: item._id,
        value: item.totalCalories,
        fill: MealTypeColors[item._id as keyof typeof MealTypeColors], // Assuming meal types are named as 'breakfast', 'lunch', 'dinner', 'snack'
      }))
    : [];
  const { success, data, error } = await getMealItems({
    date: new Date(date),
  });
  if (!success) {
    throw new Error("No meal found" + error);
  }
  const { foodLogged } = data!;
  const recentLogs =
    [...foodLogged]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 3) || [];
  console.log(recentLogs, "recent");

  return (
    <div className="flex flex-col lg:flex-row items-center justify-between ">
      <div className="flex items-center justify-center flex-col w-fit ">
        <div className=" w-[400px] h-[300px] ">
          <NutritionChart
            nutritionData={DailyNutrition}
            mealBasedKcal={DailyCaloriesbyMealType}
          />
        </div>
        <div className="-mt-5">
          <AddFood query={query} />
        </div>
      </div>
      {recentLogs && (
        <div className="space-y-4">
          <h2 className="font-bold text-2xl text-right">Recent Logs</h2>
          {recentLogs.length > 0 ? (
            <div className="flex gap-2 items-center">
              {recentLogs.map((item) => (
                <MealItemCard foodItem={item} key={String(item._id)} />
              ))}
            </div>
          ) : (
            <div className="text-right  text-foreground/80 ">
              <h3 className="font-medium ">No food logged yet</h3>
              <p className="text-sm mt-2">
                {dayTime === "morning"
                  ? "Start with breakfast!"
                  : dayTime === "afternoon"
                  ? "Time for lunch?"
                  : "What's for dinner?"}
              </p>
              {new Date(date).getDay() !== new Date().getDay() && (
                <p className="text-red-400/80 my-4 ">
                  <AlertCircleIcon className="inline size-5 mr-1" /> Check the
                  date!
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FoodPreview;
