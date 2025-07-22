import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

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
