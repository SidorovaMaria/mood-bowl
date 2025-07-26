import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AsteriskIcon } from "lucide-react";
import React from "react";
import { Path, FieldValues, UseFormReturn } from "react-hook-form";
type CustomSelectProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label: string;
  required?: boolean;
  placeholder?: string;
  customSelectItems?: boolean;
  options?: { value: string; label: string }[];
  children?: React.ReactNode;
  maxHeight?: string;
  className?: string;
};
const CustomSelect = <T extends FieldValues>({
  form,
  name,
  label,
  placeholder,
  options,
  customSelectItems,
  required = false,
  children,
  maxHeight = "max-h-[200px]",
  className = "",
}: CustomSelectProps<T>) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="data-[error=true]:text-secondary!">
            {label}
            {required && (
              <AsteriskIcon className="text-red-500 size-4 relative -left-2 -top-2" />
            )}
          </FormLabel>
          <Select onValueChange={field.onChange} value={field.value}>
            <FormControl>
              <SelectTrigger
                className={`bg-transparent! w-full focus:bg-gradient-to-b from-accent/20 to-background-light! aria-invalid:border-secondary
              font-bold   px-3 py-1.5 outline-none border
              rounded-md border-primary/70 focus:border-primary
              focus:bg-background/50 capitalize! ${className}`}
              >
                <SelectValue
                  placeholder={placeholder}
                  className="text-xs! placeholder:text-xs!"
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              className={`z-[100] ${maxHeight} overflow-y-auto bg-gradient-to-b from-background-light to-primary text-foreground border-primary`}
            >
              {!customSelectItems
                ? options &&
                  options.map((options) => (
                    <SelectItem
                      className="focus:bg-gradient-to-r from-accent/50 to-primary/50 "
                      key={options.value}
                      value={options.value}
                    >
                      {options.label}
                    </SelectItem>
                  ))
                : children}
            </SelectContent>
          </Select>
          <FormMessage className="text-xs text-secondary" />
        </FormItem>
      )}
    />
  );
};

export default CustomSelect;
