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
    <div className="flex flex-col gap-6 items-center justify-center w-full ">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-1">Create Your Account</h1>
        <p className="font-semibold text-sm ">
          Start your wellness journey today
        </p>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col items-center gap-4 w-full max-w-md"
        >
          <div className="flex items-center gap-5 justify-between w-full">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What should we call you?"
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
              name="username"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pick a fun one (no pressure!)"
                      {...field}
                      className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:text-background/50"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="font-bold">Email</FormLabel>
                <FormControl className="backdrop-blur-xl ">
                  <Input
                    placeholder="Where can we send the good vibes?"
                    {...field}
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:text-background/50"
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
                    placeholder="Shh... your secret ingredient"
                    {...field}
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:text-background/50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem className="w-full ">
                <FormLabel className="font-bold">Confirm Password</FormLabel>
                <FormControl className="backdrop-blur-xl ">
                  <Input
                    type="password"
                    placeholder="Type it again, just to be sure!"
                    {...field}
                    className="no-focus font-bold focus:bg-background-light/10 border-background focus:border-background! ring-0 placeholder:text-xs placeholder:text-background/50"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <ButtonSlide
            type="submit"
            text="Create an Account"
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
    </div>
  );
};

export default SignUpPage;
