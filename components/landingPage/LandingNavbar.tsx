"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import { motion } from "motion/react";
import { animate } from "motion";
const LandingNavbar = () => {
  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--color-background)]/90 backdrop-blur-sm border-b border-background-light">
      <div className="container  mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
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
            <div className="w-8 h-8 flex items-center justify-center">
              <Image
                src="/images/icons/happyLogo.png"
                alt="Logo"
                width={120}
                height={120}
                className=""
              />
            </div>
            <span className="text-2xl lg:text-2xl font-bold font-comfortaa cursor-pointer">
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
                    color: "#ffe38d",
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
                    color: "#ffa875",
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
          <nav className="hidden md:flex items-center space-x-8 ">
            <Link href="#features" className="link">
              Features
              <span className="slider" />
            </Link>
            <Link href="#about" className="link">
              About
              <span className="slider" />
            </Link>
            <Link href="#blog" className="link">
              Blog
              <span className="slider" />
            </Link>
          </nav>
          <div className="flex items-center space-x-4 ">
            <button className="text-foreground hover:text-primary transition-colors whitespace-nowrap cursor-pointer hover:font-bold">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-primary to-accent text-background-light px-4 py-2 rounded-full font-bold hover:from-accent hover:to-primary transition-colors whitespace-nowrap cursor-pointer  ease-in-out duration-300 hover:animate-pulse">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
