"use client";
import { Button } from "@/components/ui/button";
import { IUserDoc } from "@/database/user.model";
import { EditUserInfo } from "@/lib/actions/user.actions";

import { EditIcon, SaveIcon, Undo2 } from "lucide-react";

import React, { useState } from "react";
import { toast } from "sonner";

const ProfileInfoEdit = ({
  user,
  label,
  type,
}: {
  user: IUserDoc;
  label: keyof IUserDoc;
  type?: string;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(user[label]);
  const onEdit = () => {
    if (!isEditing) {
      setValue(user[label]);
    }
    setIsEditing(!isEditing);
  };
  const onSave = async () => {
    console.log("Saving changes for:", label, "with value:", value);
    const { success, error } = await EditUserInfo({ user, label, value });
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
        className={`flex items-center rounded-xl pl-4 pr-1 py-1 border border-accent/10 ${
          isEditing
            ? "bg-gradient-to-r from-accent/50 to-accent/10"
            : "bg-background/50"
        } transition-all`}
      >
        {isEditing ? (
          <input
            type={type || "text"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="flex-1 outline-none "
            placeholder={`Enter your ${label}`}
          />
        ) : (
          <p className="text-foreground bg-background/50 flex-1 w-full">
            {label === "birthDate"
              ? new Date(user[label]).toLocaleDateString()
              : label === "email"
              ? user[label]
              : label === "username"
              ? `@${user[label]}`
              : label === "name"
              ? user[label]
              : user[label]}
          </p>
        )}
        <Button
          title={isEditing ? "Cancel" : "Edit"}
          onClick={() => onEdit()}
          className="ml-2 bg-accent/10 text-foreground hover:bg-accent/20 transition-colors cursor-pointer rounded-lg "
        >
          {isEditing ? <Undo2 /> : <EditIcon />}
        </Button>

        {isEditing && value !== user[label] && (
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

export default ProfileInfoEdit;
