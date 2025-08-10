"use client";
import { AppNavigationItems } from "@/constants";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import React from "react";
import Logo from "@/components/myUi/Logo";

const NavBar = () => {
  const pathname = usePathname();
  const { data } = useSession();
  if (!data?.user?.id) {
    return null;
  }

  return (
    <nav className="hidden lg:block fixed top-0 w-full z-50 bg-gradient-to-b from-background to-transparent backdrop-blur-sm ">
      <div className="mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <ul className="flex items-center gap-4">
            {AppNavigationItems.map(({ href, label, icon }) => {
              const Icon = icon;
              const isActive = pathname.includes(`/${href}`);

              return (
                <motion.li initial={false} key={label}>
                  <Link
                    href={`${href}`}
                    className={`group flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300 relative ${
                      isActive && "font-bold! "
                    }`}
                  >
                    <Icon
                      className={`text-lg transition-transform ${
                        isActive ? "scale-110  " : "group-hover:scale-110"
                      }`}
                    />
                    <span className="text-sm group-hover:font-bold">
                      {label}
                    </span>

                    {isActive && (
                      <motion.div
                        initial={false}
                        layoutId="active-pill"
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
      </div>
    </nav>
  );
};

export default NavBar;
