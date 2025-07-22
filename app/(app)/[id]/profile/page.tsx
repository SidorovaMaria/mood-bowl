import { auth } from "@/auth";
import ProfileInfoDropdown from "@/components/main-application/settings/ProfileInfoDropdown";
import ProfileInfoEdit from "@/components/main-application/settings/ProfileInfoEdit";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { IUserDoc } from "@/database/user.model";
import { getUser, updateUser } from "@/lib/actions/user.actions";
import { getAgeFromBirthDate } from "@/lib/utils";

import { CircleFadingPlus, KeyRound, UserCircle } from "lucide-react";
import React from "react";

const SettingsUser = async () => {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("User not authenticated");
  }
  const { success, data, error } = await getUser({ userId: session.user.id });
  if (!success || !data) {
    console.error("Failed to fetch user data:", error);
    return <div>Error loading user settings.</div>;
  }
  const user = data.user;

  return (
    <main className="">
      {/* Profile Header */}
      <div className="rounded-t-3xl border border-accent/20 backgrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
            {/* Profile Information */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="relative">
                {user.avatarURL ? null : (
                  <UserCircle className="stroke-1 w-16 h-16 sm:w-20 sm:h-20 rounded-full " />
                )}
                <div className="absolute bottom-0 right-0 w-6 h-6 bg-gradient-to-br from-foreground to-background rounded-full flex items-center justify-center hover:scale-110 cursor-pointer transition-transform group">
                  <CircleFadingPlus className="size-4 group-hover:scale-110 " />
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-1 font-comfortaa">
                  {user.name}
                </h1>
                <p className="text-accent text-base sm:text-lg font-medium">
                  @{user.username}
                </p>
                <p className="text-foreground/60 text-sm">{user.email}</p>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="border p-5 border-accent/20 backgrop-blur-sm">
        <div className="flex items-center space-x-3 mb-5">
          <h2 className="text-xl font-bold text-foreground font-comfortaa">
            Profile Info
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <ProfileInfoEdit user={user} label="name" type="string" />
          <ProfileInfoEdit user={user} label="username" type="string" />
          <ProfileInfoEdit user={user} label="email" type="email" />
          <div className="flex items-end gap-3">
            <ProfileInfoEdit
              user={user}
              label="birthDate"
              type="date"
              title="Date of Birth"
            />
            <p className="text-foreground bg-background/50 rounded-xl px-4 py-2.5 w-1/3 ">
              Age: {getAgeFromBirthDate(user.birthDate)}yrs
            </p>
          </div>
          <ProfileInfoDropdown
            user={user}
            title="Sex"
            optionsLabel="Sex at Birth"
            label="sex"
            options={[
              { value: "female", label: "Female" },
              { value: "male", label: "Male" },
            ]}
          />
          <ButtonSlide
            text="Change Password"
            icon={KeyRound}
            slideLeft
            link="/profile/change-password"
            className="mx-5 opacity-80 hover:opacity-90"
          />
        </div>
      </div>
      {user.preferences.trackMeals && (
        <div className="border p-5 border-accent/20 backgrop-blur-sm">
          <div className="flex items-center space-x-3 mb-5">
            <h2 className="text-xl font-bold text-foreground font-comfortaa">
              Nutrition & Activity
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ProfileInfoEdit
              user={user}
              title="Current Weight"
              label={"currentWeightKg" as keyof IUserDoc["fitnessGoals"]}
              preferences="fitnessGoals"
              type="number"
            />
            <ProfileInfoEdit
              user={user}
              title="Target Weight"
              label={"targetWeightKg" as keyof IUserDoc["fitnessGoals"]}
              preferences="fitnessGoals"
              type="number"
            />
            <ProfileInfoEdit
              user={user}
              title="Height (cm)"
              label={"heightCm" as keyof IUserDoc["fitnessGoals"]}
              preferences="fitnessGoals"
              type="number"
            />
            <ProfileInfoDropdown
              user={user}
              title="Diet Type"
              label={"dietType" as keyof IUserDoc["fitnessGoals"]}
              preferences="fitnessGoals"
              options={[
                { value: "vegan", label: "Vegan" },
                { value: "vegetarian", label: "Vegetarian" },
                { value: "paleo", label: "Paleo" },
                { value: "keto", label: "Keto" },
                { value: "balanced", label: "Balanced" },
              ]}
            />
            <ProfileInfoDropdown
              user={user}
              title="Activity Level"
              label={"activityLevel" as keyof IUserDoc["fitnessGoals"]}
              preferences="fitnessGoals"
              options={[
                { value: "sedentary", label: "Sedentary" },
                { value: "light", label: "Light" },
                { value: "moderate", label: "Moderate" },
                { value: "active", label: "Active" },
                { value: "very_active", label: "Very Active" },
              ]}
            />
            <ProfileInfoDropdown
              user={user}
              title="Goal"
              label={"goal" as keyof IUserDoc["fitnessGoals"]}
              preferences="fitnessGoals"
              options={[
                { value: "maintain", label: "Maintain" },
                { value: "lose", label: "Lose" },
                { value: "gain", label: "Gain" },
              ]}
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default SettingsUser;
