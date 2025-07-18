"use client";
import CompletedReview from "@/components/onboarding/CompletedReview";
import FormStepOne from "@/components/onboarding/FormStepOne";
import FormStepThree from "@/components/onboarding/FormStepThree";
import FormStepTwo from "@/components/onboarding/FormStepTwo";
import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";

const StepForms = ({ stepId }: { stepId: string }) => {
  return (
    <AnimatePresence mode="sync">
      <motion.div
        key={stepId}
        variants={slideVariants}
        initial="enter"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {stepId === "1" && <FormStepOne />}
        {stepId === "2" && <FormStepTwo />}
        {stepId === "3" && <FormStepThree />}
        {stepId === "complete" && <CompletedReview />}
      </motion.div>
    </AnimatePresence>
  );
};

export default StepForms;
const slideVariants = {
  enter: {
    opacity: 0,
    y: -25,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 25,
  },
};
