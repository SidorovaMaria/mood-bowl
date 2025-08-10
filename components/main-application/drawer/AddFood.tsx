import { getFoodItems } from "@/lib/actions/fooitem.action";
import React from "react";
import { AddFoodDrawer } from "./AddFoodDrawer";

const AddFood = async ({ query }: { query: string }) => {
  const { success, data, error } = await getFoodItems({ query: query || "" });
  if (!success) {
    throw new Error(error?.message || "Failed to fetch food items");
  }
  return (
    <>
      <AddFoodDrawer data={data?.foodItems} />
    </>
  );
};

export default AddFood;
