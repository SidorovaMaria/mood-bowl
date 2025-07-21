import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, LucideIcon } from "lucide-react";

interface ButtonSlideProps {
  icon?: LucideIcon;
  text: string;
  slideLeft?: boolean;
  type?: "button" | "submit" | "reset";
}
const ButtonSlide = ({
  icon = ArrowRight,
  text,
  type = "button",
  slideLeft = false,
}: ButtonSlideProps) => {
  const Icon = icon;
  return (
    <Button type={type} className="form-submit-button group relative z-10 ">
      <p className="relative z-10 group-hover:text-background">{text}</p>
      <Icon className="form-submit-btn-icon" />
      <div
        className={`${slideLeft ? "form-back-btn-bg" : "form-submit-btn-bg"}`}
      ></div>
    </Button>
  );
};

export default ButtonSlide;
