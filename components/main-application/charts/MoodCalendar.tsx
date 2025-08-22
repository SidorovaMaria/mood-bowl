"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { set } from "mongoose";
import Image from "next/image";
import React, { useState } from "react";
const MoodCalendar = ({
  moodDateData,
}: {
  moodDateData: { mood: string; date: string }[];
}) => {
  const today = new Date();
  const [monthPicked, setMonthPicked] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const startOfTheMonth = new Date(today.getFullYear(), monthPicked, 1);
  const weekdayOfFirstDay = startOfTheMonth.getDay(); // 0 (Sun) to 6 (Sat)
  const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthOfTheYear = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const currentDays = [];
  const start = new Date(startOfTheMonth);
  //   First visible day on the calendar grid - start with Sunday
  const offset = weekdayOfFirstDay === 0 ? -7 : -weekdayOfFirstDay;
  start.setDate(start.getDate() + offset);
  for (let day = 0; day < 42; day++) {
    const date = new Date(start);
    date.setDate(start.getDate() + day);
    const isoDate = date.toISOString().split("T")[0];
    const moodEntry = moodDateData.find((entry) => entry.date === isoDate);
    currentDays.push({
      currentMonth: date.getMonth() === today.getMonth(),
      date,
      month: date.getMonth(),
      number: date.getDate(),
      weekDay: date.getDay(),
      selected: date.toDateString() === selectedDate.toDateString(),
      year: date.getFullYear(),
      mood: moodEntry?.mood || null,
    });
  }

  return (
    <div className="bg-background-light p-4 rounded-lg shadow-md max-w-[460px] ">
      <div>
        <div className="text-base font-bold font-baloo flex justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setMonthPicked(monthPicked - 1);
                setSelectedDate(
                  new Date(
                    today.getFullYear(),
                    monthPicked - 1,
                    today.getDate()
                  )
                );
              }}
            >
              <ChevronLeft className="size-4 align-middle" />
            </button>
            <p>
              {today.toLocaleDateString(undefined, {
                day: "numeric",
              })}{" "}
              {monthOfTheYear[monthPicked]}
            </p>
            <button
              onClick={() => {
                setMonthPicked(monthPicked + 1);
                setSelectedDate(
                  new Date(
                    today.getFullYear(),
                    monthPicked + 1,
                    today.getDate()
                  )
                );
              }}
            >
              <ChevronRight className="size-4 align-middle" />
            </button>
          </div>
          <p>{today.getFullYear()}</p>{" "}
        </div>
      </div>
      <div id="calendar-body " className=" font-baloo">
        <div
          id="calendar-header"
          className="grid grid-cols-7 py-2 my-1 text-sm font-bold w-full bg-primary/50 rounded-md "
        >
          {daysOfTheWeek.map((day) => (
            <div key={day} className="text-center font-bold">
              {day}
            </div>
          ))}
        </div>
        <div
          id="calendar-table"
          className="grid grid-cols-7 text-sm font-bold w-full"
        >
          {currentDays.map((day, index) => {
            return (
              <div
                key={day.date.toDateString()}
                className={` text-base md:text-lg font-bold flex items-center justify-center overflow-hidden w-[54px] h-[54px] hover:bg-primary/80 rounded-full cursor-pointer
                    ${day.selected ? "bg-primary" : ""}
                `}
              >
                {day.mood ? (
                  <>
                    <Tooltip>
                      <TooltipTrigger className="">
                        <Image
                          src={`/images/moods/${day.mood}.png`}
                          alt={day.mood}
                          width={40}
                          height={40}
                          className="cursor-pointer object-fit mx-auto w-auto! h-auto!"
                        />
                        <TooltipContent
                          className="text-background text-center w-full"
                          style={{
                            backgroundColor: `var(--color-${day.mood})`,
                          }}
                        >
                          <p className="capitalize text-[12px] mb-0.5 font-bold ">
                            {day.mood}
                          </p>
                          <p className="text-[10px]">
                            {daysOfTheWeek[day.weekDay]} {day.number}{" "}
                            {monthOfTheYear[monthPicked]}
                          </p>
                        </TooltipContent>
                      </TooltipTrigger>
                    </Tooltip>
                  </>
                ) : (
                  <p>{day.number}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MoodCalendar;
