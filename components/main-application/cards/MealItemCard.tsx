"use client";

import {
  deleteMealItem,
  MealItemWithFoodDetails,
} from "@/lib/actions/mealitem.action";
import { toast } from "sonner";
import { NotebookPen, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import SmallFoodChart from "../charts/SmallFoodChart";
import ButtonSlide from "@/components/MyUi/ButtonSlide";

import { useState } from "react";

import UpdateMealForm from "../forms/UpdateMealForm";

const MealItemCard = ({ foodItem }: { foodItem: MealItemWithFoodDetails }) => {
  console.log("Food Item in MealItemCard:", foodItem);
  const [isEditing, setIsEditing] = useState(false);
  const chartData = [
    {
      name: "Protein",
      value: foodItem.protein || 0,
      fill: "var(--color-protein)",
    },
    { name: "Carbs", value: foodItem.carbs || 0, fill: "var(--color-carbs)" },
    { name: "Fats", value: foodItem.fats || 0, fill: "var(--color-fats)" },
  ];
  const handleDeleteMealItem = async () => {
    const { success, error } = await deleteMealItem({
      mealItemId: foodItem._id!.toString(),
    });
    if (!success) {
      console.error("Error deleting meal item:", error);
      toast.error(`Failed to delete ${foodItem.foodItemId.name}`);
    } else {
      toast.success(`${foodItem.foodItemId.name} removed from your dairy!`);
    }
  };
  return (
    <>
      <Popover>
        <PopoverTrigger>
          <div
            className="p-4 bg-gradient-to-br from-accent/80 to-primary/80 rounded-2xl text-background font-bold
    flex flex-col h-full cursor-pointer w-full"
          >
            <h2 className="max-sm:text-sm text-base w-full">
              {foodItem.foodItemId.name}
            </h2>
            <p className="text-xs w-full  text-background/80">
              {foodItem.foodItemId.brand || <span>&nbsp;</span>}
            </p>

            <div className="mx-auto scale-80 md:scale-90 lg:scale-100">
              <SmallFoodChart
                stroke
                data={chartData}
                fill={"var(--color-background)"}
                totalKcal={foodItem.calories || 0}
              />
            </div>
          </div>
        </PopoverTrigger>
        <PopoverContent
          align="center"
          side="top"
          className={` bg-background-light text-foreground border-none
            `}
        >
          {isEditing ? (
            <>
              <h1 className="text-gradient font-bold">
                Editing {foodItem.foodItemId.name}
              </h1>
              <UpdateMealForm
                setClose={() => setIsEditing(false)}
                quantity={foodItem.quantity}
                mealType={foodItem.mealType}
                date={foodItem.date}
                _id={
                  typeof foodItem._id === "string"
                    ? foodItem._id
                    : (foodItem._id as { toString: () => string }).toString()
                }
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between w-full">
                <h2>{foodItem.foodItemId.name}</h2>
                <p>{foodItem.calories}kcal</p>
              </div>
              <ul className="grid grid-cols-5 mt-4 items-center gap-2">
                {[
                  { label: "Protein", value: foodItem.protein },
                  { label: "Carbs", value: foodItem.carbs },
                  { label: "Fats", value: foodItem.fats },
                  { label: "Sugar", value: foodItem.sugar },
                  { label: "Fiber", value: foodItem.fiber },
                ].map(({ label, value }) => (
                  <li key={label} className="flex flex-col items-center">
                    <p className="text-sm font-bold ">{value} g</p>
                    <p className="text-xs">{label}</p>
                  </li>
                ))}
              </ul>
            </>
          )}
          {isEditing ? null : (
            <div
              className="flex items-center justify-stretch mt-4 gap-3
        "
            >
              <ButtonSlide
                type="button"
                onClick={handleDeleteMealItem}
                text="Delete"
                icon={Trash2}
                className="text-sm py-1 flex-1 rounded-md "
                slideLeft
              />

              <ButtonSlide
                type="button"
                onClick={() => {
                  setIsEditing(!isEditing);
                  console.log("Editing meal item:", foodItem);
                }}
                text="Edit"
                icon={NotebookPen}
                className="text-sm py-1! flex-1  rounded-md "
              />
            </div>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
};

export default MealItemCard;
