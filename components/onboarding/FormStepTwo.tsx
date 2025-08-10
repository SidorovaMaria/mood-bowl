"use client";

import { useOnboarding } from "@/context/OnboardingContext";
import { z } from "zod";
import { useRouter } from "next/navigation";
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

import { ArrowLeft } from "lucide-react";

import ButtonSlide from "../myUi/ButtonSlide";
const StepTwoSchema = z.object({
  mentalHealthGoals: z.object({
    meditationMinutesPerDay: z
      .number()
      .min(0, {
        message: "You can start with 0 if meditation’s not your thing (yet) 🌱",
      })
      .max(1440, {
        message: "That's a whole day! Try something under 1440 minutes 😅",
      }),
    journalingFrequency: z.enum(["daily", "weekly", "monthly", "never"]),
    journalingDayOfTheWeek: z.enum([
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ]),
    journalingDayOfTheMonth: z.number().min(1).max(28).optional(),
    gratitudeEntriesPerDay: z
      .number()
      .min(0, {
        message:
          "No pressure! You can start with 0 if you're just getting warmed up 💫",
      })
      .max(10, {
        message:
          "Whoa! 10 is the max — save some gratitude for tomorrow too ✨",
      }),
  }),
});
const FormStepTwo = () => {
  const router = useRouter();
  const { data, setData } = useOnboarding();

  const form = useForm<z.infer<typeof StepTwoSchema>>({
    resolver: zodResolver(StepTwoSchema),
    defaultValues: {
      mentalHealthGoals: {
        meditationMinutesPerDay:
          data.mentalHealthGoals?.meditationMinutesPerDay || 0,
        journalingFrequency:
          data.mentalHealthGoals?.journalingFrequency || "daily",
        journalingDayOfTheWeek:
          (data.mentalHealthGoals?.journalingDayOfTheWeek as
            | "Monday"
            | "Tuesday"
            | "Wednesday"
            | "Thursday"
            | "Friday"
            | "Saturday"
            | "Sunday") || "Monday",
        journalingDayOfTheMonth:
          data.mentalHealthGoals?.journalingDayOfTheMonth || 1,
        gratitudeEntriesPerDay:
          data.mentalHealthGoals?.gratitudeEntriesPerDay || 0,
      },
    },
  });
  const onSubmit = (values: z.infer<typeof StepTwoSchema>) => {
    if (values.mentalHealthGoals.journalingFrequency === "daily") {
      values.mentalHealthGoals.journalingDayOfTheWeek = "Monday";
      values.mentalHealthGoals.journalingDayOfTheMonth = 1;
    }
    setData((prev) => ({ ...prev, ...values }));
    if (data.preference?.trackMeals) {
      router.push("/onboarding/3");
    } else {
      router.push("/onboarding/completed"); // Go to the next step
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full text-center max-w-md mx-auto max-sm:px-10 "
      >
        <h1 className="font-bold text-2xl capitalize pb-4">
          Set your mental health intentions
        </h1>
        {/* Meditation Minutes Per Day */}
        <FormField
          control={form.control}
          name="mentalHealthGoals.meditationMinutesPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Meditation Time:</FormLabel>
              <FormDescription className="text-xs text-left! text-foreground/70!">
                How many minutes would you like to meditate each day?
                <br /> Set to 0 if you&apos;re not into it.
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  type="number"
                  placeholder="e.g. 10"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        {/* Journaling Frequency */}
        <FormField
          control={form.control}
          name="mentalHealthGoals.journalingFrequency"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>How often would you like to journal?</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-2 md:grid-cols-4 items-center w-full"
                >
                  <FormItem className="w-full">
                    <RadioGroupItem
                      id="daily"
                      value="daily"
                      className="peer hidden"
                    />
                    <FormLabel
                      htmlFor="daily"
                      className="cursor-pointer font-bold w-full peer-data-[state=checked]:bg-gradient-to-r from-primary to-accent
                          peer-data-[state=checked]:text-background 
                       py-3 px-4 border rounded-xl 
                       peer-data-[state=checked]:border-0 
                       hover:not-peer-data-[state=checked]:shadow-[2px_3px_0px] hover:not-peer-data-[state=checked]:shadow-white 
                       hover:not-peer-data-[state=checked]:-translate-y-2 transitoin-colors duration-300 "
                    >
                      Daily
                    </FormLabel>
                  </FormItem>

                  <FormItem className="w-full">
                    <RadioGroupItem
                      id="weekly"
                      value="weekly"
                      className="peer hidden"
                    />
                    <FormLabel
                      htmlFor="weekly"
                      className="cursor-pointer font-bold w-full peer-data-[state=checked]:bg-gradient-to-r from-primary to-accent
                          peer-data-[state=checked]:text-background 
                       py-3 px-4 border rounded-xl 
                       peer-data-[state=checked]:border-0 
                       hover:not-peer-data-[state=checked]:shadow-[2px_3px_0px] hover:not-peer-data-[state=checked]:shadow-white 
                       hover:not-peer-data-[state=checked]:-translate-y-2 transitoin-colors duration-300 "
                    >
                      Weekly
                    </FormLabel>
                  </FormItem>
                  <FormItem className="w-full">
                    <RadioGroupItem
                      id="monthly"
                      value="monthly"
                      className="peer hidden"
                    />
                    <FormLabel
                      htmlFor="monthly"
                      className="cursor-pointer font-bold w-full peer-data-[state=checked]:bg-gradient-to-r from-primary to-accent
                          peer-data-[state=checked]:text-background 
                       py-3 px-4 border rounded-xl 
                       peer-data-[state=checked]:border-0 
                       hover:not-peer-data-[state=checked]:shadow-[2px_3px_0px] hover:not-peer-data-[state=checked]:shadow-white 
                       hover:not-peer-data-[state=checked]:-translate-y-2 transitoin-colors duration-300 "
                    >
                      Monthly
                    </FormLabel>
                  </FormItem>
                  <FormItem className="w-full">
                    <RadioGroupItem
                      id="never"
                      value="never"
                      className="peer hidden"
                    />
                    <FormLabel
                      htmlFor="never"
                      className="cursor-pointer font-bold w-full peer-data-[state=checked]:bg-gradient-to-r from-primary to-accent
                          peer-data-[state=checked]:text-background 
                       py-3 px-4 border rounded-xl 
                       peer-data-[state=checked]:border-0 
                       hover:not-peer-data-[state=checked]:shadow-[2px_3px_0px] hover:not-peer-data-[state=checked]:shadow-white 
                       hover:not-peer-data-[state=checked]:-translate-y-2 transitoin-colors duration-300 "
                    >
                      Never
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AnimatePresence>
          {form.watch("mentalHealthGoals.journalingFrequency") === "weekly" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FormField
                control={form.control}
                name="mentalHealthGoals.journalingDayOfTheWeek"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Select the day you want to journal:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="grid grid-cols-4 md:grid-cols-7 items-center w-full "
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        {weekDays.map((day) => (
                          <FormItem key={day.value}>
                            <RadioGroupItem
                              id={day.value}
                              value={day.value}
                              className="peer hidden"
                            />
                            <FormLabel
                              htmlFor={day.value}
                              className="radio-group-label p-2! flex justify-center"
                            >
                              <p>{day.name}</p>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {form.watch("mentalHealthGoals.journalingFrequency") ===
            "monthly" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <FormField
                control={form.control}
                name="mentalHealthGoals.journalingDayOfTheMonth"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel>Select the day you want to journal:</FormLabel>
                    <FormControl>
                      <RadioGroup
                        className="grid grid-cols-7 md:grid-cols-12 items-center w-full "
                        onValueChange={(val) => field.onChange(Number(val))}
                        defaultValue={String(field.value)}
                      >
                        {Array.from({ length: 28 }).map((_, index) => (
                          <FormItem key={index}>
                            <RadioGroupItem
                              id={String(index + 1)}
                              value={String(index + 1)}
                              className="peer hidden"
                            />
                            <FormLabel
                              htmlFor={String(index + 1)}
                              className="text-xs radio-group-label p-1! flex justify-center"
                            >
                              <p>{index + 1}</p>
                            </FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
            </motion.div>
          )}
        </AnimatePresence>
        <FormField
          control={form.control}
          name="mentalHealthGoals.gratitudeEntriesPerDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gratitude Entries Per Day</FormLabel>
              <FormDescription className="text-xs text-left! text-foreground/70!">
                One smile, one line, one moment — how many per day?
                <br />
                Set to 0 if you&apos;re not into it.
              </FormDescription>
              <FormControl>
                <Input
                  {...field}
                  value={field.value === 0 ? "" : field.value}
                  type="number"
                  placeholder="e.g. 10"
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center gap-10 justify-center">
          <ButtonSlide
            type="button"
            icon={ArrowLeft}
            link="/onboarding/1"
            text="Back"
            slideLeft
          />
          <ButtonSlide type="submit" text="Next" />
        </div>
      </form>
    </Form>
  );
};

export default FormStepTwo;

const weekDays = [
  {
    name: "Mon",
    value: "Monday",
  },
  {
    name: "Tue",
    value: "Tuesday",
  },
  {
    name: "Wed",
    value: "Wednesday",
  },
  {
    name: "Thu",
    value: "Thursday",
  },
  {
    name: "Fri",
    value: "Friday",
  },
  {
    name: "Sat",
    value: "Saturday",
  },
  {
    name: "Sun",
    value: "Sunday",
  },
];
