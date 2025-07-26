"use client";
import React, { use } from "react";
import AddGratitudesForm from "../forms/AddGratitudesForm";
import { Sparkle, Trash2 } from "lucide-react";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { toast } from "sonner";
import { deleteGratitude } from "@/lib/actions/dailydairy.action";
import { useParams } from "next/navigation";
interface Props {
  graditutes: {
    message?: string | undefined;
  }[];
  gradituteGoal: number;
}
const GradiudeCard = ({ graditutes, gradituteGoal }: Props) => {
  const { date } = useParams();
  const [submitMore, setSubmitMore] = React.useState(false);
  const handleDelete = async (messageId: string) => {
    const { success, error } = await deleteGratitude({
      date: new Date(date as string),
      message: messageId,
    });
    if (!success) {
      toast.error("Failed to delete gratitude");
      return;
    }
    toast.success("Gratitude deleted successfully");
    setSubmitMore(false);
  };

  return (
    <aside className="glass-effect p-4 rounded-xl  flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold "> Gratitudes</h3>
        <p className="gradient-bg-to-br text-white px-4 py-2 rounded-md text-sm font-bold">
          {graditutes.length}/{gradituteGoal} today
        </p>
      </div>
      {gradituteGoal > graditutes.length || submitMore ? (
        <div className="mx-4 my-2">
          <AddGratitudesForm stopSubmitting={() => setSubmitMore(false)} />
        </div>
      ) : (
        <div className="text-center">
          <Sparkle className="text-primary fill-accent inline-flex size-10" />
          <h2 className="text-3xl text-gradient font-bold font-baloo py-2 ">
            Hooray!{" "}
          </h2>
          <p className="text-foreground text-sm max-w-[80%] mx-auto">
            You have reached your gratitude goal for today!
            {graditutes.length > gradituteGoal && " And More!"}
          </p>
          <div className="mt-2">
            <ButtonSlide
              text="Add More Anyway"
              className="text-sm py-4.5! border-primary/70! rounded-xl"
              icon={Sparkle}
              slideLeft
              onClick={() => setSubmitMore(true)}
            />
          </div>
        </div>
      )}

      {graditutes.length > 0 && (
        <ul className="pt-4 pl-5 border-t border-primary flex flex-col gap-1 max-h-[180px] overflow-y-scroll ">
          {graditutes.map((gratitude, index) => (
            <li
              key={index}
              className="text-lg font-baloo flex items-center justify-between"
            >
              <p>{gratitude.message}</p>

              <button
                className="group cursor-pointer"
                onClick={() => handleDelete(gratitude.message || "")}
              >
                <Trash2 className="size-4 text-foreground/80 group-hover:text-destructive  group-hover:brightness-125" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
};

export default GradiudeCard;
