import MealItemCard from "@/components/main-application/cards/MealItemCard";
import NutritionChart from "@/components/main-application/charts/NutritionChart";

import { AddFoodDrawer } from "@/components/main-application/drawer/AddFoodDrawer";
import { MealTypeColors } from "@/constants";

import { getFoodItems } from "@/lib/actions/fooitem.action";
import {
  getMealItems,
  getNutritionByDate,
  MealItemWithFoodDetails,
} from "@/lib/actions/mealitem.action";
import { getUser } from "@/lib/actions/user.actions";
import {
  categorizeMeals,
  getPreviosandNextDates,
  getRelativeDay,
  getWeekdayDate,
} from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
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

  const { prevDate, nextDate } = getPreviosandNextDates(date);
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
  const DailyNutrition = [
    { name: "Protein", key: "totalProtein", fill: "var(--color-protein)" },
    { name: "Carbs", key: "totalCarbs", fill: "var(--color-carbs)" },
    { name: "Fats", key: "totalFats", fill: "var(--color-fats)" },
    { name: "Fiber", key: "totalFiber", fill: "var(--color-fiber)" },
    { name: "Sugar", key: "totalSugar", fill: "var(--color-sugar)" },
  ].map(({ name, key, fill }) => ({
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
  console.log("DailyCaloriesbyMealType", DailyCaloriesbyMealType);
  return (
    <main className="max-sm:px-4 container lg:max-w-6xl mx-auto">
      <div className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between max-sm:justify-center gap-2 md:gap-8">
            <div className="flex flex-col items-center max-sm:items-center gap-1">
              <div className="flex items-center w-full justify-between gap-2">
                <Link href={`/${id}/meals/${prevDate}`}>
                  <ChevronLeft className="w-6 h-6 text-foreground/80" />
                </Link>
                <h1 className="text-2xl">{getRelativeDay(new Date(date))}</h1>
                <Link href={`/${id}/meals/${nextDate}`}>
                  <ChevronRight className="w-6 h-6 text-foreground/80" />
                </Link>
              </div>
              <p className="px-1 text-foreground/80 mb-4">
                {getWeekdayDate(new Date(date))}
              </p>
              <AddFoodDrawer data={foodsData?.foodItems} />
              {/* <AddFood data={foodsData?.foodItems} /> */}
            </div>

            <div className=" w-[400px] h-[300px] ">
              <NutritionChart
                nutritionData={DailyNutrition}
                mealBasedKcal={DailyCaloriesbyMealType}
              />
            </div>
          </div>
          <div>
            <DailyDairy date={new Date(date)} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default MealsPage;

const DailyDairy = async ({ date }: { date: Date }) => {
  const { success, data, error } = await getMealItems({
    date: new Date(date),
  });
  if (!success) {
    throw new Error(error?.message || "Failed to fetch meal items");
  }

  const mealTypes = categorizeMeals(data?.foodLogged ?? []);
  console.log("mealTypes", mealTypes);
  return (
    <div>
      {Object.entries(mealTypes).map(([mealType, meals]) => (
        <section className="my-3" key={mealType}>
          <div className="flex items-center justify-between mb-2 max-sm:flex-col max-sm:gap-1">
            <h1 className="text-xl capitalize font-bold">{mealType}</h1>
            <div className="flex items-center gap-2 text-xs font-bold text-foreground text-center">
              <p className=" bg-gradient-to-r from-primary/90 to-accent/90 text-background px-3 py-1 rounded-md ">
                {meals.reduce((acc, item) => acc + (item.calories ?? 0), 0)}{" "}
                Kcal
              </p>
              <p className=" bg-protein/90  px-3 py-1 rounded-md">
                {meals.reduce((acc, item) => acc + (item.protein ?? 0), 0)}g
                Protein
              </p>
              <p className=" bg-fats/90 px-3 py-1 rounded-md">
                {meals.reduce((acc, item) => acc + (item.fats ?? 0), 0)}g Fats
              </p>
              <p className=" bg-carbs/90 px-3 py-1 rounded-md">
                {meals.reduce((acc, item) => acc + (item.carbs ?? 0), 0)}g Carbs
              </p>
            </div>
          </div>
          <div className=" h-[1px] w-full bg-gradient-to-l from-primary to-accent opacity-50" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-4">
            {meals.length > 0 ? (
              meals.map((item: MealItemWithFoodDetails) => (
                <MealItemCard key={String(item._id)} foodItem={item} />
              ))
            ) : (
              <p>No {mealType} logged</p>
            )}
          </div>
        </section>
      ))}
    </div>
  );
};
