"use client";
import React, { ReactNode, useState } from "react";
import { Calendar } from "../ui/calendar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { usePathname, useRouter } from "next/navigation";
import { format, parse } from "date-fns";

const DayPicker = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const pathDate = pathname.split("/").pop();
  const initialPath = pathname.split("/").slice(0, -1).join("/");
  const initialDate =
    pathDate && /^\d{4}-\d{2}-\d{2}$/.test(pathDate)
      ? parse(pathDate, "yyyy-MM-dd", new Date())
      : new Date();

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const handleDateSelect = (newDate: Date | undefined) => {
    if (!newDate) return;
    setDate(newDate);
    setShowDatePicker(false);
    const formattedDate = format(newDate, "yyyy-MM-dd");
    const newUrl = `${initialPath}/${formattedDate}`; // Use the root prop
    router.push(newUrl);
  };

  return (
    <Popover open={showDatePicker} onOpenChange={setShowDatePicker}>
      <PopoverTrigger className="cursor-pointer">{children}</PopoverTrigger>
      <PopoverContent
        className="w-auto overflow-hidden p-0 z-100"
        align="center"
      >
        <Calendar
          mode="single"
          selected={date}
          captionLayout="dropdown"
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DayPicker;
