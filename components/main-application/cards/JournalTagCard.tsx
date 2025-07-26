import { Trash2 } from "lucide-react";
import React from "react";
import { AnimatePresence, motion } from "motion/react";

const JournalTagCard = ({
  tag,
  handleRemove,
}: {
  tag: string;
  handleRemove: (tag: string) => void;
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tag}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="px-3 py-1.5 rounded-md text-base font-bold gradient-bg-to-br flex items-center gap-2.5 opacity-80"
      >
        <p className="">#{tag}</p>
        <button
          onClick={() => handleRemove(tag)}
          className=" hover:text-background cursor-pointer "
        >
          <Trash2 className="size-4" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};

export default JournalTagCard;
