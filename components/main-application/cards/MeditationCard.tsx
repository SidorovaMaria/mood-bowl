"use client";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { toast } from "@/components/MyUi/Toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateMeditation } from "@/lib/actions/dailydairy.action";
import { Label, SelectLabel } from "@radix-ui/react-select";
import { NotebookPen, Pause, RefreshCcw, Sparkle } from "lucide-react";
import { set } from "mongoose";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect } from "react";
interface MeditationCardProps {
  meditation: {
    minutes: number;
    minutesCompleted?: number;
    completed: boolean;
  };
  goal: number;
}

const MeditationCard = ({ meditation, goal }: MeditationCardProps) => {
  const { date } = useParams();
  const [selectedDuration, setSelectedDuration] = React.useState(goal);
  const [isActive, setIsActive] = React.useState(false);
  const [timeLeft, setTimeLeft] = React.useState(selectedDuration * 60);
  const progress =
    ((selectedDuration * 60 - timeLeft) / (selectedDuration * 60)) * 100;
  const intervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const handleMeditationUpdate = useCallback(async () => {
    const { success, error } = await updateMeditation({
      date: new Date(date as string),
      minutesCompleted: selectedDuration || 0,
    });

    if (!success) {
      console.error("Failed to update meditation:", error);
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred.",
        type: "error",
      });
    } else {
      toast({
        title: "Meditation updated successfully!",
        type: "success",
      });
    }
  }, [selectedDuration]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleMeditationUpdate();
      setTimeLeft(selectedDuration * 60);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, selectedDuration, handleMeditationUpdate]);

  const startTimer = () => {
    setIsActive(true);
  };
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(selectedDuration * 60);
  };
  const changeDuration = (duration: number) => {
    setSelectedDuration(duration);
    setTimeLeft(duration * 60);
    setIsActive(false);
  };

  return (
    <aside className="glass-effect p-4 rounded-xl  flex flex-col ">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold "> Meditation</h3>
        <p className="gradient-bg-to-br text-white px-4 py-2 rounded-md text-sm font-bold">
          {meditation.minutesCompleted || 0}/{goal} min today
        </p>
      </div>
      <div className="flex flex-col items-center gap-1">
        <div className="text-center w-full">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="var(--color-primary)"
                strokeWidth="8"
                fill="none"
                className=""
              />
              <motion.circle
                cx="64"
                cy="64"
                r="56"
                stroke="var(--color-accent)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={2 * Math.PI * 56}
                strokeLinecap="round"
                animate={{
                  strokeDashoffset: 2 * Math.PI * 56 * (1 - progress / 100),
                }}
                transition={{ duration: 1.1, type: "tween" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white font-baloo">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center my-1  gap-5">
          <AnimatePresence mode="wait" initial={false}>
            {isActive ? (
              <motion.div
                key="pause"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className=""
              >
                <ButtonSlide
                  text="Pause"
                  icon={Pause}
                  slideLeft
                  className="rounded-lg border-foreground/70 hover:border-transparent text-sm py-3!"
                  onClick={() => setIsActive(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key={"start"}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ButtonSlide
                  text="Start"
                  className="rounded-lg border-foreground/70 hover:border-transparent text-sm py-3! "
                  onClick={startTimer}
                  icon={Sparkle}
                />
              </motion.div>
            )}
          </AnimatePresence>
          <ButtonSlide
            text="Reset"
            icon={RefreshCcw}
            slideLeft
            className="rounded-lg text-sm py-3! border-foreground/70 hover:border-transparent "
            onClick={() => resetTimer()}
          />
        </div>
        <div className=" flex items-center justify-center w-[200px] mx-auto">
          <Select
            value={String(selectedDuration)}
            onValueChange={(value) => changeDuration(Number(value))}
          >
            <SelectTrigger className="w-full bg-background-light! font-bold px-3 py-1.5 outline-none border rounded-md border-foreground/70 focus:border-foreground/100  ring-0! focus:bg-gradient-to-b from-accent/20 to-background-light! aria-invalid:border-secondary ">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto bg-gradient-to-b from-background-light to-primary text-foreground border-primary">
              {Array.from({ length: 4 }, (_, i) => (i + 1) * 5).map((value) => (
                <SelectItem
                  key={value}
                  value={String(value)}
                  className="focus:bg-gradient-to-r from-accent/70 to-primary "
                >
                  {value} minutes
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <AnimatePresence>
        {meditation.completed && (
          <motion.div
            key="completed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t mt-4 border-foreground/20 pt-4"
          >
            <div className="text-center">
              <h2 className="text-3xl text-gradient font-bold font-baloo py-2 ">
                <Sparkle className="text-primary fill-accent inline-flex size-7 mr-2" />
                Hooray!{" "}
              </h2>
              <p className="text-foreground text-sm max-w-[80%] mx-auto">
                You have reached your meditation goal for today!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};

export default MeditationCard;

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
};
