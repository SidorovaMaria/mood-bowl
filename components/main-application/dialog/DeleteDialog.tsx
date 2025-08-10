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
import React, { ReactNode } from "react";
interface Props {
  children: ReactNode;
  title: string;
  description: string;
  itemId: string;
  deleteItem: "note" | "gratitude";
}
const DeleteDialog = ({
  children,
  title,
  description,
  itemId,
  deleteItem,
}: Props) => {
  const handleDelete = async () => {
    let success;
    let error;
    if (deleteItem === "note") {
      const { success: successJournal, error: errorJournal } =
        await deleteJournalEntry({
          journalId: itemId,
        });
      success = successJournal;
      error = errorJournal;

      console.log(itemId);
    }
    if (!success) {
      console.log(error);
      toast({
        type: "error",
        title: `Could not delete ${deleteItem}`,
      });
      return;
    }
    toast({
      type: "success",
      title: `${deleteItem} deleted succesfully `,
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
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;
