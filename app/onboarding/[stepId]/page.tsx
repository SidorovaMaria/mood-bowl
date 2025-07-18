import { auth } from "@/auth";
import { IUserDoc } from "@/database/user.model";
import { getUser } from "@/lib/actions/user.actions";
import { get } from "http";
import { redirect } from "next/navigation";
import React from "react";

const StepForm = async ({ params }: RouteParams) => {
  const { stepId } = await params;
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return <div>Please log in to continue.</div>;
  }
  const { success, error, data } = await getUser({ userId });
  if (!success) {
    return <div>Error: {error?.message || "Failed to fetch user data"}</div>;
  }
  if (!data?.user) {
    return <div>User not found</div>;
  }
  const user: IUserDoc = data.user;
  if (user.isProfileComplete) {
    redirect(`/${user._id}/dashboard`);
  }

  return (
    <div>
      StepForm Number {stepId} for {user.username}
    </div>
  );
};

export default StepForm;
