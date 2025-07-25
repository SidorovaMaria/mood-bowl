"use client";
import { AppNavigationItems } from "@/constants";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import React from "react";
import { motion } from "motion/react";
import Link from "next/link";
const MobileNavBar = () => {
  const pathname = usePathname();
  const { data } = useSession();
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-background-light to-background backdrop-blur-sm ">
      <div className=" mx-auto px-6 py-2 border-t rounded-t-md">
        <ul className="flex items-center justify-around px-4">
          {AppNavigationItems.map(({ href, label, icon }) => {
            const Icon = icon;
            const isActive = pathname.includes(`/${data?.user?.id}${href}`);
            return (
              <motion.li key={label}>
                <Link
                  href={`/${data?.user?.id}/${href}`}
                  className={`group flex flex-col items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 relative ${
                    isActive && "font-bold! text-background"
                  }`}
                >
                  <Icon
                    className={`size-5 md:text-lg transition-transform ${
                      isActive
                        ? "scale-110 text-background "
                        : "text-foreground/70 group-hover:scale-105"
                    }`}
                  />
                  <span className="text-xs max-sm:hidden">{label}</span>

                  {isActive && (
                    <motion.div
                      layoutId="blur-bg-mobile"
                      className="absolute inset-0 bg-gradient-to-b w-full h-full from-primary to-accent blur-[8px] -z-10 rounded-xl"
                      transition={{
                        type: "spring",
                        stiffness: 250,
                        damping: 20,
                        bounce: 0.25,
                      }}
                    />
                  )}
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default MobileNavBar;
