"use client";
import { SignInSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signInWithCredentials } from "@/lib/actions/auth.actions";

import ButtonSlide from "@/components/MyUi/ButtonSlide";
import Link from "next/link";
import { toast } from "@/components/MyUi/Toast";
const SignIn = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;
  async function handleSignIn(values: z.infer<typeof SignInSchema>) {
    const result = (await signInWithCredentials(values)) as ActionResponse;

    if (result?.success) {
      router.push(`/onboarding/1`);
      toast({
        title: "Sign In Successful",
        description: "You have successfully signed in.",
        type: "success",
      });
    } else {
      toast({
        title: "Sign In Failed",
        description: result?.error?.message || "Please try again.",
        type: "error",
      });
    }
  }

  return (
    <main
      id="main"
      role="main"
      aria-labelledby="sign-in-heading"
      className="flex flex-col gap-6 items-center justify-center w-full "
    >
      <header className="text-center">
        <h1 id="sign-in-heading" className="text-2xl font-bold mb-1">
          Welcome Back
        </h1>
        <p className="font-semibold text-sm">Let’s get you back on track</p>
      </header>
      <Form {...form}>
        <form
          noValidate
          aria-describedby={
            errors.email || errors.password ? "form-errors" : undefined
          }
          onSubmit={handleSubmit(handleSignIn)}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="Welcome back! Type your email"
                    {...field}
                    aria-invalid={!!errors.email}
                    aria-describedby="email-error"
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:font-bold placeholder:text-background/50"
                  />
                </FormControl>
                <FormMessage id="email-error" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bold">Password</FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password to get cozy again"
                    {...field}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:text-background/50"
                  />
                </FormControl>
                <FormMessage id="password-error" />
              </FormItem>
            )}
          />
          <div id="form-errors" aria-live="polite" className="sr-only">
            {errors.email ? "Email field is invalid" : null}
            {errors.password ? "Password field is invalid" : null}
          </div>
          <ButtonSlide
            type="submit"
            text="Sign In"
            aria-busy={isSubmitting}
            aria-disabled={isSubmitting}
            disabled={isSubmitting}
          />
        </form>
      </Form>
      <p className="text-sm font-medium">
        Not a member yet?{" "}
        <Link
          href="/sign-up"
          aria-label="Create a new account on the sign up page"
          className="link text-background  ml-1 font-bold hover:text-accent"
        >
          Sign Up
          <span className="slider" />
        </Link>
      </p>
    </main>
  );
};

export default SignIn;
