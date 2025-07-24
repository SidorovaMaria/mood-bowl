import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";
import { MealItemWithFoodDetails } from "./actions/mealitem.action";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getAgeFromBirthDate = (birthDate: Date | string): number => {
  const date = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }

  return age;
};
export const getFormattedDate = (date: Date | string): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  };
  return d.toLocaleDateString("en-GB", options);
};

export const getWeekdayDate = (date: Date | string): string => {
  const d = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  // Format: Tue, 22 Jul 2025
  return d.toLocaleDateString("en-GB", options).replace(/,/g, ""); // Remove commas for desired format
};
export const getRelativeDay = (
  date: Date | string
): "Yesterday" | "Today" | "Tomorrow" | string | null => {
  const inputDate = new Date(date);
  if (isNaN(inputDate.getTime())) return null;

  const today = new Date();
  inputDate.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.round(
    (inputDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === -1) return "Yesterday";
  if (diffDays === 1) return "Tomorrow";

  return inputDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }); // e.g. "21 Jul 2025"
};

export const getPreviosandNextDates = (
  date: Date | string
): {
  prevDate: string;
  nextDate: string;
} => {
  const inputDate = new Date(date);
  if (isNaN(inputDate.getTime())) return { prevDate: "", nextDate: "" };

  const previousDate = new Date(inputDate);
  previousDate.setDate(previousDate.getDate() - 1);
  const nextDate = new Date(inputDate);
  nextDate.setDate(nextDate.getDate() + 1);

  return {
    prevDate: format(previousDate, "yyyy-MM-dd"),
    nextDate: format(nextDate, "yyyy-MM-dd"),
  };
};

export const categorizeMeals = (mealItems: MealItemWithFoodDetails[]) => {
  return mealItems.reduce(
    (
      acc: { [key: string]: MealItemWithFoodDetails[] },
      item: MealItemWithFoodDetails
    ) => {
      switch (item.mealType) {
        case "breakfast":
          acc.breakfast.push(item);
          break;
        case "lunch":
          acc.lunch.push(item);
          break;
        case "dinner":
          acc.dinner.push(item);
          break;
        case "snack":
          acc.snack.push(item);
          break;
      }
      return acc;
    },
    { breakfast: [], lunch: [], dinner: [], snack: [] } // breakfast, lunch, dinner, snack
  );
};
