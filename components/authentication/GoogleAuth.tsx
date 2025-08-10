"use client";
import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

import { signIn } from "next-auth/react";
import { toast } from "../myUi/Toast";

const GoogleAuth = () => {
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: "/onboarding/1",
        redirect: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error + "Failed to sign in with Google. Please try again.",
        type: "error",
      });
    }
    return (
      <div className="flex flex-col w-full gap-1 max-w-md mx-auto ">
        <hr className="w-full  border-background-light/20 " />
        <div className="flex flex-col items-center w-full">
          <p className="lowercase text-sm">Or Continue with</p>
          <Button
            onClick={() => handleSignIn("google")}
            className="cursor-pointer! bg-transparent! hover:bg-foreground/20!  px-4! py-5! text-base! font-bold! rounded-2xl! mt-1 "
          >
            <Image
              src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/google/google-original.svg"
              alt="Google icon"
              width={16}
              height={16}
              className="inline-flex size-5 "
            />
            <p className="">Google</p>
          </Button>
        </div>
      </div>
    );
  };
  return <div>GoogleAuth</div>;
};

export default GoogleAuth;
