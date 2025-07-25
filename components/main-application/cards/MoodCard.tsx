"use client";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { getRandomMoodResponse } from "@/lib/utils";
import { NotebookPen } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import SelectMoodModal from "../modals/SelectMoodModal";

const MoodCard = ({ mood }: { mood: string }) => {
  const [response, setResponse] = useState("");

  useEffect(() => {
    setResponse(getRandomMoodResponse(mood));
  }, [mood]);
  return (
    <>
      <aside className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-[2px] rounded-3xl shadow-2xl border border-white/10 w-full  p-4 ">
        {" "}
        <h1 className="text-1xl font-bold mb-3 px-2 ">Today&apos;s Mood</h1>
        {mood ? (
          <div className="flex flex-col items-center justify-between">
            <Image
              src={`/images/moods/${mood}.png`}
              alt={mood}
              width={150}
              height={150}
              className="rounded-full my-4"
            />

            <div className="flex gap-4 items-center">
              <h2 className="text-lg capitalize font-bold">{mood}</h2>
              <SelectMoodModal>
                <p className="cursor-pointer group ">
                  <NotebookPen className="text-foreground/70 size-6 group-hover:text-accent " />
                </p>
              </SelectMoodModal>
            </div>
            <p className="text-base font-bold italic text-center py-2 lg:px-6 ">
              - &ldquo;{response}&rdquo;
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-between">
            <div className="w-32 h-32 relative mb-4">
              <div className="w-full h-full bg-foreground/10 rounded-full flex items-center justify-center">
                <p className="text-foreground/50 text-sm text-center">
                  No mood selected today
                </p>
              </div>
            </div>

            <SelectMoodModal>
              <ButtonSlide
                text="Log Your Mood"
                icon={NotebookPen}
                className="text-base font-baloo py-2"
              />
            </SelectMoodModal>
          </div>
        )}
      </aside>
    </>
  );
};

export default MoodCard;
