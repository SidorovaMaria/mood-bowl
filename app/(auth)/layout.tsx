import React, { ReactNode } from "react";


const AuthenticationLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex min-h-screen items-center justify-center lg:flex-row gap-10 flex-col md:gap-14 lg:gap-0 ">
      <header className='flex flex-col items-center justify-center md:gap-6'>
        <h1 className='font-comforta text-3xl text-center font-bold mb-4 relative'>
         M<span className='text-primary font-bold'>oo</span>DB<span className='text-primary font-bold'>ow</span>l
         <span className="absolute top-[58%] text-primary left-12 font-bold text-2xl rotate-90 ">)</span>
          <span className="absolute bottom-[60%] text-primary right-7 font-bold text-2xl -rotate-90 ">)</span>
        </h1>
        <p className="container-text font-bold font-comic-neue">Welcome to Mood Bowl — a mindful space where your emotions, reflections, and daily habits come together. <span className='hidden md:inline'>Track your moods, log meals, and capture your thoughts in a simple, intuitive diary built for self-awareness and growth.</span></p>

      </header>
      <form className='w-full md:max-w-xl px-8 min-h-[50vh] md:px-16 flex'>
        <div className='w-full bg-background-light min-h-full rounded-4xl shadow-[5px_5px_1px] shadow-white/30 p-4 border border-white/30 '>
      {children}
      </div>
      </form>
    </main>
  );
};

export default AuthenticationLayout;
