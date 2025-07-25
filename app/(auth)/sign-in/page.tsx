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
import { toast } from "sonner";
import ButtonSlide from "@/components/MyUi/ButtonSlide";
import Link from "next/link";
const SignIn = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  async function handleSignIn(values: z.infer<typeof SignInSchema>) {
    const result = (await signInWithCredentials(values)) as ActionResponse;

    if (result?.success) {
      router.push(`/onboarding/1`);
      toast.success("Welcome back!");
    } else {
      toast.error(
        result?.error?.message || "Something went wrong, please try again."
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 items-center justify-center w-full ">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
        <p className="font-semibold text-sm">Let’s get you back on track</p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSignIn)}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Welcome back! Type your email"
                    {...field}
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:font-bold placeholder:text-background/50"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="font-bold">Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter your password to get cozy again"
                    {...field}
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:text-background/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonSlide type="submit" text="Sign In" />
        </form>
      </Form>
      <p className="text-sm font-medium">
        Not a member yet?{" "}
        <Link
          href="/sign-up"
          className="link text-background  ml-1 font-bold hover:text-accent"
        >
          Sign Up
          <span className="slider" />
        </Link>
      </p>
    </div>
  );
};

export default SignIn;
