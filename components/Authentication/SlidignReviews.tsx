"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { reviewQuotes } from "@/constants";
import Lenis from "lenis";
import { CircleUserRound, Star } from "lucide-react";

const SlidignReviews = () => {
  const [width, setWidth] = useState(450);
  const carousel = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const lenis = new Lenis();

    // Use requestAnimationFrame to continuously update the scroll
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    if (carousel.current) {
      setWidth(carousel.current.scrollWidth - carousel.current.offsetWidth);
    }
  }, [carousel]);
  return (
    <div className="w-full overflow-hidden hidden lg:block">
      <motion.div
        ref={carousel}
        drag="x"
        whileDrag={{ scale: 0.95 }}
        dragElastic={0.2}
        dragConstraints={{ right: 0, left: -width }}
        dragTransition={{ bounceDamping: 30 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="flex  will-change-transform cursor-grab active:cursor-grabbing items-center"
      >
        {reviewQuotes.map((review, index) => {
          return (
            <motion.div
              key={index}
              className="min-w-[21rem] min-h-[15rem] p-2 flex items-center gap-4"
            >
              <div className="bg-background-light p-5 min-w-[300px] min-h-[200px] rounded-xl flex flex-col justify-around">
                <p className="text-foreground italic text-sm ">
                  {review.quote}
                </p>
                <div className="flex items-center gap-2 w-full">
                  <CircleUserRound className="size-8 text-accent" />
                  <div className="flex flex-col">
                    <h3 className="text-accent font-bold">{review.name}</h3>
                    <p className="text-primary text-xs">{review.role}</p>
                  </div>
                  <div className="flex-1 flex justify-end items-center">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="fill-secondary text-transparent size-5"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default SlidignReviews;
