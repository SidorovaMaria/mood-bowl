import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "./ui/CustomInput";
import CustomSelect from "./ui/CustomSelect";
import { MOODS_LIST } from "@/constants";
import { SelectItem } from "@/components/ui/select";
import Image from "next/image";
import JournalTagCard from "../cards/JournalTagCard";
import { BookHeart, Undo2 } from "lucide-react";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import {
  createJournalEntry,
  updateJournalEntry,
} from "@/lib/actions/journalEntry.action";
import { toast } from "@/components/MyUi/Toast";
import { IJournalEntryDoc } from "@/database/journalEntry.model";

const journalEntrySchema = z.object({
  title: z
    .string()
    .min(1, {
      message: "Oops! Please add a title for your note.",
    })
    .max(100, { message: "Lets keep it under 100 characters." }),
  content: z.string().min(1, { message: "Share your thoughts..." }),
  moodEntry: z.string().min(1, { message: "Mood is required." }),
  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Oops! It seems to be empty." })
        .max(20, { message: "Let's keep it under 20 characters." })
    )
    .max(5, {
      message: "You can add up to 5 tags.",
    }),
});

const JournalEntryForm = ({
  closeJournaling,
  journal,
  actionType,
}: {
  closeJournaling: (isOpen: boolean) => void;
  journal?: IJournalEntryDoc;
  actionType: "create" | "edit";
}) => {
  const form = useForm<z.infer<typeof journalEntrySchema>>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      title: journal?.title || "",
      content: journal?.content || "",
      moodEntry: journal?.moodAtEntry || "",
      tags: journal?.tags || [],
    },
  });
  const handleSave = async (values: z.infer<typeof journalEntrySchema>) => {
    if (actionType == "create") {
      const { success, error } = await createJournalEntry({
        title: values.title,
        content: values.content,
        tags: values.tags,
        moodAtEntry: values.moodEntry,
      });

      if (!success) {
        toast({
          title: error?.message || "An unexpected error occurred.",
          type: "error",
        });
      }
      toast({
        title: `${values.title} has been saved!`,
        type: "success",
      });
    } else if (actionType === "edit") {
      if (!journal?._id) {
        throw new Error("Invalid journal ID");
      }
      const { success, error } = await updateJournalEntry({
        journalId: String(journal._id),
        title: values.title,
        content: values.content,
        tags: values.tags,
        moodAtEntry: values.moodEntry,
      });
      if (!success) {
        toast({
          title: error?.message || "An unexpected error occurred.",
          type: "error",
        });
      }
      toast({
        title: `${values.title} has been updated`,
        type: "success",
      });
    }

    closeJournaling(false);
  };

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: { value: string[] }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tagInput = e.currentTarget.value.trim().toLowerCase();
      if (field.value.length >= 5) {
        form.setError("tags", {
          type: "manual",
          message: "You can add up to 5 tags.",
        });
      } else if (
        tagInput &&
        tagInput.length < 15 &&
        !field.value.includes(tagInput)
      ) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length === 0) {
        form.setError("tags", {
          type: "manual",
          message: "Opps! It seems to be empty.",
        });
      } else if (tagInput.length > 20) {
        form.setError("tags", {
          type: "manual",
          message: "Let's keep it under 20 characters.",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tag already exists",
        });
      }
    }
  };
  const handleRemoveTag = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);
    form.setValue("tags", newTags);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSave)}
        className="flex flex-col gap-4"
      >
        <CustomInput
          form={form}
          name="title"
          type="text"
          placeholder="A catchy headline for your moment...”"
          label="Your story’s title"
          required
        />
        <CustomInput
          form={form}
          name="content"
          label="Your words, your world"
          placeholder="Pour your heart out... This is your safe space."
          required
          textArea
        />

        <CustomSelect
          form={form}
          name="moodEntry"
          label="How are you feeling?"
          placeholder="Choose a mood that fits you"
          customSelectItems
          maxHeight="max-h-[250px]"
          className="min-h-12"
        >
          {MOODS_LIST.map((mood) => (
            <SelectItem
              key={mood}
              value={mood}
              className=" capitalize focus:bg-gradient-to-r from-accent/50 to-primary/50 "
            >
              <Image
                src={`/images/moods/${mood}.png`}
                alt={mood}
                width={32}
                height={32}
              />
              {mood}
            </SelectItem>
          ))}
        </CustomSelect>
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full">
              <div className="flex items-center w-full justify-between">
                <FormLabel className="data-[error=true]:text-secondary!">
                  Give your story some sparks
                </FormLabel>
                <FormMessage className=" text-secondary" />
              </div>
              <FormControl>
                <div className="flex flex-col w-full gap-2.5">
                  <input
                    type="text"
                    className="font-bold text-base placeholder:text-foreground/50 placeholder:text-sm px-3 py-1.5 outline-none border rounded-md border-primary/70 focus:border-primary  focus:bg-background/50 w-full"
                    placeholder="Add a tag and press Enter"
                    onKeyDown={(e) => handleTagInputKeyDown(e, field)}
                  />

                  {field.value && field.value.length > 0 && (
                    <div className="flex flex-wrap gap-2.5 px-2">
                      {field?.value?.map((tag: string) => (
                        <JournalTagCard
                          key={tag}
                          tag={tag}
                          handleRemove={() => handleRemoveTag(tag, field)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
            </FormItem>
          )}
        />
        <div className="flex w-full items-center justify-center gap-6">
          <ButtonSlide
            text="Cancel"
            icon={Undo2}
            slideLeft
            type="button"
            onClick={() => closeJournaling(false)}
          />
          <ButtonSlide
            text={actionType === "create" ? "Save" : "Update"}
            icon={BookHeart}
            type="submit"
          />
        </div>
      </form>
    </Form>
  );
};

export default JournalEntryForm;
