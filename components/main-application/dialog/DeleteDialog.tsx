"use client";
import { toast } from "@/components/MyUi/Toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteJournalEntry } from "@/lib/actions/journalEntry.action";
import { AlertCircle } from "lucide-react";
import React, { ReactNode, use, useState } from "react";
interface Props {
  children: ReactNode;
  title: string;
  description: string;
  actionBtn: string;
  journalId: string;
}
const DeleteDialog = ({
  children,
  title,
  description,
  actionBtn,
  journalId,
}: Props) => {
  const handleDelete = async () => {
    const { success, error } = await deleteJournalEntry({
      journalId: journalId,
    });
    if (!success) {
      toast({
        type: "error",
        title: "Could not delete note",
      });
      return;
      console.log(error);
    }
    toast({
      type: "success",
      title: "Note delete succesfully ",
    });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-background  border-primary/50 shadow-md shadow-primary">
        <AlertDialogHeader className="">
          <AlertDialogTitle className="capitalize font-baloo font-semibold text-xl">
            <AlertCircle className="inline mr-1 text-red-500" /> {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base font-baloo text-foreground/70 ">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer bg-primary! hover:border-primary  hover:scale-105">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => handleDelete()}
            className="bg-red-500/50! font-bold! cursor-pointer border-1 hover:border-red-500/50 hover:scale-105  "
          >
            {actionBtn}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
