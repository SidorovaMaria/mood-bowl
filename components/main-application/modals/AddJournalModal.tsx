"use client";
import ButtonSlide from "@/components/myUi/ButtonSlide";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkle } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useParams } from "next/navigation";
import React, { ReactNode, useState } from "react";
import JournalEntryForm from "../forms/JournalEntryForm";

const AddJournalModal = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const setCloseModal = (isOpen: boolean) => {
    setOpen(isOpen);
    setShowForm(false);
  };
  const { date } = useParams();
  const [showForm, setShowForm] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setCloseModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent
        className="bg-radial from-50% to-background/10 from-primary/30 border-none rounded-2xl"
        aria-labelledby="add-journal-modal"
      >
        <DialogHeader>
          <DialogTitle
            asChild
            className="text-3xl text-gradient font-semibold font-baloo"
          >
            <h2 className="text-2xl font-baloo text-foreground/80 mb-2  select-none">
              <Sparkle className="inline" /> Your quiet corner awaits…
            </h2>
          </DialogTitle>
          <AnimatePresence mode="wait" initial={false}>
            {showForm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, type: "tween" }}
                className="w-full flex flex-col gap-4"
                key="form"
              >
                <JournalEntryForm
                  actionType="create"
                  closeJournaling={setCloseModal}
                />
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, type: "tween" }}
                key="intro-text"
                className="w-full flex flex-col gap-4"
              >
                <p className="bg-gradient-to-b from-foreground/70 to-secondary text-transparent bg-clip-text text-lg text-center font-medium font-baloo">
                  Take a deep breath and add a moment for future you.
                  <br />
                  Journaling is your personal space — no rules, no judgment.
                  Feel free to write about anything — today’s highs, lows, or
                  simple reflections.
                  <br />! This moment is private, just for you to look back on
                  and grow.
                </p>
                <ButtonSlide
                  text="Start Writing"
                  className="w-fit mx-auto border-primary hover:border-transparent"
                  icon={Sparkle}
                  onClick={() => setShowForm(true)}
                  slideLeft
                />

                <p className="font-bold  font-baloo text-lg text-foreground/80  text-center ">
                  <span className="font-bold">Remember:</span> even a few words
                  can bring clarity and calm.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddJournalModal;
