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
  title,
  preferences,
}: {
  user: IUserDoc;
  title?: string;
  label:
    | keyof IUserDoc
    | keyof IUserDoc["fitnessGoals"]
    | keyof IUserDoc["mentalHealthGoals"]
    | keyof IUserDoc["preferences"];
  type?: string;
  preferences?: "mentalHealthGoals" | "fitnessGoals" | "preferences";
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Helper type guard
  function isUserDocKey(
    key: keyof IUserDoc | keyof IUserDoc["preferences"]
  ): key is keyof IUserDoc {
    return !preferences && typeof key === "string" && key in user;
  }

  const [value, setValue] = useState(
    preferences
      ? (user[preferences] as Record<string, unknown>)?.[
          label as keyof (typeof user)[typeof preferences]
        ]
      : isUserDocKey(label)
      ? user[label]
      : ""
  );
  const onEdit = () => {
    if (!isEditing) {
      if (isUserDocKey(label)) {
        setValue(user[label]);
      } else if (preferences) {
        setValue((user[preferences] as Record<string, unknown>)?.[label]);
      } else {
        setValue("");
      }
    }
    setIsEditing(!isEditing);
  };
  const onSave = async () => {
    const { success, error } = await EditUserInfo({
      user,
      label: preferences
        ? (`${preferences}.${String(label)}` as keyof IUserDoc)
        : (label as keyof IUserDoc),
      value,
    });
    if (!success) {
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
        {title ? title : label}
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
              ? new Date(
                  preferences
                    ? (user[preferences] as Record<string, unknown>)?.[label]
                    : user[label as keyof IUserDoc]
                ).toLocaleDateString()
              : label ===
                ("journalingDayOfTheMonth" as keyof IUserDoc["mentalHealthGoals"])
              ? (() => {
                  const day = preferences
                    ? (user[preferences] as Record<string, unknown>)?.[label]
                    : user[label as keyof IUserDoc];
                  if (typeof day !== "number") return "Not set";
                  const suffix =
                    day === 1
                      ? "st"
                      : day === 2
                      ? "nd"
                      : day === 3
                      ? "rd"
                      : "th";
                  return `${day}${suffix}`;
                })()
              : label ===
                  ("meditationMinutesPerDay" as keyof IUserDoc["mentalHealthGoals"]) ||
                label ===
                  ("gratitudeEntriesPerDay" as keyof IUserDoc["mentalHealthGoals"])
              ? (preferences
                  ? (user[preferences] as Record<string, unknown>)?.[label]
                  : user[label as keyof IUserDoc]) === 0 ||
                (preferences
                  ? (user[preferences] as Record<string, unknown>)?.[label]
                  : user[label as keyof IUserDoc]) === undefined
                ? "Not set"
                : preferences
                ? (user[preferences] as Record<string, unknown>)?.[label]
                : user[label as keyof IUserDoc]
              : label === "email"
              ? preferences
                ? (user[preferences] as Record<string, unknown>)?.[label]
                : user[label as keyof IUserDoc]
              : label === "username"
              ? preferences
                ? `@${(user[preferences] as Record<string, unknown>)?.[label]}`
                : `@${user[label as keyof IUserDoc]}`
              : label === "name"
              ? preferences
                ? (user[preferences] as Record<string, unknown>)?.[label]
                : user[label as keyof IUserDoc]
              : preferences
              ? (user[preferences] as Record<string, unknown>)?.[label]
              : user[label as keyof IUserDoc]}
          </p>
        )}
        <Button
          title={isEditing ? "Cancel" : "Edit"}
          onClick={() => onEdit()}
          className="ml-2 bg-accent/10 text-foreground hover:bg-accent/20 transition-colors cursor-pointer rounded-lg "
        >
          {isEditing ? <Undo2 /> : <EditIcon />}
        </Button>

        {isEditing &&
          value !==
            (preferences
              ? (user[preferences] as Record<string, unknown>)?.[label]
              : user[label as keyof IUserDoc]) && (
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
