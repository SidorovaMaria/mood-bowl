import { footerLinks } from "@/constants";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-background-light py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center">
              <h4 className="font-comforta text-3xl text-center font-bold relative group cursor-pointer">
                M<span className="text-primary font-bold">oo</span>DB
                <span className="text-primary font-bold">ow</span>l
                <span className="absolute top-[58%] text-primary left-12 font-bold text-2xl rotate-90 group-hover:animate-swing">
                  )
                </span>
                <span className="absolute bottom-[60%] text-primary right-7 font-bold text-2xl -rotate-90 group-hover:animate-swing">
                  )
                </span>
              </h4>
            </div>
            <p className="text-foreground max-w-sm text-sm">
              Mood Bowl helps you reflect, plan, and grow. Whether you&apos;re
              tracking your mood, meals, or both — we&apos;re here to support
              your wellness journey, one mindful choice at a time.
            </p>
          </div>

          {footerLinks.map((section) => {
            return (
              <div key={section.id} className="flex flex-col gap-3">
                <h3 className="text-lg font-bold">{section.title}</h3>
                <ul className="flex flex-col gap-2">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="font-semibold text-sm opacity-80 hover:opacity-100 transition-opacity duration-300 hover:text-accent group"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="border-t border-background pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p
              className="text-foreground/60 mb-4 md:mb-0"
              style={{ fontFamily: "var(--font-comic-neue)" }}
            >
              © 2025 Maria Sidorova
            </p>
            <div className="flex space-x-6">
              <Link
                href="#"
                className="text-[var(--color-foreground)]/60 hover:text-[var(--color-primary)] transition-colors text-sm"
              >
                Example ShowCase website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
