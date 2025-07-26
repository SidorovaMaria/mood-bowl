import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { MOODS_LIST } from "@/constants";
import Image from "next/image";
import { updateDailyMood } from "@/lib/actions/dailydairy.action";
import { useParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

const SelectMoodModal = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = React.useState(false);
  const { date } = useParams();
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="bg-background-light border-foreground/20!">
        <DialogHeader>
          <DialogTitle className="text-3xl text-gradient font-semibold font-baloo">
            How are you feeling today?
          </DialogTitle>
          <DialogDescription className="text-forground/80 text-center text-sm">
            <TriangleAlert className="inline-block mr-1 size-6" /> Hold the mood
            to select it
          </DialogDescription>
          <div className="flex flex-wrap gap-2 gap-x-4 justify-center mt-4">
            {MOODS_LIST.map((mood) => (
              <MoodBadge
                key={mood}
                mood={mood}
                date={date as string}
                close={() => setOpen(false)}
              />
            ))}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SelectMoodModal;
const MoodBadge = ({
  mood,
  close,
  date,
}: {
  mood: string;
  close: () => void;
  date: string;
}) => {
  let holdTimeout: NodeJS.Timeout;
  const handleMouseDown = () => {
    holdTimeout = setTimeout(async () => {
      const { success, error } = await updateDailyMood({
        date: new Date(date),
        mood,
      });
      close();
    }, 1000);
  };

  const handleMouseUp = () => {
    clearTimeout(holdTimeout);
  };
  return (
    <HoverCard key={mood} openDelay={100}>
      <HoverCardTrigger
        onPointerDown={handleMouseDown}
        onPointerUp={handleMouseUp}
        onPointerLeave={handleMouseUp}
        style={{ backgroundColor: `var(--color-${mood})` }}
        className={`capitalize p-1 px-3 rounded-md text-background font-bold cursor-pointer relative group `}
      >
        <p className="relative z-[40] group-active:text-foreground duration-500">
          {mood}
        </p>
        <div className="absolute inset-0 bg-background transform scale-y-0 group-active:scale-y-100 transition-transform origin-top duration-1000"></div>
      </HoverCardTrigger>
      <HoverCardContent
        side="top"
        className="bg-foreground/10 backdrop-blur-[2px] rounded-full shadow-2xl border border-white/10 w-fit aspect-square  overflow-hidden"
      >
        <Image
          src={`/images/moods/${mood}.png`}
          alt={mood}
          width={100}
          height={100}
          className="w-uto h-auto "
        />
      </HoverCardContent>
    </HoverCard>
  );
};
