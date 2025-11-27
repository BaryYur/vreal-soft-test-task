"use client";

import React from "react";

import Link from "next/link";

import { useForm } from "react-hook-form";

import { routes } from "@/config";

import { useSignIn, useSignUp } from "@/hooks";

import { signUpSchema, SignUpData, SignInData, signInSchema } from "@/schemas";

import { zodResolver } from "@hookform/resolvers/zod";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  Input,
  FormMessage,
  Button,
} from "@/components/ui";

import { LoaderCircle } from "lucide-react";

const formDefaultValues = {
  name: "",
  email: "",
  password: "",
};

interface AuthPageLayoutProps {
  pageType: "sign-in" | "sign-up";
}

const pageInfo = {
  "sign-in": {
    title: "Sign in",
    linkText: "Sign up",
    linkPath: routes.signUp,
  },
  "sign-up": {
    title: "Create an account",
    linkText: "Sign in",
    linkPath: routes.signIn,
  },
} as const;

export const AuthPageLayout: React.FC<AuthPageLayoutProps> = ({ pageType }) => {
  const formConfig = {
    resolver: zodResolver(pageType === "sign-up" ? signUpSchema : signInSchema),
    defaultValues: formDefaultValues,
  };
  const form = useForm<SignUpData | SignInData>(formConfig);

  const { mutate: signUpMutation, isPending: isSignUpPending } = useSignUp();
  const { mutate: signInMutation, isPending: isSignInPending } = useSignIn();

  const handleSubmitAuth = (data: SignInData | SignUpData) => {
    if (pageType === "sign-up") {
      signUpMutation({ ...(data as SignUpData) });
    } else {
      signInMutation({ ...(data as SignInData) });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="min-w-[360px] rounded-2xl bg-white p-7 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitAuth)}>
            <h1 className="text-2xl font-medium">{pageInfo[pageType].title}</h1>

            <div className="mt-4 space-y-2.5">
              {pageType === "sign-up" && (
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="name" className="font-normal">
                        Your name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          id="name"
                          placeholder="Enter your name"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="email" className="font-normal">
                      Your email
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="email"
                        placeholder="Enter your email"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel htmlFor="password" className="font-normal">
                      Your password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isSignUpPending || isSignInPending}
              className="mt-5 w-full"
              size="lg"
            >
              {isSignUpPending || isSignInPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <span>Submit</span>
              )}
            </Button>
          </form>
        </Form>

        <div className="mt-3">
          <Link
            href={pageInfo[pageType].linkPath}
            className="text-sm text-blue-800 underline"
          >
            {pageInfo[pageType].linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};
