"use client";

import Link from "next/link";
import React from "react";

import { Button } from "../ui/button";
import { ArrowRightCircle, LogIn } from "lucide-react";
import Logo from "../MyUi/Logo";
import { signOut, useSession } from "next-auth/react";
const LandingNavbar = () => {
  const { data } = useSession();

  return (
    <header className="fixed top-0 w-full z-50 bg-[var(--color-background)]/90 backdrop-blur-sm border-b border-background-light">
      <div className="container  mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Logo imageLogo />
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
          {data?.user?.id ? (
            <div className="flex items-center space-x-4 ">
              <Button
                variant="outline"
                className="bg-gradient-to-r from-primary to-accent text-background-light px-4 py-2 rounded-2xl font-bold whitespace-nowrap cursor-pointer group hover:scale-105"
              >
                <Link
                  href={`${data.user.id}/dashboard`}
                  className="flex items-center gap-2"
                >
                  Back to Profile
                  <LogIn className=" size-4 group-hover:animate-bounce-right" />
                </Link>
              </Button>
              <button
                type="button"
                onClick={() => signOut()}
                className="text-foreground! hover:text-primary transition-colors whitespace-nowrap hover:bg-background! cursor-pointer hover:font-bold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4 ">
              <button
                type="button"
                className="text-foreground! hover:text-primary transition-colors whitespace-nowrap hover:bg-background! cursor-pointer hover:font-bold"
              >
                <Link href="/sign-in">Sign In</Link>
              </button>

              <Button
                variant="outline"
                className="bg-gradient-to-r from-primary to-accent text-background-light px-4 py-2 rounded-2xl font-bold whitespace-nowrap cursor-pointer group hover:scale-105"
              >
                <Link href="/sign-up" className="flex items-center gap-2">
                  Get Started
                  <ArrowRightCircle className=" size-4 group-hover:animate-bounce-right" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default LandingNavbar;
