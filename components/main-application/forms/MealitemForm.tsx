import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PopoverContent } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IFoodItemDoc } from "@/database/foodItem.model";

import { zodResolver } from "@hookform/resolvers/zod";
import { Popover, PopoverTrigger } from "@radix-ui/react-popover";

import { format } from "date-fns";
import { Asterisk, CalendarIcon, Plus } from "lucide-react";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SmallFoodChart from "../charts/SmallFoodChart";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { addMealItem } from "@/lib/actions/mealitem.action";
import { toast } from "sonner";
const mealItemSchema = z.object({
  mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  quantity: z.number().positive(),
  date: z.date(),
});
const MealitemForm = ({
  foodItem,
  close,
}: {
  foodItem: IFoodItemDoc;
  close: () => void;
}) => {
  const form = useForm<z.infer<typeof mealItemSchema>>({
    resolver: zodResolver(mealItemSchema),
    defaultValues: {
      mealType: "breakfast",
      quantity: 0,
      date: new Date(),
    },
  });

  const [debouncedRatio, setDebouncedRatio] = React.useState(0);
  const quantity = form.watch("quantity");
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedRatio(quantity / foodItem.servingSize);
    }, 300);
    return () => clearTimeout(handler);
  }, [quantity, foodItem.servingSize]);

  const totalKcal = Math.round(foodItem.caloriesPerServing * debouncedRatio);
  const totalFats = Number(
    ((foodItem.totalFatsPerServing || 0) * debouncedRatio).toFixed(1)
  );
  const totalCarbs = Number(
    ((foodItem.carbsPerServing || 0) * debouncedRatio).toFixed(1)
  );
  const totalProtein = Number(
    ((foodItem.proteinPerServing || 0) * debouncedRatio).toFixed(1)
  );
  const graphData = [
    { name: "Fats", value: totalFats, fill: "var(--color-fats)" },
    { name: "Carbs", value: totalCarbs, fill: "var(--color-carbs)" },
    { name: "Protein", value: totalProtein, fill: "var(--color-protein)" },
  ];
  const onSubmit = async (values: z.infer<typeof mealItemSchema>) => {
    //Convert date to UTC since the backend expects UTC dates
    const rawDate = new Date(values.date);
    const utcDate = new Date(
      Date.UTC(rawDate.getFullYear(), rawDate.getMonth(), rawDate.getDate())
    );
    const { success, error } = await addMealItem({
      date: utcDate,
      mealType: values.mealType,
      foodItemId: foodItem._id!.toString(),
      quantity: values.quantity,
    });
    if (!success) {
      console.error("Error adding meal item:", error);
      return;
    } else {
      toast.success(`${foodItem.name} added to your dairy!`);
      close();
    }
  };

  return (
    <>
      <div className="flex w-full items-center justify-between ">
        <h2 className="text-xl font-bold py-3">Add {foodItem.name}</h2>
        <ButtonSlide
          text="Add Food"
          type="submit"
          icon={Plus}
          className="py-1! text-sm!"
          form="food-form"
        />
      </div>

      <Form {...form}>
        <form
          id="food-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-[2fr_2fr_3fr] gap-4 mb-3"
        >
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="flex-2">
                  Total {foodItem.servingUnit}
                  <Asterisk className="text-red-500 size-4 -top-2 -left-2 relative" />
                </FormLabel>
                <FormControl className="flex-1">
                  <Input
                    placeholder="Enter quantity"
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className=" placeholder:text-xs outline-none focus:bg-gradient-to-r from-accent/40 to-primary/40  ring-0! focus:ring-0! shadow-none! text-right"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mealType"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormLabel className="flex-2 ">
                  Meal Type
                  <Asterisk className="text-red-500 size-4 -top-2 -left-2 relative" />
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="capitalize text-left outline-none border-none px-2 ">
                    <SelectValue placeholder="Select meal type" />
                  </SelectTrigger>

                  <SelectContent className="bg-gradient-to-br from-background-light to-background text-foreground rounded-xl p-2 border-none -left-4">
                    {[
                      {
                        value: "breakfast",
                        label: "Breakfast",
                      },
                      {
                        value: "lunch",
                        label: "Lunch",
                      },
                      {
                        value: "dinner",
                        label: "Dinner",
                      },
                      {
                        value: "snack",
                        label: "Snack",
                      },
                    ].map((option) => (
                      <SelectItem
                        className="focus:bg-accent/50 hover:bg-accent/50! capitalize"
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex items-center justify-center">
                <FormLabel className="flex-1">
                  Date
                  <Asterisk className="text-red-500 size-4 -top-2 -left-2 relative" />
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button className="cursor-pointer bg-background-light text-foreground focus:bg-gradient-to-r hover:bg-gradient-to-r from-accent/50 to-primary/50 data-[state=open]:bg-gradient-to-r data-[state=open]:from-accent/50 data-[state=open]:to-primary/50 ">
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="w-auto p-0 bg-background-light text-foreground shadow-lg rounded-lg"
                    align="start"
                  >
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      captionLayout="dropdown"
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
      <div className=" grid grid-cols-4 items-center">
        <SmallFoodChart data={graphData} totalKcal={totalKcal} />
        <div className="flex flex-col items-center gap-0.5 text-protein">
          {/* Percentage of calories from protein */}
          <p className="text-sm font-bold  ">
            {totalKcal > 0
              ? ((totalProtein * 4 * 100) / totalKcal).toFixed(0) + "%"
              : "0%"}
          </p>
          <p className="text-xl text-foreground font-bold">{totalProtein}g</p>
          <p className="text-base font-bold">Protein</p>
        </div>

        <div className="flex flex-col items-center gap-0.5 text-carbs">
          {/* Percentage of calories from carbs */}
          <p className="text-sm font-bold ">
            {totalKcal > 0
              ? ((totalCarbs * 4 * 100) / totalKcal).toFixed(0) + "%"
              : "0%"}
          </p>
          <p className="text-xl text-foreground font-bold">{totalCarbs}g</p>
          <p className="text-base font-bold">Carbs</p>
        </div>
        <div className="flex flex-col items-center gap-0.5 text-fats">
          {/* Percentage of calories from fats */}
          <p className="text-sm font-bold s">
            {totalKcal > 0
              ? ((totalFats * 9 * 100) / totalKcal).toFixed(0) + "%"
              : "0%"}
          </p>
          <p className="text-xl font-bold text-foreground">{totalFats}g</p>
          <p className="text-base font-bold">Fats</p>
        </div>
      </div>
    </>
  );
};

export default MealitemForm;
