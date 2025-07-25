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

type CustomInputProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  className?: string;
  small?: boolean;
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
              className={`font-bold text-base placeholder:text-foreground/80 
              placeholder:text-sm px-3 py-1.5 outline-none border
              rounded-md border-accent/70 focus:border-accent
              focus:bg-gradient-to-b from-accent/20 to-background-light `}
            />
          </FormControl>
          <FormMessage className="text-xs text-secondary" />
        </FormItem>
      )}
    />
  );
};

export default CustomInput;
