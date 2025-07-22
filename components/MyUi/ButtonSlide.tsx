import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface ButtonSlideProps {
  icon?: LucideIcon;
  text: string;
  slideLeft?: boolean;
  type?: "button" | "submit" | "reset";
  link?: string;
  onClick?: () => void;
  className?: string;
}
const ButtonSlide = ({
  icon = ArrowRight,
  text,
  type = "button",
  slideLeft = false,
  link,
  onClick,
  className = "",
}: ButtonSlideProps) => {
  const Icon = icon;
  return (
    <Button
      asChild={!!link}
      type={type}
      onClick={onClick}
      className={`form-submit-button group relative z-10 ${className}`}
    >
      {link ? (
        <Link href={link} className="flex items-center gap-2">
          {slideLeft && <Icon className="form-submit-btn-icon" />}
          <p className="relative z-10 group-hover:text-background">{text}</p>
          {!slideLeft && <Icon className="form-submit-btn-icon" />}
          <div
            className={`${
              slideLeft ? "form-back-btn-bg" : "form-submit-btn-bg"
            }`}
          ></div>
        </Link>
      ) : (
        <>
          {slideLeft && <Icon className="form-submit-btn-icon" />}
          <p className="relative z-10 group-hover:text-background">{text}</p>
          {!slideLeft && <Icon className="form-submit-btn-icon" />}
          <div
            className={`${
              slideLeft ? "form-back-btn-bg" : "form-submit-btn-bg"
            }`}
          ></div>
        </>
      )}
    </Button>
  );
};

export default ButtonSlide;
