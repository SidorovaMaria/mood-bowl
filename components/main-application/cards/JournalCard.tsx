"use client";
import { IJournalEntryDoc } from "@/database/journalEntry.model";
import { format } from "date-fns";
import Image from "next/image";
import React, { useState } from "react";
import JournalTagCard from "./JournalTagCard";
import { NotebookPen, Trash2 } from "lucide-react";
import DeleteDialog from "../dialog/DeleteDialog";

import JournalEntryForm from "../forms/JournalEntryForm";
import { AnimatePresence, motion } from "motion/react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

const JournalCard = ({ journal }: { journal: IJournalEntryDoc }) => {
  const [openEdit, setOpenEdit] = useState(false);
  return (
    <>
      <div className="bg-primary/10 backdrop-blur-sm rounded-xl p-4 border border-foreground/20 shadow-lg hover:shadow-xl flex flex-col gap-4 cursor-pointer">
        {/* Header */}
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2 ">
            <Image
              src={`/images/moods/${journal.moodAtEntry}.png`}
              alt={String(journal.moodAtEntry)}
              width={32}
              height={32}
            />
            <div>
              <h3 className="text-lg font-baloo font-semibold text-foreground">
                {journal.title || "Untitled Entry"}
              </h3>
              <p className="text-xs text-foreground/70">
                {format(journal.createdAt, "MMMM dd, yyyy,• hh:mm a")}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 ml-auto ">
            <button
              onClick={() => setOpenEdit(true)}
              title="Edit Note"
              className="opacity-50 hover:opacity-100 cursor-pointer hover:text-accent hover:scale-110"
            >
              <NotebookPen className="size-5" />
            </button>

            <DeleteDialog
              itemId={String(journal._id)}
              title={`Are you sure you want to delete this note? `}
              description={`This action cannot be undone. The note '${journal.title}' will be permanently removed.`}
              deleteItem="note"
            >
              <button
                title="Delete Note"
                className="opacity-50 hover:opacity-100 hover:text-red-500 cursor-pointer hover:scale-110"
              >
                <Trash2 className="size-5 " />
              </button>
            </DeleteDialog>
          </div>
        </div>
        {/* Header End */}
        {/* Content */}
        <div className="mr-auto ml-2 max-w-[90%] ">
          <p className="text-foreground/80 text-sm line-clamp-3">
            {journal.content}
          </p>
        </div>
        {journal.tags && journal.tags.length > 0 && (
          <div className="flex flex-wrap gap-2.5 place-items-end flex-1">
            {journal.tags.map((tag, index) => (
              <JournalTagCard
                key={index}
                tag={tag}
                className="text-sm py-1! px-2!"
              />
            ))}
          </div>
        )}
      </div>
      <AnimatePresence>
        {/* TODO */}
        {openEdit && (
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="bg-background  border-primary/50 shadow-md shadow-primary">
              <DialogTitle className="font-bold! font-baloo! text-xl">
                Editing {"    "}
                <span className=" text-primary brightness-150 pl-2">
                  &quot;{journal.title}&quot;{" "}
                </span>
              </DialogTitle>
              <JournalEntryForm
                actionType="edit"
                closeJournaling={() => setOpenEdit(false)}
                journal={journal}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </>
  );
};

export default JournalCard;
