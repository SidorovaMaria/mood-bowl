import { auth } from "@/auth";
import { IUserDoc } from "@/database/user.model";
import { getUser } from "@/lib/actions/user.actions";

import { redirect } from "next/navigation";
import React from "react";
import StepForms from "./StepForms";

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
    redirect(`dashboard`);
  }

  return <StepForms stepId={stepId} user={user} />;
};

export default StepForm;
