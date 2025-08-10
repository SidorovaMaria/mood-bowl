"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useParams } from "next/navigation";
import { Form } from "@/components/ui/form";
import CustomInput from "./ui/CustomInput";
import ButtonSlide from "@/components/myUi/ButtonSlide";
import { NotebookPen } from "lucide-react";
import { addGratitude } from "@/lib/actions/dailydiary.action";
import { toast } from "@/components/myUi/Toast";

const GratitudesSchema = z.object({
  gratitude: z.string().min(1, "Gratitude cannot be empty"),
});

const AddGratitudesForm = ({
  stopSubmitting,
}: {
  stopSubmitting: () => void;
}) => {
  const { date } = useParams();
  const form = useForm({
    resolver: zodResolver(GratitudesSchema),
    defaultValues: {
      gratitude: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof GratitudesSchema>) => {
    const { success, error } = await addGratitude({
      date: new Date(date as string),
      message: values.gratitude,
    });
    if (!success) {
      toast({
        type: "error",
        title: "Failed to add gratitude",
        description: error?.message || "Please try again later.",
      });
    }
    toast({
      type: "success",
      title: "Your gratitude has been recorded.",
    });
    form.reset();
    stopSubmitting();
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col max-md:flex-row max-md:items-end  gap-2 items-center"
      >
        <CustomInput
          name="gratitude"
          form={form}
          label="What are you grateful for today?"
          placeholder="my family, my health, my job..."
          className="w-full "
        />
        <ButtonSlide
          text="Save"
          type="submit"
          className="text-base py-4.5! border-primary/70! rounded-md"
          icon={NotebookPen}
          slideLeft
        />
      </form>
    </Form>
  );
};

export default AddGratitudesForm;
