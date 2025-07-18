"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { RadioGroup } from "../ui/radio-group";
import { RadioGroupItem } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";

const stepThreeSchema = z.object({
  fitnessGoals: z.object({
    currentWeightKg: z.number().min(20, {
      message: "Hmm, that seems light! Pop in your real weight 🧸 (min 20kg)",
    }),
    targetWeightKg: z.number().min(20, {
      message: "Shoot for the stars, but keep it real 💪 (min 20kg)",
    }),
    heightCm: z.number().min(80, {
      message: "Even tiny giants need to be at least 80 cm tall 🧍‍♂️🌱",
    }),
    dietType: z.enum(["vegan", "vegetarian", "paleo", "keto", "balanced"]),
    goal: z.enum(["maintain", "lose", "gain"]),
    activityLevel: z.enum([
      "sedentary",
      "light",
      "moderate",
      "active",
      "very_active",
    ]),
  }),
});

const FormStepThree = () => {
  const { data, setData } = useOnboarding();
  console.log("Form Step Three Data:", data);
  const router = useRouter();
  const form = useForm<z.infer<typeof stepThreeSchema>>({
    resolver: zodResolver(stepThreeSchema),
    defaultValues: {
      fitnessGoals: {
        currentWeightKg: data.fitnessGoals?.currentWeightKg || 0,
        targetWeightKg: data.fitnessGoals?.targetWeightKg || 0,
        heightCm: data.fitnessGoals?.heightCm || 0,
        dietType:
          (data.fitnessGoals?.dietType as
            | "vegan"
            | "vegetarian"
            | "paleo"
            | "keto"
            | "balanced"
            | "balanced") || "balanced",
        activityLevel:
          (data.fitnessGoals?.activityLevel as
            | "sedentary"
            | "light"
            | "moderate"
            | "active"
            | "very_active"
            | undefined) || "moderate",
        goal:
          (data.fitnessGoals?.goal as
            | "maintain"
            | "lose"
            | "gain"
            | undefined) || "maintain",
      },
    },
  });
  const onSubmit = (values: z.infer<typeof stepThreeSchema>) => {
    console.log("Form Step Two Values:", values);
    setData((prev) => ({ ...prev, ...values }));
    router.push("/onboarding/4");
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 w-full text-center max-w-lg mx-auto max-sm:px-10 lg:min-w-2xl md:min-w-xl "
      >
        <h1 className="font-bold text-2xl capitalize pb-4">
          What&apos;s your body&apos;s game plan?
          <br /> Let&apos;s calculate it!
        </h1>
        {/* Current Weight & TargetWeight & Current Height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end w-full">
          <FormField
            control={form.control}
            name="fitnessGoals.currentWeightKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your current weight</FormLabel>
                <FormDescription className="text-xs text-left! text-foreground/70!">
                  This helps us calculate your baseline energy needs.
                </FormDescription>

                <FormControl>
                  <Input
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    type="number"
                    placeholder="e.g. 70"
                    className="placeholder:text-xs "
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fitnessGoals.targetWeightKg"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your current weight</FormLabel>
                <FormDescription className="text-xs text-left! text-foreground/70!">
                  Your goal helps us guide you — one step (and snack) at a time.
                  <br />
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    type="number"
                    className="placeholder:text-xs "
                    placeholder="e.g. 65"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fitnessGoals.heightCm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your majestic height (in cm)</FormLabel>
                <FormDescription className="text-xs text-left! text-foreground/70!">
                  Helps us tailor your nutrition and fitness plan.
                  <br />
                </FormDescription>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    type="number"
                    className="placeholder:text-xs "
                    placeholder="e.g. 170"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>

                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>
        {/* Diet Type */}
        <FormField
          control={form.control}
          name="fitnessGoals.dietType"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Your plate, your rules — pick a diet style!</FormLabel>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-3 md:grid-cols-5 items-center w-full "
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {dietTypes.map((day) => (
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
                        <p>{day.label}</p>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        {/* Goal */}
        <FormField
          control={form.control}
          name="fitnessGoals.goal"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>
                Your mission, should you choose to accept it{" "}
              </FormLabel>
              <FormDescription className="text-xs text-left! text-foreground/70! pb-1">
                Your goal helps us figure out how many calories you need — to
                keep steady, shed some, or bulk up.
              </FormDescription>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-1 md:grid-cols-3 items-center w-full "
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {goals.map((day) => (
                    <FormItem key={day.value}>
                      <RadioGroupItem
                        id={day.value}
                        value={day.value}
                        className="peer hidden"
                      />
                      <FormLabel
                        htmlFor={day.value}
                        className="radio-group-label p-2! py-3! flex justify-center font-bold!"
                      >
                        <p>{day.label}</p>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        {/* Activity Level */}
        <FormField
          control={form.control}
          name="fitnessGoals.activityLevel"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>
                Your mission, should you choose to accept it{" "}
              </FormLabel>
              <FormDescription className="text-xs text-left! text-foreground/70! pb-1">
                Your goal helps us figure out how many calories you need — to
                keep steady, shed some, or bulk up.
              </FormDescription>
              <FormControl>
                <RadioGroup
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center mx-8 md:mx-3 md:w-full justify-items-center "
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {activityLevels.map((day) => (
                    <FormItem
                      key={day.value}
                      className=" w-full md:last:col-span-2 md:last:w-1/2"
                    >
                      <RadioGroupItem
                        id={day.value}
                        value={day.value}
                        className="peer hidden"
                      />
                      <FormLabel
                        htmlFor={day.value}
                        className="radio-group-label p-2! py-3! flex justify-center font-bold "
                      >
                        <p>{day.label}</p>
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="form-submit-button group relative z-10 "
        >
          <p className="relative z-10 group-hover:text-background">Next</p>
          <ArrowRight className="form-submit-btn-icon" />
          <div className="form-submit-btn-bg"></div>
        </Button>
      </form>
    </Form>
  );
};

export default FormStepThree;

const dietTypes = [
  { value: "balanced", label: "Balanced" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "paleo", label: "Paleo" },
  { value: "keto", label: "Keto" },
];
const goals = [
  { value: "maintain", label: "Maintain" },
  { value: "lose", label: "Lose" },
  { value: "gain", label: "Gain" },
];

const activityLevels = [
  { value: "sedentary", label: "Sedentary (0-1 hr/week)" },
  { value: "light", label: "Light (1-3 hrs/week)" },
  { value: "moderate", label: "Moderate (3-5 hrs/week)" },
  { value: "active", label: "Active (5-7 hrs/week)" },
  { value: "very_active", label: "Very Active (7+ hrs/week)" },
];
