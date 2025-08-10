"use client";
import { createFoodItemSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { addFoodItem } from "@/lib/actions/fooitem.action";

import { Form } from "@/components/ui/form";
import CustomInput from "./ui/CustomInput";
import ButtonSlide from "@/components/myUi/ButtonSlide";
import CustomSelect from "./ui/CustomSelect";
import { availableUnits } from "./constants";
import { toast } from "@/components/myUi/Toast";

const AddFoodItemForm = ({ formId }: { formId: string }) => {
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
      toast({
        title: "Error",
        description: error?.message || "An unexpected error occurred.",
        type: "error",
      });
    } else {
      toast({
        title: `Food item ${data?.foodItem.name} added successfully!`,
        type: "success",
      });

      form.reset();
      close();
    }
  };
  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" || e.key === "ArrowRight") {
        e.preventDefault();
        const form = e.currentTarget.form;
        const next = form?.elements[index + 1] as HTMLElement;
        next?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const form = e.currentTarget.form;
        const prev = form?.elements[index - 1] as HTMLElement;
        prev?.focus();
      }
    };
  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit(onSubmit)}
        className="py-2 "
      >
        <div className="flex flex-col gap-4 ">
          <div className="flex flex-wrap items-center justify-center gap-3 gap-x-4">
            <CustomInput
              form={form}
              name="name"
              label="Food Name"
              required
              placeholder="(e.g. Apple, Croissant)"
              onKeyDown={handleKeyDown(0)}
            />
            <CustomInput
              form={form}
              name="brand"
              label="Brand"
              placeholder="(e.g. Nutella, Coca-Cola)"
              onKeyDown={handleKeyDown(1)}
            />
            <CustomInput
              form={form}
              name="category"
              label="Category"
              onKeyDown={handleKeyDown(2)}
              placeholder="(e.g. Snack, Breakfast)"
            />
            <CustomInput
              form={form}
              name="caloriesPerServing"
              label="Calories per Serving"
              required
              type="number"
              placeholder="(e.g. 100)"
              onKeyDown={handleKeyDown(3)}
            />
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 gap-x-4 ">
            <CustomInput
              form={form}
              name="servingSize"
              label="Serving Size"
              required
              type="number"
              placeholder="(e.g. 100)"
              className=""
              onKeyDown={handleKeyDown(4)}
            />
            <CustomSelect
              form={form}
              name="servingUnit"
              label="Serving Unit"
              required
              placeholder="(e.g. g, ml, oz)"
              options={availableUnits}
            />
          </div>
          <div className="flex flex-wrap items-center justify-around gap-3">
            <CustomInput
              form={form}
              name="totalFatsPerServing"
              label="Total Fats"
              type="number"
              placeholder="(e.g. 100)"
              small
              onKeyDown={handleKeyDown(6)}
            />
            <CustomInput
              form={form}
              name="saturatedFatsPerServing"
              label="Sat. Fats"
              type="number"
              placeholder="(e.g. 1)"
              small
              onKeyDown={handleKeyDown(7)}
            />
            <CustomInput
              form={form}
              name="carbsPerServing"
              label="Carbs"
              type="number"
              placeholder="(e.g. 20)"
              small
              onKeyDown={handleKeyDown(8)}
            />
            <CustomInput
              form={form}
              name="sugarPerServing"
              label="Sugars"
              type="number"
              placeholder="(e.g. 10)"
              small
              onKeyDown={handleKeyDown(9)}
            />
            <CustomInput
              form={form}
              name="proteinPerServing"
              label="Protein"
              type="number"
              placeholder="(e.g. 5)"
              small
              onKeyDown={handleKeyDown(10)}
            />

            <CustomInput
              form={form}
              name="fiberPerServing"
              label="Fiber "
              type="number"
              placeholder="(e.g. 2)"
              small
              onKeyDown={handleKeyDown(11)}
            />

            <CustomInput
              form={form}
              name="sodiumPerServing"
              label="Sodium"
              type="number"
              placeholder="(e.g. 200)"
              small
              className=""
              onKeyDown={handleKeyDown(12)}
            />
          </div>
          <ButtonSlide
            form={"add-food-item-form"}
            type="submit"
            text="Submit Food Item"
            className=" mx-auto mt-4"
          />
        </div>
      </form>
    </Form>
  );
};

export default AddFoodItemForm;
