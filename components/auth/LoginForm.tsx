"use client";

import * as z from "zod";

import Link from "next/link";
import { CardWrapper } from "./CardWrapper";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { LoginSchema } from "@/Schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormError } from "../FormError";
import { FormSuccess } from "../FormSuccess";
import { login } from "@/actions";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";


interface LoginProps {
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
  };


export const LoginForm = ({
      headerLabel ,
      backButtonLabel,
      backButtonHref,
      showSocial
} :  LoginProps) => {

  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [error , setError] = useState<string | undefined>("")
  const [success , setSuccess] = useState<string | undefined>("")
  const [isPending , startTransition] = useTransition()

  const searchParams = useSearchParams();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
  ? "Email already in use with different provider!"
  : "";

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    setError("")
    setSuccess("")


    startTransition(() => {
      login(values).then((data) => {
        if (data?.error) {
          form.reset();
          setError(data.error);
        }

        if (data?.success) {
          form.reset();
          setSuccess(data.success);
        }

        if (data?.twoFactor) {
          setShowTwoFactor(true);
        }
      })
      .catch(() => setError("Something went wrong"));
    })
    
  };
  return (
    <CardWrapper
      headerLabel={headerLabel}
      backButtonLabel={backButtonLabel}
      backButtonHref={backButtonHref}
      showSocial={showSocial}
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
          {!showTwoFactor && (
            <>
                <FormField
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="john.doe@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          disabled={isPending}
                          placeholder="******"
                          type="password"
                        />
                      </FormControl>
                      <Button
                        size="sm"
                        variant="link"
                        asChild
                        className="px-0 font-normal"
                      >
                        <Link href="/auth/reset">
                          Forgot password?
                        </Link>
                      </Button>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                </>
                )}
                 {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Two Factor Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="123456"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
          <FormError message={error || urlError} />
          <FormSuccess message={success} />
          <Button
            type="submit"
            className="w-full bg-blue-800 hover:bg-blue-600"
            disabled={isPending}
          >
            Login
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};