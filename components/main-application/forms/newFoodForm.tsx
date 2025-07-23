"use client";
import { createFoodItemSchema } from "@/lib/validation";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AsteriskIcon, TriangleAlert } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { addFoodItem } from "@/lib/actions/fooitem.action";
import { toast } from "sonner";

const NewFoodForm = () => {
  const form = useForm<z.infer<typeof createFoodItemSchema>>({
    resolver: zodResolver(createFoodItemSchema),
    defaultValues: {
      name: "",
      brand: "",
      category: "",
      servingSize: 0,
      servingUnit: "",
      caloriesPerServing: 0,
      proteinPerServing: 0,
      carbsPerServing: 0,
      totalFatsPerServing: 0,
      saturatedFatsPerServing: 0,
      fiberPerServing: 0,
      sugarPerServing: 0,
      sodiumPerServing: 0,
    },
  });
  const onSubmit = async (values: z.infer<typeof createFoodItemSchema>) => {
    console.log("Form submitted with values:", values);
    const { success, error, data } = await addFoodItem({
      ...values,
      userId: "1234567890abcdef12345678", // Replace with actual user ID
    });
    if (!success) {
      console.error("Error submitting food item:", error);
      toast.error(
        "There was an error submitting the food item. Please try again later on contact customer suupport."
      );
    } else {
      toast.success(
        `Thank you! ${data?.foodItem.name} has been added to the food database!`
      );
      form.reset();
    }
  };
  return (
    <div className="container bg-background-light mx-auto rounded-2xl p-6">
      <h2 className="text-3xl font-bold text-gradient text-center">
        Add a New Food Item
      </h2>
      <div className="flex py-4 md:pt-0 max-w-3xl max-sm:flex-col mx-auto items-center md:gap-5 text-secondary">
        <TriangleAlert className="hidden md:block md:size-20" />
        <p className="hidden md:block text-xs text-center">
          You&apos;re about to contribute to our community food database. Once
          submitted, this item will be publicly available for all users to
          search and log in their meals. Please take a moment to double-check
          the details — accurate entries help everyone make better choices.
          Thanks for sharing!
        </p>
        <p className="text-xs text-center max-w-xs mx-auto px-2  md:hidden">
          You’re adding a public food item to our database. Please double-check
          the info so everyone can benefit from accurate data. Thanks for
          helping the community!
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-8 my-4"
        >
          {/* Name & brand & Category */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CustomFormFieldInput
              form={form}
              name="name"
              required
              label="Food Name "
              description="Use common names like 'Apple' or 'Croissant'. Avoid brand names unless it's a specific product. Specify size if needed, like 'Medium Apple'."
              placeholder="(e.g. Apple, Croissant)"
            />
            <CustomFormFieldInput
              form={form}
              name="brand"
              label="Brand"
              description="Include the brand name if applicable, or store like tesco, aldi, lidl, etc. If not applicable, leave blank."
              placeholder="(e.g. Alpro, Tesco)"
            />
            <CustomFormFieldInput
              form={form}
              name="category"
              label="Category"
              description="Select a category that best fits the food item, like 'Fruits', 'Dairy', 'Snacks'. If unsure, leave blank."
              placeholder="(e.g. Fruits, Dairy)"
            />
          </div>
          {/* ServingSize & Serving Unit */}
          <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_2fr] gap-8 items-end">
            <CustomFormFieldInput
              form={form}
              inputType="number"
              name="servingSize"
              required
              label="Serving Size "
              placeholder="(e.g. 1, 100, 2)"
            />
            <FormField
              control={form.control}
              name="servingUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Serving Unit{" "}
                    <AsteriskIcon className="text-red-500 size-4 relative -left-2 -top-2" />
                  </FormLabel>
                  <FormDescription className="text-xs text-accent/80">
                    Please double-check the packaging.
                  </FormDescription>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a serving unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gradient-to-br from-background-light to-background text-foreground border-none">
                      {servingUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />
            <CustomFormFieldInput
              form={form}
              inputType="number"
              name="caloriesPerServing"
              required
              label="Calories per Serving "
              description="Enter the number of calories in one serving. If unknown, leave blank."
              placeholder="(e.g. 100)"
            />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CustomFormFieldInput
              name="totalFatsPerServing"
              form={form}
              inputType="number"
              label="Total Fats per Serving (g)"
              description="Enter the amount of fats in grams per serving. If unknown, leave blank."
              placeholder="(e.g. 3)"
            />
            <CustomFormFieldInput
              name="saturatedFatsPerServing"
              form={form}
              inputType="number"
              label="Saturated Fats per Serving (g)"
              description="Enter the amount of saturated fats in grams per serving. If unknown, leave blank."
              placeholder="(e.g. 1)"
            />

            <CustomFormFieldInput
              name="carbsPerServing"
              form={form}
              inputType="number"
              label="Carbohydrates per Serving (g)"
              description="Enter the amount of carbohydrates in grams per serving. If unknown, leave blank."
              placeholder="(e.g. 20)"
            />
            <CustomFormFieldInput
              name="sugarPerServing"
              form={form}
              inputType="number"
              label="Sugar per Serving (g)"
              description="Enter the amount of sugar in grams per serving. If unknown, leave blank."
              placeholder="(e.g. 10)"
            />
            <CustomFormFieldInput
              name="fiberPerServing"
              form={form}
              inputType="number"
              label="Fiber per Serving (g)"
              description="Enter the amount of fiber in grams per serving. If unknown, leave blank."
              placeholder="(e.g. 2)"
            />

            <CustomFormFieldInput
              name="proteinPerServing"
              form={form}
              inputType="number"
              label="Protein per Serving (g)"
              description="Enter the amount of protein in grams per serving. If unknown, leave blank."
              placeholder="(e.g. 5)"
            />
            <CustomFormFieldInput
              name="sodiumPerServing"
              form={form}
              inputType="number"
              label="Sodium per Serving (mg)"
              description="Enter the amount of sodium in milligrams per serving. If unknown, leave blank."
              placeholder="(e.g. 150)"
            />
          </div>
          <ButtonSlide
            type="submit"
            text="Submit Food Item"
            className="max-w-1/4 mx-auto mt-4"
          />
        </form>
      </Form>
    </div>
  );
};

export default NewFoodForm;

const CustomFormFieldInput = ({
  form,
  name,
  label,
  required = false,
  placeholder,
  description,
  inputType = "text",
}: {
  form: import("react-hook-form").UseFormReturn<
    z.infer<typeof createFoodItemSchema>
  >;
  name: keyof z.infer<typeof createFoodItemSchema>;
  label: string;
  required?: boolean;
  placeholder?: string;
  description?: string;
  inputType?: "text" | "number";
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>
            {label}
            {required && (
              <AsteriskIcon className="text-red-500 size-4 relative -left-2 -top-2" />
            )}
          </FormLabel>
          {description ? (
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1" className="">
                <AccordionTrigger className="text-xs no-underline! pt-0! pb-1! text-accent/80 hover:text-accent">
                  Tips for logging
                </AccordionTrigger>
                <AccordionContent className="text-[10px] py-0! px-1!">
                  {description}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ) : (
            <FormDescription className="text-xs text-accent/80">
              Please double-check the packaging.
            </FormDescription>
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              {...field}
              value={field.value === 0 ? "" : field.value}
              onChange={
                inputType === "number"
                  ? (e) => field.onChange(Number(e.target.value))
                  : field.onChange
              }
              type={inputType}
              className="placeholder:text-xs outline-none focus:bg-gradient-to-r from-accent/40 to-primary/40  ring-0! focus:ring-0! shadow-none!"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const servingUnits = [
  {
    value: "g",
    label: "Grams (g)",
  },
  {
    value: "ml",
    label: "Milliliters (ml)",
  },
  {
    value: "L",
    label: "Liters (L)",
  },
  {
    value: "cups",
    label: "Cups",
  },
  {
    value: "tbsp",
    label: "Tablespoons (tbsp)",
  },
  {
    value: "tsp",
    label: "Teaspoons (tsp)",
  },
  {
    value: "pcs",
    label: "Pieces (pcs)",
  },
  {
    value: "oz",
    label: "Ounces (oz)",
  },
  {
    value: "lbs",
    label: "Pounds (lbs)",
  },
  {
    value: "kg",
    label: "Kilograms (kg)",
  },
];
