"use client";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import React from "react";

const MoodBoard = () => {
  return <Calendar components={{ Day: CustomDay }} />;
};

export default MoodBoard;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CustomDay = (props: any) => {
  const date = props.day.date;
  console.log(format(date, "yyyy-MM-dd"));

  return (
    <div
      {...props}
      className="flex items-center justify-center h-10 w-10 rounded-full hover:bg-gray-200 transition"
    ></div>
  );
};
