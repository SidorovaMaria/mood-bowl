import { getRandomMoodResponse } from "@/lib/utils";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import React from "react";

const MoodDiary = ({ params }: { params: { id: string } }) => {
  const today = format(new Date(), "yyyy-MM-dd");
  redirect(`/${params.id}/mood/${today}`);
};

export default MoodDiary;
