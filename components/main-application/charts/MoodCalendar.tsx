"use client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

type MoodCalendarProps = {
  moodDateData: MoodDate[];
  firstDayofTheWeek?: 0 | 1;
};
const formatYYYYMMDD = (d: Date) => {
  //Local Time Format
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
const formatDoWDMM = (d: Date) => {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};
const addSubstractMonths = (d: Date, delta: number) => {
  const copy = new Date(d);
  copy.setMonth(copy.getMonth() + delta, 1);
  return copy;
};
const startOfCalendarGrid = (viewDate: Date, firstDoW: 0 | 1) => {
  const start = new Date(viewDate);
  start.setDate(1);
  const offset = (start.getDay() - firstDoW + 7) % 7; // 0..6
  start.setDate(start.getDate() - offset);
  return start;
};
const weekdayLabels = (firstDow: 0 | 1, locale = undefined) => {
  const base = Array.from({ length: 7 }, (_, i) => (i + firstDow) % 7);
  const fmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
  const jan = new Date(2025, 0, 5); // a Sunday
  return base.map((dow) => {
    const d = new Date(jan);
    d.setDate(jan.getDate() + dow);
    return fmt.format(d);
  });
};
const monthLabel = (d: Date, locale = undefined) =>
  new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(d);

const isSameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const MoodCalendar: React.FC<MoodCalendarProps> = ({
  moodDateData,
  firstDayofTheWeek = 0,
}) => {
  const today = React.useMemo(() => new Date(), []);
  const [viewDate, setViewDate] = React.useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = React.useState<Date>(today);

  // Index moods by local yyyy-MM-dd for O(1) lookup
  const moodMap = React.useMemo(() => {
    const map = new Map<string, string>();
    for (const { date, mood } of moodDateData) map.set(date, mood);
    return map;
  }, [moodDateData]);

  const days = React.useMemo(() => {
    const start = startOfCalendarGrid(viewDate, firstDayofTheWeek);
    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      const inViewMonth = date.getMonth() === viewDate.getMonth();
      const key = formatYYYYMMDD(date);
      const mood = moodMap.get(key) ?? null;
      return {
        date,
        label: date.getDate(),
        inViewMonth,
        isToday: isSameDay(date, today),
        isSelected: isSameDay(date, selectedDate),
        mood,
      };
    });
  }, [viewDate, firstDayofTheWeek, moodMap, selectedDate, today]);

  const weekdayNames = React.useMemo(
    () => weekdayLabels(firstDayofTheWeek),
    [firstDayofTheWeek]
  );
  console.log(days);
  return (
    <div className="bg-background p-4 rounded-lg shadow-md max-w-[460px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 ">
          <button
            type="button"
            aria-label="Previous month"
            onClick={() => setViewDate((d) => addSubstractMonths(d, -1))}
            className="p-1 rounded-md hover:bg-accent"
          >
            <ChevronLeft className="size-4" />
          </button>
          <p className="text-base font-bold font-baloo">
            {monthLabel(viewDate)}
          </p>

          <button
            type="button"
            aria-label="Next month"
            onClick={() => setViewDate((d) => addSubstractMonths(d, 1))}
            className="p-1 rounded-md hover:bg-accent"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <button
          type="button"
          className="text-sm font-baloo font-semibold hover:scale-110 cursor-pointer"
          onClick={() => {
            const d = new Date();
            d.setDate(1);
            setViewDate(d);
            setSelectedDate(new Date());
          }}
        >
          Today
        </button>
      </div>

      <div
        role="grid"
        aria-label={`Calendar for ${monthLabel(viewDate)}`}
        className="font-baloo"
      >
        <div className="grid grid-cols-7 py-2 my-1 text-sm font-bold w-full bg-primary/50 rounded-md">
          {weekdayNames.map((day) => (
            <div key={day} role="columnheader" className="text-center">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-sm font-bold w-full gap-y-1">
          {days.map((day) => {
            const base =
              "relative text-base md:text-lg font-bold flex items-center justify-center overflow-hidden w-[54px] h-[54px] rounded-full focus:outline-none  ring-0! cursor-pointer";
            const inOtherMonth = !day.inViewMonth
              ? "text-muted-foreground/50"
              : "";
            const selected = day.isSelected ? "bg-primary " : "";

            return (
              <div
                key={day.date.getTime()}
                className="flex items-center justify-center"
              >
                {day.mood ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        role="gridcell"
                        aria-selected={day.isSelected}
                        className={`${base} ${selected} `}
                        onClick={() => setSelectedDate(day.date)}
                        title={`${day.mood} – ${formatYYYYMMDD(day.date)}`}
                      >
                        <Image
                          src={`/images/moods/${day.mood}.png`}
                          alt={day.mood}
                          width={40}
                          height={40}
                          className="mx-auto object-contain"
                        />
                        <span className="sr-only">
                          {day.mood} on {formatYYYYMMDD(day.date)}
                        </span>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent
                      className="text-background text-center w-full"
                      style={{ backgroundColor: `var(--color-${day.mood})` }}
                    >
                      <p className="capitalize text-[12px] mb-0.5 font-bold">
                        {day.mood}
                      </p>
                      <p className="text-[10px]">{formatDoWDMM(day.date)}</p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <button
                    type="button"
                    role="gridcell"
                    aria-selected={day.isSelected}
                    onClick={() => setSelectedDate(day.date)}
                    className={`${base} ${inOtherMonth} ${selected}  hover:bg-primary/80`}
                  >
                    {day.label}
                  </button>
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
