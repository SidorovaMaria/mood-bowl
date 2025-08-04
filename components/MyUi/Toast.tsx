"use client";
import { AlertCircle, CircleCheckBig } from "lucide-react";
import React from "react";
import { toast as sonnerToast } from "sonner";
interface ToastProps {
  title: string;
  description?: string;
  type?: "default" | "success" | "error" | "warning" | "info";
  button?: {
    label: string;
    onClick: () => void;
  };
}

export function Toast(props: ToastProps) {
  const { title, description, type = "default", button } = props;

  return (
    <div
      className={`flex rounded-lg shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4 py-2 bg-primary capitalize ${
        type === "error" && "bg-gradient-to-r from-red-500 to-primary"
      }
        ${
          type === "success" &&
          "bg-gradient-to-r from-green-500/50 to-accent/50"
        }`}
    >
      <div className="flex flex-1 items-center">
        {type === "success" && (
          <CircleCheckBig className="mr-2 h-6 w-6 text-foreground" />
        )}
        {type === "error" && (
          <AlertCircle className="mr-2 h-6 w-6 text-foreground" />
        )}
        <div className="flex flex-col gap-0.5 w-full">
          <p className="text-sm font-bold text-foreground ">{title}</p>
          <p className="text-xs text-foreground ">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom(() => (
    <Toast
      title={toast.title}
      type={toast.type}
      description={toast.description}
    />
  ));
}
