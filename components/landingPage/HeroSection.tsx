"use client";
import { HeroFeatures } from "@/constants";
import Lenis from "lenis";
import { ArrowRightCircle, Rocket } from "lucide-react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  Variants,
} from "motion/react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode, useEffect, useRef, useState } from "react";

const HeroSection = () => {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0.5, 0.9], ["0%", "100%"]);
  // Animate the image with a subtle parallax and bounce effect as you scroll
  const yBowl = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 1],
    ["200%", "50%", "-80%", "-300%"]
  );
  const yBowlOut = useTransform(
    scrollYProgress,
    [0.5, 0.6, 0.7, 1],
    ["20%", "-100%", "-150%", "-200%"]
  );
  useEffect(() => {
    const lenis = new Lenis({ syncTouch: true });
    let rafId = 0;
    // Use requestAnimationFrame to continuously update the scroll
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <section
      id="hero-section"
      aria-labelledby="hero-heading"
      className="min-h-[120vh] flex items-center justify-center pt-20 pb-10 relative overflow-hidden"
      ref={containerRef}
    >
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-gradient-to-b from-background from-10% to-accent/30"
        style={{
          y: y,
        }}
        aria-hidden="true"
      >
        <motion.div
          className="absolute h-[300px] w-[300px] top-20 opacity-80 max-sm:hidden "
          style={{ y: yBowlOut }}
          aria-hidden="true"
        >
          <Image src="/images/bowl-two.png" alt="Background" fill priority />
        </motion.div>
        <motion.div
          className="absolute h-[300px] w-[300px] opacity-80  left-20 top-80 max-sm:hidden"
          aria-hidden="true"
          style={{ y: yBowl }}
        >
          <Image src="/images/bowl-two.png" alt="Background" fill priority />
        </motion.div>
        <motion.div
          className="absolute h-[300px] w-[300px] opacity-80 right-20 top-80 max-sm:hidden"
          style={{ y: yBowl }}
          aria-hidden="true"
        >
          <Image src="/images/bowl-one.png" alt="Background" fill priority />
        </motion.div>
      </motion.div>
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-6 text-center relative z-10">
        <motion.h1
          id="hero-heading"
          initial="initial"
          animate="animate"
          variants={heroTitle}
          className="text-5xl md:text-6xl font-bold  leading-tight "
        >
          Track Your <br />
          <span className="text-transparent bg-gradient-to-t from-accent to-primary bg-clip-text hover:bg-gradient-to-b duration-300 transition-colors alternate">
            Nutrition{"  "}
          </span>
          &{" "}
          <span className="text-transparent bg-gradient-to-t from-accent to-primary bg-clip-text hover:bg-gradient-to-b duration-300 transition-colors alternate">
            Mood
          </span>
        </motion.h1>
        <motion.p
          id="hero-tagline"
          initial="initial"
          animate="animate"
          variants={heroText}
          className="text-xl md:text-2xl text-foreground max-w-3xl mx-auto leading-relaxed py-4"
        >
          Track your moods, log meals, and capture your thoughts in a simple,
          intuitive diary built for self-awareness and growth.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="bg-gradient-to-b from-primary/90 to-accent/90 opacity-80 hover:opacity-100  font-bold px-6 py-3 rounded-full text-lg mb-6
        transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer shadow-lg group"
        >
          <Link href="/sign-in" aria-describedby="hero-tagline">
            Start Your Journey{" "}
            <ArrowRightCircle
              className="inline group-hover:animate-bounce-right"
              aria-hidden="true"
            />
          </Link>
        </motion.div>

        <motion.ul
          aria-labelledby="features-heading"
          className="grid grid-cols-1  md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          initial="initial"
          animate="animate"
          variants={{
            animate: {
              transition: {
                staggerChildren: 0.4,
              },
            },
          }}
        >
          {HeroFeatures.map((feature, index) => (
            <motion.li key={index} variants={featureVariant}>
              <FeatureHightlight
                coming={feature.coming}
                icon={<feature.icon aria-hidden="true" focusable="false" />}
                title={feature.title}
                text={feature.text}
              />
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};

export default HeroSection;
const heroTitle: Variants = {
  initial: {
    opacity: 0,
    y: -50,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
    },
  },
};
const heroText: Variants = {
  initial: {
    opacity: 0,
    y: -20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2,
      duration: 1,
    },
  },
};

const FeatureHightlight = ({
  icon,
  text,
  title,
  coming = false,
}: {
  icon: ReactNode;
  text: string;
  title: string;
  coming?: boolean;
}) => {
  return (
    <div className="flex flex-col items-center hover:scale-105 transition-transform cursor-pointer group ">
      <div
        className="w-12 h-12 flex items-center justify-center rounded-full mb-4  border-2 border-foreground/80 p-3 "
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold ">{title}</h3>
      <p className="text-foreground text-xs leading-relaxed px-2">{text}</p>
      {coming && (
        <div
          className="mt-4 text-sm font-bold bg-gradient-to-br from-primary to-secondary/80 fontbold px-4 py-2 rounded-xl "
          aria-label="Feature coming soon"
        >
          Coming Soon <Rocket className="inline size-3" aria-hidden="true" />
        </div>
      )}
    </div>
  );
};

const featureVariant: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: "easeInOut",
    },
  },
};
