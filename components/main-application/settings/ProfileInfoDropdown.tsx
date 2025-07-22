"use client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IUserDoc } from "@/database/user.model";
import { EditUserInfo } from "@/lib/actions/user.actions";

import { EditIcon, SaveIcon, Undo2 } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

const ProfileInfoDropdown = ({
  user,
  label,
  optionsLabel,
  options,
}: {
  user: IUserDoc;
  label: keyof IUserDoc;
  options: string[];
  optionsLabel: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedOption, setSelectedOption] = useState(user[label]);
  const onEdit = () => {
    if (!isEditing) {
      setSelectedOption(user[label]);
    }
    setIsEditing(!isEditing);
  };

  const onSave = async () => {
    console.log("Saving changes for:", label, "with value:", selectedOption);
    const { success, error } = await EditUserInfo({
      user,
      label,
      value: selectedOption,
    });
    if (!success) {
      console.log(error);
      toast.error("Failed to update", {
        description: error?.message || "An error occurred while updating.",
      });
    } else {
      toast.success("User information updated successfully.");
      setIsEditing(false);
    }
  };
  return (
    <div className="w-full">
      <label className="pl-2 block text-sm font-semibold text-foreground/80 capitalize ">
        {label}
      </label>
      <div
        className={`flex items-center rounded-xl pl-4 pr-1 py-1  border border-accent/10 ${
          isEditing
            ? "bg-gradient-to-r from-accent/50 to-accent/10"
            : "bg-background/50"
        } transition-all`}
      >
        {isEditing ? (
          <div className="w-full">
            <Select
              onValueChange={(value) => {
                setSelectedOption(value);
              }}
            >
              <SelectTrigger className="capitalize w-full text-left outline-none border-none p-0 ">
                <SelectValue placeholder={selectedOption} />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-background-light to-background text-foreground border-none w-[110%] -left-[5%]">
                <SelectGroup className="">
                  <SelectLabel className="text-foreground/80">
                    {optionsLabel}
                  </SelectLabel>
                  {options.map((option) => (
                    <SelectItem
                      className="focus:bg-accent/50 hover:bg-accent/50! capitalize"
                      key={option}
                      value={option}
                    >
                      {option}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        ) : (
          <p className="text-foreground bg-background/50 flex-1 w-full capitalize">
            {selectedOption}
          </p>
        )}
        <Button
          title={isEditing ? "Cancel" : "Edit"}
          onClick={() => onEdit()}
          className="ml-2 bg-accent/10 text-foreground hover:bg-accent/20 transition-colors cursor-pointer rounded-lg "
        >
          {isEditing ? <Undo2 /> : <EditIcon />}
        </Button>
        {isEditing && selectedOption !== user[label] && (
          <Button
            onClick={onSave}
            title="Save changes"
            className="ml-2 font-bold bg-transparent text-foreground cursor-pointer rounded-lg relative group hover:bg-transparent z-10 border overflow-hidden hover:text-background transition-colors"
          >
            <SaveIcon />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary to-secondary scale-x-0 transition-transform group-hover:scale-x-100 origin-left duration-300 -z-10" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileInfoDropdown;
