"use client";

import { CTAitems } from "@/constants";

import { motion } from "motion/react";
import { ArrowRightCircle, SmileIcon } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="py-20 relative overflow-hidden ">
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-4xl mx-auto flex flex-col justify-center gap-6">
          <h2
            className={`text-4xl md:text-5xl font-bold  transition-all duration-1000 `}
          >
            Ready to Transform Your{" "}
            <span className="gradient-text animate-gradient">Lifestyle?</span>
          </h2>
          <p
            className={`text-base text-foreground/80  leading-relaxed transition-all duration-1000`}
          >
            Join thousands of users who have discovered the power of
            understanding their mood and nutrition connection. Start your
            journey to a healthier, happier you today.
          </p>
          <div
            className={`bg-background-light rounded-2xl p-8 relative overflow-hidden transition-all duration-1000`}
            style={{ transitionDelay: "0.6s" }}
          >
            {/* Animated border effect with health icons */}

            <div className="flex items-center justify-center space-x-3 mb-4">
              <h3 className="text-2xl font-semibold animate-text-reveal">
                Sign up to unlock:
              </h3>
            </div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto"
              initial="hidden"
              whileInView="visible"
              viewport={{ amount: 0.3 }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
                hidden: {},
              }}
            >
              {CTAitems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3 group"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <div className="w-8 h-8 flex items-center justify-center p-2 border rounded-full group-hover:text-accent group-hover:translate-y-[-2px] transition-transform duration-150 group-hover:scale-110 ">
                      <Icon />
                    </div>
                    <span className="hover:text-accent transition-colors cursor-pointer">
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>{" "}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 `}
          >
            <Button
              asChild
              variant="ghost"
              className="bg-background-light pl-5! pr-10! py-6! text-base rounded-full font-bold text-foreground transition-all transform hover:scale-105 whitespace-nowrap cursor-pointer relative overflow-hidden group"
            >
              <Link href="/sign-in">
                <span className="relative z-10 group-hover:text-background-light transition-colors duration-300">
                  Create Free Account
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 "></div>

                <SmileIcon className=" size-5 absolute right-4 top-1/2 -translate-y-1/2 group-hover:-translate-y-[250%] transition-transform duration-300 origin-center" />
                <ArrowRightCircle className=" size-5 absolute right-4 top-full group-hover:-translate-y-[175%] transition-transform duration-300 origin-center text-background group-hover:animate-bounce-right" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
