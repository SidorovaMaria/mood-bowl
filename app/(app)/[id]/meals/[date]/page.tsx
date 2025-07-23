import NutritionChart from "@/components/main-application/charts/NutritionChart";
import SmallFoodChart from "@/components/main-application/charts/SmallFoodChart";
import { AddFoodDrawer } from "@/components/main-application/drawer/AddFoodDrawer";
import NewFoodForm from "@/components/main-application/forms/newFoodForm";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

import { format, parse } from "date-fns";
import { get } from "http";
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

  const nutrition = [
    {
      name: "Protein",
      value: nutritionData?.nutrition.totalProtein || 0,
      fill: "var(--color-protein)",
    },
    {
      name: "Carbs",
      value: nutritionData?.nutrition.totalCarbs || 0,
      fill: "var(--color-carbs)",
    },
    {
      name: "Fats",
      value: nutritionData?.nutrition.totalFats || 0,
      fill: "var(--color-fats)",
    },
    {
      name: "Fiber",
      value: nutritionData?.nutrition.totalFiber || 0,
      fill: "var(--color-fiber)",
    },
    {
      name: "Sugar",
      value: nutritionData?.nutrition.totalSugar || 0,
      fill: "var(--color-sugar)",
    },
  ];

  return (
    <main>
      <div className="">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between max-sm:justify-center gap-10">
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
            </div>
            <div className=" w-[400px] h-[300px]">
              <NutritionChart nutritionData={nutrition} />
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

  if (!data || data.foodLogged.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[200px]">
        <section className="my-3">
          <h1 className="text-xl">No meals logged for today</h1>
        </section>
      </div>
    );
  }
  const [breakfast, lunch, dinner, snack] = categorizeMeals(data.foodLogged);
  return (
    <div>
      <section className="my-3">
        <h1 className="text-xl">Breakfast</h1>
        <div className=" h-[1px] w-full bg-gradient-to-l from-primary to-accent opacity-50" />
        <div className="grid grid-flow-col-dense mt-4 gap-8">
          {breakfast.length > 0 ? (
            breakfast.map((item: MealItemWithFoodDetails) => (
              <FoodItemCard key={String(item._id)} foodItem={item} />
            ))
          ) : (
            <p>No breakfast logged</p>
          )}
        </div>
      </section>
      <section className="my-3">
        <h1 className="text-xl">Lunch</h1>
        <div className=" h-[1px] w-full bg-gradient-to-l from-primary to-accent opacity-50" />
        <div className="grid grid-flow-col-dense mt-4 gap-8">
          {lunch.length > 0 ? (
            lunch.map((item: MealItemWithFoodDetails) => (
              <FoodItemCard key={String(item._id)} foodItem={item} />
            ))
          ) : (
            <p>No lunch logged</p>
          )}
        </div>
      </section>
      <section className="my-3">
        <h1 className="text-xl">Dinner</h1>
        <div className=" h-[1px] w-full bg-gradient-to-l from-primary to-accent opacity-50" />
        <div className="grid grid-flow-col-dense mt-4 gap-8">
          {dinner.length > 0 ? (
            dinner.map((item: MealItemWithFoodDetails) => (
              <FoodItemCard key={String(item._id)} foodItem={item} />
            ))
          ) : (
            <p>No dinner logged</p>
          )}
        </div>
      </section>
      <section className="my-3">
        <h1 className="text-xl">Snacks</h1>
        <div className=" h-[1px] w-full bg-gradient-to-l from-primary to-accent opacity-50" />
        <div className="grid grid-flow-col-dense mt-4 gap-8">
          {snack.length > 0 ? (
            snack.map((item: MealItemWithFoodDetails) => (
              <FoodItemCard key={String(item._id)} foodItem={item} />
            ))
          ) : (
            <p>No snacks logged</p>
          )}
        </div>
      </section>
    </div>
  );
};

const FoodItemCard = ({ foodItem }: { foodItem: MealItemWithFoodDetails }) => {
  const chartData = [
    {
      name: "Protein",
      value: foodItem.protein || 0,
      fill: "var(--color-protein)",
    },
    { name: "Carbs", value: foodItem.carbs || 0, fill: "var(--color-carbs)" },
    { name: "Fats", value: foodItem.fats || 0, fill: "var(--color-fats)" },
  ];
  return (
    <Popover>
      <PopoverTrigger>
        <div
          className="p-4 bg-gradient-to-br from-accent/80 to-primary/80 rounded-2xl text-background font-bold
    flex flex-col h-full"
        >
          <h2 className="text-base w-full whitespace-nowrap ">
            {foodItem.foodItemId.name}
          </h2>
          <p className="text-xs w-full  text-background/80">
            {foodItem.foodItemId.brand || "Unknown Brand"}
          </p>
          <div className="mx-auto">
            <SmallFoodChart
              stroke
              data={chartData}
              fill={"var(--color-background)"}
              totalKcal={foodItem.calories || 0}
            />
          </div>
        </div>
      </PopoverTrigger>
      <PopoverContent>hi</PopoverContent>
    </Popover>
  );
};
