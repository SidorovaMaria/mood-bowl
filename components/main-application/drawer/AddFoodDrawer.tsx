"use client";

import * as React from "react";
import { Check, Plus, TriangleAlert, Undo2 } from "lucide-react";
import { Drawer as DrawerVault } from "vaul";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import FoodSearch from "../search/FoodSearch";
import { IFoodItemDoc } from "@/database/foodItem.model";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AnimatePresence, motion } from "motion/react";
import MealitemForm from "../forms/MealitemForm";

import { removeKeysFromUrlQuery } from "@/lib/url";
import AddFoodItemForm from "../forms/AddFoodItemForm";

export function AddFoodDrawer({ data }: { data?: IFoodItemDoc[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showNewFoodForm, setShowNewFoodForm] = React.useState(false);
  const router = useRouter();
  const closeAddFoodForm = () => {
    const newUrl = removeKeysFromUrlQuery({
      params: searchParams.toString(),
      keysToRemove: ["query"],
    });
    console.log("New URL after closing form:", newUrl);
    router.push(newUrl);
    setShowNewFoodForm(false);
  };
  return (
    <Drawer onOpenChange={closeAddFoodForm}>
      <DrawerTrigger asChild>
        <ButtonSlide
          type="button"
          className="rounded-lg"
          text="Add Food"
          icon={Plus}
        />
      </DrawerTrigger>
      <DrawerContent className="min-h-[90vh]! ">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-bold text-gradient">
            Add New Food
          </DrawerTitle>
        </DrawerHeader>
        <div className=" px-8 md:px-0 mx-auto w-full max-w-3xl overflow-scroll">
          <div className="p-4 py-0 w-full pb-0">
            <FoodSearch route={pathname} placeholder="Search for food..." />
            <div className="flex flex-col gap-1 mt-2 overflow-x-scroll max-h-[350px] ">
              {data && data.length > 0 ? (
                data.map((foodItem: IFoodItemDoc) => (
                  <FoodInfo key={String(foodItem._id)} foodItem={foodItem} />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-[150px] md:h-[200px] ">
                  <p className="text-lg text-muted-foreground">
                    No food items found.
                  </p>
                </div>
              )}
            </div>
            <DrawerVault.NestedRoot>
              <DrawerTrigger
                asChild
                className="flex flex-col items-center gap-2 justify-center mt-2 w-full"
              >
                <div>
                  <p className="font-bold text-base text-gradient">
                    Not found what you are looking for?
                  </p>
                  <ButtonSlide
                    onClick={() => setShowNewFoodForm(true)}
                    text="Create New Food"
                    className="text-sm"
                    icon={Plus}
                  />
                </div>
              </DrawerTrigger>
              <DrawerVault.Portal>
                <DrawerVault.Overlay className="fixed inset-0 bg-black/40" />
                <DrawerContent className="bg-background-light flex flex-col rounded-t-[10px] h-[85vh]! max-h-[85vh]! mt-24  fixed bottom-0 left-0 right-0 z-[100]">
                  <div className="max-w-sm md:max-w-xl lg:max-w-2xl mx-auto bg-red-40 ">
                    <DrawerTitle className="text-2xl pt-4 font-bold text-gradient text-center">
                      Add a Food to Community Database
                    </DrawerTitle>
                    <p className="text-sm text-center p-2 text-foreground/80">
                      <TriangleAlert className="text-yellow-500 size-5 inline-block mr-1" />
                      You’re adding a public food item to our database. Please
                      double-check the info so everyone can benefit from
                      accurate data.
                    </p>
                  </div>
                  <div className="max-w-md  md:max-w-2xl lg:max-w-4xl mx-auto   overflow-y-scroll p-5 mb-10 rounded-xl">
                    <AddFoodItemForm formId={"add-food-item-form"} />
                  </div>
                </DrawerContent>
              </DrawerVault.Portal>
            </DrawerVault.NestedRoot>
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <ButtonSlide text="Done" className="w-1/2 mx-auto" icon={Check} />
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const FoodInfo = ({ foodItem }: { foodItem: IFoodItemDoc }) => {
  const [addFoodOpen, setAddFoodOpen] = React.useState(false);
  return (
    <div key={String(foodItem._id)} className="flex flex-col w-full pl-4 ">
      <div className="flex items-center gap-4 oveflow-hidden ">
        <Popover>
          <PopoverTrigger className="w-full data-[state=open]:bg-gradient-to-br from-primary to-accent data-[state=open]:text-background font-bold rounded-xl gap-10 p-2 cursor-pointer  border border-transparent hover:border-accent group">
            <div className="flex-1 flex items-center justify-between">
              <div className="flex flex-col items-start gap-0.5">
                <h3 className="text-base font-semibold">{foodItem.name}</h3>
                <p className="text-xs foreground/80">{foodItem.brand}</p>
              </div>
              <div className="flex flex-col items-end text-xs gap-1">
                <p className=" group:data-[state=open]:text-background! font-semibold">
                  {foodItem.caloriesPerServing}kcal
                </p>
                <p className=" group:data-[state=open]:text-background! font-semibold">
                  {foodItem.servingSize}
                  {foodItem.servingUnit ? `${foodItem.servingUnit}` : ""}
                </p>
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-full bg-background-light text-foreground border-accent min-w-[300px]">
            <div className="flex flex-col gap-2">
              <div className="flex  ">
                <div className="flex flex-col justify-center gap-0.5">
                  <h2 className="text-lg font-semibold">{foodItem.name}</h2>
                  {foodItem.brand && (
                    <p className="text-sm text-muted-foreground">
                      {foodItem.brand}
                    </p>
                  )}
                </div>
                <div className=" ml-auto flex flex-col items-center justify-center px-4 rounded-full text-xs aspect-square bg-radial-[at_50%_75%] from-primary to-accent text-background font-bold">
                  <p className="text-sm">{foodItem.caloriesPerServing}</p>
                  <p>Kcal</p>
                </div>
              </div>
              <div className="border-t pt-2 border-accent">
                <h1 className="text-base font-bold">
                  {" "}
                  Nutrition Facts{" "}
                  <span className="pl-3 text-sm font-normal">
                    ({foodItem.servingSize}
                    {foodItem.servingUnit})
                  </span>
                </h1>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {(
                    [
                      {
                        key: "caloriesPerServing",
                        label: "Calories",
                        unit: "kcal",
                      },
                      {
                        key: "totalFatsPerServing",
                        label: "Total Fats",
                        unit: "g",
                      },
                      {
                        key: "proteinPerServing",
                        label: "Protein",
                        unit: "g",
                      },
                      {
                        key: "carbsPerServing",
                        label: "Carbs",
                        unit: "g",
                      },
                      {
                        key: "fiberPerServing",
                        label: "Fiber",
                        unit: "g",
                      },
                      {
                        key: "sugarPerServing",
                        label: "Sugar",
                        unit: "g",
                      },
                    ] as const
                  ).map(({ key, label, unit }) => (
                    <div
                      key={key}
                      className="flex flex-col items-center gap-0.5"
                    >
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-sm">
                        {foodItem[key as keyof IFoodItemDoc] !== undefined
                          ? `${foodItem[key as keyof IFoodItemDoc]}${unit}`
                          : "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
        <ButtonSlide
          slideLeft={addFoodOpen}
          icon={addFoodOpen ? Undo2 : Plus}
          onClick={() => setAddFoodOpen(!addFoodOpen)}
        />
      </div>
      <AnimatePresence mode="wait">
        {addFoodOpen && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0,
            }}
            animate={{
              opacity: 1,
              height: "auto",
              transition: {
                opacity: {
                  delay: 0.3,
                  duration: 0.2,
                  type: "tween",
                },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
            }}
            className="container px-4 py-2 bg-background-light rounded-xl"
          >
            <MealitemForm
              foodItem={foodItem}
              close={() => setAddFoodOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
