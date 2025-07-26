import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AsteriskIcon } from "lucide-react";
import { z } from "zod";
import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { Path } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { text } from "stream/consumers";

type CustomInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  small?: boolean;
  textArea?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
};
const CustomInput = <T extends FieldValues>({
  form,
  name,
  label,
  required = false,
  type = "text",
  placeholder = "",
  className = "",
  small,
  onKeyDown,
  textArea = false,
}: CustomInputProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={`flex flex-col ${
            small ? "max-w-[100px]" : "max-sm:w-full"
          } ${className}`}
        >
          <FormLabel className="data-[error=true]:text-secondary!">
            {label}
            {required && (
              <AsteriskIcon className="text-red-500 size-4 relative -left-2 -top-2" />
            )}
          </FormLabel>
          <FormControl>
            {textArea ? (
              <textarea
                value={field.value === 0 ? "" : field.value}
                placeholder={placeholder}
                onChange={field.onChange}
                className={`font-bold text-sm placeholder:text-foreground/50 
              placeholder:text-sm px-3 py-1.5 outline-none border
              rounded-md border-primary/70 focus:border-primary
              focus:bg-background/50 min-h-[100px] `}
              />
            ) : (
              <input
                value={field.value === 0 ? "" : field.value}
                type={type}
                placeholder={placeholder}
                onChange={
                  type === "number"
                    ? (e) => field.onChange(Number(e.target.value))
                    : field.onChange
                }
                onKeyDown={onKeyDown}
                className={`font-bold text-base placeholder:text-foreground/50 
              placeholder:text-sm px-3 py-1.5 outline-none border
              rounded-md border-primary/70 focus:border-primary
              focus:bg-background/50`}
              />
            )}
          </FormControl>
          <FormMessage className="text-xs text-secondary" />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
