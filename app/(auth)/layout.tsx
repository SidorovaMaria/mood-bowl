import React, { ReactNode } from "react";
import GoogleSignIn from "@/components/authentication/GoogleSignIn";
import SlidingReviews from "@/components/authentication/SlidignReviews";

const AuthenticationLayout = async ({ children }: { children: ReactNode }) => {
  return (
    <main className="min-h-screen flex flex-col lg:flex-row">
      <div className="flex flex-col lg:w-1/2 bg-backgound justify-center items-center p-12 relative overflow-hidden">
        {/* Decoration? */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary/60 rounded-full blur-xl"></div>
        <div className="absolute bottom-52 right-16 w-24 h-24 bg-accent/60 rounded-full blur-xl"></div>
        <div className="absolute top-3/4 left-1/4 w-16 h-16 bg-accent/50 rounded-full blur-md"></div>

        <div className="max-w-md text-center relative z-10">
          <div className="flex items-center my-10 justify-center">
            <h1 className="font-comforta text-4xl text-center font-bold relative group cursor-pointer">
              M<span className="text-accent font-bold">oo</span>DB
              <span className="text-accent font-bold">ow</span>l
              <span className="absolute top-[58%] text-accent left-14 font-bold text-3xl rotate-90 group-hover:animate-swing">
                )
              </span>
              <span className="absolute bottom-[60%] text-accent right-7 font-bold text-3xl -rotate-90 group-hover:animate-swing">
                )
              </span>
            </h1>
          </div>
          <h2
            className="text-2xl font-bold text-foreground mb-2"
            style={{ fontFamily: "var(--font-comfortaa)" }}
          >
            Welcome to Your Wellness Journey
          </h2>

          <p className="text-foreground/80 text-sm leading-relaxed">
            Ready to feel good inside and out? Join Mood Bowl and start mixing
            mindfulness with your meals — your future self will thank you!
          </p>
        </div>
        <SlidingReviews />
        <h4 className="text-lg capitalize font-bold hidden lg:block">
          What our customers say
        </h4>
      </div>
      <div className="min-w-md md:min-w-xl mx-auto lg:flex-1 rounded-4xl flex flex-col items-center justify-center bg-gradient-to-b from-primary/80 to-accent/80 lg:w-1/2 text-background  p-6 lg:p-12 gap-6 ">
        {children}
        <GoogleSignIn />
      </div>
    </main>
  );
};

export default AuthenticationLayout;
