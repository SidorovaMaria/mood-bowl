"use client";
import React from "react";
import { motion } from "motion/react";
import { features } from "@/constants";
import Image from "next/image";

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20  relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-slideInUp">
          <h2
            className="text-4xl md:text-5xl font-bold mb-6"
            style={{ fontFamily: "var(--font-comfortaa)" }}
          >
            Everything You Need for{" "}
            <span className="gradient-text animate-gradient">Wellness</span>
          </h2>
          <p
            className="text-xl text-[var(--color-foreground)]/80 max-w-3xl mx-auto"
            style={{ fontFamily: "var(--font-comic-neue)" }}
          >
            Our comprehensive platform combines nutrition tracking, mood
            analysis, and lifestyle guidance to help you achieve your health
            goals.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.25,
              },
            },
          }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              data-index={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
              }}
            >
              <div className="mb-6 relative group">
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={feature.image}
                    alt={feature.title}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </div>

              <h3
                className="text-xl font-semibold mb-4 animate-text-reveal"
                style={{ fontFamily: "var(--font-comfortaa)" }}
              >
                {feature.title}
              </h3>

              <p
                className="text-[var(--color-foreground)]/70 leading-relaxed"
                style={{ fontFamily: "var(--font-comic-neue)" }}
              >
                {feature.description}
              </p>

              {/* Enhanced hover effect overlay */}
              <div className="absolute inset-0 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl border-2 border-gradient animate-border-glow"></div>
                <div className="absolute top-4 left-4 w-6 h-6 bg-[var(--color-accent)]/20 rounded-full flex items-center justify-center animate-twinkle">
                  <i className="ri-sparkling-2-line text-xs text-[var(--color-accent)]"></i>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
export default FeaturesSection;
