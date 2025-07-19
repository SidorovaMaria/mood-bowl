"use client";
import { useOnboarding } from "@/context/OnboardingContext";
import { IUserDoc } from "@/database/user.model";
import { ArrowRight, NotebookPen, User2 } from "lucide-react";
import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Arrow } from "@radix-ui/react-popover";

const CompletedReview = ({ user }: { user: IUserDoc }) => {
  const { data, setData } = useOnboarding();
  console.log("Onboarding Data:", data);
  console.log("User Data:", user);
  return (
    <aside className="space-y-4 w-full text-center max-w-md mx-auto max-sm:px-10  md:min-w-2xl ">
      <div className="">
        <h2 className="text-2xl font-bold leading-relaxed">
          Hi, {user.name}! <br />
          You’re all set — let’s take a look!
        </h2>
        <p className="text-sm text-foreground/80 mt-1 max-w-md mx-auto">
          Here’s what you’ve told us so far. If anything looks off, you can go
          back and edit — otherwise, we’re ready to roll!
        </p>
      </div>
      <div className="grid grid-cols md:grid-cols-2 gap-x-6 gap-y-3 w-full">
        <section className="flex flex-col items-start w-full border  rounded-xl border-accent">
          <div className="w-full py-2 border-b relative items- overflow-hidden">
            <h3 className="text-left pl-3">About You & Preferences</h3>
            <Button
              variant={"ghost"}
              asChild
              className="absolute top-0 overflow-hidden"
            >
              <Link
                href="/onboarding/1"
                className="text-sm flex items-center gap-2 h-full right-0 rounded-br-none! bg-transparent hover:bg-accent/80 transition-colors "
              >
                <NotebookPen className="size-3" />
                <p>Edit</p>
              </Link>
            </Button>
          </div>
          <ul className="flex flex-col w-full gap-2 p-3 pb-1">
            <li className="flex items-center justify-between ">
              <span className="text-sm">Date of Birth</span>
              <span className="text-sm px-2 rounded-md text-accent bg-background-light">
                {data.birthDate?.toLocaleDateString()}
              </span>
            </li>{" "}
            <li className="flex items-center justify-between">
              <span className="text-sm">Sex at Birth</span>
              <span className="text-sm px-2 rounded-md text-accent bg-background-light capitalize">
                {data.sex}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm">Track Mood?</span>
              <span
                className={`text-sm px-2 rounded-md ${
                  data?.preference?.trackMood ? "text-accent" : "text-primary"
                } bg-background-light capitalize`}
              >
                {data?.preference?.trackMood ? "Yes" : "No"}
              </span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-sm">Track Meals?</span>
              <span
                className={`text-sm px-2 rounded-md ${
                  data?.preference?.trackMeals ? "text-accent" : "text-primary"
                } bg-background-light capitalize`}
              >
                {data?.preference?.trackMeals ? "Yes" : "No"}
              </span>
            </li>
          </ul>
        </section>
        {data?.preference?.trackMood && (
          <section className="flex flex-col items-start w-full border  rounded-xl border-accent">
            <div className="w-full py-2 border-b relative overflow-hidden">
              <h3 className="text-left pl-3">Mental Health Goals</h3>
              <Button
                variant={"ghost"}
                asChild
                className="absolute top-0 overflow-hidden"
              >
                <Link
                  href="/onboarding/2"
                  className="text-sm flex items-center gap-2 h-full right-0 rounded-br-none! bg-transparent hover:bg-accent/80 transition-colors "
                >
                  <NotebookPen className="size-3" />
                  <p>Edit</p>
                </Link>
              </Button>
            </div>
            <ul className="flex flex-col w-full gap-2 p-3 ">
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Daily meditation:</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light">
                  {data.mentalHealthGoals &&
                  data.mentalHealthGoals.meditationMinutesPerDay !== 0
                    ? data.mentalHealthGoals.meditationMinutesPerDay +
                      " minutes"
                    : "Not set"}
                </span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Journaling:</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light capitalize">
                  {data.mentalHealthGoals?.journalingFrequency}
                </span>
              </li>
              {data.mentalHealthGoals?.journalingFrequency === "monthly" && (
                <li className="flex items-center justify-between ">
                  <span className="text-sm capitalize">Journaling Day:</span>
                  <span className="px-2 text-sm rounded-md text-accent bg-background-light ">
                    {data.mentalHealthGoals?.journalingDayOfTheMonth}
                    {data.mentalHealthGoals?.journalingDayOfTheMonth === 1
                      ? "st"
                      : data.mentalHealthGoals?.journalingDayOfTheMonth === 2
                      ? "nd"
                      : data.mentalHealthGoals?.journalingDayOfTheMonth === 3
                      ? "rd"
                      : "th"}
                  </span>
                </li>
              )}
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Gratitudes per day:</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light">
                  {data.mentalHealthGoals &&
                  data.mentalHealthGoals.gratitudeEntriesPerDay !== 0
                    ? data.mentalHealthGoals.gratitudeEntriesPerDay
                    : "Not set"}
                </span>
              </li>
            </ul>
          </section>
        )}
        {data?.preference?.trackMeals && (
          <section className="flex flex-col items-start w-3/4 mx-auto border  rounded-xl border-accent col-span-2">
            <div className="w-full py-2 border-b relative overflow-hidden">
              <h3 className="text-left pl-3">
                Your Diet & Daily Energy Needs{" "}
              </h3>
              <Button
                variant={"ghost"}
                asChild
                className="absolute top-0 overflow-hidden"
              >
                <Link
                  href="/onboarding/3"
                  className="text-sm flex items-center gap-2 h-full right-0 rounded-br-none! bg-transparent hover:bg-accent/80 transition-colors "
                >
                  <NotebookPen className="size-3" />
                  <p>Edit</p>
                </Link>
              </Button>
            </div>
            <ul className="flex flex-col w-full gap-2 p-3 pb-1">
              <li className="flex items-center justify-between ">
                <span className=" text-sm capitalize">Current Weight</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light ">
                  {data.fitnessGoals?.currentWeightKg} kg
                </span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Target weight</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light ">
                  {data.fitnessGoals?.targetWeightKg} kg
                </span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Height</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light ">
                  {data.fitnessGoals?.heightCm} cm
                </span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">
                  Goal of the meal tracking
                </span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light capitalize">
                  {data.fitnessGoals?.goal}
                </span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Nutrition type</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light capitalize">
                  {data.fitnessGoals?.dietType}
                </span>
              </li>
              <li className="flex items-center justify-between ">
                <span className="text-sm capitalize">Activity mode</span>
                <span className="px-2 text-sm rounded-md text-accent bg-background-light capitalize">
                  {data.fitnessGoals?.activityLevel}
                </span>
              </li>
            </ul>
          </section>
        )}
      </div>
      <div className="flex flex-col items-center justify-center gap-1 text-center">
        <h4 className="text-xl font-semibold">Ready to jump in?</h4>
        <Button
          type="button"
          className="form-submit-button group relative z-10 mt-2"
        >
          <p className="relative z-10 group-hover:text-background">Let’s go!</p>
          <ArrowRight className="form-submit-btn-icon" />
          <div className="form-submit-btn-bg"></div>
        </Button>
      </div>
    </aside>
  );
};

export default CompletedReview;
