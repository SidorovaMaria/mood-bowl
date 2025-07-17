"use client";

import { signIn } from "next-auth/react";
import React from "react";

const SocialAuthForm = () => {
  const buttonClass =
    "background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5";

  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: "/onboarding",
        redirect: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <button className={buttonClass} onClick={() => handleSignIn("google")}>
        <span>Log in with Google</span>
      </button>
    </div>
  );
};

export default SocialAuthForm;
