"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { format } from "date-fns";
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
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useRouter } from "next/navigation";
import { useOnboarding } from "@/context/OnboardingContext";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  ArrowRight,
  CalendarIcon,
  SmileIcon,
  UtensilsCrossed,
} from "lucide-react";
import { Calendar } from "../ui/calendar";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Checkbox } from "../ui/checkbox";
import Link from "next/link";
import { toast } from "sonner";

const StepOneSchema = z.object({
  preference: z
    .object({
      trackMood: z.boolean().default(false),
      trackMeals: z.boolean().default(false),
    })
    .refine((pref) => pref.trackMood || pref.trackMeals, {
      message: "Pick at least one — moods or meals (or both!)",
    }),
  sex: z.string().min(1, {
    message: "Please select your sex",
  }),
  birthDate: z.date().refine(
    (date) => {
      const today = new Date();
      const minDate = new Date(
        today.getFullYear() - 16,
        today.getMonth(),
        today.getDate()
      );
      return date <= minDate;
    },
    {
      message: "Oops! You must be at least 16 to join the Mood Bowl club",
    }
  ),
});

const FormStepOne = () => {
  const router = useRouter();
  const { data, setData } = useOnboarding();
  const form = useForm({
    resolver: zodResolver(StepOneSchema),
    defaultValues: {
      preference: {
        trackMood: data.preference?.trackMood || false,
        trackMeals: data.preference?.trackMeals || false,
      },
      sex: data.sex || "",
      birthDate: data.birthDate || new Date("2009-01-01"),
    },
  });
  const onSubmit = (values: z.infer<typeof StepOneSchema>) => {
    setData((prev) => ({ ...prev, ...values }));
    if (values.preference.trackMood) {
      router.push("/onboarding/2"); // Go to the next step
    } else {
      router.push("/onboarding/3"); // Go to the Meals Tracking
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-8 w-full text-center max-w-md mx-auto max-sm:px-10 "
      >
        <h1 className="font-bold text-2xl capitalize pb-4">
          Your profile and preferences
        </h1>
        {/* DOB */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    defaultMonth={field.value || new Date("2009-01-01")}
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date("2010-01-01") ||
                      date < new Date("1900-01-01")
                    }
                    captionLayout="dropdown"
                  />
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* SEX */}
        <FormField
          control={form.control}
          name="sex"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel>Sex Assigned at Birth:</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 md:grid-cols-2 items-center w-full"
                >
                  <FormItem className="w-full">
                    <RadioGroupItem
                      id="female"
                      value="female"
                      className="peer hidden"
                    />
                    <FormLabel
                      htmlFor="female"
                      className="cursor-pointer font-bold w-full peer-data-[state=checked]:bg-gradient-to-r from-primary to-accent
                          peer-data-[state=checked]:text-background 
                       py-3 px-4 border rounded-xl 
                       peer-data-[state=checked]:border-0 
                       hover:not-peer-data-[state=checked]:shadow-[2px_3px_0px] hover:not-peer-data-[state=checked]:shadow-white 
                       hover:not-peer-data-[state=checked]:-translate-y-2 transitoin-colors duration-300 "
                    >
                      Female
                    </FormLabel>
                  </FormItem>

                  <FormItem className="w-full">
                    <RadioGroupItem
                      id="male"
                      value="male"
                      className="peer hidden"
                    />
                    <FormLabel
                      htmlFor="male"
                      className="cursor-pointer font-bold w-full peer-data-[state=checked]:bg-gradient-to-r from-primary to-accent
                          peer-data-[state=checked]:text-background 
                       py-3 px-4 border rounded-xl 
                       peer-data-[state=checked]:border-0 
                       hover:not-peer-data-[state=checked]:shadow-[2px_3px_0px] hover:not-peer-data-[state=checked]:shadow-white 
                       hover:not-peer-data-[state=checked]:-translate-y-2 transitoin-colors duration-300 "
                    >
                      Male
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="preference"
          render={() => (
            <FormItem className="w-full ">
              <div className="mb-4">
                <FormLabel className="text-lg font-bold! text-center! flex items-center justify-center w-full!">
                  <h1>Your goals, your way — pick what matters!</h1>
                </FormLabel>
                <FormDescription className="text-xs text-foreground/80 text-center">
                  Choose one or both options below. You can always update this
                  later.
                </FormDescription>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-6">
                <FormField
                  control={form.control}
                  name="preference"
                  render={({ field }) => {
                    return (
                      <FormItem className="mx-3">
                        <Checkbox
                          id="trackMood"
                          className="peer hidden"
                          checked={field.value?.trackMood}
                          onCheckedChange={(checked) =>
                            field.onChange({
                              ...field.value,
                              trackMood: checked,
                            })
                          }
                        />

                        <FormLabel
                          htmlFor="trackMood"
                          className="min-h-[100px] text-sm font-normal peer-data-[state=checked]:bg-gradient-to-b from-primary to-accent justify-center
                          peer-data-[state=checked]:text-background flex flex-col items-center gap-0.5 border rounded-xl p-3"
                        >
                          <h3 className="font-bold text-base">
                            Track Mood
                            <SmileIcon className="size-5 inline-flex ml-2 pb-1" />
                          </h3>
                          <p className="opacity-90 w-full italic text-xs">
                            Log feelings, meditate, reflect
                          </p>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="preference"
                  render={({ field }) => {
                    return (
                      <FormItem className="mx-3">
                        <Checkbox
                          id="trackMeals"
                          className="peer hidden"
                          checked={field.value?.trackMeals}
                          onCheckedChange={(checked) =>
                            field.onChange({
                              ...field.value,
                              trackMeals: checked,
                            })
                          }
                        />

                        <FormLabel
                          htmlFor="trackMeals"
                          className="min-h-[100px] text-sm font-normal peer-data-[state=checked]:bg-gradient-to-b from-primary to-accent justify-center
                          peer-data-[state=checked]:text-background flex flex-col items-center gap-0.5 border rounded-xl p-3"
                        >
                          <h3 className="font-bold text-base">
                            Track Meals
                            <UtensilsCrossed className="size-5 inline-flex ml-2 pb-1" />
                          </h3>
                          <p className="opacity-90 w-full italic text-xs">
                            Monitor food,
                            <br /> weight & goals
                          </p>
                        </FormLabel>
                      </FormItem>
                    );
                  }}
                />
              </div>

              <FormMessage />
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

export default FormStepOne;
