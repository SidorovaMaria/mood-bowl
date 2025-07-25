"use client";
import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
const Logo = ({ fontStyle }: { fontStyle?: string }) => {
  return (
    <Link href="/" className="flex items-center">
      <motion.div
        whileHover="animate"
        initial="initial"
        variants={{
          initial: {
            y: 0,
          },
          animate: {
            y: [0, -10, 0],

            transition: { duration: 0.7, ease: "easeInOut" },
          },
        }}
        animate="initial"
        className="flex items-center cursor-pointer space-x-2"
      >
        <span
          className={`text-2xl lg:text-2xl font-bold font-comfortaa cursor-pointer ${fontStyle}`}
        >
          Moo
          <motion.span
            variants={{
              initial: {
                rotate: 0,
                y: 0,

                transition: { duration: 0.7, ease: "easeInOut" },
              },
              animate: {
                rotate: [0, 180],
                y: [0, -10, -3],
                color: "var(--color-primary)",
                transition: { duration: 0.7, ease: "easeInOut" },
              },
            }}
            className="inline-block"
          >
            D
          </motion.span>
          <motion.span
            variants={{
              initial: {
                y: 0,
                transition: { duration: 0.7, ease: "easeInOut" },
              },
              animate: {
                y: [0, -10, 0],
                color: "#81c5af",
                transition: { duration: 0.7, ease: "easeInOut" },
              },
            }}
            className="inline-block relative z-30"
          >
            B
            <motion.span
              variants={{
                initial: {
                  opacity: 0,
                  transition: { duration: 0.7, ease: "easeInOut" },
                },
                animate: {
                  opacity: 1,
                  transition: { duration: 0.7, ease: "easeInOut" },
                },
              }}
              className="absolute -top-[3%] left-[15%] text-base  -z-10 text-primary"
            >
              •
            </motion.span>
            <motion.span
              variants={{
                initial: {
                  opacity: 0,
                  transition: { duration: 0.7, ease: "easeInOut" },
                },
                animate: {
                  opacity: 1,
                  transition: { duration: 0.7, ease: "easeInOut" },
                },
              }}
              className="absolute top-[22%] left-[15%] text-base  -z-10 text-primary"
            >
              •
            </motion.span>
          </motion.span>
          owL
        </span>
      </motion.div>
    </Link>
  );
};

export default Logo;
