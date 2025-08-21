"use client";

import React from "react";
import { SignUpSchema } from "@/lib/validation";
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
import { UserRoundPlus } from "lucide-react";

import Link from "next/link";

import { SignUpWithCredentials } from "@/lib/actions/auth.actions";

import { useRouter } from "next/navigation";
import { IUserDoc } from "@/database/user.model";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import { toast } from "@/components/MyUi/Toast";

const SignUpPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });
  const {
    handleSubmit,
    control,
    formState: { isSubmitting, errors },
  } = form;
  async function onSubmit(values: z.infer<typeof SignUpSchema>) {
    const result = (await SignUpWithCredentials(
      values
    )) as ActionResponse<IUserDoc>;
    if (result?.success) {
      toast({
        title: "Account Created",
        description: "Your account has been created successfully!",
        type: "success",
      });
      if (result.data) {
        router.push(`/onboarding/1`);
      }
    } else {
      toast({
        title: "Error",
        description:
          result?.error?.message || "Something went wrong, please try again.",
        type: "error",
      });
    }
  }
  return (
    <main
      id="main-content"
      role="main"
      aria-labelledby="sign-up-heading"
      className="flex flex-col gap-6 items-center justify-center w-full "
    >
      <header className="text-center">
        <h1 id="sign-up-heading" className="text-2xl font-bold mb-1">
          Create Your Account
        </h1>
        <p className="font-semibold text-sm ">
          Start your wellness journey today
        </p>
      </header>
      <Form {...form}>
        <form
          noValidate
          aria-describedby={
            errors.name ||
            errors.username ||
            errors.email ||
            errors.password ||
            errors.confirmPassword
              ? "form-errors"
              : undefined
          }
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <div className="flex items-center gap-5 justify-between w-full">
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="name">Name</FormLabel>
                  <FormControl>
                    <Input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="What should we call you?"
                      {...field}
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                      className="font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0! placeholder:text-xs placeholder:font-bold placeholder:text-background/50 focus:text-foreground/80"
                    />
                  </FormControl>

                  <FormMessage id="name-error" />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel htmlFor="username">Username</FormLabel>
                  <FormControl>
                    <Input
                      id="username"
                      type="text"
                      autoComplete="username"
                      placeholder="Pick a fun one (no pressure!)"
                      {...field}
                      aria-invalid={!!errors.username}
                      aria-describedby={
                        errors.username ? "error-username" : undefined
                      }
                      className="font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0! placeholder:text-xs placeholder:font-bold placeholder:text-background/50 focus:text-foreground/80"
                    />
                  </FormControl>

                  <FormMessage id="error-username" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="font-bold" htmlFor="email">
                  Email
                </FormLabel>
                <FormControl className="backdrop-blur-xl ">
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Where can we send the good vibes?"
                    {...field}
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "error-email" : undefined}
                    className="font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0! placeholder:text-xs placeholder:font-bold placeholder:text-background/50 focus:text-foreground/80"
                  />
                </FormControl>

                <FormMessage id="error-email" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bold" htmlFor="password">
                  Password
                </FormLabel>
                <FormControl>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Shh... your secret ingredient"
                    {...field}
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "error-password" : undefined
                    }
                    className="font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0! placeholder:text-xs placeholder:font-bold placeholder:text-background/50 focus:text-foreground/80"
                  />
                </FormControl>
                <p
                  id="password-hint"
                  className="text-xs text-muted-background font-semibold"
                >
                  Use at least 8 characters. Mix letters, numbers, and symbols.
                </p>
                <FormMessage id="error-password" />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="font-bold" htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <FormControl className="backdrop-blur-xl ">
                  <Input
                    id="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    placeholder="Type it again, just to be sure!"
                    {...field}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby={
                      errors.confirmPassword
                        ? "error-confirmPassword"
                        : undefined
                    }
                    className="font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0! placeholder:text-xs placeholder:font-bold placeholder:text-background/50 focus:text-foreground/80"
                  />
                </FormControl>
                <FormMessage id="error-confirmPassword" />
              </FormItem>
            )}
          />
          {/* Reader  */}
          <div id="form-errors" aria-live="polite" className="sr-only">
            {errors.name ? "Name field has an error." : null}
            {errors.username ? "Username field has an error." : null}
            {errors.email ? "Email field has an error." : null}
            {errors.password ? "Password field has an error." : null}
            {errors.confirmPassword
              ? "Confirm password field has an error."
              : null}
          </div>
          <ButtonSlide
            className="border-foreground hover:border-transparent"
            type="submit"
            text={isSubmitting ? "Creating…" : "Create an Account"}
            aria-busy={isSubmitting}
            aria-disabled={isSubmitting}
            disabled={isSubmitting}
            icon={UserRoundPlus}
          />
        </form>
      </Form>
      <p className="text-sm font-medium">
        Already have an account?
        <Link
          href="/sign-in"
          className="link text-background  ml-1 font-bold hover:text-accent"
        >
          Sign In
          <span className="slider" />
        </Link>
      </p>
    </main>
  );
};

export default SignUpPage;
