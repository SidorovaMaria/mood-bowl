import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { updateMealItem } from "@/lib/actions/mealitem.action";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, FileCheck, Undo2 } from "lucide-react";
import { PopoverContent } from "@radix-ui/react-popover";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
const UpdateMealForm = ({
  quantity,
  mealType,
  date,
  _id,
  setClose,
}: {
  quantity: number;
  mealType: "breakfast" | "lunch" | "dinner" | "snack";
  date: Date;
  _id: string;
  setClose: () => void;
}) => {
  const updateMealItemSchema = z.object({
    mealType: z.enum(["breakfast", "lunch", "dinner", "snack"]),
    quantity: z.number().positive(),
    date: z.date(),
  });
  const form = useForm<z.infer<typeof updateMealItemSchema>>({
    resolver: zodResolver(updateMealItemSchema),
    defaultValues: {
      mealType: mealType || "breakfast",
      quantity: quantity || 1,
      date: new Date(date) || new Date(),
    },
  });

  const onEdit = async (values: z.infer<typeof updateMealItemSchema>) => {
    const { success, error } = await updateMealItem({
      mealItemId: _id,
      date: values.date,
      mealType: values.mealType,
      quantity: values.quantity,
    });
    if (!success) {
      console.error("Error updating meal item:", error);
      toast.error(`Failed to update meal item`);
      return;
    } else {
      toast.success(`Meal item updated successfully!`);
      form.reset();
      setClose();
    }
  };
  return (
    <Form {...form}>
      <form
        id="edit-meal-form"
        onSubmit={form.handleSubmit(onEdit)}
        className="flex flex-col gap-4 my-3"
      >
        <div className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter quantity"
                    {...field}
                    value={field.value === 0 ? "" : field.value}
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    className=""
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mealType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel className="flex-2 ">Meal Type</FormLabel>
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
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="flex-1">Date</FormLabel>
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
                  className="w-auto p-0 bg-background-light text-foreground shadow-lg rounded-lg z-50!"
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
        <div
          className="flex items-center justify-stretch mt-4 gap-3 z-10
        "
        >
          <ButtonSlide
            type="button"
            text="Cancel"
            icon={Undo2}
            onClick={() => setClose()}
            className="text-sm py-1 flex-1 rounded-md "
            slideLeft
          />

          <ButtonSlide
            type="submit"
            text="Update"
            icon={FileCheck}
            className="text-sm py-1! flex-1  rounded-md "
          />
        </div>
      </form>
    </Form>
  );
};

export default UpdateMealForm;
