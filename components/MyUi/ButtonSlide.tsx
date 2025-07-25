import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";
import Link from "next/link";

interface ButtonSlideProps {
  icon?: LucideIcon;
  text?: string;
  slideLeft?: boolean;
  type?: "button" | "submit" | "reset";
  link?: string;
  onClick?: () => void;
  className?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: any;
}
const ButtonSlide = ({
  icon = ArrowRight,
  text,
  type = "button",
  slideLeft = false,
  link,
  onClick,
  className = "",
  form,
}: ButtonSlideProps) => {
  const Icon = icon;
  return (
    <Button
      asChild={!!link}
      type={type}
      form={form}
      onClick={onClick}
      className={`form-submit-button px-4 py-5 rounded-2xl font-bold text-base group relative z-10 ${className}`}
    >
      {link ? (
        <Link href={link} className="flex items-center gap-2">
          {slideLeft && <Icon className="form-submit-btn-icon" />}
          {text && <p className="relative z-10 text-foreground">{text}</p>}
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
          {text && <p className="relative z-10 text-foreground ">{text}</p>}
          {!slideLeft && (
            <Icon className="form-submit-btn-icon text-foreground" />
          )}
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
